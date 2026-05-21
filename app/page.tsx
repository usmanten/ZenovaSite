import Features from "@/components/features-animated";
import FooterSection from "@/components/footer-animated";
import HeroHome from "@/components/hero-home";
import HorizontalGallery from "@/components/horizontal-gallery";
import LogoIntro from "@/components/logo-intro";
import ScienceComparison from "@/components/science-comparison";
import WallOfLove from "@/components/blocks/wall-of-love-02";

export default function Home() {
  return (
    <div>
      <LogoIntro />
      <HeroHome />  
      <Features />
      <ScienceComparison />
      <HorizontalGallery />
      <WallOfLove />
      <FooterSection />
    </div>
  )
}