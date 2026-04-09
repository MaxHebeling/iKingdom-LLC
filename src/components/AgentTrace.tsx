"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type AgentState = {
  id: string;
  num: string;
  name: string;
  action: string;
};

const AGENT_BY_SECTION: Record<string, AgentState> = {
  top: {
    id: "top",
    num: "01",
    name: "Application Receiver",
    action: "monitoring inbound visit",
  },
  method: {
    id: "method",
    num: "73",
    name: "Pattern Library Indexer",
    action: "classifying interest signal",
  },
  capabilities: {
    id: "capabilities",
    num: "14",
    name: "Tier Allocator",
    action: "modeling fit across tiers",
  },
  process: {
    id: "process",
    num: "16",
    name: "Engagement Plan Drafter",
    action: "projecting deployment timeline",
  },
  console: {
    id: "console",
    num: "79",
    name: "Quality Score",
    action: "streaming live tenant telemetry",
  },
  proof: {
    id: "proof",
    num: "74",
    name: "Cross-Tenant Insight",
    action: "comparing to active deployments",
  },
  apply: {
    id: "apply",
    num: "01",
    name: "Application Receiver",
    action: "ready to receive your application",
  },
};

const SECTION_IDS = ["top", "method", "capabilities", "process", "console", "proof", "apply"];

export default function AgentTrace() {
  const [activeSection, setActiveSection] = useState<string>("top");
  const [sessionId, setSessionId] = useState<string>("");

  // Generate session ID client-side only to avoid SSR hydration mismatch
  useEffect(() => {
    const n = Math.floor(Math.random() * 9000) + 1000;
    setSessionId(`IKDM-${n}`);
  }, []);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              setActiveSection(id);
            }
          });
        },
        {
          rootMargin: "-40% 0px -40% 0px",
          threshold: 0,
        },
      );

      observer.observe(el);
      observers.push(observer);
    });

    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const agent = useMemo(
    () => AGENT_BY_SECTION[activeSection] || AGENT_BY_SECTION.top,
    [activeSection],
  );

  return (
    <div className="hidden md:block fixed bottom-20 left-6 z-40 pointer-events-none select-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-[--color-bg-elevated]/85 backdrop-blur-md border border-[--color-line] px-5 py-3.5 rounded-md min-w-[300px] shadow-2xl shadow-black/40"
      >
        {/* Pulsing dot */}
        <div className="flex items-start gap-3">
          <div className="relative mt-1.5 flex-shrink-0">
            <span className="absolute inset-0 rounded-full bg-[--color-accent] animate-ping opacity-60" />
            <span className="relative block w-2 h-2 rounded-full bg-[--color-accent]" />
          </div>

          <div className="flex-1 min-w-0">
            <AnimatePresence mode="wait">
              <motion.div
                key={agent.id}
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="font-mono text-[10px] tracking-[0.18em] uppercase text-[--color-fg-muted] mb-1">
                  Agent {agent.num} · {agent.name}
                </div>
                <div className="font-mono text-[11px] tracking-tight text-[--color-fg]">
                  {agent.action}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-2 pt-2 border-t border-[--color-line] flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.18em] text-[--color-fg-dim]">
              <span>iKingdom · live</span>
              <span>{sessionId}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
