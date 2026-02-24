import Features from "@/components/features-animated";
import FooterSection from "@/components/footer-animated";
import HeroHome from "@/components/hero-home";
import HorizontalGallery from "@/components/horizontal-gallery";
import LogoIntro from "@/components/logo-intro";

export default function Home() {
  return (
    <div>
      <LogoIntro />
      <HeroHome />  
      <Features />
      <HorizontalGallery />
      <FooterSection />
    </div>
  )
}