"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const capabilities = [
  {
    title: "Capture every lead, day or night.",
    body: "AI receptionist takes calls. Chat agent answers your site. Email and form intake never sleep. Every inbound is logged, qualified, and routed before a human is involved.",
  },
  {
    title: "Quote in seconds, not days.",
    body: "Property data, scope, pricing logic, and historical bids resolved instantly. Quotes go out while competitors are still scheduling estimates.",
  },
  {
    title: "Coordinate every calendar, handoff, and follow-through.",
    body: "Bookings, internal handoffs, dependencies, and confirmations handled by a single coordinated layer. Nothing gets dropped between the cracks of two humans.",
  },
  {
    title: "Communicate with every customer like they're your only one.",
    body: "Welcome sequences, status updates, post-job follow-up, review requests, complaint resolution, re-engagement. All personalized. None forgotten.",
  },
  {
    title: "Run your back office on rails.",
    body: "Invoicing, payments, bookkeeping, expenses, payroll, contracts, and AR — handled by agents that don't take vacation, don't make typos, and report a daily P&L by 6 a.m.",
  },
  {
    title: "See what every team is producing, in real time.",
    body: "Output, throughput, response times, and quality monitored across every role. When a person can't get to a follow-up, an agent does it for them — and flags the pattern.",
  },
  {
    title: "Run operations, supply chain, and compliance unattended.",
    body: "Whatever your business has to keep watched — inventory, vendors, contracts, certifications, infrastructure — agents watch it and act on it without a Monday morning meeting.",
  },
  {
    title: "Forecast revenue before it happens.",
    body: "Funnel analytics, customer lifetime value, demand prediction, and pricing optimization — surfaced as a single intelligence layer your leadership team actually reads.",
  },
];

export default function Capabilities() {
  return (
    <section
      id="capabilities"
      className="relative py-32 md:py-48 border-t border-[--color-line]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease }}
          className="flex items-center gap-3 mb-20"
        >
          <span className="text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim]">
            02 — Capabilities
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease }}
          className="font-display text-balance text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] max-w-5xl"
        >
          What your business
          <br />
          <span className="italic text-[--color-fg-muted]">
            stops doing manually.
          </span>
        </motion.h2>

        <div className="mt-24 md:mt-32 grid md:grid-cols-2 gap-px bg-[--color-line]">
          {capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease, delay: (i % 2) * 0.1 }}
              className="bg-[--color-bg] p-10 md:p-14 hover:bg-[--color-bg-elevated]/50 transition-colors duration-700 group"
            >
              <div className="flex items-start gap-6">
                <span className="text-xs text-[--color-fg-dim] font-mono mt-2 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div>
                  <h3 className="font-display text-2xl md:text-[32px] leading-[1.1] tracking-[-0.015em] text-[--color-fg] group-hover:text-[--color-accent] transition-colors duration-700">
                    {cap.title}
                  </h3>
                  <p className="mt-5 text-[15px] md:text-base text-[--color-fg-muted] leading-relaxed text-pretty">
                    {cap.body}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
