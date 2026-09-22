import Features from "@/components/features-animated";
import FooterSection from "@/components/footer-animated";
import HeroHome from "@/components/hero-home";
import InTheWild from "@/components/in-the-wild";
import LogoIntro from "@/components/logo-intro";
import RoutineSection from "@/components/routine-section";
import ScienceComparison from "@/components/science-comparison";

export default function Home() {
  return (
    <div>
      <LogoIntro />
      <HeroHome />
      <Features />
      <ScienceComparison />
      <RoutineSection />
      <InTheWild />
      <FooterSection />
    </div>
  )
}
