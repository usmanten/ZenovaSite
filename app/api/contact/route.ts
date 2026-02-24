import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resend = new Resend(process.env.RESEND_API_KEY)

export async function POST(req: NextRequest) {
    const { name, email, subject, message } = await req.json()

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
