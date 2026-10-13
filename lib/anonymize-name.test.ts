import { describe, expect, it } from "vitest"
import { anonymizeName } from "./anonymize-name"

describe("anonymizeName", () => {
    it("returns 'Anonymous' for null, undefined, empty, or whitespace-only input", () => {
        expect(anonymizeName(null)).toBe("Anonymous")
        expect(anonymizeName(undefined)).toBe("Anonymous")
        expect(anonymizeName("")).toBe("Anonymous")
        expect(anonymizeName("   ")).toBe("Anonymous")
    })

    it("masks a single-word name", () => {
        expect(anonymizeName("Madonna")).toBe("M******.")
    })

    it("masks a multi-word name, keeping only first and last initials", () => {
        expect(anonymizeName("John Middle Doe")).toBe("J*** D.")
    })

    it("normalizes irregular whitespace", () => {
        expect(anonymizeName("  John   Doe  ")).toBe(anonymizeName("John Doe"))
    })

    it("capitalizes the visible initial regardless of input case", () => {
        expect(anonymizeName("john doe")).toBe("J*** D.")
    })

    it("floors the mask length at MIN_MASK_CHARS for short words", () => {
        // "Jo" has 1 char after the initial, but the mask floor is 2
        expect(anonymizeName("Jo Smith")).toBe("J** S.")
    })

    it("handles a single-character name", () => {
        expect(anonymizeName("J")).toBe("J**.")
    })
})
