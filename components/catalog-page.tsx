"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { AnimatedGroup } from "@/components/ui/animated-group"
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

// ─── Data ────@

const products = [
    {
        number: "01",
        nameLines: ["Power"],
        flavor: "Strawberry Frost",
        category: "ENERGY",
        type: "Caffeine Strip",
        tagline: "50mg of clean caffeine. Zero crash. Zero sugar.",
        description:
            "Our flagship energy strip dissolves in seconds and kicks in fast. Crisp strawberry flavor, no jitters, no crash. Just clean, focused energy when you need it most.",
        badges: ["50mg Caffeine", "Sugar Free", "Gluten Free", "Vegan", "No Artificial Colors", "Made in USA", "30 Strips / Pack"],
        accent: "#FF4D6D",
        darkBg: "#0d0004",
        available: true,
        slug: "strawberry-frost",
        carouselImages: ["/ZS_5.png", "/ZS_single_front.png", "/ZS_single_back.jpeg"],
        bundles: [
            { qty: 1, days: 30, price: "$18.99", originalPrice: "$27.99", perPack: null,         perStrip: "$0.63/strip", pctOff: "32% off", badge: null },
            { qty: 2, days: 60, price: "$35.99", originalPrice: "$55.98", perPack: "$17.99/pack", perStrip: "$0.60/strip", pctOff: "36% off", badge: "Most Popular" },
            { qty: 3, days: 90, price: "$47.99", originalPrice: "$83.97", perPack: "$16.00/pack", perStrip: "$0.53/strip", pctOff: "44% off", badge: "Best Value" },
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

const marqueeItems = [
    "STRAWBERRY FROST", "·", "DREAM", "·", "GLOW", "·",
    "MADE IN USA", "·", "SUGAR FREE", "·", "FAST ACTING", "·",
    "CLEAN FORMULA", "·", "SUBLINGUAL", "·", "30 STRIPS", "·",
]

// ─── Component ────────────────────────────────────────────────────────────────

export default function CatalogPage() {
    const containerRef = useRef<HTMLDivElement>(null)
    const sectionsRef = useRef<(HTMLDivElement | null)[]>([])
    const marqueeRef = useRef<HTMLDivElement>(null)
    const [loadingProductId, setLoadingProductId] = useState<string | null>(null)
    const [selectedBundles, setSelectedBundles] = useState<Record<string, number>>({})
    const [carouselIndex, setCarouselIndex] = useState<Record<string, number>>({})
    const carouselTimers = useRef<Record<string, ReturnType<typeof setInterval>>>({})
    const [lightbox, setLightbox] = useState<string | null>(null)

    const getBundle = (num: string) => selectedBundles[num] ?? 1
    const getCarouselIndex = (num: string) => carouselIndex[num] ?? 0

    const carouselNext = (num: string, total: number) =>
        setCarouselIndex(prev => ({ ...prev, [num]: ((prev[num] ?? 0) + 1) % total }))
    const carouselPrev = (num: string, total: number) =>
        setCarouselIndex(prev => ({ ...prev, [num]: ((prev[num] ?? 0) - 1 + total) % total }))

    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null) }
        document.addEventListener("keydown", h)
        return () => document.removeEventListener("keydown", h)
    }, [lightbox])

    useEffect(() => {
        products.forEach(p => {
            if (!("carouselImages" in p) || !p.carouselImages) return
            const total = (p.carouselImages as string[]).length + 1
            carouselTimers.current[p.number] = setInterval(() => {
                setCarouselIndex(prev => ({ ...prev, [p.number]: ((prev[p.number] ?? 0) + 1) % total }))
            }, 5000)
        })
        return () => { Object.values(carouselTimers.current).forEach(clearInterval) }
    }, [])

    async function handleCheckout(slug: string, productNumber: string) {
        setLoadingProductId(productNumber)
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, bundle: getBundle(productNumber) }),
            })
            if (!res.ok) {
                setLoadingProductId(null)
                return
            }
            const { url } = await res.json()
            if (!url) {
                setLoadingProductId(null)
                return
            }
            window.location.href = url
        } catch {
            setLoadingProductId(null)
        }
    }

    useEffect(() => {
        const ctx = gsap.context(() => {

            // ── Marquee ──────────────────────────────────────────────────────
            if (marqueeRef.current) {
                gsap.to(marqueeRef.current, {
                    xPercent: -50,
                    duration: 22,
                    ease: "none",
                    repeat: -1,
                })
            }

            // ── Product section pins + scroll-driven animations ───────────────
            products.forEach((_, i) => {
                const section = sectionsRef.current[i]
                if (!section) return

                const number   = section.querySelector(".prod-number")
                const type     = section.querySelector(".prod-type")
                const names    = section.querySelectorAll(".prod-name-line")
                const flavor   = section.querySelector(".prod-flavor")
                const divider  = section.querySelector(".prod-divider")
                const tagline  = section.querySelector(".prod-tagline")
                const desc     = section.querySelector(".prod-desc")
                const badges   = section.querySelectorAll(".prod-badge")
                const cta      = section.querySelector(".prod-cta")
                const image    = section.querySelector(".prod-image")
                const bgText   = section.querySelector(".prod-bg-text")

                // Initial states
                gsap.set([number, type, divider, tagline, desc, cta], { opacity: 0, y: 44 })
                gsap.set(names,  { opacity: 0, y: 70 })
                if (flavor) gsap.set(flavor, { opacity: 0, y: 28 })
                gsap.set(badges, { opacity: 0, y: 18, scale: 0.92 })
                gsap.set(image,  { opacity: 0, x: 70, scale: 0.93 })
                gsap.set(bgText, { opacity: 0, x: 100 })

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: section,
                        pin: true,
                        start: "top top",
                        end: "+=960",
                        scrub: 1,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                })

                tl
                    .to(bgText, { opacity: 0.055, x: 0, duration: 2.5 }, 0)
                    .to(image,  { opacity: 1, x: 0, scale: 1, duration: 3 }, 0.2)
                    .to(number, { opacity: 1, y: 0, duration: 1.2 }, 0.6)
                    .to(type,   { opacity: 1, y: 0, duration: 1 }, 0.9)
                    .to(names,  { opacity: 1, y: 0, duration: 1.4, stagger: 0.18 }, 1.3)
                    .to(flavor ?? [], { opacity: 1, y: 0, duration: 1 }, 1.9)
                    .to(divider,{ opacity: 1, y: 0, duration: 0.8 }, 2.3)
                    .to(tagline,{ opacity: 1, y: 0, duration: 1 }, 2.6)
                    .to(desc,   { opacity: 1, y: 0, duration: 1 }, 3.1)
                    .to(badges, { opacity: 1, y: 0, scale: 1, stagger: 0.12, duration: 0.7 }, 3.7)
                    .to(cta,    { opacity: 1, y: 0, duration: 0.9 }, 4.6)
            })

        }, containerRef)

        return () => ctx.revert()
    }, [])

    return (
        <div ref={containerRef} className="overflow-x-hidden">

            {/* ── HERO ─────────────────────────────────────────────────────────── */}
            <section className="relative flex h-screen flex-col items-center justify-center overflow-hidden bg-black px-6 text-center text-white">
                {/* Subtle grid */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px]"
                />
                {/* Corner accent dots */}
                {products.map((p, i) => (
                    <div
                        key={p.number}
                        aria-hidden
                        className="pointer-events-none absolute size-72 rounded-full blur-3xl"
                        style={{
                            backgroundColor: p.accent + "18",
                            top: i === 0 ? "-5%" : i === 1 ? "30%" : "65%",
                            left: i === 0 ? "-10%" : i === 1 ? "75%" : "-5%",
                        }}
                    />
                ))}

                <AnimatedGroup
                    variants={{
                        container: {
                            visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
                        },
                        item: {
                            hidden: { opacity: 0, y: 32, filter: "blur(10px)" },
                            visible: {
                                opacity: 1, y: 0, filter: "blur(0px)",
                                transition: { type: "spring", bounce: 0.2, duration: 1.5 },
                            },
                        },
                    }}
                    className="flex flex-col items-center gap-0"
                >
                    <h1 className="text-[13vw] font-black leading-[0.88] tracking-tight text-white">
                        <span className="text-white/25">THE</span>
                        <br />
                        COLLECTION
                    </h1>

                    <div className="mt-8 flex flex-wrap items-center justify-center gap-6">
                        {products.map(p => (
                            <div key={p.number} className="flex items-center gap-2.5">
                                <span className="size-1.5 rounded-full" style={{ backgroundColor: p.accent }} />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/40">
                                    {p.number}&nbsp;&nbsp;{p.category}
                                </span>
                            </div>
                        ))}
                    </div>

                    {/* Risk-free blurb */}
                    <div className="mt-10 flex flex-col items-center gap-2 text-center">
                        <p className="text-[10px] font-semibold uppercase tracking-[0.5em] text-white/35">Try It Risk-Free</p>
                        <p className="max-w-md text-sm leading-relaxed text-white/30">
                            We want you to love Zenova. That's why you can try up to 3 strips from your pack. If you decide the product isn't for you, simply contact us and we'll get you a refund.
                        </p>
                    </div>
                </AnimatedGroup>

                {/* Scroll cue */}
                <div className="absolute bottom-10 flex flex-col items-center gap-2 text-white/25">
                    <span className="text-[9px] font-semibold uppercase tracking-[0.4em]">Scroll to explore</span>
                    <ChevronDown className="size-4 animate-bounce" />
                </div>
            </section>

            {/* ── MARQUEE ──────────────────────────────────────────────────────── */}
            <div className="overflow-hidden border-y border-white/5 bg-black py-3.5">
                <div ref={marqueeRef} className="flex whitespace-nowrap">
                    {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
                        <span
                            key={i}
                            className={`mx-6 text-[10px] font-bold uppercase tracking-[0.4em] ${item === "·" ? "text-white/15" : "text-white/25"}`}
                        >
                            {item}
                        </span>
                    ))}
                </div>
            </div>

            {/* ── PRODUCT SECTIONS ─────────────────────────────────────────────── */}
            {products.map((product, i) => (
                <div
                    key={product.number}
                    ref={el => { sectionsRef.current[i] = el }}
                    className="relative flex h-screen items-center overflow-hidden"
                    style={{ backgroundColor: product.darkBg }}
                >
                    {/* Giant background category word */}
                    <div
                        className="prod-bg-text pointer-events-none absolute -right-[4vw] top-1/2 -translate-y-1/2 select-none font-black leading-none"
                        style={{
                            color: product.accent,
                            fontSize: "22vw",
                            lineHeight: 1,
                            letterSpacing: "-0.01em",
                            WebkitMaskImage: product.number !== "02" ? "linear-gradient(to right, transparent 7%, black 20%)" : undefined,
                            maskImage: product.number !== "02" ? "linear-gradient(to right, transparent 7%, black 30%)" : undefined,
                        }}
                        aria-hidden
                    >
                        {"bgTextSpacing" in product && product.bgTextSpacing
                            ? (product.category as string).split("").map((char, ci) => (
                                <span key={ci} style={{ marginRight: (product.bgTextSpacing as string[])[ci] ?? "0" }}>{char}</span>
                            ))
                            : product.category}
                    </div>

                    {/* Ambient glow */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0"
                        style={{
                            background: `radial-gradient(ellipse 60% 60% at 70% 50%, ${product.accent}12, transparent 70%)`,
                        }}
                    />

                    {/* ── Left: Info ───────────────────────────────────────── */}
                    <div className="relative z-10 flex w-1/2 flex-col px-16 xl:px-24">

                        {/* Number + type row */}
                        <div className="flex items-center gap-3">
                            <span
                                className="prod-number font-mono text-xs tracking-[0.45em]"
                                style={{ color: product.accent }}
                            >
                                {product.number}
                            </span>
                            <span className="h-px w-6 bg-white/15" />
                            <span className="prod-type text-[10px] font-semibold uppercase tracking-[0.35em] text-white/35">
                                {product.type}
                            </span>
                        </div>

                        {/* Product name — each word on its own line for stagger */}
                        <div className="mt-5">
                            {product.nameLines.map((line, li) => (
                                <div key={li} className="overflow-hidden pb-4">
                                    <h2
                                        className="prod-name-line font-black leading-[0.9] tracking-tight text-white"
                                        style={{ fontSize: "clamp(4rem,7vw,9rem)" }}
                                    >
                                        {line}
                                    </h2>
                                </div>
                            ))}
                            {"flavor" in product && product.flavor && (
                                <p
                                    className="prod-flavor mt-1 text-sm font-semibold uppercase tracking-[0.25em]"
                                    style={{ color: product.accent + "99" }}
                                >
                                    {product.flavor as string}
                                </p>
                            )}
                        </div>

                        {/* Accent divider */}
                        <div
                            className="prod-divider mt-7 h-px w-14"
                            style={{ backgroundColor: product.accent + "55" }}
                        />

                        {/* Tagline */}
                        <p
                            className="prod-tagline mt-6 text-sm font-semibold leading-relaxed"
                            style={{ color: product.accent }}
                        >
                            {product.tagline}
                        </p>

                        {/* Description */}
                        <p className="prod-desc mt-4 max-w-sm text-sm leading-relaxed text-white/45">
                            {product.description}
                        </p>

                        {/* Badges */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {product.badges.map(badge => (
                                <span
                                    key={badge}
                                    className="prod-badge rounded-full px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-white/50"
                                    style={{
                                        border: `1px solid ${product.accent}28`,
                                        backgroundColor: product.accent + "0c",
                                    }}
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="prod-cta mt-5">
                            {product.available && product.bundles ? (() => {
                                const selectedQty = getBundle(product.number)
                                const active = product.bundles.find(b => b.qty === selectedQty) ?? product.bundles[0]
                                return (
                                    <div className="flex flex-col gap-3">
                                        {/* Price summary */}
                                        <div className="flex flex-col gap-1">
                                            <div className="flex items-baseline gap-2.5">
                                                <span className="text-3xl font-black" style={{ color: product.accent }}>
                                                    {active.price}
                                                </span>
                                                <span className="text-sm font-medium text-white/30 line-through">
                                                    {active.originalPrice}
                                                </span>
                                                <span className="text-[11px] text-white/25">{active.perStrip}</span>
                                            </div>
                                            <p className="text-[10px] font-semibold uppercase tracking-[0.3em]" style={{ color: product.accent + "99" }}>
                                                Launch Batch · Special limited pricing while supplies last
                                            </p>
                                        </div>

                                        {/* Bundle cards — grid fills the same width as the text block above */}
                                        <div className="mt-2 grid grid-cols-3 gap-2.5">
                                                {product.bundles.map(b => {
                                                    const isSelected = b.qty === selectedQty
                                                    return (
                                                        <div key={b.qty} className="flex flex-col items-center gap-1">
                                                            {b.badge ? (
                                                                <span
                                                                    className="mb-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider"
                                                                    style={{ backgroundColor: product.accent + "22", color: product.accent }}
                                                                >
                                                                    {b.badge}
                                                                </span>
                                                            ) : (
                                                                <span className="mb-0.5 h-4" />
                                                            )}
                                                            <button
                                                                onClick={() => setSelectedBundles(prev => ({ ...prev, [product.number]: b.qty }))}
                                                                className="w-full flex flex-col items-center gap-1 rounded-xl px-3 py-3.5 text-center transition-all duration-200"
                                                                style={{
                                                                    border: `1.5px solid ${isSelected ? product.accent : product.accent + "28"}`,
                                                                    backgroundColor: isSelected ? product.accent + "18" : "transparent",
                                                                }}
                                                            >
                                                                <span className="text-[9px] font-semibold uppercase tracking-[0.25em] text-white/40">
                                                                    {b.days} Days
                                                                </span>
                                                                <span className="text-sm font-black" style={{ color: isSelected ? product.accent : "rgba(255,255,255,0.6)" }}>
                                                                    {b.qty === 1 ? "1 Pack" : `${b.qty} Packs`}
                                                                </span>
                                                                <span className="text-[11px] font-medium" style={{ color: isSelected ? product.accent + "cc" : "rgba(255,255,255,0.3)" }}>
                                                                    {b.perPack ?? b.price}
                                                                </span>
                                                                {b.pctOff ? (
                                                                    <span
                                                                        className="mt-0.5 rounded-full px-2 py-0.5 text-[9px] font-bold"
                                                                        style={{ backgroundColor: product.accent + "22", color: product.accent }}
                                                                    >
                                                                        {b.pctOff}
                                                                    </span>
                                                                ) : (
                                                                    <span className="mt-0.5 h-4" />
                                                                )}
                                                            </button>
                                                        </div>
                                                    )
                                                })}
                                        </div>

                                        {/* Checkout button */}
                                        <button
                                            onClick={() => handleCheckout(product.slug!, product.number)}
                                            disabled={loadingProductId === product.number}
                                            className="group flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-base font-black text-black transition-all hover:scale-[1.02] hover:brightness-110 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                                            style={{
                                                backgroundColor: product.accent,
                                                boxShadow: `0 0 28px ${product.accent}55`,
                                            }}
                                        >
                                            {loadingProductId === product.number
                                                ? "Redirecting…"
                                                : `Shop Now — ${active.price}`}
                                            {loadingProductId !== product.number && (
                                                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                                            )}
                                        </button>
                                    </div>
                                )
                            })() : !product.available ? (
                                <div
                                    className="inline-flex items-center gap-3 rounded-full border px-8 py-3.5 text-sm font-medium text-white/45"
                                    style={{ borderColor: product.accent + "30", backgroundColor: product.accent + "08" }}
                                >
                                    <span
                                        className="size-2 animate-pulse rounded-full"
                                        style={{ backgroundColor: product.accent }}
                                    />
                                    Coming Soon
                                </div>
                            ) : null}
                        </div>
                    </div>

                    {/* ── Right: Product visual ────────────────────────────── */}
                    <div className="prod-image relative flex w-1/2 items-center justify-center pr-16 xl:pr-24">
                        <div className="relative">
                            {/* Outer glow */}
                            <div
                                aria-hidden
                                className="absolute inset-0 -z-10 scale-110 rounded-3xl blur-3xl"
                                style={{ backgroundColor: product.accent + "22" }}
                            />

                            {/* Card */}
                            <div
                                className="relative flex h-[460px] w-[345px] flex-col items-center justify-center overflow-hidden rounded-3xl"
                                style={{
                                    border: `1px solid ${product.accent}22`,
                                    background: `linear-gradient(145deg, ${product.accent}14 0%, ${product.darkBg} 50%, ${product.accent}08 100%)`,
                                }}
                            >
                                {/* Inner grid texture */}
                                <div
                                    aria-hidden
                                    className="pointer-events-none absolute inset-0 opacity-[0.06] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:24px_24px]"
                                />

                                {"carouselImages" in product && product.carouselImages ? (() => {
                                    const images = product.carouselImages as string[]
                                    const total = images.length + 1
                                    const idx = getCarouselIndex(product.number)
                                    return (
                                        <>
                                            {/* Slide 0: placeholder mockup */}
                                            <div
                                                className="absolute inset-0 flex flex-col items-center justify-center gap-5 transition-opacity duration-700"
                                                style={{ opacity: idx === 0 ? 1 : 0, pointerEvents: idx === 0 ? "auto" : "none" }}
                                            >
                                                <div className="relative flex items-center justify-center">
                                                    {[...Array(3)].map((_, si) => (
                                                        <div key={si} className="absolute rounded-2xl" style={{ width: 90, height: 140, backgroundColor: product.accent + (si === 0 ? "50" : si === 1 ? "35" : "20"), transform: `rotate(${(si - 1) * 8}deg) translateX(${(si - 1) * 14}px)`, zIndex: 3 - si }} />
                                                    ))}
                                                    <div className="relative z-10 flex h-36 w-[88px] flex-col items-center justify-center gap-2 rounded-2xl" style={{ backgroundColor: product.accent, boxShadow: `0 20px 60px ${product.accent}50` }}>
                                                        <span className="text-[8px] font-black uppercase tracking-widest text-black/60">Zenova</span>
                                                        <div className="h-px w-8 bg-black/20" />
                                                        <span className="text-center text-[7px] font-bold uppercase tracking-wider text-black/50">{product.type}</span>
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: product.accent }}>{product.category}</p>
                                                    <p className="mt-1 text-xs text-white/40">{product.nameLines.join(" ")}</p>
                                                </div>
                                            </div>

                                            {/* Slides 1+: real photos */}
                                            {images.map((src, si) => (
                                                <div key={si} className="absolute inset-0 transition-opacity duration-700 cursor-zoom-in" style={{ opacity: idx === si + 1 ? 1 : 0, pointerEvents: idx === si + 1 ? "auto" : "none" }} onClick={() => setLightbox(src)}>
                                                    <Image src={src} alt={`Product photo ${si + 1}`} fill className={`object-cover rounded-3xl opacity-90 ${si <= 1 ? "scale-[1.15]" : ""}`} sizes="345px" />
                                                </div>
                                            ))}

                                            {/* Dot indicators */}
                                            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-20">
                                                {Array.from({ length: total }).map((_, di) => (
                                                    <button key={di} onClick={() => setCarouselIndex(prev => ({ ...prev, [product.number]: di }))} className="size-1.5 rounded-full transition-all duration-300" style={{ backgroundColor: di === idx ? product.accent : product.accent + "44" }} />
                                                ))}
                                            </div>
                                        </>
                                    )
                                })() : (
                                    /* Non-carousel mockup for coming-soon products */
                                    <div className="flex flex-col items-center gap-5" style={{ filter: "blur(3px) saturate(0.4)" }}>
                                        <div className="relative flex items-center justify-center">
                                            {[...Array(3)].map((_, si) => (
                                                <div key={si} className="absolute rounded-2xl" style={{ width: 90, height: 140, backgroundColor: product.accent + (si === 0 ? "50" : si === 1 ? "35" : "20"), transform: `rotate(${(si - 1) * 8}deg) translateX(${(si - 1) * 14}px)`, zIndex: 3 - si }} />
                                            ))}
                                            <div className="relative z-10 flex h-36 w-[88px] flex-col items-center justify-center gap-2 rounded-2xl" style={{ backgroundColor: product.accent, boxShadow: `0 20px 60px ${product.accent}50` }}>
                                                <span className="text-[8px] font-black uppercase tracking-widest text-black/60">Zenova</span>
                                                <div className="h-px w-8 bg-black/20" />
                                                <span className="text-center text-[7px] font-bold uppercase tracking-wider text-black/50">{product.type}</span>
                                            </div>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-[10px] font-bold uppercase tracking-[0.3em]" style={{ color: product.accent }}>{product.category}</p>
                                            <p className="mt-1 text-xs text-white/40">{product.nameLines.join(" ")}</p>
                                        </div>
                                    </div>
                                )}

                                {/* Coming soon overlay */}
                                {!product.available && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="rounded-full px-7 py-2.5 text-[10px] font-bold uppercase tracking-[0.35em] backdrop-blur-md" style={{ border: `1px solid ${product.accent}45`, backgroundColor: product.accent + "18", color: product.accent }}>
                                            Coming Soon
                                        </div>
                                    </div>
                                )}

                                {/* Available badge */}
                                {product.available && (
                                    <div className="absolute right-4 top-4 z-20 flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider" style={{ backgroundColor: product.accent + "22", color: product.accent }}>
                                        <span className="size-1.5 rounded-full" style={{ backgroundColor: product.accent }} />
                                        Available Now
                                    </div>
                                )}
                            </div>

                            {/* Carousel prev/next buttons */}
                            {"carouselImages" in product && product.carouselImages && (
                                <div className="mt-4 flex items-center justify-center gap-4">
                                    <button
                                        onClick={() => carouselPrev(product.number, (product.carouselImages as string[]).length + 1)}
                                        className="flex size-8 items-center justify-center rounded-full border transition-colors duration-150"
                                        style={{ borderColor: product.accent + "33", color: product.accent + "99" }}
                                    >
                                        <ChevronLeft className="size-4" />
                                    </button>
                                    <button
                                        onClick={() => carouselNext(product.number, (product.carouselImages as string[]).length + 1)}
                                        className="flex size-8 items-center justify-center rounded-full border transition-colors duration-150"
                                        style={{ borderColor: product.accent + "33", color: product.accent + "99" }}
                                    >
                                        <ChevronRight className="size-4" />
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Bottom rule */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-px"
                        style={{ backgroundColor: product.accent + "12" }}
                    />
                </div>
            ))}

            {/* ── COMING SOON ──────────────────────────────────────────────────── */}
            <section className="relative flex min-h-[65vh] flex-col items-center justify-center overflow-hidden bg-black px-6 text-center text-white">
                {/* Gradient blobs */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/4 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                    style={{ backgroundColor: "#8B5CF620" }}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute right-1/4 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                    style={{ backgroundColor: "#F59E0B18" }}
                />

                <div className="relative z-10 max-w-2xl">
                    <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.5em] text-white/30">
                        Be the first to know
                    </p>
                    <h2 className="text-5xl font-black leading-[0.9] tracking-tight md:text-6xl xl:text-7xl">
                        New drops.
                        <br />
                        <span className="text-white/20">Coming soon.</span>
                    </h2>
                    <p className="mx-auto mt-6 max-w-md text-sm leading-relaxed text-white/35">
                        Dream and Glow are in development. Stay tuned for early access and first-drop updates.
                    </p>

                    {/* Product pills */}
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                        {products.filter(p => !p.available).map(p => (
                            <div
                                key={p.number}
                                className="flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs"
                                style={{ borderColor: p.accent + "30", backgroundColor: p.accent + "0a", color: p.accent + "cc" }}
                            >
                                <span className="size-1.5 animate-pulse rounded-full" style={{ backgroundColor: p.accent }} />
                                {p.nameLines.join(" ")} · {p.category}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── LIGHTBOX ─────────────────────────────────────────────────────── */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-zoom-out"
                    onClick={() => setLightbox(null)}
                >
                    <div className="relative max-h-[90vh] max-w-[90vw]" onClick={e => e.stopPropagation()}>
                        <Image
                            src={lightbox}
                            alt="Product photo"
                            width={900}
                            height={900}
                            className="max-h-[90vh] max-w-[90vw] rounded-2xl object-contain"
                            style={{ width: "auto", height: "auto" }}
                        />
                        <button
                            onClick={() => setLightbox(null)}
                            className="absolute -right-3 -top-3 flex size-8 items-center justify-center rounded-full bg-white/10 text-white/60 hover:bg-white/20 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
