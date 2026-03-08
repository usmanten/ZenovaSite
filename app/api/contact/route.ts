import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resendKey = process.env.RESEND_API_KEY
if (!resendKey) throw new Error("Missing env var: RESEND_API_KEY")
const resend = new Resend(resendKey)

export async function POST(req: NextRequest) {
    const origin = req.headers.get("origin") ?? ""
    const allowed = process.env.NEXT_PUBLIC_BASE_URL ?? ""
    if (allowed && origin !== allowed) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const body = await req.json()

    const name = String(body.name ?? "").replace(/[\r\n]/g, "").slice(0, 200)
    const email = String(body.email ?? "").replace(/[\r\n]/g, "").slice(0, 200)
    const subject = String(body.subject ?? "").replace(/[\r\n]/g, "").slice(0, 300)
    const message = String(body.message ?? "").slice(0, 5000)

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return NextResponse.json({ error: "Invalid email address." }, { status: 400 })
    }

    const { error } = await resend.emails.send({
        from: "Zenova Contact <onboarding@resend.dev>",
        to: "officialzenovastrips@gmail.com",
        reply_to: email,
        subject: `[Contact] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    })

    if (error) {
        return NextResponse.json({ error: "Failed to send message." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
