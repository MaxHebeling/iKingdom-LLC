"use client";

import { motion, type Variants } from "framer-motion";
import { type ReactNode, useEffect, useRef, useState } from "react";

/**
 * Reusable micro-interaction primitives for iKingdom.
 * Import and wrap elements to add consistent, brand-aligned motion.
 */

const ease = [0.16, 1, 0.3, 1] as const;

/* ── Reveal on scroll ────────────────────────────────── */

type RevealProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: "up" | "down" | "left" | "right";
  distance?: number;
};

const directionMap: Record<string, { x?: number; y?: number }> = {
  up: { y: 1 },
  down: { y: -1 },
  left: { x: 1 },
  right: { x: -1 },
};

export function Reveal({
  children,
  className = "",
  delay = 0,
  direction = "up",
  distance = 24,
}: RevealProps) {
  const axis = directionMap[direction];
  const initial: Record<string, number> = { opacity: 0 };
  if (axis.x !== undefined) initial.x = axis.x * distance;
  if (axis.y !== undefined) initial.y = axis.y * distance;

  return (
    <motion.div
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 1.2, ease, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ── Magnetic hover (element follows cursor slightly) ── */

type MagneticProps = {
  children: ReactNode;
  className?: string;
  strength?: number;
};

export function Magnetic({
  children,
  className = "",
  strength = 0.3,
}: MagneticProps) {
  return (
    <motion.div
      className={className}
      whileHover="hover"
      onMouseMove={(e) => {
        const rect = e.currentTarget.getBoundingClientRect();
        const x = (e.clientX - rect.left - rect.width / 2) * strength;
        const y = (e.clientY - rect.top - rect.height / 2) * strength;
        e.currentTarget.style.transform = `translate(${x}px, ${y}px)`;
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translate(0px, 0px)";
        e.currentTarget.style.transition = "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)";
      }}
    >
      {children}
    </motion.div>
  );
}

/* ── Stagger children ────────────────────────────────── */

const staggerContainerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
};

const staggerItemVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] },
  },
};

export function StaggerContainer({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      variants={staggerContainerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-60px" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div variants={staggerItemVariants} className={className}>
      {children}
    </motion.div>
  );
}

/* ── Gold line draw ──────────────────────────────────── */

export function GoldLine({
  className = "",
  width = 32,
}: {
  className?: string;
  width?: number;
}) {
  return (
    <motion.span
      className={`inline-block h-px bg-[--color-accent] ${className}`}
      initial={{ width: 0, opacity: 0 }}
      whileInView={{ width, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 1.2, ease }}
    />
  );
}

/* ── Pulse dot (live indicator) ──────────────────────── */

export function PulseDot({
  size = 6,
  className = "",
}: {
  size?: number;
  className?: string;
}) {
  return (
    <span className={`relative inline-flex ${className}`}>
      <motion.span
        className="absolute inline-flex rounded-full bg-[--color-accent] opacity-40"
        style={{ width: size * 2, height: size * 2, top: -size / 2, left: -size / 2 }}
        animate={{ scale: [1, 1.8, 1], opacity: [0.4, 0, 0.4] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <span
        className="relative inline-flex rounded-full bg-[--color-accent]"
        style={{ width: size, height: size }}
      />
    </span>
  );
}

/* ── Button hover underline (for text links) ─────────── */

export function HoverLine({
  children,
  className = "",
  href,
}: {
  children: ReactNode;
  className?: string;
  href: string;
}) {
  return (
    <motion.a
      href={href}
      className={`relative inline-block text-[--color-fg-muted] hover:text-[--color-fg] transition-colors duration-300 ${className}`}
      whileHover="hover"
    >
      {children}
      <motion.span
        className="absolute bottom-0 left-0 h-px bg-[--color-accent]"
        variants={{
          hover: { width: "100%" },
        }}
        initial={{ width: "0%" }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
      />
    </motion.a>
  );
}

/* ── Scale tap (for buttons) ─────────────────────────── */

export function ScaleTap({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.div>
  );
}

/* ── Counter (animated number) ───────────────────────── */

type CounterProps = {
  from?: number;
  to: number;
  duration?: number;
  className?: string;
  suffix?: string;
};

export function Counter({
  from = 0,
  to,
  duration = 2,
  className = "",
  suffix = "",
}: CounterProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(from);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) setStarted(true);
      },
      { threshold: 0.5 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / (duration * 1000));
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(Math.round(from + (to - from) * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [started, from, to, duration]);

  return (
    <span ref={ref} className={className}>
      {value}
      {suffix}
    </span>
  );
}
