"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type TickerEvent = {
  num: string;
  action: string;
};

// ---- Randomization primitives --------------------------------------------------
// All of these are only invoked inside useEffect → safe for SSR hydration.

function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randFloat(min: number, max: number, decimals = 1): number {
  const v = Math.random() * (max - min) + min;
  const p = Math.pow(10, decimals);
  return Math.round(v * p) / p;
}

function pick<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function formatDollars(n: number): string {
  // Round to nearest $500 so the number reads like a real billing line.
  const rounded = Math.round(n / 500) * 500;
  return "$" + rounded.toLocaleString("en-US");
}

function formatInt(n: number): string {
  return n.toLocaleString("en-US");
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri"] as const;
const TIMES = [
  "9:00 AM",
  "9:30 AM",
  "10:00 AM",
  "10:30 AM",
  "11:00 AM",
  "1:00 PM",
  "1:30 PM",
  "2:00 PM",
  "2:30 PM",
  "3:00 PM",
  "3:30 PM",
  "4:00 PM",
] as const;
const TZS = ["PT", "MT", "CT", "ET"] as const;

function randomDayTime(): string {
  return `${pick(DAYS)} ${pick(TIMES)} ${pick(TZS)}`;
}

// ---- Template layer ------------------------------------------------------------
// Each template is a function returning the rendered `action` string.
// A few of them deliberately show "imperfect → perfected" variance
// (e.g. occasional test failures, flagged issues, small incidents).

type TemplateEvent = {
  num: string;
  render: () => string;
};

const TEMPLATES: TemplateEvent[] = [
  // Tier 01 — Application Intake & Qualification
  { num: "01", render: () => "Application received · /apply submission" },
  {
    num: "02",
    render: () => "Identity verified · public records cross-referenced",
  },
  {
    num: "03",
    render: () =>
      `Capital threshold validated · ${
        Math.random() < 0.92 ? "qualifying" : "flagged for review"
      }`,
  },
  {
    num: "04",
    render: () =>
      `Industry classified · ${pick([
        "construction",
        "logistics",
        "healthcare",
        "fintech",
        "manufacturing",
        "legal",
        "real estate",
      ])} · tier match`,
  },
  {
    num: "05",
    render: () => `Scope sized · ${randInt(60, 92)}-agent engagement projected`,
  },
  {
    num: "06",
    render: () => `Fit score computed · ${randInt(88, 97)}% match`,
  },
  {
    num: "07",
    render: () =>
      `Attribution recorded · ${pick([
        "referral",
        "direct",
        "partner",
        "inbound",
      ])} · partner network`,
  },
  {
    num: "08",
    render: () => "Routed to senior partner intake queue",
  },

  // Tier 02 — Discovery & Architecture
  {
    num: "09",
    render: () => `Discovery call scheduled · ${randomDayTime()}`,
  },
  {
    num: "10",
    render: () => `Pre-call brief composed · ${randInt(3, 6)} pages · sent`,
  },
  {
    num: "11",
    render: () =>
      `Discovery call transcribed · ${randInt(38, 62)} min · indexed`,
  },
  {
    num: "12",
    render: () =>
      `${randInt(8, 16)} pain points extracted · prioritized by impact`,
  },
  {
    num: "13",
    render: () => `Workflows mapped · ${randInt(18, 32)} internal processes`,
  },
  {
    num: "14",
    render: () => `Tiers allocated · ${randInt(7, 9)} active for engagement`,
  },
  {
    num: "15",
    render: () =>
      `Agent topology designed · ${randInt(72, 88)} agents specified`,
  },
  {
    num: "16",
    render: () => "Engagement plan drafted · sent to client",
  },

  // Tier 03 — Engagement & Contracting
  {
    num: "17",
    render: () => `Proposal composed · ${randInt(18, 28)} pages · delivered`,
  },
  {
    num: "18",
    render: () =>
      `Pricing tier finalized · ${formatDollars(
        randInt(325000, 485000),
      )} base`,
  },
  {
    num: "19",
    render: () => "Contract generated · awaiting signature",
  },
  {
    num: "20",
    render: () => {
      const issues = Math.random() < 0.75 ? 0 : randInt(1, 3);
      return `Legal review pass · ${issues} issues flagged${
        issues > 0 ? " · resolved" : ""
      }`;
    },
  },
  {
    num: "21",
    render: () => "Signature received · executed · countersigned",
  },
  {
    num: "22",
    render: () => "Onboarding kicked off · welcome packet sent",
  },
  {
    num: "23",
    render: () => "Kickoff anchored · all stakeholders confirmed",
  },
  {
    num: "24",
    render: () => `Stakeholder map built · ${randInt(5, 11)} contacts indexed`,
  },

  // Tier 04 — Build & Code Generation
  {
    num: "25",
    render: () => "Codebase initialized · new tenant repo · live",
  },
  {
    num: "26",
    render: () =>
      `CRM schema generated · ${randInt(38, 58)} entities · ${randInt(
        210,
        280,
      )} fields`,
  },
  {
    num: "27",
    render: () => `Workflows composed · ${randInt(14, 24)} flows scaffolded`,
  },
  {
    num: "28",
    render: () =>
      `Agent scaffold generated · Tier 04 · ${randInt(8, 12)} agents`,
  },
  {
    num: "29",
    render: () =>
      `UI components built · ${randInt(18, 32)} screens · ${randInt(
        72,
        104,
      )} components`,
  },
  {
    num: "30",
    render: () => `API composer · ${randInt(32, 48)} endpoints exposed`,
  },
  {
    num: "31",
    render: () => {
      // ~12% of runs show a small failure count — self-heals next pass
      const total = randInt(1200, 1300);
      if (Math.random() < 0.12) {
        const failing = randInt(1, 4);
        return `Test suite · ${formatInt(
          total,
        )} tests · ${failing} failing · retrying`;
      }
      return `Test suite passed · ${formatInt(total)} tests · green`;
    },
  },
  {
    num: "32",
    render: () => {
      const issues = randInt(0, 5);
      return `Code review · ${issues} issues flagged${
        issues > 0 ? " · resolved" : " · clean"
      }`;
    },
  },
  {
    num: "33",
    render: () =>
      `Documentation generated · ${randInt(120, 170)} pages · published`,
  },
  {
    num: "34",
    render: () => `Build pipeline · ${randInt(10, 18)} jobs queued · running`,
  },

  // Tier 05 — Integration & Data
  {
    num: "35",
    render: () => `Data sources cataloged · ${randInt(35, 60)} connectors found`,
  },
  {
    num: "36",
    render: () =>
      `Migration plan drafted · ${randFloat(2.4, 4.8, 1)}M records · ${randInt(
        5,
        10,
      )} days`,
  },
  {
    num: "37",
    render: () => "ETL pipeline deployed · staging · running",
  },
  {
    num: "38",
    render: () => "CRM sync established · bidirectional · live",
  },
  {
    num: "39",
    render: () => "Calendar integration · Google + Outlook · live",
  },
  {
    num: "40",
    render: () => "Email + SMS channels wired · live",
  },
  {
    num: "41",
    render: () =>
      `Voice channel wired · ${randInt(2, 8)} numbers provisioned`,
  },
  {
    num: "42",
    render: () => "Payments integration · live · processing",
  },
  {
    num: "43",
    render: () => "SSO configured · OAuth + SAML · live",
  },
  {
    num: "44",
    render: () =>
      `Sandbox provisioned for tenant ${pick([
        "DCS",
        "ECG",
        "NRT",
        "VLT",
        "ACQ",
        "HRZ",
      ])}`,
  },

  // Tier 06 — Deployment & Supervision
  {
    num: "45",
    render: () => `Staging deployment · ${randInt(8, 16)} services · live`,
  },
  {
    num: "46",
    render: () => {
      const total = randInt(40, 56);
      const failed = Math.random() < 0.15 ? randInt(1, 2) : 0;
      if (failed > 0) {
        return `Smoke tests · ${total} checks · ${failed} failed · retrying`;
      }
      return `Smoke tests · ${total} checks · all passed`;
    },
  },
  {
    num: "47",
    render: () => "Production deployment · live · zero downtime",
  },
  {
    num: "48",
    render: () => "Checkpoint initialized · agent under review",
  },
  {
    num: "49",
    render: () =>
      `Accuracy monitor · ${randFloat(96.2, 99.4, 1)}% sustained · 30 day`,
  },
  {
    num: "50",
    render: () => `Human review queue · ${randInt(2, 9)} pending · routed`,
  },
  {
    num: "51",
    render: () =>
      `Checkpoint graduated · Agent ${String(randInt(1, 80)).padStart(
        2,
        "0",
      )} → autonomous`,
  },
  {
    num: "52",
    render: () =>
      `Rollback ready · checkpoint v${randInt(2, 5)}.${randInt(
        0,
        9,
      )} cached`,
  },
  {
    num: "53",
    render: () =>
      `Incident · auto-resolved · 0 downtime · ${randInt(12, 94)}s`,
  },
  {
    num: "54",
    render: () => {
      const total = randInt(10, 14);
      const nominal =
        Math.random() < 0.85 ? total : total - randInt(1, 2);
      const color = nominal === total ? "green" : "amber";
      return `Tenant health · ${nominal} of ${total} nominal · ${color}`;
    },
  },

  // Tier 07 — Client Success & Communication
  {
    num: "55",
    render: () =>
      `Weekly status composed · tenant ${pick([
        "ECG",
        "DCS",
        "NRT",
        "VLT",
        "HRZ",
      ])} · sent`,
  },
  {
    num: "56",
    render: () => `Stakeholder update sent · ${randInt(7, 16)} recipients`,
  },
  {
    num: "57",
    render: () => `Training material · ${randInt(20, 36)} modules generated`,
  },
  {
    num: "58",
    render: () =>
      `Office hours · ${pick(DAYS)} ${pick([
        "9am",
        "10am",
        "11am",
        "2pm",
        "3pm",
      ])} · ${randInt(2, 9)} attendees`,
  },
  {
    num: "59",
    render: () => "Question triaged · routed to senior partner",
  },
  {
    num: "60",
    render: () => `Knowledge base · ${randInt(220, 290)} articles indexed`,
  },
  {
    num: "61",
    render: () => "Change request captured · scoped · approved",
  },
  {
    num: "62",
    render: () =>
      `Satisfaction survey · ${randFloat(
        8.8,
        9.8,
        1,
      )} / 10 · sent to lead`,
  },
  {
    num: "63",
    render: () =>
      `Retention forecast · ${randInt(92, 98)}% renewal probability`,
  },
  {
    num: "64",
    render: () => "Renewal initiated · year 2 contract drafted",
  },

  // Tier 08 — Finance & Operations
  {
    num: "65",
    render: () =>
      `Invoice generated · ${formatDollars(randInt(45000, 400000))} · sent`,
  },
  {
    num: "66",
    render: () =>
      `Payment received · ${formatDollars(
        randInt(30000, 500000),
      )} · reconciled`,
  },
  {
    num: "67",
    render: () =>
      `Subscription renewed · tier ${randInt(1, 4)} · ${pick([
        "annual",
        "multi-year",
      ])}`,
  },
  {
    num: "68",
    render: () => "Vendor costs tracked · monthly · indexed",
  },
  {
    num: "69",
    render: () => `Engagement P&L updated · margin ${randInt(68, 82)}%`,
  },
  {
    num: "70",
    render: () =>
      `Tax compliance · Q${randInt(1, 4)} filing · filed`,
  },
  {
    num: "71",
    render: () =>
      `Contract lifecycle · ${randInt(2, 6)} active · ${randInt(
        0,
        2,
      )} expiring`,
  },
  {
    num: "72",
    render: () =>
      `Capacity planner · ${randInt(3, 6)} of 6 slots filled · Q${randInt(
        1,
        4,
      )}`,
  },

  // Tier 09 — Intelligence & Learning
  {
    num: "73",
    render: () => `Pattern library · ${randInt(2, 6)} new templates indexed`,
  },
  {
    num: "74",
    render: () =>
      `Cross-tenant insight · ${randInt(1, 5)} patterns matched`,
  },
  {
    num: "75",
    render: () => `Deployment velocity · +${randInt(7, 18)}% MoM`,
  },
  {
    num: "76",
    render: () =>
      `Win/loss analyzed · ${randInt(78, 92)}% close rate · Q${randInt(
        1,
        4,
      )}`,
  },
  {
    num: "77",
    render: () =>
      `Pricing optimized · ${pick([
        "base",
        "mid",
        "premium",
      ])} tier · validated`,
  },
  {
    num: "78",
    render: () =>
      `System telemetry · all green · ${randInt(10, 14)} tenants`,
  },
  {
    num: "79",
    render: () =>
      `Quality score · ${randFloat(96, 99.5, 1)}% across deployments`,
  },
  {
    num: "80",
    render: () =>
      `Checkpoint graduation · Agent ${String(randInt(1, 80)).padStart(
        2,
        "0",
      )} promoted`,
  },
];

// Pure function: given the templates, produce a fully rendered array.
// Only called inside useEffect → no SSR hydration risk.
function renderEvents(templates: TemplateEvent[]): TickerEvent[] {
  return templates.map((t) => ({ num: t.num, action: t.render() }));
}

// Deterministic initial pass — used for SSR and the first paint.
// Values are stable placeholders; after mount we swap to randomized output.
const INITIAL_EVENTS: TickerEvent[] = [
  { num: "01", action: "Application received · /apply submission" },
  { num: "02", action: "Identity verified · public records cross-referenced" },
  { num: "03", action: "Capital threshold validated · qualifying" },
  { num: "04", action: "Industry classified · construction · tier match" },
  { num: "05", action: "Scope sized · 80-agent engagement projected" },
  { num: "06", action: "Fit score computed · 94% match" },
  { num: "07", action: "Attribution recorded · referral · partner network" },
  { num: "08", action: "Routed to senior partner intake queue" },
  { num: "09", action: "Discovery call scheduled · Thu 2:00 PM PT" },
  { num: "10", action: "Pre-call brief composed · 4 pages · sent" },
  { num: "11", action: "Discovery call transcribed · 47 min · indexed" },
  { num: "12", action: "12 pain points extracted · prioritized by impact" },
  { num: "13", action: "Workflows mapped · 24 internal processes" },
  { num: "14", action: "Tiers allocated · 9 active for engagement" },
  { num: "15", action: "Agent topology designed · 80 agents specified" },
  { num: "16", action: "Engagement plan drafted · sent to client" },
  { num: "17", action: "Proposal composed · 22 pages · delivered" },
  { num: "18", action: "Pricing tier finalized · $387,500 base" },
  { num: "19", action: "Contract generated · awaiting signature" },
  { num: "20", action: "Legal review pass · 0 issues flagged" },
  { num: "21", action: "Signature received · executed · countersigned" },
  { num: "22", action: "Onboarding kicked off · welcome packet sent" },
  { num: "23", action: "Kickoff anchored · all stakeholders confirmed" },
  { num: "24", action: "Stakeholder map built · 7 contacts indexed" },
  { num: "25", action: "Codebase initialized · new tenant repo · live" },
  { num: "26", action: "CRM schema generated · 47 entities · 240 fields" },
  { num: "27", action: "Workflows composed · 18 flows scaffolded" },
  { num: "28", action: "Agent scaffold generated · Tier 04 · 10 agents" },
  { num: "29", action: "UI components built · 24 screens · 87 components" },
  { num: "30", action: "API composer · 38 endpoints exposed" },
  { num: "31", action: "Test suite passed · 1,247 tests · green" },
  { num: "32", action: "Code review · 3 issues flagged · resolved" },
  { num: "33", action: "Documentation generated · 142 pages · published" },
  { num: "34", action: "Build pipeline · 14 jobs queued · running" },
  { num: "35", action: "Data sources cataloged · 47 connectors found" },
  { num: "36", action: "Migration plan drafted · 3.2M records · 7 days" },
  { num: "37", action: "ETL pipeline deployed · staging · running" },
  { num: "38", action: "CRM sync established · bidirectional · live" },
  { num: "39", action: "Calendar integration · Google + Outlook · live" },
  { num: "40", action: "Email + SMS channels wired · live" },
  { num: "41", action: "Voice channel wired · 4 numbers provisioned" },
  { num: "42", action: "Payments integration · live · processing" },
  { num: "43", action: "SSO configured · OAuth + SAML · live" },
  { num: "44", action: "Sandbox provisioned for tenant DCS" },
  { num: "45", action: "Staging deployment · 12 services · live" },
  { num: "46", action: "Smoke tests · 47 checks · all passed" },
  { num: "47", action: "Production deployment · live · zero downtime" },
  { num: "48", action: "Checkpoint initialized · agent under review" },
  { num: "49", action: "Accuracy monitor · 98.7% sustained · 30 day" },
  { num: "50", action: "Human review queue · 4 pending · routed" },
  { num: "51", action: "Checkpoint graduated · Agent 27 → autonomous" },
  { num: "52", action: "Rollback ready · checkpoint v3.2 cached" },
  { num: "53", action: "Incident · auto-resolved · 0 downtime · 41s" },
  { num: "54", action: "Tenant health · all 12 nominal · green" },
  { num: "55", action: "Weekly status composed · tenant ECG · sent" },
  { num: "56", action: "Stakeholder update sent · 12 recipients" },
  { num: "57", action: "Training material · 28 modules generated" },
  { num: "58", action: "Office hours · Wed 10am · 4 attendees" },
  { num: "59", action: "Question triaged · routed to senior partner" },
  { num: "60", action: "Knowledge base · 247 articles indexed" },
  { num: "61", action: "Change request captured · scoped · approved" },
  { num: "62", action: "Satisfaction survey · 9.4 / 10 · sent to lead" },
  { num: "63", action: "Retention forecast · 96% renewal probability" },
  { num: "64", action: "Renewal initiated · year 2 contract drafted" },
  { num: "65", action: "Invoice generated · $187,500 · sent" },
  { num: "66", action: "Payment received · $250,000 · reconciled" },
  { num: "67", action: "Subscription renewed · tier 3 · annual" },
  { num: "68", action: "Vendor costs tracked · monthly · indexed" },
  { num: "69", action: "Engagement P&L updated · margin 78%" },
  { num: "70", action: "Tax compliance · Q1 filing · filed" },
  { num: "71", action: "Contract lifecycle · 3 active · 0 expiring" },
  { num: "72", action: "Capacity planner · 4 of 6 slots filled · Q2" },
  { num: "73", action: "Pattern library · 3 new templates indexed" },
  { num: "74", action: "Cross-tenant insight · 2 patterns matched" },
  { num: "75", action: "Deployment velocity · +12% MoM" },
  { num: "76", action: "Win/loss analyzed · 87% close rate · Q1" },
  { num: "77", action: "Pricing optimized · base tier · validated" },
  { num: "78", action: "System telemetry · all green · 12 tenants" },
  { num: "79", action: "Quality score · 98.4% across deployments" },
  { num: "80", action: "Checkpoint graduation · Agent 12 promoted" },
];

export default function PulseTicker() {
  // Stagger mount slightly so it doesn't slam in with the hero
  const [visible, setVisible] = useState(false);

  // SSR-safe: start with the deterministic static set; swap after mount.
  const [events, setEvents] = useState<TickerEvent[]>(INITIAL_EVENTS);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    // First randomized pass as soon as we're on the client.
    setEvents(renderEvents(TEMPLATES));

    // Regenerate every 30s so values keep drifting — "imperfection
    // that gets perfected over time".
    const interval = setInterval(() => {
      setEvents(renderEvents(TEMPLATES));
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Duplicate events for seamless marquee loop
  const loop = [...events, ...events];

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-0 inset-x-0 z-30 pointer-events-none select-none"
      aria-hidden="true"
    >
      <div className="relative bg-[--color-bg-elevated] border-t-2 border-[--color-line-strong]">
        {/* Left fade — masks the marquee behind the Live badge */}
        <div className="absolute left-0 top-0 bottom-0 w-36 bg-gradient-to-r from-[--color-bg-elevated] via-[--color-bg-elevated] to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[--color-bg-elevated] to-transparent z-10 pointer-events-none" />

        {/* Label badge on left */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2.5">
          <span className="block h-1.5 w-1.5 rounded-full bg-[--color-accent]" />
          <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-[--color-fg-muted] font-medium">
            Live
          </span>
        </div>

        <div className="overflow-hidden h-14">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 320,
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex items-center h-14 whitespace-nowrap w-max"
          >
            {loop.map((event, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 px-8 font-mono text-[12px] tracking-tight text-[--color-fg-muted] font-medium flex-shrink-0"
              >
                <span className="text-[--color-accent] tabular-nums">
                  AGENT {event.num}
                </span>
                <span className="text-[--color-fg-dim]">·</span>
                <span className="text-[--color-fg]">{event.action}</span>
                <span className="text-[--color-fg-dim] ml-3">|</span>
              </span>
            ))}
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
