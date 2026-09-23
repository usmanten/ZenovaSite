"use client"

import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { AnimatedGroup } from "@/components/ui/animated-group"
import { products } from "@/components/catalog-data"

// The one live, purchasable product leads the hero — Dream and Glow get a
// small secondary mention rather than equal billing, since they can't be bought yet.
const live = products[0]
const startingPrice = live.bundles?.[0]?.price ?? ""

const trustPoints = ["Try It Risk-Free", "Free Shipping", "100% Satisfaction Guarantee"]

export default function CatalogHeroNew() {
    return (
        <section className="relative flex min-h-[80vh] flex-col justify-center overflow-hidden bg-blush-300 px-6 py-16 md:px-16 lg:px-24">
            {/* Subtle grid */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.05] [background-image:linear-gradient(to_right,black_1px,transparent_1px),linear-gradient(to_bottom,black_1px,transparent_1px)] [background-size:80px_80px]"
            />
            {/* Corner accent blobs, using the live product's color */}
            <div aria-hidden className="pointer-events-none absolute -left-16 -top-16 size-72 rounded-full blur-3xl" style={{ backgroundColor: live.accent + "18" }} />
            <div aria-hidden className="pointer-events-none absolute -right-16 bottom-0 size-80 rounded-full blur-3xl" style={{ backgroundColor: live.accent + "14" }} />

            <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 md:grid-cols-2 md:gap-12">

                {/* Left — copy */}
                <div className="flex flex-col items-center text-center md:items-start md:text-left">
                    <AnimatedGroup
                        variants={{
                            container: {
                                visible: { transition: { staggerChildren: 0.13, delayChildren: 0.15 } },
                            },
                            item: {
                                hidden: { opacity: 0, y: 24, filter: "blur(8px)" },
                                visible: {
                                    opacity: 1, y: 0, filter: "blur(0px)",
                                    transition: { type: "spring", bounce: 0.25, duration: 1.3 },
                                },
                            },
                        }}
                        className="flex flex-col items-center gap-4 md:items-start"
                    >
                        <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-black">The Collection</p>

                        <h1
                            className="font-black leading-[0.9] tracking-tight text-black"
                            style={{ fontSize: "clamp(2.5rem, 5.5vw, 4.75rem)" }}
                        >
                            Real Energy.
                            <br />
                            <span style={{ color: live.accent }}>Zero Crash.</span>
                            <br />
                            Made in the <span style={{ color: live.accent }}>USA.</span>
                        </h1>

                        {/* Trust row */}
                        <div className="flex flex-wrap items-center justify-center gap-2.5 md:justify-start">
                            {trustPoints.map(point => (
                                <span
                                    key={point}
                                    className="inline-flex items-center rounded-full bg-white px-5 py-2.5 text-xs font-black uppercase tracking-[0.15em] text-black shadow-md shadow-black/10"
                                >
                                    {point}
                                </span>
                            ))}
                        </div>

                        {/* Risk-free explanation, carried over from the old hero */}
                        <p className="max-w-md text-sm font-bold leading-relaxed text-black">
                            We want you to love Zenova. That&apos;s why you can try up to 3 strips from your pack. If you decide the product isn&apos;t for you, simply contact us and we&apos;ll get you a refund.
                        </p>

                        {/* CTA */}
                        <div className="mt-2 flex flex-wrap items-center justify-center gap-x-6 gap-y-3 md:justify-start">
                            <Link
                                href="#products"
                                className="group inline-flex items-center gap-3 rounded-full bg-black px-8 py-4 text-sm font-bold text-white transition-all hover:scale-[1.03] hover:bg-neutral-800 active:scale-[0.98]"
                            >
                                Shop Now — {startingPrice}
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                            <Link
                                href="#reviews"
                                className="text-sm font-semibold text-black underline decoration-black/30 underline-offset-4 transition-colors hover:decoration-black"
                            >
                                See what customers are saying ↓
                            </Link>
                        </div>

                        {/* Secondary: the rest of the lineup */}
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-5 md:justify-start">
                            {products.map(p => (
                                <div key={p.number} className="flex items-center gap-2">
                                    <span className="size-1.5 rounded-full" style={{ backgroundColor: p.accent }} />
                                    <span className="text-[10px] font-semibold uppercase tracking-[0.3em] text-black/60">
                                        {p.number}&nbsp;&nbsp;{p.category}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </AnimatedGroup>
                </div>

                {/* Right — product photo */}
                <div className="relative mx-auto w-full max-w-xs md:max-w-sm">
                    <Image
                        src="/hero-product.png"
                        width={1374}
                        height={1145}
                        alt="Zenova Strips — Energy + Focus, Strawberry Frost"
                        priority
                        className="animate-gentle-sway h-auto w-full drop-shadow-2xl"
                    />
                </div>

            </div>
        </section>
    )
}
