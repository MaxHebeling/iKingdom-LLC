"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

type Lang = "en" | "es";

type Tier = {
  n: string;
  nameEn: string;
  nameEs: string;
  agents: { num: string; nameEn: string; nameEs: string }[];
};

const TIERS: Tier[] = [
  {
    n: "01",
    nameEn: "Application Intake & Qualification",
    nameEs: "Recepción y Calificación de Solicitudes",
    agents: [
      { num: "01", nameEn: "Application Receiver", nameEs: "Receptor de Solicitudes" },
      { num: "02", nameEn: "Identity Verifier", nameEs: "Verificador de Identidad" },
      { num: "03", nameEn: "Capital Threshold Validator", nameEs: "Validador de Umbral de Capital" },
      { num: "04", nameEn: "Industry Classifier", nameEs: "Clasificador de Industria" },
      { num: "05", nameEn: "Scope Sizer", nameEs: "Dimensionador de Alcance" },
      { num: "06", nameEn: "Fit Scorer", nameEs: "Calificador de Compatibilidad" },
      { num: "07", nameEn: "Source Attribution", nameEs: "Atribución de Fuente" },
      { num: "08", nameEn: "Routing Coordinator", nameEs: "Coordinador de Enrutamiento" },
    ],
  },
  {
    n: "02",
    nameEn: "Discovery & Architecture",
    nameEs: "Descubrimiento y Arquitectura",
    agents: [
      { num: "09", nameEn: "Discovery Call Scheduler", nameEs: "Agendador de Llamadas de Descubrimiento" },
      { num: "10", nameEn: "Pre-Call Brief Composer", nameEs: "Redactor de Brief Pre-Llamada" },
      { num: "11", nameEn: "Discovery Transcriber", nameEs: "Transcriptor de Descubrimiento" },
      { num: "12", nameEn: "Pain Point Extractor", nameEs: "Extractor de Puntos de Dolor" },
      { num: "13", nameEn: "Workflow Mapper", nameEs: "Mapeador de Flujos" },
      { num: "14", nameEn: "Tier Allocator", nameEs: "Asignador de Niveles" },
      { num: "15", nameEn: "Agent Topology Designer", nameEs: "Diseñador de Topología de Agentes" },
      { num: "16", nameEn: "Engagement Plan Drafter", nameEs: "Redactor de Plan de Compromiso" },
    ],
  },
  {
    n: "03",
    nameEn: "Engagement & Contracting",
    nameEs: "Compromiso y Contratación",
    agents: [
      { num: "17", nameEn: "Proposal Composer", nameEs: "Redactor de Propuestas" },
      { num: "18", nameEn: "Pricing Architect", nameEs: "Arquitecto de Precios" },
      { num: "19", nameEn: "Contract Generator", nameEs: "Generador de Contratos" },
      { num: "20", nameEn: "Legal Reviewer", nameEs: "Revisor Legal" },
      { num: "21", nameEn: "Signature Coordinator", nameEs: "Coordinador de Firmas" },
      { num: "22", nameEn: "Onboarding Initiator", nameEs: "Iniciador de Onboarding" },
      { num: "23", nameEn: "Calendar Anchor", nameEs: "Anclaje de Calendario" },
      { num: "24", nameEn: "Stakeholder Aligner", nameEs: "Alineador de Stakeholders" },
    ],
  },
  {
    n: "04",
    nameEn: "Build & Code Generation",
    nameEs: "Construcción y Generación de Código",
    agents: [
      { num: "25", nameEn: "Codebase Initializer", nameEs: "Inicializador de Repositorio" },
      { num: "26", nameEn: "CRM Schema Generator", nameEs: "Generador de Esquema CRM" },
      { num: "27", nameEn: "Workflow Composer", nameEs: "Compositor de Flujos" },
      { num: "28", nameEn: "Agent Scaffold Generator", nameEs: "Generador de Esqueletos de Agentes" },
      { num: "29", nameEn: "UI Component Builder", nameEs: "Constructor de Componentes UI" },
      { num: "30", nameEn: "API Composer", nameEs: "Compositor de APIs" },
      { num: "31", nameEn: "Test Suite Writer", nameEs: "Escritor de Suite de Pruebas" },
      { num: "32", nameEn: "Code Review Agent", nameEs: "Agente de Revisión de Código" },
      { num: "33", nameEn: "Documentation Generator", nameEs: "Generador de Documentación" },
      { num: "34", nameEn: "Build Pipeline Orchestrator", nameEs: "Orquestador de Pipeline de Build" },
    ],
  },
  {
    n: "05",
    nameEn: "Integration & Data",
    nameEs: "Integración y Datos",
    agents: [
      { num: "35", nameEn: "Data Source Cataloger", nameEs: "Catalogador de Fuentes de Datos" },
      { num: "36", nameEn: "Migration Planner", nameEs: "Planificador de Migración" },
      { num: "37", nameEn: "ETL Pipeline Builder", nameEs: "Constructor de Pipeline ETL" },
      { num: "38", nameEn: "CRM Sync", nameEs: "Sincronización CRM" },
      { num: "39", nameEn: "Calendar Integration", nameEs: "Integración de Calendario" },
      { num: "40", nameEn: "Email & SMS Wirer", nameEs: "Conector de Correo y SMS" },
      { num: "41", nameEn: "Voice Channel Wirer", nameEs: "Conector de Canal de Voz" },
      { num: "42", nameEn: "Payments Integration", nameEs: "Integración de Pagos" },
      { num: "43", nameEn: "Auth & SSO Setup", nameEs: "Configuración de Auth y SSO" },
      { num: "44", nameEn: "Sandbox Provisioner", nameEs: "Aprovisionador de Sandbox" },
    ],
  },
  {
    n: "06",
    nameEn: "Deployment & Supervision",
    nameEs: "Despliegue y Supervisión",
    agents: [
      { num: "45", nameEn: "Staging Deployer", nameEs: "Desplegador de Staging" },
      { num: "46", nameEn: "Smoke Test Runner", nameEs: "Ejecutor de Smoke Tests" },
      { num: "47", nameEn: "Production Deployer", nameEs: "Desplegador de Producción" },
      { num: "48", nameEn: "Checkpoint Initializer", nameEs: "Inicializador de Verificaciones" },
      { num: "49", nameEn: "Accuracy Monitor", nameEs: "Monitor de Precisión" },
      { num: "50", nameEn: "Human Review Coordinator", nameEs: "Coordinador de Revisión Humana" },
      { num: "51", nameEn: "Graduation Tracker", nameEs: "Rastreador de Graduación" },
      { num: "52", nameEn: "Rollback Agent", nameEs: "Agente de Rollback" },
      { num: "53", nameEn: "Incident Responder", nameEs: "Respondedor de Incidentes" },
      { num: "54", nameEn: "Tenant Health Watcher", nameEs: "Monitor de Salud del Tenant" },
    ],
  },
  {
    n: "07",
    nameEn: "Client Success & Communication",
    nameEs: "Éxito del Cliente y Comunicación",
    agents: [
      { num: "55", nameEn: "Weekly Status Composer", nameEs: "Redactor de Status Semanal" },
      { num: "56", nameEn: "Stakeholder Update Sender", nameEs: "Enviador de Actualizaciones a Stakeholders" },
      { num: "57", nameEn: "Training Material Generator", nameEs: "Generador de Material de Capacitación" },
      { num: "58", nameEn: "Office Hours Scheduler", nameEs: "Agendador de Horarios de Oficina" },
      { num: "59", nameEn: "Question Triage", nameEs: "Triaje de Preguntas" },
      { num: "60", nameEn: "Knowledge Base Indexer", nameEs: "Indexador de Base de Conocimiento" },
      { num: "61", nameEn: "Change Request Capturer", nameEs: "Captura de Solicitudes de Cambio" },
      { num: "62", nameEn: "Satisfaction Surveyor", nameEs: "Encuestador de Satisfacción" },
      { num: "63", nameEn: "Retention Forecaster", nameEs: "Pronosticador de Retención" },
      { num: "64", nameEn: "Renewal Coordinator", nameEs: "Coordinador de Renovaciones" },
    ],
  },
  {
    n: "08",
    nameEn: "Finance & Operations",
    nameEs: "Finanzas y Operaciones",
    agents: [
      { num: "65", nameEn: "Invoice Generator", nameEs: "Generador de Facturas" },
      { num: "66", nameEn: "Payment Tracker", nameEs: "Rastreador de Pagos" },
      { num: "67", nameEn: "Subscription Manager", nameEs: "Gestor de Suscripciones" },
      { num: "68", nameEn: "Vendor Cost Tracker", nameEs: "Rastreador de Costos de Proveedores" },
      { num: "69", nameEn: "Engagement P&L", nameEs: "P&L del Compromiso" },
      { num: "70", nameEn: "Tax & Compliance", nameEs: "Impuestos y Cumplimiento" },
      { num: "71", nameEn: "Contract Lifecycle Manager", nameEs: "Gestor de Ciclo de Contratos" },
      { num: "72", nameEn: "Capacity Planner", nameEs: "Planificador de Capacidad" },
    ],
  },
  {
    n: "09",
    nameEn: "Intelligence & Learning",
    nameEs: "Inteligencia y Aprendizaje",
    agents: [
      { num: "73", nameEn: "Pattern Library Indexer", nameEs: "Indexador de Biblioteca de Patrones" },
      { num: "74", nameEn: "Cross-Tenant Insight", nameEs: "Insight Cross-Tenant" },
      { num: "75", nameEn: "Deployment Velocity Forecast", nameEs: "Pronóstico de Velocidad de Despliegue" },
      { num: "76", nameEn: "Win/Loss Analyzer", nameEs: "Analizador Ganado/Perdido" },
      { num: "77", nameEn: "Pricing Optimization", nameEs: "Optimización de Precios" },
      { num: "78", nameEn: "System Telemetry Aggregator", nameEs: "Agregador de Telemetría" },
      { num: "79", nameEn: "Quality Score", nameEs: "Puntaje de Calidad" },
      { num: "80", nameEn: "Checkpoint Graduation Coord.", nameEs: "Coordinador de Graduación" },
    ],
  },
];

