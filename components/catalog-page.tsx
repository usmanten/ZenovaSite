"use client"

// Single-product page modeled on daps.shop/products/energy-strips —
// big photo + thumbnail gallery, dense buy box.

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { products } from "@/components/catalog-data"
import InTheWild from "@/components/in-the-wild"
import CatalogHeroNew from "@/components/catalog-hero-new"
import ScienceComparison from "@/components/science-comparison"

gsap.registerPlugin(ScrollTrigger)

// The one live, purchasable product.
const product = products[0]

// Real photos only. Lead shot, a pack photo, then the three
// "how to use" steps already built for the homepage routine section.
// `cover` = full-bleed graphic that already fills its own square (no padding, no letterboxing).
// `contain` = a floating/pedestal product shot that needs breathing room so nothing gets cropped.
const gallery: { src: string; alt: string; fit: "cover" | "contain" }[] = [
    { src: "/energy-simplified.jpg", alt: "Your energy, simplified — 50mg caffeine, caffeine + L-theanine, zero sugar, 30 strips per pack", fit: "cover" },
    { src: "/hero-product.png", alt: "Zenova Energy + Focus", fit: "contain" },
    { src: "/packet-front.png", alt: "Step 1 — open one packet", fit: "contain" },
    { src: "/meet-strawberry-frost.jpg", alt: "Meet Strawberry Frost", fit: "cover" },
    { src: "/supplement-facts.jpg", alt: "Supplement Facts — 50mg caffeine, 30mg L-theanine, no GMO, soy, nuts, gluten, or dairy, made in the USA", fit: "cover" },
]

const trustPoints = ["Try It Risk-Free", "Free Shipping", "100% Satisfaction Guarantee"]

