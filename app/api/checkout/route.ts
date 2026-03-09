import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { PRODUCTS } from "@/lib/products"

const stripeKey = process.env.STRIPE_SECRET_KEY
if (!stripeKey) throw new Error("Missing env var: STRIPE_SECRET_KEY")
const stripe = new Stripe(stripeKey)

const shippingRateId = process.env.STRIPE_SHIPPING_RATE_ID
if (!shippingRateId) throw new Error("Missing env var: STRIPE_SHIPPING_RATE_ID")

export async function POST(req: NextRequest) {
    const origin = req.headers.get("origin") ?? ""
    const allowed = process.env.NEXT_PUBLIC_BASE_URL ?? ""
    if (allowed && origin !== allowed) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const { slug, bundle } = await req.json()

    const product = PRODUCTS[slug]
    if (!product) {
        return NextResponse.json({ error: "Invalid product" }, { status: 400 })
    }

    const bundleQty = Number(bundle)
    const bundleOption = product.bundles.find(b => b.qty === bundleQty)
    if (!bundleOption) {
        return NextResponse.json({ error: "Invalid bundle" }, { status: 400 })
    }

    const productName = bundleQty > 1
        ? `${product.name} (${bundleQty}-Pack)`
        : product.name

    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL ?? req.nextUrl.origin

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_configuration: "pmc_1T4Te747Zfqv1hj2xBrGpAk4",
        line_items: [{
            price_data: {
                currency: "usd",
                product_data: { name: productName, description: product.description ?? undefined },
                unit_amount: bundleOption.price,
            },
            quantity: 1,
        }],
        shipping_address_collection: {
            allowed_countries: ["US"],
        },
        phone_number_collection: { enabled: true },
        success_url: `${baseUrl}/checkout/success`,
        cancel_url: `${baseUrl}/catalog`,
    })

    return NextResponse.json({ url: session.url })
}
