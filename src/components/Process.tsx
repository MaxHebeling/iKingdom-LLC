"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const phases = [
  {
    n: "I",
    label: "Months 1 – 2",
    title: "Discovery & Architecture",
    body: "We embed with your operators. Map every workflow, every handoff, every leak. Architect the agent topology specific to your business model. You receive a written plan covering all 80 agents and their integration points.",
  },
  {
    n: "II",
    label: "Months 3 – 6",
    title: "Build & Integrate",
    body: "We construct your agent layer, your CRM, your pipeline, your dispatch system, and the adapters that bind them to the tools you already use. Tier by tier, function by function. Nothing is theoretical — everything is built against your real data.",
  },
  {
    n: "III",
    label: "Months 7 – 10",
    title: "Deploy & Supervise",
    body: "Agents go live under full human checkpoint. Your team reviews every output. We measure accuracy daily. When an agent crosses 98%, its checkpoint graduates. The dependency on your people thins, week over week.",
  },
  {
    n: "IV",
    label: "Months 11 – 12",
    title: "Graduate & Scale",
    body: "By the end of year one, the majority of your business runs without human approval gates. We hand over the keys, the documentation, and the intelligence dashboard. You own the system. We remain on call.",
  },
];

export default function Process() {
  return (
    <section
      id="process"
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
            03 — Process
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease }}
          className="font-display text-balance text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] max-w-5xl"
        >
          Twelve months.
          <br />
          <span className="italic text-[--color-fg-muted]">
            Four phases.
          </span>
        </motion.h2>

        <div className="mt-24 md:mt-32 space-y-px bg-[--color-line]">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease, delay: i * 0.08 }}
              className="bg-[--color-bg] py-12 md:py-16 px-2 md:px-0"
            >
              <div className="grid md:grid-cols-12 gap-6 md:gap-12 items-start">
                <div className="md:col-span-2 flex md:block items-baseline gap-4">
                  <span className="font-display text-5xl md:text-7xl text-[--color-accent] leading-none">
                    {phase.n}
                  </span>
                  <span className="block text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim] mt-0 md:mt-4">
                    {phase.label}
                  </span>
                </div>
                <div className="md:col-span-10 md:pl-8 md:border-l md:border-[--color-line]">
                  <h3 className="font-display text-3xl md:text-5xl tracking-[-0.015em] leading-[1.05] text-[--color-fg]">
                    {phase.title}
                  </h3>
                  <p className="mt-6 max-w-3xl text-base md:text-[17px] text-[--color-fg-muted] leading-relaxed text-pretty">
                    {phase.body}
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
