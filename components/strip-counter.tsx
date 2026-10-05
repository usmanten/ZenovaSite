"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "motion/react"

const POLL_INTERVAL_MS = 20000
const TILE_HEIGHT = 60 // px, keep in sync with the inline style below

function DigitRoller({ digit }: { digit: number }) {
    return (
        <div
            className="relative w-8 overflow-hidden sm:w-10"
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
                        className="flex items-center justify-center font-black text-blush-950"
                        style={{ height: TILE_HEIGHT, fontSize: "2rem" }}
                    >
                        {n}
                    </div>
                ))}
            </motion.div>
        </div>
    )
}

function Flourish({ flip = false }: { flip?: boolean }) {
    return (
        <span
            aria-hidden
            className="h-3.5 w-10"
            style={{
                backgroundImage: "repeating-linear-gradient(115deg, currentColor 0, currentColor 1.5px, transparent 1.5px, transparent 6px)",
                color: "var(--color-blush-400, #E8A0B2)",
                opacity: 0.6,
                transform: flip ? "scaleX(-1)" : undefined,
                maskImage: "linear-gradient(to " + (flip ? "left" : "right") + ", black, transparent)",
                WebkitMaskImage: "linear-gradient(to " + (flip ? "left" : "right") + ", black, transparent)",
            }}
        />
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
                <Flourish />
                <span className="inline-flex items-center gap-1.5 rounded-full bg-blush-600 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
                    <span className="relative flex size-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                    </span>
                    Live
                </span>
                <Flourish flip />
            </div>

            <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blush-950/60">
                Strips Remaining
            </p>

            {/* Digit tiles */}
            <div className="flex items-center gap-1.5">
                {chars.map((ch, i) =>
                    ch === "," ? (
                        <span key={i} className="w-2.5 text-2xl font-black text-blush-950/30">,</span>
                    ) : (
                        <div
                            key={i}
                            className="flex items-center justify-center rounded-xl bg-white shadow-md shadow-black/10 ring-1 ring-black/5"
                            style={{ height: TILE_HEIGHT }}
                        >
                            {remaining !== null ? <DigitRoller digit={Number(ch)} /> : (
                                <span className="w-8 text-center font-black text-blush-950 sm:w-10" style={{ fontSize: "2rem" }}>
                                    {ch}
                                </span>
                            )}
                        </div>
                    )
                )}
            </div>

            <div className="flex items-center gap-3">
                <Flourish />
                <p className="text-[11px] font-bold uppercase tracking-[0.3em] text-blush-950/60">
                    And Counting
                </p>
                <Flourish flip />
            </div>

        </div>
    )
}
