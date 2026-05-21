"use client"

import Link from "next/link"
import { ArrowRight } from "lucide-react"

const tableRows = [
    { feature: "Fast Absorption (< 15 min)" },
    { feature: "Convenient & Portable"       },
    { feature: "Zero Sugar"                  },
    { feature: "No Jitters or Crash"         },
    { feature: "Exact Dose Every Time"       },
]

export default function ScienceComparison() {
    return (
        <div className="bg-black">

            {/* ── Absorption Chart ─────────────────────────────────────────── */}
            <section className="py-20 md:py-44 px-6 md:px-20">
                <div className="mx-auto grid max-w-6xl items-center gap-20 md:grid-cols-[1fr_1.3fr]">

                    {/* Left copy */}
                    <div>
                        <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.4em] text-white">The Science</p>
                        <h2
                            className="mb-8 font-black leading-[0.88] tracking-tight text-white"
                            style={{ fontSize: "clamp(2.4rem, 4.5vw, 4rem)" }}
                        >
                            Caffeine<br />Absorption<br />Over Time
                        </h2>
                        <p className="text-sm leading-relaxed text-white">
                            Zenova strips dissolve under your tongue, delivering caffeine and L-theanine directly into your
                            bloodstream — no digestion required. You hit peak absorption in under 15 minutes. Coffee and
                            energy drinks take 45 minutes or more and lose potency along the way.
                        </p>
                    </div>

                    {/* Right — SVG chart */}
                    <div className="rounded-2xl border border-white/8 bg-white/[0.015] p-6 pt-8">
                        <svg viewBox="0 0 500 220" className="w-full" aria-hidden>
                            {/* Horizontal grid lines */}
                            <line x1="82" y1="22"  x2="488" y2="22"  stroke="white" strokeOpacity="0.06" strokeWidth="1" />
                            <line x1="82" y1="90"  x2="488" y2="90"  stroke="white" strokeOpacity="0.06" strokeWidth="1" />
                            <line x1="82" y1="158" x2="488" y2="158" stroke="white" strokeOpacity="0.06" strokeWidth="1" />

                            {/* Y-axis rotated label */}
                            <text
                                x="11" y="90" fontSize="6.5" fill="rgba(255,255,255,0.4)"
                                fontWeight="700" letterSpacing="3" textAnchor="middle" fontFamily="monospace"
                                transform="rotate(-90 11 90)"
                            >
                                CAFFEINE ABSORPTION
                            </text>

                            {/* Y-axis tick labels */}
                            <text x="78" y="26"  fontSize="8" fill="white" textAnchor="end">Peak</text>
                            <text x="78" y="94"  fontSize="8" fill="white" textAnchor="end">Optimal</text>
                            <text x="78" y="162" fontSize="8" fill="white" textAnchor="end">Minimal</text>

                            {/* Energy Drinks — drawn first (bottom layer) */}
                            <path
                                d="M 82,172 C 155,172 210,108 275,105 C 365,105 440,165 488,168"
                                fill="none" stroke="rgba(255,255,255,0.4)" strokeWidth="1.8" strokeLinecap="round"
                            />

                            {/* Coffee — drawn second, peak at y=86, always below Zenova */}
                            <path
                                d="M 82,172 C 140,172 200,88 260,86 C 340,86 415,152 488,155"
                                fill="none" stroke="#c0392b" strokeWidth="1.8" strokeLinecap="round"
                            />

                            {/* Zenova — drawn last (top layer), sqrt(x) arc, always highest */}
                            <path
                                d="M 82,172 C 120,60 280,18 488,15"
                                fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"
                            />

                            {/* Legend */}
                            <line x1="88"  y1="207" x2="106" y2="207" stroke="white" strokeWidth="1.5" />
                            <text x="111" y="210" fontSize="8.5" fill="white">Zenova Strips</text>

                            <line x1="205" y1="207" x2="223" y2="207" stroke="#c0392b" strokeWidth="1.5" />
                            <text x="228" y="210" fontSize="8.5" fill="white">Coffee</text>

                            <line x1="290" y1="207" x2="308" y2="207" stroke="rgba(255,255,255,0.4)" strokeWidth="1.5" />
                            <text x="313" y="210" fontSize="8.5" fill="white">Energy Drinks</text>
                        </svg>
                    </div>

                </div>
            </section>

            {/* ── Comparison Table ─────────────────────────────────────────── */}
            <section className="pt-16 pb-44 px-6 md:px-20">
                <div className="mx-auto grid max-w-6xl items-center gap-20 md:grid-cols-[1fr_1.3fr]">

                    {/* Left copy */}
                    <div>
                        <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.4em] text-white">Head to Head</p>
                        <h2
                            className="mb-8 font-black leading-[0.88] tracking-tight text-white"
                            style={{ fontSize: "clamp(2.4rem, 4.5vw, 4rem)" }}
                        >
                            Why Strips<br />Beat The<br />Rest
                        </h2>
                        <p className="mb-10 text-sm leading-relaxed text-white">
                            We stacked Zenova up against the two most popular ways people get their caffeine. It wasn't close.
                        </p>
                        <Link
                            href="/catalog#products"
                            className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-black transition-all hover:opacity-90 active:scale-[0.98]"
                        >
                            Shop Now <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    {/* Right — comparison table */}
                    <div className="overflow-hidden rounded-2xl border border-white/8">
                        {/* Column headers */}
                        <div className="grid grid-cols-4 border-b border-white/8">
                            <div className="p-5" />
                            <div className="flex items-center justify-center border-l border-white/8 bg-white/[0.05] p-5">
                                <span className="text-center text-sm font-bold leading-tight text-white">Zenova<br />Strips</span>
                            </div>
                            <div className="flex items-center justify-center border-l border-white/8 p-5">
                                <span className="text-sm font-bold text-white">Coffee</span>
                            </div>
                            <div className="flex items-center justify-center border-l border-white/8 p-5">
                                <span className="text-center text-sm font-bold leading-tight text-white">Energy<br />Drinks</span>
                            </div>
                        </div>

                        {/* Rows */}
                        {tableRows.map((row, i) => (
                            <div key={i} className="grid grid-cols-4 border-b border-white/8 last:border-0">
                                <div className="flex items-center p-5 text-xs leading-snug text-white">
                                    {row.feature}
                                </div>
                                <div className="flex items-center justify-center border-l border-white/8 bg-white/[0.03] py-5">
                                    <span className="text-xl font-bold text-white">✓</span>
                                </div>
                                <div className="flex items-center justify-center border-l border-white/8 py-5">
                                    <span className="text-xl text-white/30">✕</span>
                                </div>
                                <div className="flex items-center justify-center border-l border-white/8 py-5">
                                    <span className="text-xl text-white/30">✕</span>
                                </div>
                            </div>
                        ))}
                    </div>

                </div>
            </section>

        </div>
    )
}
