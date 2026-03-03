import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { purchaseShippingLabel } from "@/lib/shippo"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
    const body = await req.text()
    const sig = req.headers.get("stripe-signature")!

    let event: Stripe.Event

    try {
        event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
    } catch {
        return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 })
    }

    if (event.type === "checkout.session.completed") {
        const session = event.data.object as Stripe.Checkout.Session

        // Retrieve full session to get shipping and customer details
        const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
            expand: ["line_items"],
        })

        const shipping = fullSession.collected_information?.shipping_details
        const customer = fullSession.customer_details

        if (!shipping?.address || !customer) {
            console.error("Missing shipping or customer details for session:", session.id)
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
                })

                console.log("Shipping label purchased for session:", session.id)
                console.log("Carrier:", label.carrier, "|", label.service)
                console.log("Tracking number:", label.trackingNumber)
                console.log("Tracking URL:", label.trackingUrl)
                console.log("Label URL:", label.labelUrl)
            } catch (err) {
                // Log the error but still return 200 so Stripe doesn't retry
                console.error("Shippo label creation failed for session:", session.id, err)
            }
        }
    }

    return NextResponse.json({ received: true })
}
