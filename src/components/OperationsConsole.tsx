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
          className="mt-20 md:mt-24 border border-[--color-line-strong] bg-[--color-bg-elevated]/80 backdrop-blur-sm rounded-md overflow-hidden shadow-2xl shadow-black/40"
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

            {/* Deployment map */}
            <div className="lg:col-span-5 bg-[--color-bg-elevated]/40 p-6 md:p-8">
              <PanelHeader title="Deployments" subtitle="Across the network" />
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
    { label: "Live deployments", target: 6, suffix: "" },
    { label: "In active build", target: 3, suffix: "" },
    { label: "Agents per system", target: 80, suffix: "" },
    { label: "Functional tiers", target: 9, suffix: "" },
    { label: "Verticals served", target: 4, suffix: "" },
    { label: "Graduation threshold", target: 98, suffix: "%" },
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

// ─────────────────────────────────────────────────────────────────────────────
// DeploymentMap — stylized SVG world map with pulsing cities and data arcs
// ─────────────────────────────────────────────────────────────────────────────

type City = {
  id: string;
  name: string;
  count: number;
  x: number;
  y: number;
};

const CITIES: City[] = [
  { id: "sd", name: "SAN DIEGO", count: 97, x: 18, y: 38 },
  { id: "la", name: "LOS ANGELES", count: 62, x: 19, y: 36 },
  { id: "dal", name: "DALLAS", count: 48, x: 35, y: 34 },
  { id: "glb", name: "GLOBAL", count: 31, x: 60, y: 28 },
];

// Arc pairs: [fromIndex, toIndex, dashOffsetDuration, delay]
const ARCS: Array<[number, number, number, number]> = [
  [0, 2, 3.2, 0],
  [2, 3, 4.1, 0.6],
  [1, 3, 3.6, 1.2],
  [0, 3, 4.8, 1.8],
];

function arcPath(a: City, b: City): string {
  // Quadratic curve whose control point is pulled "up" (toward y=0) to form an arc.
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.sqrt(dx * dx + dy * dy);
  // Perpendicular offset scaled by distance — bigger arc for longer links.
  const curve = Math.min(18, dist * 0.45);
  const cx = mx;
  const cy = my - curve;
  return `M ${a.x} ${a.y} Q ${cx} ${cy} ${b.x} ${b.y}`;
}

