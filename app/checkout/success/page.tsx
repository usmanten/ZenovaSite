import Link from "next/link"

export default async function CheckoutSuccess({
    searchParams,
}: {
    searchParams: Promise<{ order?: string }>
}) {
    const { order } = await searchParams

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-white px-6 text-center text-black">
            <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,black_1px,transparent_1px),linear-gradient(to_bottom,black_1px,transparent_1px)] [background-size:80px_80px]" />

            <div className="relative z-10 max-w-md">
                <div className="mx-auto mb-8 flex size-16 items-center justify-center rounded-full border border-blush-300 bg-blush-100">
                    <svg className="size-8 text-blush-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.5em] text-black/40">
                    Order Confirmed
                </p>

                {order && (
                    <p className="mb-4 font-mono text-lg font-bold tracking-widest text-black">
                        <span className="font-sans text-xs font-normal tracking-[0.3em] text-black/50 uppercase">Order Number: </span>{order}
                    </p>
                )}

                <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
                    Thanks for your
                    <br />
                    <span className="text-blush-600">purchase.</span>
                </h1>
                <p className="mt-6 text-sm leading-relaxed text-black/60">
                    Your Zenova strips are on their way. You'll receive a confirmation email shortly.
                </p>

                <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Link
                        href="/catalog"
                        className="rounded-full bg-black px-8 py-3.5 text-sm font-bold text-white transition-all hover:scale-[1.03] hover:bg-neutral-800"
                    >
                        Back to Catalog
                    </Link>
                    <Link
                        href="/"
                        className="rounded-full border border-black/10 px-8 py-3.5 text-sm font-medium text-black/70 transition-all hover:border-black/20 hover:text-black"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
