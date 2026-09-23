"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Link from "next/link"
import { ArrowRight, ChevronRight } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

type Cell = string | boolean

const tableRows: { feature: string; zenova: Cell; coffee: Cell; energy: Cell }[] = [
    { feature: "Caffeine per serving",      zenova: "50 mg, every strip",  coffee: "Varies by cup",           energy: "Varies by brand" },
    { feature: "Absorption speed",          zenova: "Within 5 min",       coffee: "30+ min",                  energy: "30+ min" },
    { feature: "Paired with L-theanine",    zenova: "30 mg",               coffee: "None",                     energy: "Varies by brand" },
    { feature: "Sugar",                     zenova: "0 g",                 coffee: "Depends on add-ins",       energy: "Often added" },
    { feature: "Cost per serving",          zenova: "$0.59–$0.80",         coffee: "$3+ at a café",            energy: "$2+ per can" },
    { feature: "Fits in your pocket",       zenova: true,                  coffee: false,                      energy: false },
]

const blocks = [
    {
        number: "01",
        title: "Under your tongue, not your gut.",
        body: "No swallowing, no waiting on digestion. The strip melts in seconds and is absorbed through the lining of your mouth, so it reaches you in under 5 minutes instead of 30 or more.",
    },
    {
        number: "02",
        title: "A steady lift. No crash.",
        body: "A measured dose of caffeine, paired with L-theanine and no sugar, so there’s no spike and nothing to come down from.",
    },
    {
        number: "03",
        title: "How it stacks up.",
        body: "We put Zenova up against the two most popular ways people get their caffeine. It wasn’t close.",
    },
]

