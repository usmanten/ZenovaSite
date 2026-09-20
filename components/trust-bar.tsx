import { Zap, XCircle, Leaf, ShieldCheck } from "lucide-react"

const items = [
    { icon: <span className="text-sm leading-none text-blush-600">★★★★★</span>, label: "Verified Buyers" },
    { icon: <Leaf className="size-4 text-blush-600" aria-hidden />, label: "Made in USA" },
    { icon: <XCircle className="size-4 text-blush-600" aria-hidden />, label: "0g Sugar" },
    { icon: <Zap className="size-4 text-blush-600" aria-hidden />, label: "Fast Acting" },
    { icon: <ShieldCheck className="size-4 text-blush-600" aria-hidden />, label: "100% Satisfaction Guarantee" },
]

export default function TrustBar() {
    return (
        <div className="border-y border-blush-200 bg-blush-100 px-6 py-5">
            <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-3">
                {items.map((item, i) => (
                    <div key={i} className="flex items-center gap-x-10">
                        {i > 0 && <span className="hidden h-4 w-px bg-blush-300 sm:block" />}
                        <div className="flex items-center gap-2 text-blush-950/80">
                            {item.icon}
                            <span className="text-xs font-bold uppercase tracking-widest">{item.label}</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
