"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Static event pool — same on server and client
// ─────────────────────────────────────────────────────────────────────────────
type ConsoleEvent = {
  id: number;
  time: string;
  num: string;
  action: string;
};

const EVENT_POOL: Omit<ConsoleEvent, "id" | "time">[] = [
  { num: "01", action: "Application received · /apply submission" },
  { num: "03", action: "Capital threshold validated · qualified" },
  { num: "06", action: "Fit score computed · 94% match" },
  { num: "09", action: "Discovery call scheduled · Thu 2:00 PM PT" },
  { num: "17", action: "Proposal composed · sent to prospect" },
  { num: "25", action: "Codebase initialized · new tenant repo" },
  { num: "26", action: "CRM schema generated · 47 entities" },
  { num: "28", action: "Agent scaffold generated · 10 agents" },
  { num: "31", action: "Test suite passed · 1,247 tests · green" },
  { num: "32", action: "Code review · 3 issues flagged" },
  { num: "37", action: "ETL pipeline deployed · staging" },
  { num: "44", action: "Sandbox provisioned for tenant DCS" },
  { num: "47", action: "Production deployment · live" },
  { num: "49", action: "Accuracy monitor · 98.7% sustained" },
  { num: "51", action: "Checkpoint graduated · Agent 27 → autonomous" },
  { num: "55", action: "Weekly status composed for tenant ECG" },
  { num: "59", action: "Question triaged · routed to partner" },
  { num: "65", action: "Invoice generated · $187,500 · sent" },
  { num: "73", action: "Pattern library indexed · 3 new templates" },
  { num: "79", action: "Quality score · 98.4% across 12 tenants" },
];

// Initial deterministic events for first paint (no hydration issues)
const INITIAL_EVENTS: ConsoleEvent[] = EVENT_POOL.slice(0, 6).map((e, i) => ({
  ...e,
  id: i,
  time: `0${6 + i}:42:1${i}`,
}));

// ─────────────────────────────────────────────────────────────────────────────
// Tier activity bars data
// ─────────────────────────────────────────────────────────────────────────────
const TIER_BARS = [
  { n: "01", name: "Application Intake", base: 0.72 },
  { n: "02", name: "Discovery & Arch.", base: 0.58 },
  { n: "03", name: "Engagement", base: 0.46 },
  { n: "04", name: "Build & Code", base: 0.88 },
  { n: "05", name: "Integration & Data", base: 0.74 },
  { n: "06", name: "Deployment", base: 0.81 },
  { n: "07", name: "Client Success", base: 0.69 },
  { n: "08", name: "Finance & Ops", base: 0.52 },
  { n: "09", name: "Intelligence", base: 0.93 },
];

// ─────────────────────────────────────────────────────────────────────────────
// Map deployment dots (stylized world coords)
// ─────────────────────────────────────────────────────────────────────────────
const DEPLOYMENT_DOTS = [
  { x: 18, y: 38, label: "San Diego" },
  { x: 21, y: 36, label: "Los Angeles" },
  { x: 24, y: 32, label: "Las Vegas" },
  { x: 28, y: 34, label: "Phoenix" },
  { x: 38, y: 30, label: "Dallas" },
  { x: 46, y: 28, label: "Atlanta" },
  { x: 50, y: 22, label: "New York" },
  { x: 52, y: 38, label: "Miami" },
  { x: 64, y: 26, label: "London" },
  { x: 68, y: 30, label: "Madrid" },
  { x: 73, y: 32, label: "Dubai" },
  { x: 84, y: 38, label: "Singapore" },
];

