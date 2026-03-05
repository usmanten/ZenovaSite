"use client"

import { useEffect, useRef } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import Link from "next/link"

gsap.registerPlugin(ScrollTrigger)

export default function FooterSection() {
    const footerRef = useRef<HTMLElement>(null)
    const logoRef = useRef<HTMLAnchorElement>(null)
    const socialRef = useRef<HTMLDivElement>(null)
    const copyrightRef = useRef<HTMLSpanElement>(null)

    useEffect(() => {
        const footer = footerRef.current
        if (!footer) return

        const elements = [
            logoRef.current,
            socialRef.current,
            copyrightRef.current,
        ].filter(Boolean) as Element[]

        // Hide elements via GSAP (not inline styles)
        gsap.set(elements, { y: 40, opacity: 0 })

        // Use a short delay so ScrollTrigger measures after pinned sections
        // have added their pinSpacing to the page height
        const timer = setTimeout(() => {
            const st = ScrollTrigger.create({
                trigger: footer,
                // Fire very early — as soon as ANY part of footer is visible
                start: "top 95%",
                onEnter: () => {
                    gsap.to(elements, {
                        y: 0,
                        opacity: 1,
                        duration: 0.7,
                        stagger: 0.12,
                        ease: "power3.out",
                    })
                },
                onLeaveBack: () => {
                    gsap.to(elements, {
                        y: 40,
                        opacity: 0,
                        duration: 0.4,
                        stagger: 0.08,
                        ease: "power2.in",
                    })
                },
            })

            return () => st.kill()
        }, 300)

        return () => clearTimeout(timer)
    }, [])

    return (
        <footer ref={footerRef} className="border-t border-white/5 bg-black py-16 md:py-28">
            <div className="mx-auto max-w-5xl px-6">
                <Link
                    ref={logoRef}
                    href="/"
                    aria-label="go home"
                    className="mx-auto block size-fit"
                >
                    <Image
                        src="/logoinvert.png"
                        alt="Zenova Strips"
                        width={120}
                        height={52}
                        style={{ height: "28px", width: "auto" }}
                    />
                </Link>

                <div ref={socialRef} className="my-8 flex flex-wrap justify-center gap-6 text-sm">
                    <Link href="https://www.instagram.com/zenovastrips/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/30 hover:text-white/70 block transition-colors duration-150">
                        <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
                        </svg>
                    </Link>
                    <Link href="#" target="_blank" rel="noopener noreferrer" aria-label="Amazon" className="text-white/30 hover:text-white/70 block transition-colors duration-150">
                        <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M15.93 17.09c-.16.31-.41.57-.74.77c-3.28 2.01-7.72 1.59-10.76-.45c-1.57-1.06-2.77-2.57-3.43-4.33c-.17-.46.18-.73.55-.41c1.74 1.47 3.67 2.64 5.77 3.3c2.09.66 4.28.73 6.4.19c.55-.14 1.07-.33 1.58-.57c.54-.23.9.22.63.5M17.5 14.5c-.44-.56-2.89-.27-3.99-.13c-.33.04-.38-.25-.08-.46c1.95-1.37 5.16-1 5.53-.5c.37.5-.1 3.74-1.93 5.3c-.28.24-.55.11-.42-.2c.41-1.02 1.33-3.45.89-4.01" />
                        </svg>
                    </Link>
                    <Link href="https://www.tiktok.com/@zenova.strips" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white/30 hover:text-white/70 block transition-colors duration-150">
                        <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                            <path fill="currentColor" d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48" />
                        </svg>
                    </Link>
                </div>

                <span ref={copyrightRef} className="block text-center text-xs font-medium tracking-widest text-white/20">
                    © {new Date().getFullYear()} Zenova Strips, All rights reserved
                </span>
            </div>
        </footer>
    )
}