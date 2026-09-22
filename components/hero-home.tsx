"use client"

import React from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import Image from 'next/image'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { HeroHeader } from './header'
import { AnnouncementBar } from './announcement-bar'
import TrustBar from './trust-bar'

const transitionVariants = {
    item: {
        hidden: { opacity: 0, filter: 'blur(10px)', y: 20 },
        visible: {
            opacity: 1,
            filter: 'blur(0px)',
            y: 0,
            transition: { type: 'spring' as const, bounce: 0.2, duration: 1.5 },
        },
    },
}

export default function HeroHome() {
    return (
        <>
            <HeroHeader />
            <TrustBar />
            <main className="overflow-hidden bg-blush-300 text-blush-950">

                {/* ── HERO ─────────────────────────────────────────────────────── */}
                <section className="relative grid items-center gap-8 overflow-hidden px-6 pt-14 pb-14 md:grid-cols-2 md:px-16 md:pt-20 md:pb-20 lg:px-24">

                    {/* Left — copy */}
                    <div className="relative z-10 flex flex-col items-start gap-4 text-left">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
                                },
                                ...transitionVariants,
                            }}
                            className="flex flex-col items-start gap-4"
                        >
                            {/* Headline */}
                            <h1
                                className="font-black leading-[0.9] tracking-tight"
                                style={{ fontSize: 'clamp(2.25rem, 4.5vw, 4.25rem)' }}
                            >
                                <span className="text-black">Skip the Coffee.</span>
                                <br />
                                <span className="text-black">Keep the </span>
                                <span className="text-blush-700">Focus.</span>
                            </h1>

                            {/* Description */}
                            <p className="max-w-md text-sm font-medium leading-relaxed text-black/85">
                                A dissolvable strip with real caffeine and L-theanine. No coffee run, no crash —
                                just clean energy and focus in minutes.
                            </p>

                            {/* Review badge */}
                            <div className="inline-flex items-center gap-3 rounded-full border border-black/10 bg-white/60 px-5 py-2 text-xs">
                                <span className="text-sm leading-none text-blush-700">★★★★★</span>
                                <span className="h-3 w-px bg-black/15" />
                                <span className="text-black">100% Satisfaction Guarantee</span>
                            </div>

                            {/* CTA */}
                            <Link
                                href="/catalog#products"
                                className="group inline-flex items-center gap-3 rounded-full bg-black px-10 py-5 text-base font-bold text-white transition-all hover:scale-[1.03] hover:bg-neutral-800 active:scale-[0.98]"
                            >
                                Try Us Now
                                <ArrowRight className="size-5 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </AnimatedGroup>
                    </div>

                    {/* Right — floating product shot */}
                    <div className="relative mx-auto w-full max-w-sm md:max-w-md">
                        <Image
                            src="/hero-product.png"
                            width={1374}
                            height={1145}
                            alt="Zenova Strips"
                            priority
                            className="animate-gentle-sway h-auto w-full drop-shadow-2xl"
                        />
                    </div>

                </section>

                <AnnouncementBar />

            </main>
        </>
    )
}
