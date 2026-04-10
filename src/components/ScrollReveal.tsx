"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsap";

type ScrollRevealProps = {
  children: React.ReactNode;
  direction?: "up" | "left" | "right";
  delay?: number;
  className?: string;
};

export default function ScrollReveal({
  children,
  direction = "up",
  delay = 0,
  className,
}: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;

      const fromVars: gsap.TweenVars = { opacity: 0 };

      switch (direction) {
        case "up":
          fromVars.y = 40;
          break;
        case "left":
          fromVars.x = 40;
          break;
        case "right":
          fromVars.x = -40;
          break;
      }

      gsap.fromTo(
        el,
        fromVars,
        {
          opacity: 1,
          x: 0,
          y: 0,
          duration: 1,
          delay,
          ease: "power3.out",
          scrollTrigger: {
            trigger: el,
            start: "top 85%",
            once: true,
          },
        }
      );
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className} style={{ opacity: 0 }}>
      {children}
    </div>
  );
}
