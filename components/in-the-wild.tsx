"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import Link from "next/link"
import { ArrowUpRight, Camera } from "lucide-react"
import Marquee from "@/components/blocks/wall-of-love-02/marquee"

gsap.registerPlugin(ScrollTrigger)

type Moment = { src?: string; pos?: string; alt: string; text: string; name: string }

// Photos live in public/wild/. `pos` is the crop focal point (object-position).
// Cards without a `src` render a pink placeholder. Keep each photo paired with
// its own customer's review.
const moments: Moment[] = [
    { src: "/wild/car.jpg",     pos: "50% 55%", alt: "Zenova box on a car center console",           text: "Really no crash!! works",                                     name: "Aisha Okonkwo" },
    { src: "/wild/subway.jpg",  pos: "50% 55%", alt: "Zenova box held up on the subway",       text: "Dissolves in like 2 seconds. Kind of satisfying actually.",             name: "Mei-Lin Torres" },
    { src: "/wild/bag.jpg",     pos: "50% 45%", alt: "Zenova box tucked in a bag with a charger",    text: "Threw one in my bag before the gym for preworkout and haven't stopped since.",         name: "Marcus Chen" },
    { src: "/wild/pocket.jpg",  pos: "50% 45%", alt: "Zenova box in a jeans pocket",             text: "Used it before a presentation, felt locked in the whole time.",         name: "Caleb Osei" },
    { src: "/wild/packs.jpg",   pos: "50% 50%", alt: "Two Zenova boxes and loose strips on a rug",   text: "Zero crash when it wears off. That alone is why I'm on my third pack.", name: "Jordan Williams" },
    { src: "/wild/tracks.jpg",  pos: "50% 53%", alt: "Zenova box held up at a train platform",                 text: "Clean ingredients, nothing sketchy in it. That matters to me.",         name: "Omar Al-Hassan" },
    { src: "/wild/drawer.jpg",  pos: "50% 50%", alt: "Zenova box in a travel drawer",                text: "Took one on a 6am flight. No coffee needed.",                           name: "Ravi Patel" },
    { src: "/wild/shelf.jpg",   pos: "50% 45%", alt: "Zenova box on a store counter display",        text: "Switched from energy drinks and my stomach is so much happier.",        name: "Tyler Nguyen" },
    { src: "/wild/counter.jpg", pos: "50% 65%", alt: "Zenova box on a kitchen counter",              text: "Basically replaced my afternoon coffee.",                 name: "Sofia Reyes" },
    { src: "/wild/wallet.jpg",  pos: "50% 48%", alt: "Zenova strip packets in a wallet",             text: "Fits in my wallet. That's the whole review.",                           name: "Anonymous Buyer" },
]

export default function InTheWild({ compact = false, altBg = false }: { compact?: boolean; altBg?: boolean }) {
    const headingRef = useRef<HTMLDivElement>(null)
    const rowRef = useRef<HTMLDivElement>(null)
    const ctaRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const heading = headingRef.current
        const row = rowRef.current
        const cta = ctaRef.current
        if (!heading || !row || !cta) return

        gsap.set([heading, row, cta], { opacity: 0, y: 30 })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heading,
                start: "top 80%",
                toggleActions: "play none none none",
            },
        })

        tl.to(heading, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0)
            .to(row, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.25)
            .to(cta, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.45)

        return () => {
            tl.scrollTrigger?.kill()
            tl.kill()
        }
    }, [])

    return (
        <section
            id="reviews"
            className={
                "py-20 md:py-32 " +
                (altBg
                    ? "bg-white"
                    : compact
                        ? "bg-gradient-to-b from-blush-200 to-blush-300"
                        : "bg-gradient-to-b from-blush-50 to-blush-100")
            }
        >
            <style>{`
                @keyframes marquee {
                    from { transform: translate3d(0, 0, 0); }
                    to { transform: translate3d(calc(-100% - 1rem), 0, 0); }
                }
                .animate-marquee {
                    animation: marquee 20s linear infinite;
                }
            `}</style>

            <div
                ref={headingRef}
                className="mx-auto max-w-6xl px-6 pb-14 text-center md:pb-16"
                style={{ willChange: "transform, opacity" }}
            >
                <h2
                    className="font-black leading-[0.9] tracking-tight text-black md:whitespace-nowrap"
                    style={{ fontSize: "clamp(2rem, 4.6vw, 4rem)" }}
                >
                    What Our Customers <span className="text-blush-900">Are Saying</span>
                </h2>
            </div>

            <div className="relative flex w-full flex-col items-center justify-center overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_12%,black_88%,transparent)]">
                <Marquee ref={rowRef} pauseOnHover className="[--duration:20s] py-5" style={{ willChange: "transform, opacity" }}>
                    {moments.map((m, i) => <MomentCard key={i} compact={compact} {...m} />)}
                </Marquee>
            </div>

            {/* Submit CTA */}
            <div ref={ctaRef} className="mx-auto mt-14 max-w-2xl px-6 text-center md:mt-20" style={{ willChange: "transform, opacity" }}>
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.4em] text-black">Your Zenova moment</p>
                <h3
                    className="font-black leading-[1.05] tracking-tight text-black"
                    style={{ fontSize: "clamp(1.5rem, 3vw, 2.25rem)" }}
                >
                    Tag <span className="text-blush-900">@zenovastrips</span> for a chance to be featured.
                </h3>
                <div className="mt-6 flex flex-wrap items-center justify-center gap-x-6 gap-y-3">
                    <Link
                        href="https://www.instagram.com/zenovastrips/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 rounded-full bg-blush-950 px-5 py-2.5 text-sm font-bold text-white transition-all hover:bg-blush-800 active:scale-[0.98]"
                    >
                        Share on Instagram <ArrowUpRight className="size-4" />
                    </Link>
                    <Link
                        href="https://www.tiktok.com/@zenova.strips"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-semibold text-black underline decoration-black/30 underline-offset-4 transition-colors hover:decoration-black"
                    >
                        TikTok
                    </Link>
                    <Link
                        href="/contact"
                        className="text-sm font-semibold text-black underline decoration-black/30 underline-offset-4 transition-colors hover:decoration-black"
                    >
                        Send us a photo
                    </Link>
                </div>
            </div>
        </section>
    )
}

function MomentCard({ src, pos, alt, text, name, compact }: Moment & { compact: boolean }) {
    return (
        <figure
            className={
                "shrink-0 overflow-hidden rounded-2xl border border-blush-200 bg-white shadow-md shadow-blush-900/10 " +
                (compact ? "w-48 md:w-52" : "w-60 md:w-64")
            }
        >
            <div className="relative aspect-[3/4] w-full">
                {src ? (
                    <Image src={src} alt={alt} fill className="object-cover" style={{ objectPosition: pos }} sizes={compact ? "208px" : "256px"} />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blush-200 via-blush-100 to-blush-50">
                        <Camera className={compact ? "size-7 text-black/25" : "size-8 text-black/25"} aria-hidden />
                    </div>
                )}
            </div>
            <figcaption className={compact ? "p-3" : "p-4"}>
                <blockquote className={"text-sm leading-snug text-black"}>&ldquo;{text}&rdquo;</blockquote>
                <p className={"mt-2 font-bold text-black " + (compact ? "text-xs" : "text-xs")}>{name}</p>
                <p className={"font-medium text-black/60 " + (compact ? "text-[10px]" : "text-[11px]")}>Verified Buyer</p>
            </figcaption>
        </figure>
    )
}
