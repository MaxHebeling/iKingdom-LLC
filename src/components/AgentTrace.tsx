"use client";

import { useEffect, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";

type Lang = "en" | "es";

type AgentState = {
  id: string;
  num: string;
  name: string;
  action: string;
};

type TelemetryLive = {
  activeSessions?: number;
  sectionDwell?: Record<string, number>;
  currentSections?: Record<string, number>;
  recentEvents?: Array<{
    type: string;
    section?: string;
    ts?: number;
    sessionId?: string;
  }>;
  engagementScore?: number;
};

const AGENT_BY_SECTION_BY_LANG: Record<Lang, Record<string, AgentState>> = {
  en: {
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
  },
  es: {
    top: {
      id: "top",
      num: "01",
      name: "Recepción de Solicitud",
      action: "monitoreando visita entrante",
    },
    method: {
      id: "method",
      num: "73",
      name: "Indexador de Patrones",
      action: "clasificando señal de interés",
    },
    capabilities: {
      id: "capabilities",
      num: "14",
      name: "Asignador de Niveles",
      action: "modelando ajuste por niveles",
    },
    process: {
      id: "process",
      num: "16",
      name: "Redactor de Plan de Compromiso",
      action: "proyectando línea de tiempo de despliegue",
    },
    console: {
      id: "console",
      num: "79",
      name: "Puntaje de Calidad",
      action: "transmitiendo telemetría del tenant en vivo",
    },
    proof: {
      id: "proof",
      num: "74",
      name: "Insight Cross-Tenant",
      action: "comparando con despliegues activos",
    },
    apply: {
      id: "apply",
      num: "01",
      name: "Recepción de Solicitud",
      action: "lista para recibir tu solicitud",
    },
  },
};

const COPY = {
  en: {
    agentLabel: "Agent",
    liveLabel: "iKingdom · live",
    dwell: (secs: string, section: string) =>
      `monitoring ${secs}s dwell on ${section}`,
    visitorFooter: (n: number) =>
      `iKingdom · ${n} ${n === 1 ? "visitor live" : "visitors live"}`,
  },
  es: {
    agentLabel: "Agente",
    liveLabel: "iKingdom · en vivo",
    dwell: (secs: string, section: string) =>
      `monitoreando ${secs}s en ${section}`,
    visitorFooter: (n: number) =>
      `iKingdom · ${n} ${n === 1 ? "visitante en vivo" : "visitantes en vivo"}`,
  },
} as const;

const SECTION_IDS = ["top", "method", "capabilities", "process", "console", "proof", "apply"];

type AgentTraceProps = {
  lang?: Lang;
};

export default function AgentTrace({ lang = "en" }: AgentTraceProps) {
  const [activeSection, setActiveSection] = useState<string>("top");
  const [sessionId, setSessionId] = useState<string>("");
  const [telemetry, setTelemetry] = useState<TelemetryLive | null>(null);

  // Generate session ID client-side only to avoid SSR hydration mismatch
  useEffect(() => {
    const n = Math.floor(Math.random() * 9000) + 1000;
    setSessionId(`IKDM-${n}`);
  }, []);

  // Poll live telemetry every 4s. Silent failure keeps the static UI intact.
  useEffect(() => {
    let cancelled = false;

    const fetchLive = async () => {
      try {
        const res = await fetch("/api/telemetry/live", {
          cache: "no-store",
        });
        if (!res.ok) return;
        const data = (await res.json()) as TelemetryLive;
        if (!cancelled && data && typeof data === "object") {
          setTelemetry(data);
        }
      } catch {
        // silent — keep static fallback
      }
    };

    fetchLive();
    const id = setInterval(fetchLive, 4000);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
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

  const agentMap = AGENT_BY_SECTION_BY_LANG[lang];
  const copy = COPY[lang];

  const agent = useMemo(
    () => agentMap[activeSection] || agentMap.top,
    [activeSection, agentMap],
  );

  // If telemetry has a dwell time for the currently viewed section, weave the
  // real number into the agent action. Otherwise keep the canned copy.
  const actionText = useMemo(() => {
    const dwellMs = telemetry?.sectionDwell?.[activeSection];
    if (typeof dwellMs === "number" && dwellMs > 0) {
      const secs = (dwellMs / 1000).toFixed(1);
      return copy.dwell(secs, activeSection);
    }
    return agent.action;
  }, [telemetry, activeSection, agent.action, copy]);

  // Footer: show real live visitor count when available.
  const footerId = useMemo(() => {
    const count = telemetry?.activeSessions;
    if (typeof count === "number" && count >= 0) {
      return copy.visitorFooter(count);
    }
    return sessionId;
  }, [telemetry, sessionId, copy]);

  return (
    <div className="hidden md:block fixed bottom-20 left-6 z-40 pointer-events-none select-none">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.2, delay: 1.6, ease: [0.16, 1, 0.3, 1] }}
        className="relative bg-white border border-[--color-line-strong] px-5 py-4 rounded-md min-w-[320px] shadow-xl shadow-black/10"
      >
        <div className="flex items-start gap-3">
          <div className="relative mt-1.5 flex-shrink-0">
            <span className="block w-2 h-2 rounded-full bg-[--color-accent]" />
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
                <div className="font-mono text-[11px] tracking-[0.16em] uppercase text-[--color-fg-muted] mb-1.5 font-medium">
                  {copy.agentLabel} {agent.num} · {agent.name}
                </div>
                <div
                  aria-live="polite"
                  className="font-mono text-[12px] tracking-tight text-[--color-fg] font-medium"
                >
                  {actionText}
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="mt-3 pt-2.5 border-t border-[--color-line] flex items-center justify-between font-mono text-[10px] uppercase tracking-[0.16em] text-[--color-fg-dim] font-medium">
              <span>{copy.liveLabel}</span>
              <span>{footerId}</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
