import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"
import { getStripsInventory } from "@/lib/strips-inventory"
import { anonymizeName } from "@/lib/anonymize-name"

const LEADERBOARD_LIMIT = 10
// True original starting point (as opposed to the homepage counter's 72,990 baseline-adjusted
// figure, which exists only because historical/offline orders predate full Supabase tracking).
const LEADERBOARD_TOTAL_STRIPS = 100000

type LeaderboardRow = {
    customer_name: string | null
    total_strips: number | string
    total_orders: number | string
}

export async function GET() {
    const [{ data: rows, error }, inventory] = await Promise.all([
        supabase.rpc("get_leaderboard", { limit_count: LEADERBOARD_LIMIT }),
        getStripsInventory(),
    ])

    const claimed = LEADERBOARD_TOTAL_STRIPS - inventory.remaining

    if (error) {
        console.error("Failed to load leaderboard:", error.message)
        return NextResponse.json(
            { entries: [], claimed, remaining: inventory.remaining, total: LEADERBOARD_TOTAL_STRIPS },
            { headers: { "Cache-Control": "no-store" } }
        )
    }

    const entries = ((rows ?? []) as LeaderboardRow[]).map((row, i) => ({
        rank: i + 1,
        name: anonymizeName(row.customer_name),
        strips: Number(row.total_strips),
        orders: Number(row.total_orders),
    }))

    return NextResponse.json(
        { entries, claimed, remaining: inventory.remaining, total: LEADERBOARD_TOTAL_STRIPS },
        { headers: { "Cache-Control": "no-store" } }
    )
}
