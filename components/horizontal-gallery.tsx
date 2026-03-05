"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"

gsap.registerPlugin(ScrollTrigger)

const images = [
    { src: "/placeholder.png", alt: "Gallery image 1" },
    { src: "/placeholder.png", alt: "Gallery image 2" },
    { src: "/placeholder.png", alt: "Gallery image 3" },
    { src: "/placeholder.png", alt: "Gallery image 4" },
    { src: "/placeholder.png", alt: "Gallery image 5" },
]

export default function HorizontalGallery() {
    const sectionRef = useRef<HTMLDivElement>(null)
    const trackRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const timer = setTimeout(() => {
            const section = sectionRef.current
            const track = trackRef.current
            if (!section || !track) return

            const ctx = gsap.context(() => {
                const getDistance = () => -(track.scrollWidth - window.innerWidth)

                gsap.to(track, {
                    x: getDistance,
                    ease: "none",
                    scrollTrigger: {
                        trigger: section,
                        start: "top top",
                        end: () => `+=${track.scrollWidth - window.innerWidth}`,
                        pin: true,
                        pinSpacing: true,
                        scrub: 1,
                        anticipatePin: 1,
                        invalidateOnRefresh: true,
                    },
                })
            }, section)

            return () => ctx.revert()
        }, 100)

        return () => clearTimeout(timer)
    }, [])

    return (
        <div ref={sectionRef} className="h-screen w-full overflow-hidden bg-black">
            <div
                ref={trackRef}
                className="flex h-full items-center gap-5 pl-10"
                style={{ width: `calc(${images.length} * 46vw + ${images.length + 1} * 20px + 40px)` }}
            >
                {images.map((img, i) => (
                    <div
                        key={i}
                        className="relative flex-shrink-0 overflow-hidden rounded-2xl border border-white/8"
                        style={{ width: "45vw", height: "78vh" }}
                    >
                        <Image
                            src={img.src}
                            alt={img.alt}
                            fill
                            className="object-cover opacity-70"
                            sizes="45vw"
                            priority={i === 0}
                        />
                        {/* Dark overlay */}
                        <div className="absolute inset-0 bg-black/30" />
                        {/* Counter */}
                        <div className="absolute bottom-5 left-5 font-mono text-xs tracking-widest text-white/35">
                            {String(i + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}
                        </div>
                        {/* Corner accent */}
                        <div className="absolute right-5 top-5 text-[10px] font-semibold uppercase tracking-[0.4em] text-white/20">
                            Zenova
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
