import { describe, expect, it } from "vitest"
import { normalizeEmail, signOptOutToken, verifyOptOutToken } from "./leaderboard-optout"

describe("normalizeEmail", () => {
    it("trims whitespace and lowercases", () => {
        expect(normalizeEmail("  Foo@Bar.com  ")).toBe("foo@bar.com")
    })
})

describe("signOptOutToken / verifyOptOutToken", () => {
    it("verifies a token signed for the same email", () => {
        const token = signOptOutToken("user@example.com")
        expect(verifyOptOutToken("user@example.com", token)).toBe(true)
    })

    it("produces the same token regardless of email casing/whitespace", () => {
        const token = signOptOutToken("user@example.com")
        expect(verifyOptOutToken("  USER@Example.com  ", token)).toBe(true)
    })

    it("rejects a token signed for a different email", () => {
        const token = signOptOutToken("user@example.com")
        expect(verifyOptOutToken("other@example.com", token)).toBe(false)
    })

    it("rejects a tampered token of the same length", () => {
        const token = signOptOutToken("user@example.com")
        const tampered = token.slice(0, -1) + (token.at(-1) === "0" ? "1" : "0")
        expect(verifyOptOutToken("user@example.com", tampered)).toBe(false)
    })

    it("rejects a token of a different length without throwing", () => {
        const token = signOptOutToken("user@example.com")
        expect(() => verifyOptOutToken("user@example.com", token.slice(0, 10))).not.toThrow()
        expect(verifyOptOutToken("user@example.com", token.slice(0, 10))).toBe(false)
        expect(verifyOptOutToken("user@example.com", "")).toBe(false)
    })
})