export default function CatalogPage() {
    const [activeImage, setActiveImage] = useState(0)
    const [lightbox, setLightbox] = useState<string | null>(null)
    const [loadingProductId, setLoadingProductId] = useState<string | null>(null)
    const [soldOutProducts, setSoldOutProducts] = useState<Record<string, boolean>>({})
    const [checkoutErrors, setCheckoutErrors] = useState<Record<string, string>>({})
    const [selectedBundles, setSelectedBundles] = useState<Record<string, number>>({})

    const blockRef = useRef<HTMLDivElement>(null)

    const getBundle = (num: string) => selectedBundles[num] ?? 1
    const selectedQty = getBundle(product.number)
    const active = product.bundles?.find(b => b.qty === selectedQty) ?? product.bundles?.[0]

    useEffect(() => {
        const h = (e: KeyboardEvent) => { if (e.key === "Escape") setLightbox(null) }
        document.addEventListener("keydown", h)
        return () => document.removeEventListener("keydown", h)
    }, [])

    async function handleCheckout(slug: string, productNumber: string) {
        setLoadingProductId(productNumber)
        setCheckoutErrors(prev => ({ ...prev, [productNumber]: "" }))
        try {
            const res = await fetch("/api/checkout", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ slug, bundle: getBundle(productNumber) }),
            })
            if (!res.ok) {
                const body = await res.json().catch(() => ({}))
                if (body.error === "sold_out") {
                    setSoldOutProducts(prev => ({ ...prev, [productNumber]: true }))
                } else {
                    setCheckoutErrors(prev => ({ ...prev, [productNumber]: "Something went wrong. Please try again." }))
                }
                setLoadingProductId(null)
                return
            }
            const { url } = await res.json()
            if (!url) {
                setCheckoutErrors(prev => ({ ...prev, [productNumber]: "Something went wrong. Please try again." }))
                setLoadingProductId(null)
                return
            }
            window.location.href = url
        } catch {
            setCheckoutErrors(prev => ({ ...prev, [productNumber]: "Something went wrong. Please try again." }))
            setLoadingProductId(null)
        }
    }

    useEffect(() => {
        const targets = [blockRef.current].filter(Boolean) as HTMLDivElement[]
        if (targets.length === 0) return

        gsap.set(targets, { opacity: 0, y: 24 })

        const triggers = targets.map(el =>
            ScrollTrigger.create({
                trigger: el,
                start: "top 90%",
                once: true,
                onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }),
            })
        )

        return () => triggers.forEach(t => t.kill())
    }, [])

    return (
        <div className="overflow-x-clip bg-white">

            {/* ── HERO ─────────────────────────────────────────────────────────── */}
            <CatalogHeroNew />

            {/* ── PRODUCT ──────────────────────────────────────────────────────── */}
            <section id="products" className="mx-auto max-w-6xl px-6 pb-8 pt-10 md:px-12 md:pt-16 lg:px-16">
                {/* Breadcrumb */}
                <p className="mb-6 text-xs text-black/50 md:mb-8">
                    <Link href="/" className="hover:text-black">Home</Link>
                    <span className="mx-1.5">/</span>
                    <span className="text-black/70">{product.nameLines.join(" ")}</span>
                </p>

                <div ref={blockRef} className="grid gap-10 md:grid-cols-[1.15fr_1fr] md:gap-14" style={{ willChange: "transform, opacity" }}>

                    {/* ── Gallery ──────────────────────────────────────────────── */}
                    <div>
                        <button
                            type="button"
                            aria-label="Zoom in on product photo"
                            className="relative flex aspect-square w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-2xl border border-blush-200"
                            style={{ background: `linear-gradient(145deg, ${product.accent}10 0%, #ffffff 55%, ${product.accent}06 100%)` }}
                            onClick={() => setLightbox(gallery[activeImage].src)}
                        >
                            <Image
                                src={gallery[activeImage].src}
                                alt={gallery[activeImage].alt}
                                fill
                                priority
                                className={gallery[activeImage].fit === "cover" ? "object-cover" : "object-contain p-8"}
                                sizes="(max-width: 768px) 90vw, 680px"
                            />
                        </button>

                        <div className="mt-5 grid grid-cols-5 gap-3.5">
                            {gallery.map((img, i) => (
                                <button
                                    key={img.src}
                                    onClick={() => setActiveImage(i)}
                                    className={
                                        "relative aspect-square overflow-hidden rounded-xl border-2 bg-white transition-colors " +
                                        (i === activeImage ? "border-blush-600" : "border-blush-100 hover:border-blush-300")
                                    }
                                    aria-label={`Show photo: ${img.alt}`}
                                >
                                    <Image
                                        src={img.src}
                                        alt={img.alt}
                                        fill
                                        className={img.fit === "cover" ? "object-cover" : "object-contain p-1.5"}
                                        sizes="140px"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* ── Buy box ──────────────────────────────────────────────── */}
                    <div>
                        <h1
                            className="font-black leading-[0.95] tracking-tight text-black"
                            style={{ fontSize: "clamp(1.9rem, 3.4vw, 2.75rem)" }}
                        >
                            {product.nameLines.join(" ")}
                        </h1>

                        <Link
                            href="#reviews"
                            className="mt-2 inline-block text-sm font-semibold text-black underline decoration-black/30 underline-offset-4 transition-colors hover:decoration-black"
                        >
                            ★ See what customers are saying →
                        </Link>

                        <p className="mt-4 max-w-md text-sm leading-relaxed text-black/75">
                            {product.description}
                        </p>

                        {/* Feature pills */}
                        <div className="mt-4 flex flex-wrap gap-2">
                            {product.badges.map(badge => (
                                <span
                                    key={badge}
                                    className="rounded-full bg-blush-100 px-3 py-1 text-[11px] font-semibold text-blush-900"
                                >
                                    {badge}
                                </span>
                            ))}
                        </div>

                        {/* Flavor (single, informational — no other flavors exist yet) */}
                        {"flavor" in product && product.flavor && (
                            <div className="mt-6">
                                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-black/50">Flavor</p>
                                <div className="inline-flex items-center gap-2 rounded-xl border-2 border-blush-600 bg-blush-50 px-4 py-2.5 text-sm font-bold text-black">
                                    {product.flavor as string}
                                </div>
                            </div>
                        )}

                        {/* Pack selector */}
                        {product.bundles && (
                            <div className="mt-6">
                                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.25em] text-black/50">Pack Size</p>
                                <div className="flex flex-col gap-2.5">
                                    {product.bundles.map(b => {
                                        const isSelected = b.qty === selectedQty
                                        return (
                                            <button
                                                key={b.qty}
                                                onClick={() => setSelectedBundles(prev => ({ ...prev, [product.number]: b.qty }))}
                                                className="relative flex w-full items-center justify-between gap-4 rounded-xl px-4 py-3.5 text-left transition-all duration-200"
                                                style={{
                                                    border: `1.5px solid ${isSelected ? product.accent : "#F7D3DC"}`,
                                                    backgroundColor: isSelected ? product.accent + "10" : "#ffffff",
                                                }}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span
                                                        className="flex size-4 shrink-0 items-center justify-center rounded-full border-2"
                                                        style={{ borderColor: isSelected ? product.accent : "#E8A0B2" }}
                                                    >
                                                        {isSelected && <span className="size-2 rounded-full" style={{ backgroundColor: product.accent }} />}
                                                    </span>
                                                    <div>
                                                        <p className="text-sm font-black text-black">
                                                            {b.qty === 1 ? "1 Pack" : `${b.qty} Packs`}
                                                            <span className="ml-2 font-medium text-black/50">· {b.days} days</span>
                                                        </p>
                                                        <p className="text-xs text-black/50">{b.perStrip}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {b.badge && (
                                                        <span
                                                            className="rounded-full px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide"
                                                            style={{ backgroundColor: product.accent + "22", color: product.accent }}
                                                        >
                                                            {b.badge}
                                                        </span>
                                                    )}
                                                    <span className="text-base font-black" style={{ color: isSelected ? product.accent : "#000" }}>
                                                        {b.price}
                                                    </span>
                                                </div>
                                            </button>
                                        )
                                    })}
                                </div>
                            </div>
                        )}

                        {/* CTA */}
                        <div className="mt-6">
                            {soldOutProducts[product.number] ? (
                                <div
                                    className="flex w-full items-center justify-center gap-2 rounded-full py-4 text-sm font-bold"
                                    style={{ border: `1px solid ${product.accent}30`, backgroundColor: product.accent + "08", color: product.accent + "cc" }}
                                >
                                    <span className="size-2 rounded-full" style={{ backgroundColor: product.accent }} />
                                    Sold Out
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleCheckout(product.slug!, product.number)}
                                    disabled={loadingProductId === product.number}
                                    className="group flex w-full items-center justify-center gap-2.5 rounded-full bg-black py-4 text-base font-bold text-white transition-all hover:scale-[1.01] hover:bg-neutral-800 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                    {loadingProductId === product.number
                                        ? "Redirecting…"
                                        : `Shop Now — ${active?.price}`}
                                    {loadingProductId !== product.number && (
                                        <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                                    )}
                                </button>
                            )}

                            {checkoutErrors[product.number] && (
                                <p className="mt-3 text-xs text-red-600">{checkoutErrors[product.number]}</p>
                            )}

                            <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1.5">
                                {trustPoints.map(point => (
                                    <span key={point} className="text-[11px] font-semibold text-black/55">
                                        {point}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>

                </div>
            </section>

            {/* ── SCIENCE ──────────────────────────────────────────────────────── */}
            <ScienceComparison variant="tabs" />

            {/* ── REVIEWS ──────────────────────────────────────────────────────── */}
            <InTheWild compact />

            {/* ── LIGHTBOX ─────────────────────────────────────────────────────── */}
            {lightbox && (
                <div
                    className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/90 backdrop-blur-sm cursor-zoom-out"
                    onClick={() => setLightbox(null)}
                >
                    <div className="relative" onClick={e => e.stopPropagation()}>
                        <Image
                            src={lightbox}
                            alt="Product photo"
                            width={1600}
                            height={1600}
                            sizes="80vw"
                            className="max-h-[80vh] max-w-[80vw] rounded-2xl object-contain"
                            style={{ width: "auto", height: "auto" }}
                        />
                        <button
                            type="button"
                            aria-label="Close image"
                            onClick={() => setLightbox(null)}
                            className="absolute -right-10 -top-10 z-10 flex size-8 items-center justify-center rounded-full bg-white/20 text-white/80 hover:bg-white/35 transition-colors"
                        >
                            ✕
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}
