import { NextResponse } from "next/server"
import { supabase } from "@/lib/supabase"

const STARTING_STRIPS = 72990
const STRIPS_PER_PACK = 30

export async function GET() {
    const { data: inv } = await supabase
        .from("inventory")
        .select("orders_placed")
        .eq("id", 1)
        .single()

    const ordersPlaced = inv?.orders_placed ?? 0
    const remaining = Math.max(0, STARTING_STRIPS - ordersPlaced * STRIPS_PER_PACK)

    return NextResponse.json(
        { remaining },
        { headers: { "Cache-Control": "no-store" } }
    )
}
