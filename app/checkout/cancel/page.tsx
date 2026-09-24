import Link from "next/link"

export default function CheckoutCancel() {
    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center text-black">
            <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,black_1px,transparent_1px),linear-gradient(to_bottom,black_1px,transparent_1px)] [background-size:80px_80px]" />

            <div className="relative z-10 max-w-md">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.5em] text-black">
                    Payment Cancelled
                </p>
                <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
                    No worries.
                    <br />
                    <span className="text-blush-600">Come back anytime.</span>
                </h1>
                <p className="mt-6 text-sm leading-relaxed text-black">
                    Your cart was not charged. Head back to the catalog whenever you're ready.
                </p>

                <div className="mt-10">
                    <Link
                        href="/catalog"
                        className="rounded-full bg-black px-8 py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.03] hover:bg-neutral-800"
                    >
                        Back to Catalog
                    </Link>
                </div>
            </div>
        </div>
    )
}
