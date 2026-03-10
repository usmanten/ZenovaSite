"use client"

import { useEffect, useRef, useState } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

gsap.registerPlugin(ScrollTrigger)

const images = [
    { src: "/ZS_1.jpeg", alt: "Zenova Strips" },
    { src: "/ZS_4.png", alt: "Zenova Strips" },
    { src: "/ZS_single_front.png", alt: "Zenova Strips" },
    { src: "/ZS_5.png", alt: "Zenova Strips" },
    { src: "/ZS_3.jpeg", alt: "Zenova Strips" },
]

export default function HorizontalGallery() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)
    const [activeIndex, setActiveIndex] = useState(0)

    const prev = () => setActiveIndex(i => (i - 1 + images.length) % images.length)
    const next = () => setActiveIndex(i => (i + 1) % images.length)

    useEffect(() => {
        if (window.innerWidth < 768) return

        const timer = setTimeout(() => {
            const section = sectionRef.current
            const track = trackRef.current
            if (!section || !track) return

            const ctx = gsap.context(() => {
                const getDistance = () => -(track.scrollWidth - window.innerWidth)

                gsap.to(track, {
                    x: getDistance,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: () => `+=${track.scrollWidth - window.innerWidth}`,
                        pin: true,
                        pinSpacing: true,
                        scrub: 2.5,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                })
            }, section)

            return () => ctx.revert()
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    return (
        <>
            {/* ── Mobile: carousel ───────────────────────────────────────────── */}
            <div className="block md:hidden bg-black px-4 py-8">
                <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "4/5" }}>
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className="absolute inset-0 transition-opacity duration-500"
                            style={{ opacity: i === activeIndex ? 1 : 0, pointerEvents: i === activeIndex ? "auto" : "none" }}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover"
                                sizes="100vw"
                                priority={i === 0}
                            />
                            <div className="absolute inset-0 bg-black/10" />
                        </div>
                    ))}

                    {/* Prev button */}
                    <button
                        onClick={prev}
                        className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex size-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
                    >
                        <ChevronLeft className="size-5" />
                    </button>

                    {/* Next button */}
                    <button
                        onClick={next}
                        className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex size-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm"
                    >
                        <ChevronRight className="size-5" />
                    </button>

                    {/* Dot indicators */}
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                        {images.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className="size-1.5 rounded-full transition-all duration-300"
                                style={{ backgroundColor: i === activeIndex ? "white" : "rgba(255,255,255,0.35)" }}
                            />
                        ))}
                    </div>
                </div>

                {/* Shop Now */}
                <Link
                    href="/catalog"
                    className="mt-5 flex w-full items-center justify-center rounded-full bg-white py-4 text-sm font-black text-black transition-all hover:opacity-90 active:scale-[0.98]"
                >
                    Shop Now
                </Link>
            </div>

            {/* ── Desktop: horizontal scroll ─────────────────────────────────── */}
            <div ref={sectionRef} className="hidden md:block h-screen w-full overflow-hidden bg-black">
                <div
                    ref={trackRef}
                    className="flex h-full items-center gap-5 pl-10"
                    style={{ width: `calc(${images.length} * 46vw + ${images.length + 1} * 20px + 40px)` }}
                >
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className="relative flex-shrink-0 overflow-hidden rounded-2xl border border-white/8"
                            style={{ width: "45vw", height: "78vh" }}
                        >
                            <Image
                                src={img.src}
                                alt={img.alt}
                                fill
                                className="object-cover opacity-95"
                                sizes="45vw"
                                priority={i === 0}
                            />
                            <div className="absolute inset-0 bg-black/10" />
                            <div className="absolute bottom-5 left-5 font-mono text-xs tracking-widest text-black/50">
                                {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                            </div>
                            <div className="absolute right-5 top-5 text-[10px] font-semibold uppercase tracking-[0.4em] text-black/30">
                                Zenova
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
