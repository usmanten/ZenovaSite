import { describe, expect, it } from "vitest"
import { clampQuantity, selectCheapestRate } from "./shippo-helpers"

describe("clampQuantity", () => {
    it("defaults to 1 when undefined", () => {
        expect(clampQuantity(undefined)).toBe(1)
    })

    it("clamps 0 and negative values up to 1", () => {
        expect(clampQuantity(0)).toBe(1)
        expect(clampQuantity(-5)).toBe(1)
    })

    it("clamps values above 3 down to 3", () => {
        expect(clampQuantity(4)).toBe(3)
        expect(clampQuantity(100)).toBe(3)
    })

    it("passes through in-range values", () => {
        expect(clampQuantity(1)).toBe(1)
        expect(clampQuantity(2)).toBe(2)
        expect(clampQuantity(3)).toBe(3)
    })
})

describe("selectCheapestRate", () => {
    it("picks the lowest-amount valid rate", () => {
        const rates = [
            { objectId: "r1", amount: "9.50" },
            { objectId: "r2", amount: "4.25" },
            { objectId: "r3", amount: "7.00" },
        ]
        expect(selectCheapestRate(rates).objectId).toBe("r2")
    })

    it("ignores rates with a missing objectId", () => {
        const rates = [
            { objectId: null, amount: "1.00" },
            { objectId: "r2", amount: "4.25" },
        ]
        expect(selectCheapestRate(rates).objectId).toBe("r2")
    })

    it("ignores rates with a non-positive or unparseable amount", () => {
        const rates = [
            { objectId: "r1", amount: "0" },
            { objectId: "r2", amount: "-3" },
            { objectId: "r3", amount: "not-a-number" },
            { objectId: "r4", amount: "5.00" },
        ]
        expect(selectCheapestRate(rates).objectId).toBe("r4")
    })

    it("throws when given an empty rate list", () => {
        expect(() => selectCheapestRate([])).toThrow("No shipping rates returned for this shipment")
    })

    it("throws when no rate survives filtering", () => {
        const rates = [
            { objectId: null, amount: "5.00" },
            { objectId: "r2", amount: "0" },
        ]
        expect(() => selectCheapestRate(rates)).toThrow("Could not determine a valid shipping rate")
    })
})
