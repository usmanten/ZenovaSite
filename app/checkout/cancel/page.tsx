import Link from "next/link"

export default function CheckoutCancel() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
            <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px]" />

            <div className="relative z-10 max-w-md">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.5em] text-white/30">
                    Payment Cancelled
                </p>
                <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
                    No worries.
                    <br />
                    <span className="text-white/20">Come back anytime.</span>
                </h1>
                <p className="mt-6 text-sm leading-relaxed text-white/45">
                    Your cart was not charged. Head back to the catalog whenever you're ready.
                </p>

                <div className="mt-10">
                    <Link
                        href="/catalog"
                        className="rounded-full px-8 py-3.5 text-sm font-bold text-black transition-all hover:scale-[1.03] hover:opacity-90"
                        style={{ backgroundColor: "#FF4D6D" }}
                    >
                        Back to Catalog
                    </Link>
                </div>
            </div>
        </div>
    )
}
