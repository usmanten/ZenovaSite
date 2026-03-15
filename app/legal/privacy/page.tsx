import { HeroHeader } from "@/components/header"
import FooterSection from "@/components/footer-animated"
import { PRIVACY_CONTENT } from "@/lib/legal"

function renderLegal(content: string) {
    return content.split("\n").map((line, i) => {
        if (line.startsWith("# ")) {
            return <h1 key={i} className="text-lg font-black text-white tracking-tight mt-6 mb-2 first:mt-0">{line.slice(2)}</h1>
        }
        if (line.startsWith("## ")) {
            return <h2 key={i} className="text-sm font-bold text-white mt-6 mb-1">{line.slice(3)}</h2>
        }
        if (line === "---") {
            return <hr key={i} className="border-white/8 my-4" />
        }
        if (line.trim() === "") {
            return <div key={i} className="h-1" />
        }
        return <p key={i} className="text-sm text-white leading-relaxed">{line}</p>
    })
}

export const metadata = {
    title: "Privacy Policy | Zenova",
}

export default function PrivacyPage() {
    return (
        <div className="min-h-screen bg-black text-white">
            <HeroHeader />
            <main className="mx-auto max-w-2xl px-6 pb-24 pt-36">
                {renderLegal(PRIVACY_CONTENT)}
            </main>
            <FooterSection />
        </div>
    )
}