const COPY = {
  en: {
    sectionLabel: "01 — Method",
    headlineLine1: "Eighty agents.",
    headlineLine2: "Nine tiers.",
    headlineItalic: "One company that operates itself.",
    intro:
      "We don't sell software. We don't consult. We use this system on ourselves — and we install one tailored to you. The eighty agents below are the ones running iKingdom right now. Yours will look different, because your business is different. The architecture will be the same.",
    checkpointEyebrow: "The Checkpoint Graduation Model",
    checkpointHeadingLine1: "Trust is earned,",
    checkpointHeadingLine2: "not assumed.",
    checkpointP1:
      "Every agent we deploy begins under human review. Each decision, each action, each output is checkpointed by your team. We measure accuracy continuously.",
    checkpointP2:
      "When an agent crosses 98% accuracy across a meaningful sample, its checkpoint graduates — supervision is removed, autonomy is granted. The agent now runs unattended. Your people get their hours back.",
    checkpointP3:
      "By month twelve, most of your business is running without human approval gates. By month eighteen, you've stopped thinking about it.",
    accuracyLiveLabel: "System accuracy · illustrative",
    accuracyFooter:
      "Agents are released to autonomy upon reaching this accuracy",
    trendImproving: "↑ improving",
    trendStable: "↔ stable",
    trendVolatile: "↕ volatile",
    ladderHeader: "The system that runs iKingdom",
    ladderHint: "Click any tier to inspect",
    agentsWord: "agents",
  },
  es: {
    sectionLabel: "01 — Método",
    headlineLine1: "Ochenta agentes.",
    headlineLine2: "Nueve niveles.",
    headlineItalic: "Una empresa que se opera sola.",
    intro:
      "No vendemos software. No hacemos consultoría. Usamos este sistema con nosotros mismos — y te instalamos uno hecho a tu medida. Los ochenta agentes que ves abajo son los que operan iKingdom ahora mismo. Los tuyos se verán diferentes, porque tu negocio es diferente. La arquitectura será la misma.",
    checkpointEyebrow: "El Modelo de Graduación por Verificación",
    checkpointHeadingLine1: "La confianza se gana,",
    checkpointHeadingLine2: "no se asume.",
    checkpointP1:
      "Cada agente que desplegamos comienza bajo revisión humana. Cada decisión, cada acción, cada resultado es verificado por tu equipo. Medimos la precisión continuamente.",
    checkpointP2:
      "Cuando un agente supera el 98% de precisión sobre una muestra significativa, su verificación se gradúa — la supervisión se elimina, la autonomía se otorga. El agente ahora opera sin supervisión. Tu gente recupera sus horas.",
    checkpointP3:
      "Para el mes doce, la mayor parte de tu negocio funciona sin compuertas de aprobación humana. Para el mes dieciocho, ya ni piensas en ello.",
    accuracyLiveLabel: "Precisión del sistema · ilustrativa",
    accuracyFooter:
      "Los agentes son liberados a autonomía al alcanzar esta precisión",
    trendImproving: "↑ mejorando",
    trendStable: "↔ estable",
    trendVolatile: "↕ volátil",
    ladderHeader: "El sistema que opera iKingdom",
    ladderHint: "Haz clic en cualquier nivel para inspeccionar",
    agentsWord: "agentes",
  },
} as const;

