"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

type Cell = string | boolean

const tableRows: { feature: string; zenova: Cell; coffee: Cell; energy: Cell }[] = [
    { feature: "Caffeine per serving",      zenova: "50 mg, every strip",  coffee: "Varies by cup",           energy: "Varies by brand" },
    { feature: "Absorption speed",          zenova: "Within 15 min",       coffee: "30+ min",                  energy: "30+ min" },
    { feature: "Paired with L-theanine",    zenova: "30 mg",               coffee: "None",                     energy: "Varies by brand" },
    { feature: "Sugar",                     zenova: "0 g",                 coffee: "Depends on add-ins",       energy: "Often added" },
    { feature: "Cost per serving",          zenova: "$0.59–$0.80",         coffee: "$3+ at a café",            energy: "$2+ per can" },
    { feature: "Fits in your pocket",       zenova: true,                  coffee: false,                      energy: false },
]

export default function ScienceComparison() {
    const chartCopyRef = useRef<HTMLDivElement>(null)
    const chartVisualRef = useRef<HTMLDivElement>(null)
    const tableCopyRef = useRef<HTMLDivElement>(null)
    const tableVisualRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const groups = [
            { copy: chartCopyRef.current, visual: chartVisualRef.current },
            { copy: tableCopyRef.current, visual: tableVisualRef.current },
        ]

        const triggers: ScrollTrigger[] = []

        groups.forEach(({ copy, visual }) => {
            if (!copy || !visual) return

            gsap.set(copy, { opacity: 0, y: 30 })
            gsap.set(visual, { opacity: 0, y: 30 })

            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: copy,
                    start: "top 80%",
                    toggleActions: "play none none none",
                },
            })

            tl.to(copy, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0)
                .to(visual, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0.15)

            if (tl.scrollTrigger) triggers.push(tl.scrollTrigger)
        })

        return () => {
            triggers.forEach(st => st.kill())
        }
    }, [])

    return (
        <div>

            {/* ── Absorption Chart ─────────────────────────────────────────── */}
            <section className="bg-blush-300 py-20 px-6 md:py-44 md:px-12">
                <div className="mx-auto grid max-w-7xl items-center gap-12 md:grid-cols-[0.75fr_1.75fr]">

                    {/* Left copy */}
                    <div ref={chartCopyRef} style={{ willChange: "transform, opacity" }}>
                        <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.4em] text-black">The Science</p>
                        <h2
                            className="mb-8 font-black leading-[0.88] tracking-tight text-black"
                            style={{ fontSize: "clamp(2.4rem, 4.5vw, 4rem)" }}
                        >
                            Caffeine<br />Absorption<br />Over Time
                        </h2>
                        <p className="text-sm leading-relaxed text-black">
                            Zenova strips dissolve under your tongue, delivering caffeine and L-theanine directly into your
                            bloodstream — no digestion required. You hit peak absorption in under 15 minutes. Coffee and
                            energy drinks take 45 minutes or more and lose potency along the way.
                        </p>
                    </div>

                    {/* Right — SVG chart */}
                    <div ref={chartVisualRef} className="rounded-2xl border border-blush-200 bg-blush-50 p-4 pt-6 md:p-8" style={{ willChange: "transform, opacity" }}>
                        <svg viewBox="0 0 600 390" className="w-full" role="img" aria-label="Illustrative chart of caffeine level in the bloodstream over the first 60 minutes after taking Zenova strips, coffee, or an energy drink">
                            {/* Horizontal grid lines */}
                            <line x1="70" y1="30"  x2="580" y2="30"  stroke="#000" strokeOpacity="0.08" strokeWidth="1" />
                            <line x1="70" y1="165" x2="580" y2="165" stroke="#000" strokeOpacity="0.08" strokeWidth="1" />

                            {/* 15-minute marker */}
                            <line x1="197.5" y1="30" x2="197.5" y2="300" stroke="#000" strokeOpacity="0.35" strokeWidth="1" strokeDasharray="4 4" />

                            {/* Axes */}
                            <line x1="70" y1="30"  x2="70"  y2="300" stroke="#000" strokeWidth="1.5" />
                            <line x1="70" y1="300" x2="580" y2="300" stroke="#000" strokeWidth="1.5" />

                            {/* Y-axis labels */}
                            <text x="62" y="34"  fontSize="12" fill="#000" textAnchor="end">High</text>
                            <text x="62" y="304" fontSize="12" fill="#000" textAnchor="end">None</text>
                            <text
                                x="18" y="165" fontSize="12" fill="#000" fontWeight="700"
                                textAnchor="middle" transform="rotate(-90 18 165)"
                            >
                                Caffeine level in your blood
                            </text>

                            {/* X-axis ticks + labels (minutes after taking) */}
                            {[0, 15, 30, 45, 60].map(m => (
                                <g key={m}>
                                    <line x1={70 + m * 8.5} y1="300" x2={70 + m * 8.5} y2="306" stroke="#000" strokeWidth="1.5" />
                                    <text x={70 + m * 8.5} y="322" fontSize="12" fill="#000" textAnchor="middle">{m}</text>
                                </g>
                            ))}
                            <text x="325" y="345" fontSize="12" fill="#000" fontWeight="700" textAnchor="middle">
                                Minutes after taking it
                            </text>

                            {/* Energy Drinks — peaks ~35 min, then crashes */}
                            <path
                                d="M 70,300 C 180,300 260,151 367,151 C 450,151 520,240 580,262"
                                fill="none" stroke="rgba(0,0,0,0.35)" strokeWidth="3" strokeLinecap="round"
                            />

                            {/* Coffee — peaks ~45 min */}
                            <path
                                d="M 70,300 C 200,300 300,111 452,111 C 500,111 550,140 580,160"
                                fill="none" stroke="#c0392b" strokeWidth="3" strokeLinecap="round"
                            />

                            {/* Zenova — peaks ~15 min and stays high */}
                            <path
                                d="M 70,300 C 110,120 150,45 197.5,43 C 300,40 480,60 580,84"
                                fill="none" stroke="#AD5D74" strokeWidth="3.5" strokeLinecap="round"
                            />
                            <circle cx="197.5" cy="43" r="5" fill="#AD5D74" />
                            <text x="207" y="32" fontSize="12" fill="#000" fontWeight="700">Zenova peaks at ~15 min</text>

                            {/* Legend */}
                            <line x1="80"  y1="374" x2="104" y2="374" stroke="#AD5D74" strokeWidth="3.5" strokeLinecap="round" />
                            <text x="110" y="378" fontSize="13" fill="#000">Zenova Strips</text>

                            <line x1="235" y1="374" x2="259" y2="374" stroke="#c0392b" strokeWidth="3" strokeLinecap="round" />
                            <text x="265" y="378" fontSize="13" fill="#000">Coffee</text>

                            <line x1="350" y1="374" x2="374" y2="374" stroke="rgba(0,0,0,0.35)" strokeWidth="3" strokeLinecap="round" />
                            <text x="380" y="378" fontSize="13" fill="#000">Energy Drinks</text>
                        </svg>
                        <p className="mt-2 text-center text-[11px] text-black/70">Illustrative — typical absorption patterns, not a measured dataset.</p>
                    </div>

                </div>
            </section>

            {/* ── Comparison Table ─────────────────────────────────────────── */}
            <section className="bg-white pt-16 pb-44 px-6 md:px-20">
                <div className="mx-auto grid max-w-6xl items-center gap-20 md:grid-cols-[1fr_1.3fr]">

                    {/* Left copy */}
                    <div ref={tableCopyRef} style={{ willChange: "transform, opacity" }}>
                        <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.4em] text-blush-950/60">Head to Head</p>
                        <h2
                            className="mb-8 font-black leading-[0.88] tracking-tight text-blush-950"
                            style={{ fontSize: "clamp(2.4rem, 4.5vw, 4rem)" }}
                        >
                            Why Strips<br />Beat The<br />Rest
                        </h2>
                        <p className="mb-10 text-sm leading-relaxed text-blush-950/70">
                            We stacked Zenova up against the two most popular ways people get their caffeine. It wasn&apos;t close.
                        </p>
                        <Link
                            href="/catalog#products"
                            className="inline-flex items-center gap-2 rounded-full bg-blush-950 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blush-800 active:scale-[0.98]"
                        >
                            Shop Now <ArrowRight className="size-4" />
                        </Link>
                    </div>

                    {/* Right — comparison table */}
                    <div ref={tableVisualRef} className="overflow-hidden rounded-2xl border border-blush-950/10" style={{ willChange: "transform, opacity" }}>
                        {/* Column headers */}
                        <div className="grid grid-cols-4 border-b border-blush-950/10">
                            <div className="p-5" />
                            <div className="flex items-center justify-center border-l border-blush-950/10 bg-blush-100 p-5">
                                <span className="text-center text-sm font-bold leading-tight text-blush-950">Zenova<br />Strips</span>
                            </div>
                            <div className="flex items-center justify-center border-l border-blush-950/10 p-5">
                                <span className="text-sm font-bold text-blush-950">Coffee</span>
                            </div>
                            <div className="flex items-center justify-center border-l border-blush-950/10 p-5">
                                <span className="text-center text-sm font-bold leading-tight text-blush-950">Energy<br />Drinks</span>
                            </div>
                        </div>

                        {/* Rows */}
                        {tableRows.map((row, i) => (
                            <div key={i} className="grid grid-cols-4 border-b border-blush-950/10">
                                <div className="flex items-center p-4 text-xs font-semibold leading-snug text-blush-950">
                                    {row.feature}
                                </div>
                                <div className="flex items-center justify-center border-l border-blush-950/10 bg-blush-100 px-2 py-4 text-center">
                                    <CellValue value={row.zenova} highlight />
                                </div>
                                <div className="flex items-center justify-center border-l border-blush-950/10 px-2 py-4 text-center">
                                    <CellValue value={row.coffee} />
                                </div>
                                <div className="flex items-center justify-center border-l border-blush-950/10 px-2 py-4 text-center">
                                    <CellValue value={row.energy} />
                                </div>
                            </div>
                        ))}

                        {/* Sources */}
                        <p className="px-4 py-3 text-[10px] leading-snug text-blush-950/60">
                            <a href="https://pubmed.ncbi.nlm.nih.gov/14607010/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-blush-950">
                                Source: coffee caffeine content, McCusker 2003
                            </a>
                        </p>
                    </div>

                </div>
            </section>

        </div>
    )
}

function CellValue({ value, highlight = false }: { value: Cell; highlight?: boolean }) {
    if (value === true) return <span className="text-xl font-bold text-blush-700">✓</span>
    if (value === false) return <span className="text-xl text-blush-950/25">✕</span>
    return (
        <span className={highlight ? "text-xs font-bold leading-snug text-blush-950" : "text-xs leading-snug text-blush-950/70"}>
            {value}
        </span>
    )
}