function DeploymentMap() {
  // Faint dot-grid background — rough landmass silhouette via ellipse masks.
  const gridDots: Array<{ cx: number; cy: number }> = [];
  for (let y = 6; y <= 54; y += 2) {
    for (let x = 4; x <= 96; x += 2) {
      // Approximate continents: skip dots outside rough landmass regions.
      const inAmericas =
        (x >= 10 && x <= 30 && y >= 18 && y <= 50) ||
        (x >= 22 && x <= 34 && y >= 36 && y <= 54);
      const inEurAfr =
        (x >= 46 && x <= 58 && y >= 14 && y <= 30) ||
        (x >= 48 && x <= 58 && y >= 28 && y <= 50);
      const inAsia =
        (x >= 58 && x <= 86 && y >= 14 && y <= 36) ||
        (x >= 78 && x <= 90 && y >= 38 && y <= 50);
      const inOceania = x >= 80 && x <= 92 && y >= 42 && y <= 52;
      if (inAmericas || inEurAfr || inAsia || inOceania) {
        gridDots.push({ cx: x, cy: y });
      }
    }
  }

  return (
    <div className="min-h-[280px] flex flex-col">
      <div className="relative flex-1 rounded-md border border-[--color-line] bg-[#120a04]/60 overflow-hidden">
        <svg
          viewBox="0 0 100 60"
          className="w-full h-full"
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <radialGradient id="cityGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0.9" />
              <stop offset="60%" stopColor="var(--color-accent)" stopOpacity="0.2" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--color-accent)" stopOpacity="0.9" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </linearGradient>
          </defs>

          {/* Dot grid landmasses */}
          <g fill="var(--color-accent)" opacity="0.18">
            {gridDots.map((d, i) => (
              <circle key={i} cx={d.cx} cy={d.cy} r="0.35" />
            ))}
          </g>

          {/* Animated data arcs */}
          <g fill="none" strokeLinecap="round">
            {ARCS.map(([fromIdx, toIdx, dur, delay], i) => {
              const path = arcPath(CITIES[fromIdx], CITIES[toIdx]);
              return (
                <g key={i}>
                  {/* Static faint base arc */}
                  <path
                    d={path}
                    stroke="var(--color-accent)"
                    strokeOpacity="0.12"
                    strokeWidth="0.25"
                  />
                  {/* Flowing dashed arc */}
                  <path
                    d={path}
                    stroke="url(#arcGrad)"
                    strokeWidth="0.55"
                    strokeDasharray="6 40"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="46"
                      to="0"
                      dur={`${dur}s`}
                      begin={`${delay}s`}
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              );
            })}
          </g>

          {/* City nodes */}
          {CITIES.map((c, i) => (
            <g key={c.id}>
              {/* Outer pulsing rings — SVG-native looping */}
              <circle
                cx={c.x}
                cy={c.y}
                r="0.8"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="0.2"
                opacity="0"
              >
                <animate
                  attributeName="r"
                  from="0.8"
                  to="5"
                  dur="3s"
                  begin={`${i * 0.7}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.7;0"
                  dur="3s"
                  begin={`${i * 0.7}s`}
                  repeatCount="indefinite"
                />
              </circle>
              <circle
                cx={c.x}
                cy={c.y}
                r="0.8"
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="0.15"
                opacity="0"
              >
                <animate
                  attributeName="r"
                  from="0.8"
                  to="7"
                  dur="3s"
                  begin={`${i * 0.7 + 1.4}s`}
                  repeatCount="indefinite"
                />
                <animate
                  attributeName="opacity"
                  values="0;0.5;0"
                  dur="3s"
                  begin={`${i * 0.7 + 1.4}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Soft halo */}
              <circle cx={c.x} cy={c.y} r="3" fill="url(#cityGlow)" />
              {/* Core dot */}
              <circle cx={c.x} cy={c.y} r="0.9" fill="var(--color-accent)">
                <animate
                  attributeName="opacity"
                  values="1;0.55;1"
                  dur="2.2s"
                  begin={`${i * 0.4}s`}
                  repeatCount="indefinite"
                />
              </circle>

              {/* Floating label */}
              <g transform={`translate(${c.x + 2.4}, ${c.y + 0.6})`}>
                {/* Live indicator dot */}
                <circle
                  cx="0"
                  cy="-0.7"
                  r="0.35"
                  fill="var(--color-accent)"
                >
                  <animate
                    attributeName="opacity"
                    values="1;0.3;1"
                    dur="1.6s"
                    begin={`${i * 0.3}s`}
                    repeatCount="indefinite"
                  />
                </circle>
                <text
                  x="0.9"
                  y="0"
                  fill="var(--color-fg-muted)"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fontSize="1.6"
                  letterSpacing="0.08"
                >
                  {c.name} · {c.count}
                </text>
              </g>
            </g>
          ))}

          {/* Corner crosshair ticks for console feel */}
          <g
            stroke="var(--color-accent)"
            strokeOpacity="0.35"
            strokeWidth="0.15"
          >
            <path d="M 2 2 L 5 2 M 2 2 L 2 5" />
            <path d="M 98 2 L 95 2 M 98 2 L 98 5" />
            <path d="M 2 58 L 5 58 M 2 58 L 2 55" />
            <path d="M 98 58 L 95 58 M 98 58 L 98 55" />
          </g>
        </svg>
      </div>

      <div className="mt-4 pt-4 border-t border-[--color-line] flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.18em]">
        <span className="text-[--color-fg-dim]">Network status</span>
        <span className="text-[--color-fg] tabular-nums">4 live · global</span>
      </div>
    </div>
  );
}
