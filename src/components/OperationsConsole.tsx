"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

// ─────────────────────────────────────────────────────────────────────────────
// Event pool — templates with {placeholders} get randomized in renderEvent()
// ─────────────────────────────────────────────────────────────────────────────
type ConsoleEvent = {
  id: number;
  time: string;
  num: string;
  action: string;
};

type EventTemplate = Omit<ConsoleEvent, "id" | "time">;

const EVENT_POOL: EventTemplate[] = [
  { num: "01", action: "Application received · /apply submission" },
  { num: "03", action: "Capital threshold validated · qualified" },
  { num: "06", action: "Fit score computed · {fit}% match" },
  { num: "09", action: "Discovery call scheduled · Thu 2:00 PM PT" },
  { num: "17", action: "Proposal composed · sent to prospect" },
  { num: "25", action: "Codebase initialized · new tenant repo" },
  { num: "26", action: "CRM schema generated · {entities} entities" },
  { num: "28", action: "Agent scaffold generated · 10 agents" },
  { num: "31", action: "{tests}" },
  { num: "32", action: "Code review · {issues} issues flagged" },
  { num: "37", action: "ETL pipeline deployed · staging" },
  { num: "44", action: "Sandbox provisioned for tenant DCS" },
  { num: "47", action: "Production deployment · live" },
  { num: "49", action: "Accuracy monitor · {accuracy}% sustained" },
  { num: "51", action: "Checkpoint graduated · Agent {agent} → autonomous" },
  { num: "55", action: "Weekly status composed for tenant ECG" },
  { num: "59", action: "Question triaged · routed to partner" },
  { num: "65", action: "Invoice generated · ${invoice} · sent" },
  { num: "73", action: "Pattern library indexed · {templates} new templates" },
  { num: "79", action: "Quality score · {quality}% across deployments" },
  { num: "81", action: "Payment received · ${payment} · reconciled" },
];

// Helpers for randomization
function rInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function fmtMoney(n: number): string {
  return n.toLocaleString("en-US");
}

function renderEvent(template: EventTemplate): EventTemplate {
  let action = template.action;

  if (action.includes("{fit}")) {
    action = action.replace("{fit}", String(rInt(88, 97)));
  }
  if (action.includes("{entities}")) {
    action = action.replace("{entities}", String(rInt(42, 62)));
  }
  if (action.includes("{tests}")) {
    // ~15% chance of a failing suite
    if (Math.random() < 0.15) {
      action = action.replace(
        "{tests}",
        `Test suite ran · ${rInt(1200, 1300).toLocaleString()} tests · ${rInt(2, 7)} failed`,
      );
    } else {
      action = action.replace(
        "{tests}",
        `Test suite passed · ${rInt(1200, 1300).toLocaleString()} tests · green`,
      );
    }
  }
  if (action.includes("{issues}")) {
    action = action.replace("{issues}", String(rInt(1, 6)));
  }
  if (action.includes("{accuracy}")) {
    const a = (96.2 + Math.random() * (99.4 - 96.2)).toFixed(1);
    action = action.replace("{accuracy}", a);
  }
  if (action.includes("{agent}")) {
    action = action.replace("{agent}", String(rInt(12, 79)));
  }
  if (action.includes("{invoice}")) {
    // $45K - $400K
    const v = rInt(45, 400) * 1000 + rInt(0, 999);
    action = action.replace("{invoice}", fmtMoney(v));
  }
  if (action.includes("{payment}")) {
    const v = rInt(30, 500) * 1000 + rInt(0, 999);
    action = action.replace("{payment}", fmtMoney(v));
  }
  if (action.includes("{templates}")) {
    action = action.replace("{templates}", String(rInt(1, 6)));
  }
  if (action.includes("{quality}")) {
    const q = (96 + Math.random() * 3).toFixed(1);
    action = action.replace("{quality}", q);
  }

  return { num: template.num, action };
}

// Initial deterministic events for first paint (no hydration issues).
// We keep the raw templates here so SSR sees literal placeholders? No — we
// need them to render cleanly. Use a deterministic initial list with
// pre-chosen values.
const INITIAL_EVENTS: ConsoleEvent[] = [
  { id: 0, time: "06:42:10", num: "01", action: "Application received · /apply submission" },
  { id: 1, time: "06:42:11", num: "03", action: "Capital threshold validated · qualified" },
  { id: 2, time: "06:42:12", num: "06", action: "Fit score computed · 94% match" },
  { id: 3, time: "06:42:13", num: "09", action: "Discovery call scheduled · Thu 2:00 PM PT" },
  { id: 4, time: "06:42:14", num: "17", action: "Proposal composed · sent to prospect" },
  { id: 5, time: "06:42:15", num: "25", action: "Codebase initialized · new tenant repo" },
];

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
    let timeoutId: ReturnType<typeof setTimeout>;

    const schedule = () => {
      // Vary arrival: 4000-7000ms
      const delay = 4000 + Math.random() * 3000;
      timeoutId = setTimeout(() => {
        const template =
          EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
        const rendered = renderEvent(template);
        const now = new Date();
        const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
        const newEvent: ConsoleEvent = {
          ...rendered,
          id: counterRef.current++,
          time,
        };
        setEvents((prev) => [newEvent, ...prev].slice(0, 8));
        schedule();
      }, delay);
    };

    schedule();
    return () => clearTimeout(timeoutId);
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

