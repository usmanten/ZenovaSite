"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { Zap, Candy, XCircle, Leaf } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const featuresData = [
    {
        icon: <Zap className="size-5" aria-hidden />,
        title: "Fast Acting",
        description: "Dissolves in seconds for rapid absorption — feel the difference faster than any pill or gummy.",
        from: { x: -500, y: -300, rotation: -45, opacity: 0, scale: 0.8 },
    },
    {
        icon: <Candy className="size-5" aria-hidden />,
        title: "Best Taste",
        description: "Delicious flavors that make your daily routine something to look forward to, every single time.",
        from: { x: 500, y: -300, rotation: 45, opacity: 0, scale: 0.8 },
    },
    {
        icon: <XCircle className="size-5" aria-hidden />,
        title: "No Sugar or Fillers",
        description: "Zero sugar, zero artificial fillers — just clean, effective ingredients your body actually needs.",
        from: { x: -500, y: 300, rotation: -45, opacity: 0, scale: 0.8 },
    },
    {
        icon: <Leaf className="size-5" aria-hidden />,
        title: "Fresh Ingredients",
        description: "Made in the USA with premium, naturally sourced ingredients for purity you can trust.",
        from: { x: 500, y: 300, rotation: 45, opacity: 0, scale: 0.8 },
    },
]

export default function Features() {
    const pinWrapRef = useRef<HTMLDivElement>(null)
    const headingRef = useRef<HTMLDivElement>(null)
    const cardsRef = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const pinWrap = pinWrapRef.current
        const heading = headingRef.current
        if (!pinWrap || !heading) return

        const cards = cardsRef.current.filter(Boolean) as HTMLDivElement[]

        gsap.set(heading, { opacity: 0, y: 30 })
        cards.forEach((card, i) => {
            gsap.set(card, featuresData[i].from)
        })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: pinWrap,
                start: "top top",
                end: `+=${(cards.length * 1.2 + 1) * 400}`,
                pin: true,
                pinSpacing: true,
                scrub: 1.2,
                anticipatePin: 1,
                invalidateOnRefresh: true,
            },
        })

        tl.to(heading, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0)
        cards.forEach((card, i) => {
            tl.to(
                card,
                { x: 0, y: 0, rotation: 0, opacity: 1, scale: 1, duration: 1, ease: "power3.out" },
                0.8 + i * 1.2
            )
        })

        return () => {
            tl.scrollTrigger?.kill()
            tl.kill()
        }
    }, [])

    return (
        <div ref={pinWrapRef} className="h-screen w-full overflow-hidden bg-black">
            <div className="flex h-full w-full flex-col items-center justify-center">

                <div
                    ref={headingRef}
                    className="mb-10 text-center"
                    style={{ willChange: "transform, opacity" }}
                >
                    <h2
                        className="font-black leading-[0.9] tracking-tight text-white"
                        style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
                    >
                        Built For Perfection.
                    </h2>
                    <p className="mt-4 text-sm text-white/35">
                        The only strips made in the USA with premium ingredients and advanced technology.
                    </p>
                </div>

                <div className="grid w-full max-w-3xl grid-cols-2 gap-5 px-6">
                    {featuresData.map((feature, i) => (
                        <div
                            key={i}
                            ref={el => { cardsRef.current[i] = el }}
                            style={{ willChange: "transform, opacity" }}
                        >
                            <div className="group h-full rounded-2xl border border-white/8 bg-white/[0.03] p-6 text-center transition-all duration-300 hover:border-white/14 hover:bg-white/[0.055]">
                                <div className="mb-5 mx-auto inline-flex size-11 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-white/55 transition-all duration-300 group-hover:border-white/20 group-hover:bg-white/10 group-hover:text-white">
                                    {feature.icon}
                                </div>
                                <h3 className="font-bold text-white">{feature.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-white/40">{feature.description}</p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </div>
    )
}
