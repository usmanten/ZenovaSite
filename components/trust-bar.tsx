"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { XCircle, Timer, Leaf } from "lucide-react"

gsap.registerPlugin(ScrollTrigger)

const items = [
    { icon: <span className="text-sm leading-none text-blush-600">★★★★★</span>, label: "Verified Buyers" },
    { icon: <XCircle className="size-4 text-blush-600" aria-hidden />, label: "0 Added Sugar" },
    { icon: <Timer className="size-4 text-blush-600" aria-hidden />, label: "Peak Absorption < 5 Min" },
    { icon: <Leaf className="size-4 text-blush-600" aria-hidden />, label: "Made in USA" },
]

export default function TrustBar() {
    const barRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const bar = barRef.current
        if (!bar) return

        gsap.set(bar, { opacity: 0, y: 30 })

        const st = ScrollTrigger.create({
            trigger: bar,
            start: "top 90%",
            onEnter: () => {
                gsap.to(bar, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" })
            },
        })

        return () => st.kill()
    }, [])

    return (
        <div ref={barRef} className="hidden border-y border-blush-200 bg-blush-100 px-6 py-5 sm:block" style={{ willChange: "transform, opacity" }}>
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-x-10">
                        {i > 0 && <span className="hidden h-4 w-px bg-blush-300 sm:block" />}
                        <div className="flex items-center gap-2 text-blush-950/80">
                            {item.icon}
                            <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
