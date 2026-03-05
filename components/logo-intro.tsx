"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import Image from "next/image"

export default function LogoIntro() {
    const overlayRef = useRef<HTMLDivElement>(null)
    const logoRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const overlay = overlayRef.current
        const logo = logoRef.current
        if (!overlay || !logo) return

        document.body.style.overflow = "hidden"

        const tl = gsap.timeline({
            defaults: { ease: "power3.inOut" },
            onComplete: () => {
                document.body.style.overflow = ""
            },
        })

        // Phase 1: Logo fades in centered
        tl.fromTo(
            logo,
            { opacity: 0, scale: 0.85 },
            { opacity: 1, scale: 1, duration: 1, ease: "power2.out" }
        )

        // Phase 2: Hold
        tl.to({}, { duration: 0.6 })

        // Phase 3: Shrink and move to nav logo position
        tl.to(logo, {
            scale: () => {
                const navEl = document.querySelector("[data-nav-logo]") as HTMLElement | null
                if (navEl) {
                    return navEl.getBoundingClientRect().height / logo.getBoundingClientRect().height
                }
                return 0.18
            },
            x: () => {
                const navEl = document.querySelector("[data-nav-logo]") as HTMLElement | null
                const introRect = logo.getBoundingClientRect()
                if (navEl) {
                    const navRect = navEl.getBoundingClientRect()
                    return (navRect.left + navRect.width / 2) - (introRect.left + introRect.width / 2)
                }
                return -(window.innerWidth / 2 - 56)
            },
            y: () => {
                const navEl = document.querySelector("[data-nav-logo]") as HTMLElement | null
                const introRect = logo.getBoundingClientRect()
                if (navEl) {
                    const navRect = navEl.getBoundingClientRect()
                    return (navRect.top + navRect.height / 2) - (introRect.top + introRect.height / 2)
                }
                return -(window.innerHeight / 2 - 32)
            },
            duration: 1.1,
            ease: "power4.inOut",
        })

        // Phase 4: Hold at nav position
        tl.to({}, { duration: 0.5 })

        // Phase 5: Overlay fades out
        tl.to(overlay, {
            opacity: 0,
            duration: 0.7,
            ease: "power2.inOut",
            pointerEvents: "none",
            onComplete: () => {
                overlay.style.display = "none"
            },
        })

        return () => {
            tl.kill()
            document.body.style.overflow = ""
        }
    }, [])

    return (
        <div
            ref={overlayRef}
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            style={{ backgroundColor: "#000000", pointerEvents: "all" }}
        >
            <div
                ref={logoRef}
                style={{ opacity: 0, transformOrigin: "center center" }}
            >
                <Image
                    src="/logoinvert.png"
                    alt="Zenova"
                    width={420}
                    height={180}
                    priority
                    style={{ width: "420px", height: "auto" }}
                />
            </div>
        </div>
    )
}
