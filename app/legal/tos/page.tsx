import Link from "next/link"
import { HeroHeader } from "@/components/header"
import FooterSection from "@/components/footer-animated"
import { TOS_CONTENT } from "@/lib/legal"

function renderLegal(content: string) {
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
        // Handle inline links: [label](action)
        const parts = line.split(/(\[.+?\]\(.+?\))/g)
        const rendered = parts.map((part, j) => {
            const match = part.match(/^\[(.+?)\]\((.+?)\)$/)
            if (match) {
                const [, label, action] = match
                const href = action === "refund" ? "/legal/refund" : action
                return <Link key={j} href={href} className="text-white/70 underline underline-offset-2 hover:text-white transition-colors">{label}</Link>
            }
            return part
        })
        return <p key={i} className="text-sm text-white/40 leading-relaxed">{rendered}</p>
    })
}

export const metadata = {
    title: "Terms of Service | Zenova",
}

export default function TosPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <HeroHeader />
            <main className="mx-auto max-w-2xl px-6 pb-24 pt-36">
                {renderLegal(TOS_CONTENT)}
            </main>
            <FooterSection />
        </div>
    )
}
