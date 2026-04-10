"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState, type ReactNode } from "react";

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

type EventTemplate = {
  num: string;
  actionTemplate: () => string;
};

// Helpers for randomization
function rInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function fmtMoney(n: number): string {
  return n.toLocaleString("en-US");
}
function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const EVENT_POOL: EventTemplate[] = [
  {
    num: "01",
    actionTemplate: () =>
      `Application ${pick(["received", "accepted", "logged", "queued"])} · ${pick([
        "/apply submission",
        "inbound form",
        "web intake",
        "new prospect",
      ])}`,
  },
  {
    num: "03",
    actionTemplate: () =>
      `Capital threshold ${pick(["validated", "verified", "confirmed", "cleared"])} · ${pick([
        "qualified",
        "approved",
        "passed screen",
      ])}`,
  },
  {
    num: "06",
    actionTemplate: () =>
      `Fit score ${pick(["computed", "returned", "updated", "finalized"])} · ${rInt(85, 98)}% match`,
  },
  {
    num: "09",
    actionTemplate: () =>
      `Discovery call ${pick(["scheduled", "booked", "confirmed"])} · ${pick([
        "Mon 9:00 AM PT",
        "Tue 11:30 AM PT",
        "Wed 1:00 PM PT",
        "Thu 2:00 PM PT",
        "Fri 10:00 AM PT",
      ])}`,
  },
  {
    num: "17",
    actionTemplate: () =>
      `Proposal ${pick(["composed", "drafted", "generated", "finalized"])} · ${pick([
        "sent to prospect",
        "delivered",
        "awaiting review",
      ])}`,
  },
  {
    num: "25",
    actionTemplate: () =>
      `Codebase ${pick(["initialized", "scaffolded", "bootstrapped"])} · ${pick([
        "new tenant repo",
        "fresh workspace",
        "baseline commit",
      ])}`,
  },
  {
    num: "26",
    actionTemplate: () =>
      `CRM schema ${pick(["generated", "synced", "migrated"])} · ${rInt(38, 68)} entities`,
  },
  {
    num: "28",
    actionTemplate: () =>
      `Agent scaffold ${pick(["generated", "provisioned", "instantiated"])} · ${rInt(8, 14)} agents`,
  },
  {
    num: "31",
    actionTemplate: () => {
      const count = rInt(1200, 1300).toLocaleString();
      if (Math.random() < 0.15) {
        return `Test suite ${pick(["ran", "completed", "executed"])} · ${count} tests · ${rInt(2, 7)} failed`;
      }
      return `Test suite ${pick(["passed", "completed", "green"])} · ${count} tests · ${pick(["green", "0 failed", "all clear"])}`;
    },
  },
  {
    num: "32",
    actionTemplate: () =>
      `Code review ${pick(["completed", "finalized", "closed"])} · ${rInt(1, 6)} issues ${pick(["flagged", "noted", "raised"])}`,
  },
  {
    num: "37",
    actionTemplate: () =>
      `ETL pipeline ${pick(["deployed", "promoted", "validated"])} · ${pick(["staging", "pre-prod", "canary"])}`,
  },
  {
    num: "44",
    actionTemplate: () =>
      `Sandbox ${pick(["provisioned", "allocated", "spun up"])} for tenant ${pick(["DCS", "ECG", "HVN", "LMR", "OPT"])}`,
  },
  {
    num: "47",
    actionTemplate: () =>
      `Production deployment · ${pick(["live", "healthy", "green", "stable"])}`,
  },
  {
    num: "49",
    actionTemplate: () =>
      `Accuracy monitor · ${(96.2 + Math.random() * 3.2).toFixed(1)}% ${pick(["sustained", "holding", "tracked"])}`,
  },
  {
    num: "51",
    actionTemplate: () =>
      `Checkpoint ${pick(["graduated", "promoted", "cleared"])} · Agent ${rInt(12, 79)} → ${pick(["autonomous", "self-directed", "unsupervised"])}`,
  },
  {
    num: "55",
    actionTemplate: () =>
      `Weekly ${pick(["status", "digest", "summary"])} composed for tenant ${pick(["ECG", "DCS", "HVN", "LMR"])}`,
  },
  {
    num: "59",
    actionTemplate: () =>
      `Question ${pick(["triaged", "routed", "classified"])} · ${pick(["routed to partner", "escalated", "assigned"])}`,
  },
  {
    num: "65",
    actionTemplate: () => {
      const v = rInt(45, 400) * 1000 + rInt(0, 999);
      return `Invoice ${pick(["generated", "issued", "sent"])} · $${fmtMoney(v)} · ${pick(["sent", "delivered", "pending"])}`;
    },
  },
  {
    num: "73",
    actionTemplate: () =>
      `Pattern library ${pick(["indexed", "updated", "synced"])} · ${rInt(1, 6)} new templates`,
  },
  {
    num: "79",
    actionTemplate: () =>
      `Quality score · ${(96 + Math.random() * 3).toFixed(1)}% ${pick(["across deployments", "sustained", "weekly avg"])}`,
  },
  {
    num: "81",
    actionTemplate: () => {
      const v = rInt(30, 500) * 1000 + rInt(0, 999);
      return `Payment ${pick(["received", "posted", "cleared"])} · $${fmtMoney(v)} · ${pick(["reconciled", "matched", "booked"])}`;
    },
  },
  // ─── Additional templates (8 new) spanning all 9 tiers ─────────────────
  {
    num: "02",
    actionTemplate: () =>
      `Intake form ${pick(["parsed", "normalized", "enriched"])} · ${rInt(12, 38)} fields captured`,
  },
  {
    num: "13",
    actionTemplate: () =>
      `Architecture draft ${pick(["sketched", "reviewed", "signed off"])} · ${rInt(3, 9)} service modules`,
  },
  {
    num: "29",
    actionTemplate: () =>
      `Migration script ${pick(["generated", "applied", "rolled forward"])} · ${rInt(4, 28)} tables`,
  },
  {
    num: "38",
    actionTemplate: () =>
      `Data ingress ${pick(["validated", "normalized", "reconciled"])} · ${rInt(18, 94)}K rows`,
  },
  {
    num: "46",
    actionTemplate: () =>
      `Canary ${pick(["promoted", "stabilized", "verified"])} · ${rInt(96, 99)}.${rInt(1, 9)}% healthy`,
  },
  {
    num: "62",
    actionTemplate: () =>
      `Client success ping · ${pick(["NPS", "CSAT", "health"])} ${rInt(87, 99)} · tenant ${pick(["DCS", "ECG", "HVN", "LMR"])}`,
  },
  {
    num: "68",
    actionTemplate: () => {
      const v = rInt(8, 120) * 1000 + rInt(0, 999);
      return `Expense ${pick(["categorized", "reconciled", "booked"])} · $${fmtMoney(v)} · ${pick(["ops", "infra", "payroll"])}`;
    },
  },
  {
    num: "76",
    actionTemplate: () =>
      `Anomaly ${pick(["detected", "flagged", "investigated"])} · ${pick(["latency", "error rate", "throughput"])} · ${pick(["auto-resolved", "routing to ops", "within tolerance"])}`,
  },
];

