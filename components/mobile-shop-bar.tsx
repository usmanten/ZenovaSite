"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

// Sticky "Shop Now" bar shown on phone widths only, on pages that aren't the
// Shop page itself (which has its own richer version with live price/state).
// Hidden at the very top of the page and fades in once scrolled past the
// first screen, so it doesn't compete with each page's own hero CTA.
export default function MobileShopBar() {
    const [visible, setVisible] = useState(false)

    useEffect(() => {
        const handleScroll = () => {
            setVisible(prev => {
                if (window.scrollY > 500) return true
                if (window.scrollY < 300) return false
                return prev
            })
        }
        window.addEventListener("scroll", handleScroll, { passive: true })
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <div
            aria-hidden={!visible}
            className={
                "fixed inset-x-0 bottom-0 z-40 flex items-center justify-between gap-3 border-t border-blush-200 bg-white/95 px-4 py-3 backdrop-blur transition-transform duration-300 lg:hidden " +
                (visible ? "translate-y-0" : "translate-y-full")
            }
            style={{ paddingBottom: "calc(0.75rem + env(safe-area-inset-bottom))" }}
        >
            <p className="text-sm font-black text-black">Ready to feel the difference?</p>
            <Link
                href="/catalog#products"
                className="flex shrink-0 items-center gap-2 rounded-full bg-black px-6 py-2.5 text-sm font-bold text-white transition-all active:scale-[0.98]"
            >
                Shop Now
                <ArrowRight className="size-4" />
            </Link>
        </div>
    )
}
