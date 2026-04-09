"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type TickerEvent = {
  num: string;
  action: string;
};

// Static event pool — same on server and client (no hydration mismatch)
// All events reflect iKingdom's own internal operations
const EVENTS: TickerEvent[] = [
  { num: "01", action: "Application received · /apply submission" },
  { num: "03", action: "Capital threshold validated · qualified" },
  { num: "06", action: "Fit score computed · 94% match" },
  { num: "09", action: "Discovery call scheduled · Thu 2:00 PM PT" },
  { num: "16", action: "Engagement plan drafted · 80-agent scope" },
  { num: "17", action: "Proposal composed · sent to prospect" },
  { num: "19", action: "Contract generated · awaiting signature" },
  { num: "25", action: "Codebase initialized · new tenant repo" },
  { num: "26", action: "CRM schema generated · 47 entities" },
  { num: "28", action: "Agent scaffold generated · Tier 04 · 10 agents" },
  { num: "30", action: "API composer · 38 endpoints exposed" },
  { num: "31", action: "Test suite passed · 1,247 tests · green" },
  { num: "32", action: "Code review · 3 issues flagged" },
  { num: "35", action: "Data sources cataloged · 14 connectors" },
  { num: "37", action: "ETL pipeline deployed · staging" },
  { num: "40", action: "Email & SMS channels wired · live" },
  { num: "44", action: "Sandbox provisioned for tenant DCS" },
  { num: "46", action: "Smoke test run · all checks passed" },
  { num: "47", action: "Production deployment · live" },
  { num: "49", action: "Accuracy monitor · 98.7% sustained" },
  { num: "51", action: "Checkpoint graduated · Agent 27 → autonomous" },
  { num: "53", action: "Incident · auto-resolved · 0 downtime" },
  { num: "55", action: "Weekly status composed for tenant ECG" },
  { num: "59", action: "Question triaged · routed to senior partner" },
  { num: "61", action: "Change request captured · scoped" },
  { num: "65", action: "Invoice generated · $187,500 · sent" },
  { num: "66", action: "Payment received · $250,000 · reconciled" },
  { num: "73", action: "Pattern library indexed · 3 new templates" },
  { num: "74", action: "Cross-tenant insight · 2 patterns matched" },
  { num: "79", action: "Quality score · 98.4% across 12 tenants" },
];

export default function PulseTicker() {
  // Stagger mount slightly so it doesn't slam in with the hero
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  // Duplicate events for seamless marquee loop
  const loop = [...EVENTS, ...EVENTS];

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-0 inset-x-0 z-30 pointer-events-none select-none"
      aria-hidden="true"
    >
      <div className="relative bg-[--color-bg-elevated]/85 backdrop-blur-md border-t border-[--color-line]">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[--color-bg-elevated] to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[--color-bg-elevated] to-transparent z-10 pointer-events-none" />

        {/* Label badge on left */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[--color-accent] opacity-70 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[--color-accent]" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-fg-muted]">
            Live
          </span>
        </div>

        <div className="overflow-hidden h-12">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 90,
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex items-center h-12 whitespace-nowrap will-change-transform"
            style={{ paddingLeft: "120px" }}
          >
            {loop.map((event, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 px-8 font-mono text-[11px] tracking-tight text-[--color-fg-muted]"
              >
                <span className="text-[--color-accent] tabular-nums">
                  AGENT {event.num}
                </span>
                <span className="text-[--color-fg-dim]">·</span>
                <span className="text-[--color-fg]">{event.action}</span>
                <span className="text-[--color-fg-dim] ml-3">|</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
