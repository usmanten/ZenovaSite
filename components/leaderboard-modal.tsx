"use client"

import { useEffect, useRef, useState } from "react"
import Link from "next/link"
import { AnimatePresence, motion } from "motion/react"
import { ArrowRight, Crown, DollarSign, Package, ShoppingCart, BarChart3, Trophy, X } from "lucide-react"

const POLL_INTERVAL_MS = 30000

type Entry = { rank: number; name: string; strips: number; orders: number }
type LeaderboardData = { entries: Entry[]; claimed: number; remaining: number; total: number }

const REWARD_BY_RANK: Record<number, string> = {
    1: "250",
    2: "150",
    3: "75",
}

const PODIUM_ORDER = [2, 1, 3] // 2nd, 1st, 3rd — center-elevated layout

const HOW_IT_WORKS_STEPS = [
    { num: "01", icon: ShoppingCart, title: "Order", description: "Every verified Zenova purchase counts." },
    { num: "02", icon: BarChart3, title: "Climb", description: "Every strip purchased pushes you higher." },
    { num: "03", icon: Trophy, title: "Win", description: "Top members win cash prizes when the promo ends." },
]

const MEDAL_BORDER_BY_RANK: Record<number, string> = {
    1: "border-amber-500", // gold
    2: "border-[#C0C0C0]", // silver
    3: "border-[#CD7F32]", // bronze
}

function PodiumCard({ entry }: { entry?: Entry }) {
    const isFirst = entry?.rank === 1

    return (
        <div
            className={`flex flex-col items-center gap-2 rounded-2xl bg-white px-3 py-5 text-center shadow-md shadow-black/10 ring-1 ring-black/5 ${isFirst ? "-translate-y-3 pb-6" : ""
                }`}
        >
            {isFirst && <Crown className="size-6 text-amber-500" aria-hidden />}
            <span className="flex size-7 items-center justify-center rounded-full bg-blush-100 text-xs font-bold text-blush-900">
                {entry?.rank ?? "—"}
            </span>
            <p className="truncate text-sm font-bold text-blush-950">{entry?.name ?? "—"}</p>
            <p className="font-black text-blush-900" style={{ fontSize: isFirst ? "1.75rem" : "1.4rem" }}>
                {entry ? entry.strips.toLocaleString() : "—"}
            </p>
            <p className="text-[10px] font-bold uppercase tracking-widest text-blush-950/50">Strips Claimed</p>
            {entry && (
                <span
                    className={`mt-1 inline-flex items-center gap-1 rounded-full border-2 bg-blush-700 px-3.5 py-1.5 text-sm font-black text-white shadow-sm ${MEDAL_BORDER_BY_RANK[entry.rank] ?? "border-transparent"
                        }`}
                >
                    <DollarSign className="size-3.5" aria-hidden />
                    {REWARD_BY_RANK[entry.rank]}
                </span>
            )}
        </div>
    )
}

