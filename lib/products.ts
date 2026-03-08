export const PRODUCTS: Record<string, {
    name: string
    bundles: { qty: number; price: number; originalPrice: number }[]
}> = {
    "strawberry-frost": {
        name: "Zenova Power - Strawberry Frost",
        bundles: [
            { qty: 1, price: 1899, originalPrice: 2799 },
            { qty: 2, price: 3599, originalPrice: 5598 },
            { qty: 3, price: 4799, originalPrice: 8397 },
        ],
    },
}
