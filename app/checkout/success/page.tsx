import Link from "next/link"

export default async function CheckoutSuccess({
    searchParams,
}: {
    searchParams: Promise<{ order?: string }>
}) {
    const { order } = await searchParams

    return (
        <div className="flex min-h-screen flex-col items-center justify-center bg-black px-6 text-center text-white">
            <div className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px]" />

            <div className="relative z-10 max-w-md">
                <div
                    className="mx-auto mb-8 flex size-16 items-center justify-center rounded-full"
                    style={{ backgroundColor: "#FF4D6D22", border: "1px solid #FF4D6D44" }}
                >
                    <svg className="size-8" fill="none" viewBox="0 0 24 24" stroke="#FF4D6D" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                </div>

                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.5em] text-white/50">
                    Order Confirmed
                </p>

                {order && (
                    <p className="mb-4 font-mono text-lg font-bold tracking-widest text-white">
                        <span className="font-sans text-xs font-normal tracking-[0.3em] text-white/60 uppercase">Order Number: </span>{order}
                    </p>
                )}

                <h1 className="text-4xl font-black leading-tight tracking-tight md:text-5xl">
                    Thanks for your
                    <br />
                    <span style={{ color: "#FF4D6D" }}>purchase.</span>
                </h1>
                <p className="mt-6 text-sm leading-relaxed text-white/65">
                    Your Zenova strips are on their way. You'll receive a confirmation email shortly.
                </p>

                <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
                    <Link
                        href="/catalog"
                        className="rounded-full px-8 py-3.5 text-sm font-bold text-black transition-all hover:scale-[1.03] hover:opacity-90"
                        style={{ backgroundColor: "#FF4D6D" }}
                    >
                        Back to Catalog
                    </Link>
                    <Link
                        href="/"
                        className="rounded-full border border-white/10 px-8 py-3.5 text-sm font-medium text-white/80 transition-all hover:border-white/20 hover:text-white/80"
                    >
                        Go Home
                    </Link>
                </div>
            </div>
        </div>
    )
}
