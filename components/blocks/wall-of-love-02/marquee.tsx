import { cn } from "@/lib/utils";
import React, { HTMLAttributes, ReactNode, forwardRef } from "react";

interface MarqueeProps extends HTMLAttributes<HTMLDivElement> {
  className?: string;
  reverse?: boolean;
  pauseOnHover?: boolean;
  children: ReactNode;
  vertical?: boolean;
  repeat?: number;
}

const Marquee = forwardRef<HTMLDivElement, MarqueeProps>(({
  className,
  reverse,
  pauseOnHover = false,
  children,
  vertical = false,
  repeat = 4,
  style,
  ...props
}, ref) => {
  return (
    <div
      ref={ref}
      {...props}
      className={cn(
        "group flex overflow-hidden p-2",
        {
          "flex-row": !vertical,
          "flex-col": vertical,
        },
        className
      )}
      style={{ gap: "1rem", ...style }}
    >
      {Array.from({ length: repeat }).map((_, i) => (
        <div
          key={i}
          className={cn("flex shrink-0 justify-around", {
            "animate-marquee flex-row": !vertical,
            "animate-marquee-vertical flex-col": vertical,
            "group-hover:[animation-play-state:paused]": pauseOnHover,
            "[animation-direction:reverse]": reverse,
          })}
          style={{
            animationDuration: "40s",
            gap: "1rem",
            ...(reverse && { animationDirection: "reverse" }),
          }}
        >
          {children}
        </div>
      ))}
    </div>
  );
});

Marquee.displayName = "Marquee";

export default Marquee;
