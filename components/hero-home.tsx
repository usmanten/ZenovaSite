"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { ArrowRight, Trophy } from 'lucide-react'
import Image from 'next/image'
import { AnimatedGroup } from '@/components/ui/animated-group'
import { HeroHeader } from './header'
import { AnnouncementBar } from './announcement-bar'
import TrustBar from './trust-bar'
import StripCounter from './strip-counter'
import LeaderboardModal from './leaderboard-modal'

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
    const [showLeaderboard, setShowLeaderboard] = useState(false)

    return (
        <>
            <HeroHeader />
            <TrustBar />
            <main className="overflow-hidden bg-blush-300 text-blush-950">

                {/* ── HERO ─────────────────────────────────────────────────────── */}
                <section className="relative grid items-center gap-6 overflow-hidden px-6 pt-14 pb-14 md:grid-cols-[1.1fr_0.8fr_1fr] md:gap-6 md:px-16 md:pt-20 md:pb-20 lg:px-24">

                    {/* Left — copy */}
                    <div className="relative z-10 flex flex-col items-center gap-4 text-center md:items-start md:text-left">
                        <AnimatedGroup
                            variants={{
                                container: {
                                    visible: { transition: { staggerChildren: 0.13, delayChildren: 0.25 } },
                                },
                                ...transitionVariants,
                            }}
                            className="flex flex-col items-center gap-4 md:items-start"
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

                    {/* Middle — live strips-remaining counter */}
                    <div className="order-3 flex flex-col items-center gap-3 md:order-none md:gap-5">
                        <div className="scale-90 py-2 md:scale-100 md:py-3 lg:scale-110 lg:py-4 xl:scale-125 xl:py-6">
                            <StripCounter />
                        </div>
                        <button
                            onClick={() => setShowLeaderboard(true)}
                            className="group inline-flex items-center gap-2 rounded-full border-2 border-blush-700 bg-white/60 px-6 py-3 text-sm font-bold text-blush-700 transition-all hover:scale-[1.03] hover:bg-blush-700 hover:text-white active:scale-[0.98]"
                        >
                            <Trophy className="size-4" />
                            <span className="sm:hidden">Cash Prize Leaderboard</span>
                            <span className="hidden sm:inline">View Cash Prize Leaderboard</span>
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>

                    {/* Right — floating product shot */}
                    <div className="order-2 relative mx-auto w-full max-w-sm md:order-none md:max-w-md">
                        <Image
                            src="/hero-product.png"
                            width={1374}
                            height={1145}
                            alt="Zenova Strips"
                            priority
                            sizes="(max-width: 768px) 384px, 448px"
                            className="animate-gentle-sway h-auto w-full drop-shadow-2xl"
                        />
                    </div>

                </section>

                <AnnouncementBar />

            </main>

            <LeaderboardModal open={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
        </>
    )
}
