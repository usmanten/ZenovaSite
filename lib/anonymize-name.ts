const MIN_MASK_CHARS = 2

function mask(word: string) {
    const initial = word[0].toUpperCase()
    const hiddenCount = Math.max(word.length - 1, MIN_MASK_CHARS)
    return initial + "*".repeat(hiddenCount)
}

export function anonymizeName(fullName: string | null | undefined): string {
    const words = (fullName ?? "").trim().split(/\s+/).filter(Boolean)
    if (words.length === 0) return "Anonymous"

    if (words.length === 1) {
        return `${mask(words[0])}.`
    }

    const first = words[0]
    const last = words[words.length - 1]
    return `${mask(first)} ${last[0].toUpperCase()}.`
}