export default function Method({ lang = "en" }: { lang?: Lang }) {
  const [openTier, setOpenTier] = useState<string | null>(null);
  const t = COPY[lang];

  return (
    <section
      id="method"
      className="relative py-32 md:py-48 border-t border-[--color-line]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
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

        {/* Big statement */}
        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease }}
          className="font-display text-balance text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] max-w-5xl"
        >
          {t.headlineLine1}
          <br />
          {t.headlineLine2}{" "}
          <span className="italic text-[--color-fg-muted]">
            {t.headlineItalic}
          </span>
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease, delay: 0.2 }}
          className="mt-12 max-w-2xl text-base md:text-lg text-[--color-fg-muted] leading-relaxed"
        >
          {t.intro}
        </motion.p>

        {/* Checkpoint Graduation */}
        <div className="mt-24 md:mt-32 grid md:grid-cols-12 gap-12 md:gap-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease }}
            className="md:col-span-5"
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-[--color-accent] mb-6">
              {t.checkpointEyebrow}
            </p>
            <h3 className="font-display text-3xl md:text-5xl leading-[1.05] tracking-[-0.015em] mb-10">
              {t.checkpointHeadingLine1}
              <br />
              {t.checkpointHeadingLine2}
            </h3>

            <AccuracyMeter lang={lang} />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease, delay: 0.15 }}
            className="md:col-span-7 space-y-6 text-[--color-fg-muted] text-base md:text-[17px] leading-relaxed"
          >
            <p>{t.checkpointP1}</p>
            <p>{t.checkpointP2}</p>
            <p className="text-[--color-fg]">{t.checkpointP3}</p>
          </motion.div>
        </div>

        {/* 9-tier ladder */}
        <div className="mt-32 md:mt-40">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease }}
            className="flex items-baseline justify-between mb-10"
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim]">
              {t.ladderHeader}
            </p>
            <p className="text-[10px] uppercase tracking-[0.18em] text-[--color-fg-dim]">
              {t.ladderHint}
            </p>
          </motion.div>

          <div className="border-t border-[--color-line]">
            {TIERS.map((tier, i) => (
              <TierRow
                key={tier.n}
                tier={tier}
                index={i}
                isOpen={openTier === tier.n}
                onToggle={() =>
                  setOpenTier(openTier === tier.n ? null : tier.n)
                }
                lang={lang}
                agentsWord={t.agentsWord}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function AccuracyMeter({ lang }: { lang: Lang }) {
  const ref = useRef<HTMLDivElement>(null);
  const [value, setValue] = useState(0);
  const [started, setStarted] = useState(false);
  const [trend, setTrend] = useState<"improving" | "stable" | "volatile">(
    "stable",
  );
  const historyRef = useRef<number[]>([]);
  const t = COPY[lang];

  useEffect(() => {
    if (!ref.current) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started) {
          setStarted(true);
        }
      },
      { threshold: 0.5 },
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [started]);

  useEffect(() => {
    if (!started) return;

    let raf = 0;
    let driftTimeout: ReturnType<typeof setTimeout> | undefined;
    const start = performance.now();
    const initialTarget = 98.0;
    const duration = 2000;

    // Weighted random pick in one of three bands
    const pickValue = () => {
      const r = Math.random();
      if (r < 0.25) {
        // ~25%: dip — training / struggle
        return 96.2 + Math.random() * (97.5 - 96.2);
      } else if (r < 0.85) {
        // ~60%: normal operating range
        return 97.5 + Math.random() * (98.7 - 97.5);
      } else {
        // ~15%: peak performance
        return 98.7 + Math.random() * (99.4 - 98.7);
      }
    };

    const updateTrend = (next: number) => {
      const hist = historyRef.current;
      hist.push(next);
      if (hist.length > 5) hist.shift();
      if (hist.length < 4) return;

      const recent = hist.slice(-2);
      const prior = hist.slice(0, hist.length - 2);
      const avg = (arr: number[]) =>
        arr.reduce((s, v) => s + v, 0) / arr.length;
      const recentAvg = avg(recent);
      const priorAvg = avg(prior);
      const mean = avg(hist);
      const variance =
        hist.reduce((s, v) => s + (v - mean) ** 2, 0) / hist.length;
      const stddev = Math.sqrt(variance);

      if (stddev > 0.75) {
        setTrend("volatile");
      } else if (recentAvg - priorAvg > 0.15) {
        setTrend("improving");
      } else {
        setTrend("stable");
      }
    };

    const scheduleNext = () => {
      const interval = 4500 + Math.random() * 3000; // 4500–7500ms
      driftTimeout = setTimeout(() => {
        const next = pickValue();
        setValue(next);
        updateTrend(next);
        scheduleNext();
      }, interval);
    };

    const tick = (now: number) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 3);
      setValue(initialTarget * eased);
      if (t < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        // Seed history so the first trend computation has context
        historyRef.current = [initialTarget];
        scheduleNext();
      }
    };

    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      if (driftTimeout) clearTimeout(driftTimeout);
    };
  }, [started]);

  const trendLabel =
    trend === "improving"
      ? t.trendImproving
      : trend === "volatile"
        ? t.trendVolatile
        : t.trendStable;

  return (
    <div
      ref={ref}
      className="relative border border-[--color-line-strong] bg-[--color-bg-card] p-6 md:p-7 rounded-md max-w-sm shadow-[0_1px_2px_rgba(0,0,0,0.04)]"
    >
      <div className="flex items-center gap-2.5 mb-5">
        <span className="block h-1.5 w-1.5 rounded-full bg-[--color-accent]" />
        <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-fg-muted]">
          {t.accuracyLiveLabel}
        </span>
      </div>

      <div className="font-display text-5xl md:text-6xl tracking-[-0.02em] text-[--color-fg] tabular-nums leading-none">
        {value.toFixed(1)}
        <span className="text-[--color-accent] text-3xl md:text-4xl">%</span>
      </div>

      <div className="mt-6 h-1 bg-[--color-line] rounded-full overflow-hidden">
        <motion.div
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.6, ease }}
          className="h-full bg-gradient-to-r from-[--color-accent]/70 to-[--color-accent]"
        />
      </div>

      <div className="mt-5 pt-5 border-t border-[--color-line-strong]">
        <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-[--color-fg-dim] leading-relaxed">
          {t.accuracyFooter}
        </p>
        <p className="mt-2 font-mono text-[9px] uppercase tracking-[0.18em] text-[--color-fg-dim] tabular-nums">
          {trendLabel}
        </p>
      </div>
    </div>
  );
}

