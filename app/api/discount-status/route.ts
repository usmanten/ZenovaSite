import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

const baseUrlEnv = process.env.NEXT_PUBLIC_BASE_URL
if (!baseUrlEnv) throw new Error("Missing env var: NEXT_PUBLIC_BASE_URL")

// IP-based rate limit: 30 lookups per IP per hour — generous for normal page-load
// checks, tight enough to make brute-forcing codes through this endpoint impractical.
const rateLimitMap = new Map<string, { count: number; resetAt: number }>()
function isRateLimited(ip: string): boolean {
    const now = Date.now()
    const entry = rateLimitMap.get(ip)
    if (!entry || now > entry.resetAt) {
        rateLimitMap.set(ip, { count: 1, resetAt: now + 60 * 60 * 1000 })
        return false
    }
    if (entry.count >= 30) return true
    entry.count++
    return false
}

export async function GET(req: NextRequest) {
    const origin = req.headers.get("origin") ?? ""
    if (origin !== baseUrlEnv) {
        return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown"
    if (isRateLimited(ip)) {
        return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 })
    }

    const code = req.nextUrl.searchParams.get("code")
    if (!code) {
        return NextResponse.json({ error: "Missing code" }, { status: 400 })
    }

    const { data } = await supabase
        .from("discount_codes")
        .select("used_at")
        .eq("code", code)
        .maybeSingle()

    return NextResponse.json({ used: Boolean(data?.used_at) })
}