export default function ScienceComparison() {
    const headingRef = useRef<HTMLDivElement>(null)
    const blockRefs = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const heading = headingRef.current
        const els = blockRefs.current.filter(Boolean) as HTMLDivElement[]
        if (!heading || els.length === 0) return

        const targets = [heading, ...els]
        gsap.set(targets, { opacity: 0, y: 30 })

        const timelines = targets.map(el => {
            const tl = gsap.timeline({
                scrollTrigger: { trigger: el, start: "top 85%", toggleActions: "play none none none" },
            })
            tl.to(el, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" })
            return tl
        })

        return () => {
            timelines.forEach(tl => {
                tl.scrollTrigger?.kill()
                tl.kill()
            })
        }
    }, [])

    return (
        <section className="bg-blush-300 px-6 py-20 md:px-12 md:py-32">
            <div className="mx-auto max-w-4xl">

                {/* Heading */}
                <div ref={headingRef} className="mb-14 text-center md:mb-20" style={{ willChange: "transform, opacity" }}>
                    <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.4em] text-black">The Science</p>
                    <h2
                        className="font-black leading-[0.9] tracking-tight text-black"
                        style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
                    >
                        Why Strips Beat The Rest
                    </h2>
                </div>

                <div className="flex flex-col gap-14 md:gap-20">
                    {blocks.map((b, i) => (
                        <div key={b.number} ref={el => { blockRefs.current[i] = el }} style={{ willChange: "transform, opacity" }}>
                            <p className="mb-2 font-mono text-xs font-bold text-black/60">{b.number}</p>
                            <h3
                                className="mb-3 font-black leading-[0.95] tracking-tight text-black"
                                style={{ fontSize: "clamp(1.75rem, 3vw, 2.5rem)" }}
                            >
                                {b.title}
                            </h3>
                            <p className="mb-6 max-w-xl text-sm leading-relaxed text-black">{b.body}</p>

                            {i === 0 && <RouteDiagram />}
                            {i === 1 && <NoCrash />}
                            {i === 2 && <CompareTable />}
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

/* ── 01: the two routes, each ending in its time ─────────────────────── */
function RouteDiagram() {
    return (
        <div className="rounded-2xl border border-blush-950/10 bg-white p-5 md:p-8">
            <Route
                label="Zenova Strip"
                accent
                nodes={["Under your tongue", "Bloodstream"]}
                time="Within 5 min"
            />
            <div className="my-6 border-t border-dashed border-black/15" />
            <Route
                label="Coffee or energy drink"
                nodes={["Swallowed", "Stomach", "Gut", "Bloodstream"]}
                time="30+ min"
            />
        </div>
    )
}

function Route({ label, nodes, time, accent = false }: { label: string; nodes: string[]; time: string; accent?: boolean }) {
    return (
        <div>
            <div className="mb-3 flex items-center justify-between gap-3">
                <p className="text-xs font-black uppercase tracking-widest text-black">{label}</p>
                <span
                    className={
                        "shrink-0 rounded-full px-3 py-1 text-xs font-black " +
                        (accent ? "bg-blush-700 text-white" : "bg-black/10 text-black")
                    }
                >
                    {time}
                </span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
                {nodes.map((n, i) => (
                    <div key={n} className="flex items-center gap-2">
                        <span
                            className={
                                "rounded-full bg-blush-100 px-3.5 py-2 text-xs font-bold text-black " +
                                (accent ? "ring-1 ring-blush-700/40" : "")
                            }
                        >
                            {n}
                        </span>
                        {i < nodes.length - 1 && <ChevronRight className="size-4 text-black/40" aria-hidden />}
                    </div>
                ))}
            </div>
        </div>
    )
}

/* ── 02: why there's no crash ────────────────────────────────────────── */
const crashReasons = [
    { stat: "0 g",   label: "Sugar",       note: "Nothing to spike and drop." },
    { stat: "50 mg", label: "Caffeine",    note: "One exact, measured dose." },
    { stat: "30 mg", label: "L-theanine",  note: "Paired in for a smoother feel." },
]

function NoCrash() {
    return (
        <div className="overflow-hidden rounded-2xl border border-blush-950/10 bg-white">
            {crashReasons.map((r, i) => (
                <div
                    key={r.label}
                    className={"flex items-center gap-5 p-5 md:gap-8 md:p-7 " + (i > 0 ? "border-t border-blush-950/10" : "")}
                >
                    <span
                        className="w-24 shrink-0 font-black leading-none tracking-tight text-blush-700 md:w-32"
                        style={{ fontSize: "clamp(1.75rem, 3.5vw, 2.75rem)" }}
                    >
                        {r.stat}
                    </span>
                    <div>
                        <p className="text-sm font-black text-black">{r.label}</p>
                        <p className="text-sm text-black/70">{r.note}</p>
                    </div>
                </div>
            ))}

            {/* Explainer */}
            <div className="border-t border-blush-950/10 bg-blush-100 p-5 md:p-7">
                <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.3em] text-black">What&apos;s L-theanine?</p>
                <p className="text-sm leading-relaxed text-black">
                    An amino acid found naturally in tea leaves, and one of the most popular partners for caffeine.
                    In studies, the two together have been linked to better attention and alertness than caffeine alone.
                </p>
                <a
                    href="https://pubmed.ncbi.nlm.nih.gov/18681988/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-3 inline-block text-[11px] text-black/60 underline underline-offset-2 hover:text-black"
                >
                    Source: Owen et al. 2008
                </a>
            </div>
        </div>
    )
}

/* ── 03: comparison table + CTA ──────────────────────────────────────── */
function CompareTable() {
    return (
        <>
            <div className="overflow-hidden rounded-2xl border border-blush-950/10 bg-white">
                <div className="grid grid-cols-4 border-b border-blush-950/10">
                    <div className="p-4" />
                    <div className="flex items-center justify-center border-l border-blush-950/10 bg-blush-100 p-4">
                        <span className="text-center text-sm font-bold leading-tight text-blush-950">Zenova<br />Strips</span>
                    </div>
                    <div className="flex items-center justify-center border-l border-blush-950/10 p-4">
                        <span className="text-sm font-bold text-blush-950">Coffee</span>
                    </div>
                    <div className="flex items-center justify-center border-l border-blush-950/10 p-4">
                        <span className="text-center text-sm font-bold leading-tight text-blush-950">Energy<br />Drinks</span>
                    </div>
                </div>

                {tableRows.map((row, i) => (
                    <div key={i} className="grid grid-cols-4 border-b border-blush-950/10">
                        <div className="flex items-center p-3 text-xs font-semibold leading-snug text-blush-950 md:p-4">{row.feature}</div>
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

                <p className="px-4 py-3 text-[10px] leading-snug text-blush-950/60">
                    <a href="https://pubmed.ncbi.nlm.nih.gov/14607010/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-blush-950">
                        Source: coffee caffeine content, McCusker 2003
                    </a>
                    {" · "}
                    <a href="https://pubmed.ncbi.nlm.nih.gov/6832208/" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-blush-950">
                        Source: oral caffeine absorption time, Blanchard &amp; Sawers 1983
                    </a>
                </p>
            </div>

            <div className="mt-10 flex justify-center">
                <Link
                    href="/catalog#products"
                    className="inline-flex items-center gap-2 rounded-full bg-blush-950 px-6 py-3 text-sm font-bold text-white transition-all hover:bg-blush-800 active:scale-[0.98]"
                >
                    Shop Now <ArrowRight className="size-4" />
                </Link>
            </div>
        </>
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
