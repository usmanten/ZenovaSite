import { NextRequest, NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { verifyOptOutToken, normalizeEmail } from "@/lib/leaderboard-optout"

function renderPage(message: string) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width,initial-scale=1.0" />
<title>Zenova Leaderboard</title>
</head>
<body style="margin:0;background:#FEF4F6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <div style="max-width:420px;margin:15vh auto 0;padding:40px 32px;background:#FFFFFF;border-radius:24px;box-shadow:0 10px 30px rgba(0,0,0,0.08);text-align:center;">
    <p style="margin:0 0 16px;font-weight:800;letter-spacing:-0.02em;color:#000;font-size:20px;">zenova</p>
    <p style="margin:0;color:#3D1F2A;font-size:16px;font-weight:700;line-height:1.5;">${message}</p>
    <a href="/" style="display:inline-block;margin-top:24px;padding:12px 28px;background:#AD5D74;color:#fff;border-radius:999px;font-weight:700;font-size:14px;text-decoration:none;">Back to Zenova</a>
  </div>
</body>
</html>`
}

export async function GET(req: NextRequest) {
    const email = req.nextUrl.searchParams.get("email")
    const token = req.nextUrl.searchParams.get("token")

    if (!email || !token || !verifyOptOutToken(email, token)) {
        return new NextResponse(renderPage("This link is invalid or has expired."), {
            status: 400,
            headers: { "Content-Type": "text/html" },
        })
    }

    const { error } = await supabase
        .from("leaderboard_optouts")
        .upsert({ email: normalizeEmail(email) }, { onConflict: "email" })

    if (error) {
        console.error("Failed to opt out of leaderboard:", error.message)
        return new NextResponse(renderPage("Something went wrong. Please contact support."), {
            status: 500,
            headers: { "Content-Type": "text/html" },
        })
    }

    return new NextResponse(renderPage("You've been removed from the Zenova leaderboard."), {
        status: 200,
        headers: { "Content-Type": "text/html" },
    })
}