function renderEvent(template: EventTemplate): { num: string; action: string } {
  return { num: template.num, action: template.actionTemplate() };
}

// Section → agent number mapping for real telemetry section events.
const SECTION_AGENT_NUM: Record<string, string> = {
  top: "01",
  method: "73",
  capabilities: "14",
  continuity: "16",
  process: "75",
  console: "79",
  proof: "38",
  apply: "01",
};

type TelemetryLive = {
  activeSessions?: number;
  sectionDwell?: Record<string, number>;
  currentSections?: Record<string, number>;
  recentEvents?: Array<{
    type?: string;
    section?: string;
    ts?: number;
    sessionId?: string;
  }>;
  engagementScore?: number;
};

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

// ─────────────────────────────────────────────────────────────────────────────
// Bilingual copy — UI strings only. Data arrays above (events, cities) stay
// in English on purpose (they're log-entry / proper-noun content).
// ─────────────────────────────────────────────────────────────────────────────
type Lang = "en" | "es";

const COPY = {
  en: {
    sectionLabel: "05 — System Console",
    headlineLine1: "Watch a company",
    headlineLine2: "operate itself.",
    intro:
      "This is an illustrative reconstruction of the dashboard we use to run iKingdom itself. Application intake, discovery, build, deployment, supervision, finance — all handled by the same architecture we install for our clients. Real visitor events from this page are mixed into the stream when they occur; everything else is simulated for demonstration.",
    topBar: "iKingdom · Internal Operations · Demo",
    liveBadge: "Demo",
    panels: {
      eventStream: { title: "Event Stream", subtitle: "Simulated · real events when present" },
      telemetry: { title: "Today's Telemetry", subtitle: "Illustrative" },
      tierActivity: { title: "Tier Activity", subtitle: "Simulated utilization" },
      deployments: { title: "Deployments", subtitle: "All inbound → primary" },
    },
    kpis: {
      liveDeployments: "Live deployments",
      inActiveBuild: "In active build",
      agentsPerSystem: "Agents per system",
      functionalTiers: "Functional tiers",
      inboundToday: "Inbound today",
      graduationThreshold: "Graduation threshold",
    },
    tiers: {
      "01": "Application Intake",
      "02": "Discovery & Arch.",
      "03": "Engagement",
      "04": "Build & Code",
      "05": "Integration & Data",
      "06": "Deployment",
      "07": "Client Success",
      "08": "Finance & Ops",
      "09": "Intelligence",
    } as Record<string, string>,
    networkStatus: "Network status",
    networkCount: "10 nodes · 1 core",
    disclaimer:
      "Illustrative reconstruction of iKingdom's internal console. Real visitor events from this page are mixed into the stream when they occur; everything else is simulated for demonstration. The architecture is identical to what we install for clients.",
  },
  es: {
    sectionLabel: "05 — Consola del Sistema",
    headlineLine1: "Mira una compañía",
    headlineLine2: "operarse sola.",
    intro:
      "Esta es una reconstrucción ilustrativa del panel que usamos para operar iKingdom. Recepción de solicitudes, descubrimiento, construcción, despliegue, supervisión, finanzas — todo manejado por la misma arquitectura que instalamos para nuestros clientes. Los eventos reales de visitantes de esta página se mezclan cuando ocurren; el resto es simulado para demostración.",
    topBar: "iKingdom · Operaciones Internas · Demo",
    liveBadge: "Demo",
    panels: {
      eventStream: { title: "Flujo de Eventos", subtitle: "Simulado · eventos reales al llegar" },
      telemetry: { title: "Telemetría de Hoy", subtitle: "Ilustrativo" },
      tierActivity: { title: "Actividad por Nivel", subtitle: "Utilización simulada" },
      deployments: { title: "Despliegues", subtitle: "Todo entrante → principal" },
    },
    kpis: {
      liveDeployments: "Despliegues en vivo",
      inActiveBuild: "En construcción activa",
      agentsPerSystem: "Agentes por sistema",
      functionalTiers: "Niveles funcionales",
      inboundToday: "Entradas hoy",
      graduationThreshold: "Umbral de graduación",
    },
    tiers: {
      "01": "Recepción de Solicitudes",
      "02": "Descubrimiento y Arq.",
      "03": "Compromiso",
      "04": "Construcción y Código",
      "05": "Integración y Datos",
      "06": "Despliegue",
      "07": "Éxito del Cliente",
      "08": "Finanzas y Ops",
      "09": "Inteligencia",
    } as Record<string, string>,
    networkStatus: "Estado de la red",
    networkCount: "10 nodos · 1 núcleo",
    disclaimer:
      "Reconstrucción ilustrativa del panel interno de iKingdom. Los eventos reales de visitantes de esta página se mezclan en el flujo cuando ocurren; el resto es simulado para demostración. La arquitectura es idéntica a la que instalamos para nuestros clientes.",
  },
} as const;

