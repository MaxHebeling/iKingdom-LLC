"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

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
      "Your business, running autonomously — from first contact to final invoice.",
    tagline: "Built once. Reshaped continuously. Yours forever.",
    ctaPrimary: "Begin Application",
    ctaSecondary: "Book a 30-min call",
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
      "Tu negocio, operando solo — desde el primer contacto hasta la última factura.",
    tagline: "Construido una vez. Reformado continuamente. Tuyo para siempre.",
    ctaPrimary: "Iniciar solicitud",
    ctaSecondary: "Agenda una llamada de 30 min",
    liveDeployments: "Despliegues en vivo",
    inActiveBuild: "En construcción activa",
    scroll: "Desliza",
  },
};

/** Split text into word spans for staggered opacity+translateY reveal */
function WordSplit({
  text,
  className,
}: {
  text: string;
  className?: string;
}) {
  return (
    <>
      {text.split(" ").map((word, i) => (
        <span key={i} className="inline-block">
          <span className={`hero-word inline-block ${className ?? ""}`}>
            {word}
          </span>
          {i < text.split(" ").length - 1 && (
            <span className="inline-block">&nbsp;</span>
          )}
        </span>
      ))}
    </>
  );
}

export default function Hero({ lang = "en" }: { lang?: Lang }) {
  const t = COPY[lang];
  const containerRef = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const ease = "cubic-bezier(0.16, 1, 0.3, 1)";
      const customEase = "power3.out";

      const tl = gsap.timeline({ defaults: { ease: customEase } });

      // 1. Eyebrow: fade in + slide up, stagger the two lines
      tl.fromTo(
        ".hero-eyebrow-line",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.12 },
        0
      );

      // 2. Headline: opacity + translateY reveal per word.
      // Words start partially visible (opacity 0.3) so the headline is the
      // LCP element on first paint, not blocked behind the animation.
      tl.fromTo(
        ".hero-word",
        { opacity: 0.3, y: 20 },
        {
          opacity: 1,
          y: 0,
          duration: 0.9,
          stagger: 0.08,
          ease: "power4.out",
        },
        0.1
      );

      // Calculate when headline finishes to sequence subhead
      const wordCount =
        t.headlineBefore.split(" ").length +
        1 + // italic word
        t.headlineAfter.trim().split(" ").length;
      const headlineEnd = 0.1 + 0.9 + (wordCount - 1) * 0.08;

      // 3. Subhead: fade in + slide up, starts 0.2s after headline finishes
      tl.fromTo(
        ".hero-subhead",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1 },
        headlineEnd + 0.2
      );

      // 4. Tagline: gold line draws from width 0 -> full, then text fades in
      tl.fromTo(
        ".hero-tagline-line",
        { width: 0 },
        { width: 24, duration: 0.6 },
        headlineEnd + 0.4
      );
      tl.fromTo(
        ".hero-tagline-text",
        { opacity: 0 },
        { opacity: 1, duration: 0.7 },
        headlineEnd + 0.7
      );

      // 5. CTA buttons: slide up + fade in, staggered
      tl.fromTo(
        ".hero-cta",
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.8, stagger: 0.1 },
        headlineEnd + 0.6
      );

      // 6. Stats bar: fade in last
      tl.fromTo(
        ".hero-stats",
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 1 },
        headlineEnd + 0.8
      );

      // 7. Scroll affordance
      tl.fromTo(
        ".hero-scroll",
        { opacity: 0 },
        { opacity: 1, duration: 1.2 },
        headlineEnd + 1.2
      );

      // Scroll affordance bounce (infinite)
      gsap.to(".hero-scroll-bar", {
        y: 8,
        duration: 1.2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="top"
      aria-label={lang === "es" ? "Inicio" : "Hero"}
      className="relative min-h-screen flex flex-col justify-center overflow-hidden"
    >
      {/* Cinematic spotlight wash */}
      <div className="absolute inset-0 spotlight pointer-events-none" />

      {/* Subtle horizon line */}
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-[--color-line-strong] to-transparent" />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10 w-full pt-32 md:pt-40 pb-24">
        {/* Eyebrow */}
        <div className="flex items-start gap-3 mb-10 md:mb-14">
          <span className="h-px w-8 bg-[--color-accent] mt-[0.55rem]" />
          <span className="flex flex-col gap-1.5">
            <span className="hero-eyebrow-line text-[12px] md:text-sm uppercase tracking-[0.28em] text-[--color-fg] font-medium opacity-0">
              {t.eyebrowTop}
            </span>
            <span className="hero-eyebrow-line text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim] opacity-0">
              {t.eyebrowBottom}
            </span>
          </span>
        </div>

        {/* Headline — rendered immediately visible via clip-path (LCP safe) */}
        <h1 className="font-display text-balance text-[clamp(3rem,9vw,9.5rem)] leading-[0.92] tracking-[-0.025em] text-[--color-fg]">
          <WordSplit text={t.headlineBefore} />
          <br />
          <span className="inline-block">
            <span className="hero-word inline-block italic text-[--color-accent]">
              {t.headlineItalic}
            </span>
          </span>
          <span className="inline-block">&nbsp;</span>
          <WordSplit text={t.headlineAfter.trim()} />
        </h1>

        {/* Subhead */}
        <p className="hero-subhead mt-12 md:mt-16 max-w-2xl text-pretty text-base md:text-lg leading-relaxed text-[--color-fg-muted] opacity-0">
          {t.subhead}
        </p>

        {/* Supporting tagline */}
        <div className="mt-8 md:mt-10 flex items-center gap-3">
          <span className="hero-tagline-line h-px bg-[--color-line-strong]" style={{ width: 0 }} />
          <span className="hero-tagline-text font-mono text-[10px] md:text-[11px] uppercase tracking-[0.22em] text-[--color-accent] font-medium opacity-0">
            {t.tagline}
          </span>
        </div>

        {/* CTA row */}
        <div className="mt-10 md:mt-14 flex flex-wrap items-center gap-6">
          <a
            href="#apply"
            className="hero-cta group relative inline-flex items-center gap-3 px-7 py-4 bg-[--color-fg] text-[--color-bg] text-sm tracking-wide hover:bg-[--color-accent] hover:text-[--color-bg] transition-all duration-500 rounded-full overflow-hidden opacity-0"
          >
            <span className="relative z-10">{t.ctaPrimary}</span>
            <svg
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="none"
              aria-hidden="true"
              className="relative z-10 transition-transform duration-500 group-hover:translate-x-1"
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
            href="https://calendly.com/executive-ikingdom/30min"
            target="_blank"
            rel="noopener noreferrer"
            className="hero-cta text-sm text-[--color-fg-muted] hover:text-[--color-fg] transition-colors duration-300 underline underline-offset-4 decoration-[--color-line-strong] hover:decoration-[--color-fg] opacity-0"
          >
            {t.ctaSecondary}
          </a>
        </div>

        {/* Trust strip — only verifiable real counts */}
        <div className="hero-stats mt-16 md:mt-20 flex flex-wrap items-center gap-10 md:gap-14 opacity-0">
          <TrustStat value="6" label={t.liveDeployments} />
          <TrustStat value="3" label={t.inActiveBuild} />
        </div>
      </div>

      {/* Scroll affordance */}
      <div className="hero-scroll absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-3 opacity-0">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[--color-fg-dim]">
          {t.scroll}
        </span>
        <div className="hero-scroll-bar w-px h-10 bg-gradient-to-b from-[--color-fg-dim] to-transparent" />
      </div>
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
