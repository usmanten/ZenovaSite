import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

const STARTING_STRIPS = 72990
const STRIPS_PER_PACK = 30
// orders_placed in the inventory table as of when this counter launched (72,990 is meant to
// read as the current count at that point) — only orders placed after this baseline decrement it.
const BASELINE_ORDERS_PLACED = 31

export async function GET() {
    const { data: inv } = await supabase
        .from("inventory")
        .select("orders_placed")
        .eq("id", 1)
        .single()

    const ordersPlaced = inv?.orders_placed ?? BASELINE_ORDERS_PLACED
    const ordersSinceBaseline = Math.max(0, ordersPlaced - BASELINE_ORDERS_PLACED)
    const remaining = Math.max(0, STARTING_STRIPS - ordersSinceBaseline * STRIPS_PER_PACK)

    return NextResponse.json(
        { remaining },
        { headers: { "Cache-Control": "no-store" } }
    )
}
