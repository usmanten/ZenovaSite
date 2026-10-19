import { supabase } from "@/lib/supabase"
import { computeStripsInventory, STARTING_STRIPS, STRIPS_PER_PACK } from "@/lib/strips-inventory-math"

export { STARTING_STRIPS, STRIPS_PER_PACK }

export async function getStripsInventory() {
    const [{ data: claimedPacks }, { data: inv }] = await Promise.all([
        supabase.rpc("get_claimed_packs"),
        supabase.from("inventory").select("manual_adjustment_strips").eq("id", 1).single(),
    ])

    return computeStripsInventory({
        claimedPacks: claimedPacks ?? 0,
        manualAdjustmentStrips: inv?.manual_adjustment_strips ?? 0,
    })
}