export default function OperationsConsole({ lang = "en" }: { lang?: Lang } = {}) {
  const t = COPY[lang];
  return (
    <section
      id="console"
      className="relative py-32 md:py-48 border-t border-[--color-line] overflow-hidden"
    >
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
            {t.sectionLabel}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease }}
          className="font-display text-balance text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] max-w-5xl"
        >
          {t.headlineLine1}
          <br />
          <span className="italic text-[--color-fg-muted]">
            {t.headlineLine2}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease, delay: 0.2 }}
          className="mt-10 max-w-2xl text-base md:text-lg text-[--color-fg-muted] leading-relaxed"
        >
          {t.intro}
        </motion.p>

        {/* The console */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease, delay: 0.3 }}
          className="mt-20 md:mt-24 bg-white border border-[--color-line-strong] rounded-md overflow-hidden shadow-xl shadow-black/5"
        >
          {/* Top bar */}
          <div className="border-b border-[--color-line] px-5 md:px-7 py-4 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-[--color-fg-dim]/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-[--color-fg-dim]/60" />
                <span className="w-2.5 h-2.5 rounded-full bg-[--color-fg-dim]/60" />
              </div>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-fg-muted] ml-3">
                {t.topBar}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full rounded-full bg-[--color-accent] opacity-70 animate-ping" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[--color-accent]" />
              </span>
              <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-accent]">
                {t.liveBadge}
              </span>
            </div>
          </div>

          {/* Body grid */}
          <div className="grid lg:grid-cols-12 gap-px bg-[--color-line]">
            {/* Event Stream */}
            <div className="lg:col-span-5 bg-white p-6 md:p-8">
              <EventStreamPanel lang={lang} />
            </div>

            {/* KPI Counters */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8">
              <PanelHeader title={t.panels.telemetry.title} subtitle={t.panels.telemetry.subtitle} />
              <KpiGrid lang={lang} />
            </div>

            {/* Tier Activity */}
            <div className="lg:col-span-7 bg-white p-6 md:p-8">
              <PanelHeader
                title={t.panels.tierActivity.title}
                subtitle={t.panels.tierActivity.subtitle}
              />
              <TierBars lang={lang} />
            </div>

            {/* Deployment map */}
            <div className="lg:col-span-5 bg-white p-6 md:p-8">
              <PanelHeader title={t.panels.deployments.title} subtitle={t.panels.deployments.subtitle} />
              <DeploymentMap lang={lang} />
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
          {t.disclaimer}
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
  badge,
}: {
  title: string;
  subtitle: string;
  badge?: ReactNode;
}) {
  return (
    <div className="flex items-baseline justify-between mb-5 pb-3 border-b border-[--color-line]">
      <span className="flex items-baseline gap-2 font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-fg]">
        {title}
        {badge}
      </span>
      <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[--color-fg-dim]">
        {subtitle}
      </span>
    </div>
  );
}

