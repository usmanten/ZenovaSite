"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"
import Link from "next/link"
import { X } from "lucide-react"
import { TOS_CONTENT, REFUND_CONTENT, PRIVACY_CONTENT } from "@/lib/legal"

gsap.registerPlugin(ScrollTrigger)

function renderInline(text: string, handlers?: Record<string, () => void>) {
  const parts = text.split(/(\[.+?\]\(.+?\))/g)
  return parts.map((part, j) => {
    const match = part.match(/^\[(.+?)\]\((.+?)\)$/)
    if (match) {
      const [, label, action] = match
      return (
        <button key={j} onClick={() => handlers?.[action]?.()} className="text-white/70 underline underline-offset-2 hover:text-white transition-colors">
          {label}
        </button>
      )
    }
    return part
  })
}

function renderLegal(content: string, handlers?: Record<string, () => void>) {
  return content.split("\n").map((line, i) => {
    if (line.startsWith("# ")) {
      return <h1 key={i} className="text-lg font-black text-white tracking-tight mt-6 mb-2 first:mt-0">{line.slice(2)}</h1>
    }
    if (line.startsWith("## ")) {
      return <h2 key={i} className="text-sm font-bold text-white/70 mt-6 mb-1">{line.slice(3)}</h2>
    }
    if (line === "---") {
      return <hr key={i} className="border-white/8 my-4" />
    }
    if (line.trim() === "") {
      return <div key={i} className="h-1" />
    }
    return <p key={i} className="text-sm text-white/40 leading-relaxed">{renderInline(line, handlers)}</p>
  })
}

function LegalModal({ title, content, onClose, handlers }: { title: string; content: string; onClose: () => void; handlers?: Record<string, () => void> }) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose() }
    document.addEventListener("keydown", handler)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", handler)
      document.body.style.overflow = ""
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative flex flex-col w-full max-w-2xl max-h-[82vh] rounded-2xl border border-white/8 bg-[#0a0a0a] shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        {/* Modal header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/8 flex-shrink-0">
          <h2 className="font-black text-white tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="text-white/30 hover:text-white transition-colors duration-150"
            aria-label="Close"
          >
            <X className="size-5" />
          </button>
        </div>
        {/* Scrollable content */}
        <div className="overflow-y-auto px-6 py-6 flex-1">
          {renderLegal(content, handlers)}
        </div>
      </div>
    </div>
  )
}

export default function FooterSection() {
  const [modal, setModal] = useState<"tos" | "privacy" | "refund" | null>(null)
  const [amazonToast, setAmazonToast] = useState(false)
  const footerRef = useRef<HTMLElement>(null)
  const logoRef = useRef<HTMLAnchorElement>(null)
  const socialRef = useRef<HTMLDivElement>(null)
  const copyrightRef = useRef<HTMLSpanElement>(null)
  const legalRef = useRef<HTMLDivElement>(null)

  const closeModal = useCallback(() => setModal(null), [])

  useEffect(() => {
    const footer = footerRef.current
    if (!footer) return

    const elements = [
      logoRef.current,
      socialRef.current,
      copyrightRef.current,
      legalRef.current,
    ].filter(Boolean) as Element[]

    gsap.set(elements, { y: 40, opacity: 0 })

    const timer = setTimeout(() => {
      const st = ScrollTrigger.create({
        trigger: footer,
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
    <>
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
              style={{ height: "42px", width: "auto" }}
            />
          </Link>

          <div ref={socialRef} className="my-8 flex flex-wrap justify-center gap-6 text-sm">
            <Link href="https://www.instagram.com/zenovastrips/" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-white/30 hover:text-white/70 block transition-colors duration-150">
              <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4zm9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8A1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5a5 5 0 0 1-5 5a5 5 0 0 1-5-5a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3a3 3 0 0 0 3 3a3 3 0 0 0 3-3a3 3 0 0 0-3-3" />
              </svg>
            </Link>
            <div className="relative">
              <button
                onClick={() => { setAmazonToast(true); setTimeout(() => setAmazonToast(false), 2000) }}
                aria-label="Amazon"
                className="text-white/30 hover:text-white/70 block transition-colors duration-150"
              >
                <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M15.93 17.09c-.16.31-.41.57-.74.77c-3.28 2.01-7.72 1.59-10.76-.45c-1.57-1.06-2.77-2.57-3.43-4.33c-.17-.46.18-.73.55-.41c1.74 1.47 3.67 2.64 5.77 3.3c2.09.66 4.28.73 6.4.19c.55-.14 1.07-.33 1.58-.57c.54-.23.9.22.63.5M17.5 14.5c-.44-.56-2.89-.27-3.99-.13c-.33.04-.38-.25-.08-.46c1.95-1.37 5.16-1 5.53-.5c.37.5-.1 3.74-1.93 5.3c-.28.24-.55.11-.42-.2c.41-1.02 1.33-3.45.89-4.01" />
                </svg>
              </button>
              {amazonToast && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-white/10 px-2.5 py-1 text-[10px] font-medium text-white/70">
                  Coming soon!
                </span>
              )}
            </div>
            <Link href="https://www.tiktok.com/@zenova.strips" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="text-white/30 hover:text-white/70 block transition-colors duration-150">
              <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M16.6 5.82s.51.5 0 0A4.28 4.28 0 0 1 15.54 3h-3.09v12.4a2.59 2.59 0 0 1-2.59 2.5c-1.42 0-2.6-1.16-2.6-2.6c0-1.72 1.66-3.01 3.37-2.48V9.66c-3.45-.46-6.47 2.22-6.47 5.64c0 3.33 2.76 5.7 5.69 5.7c3.14 0 5.69-2.55 5.69-5.7V9.01a7.35 7.35 0 0 0 4.3 1.38V7.3s-1.88.09-3.24-1.48" />
              </svg>
            </Link>
            <Link href="https://x.com/zenovastrips" target="_blank" rel="noopener noreferrer" aria-label="X" className="text-white/30 hover:text-white/70 block transition-colors duration-150">
              <svg className="size-6" xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
                <path fill="currentColor" d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </Link>
          </div>

          <span ref={copyrightRef} className="block text-center text-xs font-medium tracking-widest text-white/20">
            © {new Date().getFullYear()} Zenova Strips, All rights reserved
          </span>

          <div ref={legalRef} className="mt-4 flex justify-center gap-6">
            <button
              onClick={() => setModal("tos")}
              className="text-xs text-white/20 hover:text-white/50 transition-colors duration-150 tracking-wide"
            >
              Terms of Service
            </button>
            <button
              onClick={() => setModal("privacy")}
              className="text-xs text-white/20 hover:text-white/50 transition-colors duration-150 tracking-wide"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => setModal("refund")}
              className="text-xs text-white/20 hover:text-white/50 transition-colors duration-150 tracking-wide"
            >
              Refund Policy
            </button>
          </div>
        </div>
      </footer>

      {modal && (
        <LegalModal
          title={modal === "tos" ? "Terms of Service" : modal === "privacy" ? "Privacy Policy" : "Refund Policy"}
          content={modal === "tos" ? TOS_CONTENT : modal === "privacy" ? PRIVACY_CONTENT : REFUND_CONTENT}
          onClose={closeModal}
          handlers={{ refund: () => setModal("refund") }}
        />
      )}
    </>
  )
}
