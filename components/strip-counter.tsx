"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"

const POLL_INTERVAL_MS = 20000
const TILE_HEIGHT = 72 // px — only the height needs to be a fixed JS constant, it drives the roll-offset math below
const TILE_WIDTH = 56 // px — narrower than TILE_HEIGHT for a taller, more rectangular tile

function DigitRoller({ digit }: { digit: number }) {
    return (
        <div
            className="relative overflow-hidden"
            style={{ height: TILE_HEIGHT, width: TILE_WIDTH }}
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
                        style={{ height: TILE_HEIGHT, fontSize: "2.6rem" }}
                    >
                        <span className="inline-block" style={{ transform: "scaleY(1.1)" }}>
                            {n}
                        </span>
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
            className="h-3.5 w-5 shrink-0 text-blush-900 sm:h-5 sm:w-7"
            style={{ transform: flip ? "scaleX(-1)" : undefined }}
        >
            <g stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <line x1="4" y1="1" x2="9" y2="5" />
                <line x1="0" y1="10" x2="12" y2="10" />
                <line x1="3" y1="19" x2="10" y2="14" />
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

            <p className="text-sm font-black uppercase tracking-[0.3em] text-blush-900 sm:text-base">
                Strips Remaining
            </p>

            {/* Tile row + "And Counting" share this stretch column so the divider
                lines below always span exactly to the tile row's own width, no
                matter how many digits are currently showing. */}
            <div className="flex flex-col items-stretch gap-4">
                <div className="flex items-center justify-center gap-0.5 sm:gap-1">
                    {chars.map((ch, i) =>
                        ch === "," ? (
                            <span key={i} className="relative top-2 w-2.5 text-2xl font-black text-blush-900 sm:w-3 sm:text-3xl">
                                ,
                            </span>
                        ) : (
                            <div
                                key={i}
                                className="flex items-center justify-center rounded-md bg-blush-50"
                                style={{ height: TILE_HEIGHT, width: TILE_WIDTH }}
                            >
                                {remaining !== null ? <DigitRoller digit={Number(ch)} /> : (
                                    <span
                                        className="inline-block text-center font-black text-blush-900"
                                        style={{ fontSize: "2.6rem", transform: "scaleY(1.1)" }}
                                    >
                                        {ch}
                                    </span>
                                )}
                            </div>
                        )
                    )}
                </div>

                <div className="flex items-center gap-3">
                    <span aria-hidden className="h-px flex-1 bg-blush-600" />
                    <p className="shrink-0 text-sm font-bold uppercase tracking-[0.3em] text-blush-950/60">
                        And Counting
                    </p>
                    <span aria-hidden className="h-px flex-1 bg-blush-600" />
                </div>
            </div>

        </div>
    )
}
