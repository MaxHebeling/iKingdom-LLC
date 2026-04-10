"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const COPY = {
  en: {
    sectionLabel: "03 — Continuity",
    headlineLine1: "The system that scales",
    headlineLine2: "with you.",
    subhead: "Your business changes. So does your system.",
    intro:
      "Most software is sold as a snapshot — built for who you are today, frozen the moment it ships. iKingdom isn't software. It's a living operational layer. As you grow, it grows. As you pivot, it adapts. As you add verticals, it expands. The architecture we install for you in year one will not look the same in year three — and that's the point.",
    milestones: [
      {
        phase: "DAY ONE",
        body: "We install the agent layer tailored to where your business stands today. Eighty agents, nine tiers, calibrated to your operations the morning we go live.",
      },
      {
        phase: "YEAR ONE",
        body: "Your business has changed. So has your system. New workflows, new integrations, new agents. We don't deprecate — we expand. Whatever's running now keeps running while we add the next layer.",
      },
      {
        phase: "YEAR THREE",
        body: "The architecture we shipped you year one barely resembles what you operate today. Same foundation. New shape. Still yours. The system has absorbed every new vertical, every new tool, every new market you've moved into.",
      },
      {
        phase: "FOREVER",
        body: "iKingdom isn't a deployment. It's a relationship. We keep building, refining, adding capability as long as your business needs to grow. Every iKingdom client gets a system that is never finished — because their business is never finished.",
      },
    ],
  },
  es: {
    sectionLabel: "03 — Continuidad",
    headlineLine1: "El sistema que escala",
    headlineLine2: "contigo.",
    subhead: "Tu negocio cambia. Tu sistema también.",
    intro:
      "La mayoría del software se vende como una instantánea — construido para quien eres hoy, congelado en el momento en que se entrega. iKingdom no es software. Es una capa operacional viva. A medida que creces, ella crece. A medida que pivotas, ella se adapta. A medida que añades verticales, ella se expande. La arquitectura que te instalamos en el año uno no se verá igual en el año tres — y ese es el punto.",
    milestones: [
      {
        phase: "DÍA UNO",
        body: "Instalamos la capa de agentes adaptada a donde está tu negocio hoy. Ochenta agentes, nueve niveles, calibrados a tus operaciones la mañana que arrancamos.",
      },
      {
        phase: "AÑO UNO",
        body: "Tu negocio ha cambiado. Tu sistema también. Nuevos flujos, nuevas integraciones, nuevos agentes. No despreciamos — expandimos. Lo que está funcionando sigue funcionando mientras añadimos la siguiente capa.",
      },
      {
        phase: "AÑO TRES",
        body: "La arquitectura que te entregamos en el año uno apenas se parece a lo que operas hoy. Mismo cimiento. Nueva forma. Sigue siendo tuya. El sistema ha absorbido cada nueva vertical, cada nueva herramienta, cada nuevo mercado al que te has movido.",
      },
      {
        phase: "PARA SIEMPRE",
        body: "iKingdom no es un despliegue. Es una relación. Seguimos construyendo, refinando, añadiendo capacidad mientras tu negocio necesite crecer. Cada cliente de iKingdom obtiene un sistema que nunca está terminado — porque su negocio nunca está terminado.",
      },
    ],
  },
} as const;

export default function Continuity({ lang = "en" }: { lang?: "en" | "es" }) {
  const copy = COPY[lang];
  return (
    <section
      id="continuity"
      aria-label={lang === "es" ? "Continuidad" : "Continuity"}
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
            {copy.sectionLabel}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease }}
          className="font-display text-balance text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] max-w-5xl"
        >
          {copy.headlineLine1}
          <br />
          <span className="italic text-[--color-fg-muted]">
            {copy.headlineLine2}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease, delay: 0.1 }}
          className="mt-8 text-sm md:text-base italic text-[--color-fg-muted] tracking-wide"
        >
          {copy.subhead}
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease, delay: 0.15 }}
          className="mt-10 max-w-2xl text-base md:text-[17px] text-[--color-fg-muted] leading-relaxed text-pretty"
        >
          {copy.intro}
        </motion.p>

        <div className="mt-24 md:mt-32 space-y-px bg-[--color-line-strong]">
          {copy.milestones.map((milestone, i) => (
            <motion.div
              key={milestone.phase}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease, delay: i * 0.08 }}
              className="bg-[--color-bg] py-12 md:py-16 px-2 md:px-0"
            >
              <div className="grid md:grid-cols-12 gap-6 md:gap-12 items-start">
                <div className="md:col-span-4">
                  <span className="font-display text-4xl md:text-6xl text-[--color-accent] leading-none tracking-[-0.01em]">
                    {milestone.phase}
                  </span>
                </div>
                <div className="md:col-span-8 md:pl-8 md:border-l md:border-[--color-line-strong]">
                  <p className="max-w-3xl text-base md:text-[17px] text-[--color-fg-muted] leading-relaxed text-pretty">
                    {milestone.body}
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
