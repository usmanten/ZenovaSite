// Shared product data for the Shop page — used by both the catalog page itself
// and any hero variant components that need product info (photo, price, etc).

export const products = [
    {
        number: "01",
        nameLines: ["Energy + Focus"],
        flavor: "Strawberry Frost",
        category: "ENERGY",
        type: "Caffeine Strip",
        tagline: "50mg of clean caffeine. Zero crash. Zero sugar.",
        description:
            "Our flagship energy strip dissolves in seconds and kicks in fast. Crisp strawberry flavor, no jitters, no crash. Just clean, focused energy when you need it most.",
        badges: ["50mg Caffeine", "Sugar Free", "Gluten Free", "Vegan", "No Artificial Colors", "Made in USA", "30 Strips / Pack"],
        accent: "#E63757",
        darkBg: "#0d0004",
        available: true,
        slug: "strawberry-frost",
        bundles: [
            { qty: 1, days: 30, price: "$23.99", originalPrice: "$27.99", perPack: null,         perStrip: "$0.80/strip", pctOff: "14% off", badge: null },
            { qty: 2, days: 60, price: "$40.99", originalPrice: "$55.98", perPack: "$20.50/pack", perStrip: "$0.68/strip", pctOff: "27% off", badge: "Most Popular" },
            { qty: 3, days: 90, price: "$52.99", originalPrice: "$83.97", perPack: "$17.66/pack", perStrip: "$0.59/strip", pctOff: "37% off", badge: "Best Value" },
        ],
    },
    {
        number: "02",
        nameLines: ["Dream"],
        category: "SLEEP",
        type: "Melatonin Strip",
        tagline: "Fall asleep faster. Wake up refreshed.",
        description:
            "3mg of fast-dissolving melatonin in a strip that works before your head hits the pillow. Formulated for quality sleep without the grogginess you get from pills.",
        badges: ["3mg Melatonin", "Sugar Free", "Gluten Free", "Vegan", "Non-Habit Forming", "Made in USA", "30 Strips / Pack"],
        accent: "#8B5CF6",
        darkBg: "#05010d",
        available: false,
    },
    {
        number: "03",
        nameLines: ["Glow"],
        category: "BEAUTY",
        type: "Beauty Strip",
        tagline: "Collagen, biotin & hyaluronic acid. All in one strip.",
        description:
            "Your entire daily beauty routine, simplified into a single strip. Zenova Glow delivers premium skin and hair nutrients sublingually for maximum bioavailability.",
        badges: ["Collagen Peptides", "Biotin 5000mcg", "Hyaluronic Acid", "Gluten Free", "Vegan", "Made in USA", "30 Strips / Pack"],
        accent: "#F59E0B",
        darkBg: "#0d0800",
        available: false,
        // per-letter margin-right adjustments for BEAUTY: B E A U T Y
        bgTextSpacing: ["0", "0", "-0.04em", "0.02em", "0.04em", "0"],
    },
]
