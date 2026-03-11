import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"
import { purchaseShippingLabel } from "@/lib/shippo"
import { supabase } from "@/lib/supabase"

const stripeKey = process.env.STRIPE_SECRET_KEY
if (!stripeKey) throw new Error("Missing env var: STRIPE_SECRET_KEY")
const stripe = new Stripe(stripeKey)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!
if (!webhookSecret) throw new Error("Missing env var: STRIPE_WEBHOOK_SECRET")

const fromEmail = process.env.RESEND_FROM_EMAIL!
if (!fromEmail) throw new Error("Missing env var: RESEND_FROM_EMAIL")

const adminEmail = process.env.ADMIN_EMAIL!
if (!adminEmail) throw new Error("Missing env var: ADMIN_EMAIL")

const isDev = process.env.NODE_ENV !== "production"

export async function POST(req: NextRequest) {
    const body = await req.text()
    const sig = req.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, sig, webhookSecret)
    } catch {
        return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    if (event.type === "charge.updated") {
        const charge = event.data.object as Stripe.Charge
        const receiptNumber = charge.receipt_number
        const paymentIntent = charge.payment_intent as string | null

        if (receiptNumber && paymentIntent) {
            const { error } = await supabase
                .from("orders")
                .update({ receipt_number: receiptNumber })
                .eq("stripe_payment_intent", paymentIntent)
                .is("receipt_number", null)

            if (error) console.error("Failed to backfill receipt_number:", error.message)
        }
    }

    if (event.type === "charge.refunded") {
        const charge = event.data.object as Stripe.Charge
        const paymentIntent = charge.payment_intent as string

        if (paymentIntent) {
            const { data: order } = await supabase
                .from("orders")
                .select("id, order_quantity")
                .eq("stripe_payment_intent", paymentIntent)
                .maybeSingle()

            if (order) {
                const { error } = await supabase
                    .from("orders")
                    .update({ refunded: true })
                    .eq("id", order.id)

                if (error) {
                    console.error("Failed to mark order as refunded:", error.message)
                } else {
                    const { error: rpcError } = await supabase.rpc("decrement_orders_placed", { qty: order.order_quantity })
                    if (rpcError) console.error("Failed to decrement orders_placed:", rpcError.message)
                }
            }
        }
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session

        // Retrieve full session to get shipping and customer details
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ["line_items"],
        })

        const shipping = fullSession.collected_information?.shipping_details
        const customer = fullSession.customer_details
        const qty = fullSession.line_items?.data?.[0]?.quantity ?? 1

        let receiptNumber: string | null = null
        let receiptUrl: string | null = null
        if (fullSession.payment_intent) {
            const pi = await stripe.paymentIntents.retrieve(
                String(fullSession.payment_intent),
                { expand: ["latest_charge"] }
            )
            const charge = pi.latest_charge as Stripe.Charge | null
            receiptNumber = charge?.receipt_number ?? null
            receiptUrl = charge?.receipt_url ?? null
        }

        // Idempotency check — sole dedup mechanism (works across instances/cold starts)
        const { data: existing } = await supabase
            .from("orders")
            .select("id")
            .eq("stripe_session_id", session.id)
            .maybeSingle()
        if (existing) {
            if (isDev) console.log("Session already processed, skipping:", session.id)
            return NextResponse.json({ received: true })
        }

        if (!shipping?.address || !customer) {
            const sessionRef = isDev ? session.id : "[redacted]"
            console.error("Missing shipping or customer details for session:", sessionRef)
        } else {
            const toName = shipping.name ?? customer.name ?? "Customer"
            const toEmail = customer.email ?? ""
            const toStreet1 = shipping.address.line1 ?? ""
            const toCity = shipping.address.city ?? ""
            const toState = shipping.address.state ?? ""
            const toZip = shipping.address.postal_code ?? ""
            const toCountry = shipping.address.country ?? "US"

            try {
                const productName = fullSession.line_items?.data?.[0]?.description ?? "Power"
                const orderQty = Number(fullSession.metadata?.bundle_qty ?? 1)

                const label = await purchaseShippingLabel({
                    toName,
                    toStreet1,
                    toCity,
                    toState,
                    toZip,
                    toCountry,
                    toEmail,
                    toPhone: customer.phone ?? undefined,
                    quantity: qty,
                    productName: orderQty > 1 ? `${productName} (${orderQty}-Pack)` : productName,
                })

                if (isDev) {
                    console.log("Shipping label purchased for session:", session.id)
                    console.log("Carrier:", label.carrier, "|", label.service)
                    console.log("Tracking number:", label.trackingNumber)
                    console.log("Tracking URL:", label.trackingUrl)
                    console.log("Label URL:", label.labelUrl)
                }

                // ── Save order to database ────────────────────────────────────

                const { error: insertError } = await supabase.from("orders").insert({
                    customer_name: toName,
                    customer_email: toEmail,
                    shipping_address: `${toStreet1}, ${toCity}, ${toState} ${toZip}`,
                    product_name: productName,
                    order_quantity: orderQty,
                    tracking_number: label.trackingNumber,
                    tracking_url: label.trackingUrl,
                    label_url: label.labelUrl,
                    carrier: label.carrier,
                    stripe_session_id: session.id,
                    stripe_payment_intent: String(fullSession.payment_intent ?? ""),
                    stripe_payment_url: fullSession.payment_intent
                        ? `https://dashboard.stripe.com/payments/${String(fullSession.payment_intent)}`
                        : null,
                    receipt_number: receiptNumber,
                    receipt_url: receiptUrl,
                })

                if (insertError) {
                    console.error("Failed to insert order into database:", JSON.stringify(insertError))
                } else {
                    // Atomically increment orders_placed
                    const { error: rpcError } = await supabase.rpc("increment_orders_placed", { qty: orderQty })
                    if (rpcError) console.error("Failed to increment orders_placed:", rpcError.message)
                }
                // ─────────────────────────────────────────────────────────────

            } catch (err) {
                // Log and alert — return 200 so Stripe doesn't retry
                const sessionRef = isDev ? session.id : "[redacted]"
                console.error("Shippo label creation failed for session:", sessionRef, err)

                try {
                    const resend = new Resend(process.env.RESEND_API_KEY)
                    await resend.emails.send({
                        from: fromEmail,
                        to: adminEmail,
                        subject: `[ACTION REQUIRED] Shipping label failed for order ${session.id}`,
                        text: `A payment was completed but the shipping label could not be created.\n\nSession ID: ${session.id}\nError: ${String(err)}\n\nLog in to Shippo and manually create a label for this order.`,
                    })
                } catch (alertErr) {
                    console.error("Failed to send label failure alert email:", alertErr)
                }
            }
        }
    }

    return NextResponse.json({ received: true })
}