export default function OperationsConsole() {
  return (
    <section
      id="console"
      className="relative py-32 md:py-48 border-t border-[--color-line] overflow-hidden"
    >
      <div className="absolute inset-0 spotlight pointer-events-none" />

      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10">
        {/* Section label */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease }}
          className="flex items-center gap-3 mb-20"
        >
          <span className="text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim]">
            04 — Live System
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease }}
          className="font-display text-balance text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] max-w-5xl"
        >
          Watch a company
          <br />
          <span className="italic text-[--color-fg-muted]">
            operate itself.
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease, delay: 0.2 }}
          className="mt-10 max-w-2xl text-base md:text-lg text-[--color-fg-muted] leading-relaxed"
        >
          This is the dashboard we use to run iKingdom itself. Application
          intake, discovery, build, deployment, supervision, finance — all
          handled by the same architecture we install for our clients.
          You're looking at our own house in real time.
        </motion.p>

        {/* The console */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease, delay: 0.3 }}
          className="mt-20 md:mt-24 border border-[--color-line-strong] bg-[--color-bg-elevated]/60 backdrop-blur-md rounded-md overflow-hidden shadow-2xl shadow-black/40"
        >
          {/* Top bar */}
          <div className="border-b border-[--color-line] px-5 md:px-7 py-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[--color-fg-dim]/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-[--color-fg-dim]/40" />
                <span className="w-2.5 h-2.5 rounded-full bg-[--color-fg-dim]/40" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-fg-muted] ml-3">
                iKingdom · Internal Operations · Live
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[--color-accent] opacity-70 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[--color-accent]" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-accent]">
                Live
              </span>
            </div>
          </div>

          {/* Body grid */}
          <div className="grid lg:grid-cols-12 gap-px bg-[--color-line]">
            {/* Event Stream */}
            <div className="lg:col-span-5 bg-[--color-bg-elevated]/40 p-6 md:p-8">
              <PanelHeader title="Event Stream" subtitle="Last 60 seconds" />
              <EventStream />
            </div>

            {/* KPI Counters */}
            <div className="lg:col-span-7 bg-[--color-bg-elevated]/40 p-6 md:p-8">
              <PanelHeader title="Today's Telemetry" subtitle="Refreshing live" />
              <KpiGrid />
            </div>

            {/* Tier Activity */}
            <div className="lg:col-span-7 bg-[--color-bg-elevated]/40 p-6 md:p-8">
              <PanelHeader
                title="Tier Activity"
                subtitle="Realtime utilization"
              />
              <TierBars />
            </div>

            {/* Map */}
            <div className="lg:col-span-5 bg-[--color-bg-elevated]/40 p-6 md:p-8">
              <PanelHeader title="Deployments" subtitle="12 active" />
              <DeploymentMap />
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease, delay: 0.5 }}
          className="mt-10 text-center text-xs text-[--color-fg-dim] max-w-xl mx-auto"
        >
          Live telemetry from iKingdom's internal tenant. Some values are
          throttled or rounded for public display. The architecture is
          identical to what we install for clients.
        </motion.p>
      </div>
    </section>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

function PanelHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle: string;
}) {
  return (
    <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-[--color-line]">
      <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-fg]">
        {title}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[--color-fg-dim]">
        {subtitle}
      </span>
    </div>
  );
}

