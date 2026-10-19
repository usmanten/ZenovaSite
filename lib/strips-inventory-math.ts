export const STARTING_STRIPS = 90000
export const STRIPS_PER_PACK = 30

export interface StripsInventoryInput {
    claimedPacks: number
    manualAdjustmentStrips: number
}

export function computeStripsInventory({ claimedPacks, manualAdjustmentStrips }: StripsInventoryInput) {
    const claimed = Math.max(0, claimedPacks * STRIPS_PER_PACK + manualAdjustmentStrips)
    const remaining = Math.max(0, STARTING_STRIPS - claimed)

    return { claimed, remaining, total: STARTING_STRIPS }
}
