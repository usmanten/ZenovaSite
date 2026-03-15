import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"
import { purchaseShippingLabel, type ShipmentResult } from "@/lib/shippo"
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

        const orderNumber = session.client_reference_id ?? fullSession.metadata?.order_number ?? null

        let receiptUrl: string | null = null
        if (fullSession.payment_intent) {
            const pi = await stripe.paymentIntents.retrieve(
                String(fullSession.payment_intent),
                { expand: ["latest_charge"] }
            )
            const charge = pi.latest_charge as Stripe.Charge | null
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

            const productName = fullSession.line_items?.data?.[0]?.description ?? "Focus"
            const orderQty = Number(fullSession.metadata?.bundle_qty ?? 1)

            // ── Attempt Shippo label — failure is non-blocking ────────────────
            let label: ShipmentResult | null = null
            try {
                label = await purchaseShippingLabel({
                    toName,
                    toStreet1,
                    toCity,
                    toState,
                    toZip,
                    toCountry,
                    toEmail,
                    toPhone: customer.phone ?? undefined,
                    quantity: orderQty,
                    productName: productName,
                })

                if (isDev) {
                    console.log("Shipping label purchased for session:", session.id)
                    console.log("Carrier:", label.carrier, "|", label.service)
                    console.log("Tracking number:", label.trackingNumber)
                    console.log("Tracking URL:", label.trackingUrl)
                    console.log("Label URL:", label.labelUrl)
                }
            } catch (err) {
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

            // ── Save order to database — always runs regardless of Shippo ─────
            try {
                const { error: insertError } = await supabase.from("orders").insert({
                    customer_name: toName,
                    customer_email: toEmail,
                    shipping_address: `${toStreet1}, ${toCity}, ${toState} ${toZip}`,
                    product_name: productName,
                    order_quantity: orderQty,
                    tracking_number: label?.trackingNumber ?? null,
                    tracking_url: label?.trackingUrl ?? null,
                    label_url: label?.labelUrl ?? null,
                    carrier: label?.carrier ?? null,
                    stripe_session_id: session.id,
                    stripe_payment_intent: fullSession.payment_intent ? String(fullSession.payment_intent) : null,
                    stripe_payment_url: fullSession.payment_intent
                        ? `https://dashboard.stripe.com/payments/${String(fullSession.payment_intent)}`
                        : null,
                    order_number: orderNumber,
                    receipt_url: receiptUrl,
                })

                if (insertError) {
                    console.error("Failed to insert order into database:", JSON.stringify(insertError))
                    try {
                        const resend = new Resend(process.env.RESEND_API_KEY)
                        await resend.emails.send({
                            from: fromEmail,
                            to: adminEmail,
                            subject: `[ACTION REQUIRED] Order not saved for session ${isDev ? session.id : "[redacted]"}`,
                            text: `A payment was completed but the order could not be saved to the database.\n\nSession ID: ${session.id}\nOrder Number: ${orderNumber ?? "unknown"}\nError: ${JSON.stringify(insertError)}\n\nManually record this order in Supabase.`,
                        })
                    } catch (alertErr) {
                        console.error("Failed to send insert failure alert:", alertErr)
                    }
                } else {
                    // Atomically increment orders_placed
                    const { error: rpcError } = await supabase.rpc("increment_orders_placed", { qty: orderQty })
                    if (rpcError) console.error("Failed to increment orders_placed:", rpcError.message)
                }
            } catch (err) {
                console.error("Unexpected error saving order to database:", err)
            }
            // ─────────────────────────────────────────────────────────────────
        }
    }

    return NextResponse.json({ received: true })
}
