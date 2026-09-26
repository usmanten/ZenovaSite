import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"
import { supabase } from "@/lib/supabase"

const resendKey = process.env.RESEND_API_KEY
if (!resendKey) throw new Error("Missing env var: RESEND_API_KEY")
const resend = new Resend(resendKey)

// Separate, full-access key used only for Audience/Contacts management —
// the main RESEND_API_KEY above is intentionally restricted to sending-only.
const audienceKey = process.env.RESEND_AUDIENCE_API_KEY
if (!audienceKey) throw new Error("Missing env var: RESEND_AUDIENCE_API_KEY")
const resendAudience = new Resend(audienceKey)

const fromEmail = process.env.RESEND_FROM_EMAIL!
if (!fromEmail) throw new Error("Missing env var: RESEND_FROM_EMAIL")

const audienceId = process.env.RESEND_AUDIENCE_ID!
if (!audienceId) throw new Error("Missing env var: RESEND_AUDIENCE_ID")

const baseUrlEnv = process.env.NEXT_PUBLIC_BASE_URL
if (!baseUrlEnv) throw new Error("Missing env var: NEXT_PUBLIC_BASE_URL")

// Published Resend template: "Zenova — Welcome Discount"
const WELCOME_TEMPLATE_ID = "112f8e99-ef1b-43c5-941d-841863247397"

// IP-based rate limit: 5 submissions per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
function isRateLimited(ip: string): boolean {
    const now = Date.now()
    const entry = rateLimitMap.get(ip)
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
        return false
    }
    if (entry.count >= 5) return true
    entry.count++
    return false
}

function generateCode(): string {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789" // no ambiguous chars (0/O, 1/I)
    let suffix = ""
    for (let i = 0; i < 6; i++) suffix += chars[Math.floor(Math.random() * chars.length)]
    return `ZEN10-${suffix}`
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get("origin") ?? ""
    if (origin !== baseUrlEnv) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    if (isRateLimited(ip)) {
        return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const body = await req.json()
    const rawEmail = String(body.email ?? "").replace(/[\r\n]/g, "").trim().slice(0, 200)

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(rawEmail)) {
        return NextResponse.json({ error: "Invalid email address." }, { status: 400 })
    }

    const email = rawEmail.toLowerCase()

    // Idempotent: if this email already has a code, return it instead of creating a new one
    const { data: existing } = await supabase
        .from("discount_codes")
        .select("code")
        .eq("email", email)
        .maybeSingle()

    if (existing) {
        return NextResponse.json({ code: existing.code })
    }

    // Add to Resend Audience — non-blocking; a failure here shouldn't block the discount code
    try {
        const { error: contactError } = await resendAudience.contacts.create({ email, audienceId })
        if (contactError) console.error("Failed to add contact to Resend audience:", contactError.message)
    } catch (err) {
        console.error("Failed to add contact to Resend audience:", err)
    }

    const code = generateCode()

    const { error: insertError } = await supabase
        .from("discount_codes")
        .insert({ email, code })

    if (insertError) {
        console.error("Failed to insert discount code:", insertError.message)
        return NextResponse.json({ error: "Something went wrong. Please try again." }, { status: 500 })
    }

    try {
        const { error: sendError } = await resend.emails.send({
            from: fromEmail,
            to: email,
            template: {
                id: WELCOME_TEMPLATE_ID,
                variables: { DISCOUNT_CODE: code },
            },
        })
        if (sendError) console.error("Failed to send welcome email:", sendError.message)
    } catch (err) {
        console.error("Failed to send welcome email:", err)
    }

    return NextResponse.json({ code })
}
