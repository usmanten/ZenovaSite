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

                // ── Send tracking email to customer ───────────────────────────
                try {
                    const resend = new Resend(process.env.RESEND_API_KEY)
                    const firstName = toName.split(" ")[0]
                    await resend.emails.send({
                        from: fromEmail,
                        to: toEmail,
                        subject: `Your Zenova order is on its way!`,
                        html: `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1.0" /></head>
<body style="margin:0;padding:0;background:#0a0a0a;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#0a0a0a;padding:48px 16px;">
<tr><td align="center">
<table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

  <!-- Logo -->
  <tr><td align="center" style="padding-bottom:40px;">
    <span style="font-size:22px;font-weight:900;letter-spacing:-0.03em;color:#ffffff;">zenova<span style="font-size:11px;vertical-align:super;font-weight:700;">™</span></span>
    <span style="display:block;font-size:9px;font-weight:600;letter-spacing:0.4em;text-transform:uppercase;color:rgba(255,255,255,0.3);margin-top:2px;">strips</span>
  </td></tr>

  <!-- Hero card -->
  <tr><td style="background:linear-gradient(135deg,#1a0a0e 0%,#120008 50%,#0d0d0d 100%);border-radius:20px;border:1px solid rgba(255,77,109,0.15);overflow:hidden;">
    <div style="height:2px;background:linear-gradient(90deg,transparent,#FF4D6D,transparent);"></div>
    <table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 40px 36px;">

      <!-- Status pill -->
      <tr><td style="padding-bottom:28px;">
        <span style="display:inline-block;background:rgba(255,77,109,0.12);border:1px solid rgba(255,77,109,0.25);border-radius:100px;padding:6px 14px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#FF4D6D;">
          &#9679;&nbsp; On Its Way
        </span>
      </td></tr>

      <!-- Headline -->
      <tr><td style="padding-bottom:12px;">
        <h1 style="margin:0;font-size:32px;font-weight:900;letter-spacing:-0.03em;line-height:1.1;color:#ffffff;">
          Your order<br/><span style="color:#FF4D6D;">shipped,</span> ${firstName}!
        </h1>
      </td></tr>

      <!-- Subtext -->
      <tr><td style="padding-bottom:36px;">
        <p style="margin:0;font-size:14px;color:#ffffff;line-height:1.6;">
          Your Zenova Focus strips are on their way. Here's everything you need to track your package.
        </p>
      </td></tr>

      <!-- Tracking card -->
      <tr><td style="padding-bottom:32px;">
        <table width="100%" cellpadding="0" cellspacing="0" style="background:rgba(255,255,255,0.04);border:1px solid rgba(255,255,255,0.08);border-radius:14px;">
          <tr><td style="padding:24px;">
            <table width="100%" cellpadding="0" cellspacing="0">
              <tr>
                <td style="width:55%;padding-right:16px;border-right:1px solid rgba(255,255,255,0.07);">
                  <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#ffffff;">Tracking Number</p>
                  <p style="margin:0;font-size:13px;font-weight:700;color:#ffffff;font-family:monospace;letter-spacing:0.03em;word-break:break-all;">${label.trackingNumber}</p>
                </td>
                <td style="padding-left:20px;">
                  <p style="margin:0 0 6px;font-size:10px;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:#ffffff;">Carrier</p>
                  <p style="margin:0;font-size:15px;font-weight:700;color:#ffffff;">${label.carrier}</p>
                </td>
              </tr>
            </table>
          </td></tr>
        </table>
      </td></tr>

      <!-- CTA -->
      <tr><td>
        <a href="${label.trackingUrl}" style="display:block;text-align:center;background:linear-gradient(135deg,#FF4D6D,#d63a58);color:#ffffff;font-size:13px;font-weight:800;letter-spacing:0.08em;text-transform:uppercase;text-decoration:none;padding:16px 32px;border-radius:100px;">
          Track My Package &rarr;
        </a>
      </td></tr>

    </table>
  </td></tr>

  <!-- Divider -->
  <tr><td style="padding:36px 0 28px;"><div style="height:1px;background:rgba(255,255,255,0.06);"></div></td></tr>

  <!-- Estimated delivery -->
  <tr><td align="center">
    <p style="margin:0 0 4px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#ffffff;">Estimated Delivery</p>
    <p style="margin:0;font-size:13px;font-weight:600;color:#ffffff;">3–5 Business Days</p>
  </td></tr>

  <!-- Divider -->
  <tr><td style="padding:28px 0 32px;"><div style="height:1px;background:rgba(255,255,255,0.06);"></div></td></tr>

  <!-- Footer -->
  <tr><td align="center">
    <p style="margin:0 0 12px;font-size:12px;color:#ffffff;">
      Questions? <a href="https://zenovastrips.com/contact" style="color:#FF4D6D;text-decoration:none;">Contact us</a>
    </p>
    <p style="margin:0;font-size:11px;color:#ffffff;">&copy; 2026 Zenova Strips &mdash; zenovastrips.com</p>
  </td></tr>

</table>
</td></tr>
</table>
</body>
</html>`,
                    })
                } catch (emailErr) {
                    console.error("Failed to send tracking email to customer:", emailErr)
                    try {
                        const resend = new Resend(process.env.RESEND_API_KEY)
                        await resend.emails.send({
                            from: fromEmail,
                            to: adminEmail,
                            subject: `[ACTION REQUIRED] Tracking email failed for order ${session.id}`,
                            text: `A shipping label was created but the tracking email could not be sent to the customer.\n\nSession ID: ${session.id}\nCustomer Email: ${toEmail}\nTracking Number: ${label.trackingNumber}\nTracking URL: ${label.trackingUrl}\nError: ${String(emailErr)}\n\nPlease manually send the customer their tracking information.`,
                        })
                    } catch (alertErr) {
                        console.error("Failed to send tracking email failure alert:", alertErr)
                    }
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
