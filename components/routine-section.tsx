"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

const steps = [
    { number: "01", title: "Open", instruction: "Peel open one packet.", image: "/routine-open.png" },
    { number: "02", title: "Place", instruction: "Place the strip under your tongue.", image: "/routine-place.png" },
    { number: "03", title: "Dissolve", instruction: "Let it dissolve. No water needed.", image: "/routine-dissolve.png" },
]

export default function RoutineSection() {
    const headingRef = useRef<HTMLDivElement>(null)
    const stepsRef = useRef<(HTMLDivElement | null)[]>([])

    useEffect(() => {
        const heading = headingRef.current
        const stepEls = stepsRef.current.filter(Boolean) as HTMLDivElement[]
        if (!heading || stepEls.length === 0) return

        gsap.set(heading, { opacity: 0, y: 30 })
        gsap.set(stepEls, { opacity: 0, y: 30 })

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: heading,
                start: "top 80%",
                toggleActions: "play none none none",
            },
        })

        tl.to(heading, { opacity: 1, y: 0, duration: 0.7, ease: "power2.out" }, 0)
        stepEls.forEach((el, i) => {
            tl.to(el, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.15 + i * 0.1)
        })

        return () => {
            tl.scrollTrigger?.kill()
            tl.kill()
        }
    }, [])

    return (
        <section className="bg-white px-6 py-20 md:px-16 lg:px-24">
            <div className="mx-auto max-w-6xl overflow-hidden rounded-[2rem] bg-gradient-to-br from-blush-200 via-blush-100 to-white px-6 py-14 shadow-xl shadow-black/5 md:px-12 md:py-16">

                <div ref={headingRef} className="mb-12 text-center" style={{ willChange: "transform, opacity" }}>
                    <h2
                        className="font-black leading-[0.9] tracking-tight text-blush-950"
                        style={{ fontSize: "clamp(2.25rem, 5vw, 4rem)" }}
                    >
                        Your Routine.
                    </h2>
                </div>

                <div className="grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-8 md:divide-x md:divide-blush-300/60">
                    {steps.map((step, i) => (
                        <div
                            key={step.number}
                            ref={el => { stepsRef.current[i] = el }}
                            className="flex flex-col items-center gap-2 px-4 text-center"
                            style={{ willChange: "transform, opacity" }}
                        >
                            <span className="font-black text-blush-300" style={{ fontSize: "clamp(2rem, 4vw, 3rem)" }}>
                                {step.number}
                            </span>
                            <h3 className="text-lg font-black uppercase tracking-tight text-blush-950">
                                {step.title}
                            </h3>
                            <p className="max-w-[200px] text-sm text-blush-950/70">
                                {step.instruction}
                            </p>
                            <div className="relative mt-4 w-full max-w-[180px]">
                                <Image
                                    src={step.image}
                                    width={1254}
                                    height={1254}
                                    alt={step.title}
                                    className="h-auto w-full drop-shadow-lg"
                                />
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}