function formatNowTime(): string {
  const now = new Date();
  return `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}:${String(now.getSeconds()).padStart(2, "0")}`;
}

function EventStreamPanel({ lang = "en" }: { lang?: Lang }) {
  const t = COPY[lang];
  const [events, setEvents] = useState<ConsoleEvent[]>(INITIAL_EVENTS);
  const counterRef = useRef(INITIAL_EVENTS.length);
  // Track which real event IDs (by ts+sessionId) we've already ingested
  // so we don't duplicate them across polls.
  const seenRealRef = useRef<Set<string>>(new Set());
  const [lastRealAt, setLastRealAt] = useState<number>(0);
  // Re-render every 5s so the LIVE badge can drop off after 60s of silence.
  const [nowTick, setNowTick] = useState<number>(() => Date.now());

  // On mount, immediately replace the deterministic SSR initial list with
  // a freshly randomized batch so the event stream content differs visibly
  // across page visits. This runs client-side only — SSR still sees
  // INITIAL_EVENTS, avoiding hydration mismatches.
  useEffect(() => {
    // Pick 6 distinct templates (or fewer if pool is smaller)
    const pool = [...EVENT_POOL];
    const picks: EventTemplate[] = [];
    const sampleSize = Math.min(6, pool.length);
    for (let i = 0; i < sampleSize; i++) {
      const idx = Math.floor(Math.random() * pool.length);
      picks.push(pool.splice(idx, 1)[0]);
    }
    const now = Date.now();
    const fresh: ConsoleEvent[] = picks.map((tpl, i) => {
      const rendered = renderEvent(tpl);
      // Back-date each event by a few seconds so the stream looks like
      // recent history rather than a burst.
      const stamp = new Date(now - (sampleSize - i) * (1500 + Math.floor(Math.random() * 2500)));
      const time = `${String(stamp.getHours()).padStart(2, "0")}:${String(stamp.getMinutes()).padStart(2, "0")}:${String(stamp.getSeconds()).padStart(2, "0")}`;
      return {
        id: counterRef.current++,
        time,
        num: rendered.num,
        action: rendered.action,
      };
    });
    setEvents(fresh);
  }, []);

  // Template event scheduler — same cadence & behavior as before, but
  // ~50/50 chance per tick of instead pulling from the real-event buffer
  // (populated by the /api/telemetry/live poll). Real events are still
  // injected immediately on fetch; this just biases the rhythm down a bit
  // when real traffic is present so we don't drown it out.
  useEffect(() => {
    let timeoutId: ReturnType<typeof setTimeout>;

    const schedule = () => {
      const delay = 4000 + Math.random() * 3000;
      timeoutId = setTimeout(() => {
        // Template tick — always emit a template event to keep the stream full.
        const template =
          EVENT_POOL[Math.floor(Math.random() * EVENT_POOL.length)];
        const rendered = renderEvent(template);
        const newEvent: ConsoleEvent = {
          ...rendered,
          id: counterRef.current++,
          time: formatNowTime(),
        };
        setEvents((prev) => [newEvent, ...prev].slice(0, 8));
        schedule();
      }, delay);
    };

    schedule();
    return () => clearTimeout(timeoutId);
  }, []);

  // Poll real telemetry every 4s. Silent fallback on any error or 404.
  useEffect(() => {
    let cancelled = false;

    const fetchLive = async () => {
      try {
        const res = await fetch("/api/telemetry/live", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as TelemetryLive;
        if (cancelled || !data || !Array.isArray(data.recentEvents)) return;

        const fresh: ConsoleEvent[] = [];
        for (const ev of data.recentEvents) {
          if (!ev) continue;
          const key = `${ev.ts ?? ""}-${ev.sessionId ?? ""}-${ev.type ?? ""}-${ev.section ?? ""}`;
          if (seenRealRef.current.has(key)) continue;
          seenRealRef.current.add(key);

          if (ev.type === "section" && ev.section) {
            const num = SECTION_AGENT_NUM[ev.section] ?? "01";
            const shortSession = (ev.sessionId ?? "????").slice(0, 4);
            const time =
              typeof ev.ts === "number"
                ? new Date(ev.ts).toLocaleTimeString("en-US", { hour12: false })
                : formatNowTime();
            fresh.push({
              id: counterRef.current++,
              time,
              num,
              action: `Section view · ${ev.section} · session ${shortSession}`,
            });
          }
        }

        // Prevent the dedupe set from growing without bound.
        if (seenRealRef.current.size > 500) {
          seenRealRef.current = new Set();
        }

        if (fresh.length > 0) {
          // 50/50 mix: only inject half (at minimum one) so template
          // events still share the stream with real ones.
          const takeCount = Math.max(1, Math.ceil(fresh.length / 2));
          const take = fresh.slice(-takeCount);
          setEvents((prev) => [...take.reverse(), ...prev].slice(0, 8));
          setLastRealAt(Date.now());
        }
      } catch {
        // silent
      }
    };

    fetchLive();
    const id = setInterval(fetchLive, 4000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  // Tick clock for 60s badge window
  useEffect(() => {
    const id = setInterval(() => setNowTick(Date.now()), 5000);
    return () => clearInterval(id);
  }, []);

  const isRealLive = lastRealAt > 0 && nowTick - lastRealAt < 60_000;

  return (
    <>
      <PanelHeader
        title={t.panels.eventStream.title}
        subtitle={t.panels.eventStream.subtitle}
        badge={
          isRealLive ? (
            <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-sm bg-[--color-accent]/10 text-[--color-accent] text-[9px] tracking-[0.16em] font-medium">
              <span className="w-1 h-1 rounded-full bg-[--color-accent] animate-pulse" />
              REAL · LIVE
            </span>
          ) : null
        }
      />
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
    </>
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

function KpiGrid({ lang = "en" }: { lang?: Lang }) {
  const t = COPY[lang];
  // Randomize the initial "Inbound today" target per-visit (10-16 range).
  // Runs only client-side via useState initializer — SSR gets the
  // deterministic default (12) first, then the client picks a fresh value
  // on mount, so hydration stays clean.
  const [inboundInitial, setInboundInitial] = useState(12);
  useEffect(() => {
    setInboundInitial(10 + Math.floor(Math.random() * 7)); // 10..16
  }, []);

  const kpis: KpiSpec[] = [
    { label: t.kpis.liveDeployments, target: 6, suffix: "" },
    { label: t.kpis.inActiveBuild, target: 3, suffix: "" },
    { label: t.kpis.agentsPerSystem, target: 80, suffix: "" },
    { label: t.kpis.functionalTiers, target: 9, suffix: "" },
    {
      label: t.kpis.inboundToday,
      target: inboundInitial,
      suffix: "",
      drift: { min: 8, max: 22 },
    },
    { label: t.kpis.graduationThreshold, target: 98, suffix: "%" },
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
    <div className="bg-white p-5">
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

function TierBars({ lang = "en" }: { lang?: Lang }) {
  const t = COPY[lang];
  const [state, setState] = useState<Record<string, TierState>>(() => {
    const init: Record<string, TierState> = {};
    TIER_BARS.forEach((t) => {
      init[t.n] = { value: t.base, spike: 0, spikeRemaining: 0 };
    });
    return init;
  });
  // Per-visit randomized baseline for each tier. SSR uses the deterministic
  // TIER_BARS.base values; the client swaps in a perturbed copy in the first
  // useEffect tick so every visit starts from a slightly different place.
  const basesRef = useRef<Record<string, number>>(
    Object.fromEntries(TIER_BARS.map((t) => [t.n, t.base])),
  );

  useEffect(() => {
    // Initialize with slightly randomized base values per visit (±5%).
    const init: Record<string, number> = {};
    TIER_BARS.forEach((t) => {
      init[t.n] = Math.max(
        0.15,
        Math.min(1, t.base + (Math.random() - 0.5) * 0.1),
      );
    });
    basesRef.current = init;
    setState((prev) => {
      const next: Record<string, TierState> = { ...prev };
      TIER_BARS.forEach((t) => {
        next[t.n] = {
          value: init[t.n],
          spike: 0,
          spikeRemaining: 0,
        };
      });
      return next;
    });

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
          const base = basesRef.current[t.n] ?? t.base;
          const value = Math.max(
            0.15,
            Math.min(1, base + gentle + spike),
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
              {t.tiers[tier.n] ?? tier.name}
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
  /** Which row the city label anchors to. */
  row: "top" | "bottom";
};

// 10 cities placed on a strict 2×5 geometric grid (viewBox 100x60).
// Perfect 18-unit horizontal spacing, two perfectly parallel rows.
// Top row y=14, bottom row y=46, hub centered at (50, 30).
const CITIES: City[] = [
  // Top row — y=14
  { id: "sf",  name: "SAN FRANCISCO", count:  71, x: 10, y: 14, row: "top" },
  { id: "la",  name: "LOS ANGELES",   count:  94, x: 28, y: 14, row: "top" },
  { id: "sd",  name: "SAN DIEGO",     count: 178, x: 46, y: 14, row: "top" },
  { id: "dal", name: "DALLAS",        count:  48, x: 64, y: 14, row: "top" },
  { id: "aus", name: "AUSTIN",        count:  33, x: 82, y: 14, row: "top" },
  // Bottom row — y=46
  { id: "chi", name: "CHICAGO",       count:  56, x: 10, y: 46, row: "bottom" },
  { id: "nyc", name: "NEW YORK",      count:  87, x: 28, y: 46, row: "bottom" },
  { id: "mia", name: "MIAMI",         count:  22, x: 46, y: 46, row: "bottom" },
  { id: "lon", name: "LONDON",        count:  41, x: 64, y: 46, row: "bottom" },
  { id: "sgp", name: "SINGAPORE",     count:   9, x: 82, y: 46, row: "bottom" },
];

// Central primary hub — iKingdom Core. All cities feed into this single node.
const HUB = { x: 50, y: 30 };

// Straight spoke from a city to the central hub — perfectly lineal.
function spokePath(c: City): string {
  return `M ${c.x} ${c.y} L ${HUB.x} ${HUB.y}`;
}

// Uniform pulse timing across all cities — calm and consistent.
const CITY_PULSE_DUR = 6.0;
const CITY_CORE_DUR = 4.4;

function DeploymentMap({ lang = "en" }: { lang?: Lang }) {
  const t = COPY[lang];
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
      <div className="relative flex-1 rounded-md border border-[--color-line] bg-[--color-bg-elevated] overflow-hidden">
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
            <radialGradient id="hubGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="var(--color-accent)" stopOpacity="1" />
              <stop offset="40%" stopColor="var(--color-accent)" stopOpacity="0.45" />
              <stop offset="100%" stopColor="var(--color-accent)" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Dot grid landmasses */}
          <g fill="var(--color-accent)" opacity="0.18">
            {gridDots.map((d, i) => (
              <circle key={i} cx={d.cx} cy={d.cy} r="0.35" />
            ))}
          </g>

          {/* Inbound spokes: straight lines, uniform stroke, flowing toward the central hub */}
          <g fill="none" strokeLinecap="round">
            {CITIES.map((c, i) => {
              const path = spokePath(c);
              // Gentle stagger so flow dashes don't all fire in sync,
              // but every spoke shares identical visual weight.
              const delay = i * 0.6;
              return (
                <g key={`spoke-${c.id}`}>
                  {/* Static faint base line */}
                  <path
                    d={path}
                    stroke="var(--color-accent)"
                    strokeOpacity="0.35"
                    strokeWidth="0.25"
                  />
                  {/* Dashed flow toward hub (negative offset = flow along direction city→hub) */}
                  <path
                    d={path}
                    stroke="var(--color-accent)"
                    strokeOpacity="0.35"
                    strokeWidth="0.35"
                    strokeDasharray="2 40"
                  >
                    <animate
                      attributeName="stroke-dashoffset"
                      from="0"
                      to="-42"
                      dur="10s"
                      begin={`${delay}s`}
                      repeatCount="indefinite"
                    />
                  </path>
                </g>
              );
            })}
          </g>

          {/* Central primary hub — iKingdom Core */}
          <g>
            {/* Radial halo */}
            <circle cx={HUB.x} cy={HUB.y} r="7" fill="url(#hubGlow)" />
            {/* Outer pulsing ring */}
            <circle
              cx={HUB.x}
              cy={HUB.y}
              r="3"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="0.25"
              opacity="0"
            >
              <animate
                attributeName="r"
                from="3"
                to="9"
                dur="5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.7;0"
                dur="5s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Secondary pulsing ring (offset phase) */}
            <circle
              cx={HUB.x}
              cy={HUB.y}
              r="3"
              fill="none"
              stroke="var(--color-accent)"
              strokeWidth="0.2"
              opacity="0"
            >
              <animate
                attributeName="r"
                from="3"
                to="11"
                dur="5s"
                begin="2.5s"
                repeatCount="indefinite"
              />
              <animate
                attributeName="opacity"
                values="0;0.45;0"
                dur="5s"
                begin="2.5s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Steady outer ring */}
            <circle
              cx={HUB.x}
              cy={HUB.y}
              r="3.0"
              fill="none"
              stroke="var(--color-accent)"
              strokeOpacity="0.55"
              strokeWidth="0.2"
            />
            {/* Core filled dot */}
            <circle cx={HUB.x} cy={HUB.y} r="2.6" fill="var(--color-accent)">
              <animate
                attributeName="opacity"
                values="1;0.75;1"
                dur="4s"
                repeatCount="indefinite"
              />
            </circle>
            {/* Hub label — centered below the hub */}
            <text
              x={HUB.x}
              y={36}
              textAnchor="middle"
              fill="var(--color-accent)"
              fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
              fontSize="2.4"
              letterSpacing="0.22"
            >
              iKINGDOM CORE
            </text>
          </g>

          {/* City nodes — uniform size, grid-aligned labels */}
          {CITIES.map((c, i) => {
            const pDur = CITY_PULSE_DUR;
            const cDur = CITY_CORE_DUR;
            // Label y positions: top row dots at y=14 → labels at y=20/y=22
            //                   bottom row dots at y=46 → labels at y=52/y=54
            const labelY = c.row === "top" ? 20 : 52;
            const countY = c.row === "top" ? 22 : 54;
            return (
              <g key={c.id}>
                {/* Outer pulsing rings — uniform across all cities */}
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
                    to="4.5"
                    dur={`${pDur}s`}
                    begin={`${i * 0.4}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;0.55;0"
                    dur={`${pDur}s`}
                    begin={`${i * 0.4}s`}
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
                    to="6"
                    dur={`${pDur}s`}
                    begin={`${i * 0.4 + pDur / 2}s`}
                    repeatCount="indefinite"
                  />
                  <animate
                    attributeName="opacity"
                    values="0;0.35;0"
                    dur={`${pDur}s`}
                    begin={`${i * 0.4 + pDur / 2}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Soft halo — uniform */}
                <circle cx={c.x} cy={c.y} r="2.6" fill="url(#cityGlow)" />
                {/* Core dot — uniform radius */}
                <circle
                  cx={c.x}
                  cy={c.y}
                  r="0.9"
                  fill="var(--color-accent)"
                >
                  <animate
                    attributeName="opacity"
                    values="1;0.6;1"
                    dur={`${cDur}s`}
                    begin={`${i * 0.25}s`}
                    repeatCount="indefinite"
                  />
                </circle>

                {/* Grid-aligned label — centered below the dot */}
                <text
                  x={c.x}
                  y={labelY}
                  textAnchor="middle"
                  fill="var(--color-fg-muted)"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fontSize="1.7"
                  letterSpacing="0.12"
                    >
                  {c.name}
                </text>
                <text
                  x={c.x}
                  y={countY}
                  textAnchor="middle"
                  fill="var(--color-fg-dim)"
                  fontFamily="ui-monospace, SFMono-Regular, Menlo, monospace"
                  fontSize="1.5"
                  letterSpacing="0.1"
                >
                  · {c.count} ·
                </text>
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
        <span className="text-[--color-fg-dim]">{t.networkStatus}</span>
        <span className="text-[--color-fg] tabular-nums">{t.networkCount}</span>
      </div>
    </div>
  );
}
