"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useState } from "react";

const NAV_LINKS = [
  { id: "method", label: "Method" },
  { id: "console", label: "Live System" },
  { id: "proof", label: "Proof" },
  { id: "process", label: "Process" },
];

const SECTION_IDS = ["top", "method", "capabilities", "process", "console", "proof", "apply"];

export default function Nav() {
  const { scrollY, scrollYProgress } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.9]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const [activeSection, setActiveSection] = useState<string>("top");

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveSection(id);
          });
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
      );
      o.observe(el);
      observers.push(o);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  return (
    <motion.header className="fixed top-0 inset-x-0 z-50 backdrop-blur-md">
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-[--color-bg]/90 -z-10"
      />
      <motion.div
        style={{ opacity: borderOpacity }}
        className="absolute bottom-0 inset-x-0 h-px bg-[--color-line-strong]"
      />

      {/* Scroll progress line — gold thread that fills as you read */}
      <motion.div
        style={{ scaleX: progressScale, transformOrigin: "0% 50%" }}
        className="absolute top-0 inset-x-0 h-[2px] bg-[--color-accent] origin-left z-10"
      />

      <nav className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <a href="#top" className="block hover:opacity-80 transition-opacity duration-500">
          <img
            src="/ikingdom-logo.png?v=1"
            alt="iKingdom"
            width={140}
            height={36}
            className="h-7 md:h-9 w-auto"
            loading="eager"
            decoding="sync"
          />
        </a>
        <div className="flex items-center gap-8">
          {NAV_LINKS.map((link) => {
            const isActive = activeSection === link.id;
            return (
              <a
                key={link.id}
                href={`#${link.id}`}
                className={`hidden md:inline-flex items-center gap-2 text-sm transition-colors duration-300 ${
                  isActive
                    ? "text-[--color-fg]"
                    : "text-[--color-fg-muted] hover:text-[--color-fg]"
                }`}
              >
                <motion.span
                  animate={{
                    width: isActive ? 16 : 0,
                    opacity: isActive ? 1 : 0,
                  }}
                  transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                  className="block h-px bg-[--color-accent]"
                />
                {link.label}
              </a>
            );
          })}
          <a
            href="#apply"
            className="text-sm tracking-wide px-5 py-2.5 bg-[--color-fg] text-[--color-bg] hover:bg-[--color-accent] hover:text-[--color-bg] transition-all duration-500 rounded-full"
          >
            Apply
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
