"use client"

import { useEffect, useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"

export const STORAGE_CODE_KEY = "zenova_discount_code"
export const STORAGE_USED_KEY = "zenova_discount_used"

type PopupState = "hidden" | "signup" | "reminder" | "success"

export default function EmailDiscountPopup() {
    const [open, setOpen] = useState(false)
    const [state, setState] = useState<PopupState>("hidden")
    const [email, setEmail] = useState("")
    const [code, setCode] = useState<string | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState("")

    useEffect(() => {
        if (localStorage.getItem(STORAGE_USED_KEY) === "true") return

        const savedCode = localStorage.getItem(STORAGE_CODE_KEY)

        if (!savedCode) {
            const timer = setTimeout(() => {
                setState("signup")
                setOpen(true)
            }, 2000)
            return () => clearTimeout(timer)
        }

        // Returning visitor with a stored code — check if it's already been redeemed
        fetch(`/api/discount-status?code=${encodeURIComponent(savedCode)}`)
            .then(res => res.json())
            .then((data: { used?: boolean }) => {
                if (data.used) {
                    localStorage.setItem(STORAGE_USED_KEY, "true")
                    return
                }
                setCode(savedCode)
                setState("reminder")
                setOpen(true)
            })
            .catch(() => {})
    }, [])

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setSubmitting(true)
        setError("")
        try {
            const res = await fetch("/api/mailing-list", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            })
            const data = await res.json().catch(() => ({}))
            if (!res.ok || !data.code) {
                setError("Something went wrong. Please try again.")
                setSubmitting(false)
                return
            }
            localStorage.setItem(STORAGE_CODE_KEY, data.code)
            setCode(data.code)
            setState("success")
        } catch {
            setError("Something went wrong. Please try again.")
        } finally {
            setSubmitting(false)
        }
    }

    if (state === "hidden") return null

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogContent>
                {state === "signup" && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Get 10% off your first order</DialogTitle>
                            <DialogDescription>
                                Join our mailing list and we&apos;ll send you an exclusive discount code.
                            </DialogDescription>
                        </DialogHeader>
                        <form onSubmit={handleSubmit} className="mt-2 flex flex-col gap-3">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="you@example.com"
                                className="w-full rounded-xl border border-blush-200 px-4 py-3 text-sm text-black outline-none focus:border-blush-500"
                            />
                            {error && <p className="text-xs text-red-600">{error}</p>}
                            <button
                                type="submit"
                                disabled={submitting}
                                className="w-full rounded-full bg-black py-3.5 text-sm font-bold text-white transition-all hover:bg-neutral-800 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {submitting ? "Sending…" : "Get My Code"}
                            </button>
                        </form>
                    </>
                )}

                {state === "reminder" && code && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Don&apos;t forget your discount</DialogTitle>
                            <DialogDescription>
                                You still have 10% off waiting for you — it&apos;ll be automatically applied when you check out.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-2 rounded-xl bg-blush-100 px-4 py-4 text-center">
                            <p className="text-lg font-black tracking-widest text-black">{code}</p>
                        </div>
                    </>
                )}

                {state === "success" && code && (
                    <>
                        <DialogHeader>
                            <DialogTitle>You&apos;re in!</DialogTitle>
                            <DialogDescription>
                                Here&apos;s your code! No need to copy it — it&apos;ll be automatically applied at checkout.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="mt-2 rounded-xl bg-blush-100 px-4 py-4 text-center">
                            <p className="text-lg font-black tracking-widest text-black">{code}</p>
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
