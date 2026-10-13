import { describe, expect, it } from "vitest"
import { computeStripsInventory, STARTING_STRIPS, STRIPS_PER_PACK, BASELINE_ORDERS_PLACED } from "./strips-inventory-math"

describe("computeStripsInventory", () => {
    it("falls back to the baseline when ordersPlaced is null", () => {
        expect(computeStripsInventory(null)).toEqual({
            claimed: 0,
            remaining: STARTING_STRIPS,
            total: STARTING_STRIPS,
        })
    })

    it("does not treat 0 as missing (unlike null)", () => {
        const result = computeStripsInventory(0)
        // 0 is below baseline, so it clamps to the same "no orders since baseline" result,
        // but via the clamp path, not the null-fallback path — distinct in behavior/intent.
        expect(result.claimed).toBe(0)
        expect(result.remaining).toBe(STARTING_STRIPS)
    })

    it("clamps claimed to 0 when ordersPlaced is below baseline", () => {
        const result = computeStripsInventory(BASELINE_ORDERS_PLACED - 5)
        expect(result.claimed).toBe(0)
        expect(result.remaining).toBe(STARTING_STRIPS)
    })

    it("returns 0 claimed at exactly the baseline", () => {
        const result = computeStripsInventory(BASELINE_ORDERS_PLACED)
        expect(result.claimed).toBe(0)
        expect(result.remaining).toBe(STARTING_STRIPS)
    })

    it("computes claimed/remaining for orders above baseline", () => {
        const ordersPlaced = BASELINE_ORDERS_PLACED + 10
        const result = computeStripsInventory(ordersPlaced)
        expect(result.claimed).toBe(10 * STRIPS_PER_PACK)
        expect(result.remaining).toBe(STARTING_STRIPS - 10 * STRIPS_PER_PACK)
    })

    it("clamps remaining to 0 when claimed exceeds total strips", () => {
        const hugeOrders = BASELINE_ORDERS_PLACED + Math.ceil(STARTING_STRIPS / STRIPS_PER_PACK) + 100
        const result = computeStripsInventory(hugeOrders)
        expect(result.remaining).toBe(0)
    })
})
