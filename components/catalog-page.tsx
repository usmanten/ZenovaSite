"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { AnimatedGroup } from "@/components/ui/animated-group"
import { ArrowRight, ChevronDown } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

// ─── Data ────@

const products = [
    {
        number: "01",
        nameLines: ["Strawberry", "Frost"],
        category: "ENERGY",
        type: "Caffeine Strip",
        tagline: "100mg of clean caffeine. Zero crash. Zero sugar.",
        description:
            "Our flagship energy strip dissolves in seconds and kicks in fast. Crisp strawberry flavor, no jitters, no crash — just clean, focused energy when you need it most.",
        badges: ["100mg Caffeine", "Sugar Free", "No Artificial Colors", "Made in USA", "30 Strips / Pack"],
        accent: "#FF4D6D",
        darkBg: "#0d0004",
        available: true,
        priceId: "price_1T4Rwp49C1TvyyAW38zEfb46",
    },
    {
        number: "02",
        nameLines: ["Dream"],
        category: "SLEEP",
        type: "Melatonin Strip",
        tagline: "Fall asleep faster. Wake up refreshed.",
        description:
            "3mg of fast-dissolving melatonin in a strip that works before your head hits the pillow. Formulated for quality sleep — not the grogginess you get from pills.",
        badges: ["3mg Melatonin", "Sugar Free", "Non-Habit Forming", "Made in USA", "30 Strips / Pack"],
        accent: "#8B5CF6",
        darkBg: "#05010d",
        available: false,
    },
    {
        number: "03",
        nameLines: ["Glow"],
        category: "BEAUTY",
        type: "Beauty Strip",
        tagline: "Collagen, biotin & hyaluronic acid — in one strip.",
        description:
            "Your entire daily beauty routine, simplified into a single strip. Zenova Glow delivers premium skin and hair nutrients sublingually for maximum bioavailability.",
        badges: ["Collagen Peptides", "Biotin 5000mcg", "Hyaluronic Acid", "Made in USA", "30 Strips / Pack"],
        accent: "#F59E0B",
        darkBg: "#0d0800",
        available: false,
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

    async function handleCheckout(priceId: string, productNumber: string) {
        setLoadingProductId(productNumber)
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ priceId }),
            })
            const { url } = await res.json()
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
                    className="flex flex-col items-center"
                >
                    <p className="mb-8 text-[10px] font-semibold uppercase tracking-[0.55em] text-white/30">
                        Zenova Strips · Est. 2025
                    </p>

                    <h1 className="text-[13vw] font-black leading-[0.88] tracking-tight text-white">
                        THE
                        <br />
                        <span className="text-white/20">COLLECTION</span>
                    </h1>

                    <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
                        {products.map(p => (
                            <div key={p.number} className="flex items-center gap-2.5">
                                <span className="size-1.5 rounded-full" style={{ backgroundColor: p.accent }} />
                                <span className="text-[10px] font-semibold uppercase tracking-[0.35em] text-white/40">
                                    {p.number}&nbsp;&nbsp;{p.category}
                                </span>
                            </div>
                        ))}
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
                            fontSize: "24vw",
                            lineHeight: 1,
                        }}
                        aria-hidden
                    >
                        {product.category}
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
                                <div key={li} className="overflow-hidden">
                                    <h2
                                        className="prod-name-line font-black leading-[0.9] tracking-tight text-white"
                                        style={{ fontSize: product.nameLines.length > 1 ? "clamp(3rem,5.5vw,6.5rem)" : "clamp(4rem,7vw,9rem)" }}
                                    >
                                        {line}
                                    </h2>
                                </div>
                            ))}
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
                        <div className="mt-7 flex flex-wrap gap-2">
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
                        <div className="prod-cta mt-10">
                            {product.available ? (
                                <button
                                    onClick={() => handleCheckout(product.priceId!, product.number)}
                                    disabled={loadingProductId === product.number}
                                    className="group inline-flex items-center gap-2.5 rounded-full px-8 py-3.5 text-sm font-bold text-black transition-all hover:scale-[1.03] hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                                    style={{ backgroundColor: product.accent }}
                                >
                                    {loadingProductId === product.number ? "Redirecting…" : "Shop Now"}
                                    {loadingProductId !== product.number && (
                                        <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                                    )}
                                </button>
                            ) : (
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
                            )}
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
                                className="relative flex h-[400px] w-[300px] flex-col items-center justify-center overflow-hidden rounded-3xl"
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

                                {/* Product mockup */}
                                <div
                                    className="flex flex-col items-center gap-5"
                                    style={{ filter: product.available ? "none" : "blur(3px) saturate(0.4)" }}
                                >
                                    {/* Strip stack visual */}
                                    <div className="relative flex items-center justify-center">
                                        {[...Array(3)].map((_, si) => (
                                            <div
                                                key={si}
                                                className="absolute rounded-2xl"
                                                style={{
                                                    width: 90,
                                                    height: 140,
                                                    backgroundColor: product.accent + (si === 0 ? "50" : si === 1 ? "35" : "20"),
                                                    transform: `rotate(${(si - 1) * 8}deg) translateX(${(si - 1) * 14}px)`,
                                                    zIndex: 3 - si,
                                                }}
                                            />
                                        ))}
                                        {/* Front strip */}
                                        <div
                                            className="relative z-10 flex h-36 w-[88px] flex-col items-center justify-center gap-2 rounded-2xl"
                                            style={{
                                                backgroundColor: product.accent,
                                                boxShadow: `0 20px 60px ${product.accent}50`,
                                            }}
                                        >
                                            <span className="text-[8px] font-black uppercase tracking-widest text-black/60">
                                                Zenova
                                            </span>
                                            <div className="h-px w-8 bg-black/20" />
                                            <span className="text-center text-[7px] font-bold uppercase tracking-wider text-black/50">
                                                {product.type}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-center">
                                        <p
                                            className="text-[10px] font-bold uppercase tracking-[0.3em]"
                                            style={{ color: product.accent }}
                                        >
                                            {product.category}
                                        </p>
                                        <p className="mt-1 text-xs text-white/40">
                                            {product.nameLines.join(" ")}
                                        </p>
                                    </div>
                                </div>

                                {/* Coming soon overlay */}
                                {!product.available && (
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div
                                            className="rounded-full px-7 py-2.5 text-[10px] font-bold uppercase tracking-[0.35em] backdrop-blur-md"
                                            style={{
                                                border: `1px solid ${product.accent}45`,
                                                backgroundColor: product.accent + "18",
                                                color: product.accent,
                                            }}
                                        >
                                            Coming Soon
                                        </div>
                                    </div>
                                )}

                                {/* Available badge */}
                                {product.available && (
                                    <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full px-3 py-1 text-[9px] font-bold uppercase tracking-wider"
                                        style={{
                                            backgroundColor: product.accent + "22",
                                            color: product.accent,
                                        }}
                                    >
                                        <span className="size-1.5 rounded-full" style={{ backgroundColor: product.accent }} />
                                        Available Now
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Bottom rule */}
                    <div
                        className="absolute bottom-0 left-0 right-0 h-px"
                        style={{ backgroundColor: product.accent + "12" }}
                    />
                </div>
            ))}

            {/* ── WAITLIST CTA ─────────────────────────────────────────────────── */}
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
                        Dream and Glow are in development. Join the waitlist and get early access,
                        exclusive launch pricing, and first-drop updates.
                    </p>
                    <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="w-full rounded-full border border-white/10 bg-white/5 px-6 py-3.5 text-sm text-white outline-none placeholder:text-white/25 focus:border-white/25 sm:w-80"
                        />
                        <button className="w-full rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black transition-all hover:scale-[1.03] hover:opacity-90 sm:w-auto">
                            Join Waitlist
                        </button>
                    </div>

                    {/* Product pills */}
                    <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
                        {products.filter(p => !p.available).map(p => (
                            <div
                                key={p.number}
                                className="flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs"
                                style={{ borderColor: p.accent + "30", backgroundColor: p.accent + "0a", color: p.accent + "cc" }}
                            >
                                <span className="size-1.5 animate-pulse rounded-full" style={{ backgroundColor: p.accent }} />
                                {p.nameLines.join(" ")} — {p.category}
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}
