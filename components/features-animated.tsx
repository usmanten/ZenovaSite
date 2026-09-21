"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import { Zap, Brain, Ban, Layers } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const stats = [
    { icon: <Zap className="size-5" aria-hidden />, headline: "50mg", caption: "Caffeine Per Strip" },
    { icon: <Brain className="size-5" aria-hidden />, headline: "Caffeine + L-Theanine", caption: "Clean Energy Blend" },
    { icon: <Ban className="size-5" aria-hidden />, headline: "Zero Sugar", caption: "No Fillers or Additives" },
    { icon: <Layers className="size-5" aria-hidden />, headline: "30 Strips", caption: "Per Pack" },
]

export default function Features() {
    const headingRef = useRef<HTMLDivElement>(null)
    const photoRef = useRef<HTMLDivElement>(null)
    const statsRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const heading = headingRef.current
        const photo = photoRef.current
        const statsRow = statsRef.current
        if (!heading || !photo || !statsRow) return

        gsap.set(heading, { opacity: 0, y: 30 })
        gsap.set(photo, { opacity: 0, y: 30 })
        gsap.set(statsRow, { opacity: 0, y: 20 })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heading,
                start: "top 80%",
                toggleActions: "play none none none",
            },
        })

        tl.to(heading, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0)
            .to(photo, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.15)
            .to(statsRow, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.35)

        return () => {
            tl.scrollTrigger?.kill()
            tl.kill()
        }
    }, [])

    return (
        <section className="w-full bg-white px-6 py-20 md:px-16 lg:px-24">
            <div className="mx-auto max-w-6xl">

                <div className="grid items-center gap-12 md:grid-cols-2">
                    {/* Left — headline */}
                    <div ref={headingRef} style={{ willChange: "transform, opacity" }}>
                        <h2
                            className="font-black leading-[0.9] tracking-tight text-blush-950"
                            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
                        >
                            Built For Perfection.
                        </h2>
                        <p className="mt-4 text-sm text-blush-950/70">
                            The only strips made in the USA with premium ingredients and advanced technology.
                        </p>
                    </div>

                    {/* Right — floating product photo */}
                    <div ref={photoRef} className="relative mx-auto w-full max-w-xs" style={{ willChange: "transform, opacity" }}>
                        <div
                            aria-hidden
                            className="pointer-events-none absolute inset-0 -z-10 rounded-full bg-blush-100 blur-2xl"
                        />
                        <Image
                            src="/product-stack.png"
                            width={1211}
                            height={1299}
                            alt="Zenova Strips"
                            className="h-auto w-full drop-shadow-xl"
                        />
                    </div>
                </div>

                {/* Stat row */}
                <div
                    ref={statsRef}
                    className="mt-16 grid grid-cols-2 gap-y-10 border-t border-blush-200 pt-12 md:grid-cols-4 md:divide-x md:divide-blush-200"
                    style={{ willChange: "transform, opacity" }}
                >
                    {stats.map((stat, i) => (
                        <div key={i} className="flex flex-col items-center gap-3 px-4 text-center">
                            <div className="inline-flex size-11 items-center justify-center rounded-full bg-blush-100 text-blush-600">
                                {stat.icon}
                            </div>
                            <div>
                                <p className="font-black text-lg text-blush-950 sm:text-xl">{stat.headline}</p>
                                <p className="mt-1 text-xs font-bold uppercase tracking-widest text-blush-950/60">{stat.caption}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}
