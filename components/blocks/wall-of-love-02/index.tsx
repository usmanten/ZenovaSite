"use client";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Marquee from "./marquee";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const testimonialsRow1 = [
  {
    text: "No jitters, no crash. Just works.",
    name: "Aisha Okonkwo",
    position: "Verified Buyer",
  },
  {
    text: "Threw one in my bag before the gym and haven't stopped since.",
    name: "Marcus Chen",
    position: "Verified Buyer",
  },
  {
    text: "Honestly didn't expect much from a strip. Was wrong.",
    name: "Priya Sharma",
    position: "Verified Buyer",
  },
  {
    text: "Zero crash when it wears off. That alone is why I'm on my third pack.",
    name: "Jordan Williams",
    position: "Verified Buyer",
  },
  {
    text: "Took one on a 6am flight. No coffee needed.",
    name: "Ravi Patel",
    position: "Verified Buyer",
  },
  {
    text: "2pm strip has basically replaced my afternoon coffee.",
    name: "Sofia Reyes",
    position: "Verified Buyer",
  },
];

const testimonialsRow2 = [
  {
    text: "Used it before a presentation, felt locked in the whole time.",
    name: "Caleb Osei",
    position: "Verified Buyer",
  },
  {
    text: "Dissolves in like 2 seconds. Kind of satisfying actually.",
    name: "Mei-Lin Torres",
    position: "Verified Buyer",
  },
  {
    text: "Already on my third order lol",
    name: "Chris Okafor",
    position: "Verified Buyer",
  },
  {
    text: "Clean ingredients, nothing sketchy in it. That matters to me.",
    name: "Fatima Al-Hassan",
    position: "Verified Buyer",
  },
  {
    text: "Switched from energy drinks and my stomach is so much happier.",
    name: "Tyler Nguyen",
    position: "Verified Buyer",
  },
  {
    text: "Fits in my wallet. That's the whole review.",
    name: "Amara Diallo",
    position: "Verified Buyer",
  },
];

export default function WallOfLove02() {
  const sectionRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const row1Ref = useRef<HTMLDivElement>(null);
  const row2Ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const heading = headingRef.current;
    const row1 = row1Ref.current;
    const row2 = row2Ref.current;
    if (!section || !heading || !row1 || !row2) return;

    gsap.set(heading, { opacity: 0, y: 30 });
    gsap.set([row1, row2], { opacity: 0, y: 20 });

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: section,
        start: "top 80%",
        end: "top 30%",
        toggleActions: "play none none none",
      },
    });

    tl.to(heading, { opacity: 1, y: 0, duration: 0.8, ease: "power2.out" }, 0)
      .to(row1, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.3)
      .to(row2, { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" }, 0.45);

    // Direction flip at section midpoint
    return () => {
      tl.scrollTrigger?.kill();
      tl.kill();
    };
  }, []);

  return (
    <section ref={sectionRef} className="bg-black pb-20 pt-20 md:pb-32 md:pt-32">
      <style>{`
        @keyframes marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-100%); }
        }
        @keyframes marquee-vertical {
          from { transform: translateY(0); }
          to { transform: translateY(-100%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
        .animate-marquee-vertical {
          animation: marquee-vertical 20s linear infinite;
        }
      `}</style>

      <div
        ref={headingRef}
        className="mx-auto max-w-4xl px-6 pb-16 text-center"
        style={{ willChange: "transform, opacity" }}
      >
        <h2
          className="font-black leading-[0.9] tracking-tight text-white"
          style={{ fontSize: "clamp(2.5rem, 6vw, 5rem)" }}
        >
          What Our Customers <span className="text-white/20">Are Saying</span>
        </h2>
        <p className="mt-4 text-sm text-white">Real reviews from real customers.</p>
      </div>

      <div className="relative flex h-full w-full flex-col items-center justify-center overflow-hidden">
        <Marquee ref={row1Ref} pauseOnHover className="[--duration:20s] ms-2" style={{ willChange: "transform, opacity" }}>
          {testimonialsRow1.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </Marquee>
        <Marquee ref={row2Ref} reverse pauseOnHover className="[--duration:20s] mt-4" style={{ willChange: "transform, opacity" }}>
          {testimonialsRow2.map((review, index) => (
            <ReviewCard key={index} {...review} />
          ))}
        </Marquee>
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 bg-gradient-to-r from-black" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 bg-gradient-to-l from-black" />
      </div>
    </section>
  );
}

const ReviewCard = ({
  name,
  position,
  text,
}: {
  name: string;
  position: string;
  text: string;
}) => {
  return (
    <figure
      className={cn(
        "relative w-72 cursor-pointer overflow-hidden rounded-2xl border p-4",
        "border-white/8 bg-white/[0.03] transition-all duration-300 hover:border-white/14 hover:bg-white/[0.055]"
      )}
    >
      <div className="flex flex-col">
        <figcaption className="text-sm font-semibold text-white">
          {name}
        </figcaption>
        <p className="text-xs font-medium text-white/55">{position}</p>
      </div>
      <blockquote className="mt-3 text-sm text-white/60">{text}</blockquote>
    </figure>
  );
};
