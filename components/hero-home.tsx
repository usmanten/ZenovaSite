"use client"

import React, { useEffect, useRef } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { HeroHeader } from './header'
import { gsap } from 'gsap'

const transitionVariants = {
    item: {
        hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: { type: 'spring', bounce: 0.2, duration: 1.5 },
        },
    },
}

const marqueeItems = [
    'STRAWBERRY FROST', '·', 'MADE IN USA', '·', 'SUGAR FREE', '·',
    'FAST ACTING', '·', 'CLEAN FORMULA', '·',
    'SUBLINGUAL STRIPS', '·', 'NO FILLERS', '·', 'CAFFEINE', '·',
]

export default function HeroHome() {
    const marqueeRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!marqueeRef.current) return
        const ctx = gsap.context(() => {
            gsap.to(marqueeRef.current, {
                xPercent: -50,
                duration: 22,
                ease: 'none',
                repeat: -1,
            })
        })
        return () => ctx.revert()
    }, [])

    return (
        <>
            <HeroHeader />
            <main className="overflow-hidden bg-black text-white">

                {/* ── HERO ─────────────────────────────────────────────────────── */}
                <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-28 text-center">

                    {/* Subtle grid */}
                    <div
                        aria-hidden
                        className="pointer-events-none absolute inset-0 opacity-[0.032] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px]"
                    />

                    {/* Hero image — right side, bleeds behind text */}
                    <div className="absolute right-0 top-0 h-full w-[58%]">
                        <Image
                            src="/herozenova.jpeg"
                            fill
                            alt="Zenova Strips"
                            className="object-cover object-center"
                            priority
                        />
                        {/* Left-to-right gradient so text stays readable */}
                        <div
                            aria-hidden
                            className="absolute inset-0"
                            style={{ background: 'linear-gradient(to right, black 0%, rgba(0,0,0,0.75) 35%, rgba(0,0,0,0.25) 70%, rgba(0,0,0,0.1) 100%)' }}
                        />
                        {/* Top fade */}
                        <div aria-hidden className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black to-transparent" />
                        {/* Bottom fade */}
                        <div aria-hidden className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black to-transparent" />
                    </div>

                    {/* Centered content — z-10 sits over the image */}
                    <div className="relative z-10 mx-auto flex w-full max-w-5xl flex-col items-center gap-7">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
                                },
                                ...transitionVariants,
                            }}
                            className="flex flex-col items-center gap-7"
                        >
                            {/* Headline */}
                            <h1
                                className="font-black leading-[0.88] tracking-tight"
                                style={{ fontSize: 'clamp(3rem, 9.5vw, 10rem)' }}
                            >
                                <span className="text-white">THE BEST</span>
                                <br />
                                <span className="text-white/20">TASTING,</span>
                                <br />
                                <span className="text-white">FASTEST ACTING</span>
                                <br />
                                <span className="text-white/20">STRIPS.</span>
                            </h1>

                            {/* Review badge — now below the headline */}
                            <div className="inline-flex items-center gap-3 rounded-full border border-white/10 bg-black/60 px-5 py-2 text-xs backdrop-blur-sm">
                                <span className="text-sm leading-none text-yellow-400">★★★★★</span>
                                <span className="h-3 w-px bg-white/15" />
                                <span className="text-white/50">100% Satisfaction Guarantee</span>
                            </div>

                            {/* CTA */}
                            <Link
                                href="/catalog"
                                className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:scale-[1.03] hover:opacity-90 active:scale-[0.98]"
                            >
                                Try Us Now
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </AnimatedGroup>
                    </div>

                </section>

                {/* ── MARQUEE ──────────────────────────────────────────────────── */}
                <div className="overflow-hidden border-y border-white/5 py-3.5">
                    <div ref={marqueeRef} className="flex whitespace-nowrap">
                        {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
                            <span
                                key={i}
                                className={`mx-6 text-[10px] font-bold uppercase tracking-[0.4em] ${item === '·' ? 'text-white/15' : 'text-white/25'}`}
                            >
                                {item}
                            </span>
                        ))}
                    </div>
                </div>


            </main>
        </>
    )
}
