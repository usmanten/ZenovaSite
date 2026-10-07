import { supabase } from "@/lib/supabase"

export const STARTING_STRIPS = 72990
export const STRIPS_PER_PACK = 30
// orders_placed in the inventory table as of when this counter launched (72,990 is meant to
// read as the current count at that point) — only orders placed after this baseline decrement it.
export const BASELINE_ORDERS_PLACED = 31

export async function getStripsInventory() {
    const { data: inv } = await supabase
        .from("inventory")
        .select("orders_placed")
        .eq("id", 1)
        .single()

    const ordersPlaced = inv?.orders_placed ?? BASELINE_ORDERS_PLACED
    const ordersSinceBaseline = Math.max(0, ordersPlaced - BASELINE_ORDERS_PLACED)
    const claimed = ordersSinceBaseline * STRIPS_PER_PACK
    const remaining = Math.max(0, STARTING_STRIPS - claimed)

    return { claimed, remaining, total: STARTING_STRIPS }
}
