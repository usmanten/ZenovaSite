import { NextRequest, NextResponse } from "next/server"
import Stripe from "stripe"
import { PRODUCTS } from "@/lib/products"
import { supabase } from "@/lib/supabase"

const stripeKey = process.env.STRIPE_SECRET_KEY!
if (!stripeKey) throw new Error("Missing env var: STRIPE_SECRET_KEY")
const stripe = new Stripe(stripeKey)

const shippingRateId = process.env.STRIPE_SHIPPING_RATE_ID!
if (!shippingRateId) throw new Error("Missing env var: STRIPE_SHIPPING_RATE_ID")

const pmcId = process.env.STRIPE_PAYMENT_METHOD_CONFIG_ID!
if (!pmcId) throw new Error("Missing env var: STRIPE_PAYMENT_METHOD_CONFIG_ID")

const baseUrlEnv = process.env.NEXT_PUBLIC_BASE_URL!
if (!baseUrlEnv) throw new Error("Missing env var: NEXT_PUBLIC_BASE_URL")

export async function POST(req: NextRequest) {
    const origin = req.headers.get("origin") ?? ""
    if (origin !== baseUrlEnv) {
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

    // ── Inventory gate ────────────────────────────────────────────────────────
    const { data: inv } = await supabase
        .from("inventory")
        .select("max_orders, orders_placed")
        .eq("id", 1)
        .single()

    if (inv && inv.orders_placed + bundleQty > inv.max_orders) {
        return NextResponse.json({ error: "sold_out" }, { status: 409 })
    }
    // ─────────────────────────────────────────────────────────────────────────

    const productName = bundleQty > 1
        ? `${product.name} (${bundleQty}-Pack)`
        : product.name

    const baseUrl = baseUrlEnv

    const session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_configuration: pmcId,
        line_items: [{
            price_data: {
                currency: "usd",
                product_data: { name: productName, description: product.description ?? undefined },
                unit_amount: bundleOption.price,
            },
            quantity: 1,
        }],
        metadata: { bundle_qty: String(bundleQty) },
        automatic_tax: { enabled: true },
        shipping_address_collection: {
            allowed_countries: ["US"],
        },
        phone_number_collection: { enabled: true },
        consent_collection: {
            terms_of_service: "required",
        },
        custom_text: {
            terms_of_service_acceptance: {
                message: `I agree to the [Terms of Service](${baseUrl}/legal/tos), [Privacy Policy](${baseUrl}/legal/privacy), and [Refund Policy](${baseUrl}/legal/refund).`,
            },
        },
        success_url: `${baseUrl}/checkout/success`,
        cancel_url: `${baseUrl}/catalog`,
    })

    return NextResponse.json({ url: session.url })
}
