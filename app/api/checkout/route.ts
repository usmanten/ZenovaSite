import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(req: NextRequest) {
    const { priceId } = await req.json()

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        line_items: [{ price: priceId, quantity: 1 }],
        shipping_address_collection: {
            allowed_countries: ["US"],
        },
        phone_number_collection: { enabled: true },
        success_url: `${req.nextUrl.origin}/checkout/success`,
        cancel_url: `${req.nextUrl.origin}/catalog`,
    })

    return NextResponse.json({ url: session.url })
}
