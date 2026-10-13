export interface ShippoRate {
    objectId?: string | null
    amount?: string | null
    provider?: string | null
    servicelevel?: { name?: string | null } | null
}

export function clampQuantity(quantity: number | undefined): number {
    return Math.max(1, Math.min(3, quantity ?? 1))
}

export function selectCheapestRate<T extends ShippoRate>(rates: T[]): T {
    if (rates.length === 0) {
        throw new Error("No shipping rates returned for this shipment")
    }

    const cheapestRate = rates
        .filter((r) => r.objectId && parseFloat(r.amount ?? "999") > 0)
        .sort((a, b) => parseFloat(a.amount ?? "0") - parseFloat(b.amount ?? "0"))[0]

    if (!cheapestRate?.objectId) {
        throw new Error("Could not determine a valid shipping rate")
    }

    return cheapestRate
}
