import Features from "@/components/features-animated";
import FooterSection from "@/components/footer-animated";
import HeroHome from "@/components/hero-home";
import HorizontalGallery from "@/components/horizontal-gallery";
import LogoIntro from "@/components/logo-intro";
import RoutineSection from "@/components/routine-section";
import ScienceComparison from "@/components/science-comparison";
import WallOfLove from "@/components/blocks/wall-of-love-02";

export default function Home() {
  return (
    <div>
      <LogoIntro />
      <HeroHome />
      <Features />
      <RoutineSection />
      <ScienceComparison />
      <HorizontalGallery />
      <WallOfLove />
      <FooterSection />
    </div>
  )
}