import Link from "next/link"

export default function NotFound() {
    return (
        <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-black text-center text-white">
            {/* Subtle grid */}
            <div
                aria-hidden
                className="pointer-events-none absolute inset-0 opacity-[0.035] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:80px_80px]"
            />

            <p className="mb-4 rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-[10px] font-semibold uppercase tracking-[0.4em] text-white/40">
                404
            </p>

            <h1
                className="font-black leading-[1.05] tracking-tight"
                style={{ fontSize: "clamp(3rem, 8vw, 7rem)" }}
            >
                <span className="text-white/20">Page</span>
                <br />
                Not Found.
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-relaxed text-white/40">
                The page you&apos;re looking for doesn&apos;t exist or has been moved.
            </p>

            <Link
                href="/"
                className="mt-10 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-black transition-all hover:scale-[1.03] hover:opacity-90 active:scale-[0.98]"
            >
                Back to Home
            </Link>
        </div>
    )
}
