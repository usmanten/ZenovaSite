import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { Resend } from "resend"
import { purchaseShippingLabel } from "@/lib/shippo"

const stripeKey = process.env.STRIPE_SECRET_KEY
if (!stripeKey) throw new Error("Missing env var: STRIPE_SECRET_KEY")
const stripe = new Stripe(stripeKey)

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET
if (!webhookSecret) throw new Error("Missing env var: STRIPE_WEBHOOK_SECRET")

// Best-effort deduplication within the same serverless instance lifecycle
const processedSessions = new Set<string>()

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

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session

        // Skip if already processed by this instance
        if (processedSessions.has(session.id)) {
            return NextResponse.json({ received: true })
        }
        processedSessions.add(session.id)

        // Retrieve full session to get shipping and customer details
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ["line_items"],
        })

        const shipping = fullSession.collected_information?.shipping_details
        const customer = fullSession.customer_details
        const qty = fullSession.line_items?.data?.[0]?.quantity ?? 1

        if (!shipping?.address || !customer) {
            const sessionRef = isDev ? session.id : "[redacted]"
            console.error("Missing shipping or customer details for session:", sessionRef)
        } else {
            try {
                const label = await purchaseShippingLabel({
                    toName: shipping.name ?? customer.name ?? "Customer",
                    toStreet1: shipping.address.line1 ?? "",
                    toCity: shipping.address.city ?? "",
                    toState: shipping.address.state ?? "",
                    toZip: shipping.address.postal_code ?? "",
                    toCountry: shipping.address.country ?? "US",
                    toEmail: customer.email ?? "",
                    toPhone: customer.phone ?? undefined,
                    quantity: qty,
                })

                if (isDev) {
                    console.log("Shipping label purchased for session:", session.id)
                    console.log("Carrier:", label.carrier, "|", label.service)
                    console.log("Tracking number:", label.trackingNumber)
                    console.log("Tracking URL:", label.trackingUrl)
                    console.log("Label URL:", label.labelUrl)
                }
            } catch (err) {
                // Log and alert — return 200 so Stripe doesn't retry
                const sessionRef = isDev ? session.id : "[redacted]"
                console.error("Shippo label creation failed for session:", sessionRef, err)

                try {
                    const resend = new Resend(process.env.RESEND_API_KEY)
                    await resend.emails.send({
                        from: "Zenova Alerts <onboarding@resend.dev>",
                        to: "officialzenovastrips@gmail.com",
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
