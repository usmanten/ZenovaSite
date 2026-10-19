import { describe, expect, it } from "vitest"
import { computeStripsInventory, STARTING_STRIPS, STRIPS_PER_PACK } from "./strips-inventory-math"

describe("computeStripsInventory", () => {
    it("computes claimed/remaining from claimed packs with no manual adjustment", () => {
        const result = computeStripsInventory({ claimedPacks: 10, manualAdjustmentStrips: 0 })
        expect(result.claimed).toBe(10 * STRIPS_PER_PACK)
        expect(result.remaining).toBe(STARTING_STRIPS - 10 * STRIPS_PER_PACK)
        expect(result.total).toBe(STARTING_STRIPS)
    })

    it("returns the full total when nothing has been claimed", () => {
        const result = computeStripsInventory({ claimedPacks: 0, manualAdjustmentStrips: 0 })
        expect(result.claimed).toBe(0)
        expect(result.remaining).toBe(STARTING_STRIPS)
    })

    it("adds a positive manual adjustment on top of claimed packs", () => {
        const result = computeStripsInventory({ claimedPacks: 10, manualAdjustmentStrips: 2000 })
        expect(result.claimed).toBe(10 * STRIPS_PER_PACK + 2000)
        expect(result.remaining).toBe(STARTING_STRIPS - (10 * STRIPS_PER_PACK + 2000))
    })

    it("applies a negative manual adjustment", () => {
        const result = computeStripsInventory({ claimedPacks: 10, manualAdjustmentStrips: -100 })
        expect(result.claimed).toBe(10 * STRIPS_PER_PACK - 100)
    })

    it("floors claimed at 0 even under a large negative manual adjustment", () => {
        const result = computeStripsInventory({ claimedPacks: 1, manualAdjustmentStrips: -1000000 })
        expect(result.claimed).toBe(0)
        expect(result.remaining).toBe(STARTING_STRIPS)
    })

    it("clamps remaining to 0 when claimed exceeds the total", () => {
        const hugePacks = Math.ceil(STARTING_STRIPS / STRIPS_PER_PACK) + 1000
        const result = computeStripsInventory({ claimedPacks: hugePacks, manualAdjustmentStrips: 0 })
        expect(result.remaining).toBe(0)
    })
})
