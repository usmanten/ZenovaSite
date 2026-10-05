"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"

const POLL_INTERVAL_MS = 20000
const TILE_HEIGHT = 60 // px — only the height needs to be a fixed JS constant, it drives the roll-offset math below

function DigitRoller({ digit }: { digit: number }) {
    return (
        <div
            className="relative w-9 overflow-hidden sm:w-[52px]"
            style={{ height: TILE_HEIGHT }}
            aria-hidden
        >
            <motion.div
                animate={{ y: -digit * TILE_HEIGHT }}
                transition={{ type: "spring", stiffness: 180, damping: 22 }}
            >
                {Array.from({ length: 10 }, (_, n) => (
                    <div
                        key={n}
                        className="flex items-center justify-center font-black text-blush-900"
                        style={{ height: TILE_HEIGHT, fontSize: "2rem" }}
                    >
                        {n}
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

// Small radiating sparkle-burst — 3 short rays fanning outward, mirrored for the opposite side.
function Sparkle({ flip = false }: { flip?: boolean }) {
    return (
        <svg
            aria-hidden
            viewBox="0 0 28 20"
            className="h-3.5 w-5 shrink-0 text-blush-400 sm:h-5 sm:w-7"
            style={{ transform: flip ? "scaleX(-1)" : undefined }}
        >
            <g stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <line x1="2" y1="3" x2="9" y2="7" />
                <line x1="1" y1="10" x2="10" y2="10" />
                <line x1="2" y1="17" x2="9" y2="13" />
            </g>
        </svg>
    )
}

export default function StripCounter() {
    const [remaining, setRemaining] = useState<number | null>(null)
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        let cancelled = false

        const fetchRemaining = async () => {
            try {
                const res = await fetch("/api/strips-remaining", { cache: "no-store" })
                if (!res.ok) return
                const data = await res.json()
                if (!cancelled && typeof data.remaining === "number") {
                    setRemaining(data.remaining)
                }
            } catch {
                // silently skip a failed poll — keep showing the last known value
            }
        }

        fetchRemaining()
        pollRef.current = setInterval(fetchRemaining, POLL_INTERVAL_MS)

        return () => {
            cancelled = true
            if (pollRef.current) clearInterval(pollRef.current)
        }
    }, [])

    const formatted = remaining !== null ? remaining.toLocaleString("en-US") : "—"
    const chars = formatted.split("")

    return (
        <div className="relative mx-auto flex w-full max-w-xs flex-col items-center gap-5 text-center">

            {/* LIVE badge */}
            <div className="flex items-center gap-3">
                <Sparkle />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blush-900 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
                    <span className="relative flex size-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                    </span>
                    Live
                </span>
                <Sparkle flip />
            </div>

            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blush-950/60">
                Strips Remaining
            </p>

            {/* Digit tiles */}
            <div className="flex items-center gap-1.5 sm:gap-2">
                <Sparkle />
                <div className="flex items-center gap-1 sm:gap-1.5">
                    {chars.map((ch, i) =>
                        ch === "," ? (
                            <span key={i} className="w-2 text-xl font-black text-blush-900/40 sm:w-2.5 sm:text-2xl">,</span>
                        ) : (
                            <div
                                key={i}
                                className="flex w-9 items-center justify-center rounded-xl bg-blush-100 shadow-md shadow-black/10 ring-1 ring-black/5 sm:w-[52px]"
                                style={{ height: TILE_HEIGHT }}
                            >
                                {remaining !== null ? <DigitRoller digit={Number(ch)} /> : (
                                    <span className="text-center font-black text-blush-900" style={{ fontSize: "2rem" }}>
                                        {ch}
                                    </span>
                                )}
                            </div>
                        )
                    )}
                </div>
                <Sparkle flip />
            </div>

            <div className="flex items-center gap-3">
                <span aria-hidden className="h-px w-8 bg-blush-300" />
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blush-950/60">
                    And Counting
                </p>
                <span aria-hidden className="h-px w-8 bg-blush-300" />
            </div>

        </div>
    )
}
