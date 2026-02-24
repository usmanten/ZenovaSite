"use client"

import { useEffect, type ReactNode } from "react"
import Lenis from "lenis"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

export default function SmoothScroll({ children }: { children: ReactNode }) {
    useEffect(() => {
        const lenis = new Lenis({
            duration: 1.4,
            easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        })

        // Sync Lenis scroll position with GSAP ScrollTrigger
        lenis.on("scroll", ScrollTrigger.update)

        // Use GSAP's ticker to drive Lenis instead of requestAnimationFrame
        // This keeps Lenis and GSAP perfectly in sync
        gsap.ticker.add((time) => {
            lenis.raf(time * 1000)
        })

        // Prevent GSAP from smoothing out lag, let Lenis handle it
        gsap.ticker.lagSmoothing(0)

        return () => {
            lenis.destroy()
            gsap.ticker.remove((time) => lenis.raf(time * 1000))
        }
    }, [])

    return <>{children}</>
}