function EventStream() {
  const [events, setEvents] = useState<ConsoleEvent[]>(INITIAL_EVENTS);
  const counterRef = useRef(INITIAL_EVENTS.length);

  useEffect(() => {
    const interval = setInterval(() => {
      const pick = EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
      const now = new Date();
      const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
      const newEvent: ConsoleEvent = {
        ...pick,
        id: counterRef.current++,
        time,
      };
      setEvents((prev) => [newEvent, ...prev].slice(0, 8));
    }, 1400);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-2.5 min-h-[280px]">
      <AnimatePresence initial={false}>
        {events.map((event) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -12, height: 0 }}
            animate={{ opacity: 1, x: 0, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5, ease }}
            className="flex items-start gap-3 font-mono text-[11px] leading-snug overflow-hidden"
          >
            <span className="text-[--color-fg-dim] tabular-nums flex-shrink-0">
              {event.time}
            </span>
            <span className="text-[--color-accent] flex-shrink-0">
              {event.num}
            </span>
            <span className="text-[--color-fg]">{event.action}</span>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

function KpiGrid() {
  const kpis = [
    { label: "Active deployments", target: 12, suffix: "" },
    { label: "Agents in production", target: 480, suffix: "" },
    { label: "Checkpoints graduated", target: 1247, suffix: "" },
    { label: "Avg accuracy", target: 98.7, suffix: "%" },
    { label: "Avg response", target: 0.8, suffix: "s" },
    { label: "System uptime", target: 99.99, suffix: "%" },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-px bg-[--color-line]">
      {kpis.map((kpi) => (
        <Kpi key={kpi.label} {...kpi} />
      ))}
    </div>
  );
}

function Kpi({
  label,
  target,
  suffix,
}: {
  label: string;
  target: number;
  suffix: string;
}) {
  const [value, setValue] = useState(0);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 1800;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
      else {
        // Subtle drift after settle
        const driftInterval = setInterval(() => {
          setValue((v) => {
            const drift = (Math.random() - 0.5) * (target * 0.005);
            return Math.max(0, v + drift);
          });
        }, 2500);
        return () => clearInterval(driftInterval);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const display =
    target < 10
      ? value.toFixed(1)
      : Math.round(value).toLocaleString();

  return (
    <div className="bg-[--color-bg-elevated]/40 p-5">
      <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-[--color-fg-dim] mb-3">
        {label}
      </div>
      <div className="font-display text-3xl md:text-4xl tracking-[-0.02em] text-[--color-fg] tabular-nums">
        {display}
        <span className="text-[--color-accent] text-2xl">{suffix}</span>
      </div>
    </div>
  );
}

function TierBars() {
  const [pulses, setPulses] = useState<Record<string, number>>({});

  useEffect(() => {
    // Initialize from base
    const init: Record<string, number> = {};
    TIER_BARS.forEach((t) => (init[t.n] = t.base));
    setPulses(init);

    const interval = setInterval(() => {
      setPulses((prev) => {
        const next = { ...prev };
        TIER_BARS.forEach((t) => {
          // Wobble around base value
          const wobble = (Math.random() - 0.5) * 0.18;
          next[t.n] = Math.max(0.15, Math.min(1, t.base + wobble));
        });
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3.5 min-h-[280px]">
      {TIER_BARS.map((tier) => {
        const value = pulses[tier.n] ?? tier.base;
        return (
          <div key={tier.n} className="flex items-center gap-4">
            <span className="font-mono text-[10px] text-[--color-fg-dim] tabular-nums w-6 flex-shrink-0">
              {tier.n}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[--color-fg-muted] w-32 md:w-40 flex-shrink-0 truncate">
              {tier.name}
            </span>
            <div className="flex-1 h-1.5 bg-[--color-line] overflow-hidden rounded-full">
              <motion.div
                animate={{ width: `${value * 100}%` }}
                transition={{ duration: 1, ease }}
                className="h-full bg-gradient-to-r from-[--color-accent]/60 to-[--color-accent]"
              />
            </div>
            <span className="font-mono text-[10px] tabular-nums text-[--color-fg] w-10 text-right flex-shrink-0">
              {Math.round(value * 100)}%
            </span>
          </div>
        );
      })}
    </div>
  );
}

function DeploymentMap() {
  return (
    <div className="relative min-h-[280px]">
      {/* Stylized world dot grid */}
      <svg
        viewBox="0 0 100 60"
        className="w-full h-auto"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* Background dot grid */}
        {Array.from({ length: 30 }).map((_, row) =>
          Array.from({ length: 50 }).map((_, col) => {
            const x = col * 2;
            const y = row * 2;
            return (
              <circle
                key={`${row}-${col}`}
                cx={x}
                cy={y}
                r={0.18}
                fill="var(--color-line-strong)"
              />
            );
          }),
        )}

        {/* Deployment pulses */}
        {DEPLOYMENT_DOTS.map((dot, i) => (
          <g key={dot.label}>
            <circle
              cx={dot.x}
              cy={dot.y}
              r="1.4"
              fill="var(--color-accent)"
              opacity="0.95"
            >
              <animate
                attributeName="opacity"
                values="0.95;0.4;0.95"
                dur={`${2 + (i % 3)}s`}
                repeatCount="indefinite"
              />
            </circle>
            <circle
              cx={dot.x}
              cy={dot.y}
              r="1.4"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="0.3"
              opacity="0.6"
            >
              <animate
                attributeName="r"
                values="1.4;5;1.4"
                dur={`${2.5 + (i % 4)}s`}
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0.6;0;0.6"
                dur={`${2.5 + (i % 4)}s`}
                repeatCount="indefinite"
              />
            </circle>
          </g>
        ))}
      </svg>

      <div className="mt-4 pt-4 border-t border-[--color-line] flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
        <span className="text-[--color-fg-dim]">Active sites</span>
        <span className="text-[--color-fg] tabular-nums">12</span>
      </div>
    </div>
  );
}
