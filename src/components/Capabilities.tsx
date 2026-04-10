"use client";

import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const COPY = {
  en: {
    sectionLabel: "02 — Capabilities",
    headlineLine1: "What your business",
    headlineLine2: "stops doing manually.",
    capabilities: [
      {
        title: "Capture every lead, day or night.",
        body: "AI receptionist takes calls. Chat agent answers your site. Email and form intake never sleep. Every inbound is logged, qualified, and routed before a human is involved.",
        stat: "100% · 24/7 capture",
      },
      {
        title: "Qualify and respond before competitors wake up.",
        body: "Inbound is scored, ranked, and routed in seconds. The right people see the right leads. Cold leads warm themselves up while you sleep.",
        stat: "< 2s avg response",
      },
      {
        title: "Coordinate every calendar, handoff, and follow-through.",
        body: "Bookings, internal handoffs, dependencies, and confirmations handled by a single coordinated layer. Nothing gets dropped between the cracks of two humans.",
        stat: "0 dropped handoffs",
      },
      {
        title: "Communicate with every customer like they're your only one.",
        body: "Welcome sequences, status updates, post-engagement follow-up, review requests, complaint resolution, re-engagement. All personalized. None forgotten.",
        stat: "47× faster touchpoints",
      },
      {
        title: "Run your back office on rails.",
        body: "Invoicing, payments, bookkeeping, expenses, payroll, contracts, and AR — handled by agents that don't take vacation, don't make typos, and report a daily P&L by 6 a.m.",
        stat: "Books closed by 6 AM",
      },
      {
        title: "See what every team is producing, in real time.",
        body: "Output, throughput, response times, and quality monitored across every role. When a person can't get to a follow-up, an agent does it for them — and flags the pattern.",
        stat: "Live across all roles",
      },
      {
        title: "Run operations, supply chain, and compliance unattended.",
        body: "Whatever your business has to keep watched — inventory, vendors, contracts, certifications, infrastructure — agents watch it and act on it without a Monday morning meeting.",
        stat: "Zero approval gates",
      },
      {
        title: "Forecast revenue before it happens.",
        body: "Funnel analytics, customer lifetime value, demand prediction, and pricing optimization — surfaced as a single intelligence layer your leadership team actually reads.",
        stat: "Revenue forecast ± 3%",
      },
    ],
  },
  es: {
    sectionLabel: "02 — Capacidades",
    headlineLine1: "Lo que tu negocio",
    headlineLine2: "deja de hacer manualmente.",
    capabilities: [
      {
        title: "Captura cada prospecto, día y noche.",
        body: "La recepcionista de IA contesta llamadas. El agente de chat responde en tu sitio web. El correo y los formularios nunca duermen. Cada contacto entrante se registra, se califica y se enruta antes de que un humano se involucre.",
        stat: "100% · captura 24/7",
      },
      {
        title: "Califica y responde antes de que despierten tus competidores.",
        body: "Los prospectos entrantes son evaluados, clasificados y enrutados en segundos. Las personas correctas ven los prospectos correctos. Los prospectos fríos se calientan solos mientras tú duermes.",
        stat: "< 2s respuesta promedio",
      },
      {
        title: "Coordina cada calendario, transición y seguimiento.",
        body: "Reservas, transiciones internas, dependencias y confirmaciones manejadas por una capa coordinada. Nada se pierde entre las grietas de dos humanos.",
        stat: "0 transiciones perdidas",
      },
      {
        title: "Comunícate con cada cliente como si fuera el único.",
        body: "Secuencias de bienvenida, actualizaciones de estado, seguimiento post-compromiso, solicitudes de reseñas, resolución de quejas, reactivación. Todo personalizado. Nada olvidado.",
        stat: "47× contactos más rápidos",
      },
      {
        title: "Opera tu administración sobre rieles.",
        body: "Facturación, pagos, contabilidad, gastos, nómina, contratos y cuentas por cobrar — manejados por agentes que no toman vacaciones, no cometen errores tipográficos y entregan un P&L diario antes de las 6 a.m.",
        stat: "Libros cerrados a las 6 AM",
      },
      {
        title: "Ve lo que cada equipo está produciendo, en tiempo real.",
        body: "Producción, rendimiento, tiempos de respuesta y calidad monitoreados en cada rol. Cuando una persona no puede atender un seguimiento, un agente lo hace por ella — y marca el patrón.",
        stat: "En vivo en todos los roles",
      },
      {
        title: "Opera procesos, cadena de suministro y cumplimiento sin supervisión.",
        body: "Lo que sea que tu negocio necesite vigilar — inventario, proveedores, contratos, certificaciones, infraestructura — los agentes lo monitorean y actúan sobre ello sin una junta de los lunes.",
        stat: "Cero compuertas de aprobación",
      },
      {
        title: "Pronostica ingresos antes de que ocurran.",
        body: "Análisis del embudo, valor de vida del cliente, predicción de demanda y optimización de precios — entregados como una sola capa de inteligencia que tu equipo de liderazgo realmente lee.",
        stat: "Pronóstico de ingresos ± 3%",
      },
    ],
  },
} as const;

export default function Capabilities({ lang = "en" }: { lang?: "en" | "es" }) {
  const copy = COPY[lang];
  return (
    <section
      id="capabilities"
      aria-label={lang === "es" ? "Capacidades" : "Capabilities"}
      className="relative py-32 md:py-48 border-t border-[--color-line]"
    >
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease }}
          className="flex items-center gap-3 mb-20"
        >
          <span className="text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim]">
            {copy.sectionLabel}
          </span>
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.4, ease }}
          className="font-display text-balance text-[clamp(2.25rem,6vw,5.5rem)] leading-[0.95] tracking-[-0.02em] max-w-5xl"
        >
          {copy.headlineLine1}
          <br />
          <span className="italic text-[--color-fg-muted]">
            {copy.headlineLine2}
          </span>
        </motion.h2>

        <div className="mt-24 md:mt-32 grid md:grid-cols-2 gap-px bg-[--color-line-strong]">
          {copy.capabilities.map((cap, i) => (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 1, ease, delay: (i % 2) * 0.1 }}
              className="bg-[--color-bg] p-10 md:p-14 hover:bg-[--color-bg-elevated] transition-colors duration-700 group relative"
            >
              {/* Stat badge — top right */}
              <div className="absolute top-10 md:top-14 right-10 md:right-14 flex items-center gap-2">
                <span className="block w-1 h-1 rounded-full bg-[--color-accent]" />
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[--color-accent] tabular-nums">
                  {cap.stat}
                </span>
              </div>

              <div className="flex items-start gap-6">
                <span className="text-xs text-[--color-fg-dim] font-mono mt-2 tabular-nums">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <div className="pr-32 md:pr-40">
                  <h3 className="font-display text-2xl md:text-[32px] leading-[1.1] tracking-[-0.015em] text-[--color-fg] group-hover:text-[--color-accent] transition-colors duration-700">
                    {cap.title}
                  </h3>
                  <p className="mt-5 text-[15px] md:text-base text-[--color-fg-muted] leading-relaxed text-pretty">
                    {cap.body}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