export default function LeaderboardModal({ open, onClose }: { open: boolean; onClose: () => void }) {
    const [data, setData] = useState<LeaderboardData | null>(null)
    const pollRef = useRef<ReturnType<typeof setInterval> | null>(null)

    useEffect(() => {
        if (!open) return

        let cancelled = false

        const fetchLeaderboard = async () => {
            try {
                const res = await fetch("/api/leaderboard", { cache: "no-store" })
                if (!res.ok) return
                const json = await res.json()
                if (!cancelled) setData(json)
            } catch {
                // silently skip a failed poll — keep showing the last known value
            }
        }

        fetchLeaderboard()
        pollRef.current = setInterval(fetchLeaderboard, POLL_INTERVAL_MS)

        return () => {
            cancelled = true
            if (pollRef.current) clearInterval(pollRef.current)
        }
    }, [open])

    useEffect(() => {
        if (!open) return

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = "hidden"

        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "Escape") onClose()
        }
        window.addEventListener("keydown", handleKeyDown)

        return () => {
            document.body.style.overflow = previousOverflow
            window.removeEventListener("keydown", handleKeyDown)
        }
    }, [open, onClose])

    const entries = data?.entries ?? []
    const claimed = data?.claimed ?? 0
    const remaining = data?.remaining ?? 0
    const total = data?.total ?? 1
    const progressPct = Math.min(100, (claimed / total) * 100)

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                >
                    <motion.div
                        className="relative flex max-h-[85vh] w-full max-w-2xl flex-col overflow-hidden rounded-3xl bg-blush-50"
                        initial={{ opacity: 0, scale: 0.95, y: 10 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95, y: 10 }}
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                        role="dialog"
                        aria-modal="true"
                        aria-label="Zenova Leaderboard"
                    >
                        <button
                            onClick={onClose}
                            aria-label="Close leaderboard"
                            className="absolute right-4 top-4 z-10 flex size-9 items-center justify-center rounded-full bg-white/80 text-blush-950 shadow-md ring-1 ring-black/5 transition-colors hover:bg-white"
                        >
                            <X className="size-4" />
                        </button>

                        <div className="overflow-y-auto px-6 py-8 sm:px-10 sm:py-10">

                            {/* Header */}
                            <div className="flex flex-col items-center gap-3 text-center">
                                <span className="inline-flex items-center gap-1.5 rounded-full bg-blush-900 px-4 py-1.5 text-[10px] font-bold uppercase tracking-widest text-white">
                                    <span className="relative flex size-1.5">
                                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/80" />
                                        <span className="relative inline-flex size-1.5 rounded-full bg-white" />
                                    </span>
                                    Live Leaderboard
                                </span>
                                <h2
                                    className="font-black leading-[0.95] tracking-tight"
                                    style={{ fontSize: "clamp(1.5rem, 3.5vw, 2.25rem)" }}
                                >
                                    <span className="text-black">The Zenova Leaderboard.</span>
                                    <br />
                                    <span className="text-blush-700">Who&apos;s Leading the Energy Revolution?</span>
                                </h2>
                                <p className="max-w-md text-sm font-medium text-black/70">
                                    Earn your spot every time you order Zenova. Climb the ranks and see who&apos;s on top.
                                </p>
                            </div>

                            {/* Stats bar */}
                            <div className="mt-8">
                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                    <div className="flex items-center gap-3 rounded-2xl bg-blush-100/70 px-4 py-4 sm:px-5">
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blush-200/80 text-blush-900">
                                            <Package className="size-5" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-xl font-black text-blush-900 sm:text-2xl">
                                                {claimed.toLocaleString()}
                                            </p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-blush-950/50">
                                                Strips Claimed
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-3 rounded-2xl bg-blush-100/70 px-4 py-4 sm:px-5">
                                        <span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-blush-200/80 text-blush-900">
                                            <Package className="size-5" />
                                        </span>
                                        <div className="min-w-0">
                                            <p className="truncate text-xl font-black text-blush-900 sm:text-2xl">
                                                {remaining.toLocaleString()}
                                            </p>
                                            <p className="text-[10px] font-bold uppercase tracking-widest text-blush-950/50">
                                                Strips Remaining
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <div className="mt-4 h-3 w-full overflow-hidden rounded-full bg-blush-100">
                                    <motion.div
                                        className="h-full rounded-full bg-blush-700"
                                        initial={{ width: 0 }}
                                        animate={{ width: `${progressPct}%` }}
                                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                    />
                                </div>
                                <div className="mt-2 flex items-center justify-between">
                                    <div>
                                        <p className="font-black text-blush-900">{claimed.toLocaleString()}</p>
                                        <p className="text-xs text-black/50">claimed</p>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-black text-blush-900">{total.toLocaleString()}</p>
                                        <p className="text-xs text-black/50">total strips</p>
                                    </div>
                                </div>
                            </div>

                            {entries.length === 0 ? (
                                <div className="mt-10 rounded-2xl bg-white px-6 py-10 text-center shadow-md shadow-black/10 ring-1 ring-black/5">
                                    <p className="font-bold text-blush-950">No claims yet — be the first on the board!</p>
                                </div>
                            ) : (
                                <>
                                    {/* Podium */}
                                    <div className="mt-10 grid grid-cols-3 items-end gap-3">
                                        {PODIUM_ORDER.map((rank) => (
                                            <PodiumCard key={rank} entry={entries.find((e) => e.rank === rank)} />
                                        ))}
                                    </div>

                                    {/* Top 10 table */}
                                    <div className="mt-8 overflow-hidden rounded-2xl bg-white shadow-md shadow-black/10 ring-1 ring-black/5">
                                        <div className="grid grid-cols-[2rem_1fr_4rem_3.5rem] gap-3 border-b border-black/5 px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-blush-950/50 sm:px-6">
                                            <span>#</span>
                                            <span>Member</span>
                                            <span className="text-right">Strips</span>
                                            <span className="text-right">Orders</span>
                                        </div>
                                        {entries.map((entry) => (
                                            <div
                                                key={entry.rank}
                                                className="grid grid-cols-[2rem_1fr_4rem_3.5rem] items-center gap-3 border-b border-black/5 px-4 py-3 text-sm last:border-b-0 sm:px-6"
                                            >
                                                <span className="font-bold text-blush-950/60">{entry.rank}</span>
                                                <span className="truncate font-bold text-blush-950">{entry.name}</span>
                                                <span className="text-right font-bold text-blush-900">{entry.strips.toLocaleString()}</span>
                                                <span className="text-right text-blush-950/60">{entry.orders}</span>
                                            </div>
                                        ))}
                                    </div>
                                </>
                            )}

                            {/* How It Works */}
                            <div className="mt-10">
                                <h3 className="text-xl font-black text-blush-950 sm:text-2xl">How It Works</h3>
                                <p className="mt-1 text-sm text-black/60">
                                    It&apos;s simple. Every purchase gets you closer to the top.
                                </p>
                                <div className="mt-5 flex flex-col gap-3 sm:flex-row sm:items-stretch">
                                    {HOW_IT_WORKS_STEPS.map((step, i) => (
                                        <div key={step.title} className="flex flex-1 items-center gap-3 sm:items-stretch">
                                            <div className="flex-1 rounded-2xl border border-black/10 bg-white px-4 py-4">
                                                <div className="flex items-center gap-2">
                                                    <span className="flex size-7 shrink-0 items-center justify-center rounded-full bg-blush-100 text-xs font-bold text-blush-900">
                                                        {step.num}
                                                    </span>
                                                    <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-blush-100 text-blush-700">
                                                        <step.icon className="size-4" />
                                                    </span>
                                                </div>
                                                <p className="mt-3 font-bold text-blush-950">{step.title}</p>
                                                <p className="mt-1 text-xs leading-relaxed text-black/60">{step.description}</p>
                                            </div>
                                            {i < HOW_IT_WORKS_STEPS.length - 1 && (
                                                <ArrowRight className="hidden size-5 shrink-0 text-blush-300 sm:block" aria-hidden />
                                            )}
                                        </div>
                                    ))}
                                </div>
                                <p className="mt-4 text-xs text-black/50">
                                    Don&apos;t want to appear on the leaderboard? You can opt out anytime using the link in your order confirmation email.
                                </p>
                            </div>

                            {/* CTA */}
                            <Link
                                href="/catalog#products"
                                onClick={onClose}
                                className="group mt-8 flex items-center justify-center gap-2 rounded-full bg-blush-700 px-8 py-4 text-sm font-bold text-white transition-all hover:scale-[1.02] hover:bg-blush-800 active:scale-[0.98]"
                            >
                                Shop Now to Win Rewards
                                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
