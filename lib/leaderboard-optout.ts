import crypto from "crypto"

const secret = process.env.LEADERBOARD_OPTOUT_SECRET
if (!secret) throw new Error("Missing env var: LEADERBOARD_OPTOUT_SECRET")

function normalizeEmail(email: string) {
    return email.trim().toLowerCase()
}

export function signOptOutToken(email: string): string {
    return crypto.createHmac("sha256", secret!).update(normalizeEmail(email)).digest("hex")
}

export function verifyOptOutToken(email: string, token: string): boolean {
    const expected = Buffer.from(signOptOutToken(email))
    const provided = Buffer.from(token)
    if (expected.length !== provided.length) return false
    return crypto.timingSafeEqual(expected, provided)
}

export { normalizeEmail }
