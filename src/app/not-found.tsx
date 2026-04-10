"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

const AGENT_LOGS = [
  "routing request through intake pipeline...",
  "scanning 80 agents for matching handler...",
  "query does not match any registered endpoint.",
  "flagging as unresolved — recommending redirect.",
  "checkpoint: no autonomous match. returning visitor to origin.",
];

export default function NotFound() {
  const [logIndex, setLogIndex] = useState(0);

  useEffect(() => {
    if (logIndex >= AGENT_LOGS.length) return;
    const delay = logIndex === 0 ? 800 : 1200 + Math.random() * 600;
    const timer = setTimeout(() => setLogIndex((i) => i + 1), delay);
    return () => clearTimeout(timer);
  }, [logIndex]);

  return (
    <div className="min-h-screen flex flex-col bg-[--color-bg]">
      {/* Top bar */}
      <header className="max-w-[1400px] mx-auto px-6 md:px-10 w-full h-16 md:h-20 flex items-center">
        <a href="/" className="hover:opacity-80 transition-opacity duration-500">
          <img
            src="/ikingdom-logo.png?v=1"
            alt="iKingdom"
            width={140}
            height={36}
            className="h-7 md:h-9 w-auto"
          />
        </a>
      </header>

      {/* Main content */}
      <main className="flex-1 flex flex-col justify-center relative max-w-[1400px] mx-auto px-6 md:px-10 w-full pb-24">
        <div className="spotlight absolute inset-0 pointer-events-none" />

        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.2 }}
          className="flex items-center gap-3 mb-16"
        >
          <span className="h-px w-8 bg-[--color-accent]" />
          <span className="text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim]">
            Route not found
          </span>
        </motion.div>

        {/* 404 display */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease, delay: 0.4 }}
        >
          <h1 className="font-display text-[clamp(5rem,15vw,14rem)] leading-[0.85] tracking-[-0.03em] text-[--color-fg]">
            4
            <span className="italic text-[--color-accent]">0</span>
            4
          </h1>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.7 }}
          className="mt-8 max-w-lg text-base md:text-lg text-[--color-fg-muted] leading-relaxed"
        >
          This page doesn&apos;t exist within our system. Our agents scanned all
          eighty nodes and found no match for this route.
        </motion.p>

        {/* Agent trace log */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 1 }}
          className="mt-12 max-w-md border border-[--color-line-strong] bg-[--color-bg-card] rounded-md p-5 shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
        >
          <div className="flex items-center gap-2.5 mb-4">
            <span className="block h-1.5 w-1.5 rounded-full bg-[--color-accent]" />
            <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-fg-muted]">
              Agent 08 &middot; Routing Coordinator
            </span>
          </div>
          <div className="space-y-1.5">
            {AGENT_LOGS.slice(0, logIndex).map((log, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease }}
                className="font-mono text-[11px] text-[--color-fg-dim] leading-relaxed"
              >
                <span className="text-[--color-accent] mr-2">&gt;</span>
                {log}
              </motion.div>
            ))}
            {logIndex < AGENT_LOGS.length && (
              <span className="inline-block w-1.5 h-3.5 bg-[--color-accent] animate-pulse" />
            )}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 1.3 }}
          className="mt-10 flex flex-wrap items-center gap-6"
        >
          <a
            href="/"
            className="group relative inline-flex items-center gap-3 px-7 py-4 bg-[--color-fg] text-[--color-bg] text-sm tracking-wide hover:bg-[--color-accent] hover:text-[--color-bg] transition-all duration-500 rounded-full"
          >
            Return to origin
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
            href="/#apply"
            className="text-sm text-[--color-fg-muted] hover:text-[--color-fg] transition-colors duration-300 underline underline-offset-4 decoration-[--color-line-strong] hover:decoration-[--color-fg]"
          >
            Begin application
          </a>
        </motion.div>
      </main>

      {/* Footer line */}
      <footer className="border-t border-[--color-line] py-8">
        <div className="max-w-[1400px] mx-auto px-6 md:px-10 flex items-center justify-between">
          <p className="text-xs text-[--color-fg-dim]">
            &copy; {new Date().getFullYear()} iKingdom. All rights reserved.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-[0.16em] text-[--color-fg-dim]">
            80 agents &middot; 9 tiers &middot; 0 matches
          </p>
        </div>
      </footer>
    </div>
  );
}