function TierRow({
  tier,
  index,
  isOpen,
  onToggle,
  lang,
  agentsWord,
}: {
  tier: Tier;
  index: number;
  isOpen: boolean;
  onToggle: () => void;
  lang: Lang;
  agentsWord: string;
}) {
  const tierName = lang === "es" ? tier.nameEs : tier.nameEn;
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{
        duration: 0.9,
        ease,
        delay: index * 0.05,
      }}
      className="border-b border-[--color-line]"
    >
      <button
        type="button"
        onClick={onToggle}
        className={`group w-full text-left grid grid-cols-12 items-baseline gap-4 py-6 md:py-8 transition-colors duration-500 ${
          isOpen
            ? "bg-[--color-bg-elevated]"
            : "hover:bg-[--color-bg-elevated]"
        }`}
      >
        <span className="col-span-2 md:col-span-1 text-xs md:text-sm text-[--color-fg-dim] font-mono pl-2 md:pl-4">
          {tier.n}
        </span>
        <h4
          className={`col-span-7 md:col-span-9 font-display text-2xl md:text-4xl tracking-[-0.015em] transition-colors duration-500 ${
            isOpen
              ? "text-[--color-accent]"
              : "text-[--color-fg] group-hover:text-[--color-accent]"
          }`}
        >
          {tierName}
        </h4>
        <span className="col-span-3 md:col-span-2 text-right text-xs md:text-sm text-[--color-fg-muted] tabular-nums pr-2 md:pr-4 flex items-center justify-end gap-3">
          <span>
            {tier.agents.length} {agentsWord}
          </span>
          <motion.svg
            animate={{ rotate: isOpen ? 45 : 0 }}
            transition={{ duration: 0.5, ease }}
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            className="flex-shrink-0"
          >
            <path
              d="M7 2V12M2 7H12"
              stroke="currentColor"
              strokeWidth="1.2"
              strokeLinecap="round"
            />
          </motion.svg>
        </span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.6, ease }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-px bg-[--color-line-strong] border border-[--color-line-strong] mb-6 mx-2 md:mx-4">
              {tier.agents.map((agent, j) => (
                <motion.div
                  key={agent.num}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    duration: 0.5,
                    ease,
                    delay: 0.1 + j * 0.03,
                  }}
                  className="bg-[--color-bg-card] flex items-center gap-4 px-6 py-5 group/agent hover:bg-[--color-bg-elevated] transition-colors duration-300"
                >
                  <span className="font-mono text-[11px] text-[--color-fg-dim] tabular-nums">
                    {agent.num}
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-[--color-fg-muted] group-hover/agent:text-[--color-fg] transition-colors duration-300 flex-1">
                    {lang === "es" ? agent.nameEs : agent.nameEn}
                  </span>
                  <span className="block h-1.5 w-1.5 rounded-full bg-[--color-accent] flex-shrink-0" />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
