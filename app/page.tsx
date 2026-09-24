import Features from "@/components/features-animated";
import FooterSection from "@/components/footer-animated";
import HeroHome from "@/components/hero-home";
import InTheWild from "@/components/in-the-wild";
import LogoIntro from "@/components/logo-intro";
import MobileShopBar from "@/components/mobile-shop-bar";
import RoutineSection from "@/components/routine-section";
import ScienceComparison from "@/components/science-comparison";

export default function Home() {
  return (
    <div className="pb-20 lg:pb-0">
      <LogoIntro />
      <HeroHome />
      <Features />
      <ScienceComparison />
      <RoutineSection />
      <InTheWild />
      <FooterSection />
      <MobileShopBar />
    </div>
  )
}
