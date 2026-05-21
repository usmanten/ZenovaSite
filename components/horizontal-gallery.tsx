"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

const images = [
    { src: "/ZS_1.jpeg", alt: "Zenova Strips" },
    { src: "/ZS_4.png", alt: "Zenova Strips" },
    { src: "/ZS_single_front.png", alt: "Zenova Strips" },
    { src: "/ZS_5.png", alt: "Zenova Strips" },
    { src: "/ZS_3.jpeg", alt: "Zenova Strips" },
]

export default function HorizontalGallery() {
    const [activeIndex, setActiveIndex] = useState(0)

    const prev = () => setActiveIndex(i => (i - 1 + images.length) % images.length)
    const next = () => setActiveIndex(i => (i + 1) % images.length)

    const prevIndex = (activeIndex - 1 + images.length) % images.length
    const nextIndex = (activeIndex + 1) % images.length

    return (
        <>
            {/* ── Mobile ──────────────────────────────────────────────────────── */}
            <div className="block md:hidden bg-black px-4 py-8">
                <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "4/5" }}>
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className="absolute inset-0 transition-opacity duration-500"
                            style={{ opacity: i === activeIndex ? 1 : 0, pointerEvents: i === activeIndex ? "auto" : "none" }}
                        >
                            <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="100vw" priority={i === 0} />
                            <div className="absolute inset-0 bg-black/10" />
                        </div>
                    ))}

                    <button onClick={prev} className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex size-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
                        <ChevronLeft className="size-5" />
                    </button>
                    <button onClick={next} className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex size-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm">
                        <ChevronRight className="size-5" />
                    </button>

                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                        {images.map((_, i) => (
                            <button key={i} onClick={() => setActiveIndex(i)} className="size-1.5 rounded-full transition-all duration-300"
                                style={{ backgroundColor: i === activeIndex ? "white" : "rgba(255,255,255,0.35)" }} />
                        ))}
                    </div>
                </div>

                <Link href="/catalog#products" className="mt-5 flex w-full items-center justify-center rounded-full bg-white py-4 text-sm font-black text-black transition-all hover:opacity-90 active:scale-[0.98]">
                    Shop Now
                </Link>
            </div>

            {/* ── Desktop ─────────────────────────────────────────────────────── */}
            <div className="hidden md:flex h-screen w-full items-center justify-center bg-black relative">

                {/* Prev peek — shows right edge of previous image */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 overflow-hidden rounded-r-2xl"
                    style={{ right: "calc(50% + 27.5vw + 8px)", width: "10vw", height: "78vh" }}
                >
                    <div className="absolute right-0 h-full" style={{ width: "55vw" }}>
                        <Image src={images[prevIndex].src} alt={images[prevIndex].alt} fill className="object-cover" sizes="55vw" />
                    </div>
                </div>

                {/* Active card */}
                <div className="relative overflow-hidden rounded-2xl border border-white/8" style={{ width: "55vw", height: "78vh" }}>
                    {images.map((img, i) => (
                        <div
                            key={i}
                            className="absolute inset-0 transition-opacity duration-500"
                            style={{ opacity: i === activeIndex ? 1 : 0, pointerEvents: i === activeIndex ? "auto" : "none" }}
                        >
                            <Image src={img.src} alt={img.alt} fill className="object-cover" sizes="55vw" priority={i === 0} />
                            <div className="absolute inset-0 bg-black/10" />
                        </div>
                    ))}
                    <div className="absolute bottom-5 left-5 z-10 font-mono text-xs tracking-widest text-black/50">
                        {String(activeIndex + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                    </div>
                    <div className="absolute right-5 top-5 z-10 text-[10px] font-semibold uppercase tracking-[0.4em] text-black/30">
                        Zenova
                    </div>
                </div>

                {/* Next peek — shows left edge of next image */}
                <div
                    className="absolute top-1/2 -translate-y-1/2 overflow-hidden rounded-l-2xl"
                    style={{ left: "calc(50% + 27.5vw + 8px)", width: "10vw", height: "78vh" }}
                >
                    <div className="absolute left-0 h-full" style={{ width: "55vw" }}>
                        <Image src={images[nextIndex].src} alt={images[nextIndex].alt} fill className="object-cover" sizes="55vw" />
                    </div>
                </div>

                {/* Arrows */}
                <button onClick={prev} className="absolute left-5 top-1/2 -translate-y-1/2 z-10 flex size-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-all">
                    <ChevronLeft className="size-5" />
                </button>
                <button onClick={next} className="absolute right-5 top-1/2 -translate-y-1/2 z-10 flex size-11 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-all">
                    <ChevronRight className="size-5" />
                </button>

                {/* Dots */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                    {images.map((_, i) => (
                        <button key={i} onClick={() => setActiveIndex(i)} className="size-1.5 rounded-full transition-all duration-300"
                            style={{ backgroundColor: i === activeIndex ? "white" : "rgba(255,255,255,0.35)" }} />
                    ))}
                </div>
            </div>
        </>
    )
}
