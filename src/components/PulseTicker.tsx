"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

type TickerEvent = {
  num: string;
  action: string;
};

// Static event pool — same on server and client (no hydration mismatch)
// One event for every agent (01–80) so the ticker shows the full system
const EVENTS: TickerEvent[] = [
  // Tier 01 — Application Intake & Qualification
  { num: "01", action: "Application received · /apply submission" },
  { num: "02", action: "Identity verified · public records cross-referenced" },
  { num: "03", action: "Capital threshold validated · qualifying" },
  { num: "04", action: "Industry classified · construction · tier match" },
  { num: "05", action: "Scope sized · 80-agent engagement projected" },
  { num: "06", action: "Fit score computed · 94% match" },
  { num: "07", action: "Attribution recorded · referral · partner network" },
  { num: "08", action: "Routed to senior partner intake queue" },
  // Tier 02 — Discovery & Architecture
  { num: "09", action: "Discovery call scheduled · Thu 2:00 PM PT" },
  { num: "10", action: "Pre-call brief composed · 4 pages · sent" },
  { num: "11", action: "Discovery call transcribed · 47 min · indexed" },
  { num: "12", action: "12 pain points extracted · prioritized by impact" },
  { num: "13", action: "Workflows mapped · 24 internal processes" },
  { num: "14", action: "Tiers allocated · 9 active for engagement" },
  { num: "15", action: "Agent topology designed · 80 agents specified" },
  { num: "16", action: "Engagement plan drafted · sent to client" },
  // Tier 03 — Engagement & Contracting
  { num: "17", action: "Proposal composed · 22 pages · delivered" },
  { num: "18", action: "Pricing tier finalized · $387,500 base" },
  { num: "19", action: "Contract generated · awaiting signature" },
  { num: "20", action: "Legal review pass · 0 issues flagged" },
  { num: "21", action: "Signature received · executed · countersigned" },
  { num: "22", action: "Onboarding kicked off · welcome packet sent" },
  { num: "23", action: "Kickoff anchored · all stakeholders confirmed" },
  { num: "24", action: "Stakeholder map built · 7 contacts indexed" },
  // Tier 04 — Build & Code Generation
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
  // Tier 05 — Integration & Data
  { num: "35", action: "Data sources cataloged · 14 connectors found" },
  { num: "36", action: "Migration plan drafted · 3.2M records · 7 days" },
  { num: "37", action: "ETL pipeline deployed · staging · running" },
  { num: "38", action: "CRM sync established · bidirectional · live" },
  { num: "39", action: "Calendar integration · Google + Outlook · live" },
  { num: "40", action: "Email + SMS channels wired · live" },
  { num: "41", action: "Voice channel wired · 4 numbers provisioned" },
  { num: "42", action: "Payments integration · live · processing" },
  { num: "43", action: "SSO configured · OAuth + SAML · live" },
  { num: "44", action: "Sandbox provisioned for tenant DCS" },
  // Tier 06 — Deployment & Supervision
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
  // Tier 07 — Client Success & Communication
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
  // Tier 08 — Finance & Operations
  { num: "65", action: "Invoice generated · $187,500 · sent" },
  { num: "66", action: "Payment received · $250,000 · reconciled" },
  { num: "67", action: "Subscription renewed · tier 3 · annual" },
  { num: "68", action: "Vendor costs tracked · monthly · indexed" },
  { num: "69", action: "Engagement P&L updated · margin 78%" },
  { num: "70", action: "Tax compliance · Q1 filing · filed" },
  { num: "71", action: "Contract lifecycle · 3 active · 0 expiring" },
  { num: "72", action: "Capacity planner · 4 of 6 slots filled · Q2" },
  // Tier 09 — Intelligence & Learning
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
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 1800);
    return () => clearTimeout(t);
  }, []);

  // Duplicate events for seamless marquee loop
  const loop = [...EVENTS, ...EVENTS];

  return (
    <motion.div
      initial={{ y: 60, opacity: 0 }}
      animate={visible ? { y: 0, opacity: 1 } : { y: 60, opacity: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-0 inset-x-0 z-30 pointer-events-none select-none"
      aria-hidden="true"
    >
      <div className="relative bg-[--color-bg-elevated]/95 backdrop-blur-sm border-t border-[--color-line]">
        {/* Left fade */}
        <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[--color-bg-elevated] to-transparent z-10 pointer-events-none" />
        {/* Right fade */}
        <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[--color-bg-elevated] to-transparent z-10 pointer-events-none" />

        {/* Label badge on left */}
        <div className="absolute left-6 top-1/2 -translate-y-1/2 z-20 flex items-center gap-2.5">
          <span className="relative flex h-1.5 w-1.5">
            <span className="absolute inline-flex h-full w-full rounded-full bg-[--color-accent] opacity-70 animate-ping" />
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[--color-accent]" />
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-fg-muted]">
            Live
          </span>
        </div>

        <div className="overflow-hidden h-12">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 90,
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex items-center h-12 whitespace-nowrap will-change-transform"
            style={{ paddingLeft: "120px" }}
          >
            {loop.map((event, i) => (
              <span
                key={i}
                className="inline-flex items-center gap-3 px-8 font-mono text-[11px] tracking-tight text-[--color-fg-muted]"
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