// ─────────────────────────────────────────────────────────────────────────────
// KPI Grid
// ─────────────────────────────────────────────────────────────────────────────

type KpiSpec = {
  label: string;
  target: number;
  suffix: string;
  /** If true, this KPI fluctuates — the target itself drifts over time. */
  drift?: { min: number; max: number };
};

function KpiGrid() {
  const kpis: KpiSpec[] = [
    { label: "Live deployments", target: 6, suffix: "" },
    { label: "In active build", target: 3, suffix: "" },
    { label: "Agents per system", target: 80, suffix: "" },
    { label: "Functional tiers", target: 9, suffix: "" },
    {
      label: "Inbound today",
      target: 12,
      suffix: "",
      drift: { min: 8, max: 22 },
    },
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

function Kpi({ label, target, suffix, drift }: KpiSpec) {
  const [value, setValue] = useState(0);
  // liveTarget is what we're animating toward; drifts over time if `drift` set.
  const liveTargetRef = useRef(target);

  useEffect(() => {
    let raf = 0;
    const start = performance.now();
    const duration = 1800;

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(liveTargetRef.current * eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      }
    };

    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  useEffect(() => {
    if (!drift) return;
    // Gradually drift the target within [min, max] every ~5s.
    const id = setInterval(() => {
      const current = liveTargetRef.current;
      // Small step: ±1 or ±2 with clamping
      const step = Math.random() < 0.5 ? -1 : 1;
      const magnitude = Math.random() < 0.7 ? 1 : 2;
      let next = current + step * magnitude;
      if (next < drift.min) next = drift.min + 1;
      if (next > drift.max) next = drift.max - 1;
      liveTargetRef.current = next;
      // Animate toward new target smoothly
      setValue((v) => v + (next - v) * 0.5);
      // Then settle fully on a follow-up tick
      setTimeout(() => setValue(liveTargetRef.current), 400);
    }, 5000);
    return () => clearInterval(id);
  }, [drift]);

  const display =
    target < 10 && !drift
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

// ─────────────────────────────────────────────────────────────────────────────
// TierBars — episodic spikes/dips, not uniform wobble
// ─────────────────────────────────────────────────────────────────────────────

type TierState = {
  value: number;
  // Active perturbation — decays over cycles
  spike: number;
  spikeRemaining: number;
};

function TierBars() {
  const [state, setState] = useState<Record<string, TierState>>(() => {
    const init: Record<string, TierState> = {};
    TIER_BARS.forEach((t) => {
      init[t.n] = { value: t.base, spike: 0, spikeRemaining: 0 };
    });
    return init;
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setState((prev) => {
        const next = { ...prev };

        // ~20% chance per cycle that a single random tier gets a new spike
        if (Math.random() < 0.2) {
          const target = TIER_BARS[Math.floor(Math.random() * TIER_BARS.length)];
          const direction = Math.random() < 0.5 ? -1 : 1;
          const magnitude = 0.18;
          next[target.n] = {
            ...next[target.n],
            spike: direction * magnitude,
            spikeRemaining: 3, // 3 update cycles to recover
          };
        }

        TIER_BARS.forEach((t) => {
          const current = next[t.n];
          // Gentle wobble for everyone
          const gentle = (Math.random() - 0.5) * 0.06;
          // Decay active spike toward zero
          let spike = current.spike;
          let remaining = current.spikeRemaining;
          if (remaining > 0) {
            remaining -= 1;
            spike = spike * (remaining / 3); // linear recovery
            if (remaining === 0) spike = 0;
          }
          const value = Math.max(
            0.15,
            Math.min(1, t.base + gentle + spike),
          );
          next[t.n] = { value, spike, spikeRemaining: remaining };
        });
        return next;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-3.5 min-h-[280px]">
      {TIER_BARS.map((tier) => {
        const s = state[tier.n];
        const value = s?.value ?? tier.base;
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
  /** Activity intensity: affects pulse period (lower = faster). */
  intensity: "high" | "med" | "low";
};

// 10 cities placed over the dot-grid landmasses (viewBox 100x60).
// Intensities vary so pulses feel like a real heatmap.
const CITIES: City[] = [
  // North America — primary hubs
  { id: "sd",  name: "SAN DIEGO",     count: 178, x: 14, y: 32, intensity: "high" },
  { id: "la",  name: "LOS ANGELES",   count:  94, x: 13, y: 30, intensity: "high" },
  { id: "sf",  name: "SAN FRANCISCO", count:  71, x: 12, y: 26, intensity: "high" },
  { id: "dal", name: "DALLAS",        count:  48, x: 22, y: 34, intensity: "med" },
  { id: "aus", name: "AUSTIN",        count:  33, x: 21, y: 36, intensity: "med" },
  { id: "chi", name: "CHICAGO",       count:  56, x: 24, y: 26, intensity: "med" },
  { id: "nyc", name: "NEW YORK",      count:  87, x: 28, y: 27, intensity: "high" },
  { id: "mia", name: "MIAMI",         count:  22, x: 27, y: 38, intensity: "low" },
  // Europe
  { id: "lon", name: "LONDON",        count:  41, x: 49, y: 22, intensity: "med" },
  // Asia
  { id: "sgp", name: "SINGAPORE",     count:   9, x: 78, y: 40, intensity: "low" },
];

// Arc pairs: [fromIndex, toIndex, dashOffsetDuration, delay]
// Connect SD to major hubs and cross-continental links.
const ARCS: Array<[number, number, number, number]> = [
  [0, 3, 3.2, 0],   // SD → DAL
  [0, 6, 3.8, 0.4], // SD → NYC
  [0, 8, 5.2, 0.8], // SD → LON
  [3, 6, 3.4, 1.2], // DAL → NYC
  [6, 8, 4.1, 1.6], // NYC → LON
  [8, 9, 5.8, 2.0], // LON → SGP
  [0, 9, 6.4, 2.4], // SD → SGP
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

// Map intensity → pulse timing
function pulseDur(intensity: City["intensity"]): number {
  if (intensity === "high") return 2.0;
  if (intensity === "med") return 3.0;
  return 4.2;
}
function coreDur(intensity: City["intensity"]): number {
  if (intensity === "high") return 1.6;
  if (intensity === "med") return 2.4;
  return 3.2;
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
          {CITIES.map((c, i) => {
            const pDur = pulseDur(c.intensity);
            const cDur = coreDur(c.intensity);
            const haloR = c.intensity === "high" ? 3.2 : c.intensity === "med" ? 2.6 : 2.0;
            return (
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
                    to={c.intensity === "high" ? "5.5" : "4.2"}
                    dur={`${pDur}s`}
                    begin={`${i * 0.35}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values={
                      c.intensity === "high"
                        ? "0;0.8;0"
                        : c.intensity === "med"
                          ? "0;0.6;0"
                          : "0;0.4;0"
                    }
                    dur={`${pDur}s`}
                    begin={`${i * 0.35}s`}
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
                    to={c.intensity === "high" ? "7.5" : "5.5"}
                    dur={`${pDur}s`}
                    begin={`${i * 0.35 + pDur / 2}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values={
                      c.intensity === "high"
                        ? "0;0.55;0"
                        : c.intensity === "med"
                          ? "0;0.4;0"
                          : "0;0.25;0"
                    }
                    dur={`${pDur}s`}
                    begin={`${i * 0.35 + pDur / 2}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Soft halo */}
                <circle cx={c.x} cy={c.y} r={haloR} fill="url(#cityGlow)" />
                {/* Core dot */}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r={c.intensity === "high" ? 1.0 : c.intensity === "med" ? 0.85 : 0.7}
                  fill="var(--color-accent)"
                >
                  <animate
                    attributeName="opacity"
                    values="1;0.55;1"
                    dur={`${cDur}s`}
                    begin={`${i * 0.25}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Floating label */}
                <g transform={`translate(${c.x + 2.0}, ${c.y + 0.6})`}>
                  {/* Live indicator dot */}
                  <circle
                    cx="0"
                    cy="-0.7"
                    r="0.3"
                    fill="var(--color-accent)"
                  >
                    <animate
                      attributeName="opacity"
                      values="1;0.3;1"
                      dur={`${cDur * 0.8}s`}
                      begin={`${i * 0.2}s`}
                      repeatCount="indefinite"
                    />
                  </circle>
                  <text
                    x="0.7"
                    y="0"
                    fill="var(--color-fg-muted)"
                    fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                    fontSize="1.3"
                    letterSpacing="0.06"
                  >
                    {c.name} · {c.count}
                  </text>
                </g>
              </g>
            );
          })}

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
        <span className="text-[--color-fg] tabular-nums">10 nodes · global</span>
      </div>
    </div>
  );
}
