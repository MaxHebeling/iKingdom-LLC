"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

type Lang = "en" | "es";

type HeroCopy = {
  eyebrowTop: string;
  eyebrowBottom: string;
  headlineBefore: string;
  headlineItalic: string;
  headlineAfter: string;
  subhead: string;
  tagline: string;
  ctaPrimary: string;
  ctaSecondary: string;
  liveDeployments: string;
  inActiveBuild: string;
  scroll: string;
};

const COPY: Record<Lang, HeroCopy> = {
  en: {
    eyebrowTop: "The system that scales with you",
    eyebrowBottom: "The world's first AI operations firm",
    headlineBefore: "We build the first",
    headlineItalic: "companies",
    headlineAfter: " that run themselves.",
    subhead:
      "We design and install autonomous AI operations inside ambitious businesses. Eighty agents. Nine tiers. From first contact to final invoice — running as one coordinated, supervised system.",
    tagline: "Built once. Reshaped continuously. Yours forever.",
    ctaPrimary: "Begin Application",
    ctaSecondary: "See it run",
    liveDeployments: "Live deployments",
    inActiveBuild: "In active build",
    scroll: "Scroll",
  },
  es: {
    eyebrowTop: "El sistema que escala contigo",
    eyebrowBottom: "La primera firma de operaciones de IA del mundo",
    headlineBefore: "Construimos las primeras",
    headlineItalic: "compañías",
    headlineAfter: " que operan solas.",
    subhead:
      "Diseñamos e instalamos operaciones autónomas de IA dentro de empresas ambiciosas. Ochenta agentes. Nueve niveles. Desde el primer contacto hasta la última factura — funcionando como un sistema único, coordinado y supervisado.",
    tagline: "Construido una vez. Reformado continuamente. Tuyo para siempre.",
    ctaPrimary: "Iniciar solicitud",
    ctaSecondary: "Velo en acción",
    liveDeployments: "Despliegues en vivo",
    inActiveBuild: "En construcción activa",
    scroll: "Desliza",
  },
};

export default function Hero({ lang = "en" }: { lang?: Lang }) {
  const t = COPY[lang];

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
          className="flex items-start gap-3 mb-10 md:mb-14"
        >
          <span className="h-px w-8 bg-[--color-accent] mt-[0.55rem]" />
          <span className="flex flex-col gap-1.5">
            <span className="text-[12px] md:text-sm uppercase tracking-[0.28em] text-[--color-fg] font-medium">
              {t.eyebrowTop}
            </span>
            <span className="text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim]">
              {t.eyebrowBottom}
            </span>
          </span>
        </motion.div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease, delay: 0.5 }}
          className="font-display text-balance text-[clamp(3rem,9vw,9.5rem)] leading-[0.92] tracking-[-0.025em] text-[--color-fg]"
        >
          {t.headlineBefore}
          <br />
          <span className="italic text-[--color-accent]">
            {t.headlineItalic}
          </span>
          {t.headlineAfter}
        </motion.h1>

        {/* Subhead */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.9 }}
          className="mt-12 md:mt-16 max-w-2xl text-pretty text-base md:text-lg leading-relaxed text-[--color-fg-muted]"
        >
          {t.subhead}
        </motion.p>

        {/* Supporting tagline */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 1.05 }}
          className="mt-8 md:mt-10 flex items-center gap-3"
        >
          <span className="h-px w-6 bg-[--color-line-strong]" />
          <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-[--color-accent] font-medium">
            {t.tagline}
          </span>
        </motion.div>

        {/* CTA row */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 1.25 }}
          className="mt-10 md:mt-14 flex flex-wrap items-center gap-6"
        >
          <a
            href="#apply"
            className="group relative inline-flex items-center gap-3 px-7 py-4 bg-[--color-fg] text-[--color-bg] text-sm tracking-wide hover:bg-[--color-accent] hover:text-[--color-bg] transition-all duration-500 rounded-full"
          >
            {t.ctaPrimary}
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
            href="#console"
            className="text-sm text-[--color-fg-muted] hover:text-[--color-fg] transition-colors duration-300 underline underline-offset-4 decoration-[--color-line-strong] hover:decoration-[--color-fg]"
          >
            {t.ctaSecondary}
          </a>
        </motion.div>

        {/* Trust strip — only verifiable real counts */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4, ease, delay: 1.4 }}
          className="mt-16 md:mt-20 flex flex-wrap items-center gap-10 md:gap-14"
        >
          <TrustStat value="6" label={t.liveDeployments} />
          <TrustStat value="3" label={t.inActiveBuild} />
        </motion.div>
      </div>

      {/* Scroll affordance — placeholder marker for next block */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 2 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3"
      >
        <span className="text-[10px] uppercase tracking-[0.3em] text-[--color-fg-dim]">
          {t.scroll}
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

function TrustStat({ value, label }: { value: string; label: string }) {
  return (
    <div className="flex flex-col">
      <span className="font-display text-3xl md:text-4xl tracking-[-0.02em] text-[--color-fg] tabular-nums leading-none">
        {value}
      </span>
      <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[--color-fg-dim] mt-3 font-medium">
        {label}
      </span>
    </div>
  );
}
