import { HeroHeader } from "@/components/header"
import AboutPage from "@/components/about-page"
import FooterSection from "@/components/footer-animated"
import MobileShopBar from "@/components/mobile-shop-bar"

export default function About() {
    return (
        <div className="pb-20 lg:pb-0">
            <HeroHeader />
            <AboutPage />
            <FooterSection />
            <MobileShopBar />
        </div>
    )
}
