export const STARTING_STRIPS = 72990
export const STRIPS_PER_PACK = 30
// orders_placed in the inventory table as of when this counter launched (72,990 is meant to
// read as the current count at that point) — only orders placed after this baseline decrement it.
export const BASELINE_ORDERS_PLACED = 31

export function computeStripsInventory(ordersPlaced: number | null) {
    const resolvedOrdersPlaced = ordersPlaced ?? BASELINE_ORDERS_PLACED
    const ordersSinceBaseline = Math.max(0, resolvedOrdersPlaced - BASELINE_ORDERS_PLACED)
    const claimed = ordersSinceBaseline * STRIPS_PER_PACK
    const remaining = Math.max(0, STARTING_STRIPS - claimed)

    return { claimed, remaining, total: STARTING_STRIPS }
}
