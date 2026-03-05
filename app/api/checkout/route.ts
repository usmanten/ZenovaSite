import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
    const { priceId, quantity = 1 } = await req.json()

    const shippingRate = await stripe.shippingRates.create({
        display_name: "Standard Shipping",
        type: "fixed_amount",
        fixed_amount: { amount: 599, currency: "usd" },
        delivery_estimate: {
            minimum: { unit: "business_day", value: 5 },
            maximum: { unit: "business_day", value: 8 },
        },
    })

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: priceId, quantity }],
        shipping_address_collection: {
            allowed_countries: ["US"],
        },
        shipping_options: [{ shipping_rate: shippingRate.id }],
        phone_number_collection: { enabled: true },
        success_url: `${req.nextUrl.origin}/checkout/success`,
        cancel_url: `${req.nextUrl.origin}/catalog`,
    })

    return NextResponse.json({ url: session.url })
}
