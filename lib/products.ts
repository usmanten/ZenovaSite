export const PRODUCTS: Record<string, {
    name: string
    description?: string
    bundles: { qty: number; price: number; originalPrice: number }[]
}> = {
    "strawberry-frost": {
        name: "Zenova Focus - Strawberry Frost",
        description: "50mg caffeine energy strip. Fast-acting, sugar free, no crash. Dissolves in seconds.",
        bundles: [
            { qty: 1, price: 2399, originalPrice: 2799 },
            { qty: 2, price: 4099, originalPrice: 5598 },
            { qty: 3, price: 5299, originalPrice: 8397 },
        ],
    },
}
