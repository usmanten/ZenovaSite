"use client"

import { useState } from "react"
import { AnimatedGroup } from "@/components/ui/animated-group"
import { ArrowRight } from "lucide-react"

export default function ContactPage() {
    const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" })
    const [loading, setLoading] = useState(false)
    const [success, setSuccess] = useState(false)
    const [error, setError] = useState("")

    function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(form),
            })

            if (!res.ok) throw new Error()

            setSuccess(true)
            setForm({ name: "", email: "", subject: "", message: "" })
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="overflow-x-hidden">

            {/* ── HERO ─────────────────────────────────────────────────────────── */}
            <section className="relative flex min-h-[55vh] flex-col items-center justify-center overflow-hidden bg-black px-6 text-center text-white">
                {/* Subtle grid */}
                <div
                    aria-hidden
                    className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px]"
                />

                {/* Ambient glow blobs */}
                <div aria-hidden className="pointer-events-none absolute left-1/4 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ backgroundColor: "#FF4D6D0a" }} />
                <div aria-hidden className="pointer-events-none absolute right-1/4 top-1/2 size-96 -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl" style={{ backgroundColor: "#8B5CF608" }} />

                <AnimatedGroup
                    variants={{
                        container: {
                            visible: { transition: { staggerChildren: 0.14, delayChildren: 0.2 } },
                        },
                        item: {
                            hidden: { opacity: 0, y: 32, filter: "blur(10px)" },
                            visible: {
                                opacity: 1, y: 0, filter: "blur(0px)",
                                transition: { type: "spring", bounce: 0.2, duration: 1.5 },
                            },
                        },
                    }}
                    className="relative flex flex-col items-center"
                >
                    <div className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-white/40">
                        Get in Touch
                    </div>

                    <h1
                        className="font-black leading-[1.05] tracking-tight text-white"
                        style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
                    >
                        <span className="text-white/20">Contact</span>
                        <br />
                        Zenova.
                    </h1>

                    <p className="mt-6 max-w-md text-sm leading-relaxed text-white/40">
                        Questions about your order, wholesale inquiries, or anything else.
                    </p>
                </AnimatedGroup>
            </section>

            {/* ── FORM ─────────────────────────────────────────────────────────── */}
            <section className="bg-black px-6 pb-32 pt-16 text-white">
                <div className="mx-auto max-w-2xl">

                    {success ? (
                        <div className="flex flex-col items-center gap-6 py-16 text-center">
                            <div
                                className="flex size-14 items-center justify-center rounded-full"
                                style={{ backgroundColor: "#FF4D6D22", border: "1px solid #FF4D6D44" }}
                            >
                                <svg className="size-7" fill="none" viewBox="0 0 24 24" stroke="#FF4D6D" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <div>
                                <h2 className="text-2xl font-black text-white">Message sent.</h2>
                                <p className="mt-2 text-sm text-white/40">We'll get back to you as soon as possible.</p>
                            </div>
                            <button
                                onClick={() => setSuccess(false)}
                                className="text-xs font-semibold uppercase tracking-[0.3em] text-white/30 transition-colors hover:text-white/60"
                            >
                                Send another message
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                            {/* Name + Email row */}
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        value={form.name}
                                        onChange={handleChange}
                                        placeholder="Your name"
                                        className="rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white outline-none placeholder:text-white/25 transition-colors focus:border-white/25"
                                    />
                                </div>
                                <div className="flex flex-col gap-2">
                                    <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="your@email.com"
                                        className="rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white outline-none placeholder:text-white/25 transition-colors focus:border-white/25"
                                    />
                                </div>
                            </div>

                            {/* Subject */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                                    Subject
                                </label>
                                <input
                                    type="text"
                                    name="subject"
                                    required
                                    value={form.subject}
                                    onChange={handleChange}
                                    placeholder="What's this about?"
                                    className="rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white outline-none placeholder:text-white/25 transition-colors focus:border-white/25"
                                />
                            </div>

                            {/* Message */}
                            <div className="flex flex-col gap-2">
                                <label className="text-xs font-semibold uppercase tracking-[0.3em] text-white/40">
                                    Message
                                </label>
                                <textarea
                                    name="message"
                                    required
                                    rows={6}
                                    value={form.message}
                                    onChange={handleChange}
                                    placeholder="Tell us what's on your mind…"
                                    className="resize-none rounded-xl border border-white/10 bg-white/5 px-5 py-3.5 text-sm text-white outline-none placeholder:text-white/25 transition-colors focus:border-white/25"
                                />
                            </div>

                            {error && (
                                <p className="text-xs text-red-400/80">{error}</p>
                            )}

                            <div className="flex flex-col items-center gap-3 border-t border-white/5 pt-4 md:flex-row md:justify-between">
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="group inline-flex items-center gap-2.5 rounded-full bg-white px-10 py-3.5 text-sm font-bold text-black transition-all hover:scale-[1.03] hover:opacity-90 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                                >
                                    {loading ? "Sending…" : "Send Message"}
                                    {!loading && <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />}
                                </button>
                                <p className="text-xs text-white/50 md:order-first">We typically reply within 24 hours.</p>
                            </div>

                        </form>
                    )}
                </div>
            </section>

        </div>
    )
}
