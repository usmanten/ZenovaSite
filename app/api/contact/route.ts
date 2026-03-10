import { NextRequest, NextResponse } from "next/server"
import { Resend } from "resend"

const resendKey = process.env.RESEND_API_KEY
if (!resendKey) throw new Error("Missing env var: RESEND_API_KEY")
const resend = new Resend(resendKey)

const fromEmail = process.env.RESEND_FROM_EMAIL
if (!fromEmail) throw new Error("Missing env var: RESEND_FROM_EMAIL")

const adminEmail = process.env.ADMIN_EMAIL
if (!adminEmail) throw new Error("Missing env var: ADMIN_EMAIL")

const baseUrlEnv = process.env.NEXT_PUBLIC_BASE_URL
if (!baseUrlEnv) throw new Error("Missing env var: NEXT_PUBLIC_BASE_URL")

// IP-based rate limit: 3 submissions per IP per hour
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
function isRateLimited(ip: string): boolean {
    const now = Date.now()
    const entry = rateLimitMap.get(ip)
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
        return false
    }
    if (entry.count >= 3) return true
    entry.count++
    return false
}

export async function POST(req: NextRequest) {
    const origin = req.headers.get("origin") ?? ""
    if (origin !== baseUrlEnv) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    if (isRateLimited(ip)) {
        return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
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
        from: fromEmail,
        to: adminEmail,
        reply_to: email,
        subject: `[Contact] ${subject}`,
        text: `Name: ${name}\nEmail: ${email}\n\n${message}`,
    })

    if (error) {
        return NextResponse.json({ error: "Failed to send message." }, { status: 500 })
    }

    return NextResponse.json({ success: true })
}
