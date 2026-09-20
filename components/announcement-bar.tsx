"use client"

import { useEffect, useRef } from 'react'
import { gsap } from 'gsap'

const marqueeItems = [
    'STRAWBERRY FROST', '✦', 'MADE IN USA', '✦', 'SUGAR FREE', '✦',
    'FAST ACTING', '✦', 'CLEAN FORMULA', '✦',
    'SUBLINGUAL STRIPS', '✦', 'NO FILLERS', '✦', 'CAFFEINE', '✦',
]

export function AnnouncementBar() {
    const marqueeRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (!marqueeRef.current) return
        const ctx = gsap.context(() => {
            gsap.to(marqueeRef.current, {
                xPercent: -50,
                duration: 22,
                ease: 'none',
                repeat: -1,
            })
        })
        return () => ctx.revert()
    }, [])

    return (
        <div className="overflow-hidden bg-blush-600 py-2">
            <div ref={marqueeRef} className="flex whitespace-nowrap">
                {[...marqueeItems, ...marqueeItems, ...marqueeItems, ...marqueeItems].map((item, i) => (
                    <span
                        key={i}
                        className={`mx-6 text-[10px] font-bold uppercase tracking-[0.4em] ${item === '✦' ? 'text-white/60' : 'text-white'}`}
                    >
                        {item}
                    </span>
                ))}
            </div>
        </div>
    )
}
