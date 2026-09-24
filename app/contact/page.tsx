import { HeroHeader } from "@/components/header"
import ContactPage from "@/components/contact-page"
import FooterSection from "@/components/footer-animated"
import MobileShopBar from "@/components/mobile-shop-bar"

export default function Contact() {
    return (
        <div className="pb-20 lg:pb-0">
            <HeroHeader />
            <ContactPage />
            <FooterSection />
            <MobileShopBar />
        </div>
    )
}
