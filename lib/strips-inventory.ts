import { supabase } from "@/lib/supabase"
import { computeStripsInventory, STARTING_STRIPS, STRIPS_PER_PACK, BASELINE_ORDERS_PLACED } from "@/lib/strips-inventory-math"

export { STARTING_STRIPS, STRIPS_PER_PACK, BASELINE_ORDERS_PLACED }

export async function getStripsInventory() {
    const { data: inv } = await supabase
        .from("inventory")
        .select("orders_placed")
        .eq("id", 1)
        .single()

    return computeStripsInventory(inv?.orders_placed ?? null)
}
