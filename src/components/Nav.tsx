"use client";

import { motion, useScroll, useTransform } from "framer-motion";

export default function Nav() {
  const { scrollY } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.85]);

  return (
    <motion.header
      className="fixed top-0 inset-x-0 z-50 backdrop-blur-md"
      style={{
        backgroundColor: "color-mix(in oklab, var(--color-bg) calc(var(--bg-o, 0) * 100%), transparent)",
      }}
    >
      <motion.div
        style={{ opacity: bgOpacity }}
        className="absolute inset-0 bg-[--color-bg]/85 -z-10"
      />
      <motion.div
        style={{ opacity: borderOpacity }}
        className="absolute bottom-0 inset-x-0 h-px bg-[--color-line]"
      />
      <nav className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between">
        <a
          href="#top"
          className="font-display text-2xl md:text-[28px] tracking-tight text-[--color-fg] hover:text-[--color-accent] transition-colors duration-500"
        >
          iKingdom
        </a>
        <div className="flex items-center gap-8">
          <a
            href="#method"
            className="hidden md:inline-block text-sm text-[--color-fg-muted] hover:text-[--color-fg] transition-colors duration-300"
          >
            Method
          </a>
          <a
            href="#proof"
            className="hidden md:inline-block text-sm text-[--color-fg-muted] hover:text-[--color-fg] transition-colors duration-300"
          >
            Proof
          </a>
          <a
            href="#process"
            className="hidden md:inline-block text-sm text-[--color-fg-muted] hover:text-[--color-fg] transition-colors duration-300"
          >
            Process
          </a>
          <a
            href="#apply"
            className="text-sm tracking-wide px-5 py-2.5 border border-[--color-line-strong] hover:border-[--color-accent] hover:text-[--color-accent] text-[--color-fg] transition-all duration-500 rounded-full"
          >
            Apply
          </a>
        </div>
      </nav>
    </motion.header>
  );
}
