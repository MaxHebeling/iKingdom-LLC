"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

export default function Hero() {
  return (
    <section
      id="top"
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Cinematic spotlight wash */}
      <div className="absolute inset-0 spotlight pointer-events-none" />

      {/* Subtle horizon line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[--color-line-strong] to-transparent" />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 w-full pt-32 md:pt-40 pb-24">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.3 }}
          className="flex items-center gap-3 mb-10 md:mb-14"
        >
          <span className="h-px w-8 bg-[--color-accent]" />
          <span className="text-[11px] md:text-xs uppercase tracking-[0.22em] text-[--color-fg-muted]">
            Established · The world's first AI operations firm
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease, delay: 0.5 }}
          className="font-display text-balance text-[clamp(3rem,9vw,9.5rem)] leading-[0.92] tracking-[-0.025em] text-[--color-fg]"
        >
          We build the first
          <br />
          <span className="italic text-[--color-accent]">companies</span>{" "}
          that run themselves.
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.9 }}
          className="mt-12 md:mt-16 max-w-2xl text-pretty text-base md:text-lg leading-relaxed text-[--color-fg-muted]"
        >
          iKingdom designs and deploys autonomous operations for ambitious
          companies. Eighty AI agents across nine functional tiers replace
          entire departments — intake, quoting, scheduling, communications,
          finance, employee oversight, fleet, and intelligence — running as
          one coordinated, supervised system.
        </motion.p>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 1.15 }}
          className="mt-14 md:mt-20 flex flex-wrap items-center gap-6"
        >
          <a
            href="#apply"
            className="group relative inline-flex items-center gap-3 px-7 py-4 bg-[--color-accent] text-[--color-bg] text-sm tracking-wide hover:bg-[--color-accent-hover] transition-all duration-500 rounded-full"
          >
            Begin Application
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              className="transition-transform duration-500 group-hover:translate-x-1"
            >
              <path
                d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
          </a>
          <a
            href="#method"
            className="text-sm text-[--color-fg-muted] hover:text-[--color-fg] transition-colors duration-300 underline underline-offset-4 decoration-[--color-line-strong] hover:decoration-[--color-fg]"
          >
            See how it works
          </a>
        </motion.div>
      </div>

      {/* Scroll affordance */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-[--color-fg-dim]">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-10 bg-gradient-to-b from-[--color-fg-dim] to-transparent"
        />
      </motion.div>
    </section>
  );
}
