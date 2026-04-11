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

// Shared vocabulary pools — let templates pull verbs/states from the same
// lexicon so the ticker feels like it's narrating one coherent system.
const VERIFY_VERBS = [
  "validated",
  "verified",
  "cleared",
  "confirmed",
  "checked",
  "audited",
] as const;
const QUALIFY_STATES = [
  "qualifying",
  "qualified",
  "pre-qualified",
  "flagged for review",
  "scoring",
  "scored",
] as const;
const COMPOSE_VERBS = [
  "composed",
  "drafted",
  "written",
  "generated",
  "built",
  "produced",
  "created",
] as const;
const SENT_VERBS = ["sent", "delivered", "dispatched", "transmitted"] as const;
const LIVE_STATES = [
  "live",
  "active",
  "running",
  "operational",
  "online",
] as const;
const TIME_QUALIFIERS = [
  "today",
  "this week",
  "last 24h",
  "last hour",
  "this quarter",
] as const;
const TENANT_CODES = [
  "DCS",
  "ECG",
  "NRT",
  "VLT",
  "ACQ",
  "HRZ",
  "LUM",
  "ORI",
  "PRM",
  "AXL",
] as const;

const TEMPLATES: TemplateEvent[] = [
  // Tier 01 — Application Intake & Qualification
  {
    num: "01",
    render: () =>
      `Application ${pick([
        "received",
        "ingested",
        "captured",
        "logged",
      ])} · ${pick(["/apply submission", "web form", "partner referral", "inbound"])}`,
  },
  {
    num: "02",
    render: () =>
      `Identity ${pick(VERIFY_VERBS)} · ${pick([
        "public records cross-referenced",
        "KYC pass complete",
        "registry match",
        "entity confirmed",
      ])}`,
  },
  {
    num: "03",
    render: () =>
      `Capital threshold ${pick(VERIFY_VERBS)} · ${pick(QUALIFY_STATES)}`,
  },
  {
    num: "04",
    render: () =>
      `Industry ${pick([
        "classified",
        "tagged",
        "segmented",
        "categorized",
      ])} · ${pick([
        "construction",
        "logistics",
        "healthcare",
        "fintech",
        "manufacturing",
        "legal",
        "real estate",
        "biotech",
        "energy",
        "education",
      ])} · ${pick(["tier match", "sector fit", "vertical locked"])}`,
  },
  {
    num: "05",
    render: () =>
      `Scope sized · ${randInt(55, 96)}-agent engagement ${pick([
        "projected",
        "forecast",
        "modeled",
        "estimated",
      ])}`,
  },
  {
    num: "06",
    render: () =>
      `Fit score ${pick(["computed", "calculated", "resolved", "scored"])} · ${randInt(
        84,
        98,
      )}% match`,
  },
  {
    num: "07",
    render: () =>
      `Attribution ${pick(["recorded", "logged", "captured", "traced"])} · ${pick(
        ["referral", "direct", "partner", "inbound", "outbound", "event"],
      )} · partner network`,
  },
  {
    num: "08",
    render: () =>
      `${pick(["Routed", "Forwarded", "Escalated", "Handed off"])} to senior partner intake queue`,
  },

  // Tier 02 — Discovery & Architecture
  {
    num: "09",
    render: () =>
      `Discovery call ${pick(["scheduled", "booked", "confirmed", "slotted"])} · ${randomDayTime()}`,
  },
  {
    num: "10",
    render: () =>
      `Pre-call brief ${pick(COMPOSE_VERBS)} · ${randInt(3, 8)} pages · ${pick(SENT_VERBS)}`,
  },
  {
    num: "11",
    render: () =>
      `Discovery call ${pick([
        "transcribed",
        "processed",
        "summarized",
        "indexed",
      ])} · ${randInt(32, 68)} min · ${pick(["indexed", "archived", "embedded"])}`,
  },
  {
    num: "12",
    render: () =>
      `${randInt(6, 18)} pain points ${pick([
        "extracted",
        "surfaced",
        "identified",
        "mapped",
      ])} · prioritized by ${pick(["impact", "urgency", "effort", "value"])}`,
  },
  {
    num: "13",
    render: () =>
      `Workflows ${pick(["mapped", "charted", "diagrammed", "traced"])} · ${randInt(
        16,
        36,
      )} internal processes`,
  },
  {
    num: "14",
    render: () =>
      `Tiers ${pick(["allocated", "assigned", "provisioned"])} · ${randInt(6, 9)} active for engagement`,
  },
  {
    num: "15",
    render: () =>
      `Agent topology ${pick(COMPOSE_VERBS)} · ${randInt(68, 92)} agents ${pick([
        "specified",
        "scoped",
        "defined",
        "planned",
      ])}`,
  },
  {
    num: "16",
    render: () =>
      `Engagement plan ${pick(COMPOSE_VERBS)} · ${pick(SENT_VERBS)} to client`,
  },

  // Tier 03 — Engagement & Contracting
  {
    num: "17",
    render: () =>
      `Proposal ${pick(COMPOSE_VERBS)} · ${randInt(16, 32)} pages · ${pick(SENT_VERBS)}`,
  },
  {
    num: "18",
    render: () =>
      `Pricing tier ${pick([
        "finalized",
        "locked",
        "set",
        "approved",
      ])} · ${formatDollars(randInt(295000, 525000))} base`,
  },
  {
    num: "19",
    render: () =>
      `Contract ${pick(["generated", "drafted", "prepared"])} · ${pick([
        "awaiting signature",
        "in review",
        "sent to counsel",
      ])}`,
  },
  {
    num: "20",
    render: () => {
      const issues = Math.random() < 0.75 ? 0 : randInt(1, 3);
      return `Legal review ${pick(["pass", "complete", "cycle"])} · ${issues} issues flagged${
        issues > 0 ? " · resolved" : ""
      }`;
    },
  },
  {
    num: "21",
    render: () =>
      `Signature ${pick(["received", "captured", "logged"])} · ${pick([
        "executed",
        "finalized",
        "recorded",
      ])} · countersigned`,
  },
  {
    num: "22",
    render: () =>
      `Onboarding ${pick(["kicked off", "initiated", "started", "launched"])} · welcome packet ${pick(SENT_VERBS)}`,
  },
  {
    num: "23",
    render: () =>
      `Kickoff ${pick(["anchored", "completed", "locked", "held"])} · all stakeholders ${pick(["confirmed", "aligned", "briefed"])}`,
  },
  {
    num: "24",
    render: () =>
      `Stakeholder map ${pick(["built", "assembled", "compiled"])} · ${randInt(4, 13)} contacts ${pick(["indexed", "captured", "tagged"])}`,
  },

  // Tier 04 — Build & Code Generation
  {
    num: "25",
    render: () =>
      `Codebase ${pick([
        "initialized",
        "scaffolded",
        "bootstrapped",
        "provisioned",
      ])} · new tenant repo · ${pick(LIVE_STATES)}`,
  },
  {
    num: "26",
    render: () =>
      `CRM schema ${pick(COMPOSE_VERBS)} · ${randInt(36, 62)} entities · ${randInt(
        195,
        295,
      )} fields`,
  },
  {
    num: "27",
    render: () =>
      `Workflows ${pick(COMPOSE_VERBS)} · ${randInt(12, 28)} flows ${pick([
        "scaffolded",
        "stubbed",
        "wired",
      ])}`,
  },
  {
    num: "28",
    render: () =>
      `Agent scaffold ${pick(COMPOSE_VERBS)} · Tier 0${randInt(3, 6)} · ${randInt(6, 14)} agents`,
  },
  {
    num: "29",
    render: () =>
      `UI components ${pick(COMPOSE_VERBS)} · ${randInt(16, 36)} screens · ${randInt(
        68,
        118,
      )} components`,
  },
  {
    num: "30",
    render: () =>
      `API composer · ${randInt(28, 56)} endpoints ${pick([
        "exposed",
        "wired",
        "published",
        "documented",
      ])}`,
  },
  {
    num: "31",
    render: () => {
      const total = randInt(1180, 1340);
      if (Math.random() < 0.12) {
        const failing = randInt(1, 4);
        return `Test suite · ${formatInt(total)} tests · ${failing} failing · ${pick(["retrying", "auto-healing", "investigating"])}`;
      }
      return `Test suite ${pick(["passed", "cleared", "green"])} · ${formatInt(total)} tests · ${pick(["green", "all pass"])}`;
    },
  },
  {
    num: "32",
    render: () => {
      const issues = randInt(0, 6);
      return `Code review · ${issues} issues flagged${
        issues > 0 ? ` · ${pick(["resolved", "patched", "fixed"])}` : ` · ${pick(["clean", "clear", "approved"])}`
      }`;
    },
  },
  {
    num: "33",
    render: () =>
      `Documentation ${pick(COMPOSE_VERBS)} · ${randInt(110, 185)} pages · ${pick([
        "published",
        "indexed",
        "released",
      ])}`,
  },
  {
    num: "34",
    render: () =>
      `Build pipeline · ${randInt(8, 22)} jobs ${pick(["queued", "dispatched", "scheduled"])} · ${pick(LIVE_STATES)}`,
  },

  // Tier 05 — Integration & Data
  {
    num: "35",
    render: () =>
      `Data sources ${pick(["cataloged", "indexed", "discovered", "enumerated"])} · ${randInt(
        32,
        68,
      )} connectors ${pick(["found", "registered", "mapped"])}`,
  },
  {
    num: "36",
    render: () =>
      `Migration plan ${pick(COMPOSE_VERBS)} · ${randFloat(2.1, 5.4, 1)}M records · ${randInt(
        4,
        12,
      )} days`,
  },
  {
    num: "37",
    render: () =>
      `ETL pipeline ${pick(["deployed", "rolled out", "activated"])} · ${pick(["staging", "production", "shadow"])} · ${pick(LIVE_STATES)}`,
  },
  {
    num: "38",
    render: () =>
      `CRM sync ${pick(["established", "wired", "activated"])} · ${pick(["bidirectional", "two-way", "realtime"])} · ${pick(LIVE_STATES)}`,
  },
  {
    num: "39",
    render: () =>
      `Calendar integration · ${pick(["Google + Outlook", "Google Workspace", "Microsoft 365", "iCal + Google"])} · ${pick(LIVE_STATES)}`,
  },
  {
    num: "40",
    render: () =>
      `${pick([
        "Email + SMS",
        "SMS + WhatsApp",
        "Email + Voice",
        "Omnichannel",
      ])} channels ${pick(["wired", "provisioned", "connected"])} · ${pick(LIVE_STATES)}`,
  },
  {
    num: "41",
    render: () =>
      `Voice channel ${pick(["wired", "provisioned", "activated"])} · ${randInt(2, 10)} numbers ${pick(["provisioned", "assigned", "online"])}`,
  },
  {
    num: "42",
    render: () =>
      `Payments integration · ${pick(LIVE_STATES)} · ${pick([
        "processing",
        "settling",
        "reconciling",
      ])}`,
  },
  {
    num: "43",
    render: () =>
      `SSO ${pick(["configured", "wired", "enabled"])} · ${pick([
        "OAuth + SAML",
        "SAML 2.0",
        "OIDC + SAML",
        "OAuth2",
      ])} · ${pick(LIVE_STATES)}`,
  },
  {
    num: "44",
    render: () =>
      `Sandbox ${pick(["provisioned", "spun up", "allocated"])} for tenant ${pick(TENANT_CODES)}`,
  },

  // Tier 06 — Deployment & Supervision
  {
    num: "45",
    render: () =>
      `Staging deployment · ${randInt(6, 20)} services · ${pick(LIVE_STATES)}`,
  },
  {
    num: "46",
    render: () => {
      const total = randInt(38, 62);
      const failed = Math.random() < 0.15 ? randInt(1, 2) : 0;
      if (failed > 0) {
        return `Smoke tests · ${total} checks · ${failed} failed · ${pick(["retrying", "re-running"])}`;
      }
      return `Smoke tests · ${total} checks · ${pick(["all passed", "green", "clean"])}`;
    },
  },
  {
    num: "47",
    render: () =>
      `Production deployment · ${pick(LIVE_STATES)} · ${pick([
        "zero downtime",
        "blue/green",
        "canary complete",
        "rolling update",
      ])}`,
  },
  {
    num: "48",
    render: () =>
      `Checkpoint ${pick(["initialized", "opened", "staged"])} · agent under ${pick(["review", "audit", "evaluation"])}`,
  },
  {
    num: "49",
    render: () =>
      `Accuracy monitor · ${randFloat(95.8, 99.6, 1)}% sustained · ${pick(["30 day", "7 day", "14 day", "90 day"])}`,
  },
  {
    num: "50",
    render: () =>
      `Human review queue · ${randInt(1, 11)} pending · ${pick(["routed", "triaged", "assigned"])}`,
  },
  {
    num: "51",
    render: () =>
      `Checkpoint ${pick(["graduated", "promoted", "advanced"])} · Agent ${String(
        randInt(1, 80),
      ).padStart(2, "0")} → ${pick(["autonomous", "unsupervised", "production"])}`,
  },
  {
    num: "52",
    render: () =>
      `Rollback ready · checkpoint v${randInt(2, 6)}.${randInt(0, 9)} ${pick([
        "cached",
        "archived",
        "snapshotted",
      ])}`,
  },
  {
    num: "53",
    render: () =>
      `Incident · ${pick([
        "auto-resolved",
        "self-healed",
        "mitigated",
      ])} · 0 downtime · ${randInt(8, 112)}s`,
  },
  {
    num: "54",
    render: () => {
      const total = randInt(10, 16);
      const nominal = Math.random() < 0.85 ? total : total - randInt(1, 2);
      const color = nominal === total ? "green" : "amber";
      return `Tenant health · ${nominal} of ${total} nominal · ${color}`;
    },
  },

  // Tier 07 — Client Success & Communication
  {
    num: "55",
    render: () =>
      `Weekly status ${pick(COMPOSE_VERBS)} · tenant ${pick(TENANT_CODES)} · ${pick(SENT_VERBS)}`,
  },
  {
    num: "56",
    render: () =>
      `Stakeholder update ${pick(SENT_VERBS)} · ${randInt(5, 19)} recipients`,
  },
  {
    num: "57",
    render: () =>
      `Training material · ${randInt(18, 42)} modules ${pick(COMPOSE_VERBS)}`,
  },
  {
    num: "58",
    render: () =>
      `Office hours · ${pick(DAYS)} ${pick([
        "9am",
        "10am",
        "11am",
        "1pm",
        "2pm",
        "3pm",
        "4pm",
      ])} · ${randInt(2, 12)} attendees`,
  },
  {
    num: "59",
    render: () =>
      `Question ${pick(["triaged", "routed", "classified"])} · ${pick([
        "routed to senior partner",
        "escalated to engineering",
        "handled by L1",
        "forwarded to client success",
      ])}`,
  },
  {
    num: "60",
    render: () =>
      `Knowledge base · ${randInt(210, 310)} articles ${pick([
        "indexed",
        "embedded",
        "published",
      ])}`,
  },
  {
    num: "61",
    render: () =>
      `Change request ${pick(["captured", "logged", "recorded"])} · ${pick(["scoped", "sized", "estimated"])} · ${pick(["approved", "queued", "scheduled"])}`,
  },
  {
    num: "62",
    render: () =>
      `Satisfaction survey · ${randFloat(8.6, 9.9, 1)} / 10 · ${pick(SENT_VERBS)} to lead`,
  },
  {
    num: "63",
    render: () =>
      `Retention forecast · ${randInt(90, 99)}% renewal probability`,
  },
  {
    num: "64",
    render: () =>
      `Renewal ${pick(["initiated", "opened", "kicked off"])} · year ${randInt(2, 4)} contract ${pick(["drafted", "prepared", "sent"])}`,
  },

  // Tier 08 — Finance & Operations
  {
    num: "65",
    render: () =>
      `Invoice ${pick(["generated", "issued", "prepared"])} · ${formatDollars(
        randInt(38000, 425000),
      )} · ${pick(SENT_VERBS)}`,
  },
  {
    num: "66",
    render: () =>
      `Payment ${pick(["received", "cleared", "settled"])} · ${formatDollars(
        randInt(28000, 525000),
      )} · ${pick(["reconciled", "posted", "logged"])}`,
  },
  {
    num: "67",
    render: () =>
      `Subscription ${pick(["renewed", "extended", "rolled over"])} · tier ${randInt(1, 4)} · ${pick([
        "annual",
        "multi-year",
        "quarterly",
        "biennial",
      ])}`,
  },
  {
    num: "68",
    render: () =>
      `Vendor costs ${pick(["tracked", "audited", "reconciled"])} · ${pick([
        "monthly",
        "weekly",
        "quarterly",
      ])} · ${pick(["indexed", "posted", "filed"])}`,
  },
  {
    num: "69",
    render: () =>
      `Engagement P&L ${pick(["updated", "refreshed", "recalculated"])} · margin ${randInt(66, 84)}%`,
  },
  {
    num: "70",
    render: () => `Tax compliance · Q${randInt(1, 4)} filing · ${pick(["filed", "submitted", "accepted"])}`,
  },
  {
    num: "71",
    render: () =>
      `Contract lifecycle · ${randInt(2, 7)} active · ${randInt(0, 3)} ${pick(["expiring", "renewing", "pending"])}`,
  },
  {
    num: "72",
    render: () =>
      `Capacity planner · ${randInt(3, 6)} of 6 slots filled · Q${randInt(1, 4)}`,
  },

  // Tier 09 — Intelligence & Learning
  {
    num: "73",
    render: () =>
      `Pattern library · ${randInt(2, 8)} new templates ${pick(["indexed", "embedded", "cataloged"])}`,
  },
  {
    num: "74",
    render: () =>
      `Cross-tenant insight · ${randInt(1, 6)} patterns ${pick(["matched", "surfaced", "identified"])}`,
  },
  {
    num: "75",
    render: () =>
      `Deployment velocity · +${randInt(5, 22)}% ${pick(["MoM", "QoQ", "WoW"])}`,
  },
  {
    num: "76",
    render: () =>
      `Win/loss ${pick(["analyzed", "reviewed", "scored"])} · ${randInt(76, 94)}% close rate · Q${randInt(1, 4)}`,
  },
  {
    num: "77",
    render: () =>
      `Pricing ${pick(["optimized", "tuned", "recalibrated"])} · ${pick([
        "base",
        "mid",
        "premium",
        "enterprise",
      ])} tier · ${pick(VERIFY_VERBS)}`,
  },
  {
    num: "78",
    render: () =>
      `System telemetry · all ${pick(["green", "nominal", "healthy"])} · ${randInt(
        9,
        16,
      )} tenants`,
  },
  {
    num: "79",
    render: () =>
      `Quality score · ${randFloat(95.5, 99.7, 1)}% across deployments`,
  },
  {
    num: "80",
    render: () =>
      `Checkpoint graduation · Agent ${String(randInt(1, 80)).padStart(
        2,
        "0",
      )} ${pick(["promoted", "advanced", "graduated"])}`,
  },

  // ---- New templates (spread across tiers, reusing agent numbers) ----
  {
    num: "04",
    render: () =>
      `Tenant onboarded · welcome packet · day 1 · ${pick(TENANT_CODES)}`,
  },
  {
    num: "18",
    render: () =>
      `Pricing tier · adjusted · ${randFloat(0.4, 4.8, 1)}% variance · ${pick(TIME_QUALIFIERS)}`,
  },
  {
    num: "28",
    render: () =>
      `Training run complete · model ${pick([
        "v2.1",
        "v2.4",
        "v3.0",
        "v3.2",
      ])} · ${pick(["ready", "deployed", "shipped"])}`,
  },
  {
    num: "36",
    render: () =>
      `Embeddings refreshed · ${formatInt(randInt(420000, 960000))} vectors · ${pick([
        "reindexed",
        "updated",
        "repacked",
      ])}`,
  },
  {
    num: "48",
    render: () =>
      `Pattern matched · ${pick([
        "billing",
        "churn",
        "usage",
        "escalation",
        "intent",
      ])} · cross-tenant · ${pick(TIME_QUALIFIERS)}`,
  },
  {
    num: "54",
    render: () =>
      `Autoscaler · ${pick(["scaled up", "scaled down", "held steady"])} · ${randInt(
        8,
        24,
      )} workers · ${pick(LIVE_STATES)}`,
  },
  {
    num: "60",
    render: () =>
      `FAQ generator · ${randInt(8, 22)} new entries · ${pick([
        "indexed",
        "published",
        "reviewed",
      ])}`,
  },
  {
    num: "66",
    render: () =>
      `Budget variance · ${pick(["under", "on", "near"])} target · ${randFloat(0.2, 3.8, 1)}% delta · ${pick(TIME_QUALIFIERS)}`,
  },
  {
    num: "74",
    render: () =>
      `Anomaly detector · ${randInt(0, 3)} signals · ${pick([
        "noted",
        "cleared",
        "logged",
      ])} · ${pick(TIME_QUALIFIERS)}`,
  },
  {
    num: "78",
    render: () =>
      `Heartbeat · ${randInt(9, 16)} tenants · ${pick(LIVE_STATES)} · ${pick(TIME_QUALIFIERS)}`,
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
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-[--color-bg-elevated] to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[--color-bg-elevated] to-transparent z-10 pointer-events-none" />

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
