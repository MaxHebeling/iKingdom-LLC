"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const cases = [
  {
    name: "A national moving & storage operator",
    redacted: true,
    sector: "Logistics · West Coast",
    body: "Full 80-agent deployment. AI receptionist, instant quoting, GPS-verified crew tracking, automated dispatch, and a finance tier that closes the day's books before midnight.",
    metric: "80 agents · live",
  },
  {
    name: "The world's first online brokerage & development firm",
    redacted: true,
    sector: "Real Estate · Global",
    body: "End-to-end transactional automation. Lead intake, qualification, document handling, and post-close communications running without a single human touchpoint on the standard path.",
    metric: "Founding deployment",
  },
  {
    name: "Distinct Construction Solutions",
    redacted: false,
    sector: "Construction · Southern California",
    body: "Full-stack BuildCore deployment with 97 agents extending the iKingdom architecture for the construction vertical. Permit acquisition, lead intelligence, and field operations under one system.",
    metric: "97 agents · live",
  },
  {
    name: "Elite Control Group LLC",
    redacted: false,
    sector: "Holding Company",
    body: "Centralized intelligence and finance layer across an operating portfolio. Shared agent infrastructure with per-entity isolation.",
    metric: "Active",
  },
  {
    name: "Kyros Global Capital",
    redacted: false,
    sector: "Capital · Investment",
    body: "Bespoke deployment architecture for an investment firm. Deal flow intake, due diligence assistance, and reporting automation built into the iKingdom framework.",
    metric: "In production",
  },
  {
    name: "Structura Aeternum",
    redacted: false,
    sector: "Architecture · Build",
    body: "Operational platform tailored to project-based work — bid intake, proposal generation, project tracking, and client communications running on the agent layer.",
    metric: "Active",
  },
];

export default function Proof() {
  return (
    <section
      id="proof"
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
            05 — Proof
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease }}
          className="font-display text-balance text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] max-w-5xl"
        >
          Companies built
          <br />
          <span className="italic text-[--color-fg-muted]">
            on the system.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease, delay: 0.2 }}
          className="mt-10 max-w-2xl text-sm md:text-base text-[--color-fg-muted] leading-relaxed"
        >
          Several of our deployments are protected by NDA. Where we cannot
          name a client, we describe the engagement. The companies below are
          live or in active production on the iKingdom architecture.
        </motion.p>

        <div className="mt-24 md:mt-32 grid md:grid-cols-2 gap-px bg-[--color-line]">
          {cases.map((c, i) => (
            <motion.article
              key={c.name}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease, delay: (i % 2) * 0.1 }}
              className="bg-[--color-bg] p-10 md:p-14 hover:bg-[--color-bg-elevated]/50 transition-colors duration-700 group flex flex-col"
            >
              <div className="flex items-start justify-between gap-4 mb-8">
                <span className="text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim]">
                  {c.sector}
                </span>
                {c.redacted && (
                  <span className="text-[10px] uppercase tracking-[0.2em] text-[--color-fg-dim] border border-[--color-line] px-2 py-1 rounded-full">
                    Under NDA
                  </span>
                )}
              </div>

              <h3 className="font-display text-2xl md:text-[34px] leading-[1.05] tracking-[-0.015em] text-[--color-fg] group-hover:text-[--color-accent] transition-colors duration-700">
                {c.name}
              </h3>

              <p className="mt-6 text-[15px] md:text-base text-[--color-fg-muted] leading-relaxed text-pretty flex-1">
                {c.body}
              </p>

              <div className="mt-10 pt-6 border-t border-[--color-line] flex items-center justify-between">
                <span className="text-xs text-[--color-fg-muted] tabular-nums">
                  {c.metric}
                </span>
                <span className="h-px w-8 bg-[--color-accent] opacity-60 group-hover:opacity-100 transition-opacity duration-700" />
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
