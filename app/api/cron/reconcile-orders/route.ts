import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"
import { supabase } from "@/lib/supabase"

const stripeKey = process.env.STRIPE_SECRET_KEY!
if (!stripeKey) throw new Error("Missing env var: STRIPE_SECRET_KEY")
const stripe = new Stripe(stripeKey)

const cronSecret = process.env.CRON_SECRET!
if (!cronSecret) throw new Error("Missing env var: CRON_SECRET")

const fromEmail = process.env.RESEND_FROM_EMAIL!
if (!fromEmail) throw new Error("Missing env var: RESEND_FROM_EMAIL")

const adminEmail = process.env.ADMIN_EMAIL!
if (!adminEmail) throw new Error("Missing env var: ADMIN_EMAIL")

const LOOKBACK_SECONDS = 60 * 60 * 24

// Read-only, alert-only reconciliation: the public strips-remaining/leaderboard numbers
// are always derived live from the `orders` table (see lib/strips-inventory.ts), so there's
// no counter left to drift. The one remaining gap is an order whose Stripe webhook never
// made it into `orders` at all (e.g. a Vercel outage before the request was even received) —
// that's what this checks for, by cross-referencing Stripe's own event log against the
// orders table. Never inserts or corrects anything itself.
export async function GET(req: NextRequest) {
    const authHeader = req.headers.get("authorization")
    if (authHeader !== `Bearer ${cronSecret}`) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const sinceUnix = Math.floor(Date.now() / 1000) - LOOKBACK_SECONDS

    const events = await stripe.events.list({
        type: "checkout.session.completed",
        created: { gte: sinceUnix },
        limit: 100,
    })

    const sessionIds = events.data.map((e) => (e.data.object as Stripe.Checkout.Session).id)

    if (sessionIds.length === 0) {
        return NextResponse.json({ checked: 0, missing: [] })
    }

    const { data: existingOrders, error } = await supabase
        .from("orders")
        .select("stripe_session_id")
        .in("stripe_session_id", sessionIds)

    if (error) {
        console.error("Reconciliation query failed:", error.message)
        return NextResponse.json({ error: "Reconciliation query failed" }, { status: 500 })
    }

    const existingIds = new Set((existingOrders ?? []).map((o) => o.stripe_session_id))
    const missing = sessionIds.filter((id) => !existingIds.has(id))

    if (missing.length > 0) {
        try {
            const resend = new Resend(process.env.RESEND_API_KEY)
            await resend.emails.send({
                from: fromEmail,
                to: adminEmail,
                subject: `[ACTION REQUIRED] ${missing.length} Stripe order(s) missing from database`,
                text: `The nightly reconciliation check found ${missing.length} completed Stripe checkout session(s) from the last 24h with no matching row in the orders table:\n\n${missing.join("\n")}\n\nThese orders were likely never recorded due to a webhook failure. Check the Stripe dashboard for each session and manually record the order if the payment succeeded.`,
            })
        } catch (alertErr) {
            console.error("Failed to send reconciliation alert email:", alertErr)
        }
    }

    return NextResponse.json({ checked: sessionIds.length, missing })
}
