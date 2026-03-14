"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { AnimatedGroup } from "@/components/ui/animated-group"
import {
    animate,
    motion,
    useInView,
    useMotionValue,
    useTransform,
    useScroll,
} from "motion/react"
import { useEffect as useEffectCounter, useRef as useRefCounter } from "react"
import { Leaf, Users, Zap, ShieldCheck, FlaskConical, Target, ArrowRight } from "lucide-react"
import Link from "next/link"

gsap.registerPlugin(ScrollTrigger)

// ─── Animated Counter ─────────────────────────────────────────────────────────

function AnimatedCounter({ from, to, suffix = "" }: { from: number; to: number; suffix?: string }) {
    const count = useMotionValue(from)
    const rounded = useTransform(count, (latest) => Math.round(latest).toLocaleString())
    const ref = useRefCounter<HTMLSpanElement>(null)
    const inView = useInView(ref, { once: true, margin: "0px 0px -80px 0px" })

    useEffectCounter(() => {
        if (inView) {
            animate(count, to, { duration: 2.2, ease: [0.16, 1, 0.3, 1] })
        }
    }, [count, inView, to])

    return (
        <span ref={ref} className="tabular-nums">
            <motion.span>{rounded}</motion.span>
            {suffix}
        </span>
    )
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const stats = [
    { value: 100, suffix: "+", label: "Stores Nationwide" },
    { value: 3,   suffix: "M+", label: "Strips Sold" },
    { value: 3,   suffix: "",   label: "Formulas Developed" },
]

const values = [
    {
        icon: <Leaf className="size-5" />,
        title: "Clean Ingredients",
        description: "We source only premium, naturally derived ingredients. That means free from artificial fillers, sugar, and anything you can't pronounce.",
    },
    {
        icon: <FlaskConical className="size-5" />,
        title: "Science-Backed",
        description: "Every formula is rigorously tested and developed with regards to modern research and studies.",
    },
    {
        icon: <ShieldCheck className="size-5" />,
        title: "Made in the USA",
        description: "Manufactured in FDA-registered, GMP-certified facilities right here at home, so you know exactly what you're getting.",
    },
    {
        icon: <Zap className="size-5" />,
        title: "Rapid Absorption",
        description: "Our cutting-edge strip technology delivers nutrients faster than any pills or gummies, with no water needed.",
    },
    {
        icon: <Target className="size-5" />,
        title: "Clinically Dosed",
        description: "Every active ingredient is included at the dose that research actually supports, never a token amount just to appear on the label.",
    },
    {
        icon: <Users className="size-5" />,
        title: "Community First",
        description: "Built by a team obsessed with wellness, we listen to our community first and let their feedback shape every product we make.",
    },
]

const quoteWords = [
    "Supplements", "shouldn't", "be", "a", "gamble.", "We", "believe", "in",
    "transparency,", "integrity,", "and", "formulas", "that", "actually",
    "deliver", "on", "their", "promises", "—", "because", "you", "deserve",
    "to", "feel", "the", "difference.",
]

// ─── Main Component ───────────────────────────────────────────────────────────

export default function AboutPage() {
    const heroRef    = useRef<HTMLElement>(null)
    const quoteRef   = useRef<HTMLElement>(null)
    const timelineRef = useRef<HTMLDivElement>(null)
    const progressBarRef = useRef<HTMLDivElement>(null)

    const { scrollYProgress } = useScroll({
        target: timelineRef,
        offset: ["start center", "end center"],
    })

    useEffect(() => {
        const ctx = gsap.context(() => {

            // ── Hero parallax ──────────────────────────────────────────────────
            gsap.to(".hero-bg-text", {
                yPercent: -25,
                ease: "none",
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            })
            gsap.to(".hero-content", {
                yPercent: -12,
                ease: "none",
                scrollTrigger: {
                    trigger: heroRef.current,
                    start: "top top",
                    end: "bottom top",
                    scrub: true,
                },
            })

            // ── Stats cards stagger ────────────────────────────────────────────
            gsap.utils.toArray<HTMLElement>(".stat-card").forEach((card, i) => {
                gsap.fromTo(
                    card,
                    { opacity: 0, y: 50 },
                    {
                        opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
                        delay: i * 0.09,
                        scrollTrigger: {
                            trigger: card,
                            start: "top 88%",
                            toggleActions: "play none none reverse",
                        },
                    }
                )
            })

            // ── Quote: GSAP pin + scroll-driven word reveal ────────────────────
            const quoteSection = quoteRef.current
            if (quoteSection) {
                const wordEls    = quoteSection.querySelectorAll(".quote-word")
                const quoteAuthor   = quoteSection.querySelector(".quote-author")
                const quoteDivider  = quoteSection.querySelector(".quote-divider")

                gsap.set(wordEls,   { opacity: 0, y: 28, filter: "blur(10px)" })
                gsap.set([quoteAuthor, quoteDivider], { opacity: 0, y: 20 })

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: quoteSection,
                        pin: true,
                        start: "top top",
                        end: `+=${wordEls.length * 90 + 900}`,
                        scrub: 1.5,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                })

                tl
                    .to(wordEls, {
                        opacity: 1, y: 0, filter: "blur(0px)",
                        stagger: 0.2, duration: 0.9, ease: "power2.out",
                    }, 0)
                    .to(quoteDivider, { opacity: 1, y: 0, duration: 1 }, "-=0.5")
                    .to(quoteAuthor,  { opacity: 1, y: 0, duration: 1.2 }, "-=0.4")
            }

            // ── What we stand for: slide + blur entrance ───────────────────────
            gsap.utils.toArray<HTMLElement>(".milestone-card").forEach((card, i) => {
                const dot = card.querySelector(".milestone-dot")

                gsap.fromTo(
                    card,
                    { opacity: 0, x: i % 2 === 0 ? -90 : 90, filter: "blur(6px)" },
                    {
                        opacity: 1, x: 0, filter: "blur(0px)",
                        duration: 1.1, ease: "power3.out",
                        scrollTrigger: {
                            trigger: card,
                            start: "top 82%",
                            toggleActions: "play none none reverse",
                        },
                    }
                )

                if (dot) {
                    gsap.fromTo(dot,
                        { scale: 0, opacity: 0 },
                        {
                            scale: 1, opacity: 1, duration: 0.55, ease: "back.out(2.5)",
                            delay: 0.35,
                            scrollTrigger: {
                                trigger: card,
                                start: "top 82%",
                                toggleActions: "play none none reverse",
                            },
                        }
                    )
                }
            })

        })

        return () => ctx.revert()
    }, [])

    return (
        <div className="overflow-hidden bg-black text-white">

            {/* ── HERO ─────────────────────────────────────────────────────────── */}
            <section
                ref={heroRef}
                className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-20 pt-28 text-center"
            >
                {/* Subtle grid */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.032] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px]"
                />

                {/* Parallax background word */}
                <div
                    aria-hidden
                    className="hero-bg-text pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 select-none font-black leading-none text-white/[0.028]"
                    style={{ fontSize: "22vw", whiteSpace: "nowrap" }}
                >
                    ZENOVA
                </div>

                {/* Ambient glow */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/2 top-1/2 size-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-[130px]"
                    style={{ backgroundColor: "rgba(255,255,255,0.02)" }}
                />

                <div className="hero-content relative z-10">
                    <AnimatedGroup
                        variants={{
                            container: {
                                visible: { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
                            },
                            item: {
                                hidden:  { opacity: 0, y: 24, filter: "blur(8px)" },
                                visible: {
                                    opacity: 1, y: 0, filter: "blur(0px)",
                                    transition: { type: "spring", bounce: 0.3, duration: 1.4 },
                                },
                            },
                        }}
                        className="flex flex-col items-center gap-6"
                    >
                        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-white/60">
                            <span className="inline-block size-1.5 rounded-full bg-white/40" />
                            Our Story
                        </span>

                        <h1
                            className="max-w-4xl font-black leading-[1.05]"
                            style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
                        >
                            <span className="text-white">We believe supplements</span>
                            <br />
                            <span className="text-white/40">should actually work.</span>
                        </h1>

                        <p className="max-w-2xl text-balance text-lg text-white/60">
                            Zenova was founded by two college students who were tired of supplements
                            that underperform and overcharge. We built a better delivery system and a
                            company that puts integrity first.
                        </p>

                        <div className="mt-2 h-px w-24 bg-gradient-to-r from-transparent via-white/15 to-transparent" />
                    </AnimatedGroup>
                </div>
            </section>

            {/* ── STATS ────────────────────────────────────────────────────────── */}
            <section className="border-y border-white/5 py-24">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="stat-card mb-16 text-center">
                        <span className="text-[10px] font-semibold uppercase tracking-[0.4em] text-white/55">
                            Zenova&apos;s 2026 Projections
                        </span>
                    </div>
                    <div className="grid grid-cols-1 gap-px bg-white/5 md:grid-cols-3">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="stat-card flex flex-col items-center gap-2 bg-black px-6 py-12 text-center"
                            >
                                <span className="text-5xl font-black tabular-nums text-white md:text-6xl">
                                    <AnimatedCounter from={0} to={stat.value} suffix={stat.suffix} />
                                </span>
                                <span className="text-sm text-white/55">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── QUOTE  (GSAP pin + scroll-driven word reveal) ────────────────── */}
            <section
                ref={quoteRef}
                className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-white px-8 text-center text-black"
            >
                <div className="relative z-10 mx-auto max-w-4xl">
                    <blockquote className="text-balance text-3xl font-medium leading-snug md:text-4xl lg:text-[2.8rem]">
                        {quoteWords.map((word, i) => (
                            <span key={i} className="quote-word mr-[0.3em] inline-block last:mr-0">
                                {["feel", "the", "difference."].includes(word)
                                    ? <em>{word}</em>
                                    : word}
                            </span>
                        ))}
                    </blockquote>

                    <div className="quote-divider mx-auto mt-10 h-px w-16 bg-black/15" />

                    <p className="quote-author mt-6 text-sm text-black/45">
                        Mo Khan &amp; Mohamed Eissa, Founders of Zenova
                    </p>
                </div>
            </section>

            {/* ── WHAT WE STAND FOR ─────────────────────────────────────────────── */}
            <section ref={timelineRef} className="py-24 md:py-36">
                <div className="mx-auto max-w-6xl px-6">
                    <div className="mb-20 text-center">
                        <span className="mb-4 inline-block text-[10px] font-semibold uppercase tracking-[0.4em] text-white/55">
                            Our principles
                        </span>
                        <h2
                            className="font-black leading-[1.05] text-white"
                            style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
                        >
                            What we stand for
                        </h2>
                    </div>

                    <div className="relative mx-auto max-w-3xl">
                        {/* Static spine */}
                        <div
                            className="absolute bottom-0 left-1/2 top-0 w-px -translate-x-1/2 bg-white/8"
                            aria-hidden
                        />
                        {/* Scroll-driven fill */}
                        <motion.div
                            ref={progressBarRef}
                            className="absolute left-1/2 top-0 w-px -translate-x-1/2 origin-top bg-white/45"
                            style={{ scaleY: scrollYProgress }}
                            aria-hidden
                        />

                        <div className="flex flex-col gap-16">
                            {values.map((v, i) => (
                                <div
                                    key={v.title}
                                    className={`milestone-card relative flex items-start gap-8 ${
                                        i % 2 === 0 ? "flex-row" : "flex-row-reverse"
                                    }`}
                                >
                                    {/* Content */}
                                    <div
                                        className={`w-[calc(50%-2rem)] ${
                                            i % 2 === 0 ? "text-right" : "text-left"
                                        }`}
                                    >
                                        <div
                                            className={`mb-2 inline-flex size-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/75 transition-all duration-300 hover:border-white/20 hover:bg-white/10 hover:text-white ${
                                                i % 2 === 0 ? "ml-auto flex" : ""
                                            }`}
                                        >
                                            {v.icon}
                                        </div>
                                        <h3 className="mt-1 text-lg font-bold text-white">{v.title}</h3>
                                        <p className="mt-2 text-sm leading-relaxed text-white/60">
                                            {v.description}
                                        </p>
                                    </div>

                                    {/* Spine node */}
                                    <div className="absolute left-1/2 top-2 -translate-x-1/2">
                                        <div className="milestone-dot size-3 rounded-full border-2 border-white/30 bg-black" />
                                    </div>

                                    {/* Spacer */}
                                    <div className="w-[calc(50%-2rem)]" />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ──────────────────────────────────────────────────────────── */}
            <section className="relative flex min-h-[65vh] flex-col items-center justify-center overflow-hidden border-t border-white/5 px-6 text-center">
                {/* Ambient glow blobs */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute left-1/4 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.04)" }}
                />
                <div
                    aria-hidden
                    className="pointer-events-none absolute right-1/4 top-1/2 size-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
                    style={{ backgroundColor: "rgba(255,255,255,0.025)" }}
                />

                <div className="relative z-10 max-w-3xl">
                    <p className="mb-6 text-[10px] font-semibold uppercase tracking-[0.5em] text-white/50">
                        Join the movement
                    </p>

                    <h2
                        className="font-black leading-[1.05] text-white"
                        style={{ fontSize: "clamp(2.5rem, 7vw, 6rem)" }}
                    >
                        Ready to feel
                        <br />
                        <span className="text-white/40">the difference?</span>
                    </h2>

                    <p className="mx-auto mt-6 max-w-xl text-white/60">
                        Join over 50,000 people who've switched to Zenova and never looked back.
                    </p>

                    <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
                        <Link
                            href="/catalog"
                            className="group inline-flex items-center gap-2.5 rounded-full bg-white px-8 py-4 text-sm font-bold text-black transition-all hover:scale-[1.03] hover:opacity-90 active:scale-[0.98]"
                        >
                            Shop Now
                            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
                        </Link>
                        <Link
                            href="/contact"
                            className="inline-flex items-center rounded-full border border-white/10 px-8 py-4 text-sm font-bold text-white/70 transition-colors duration-200 hover:border-white/20 hover:text-white"
                        >
                            Get in Touch
                        </Link>
                    </div>
                </div>
            </section>

        </div>
    )
}
