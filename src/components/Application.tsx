"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

type Lang = "en" | "es";

type PipelineStep = {
  num: string;
  label: string;
  detail: string;
  duration: number;
};

const PIPELINE_BY_LANG: Record<Lang, PipelineStep[]> = {
  en: [
    {
      num: "01",
      label: "Application Receiver",
      detail: "Application received and logged",
      duration: 1100,
    },
    {
      num: "03",
      label: "Capital Threshold Validator",
      detail: "Verifying capital availability against engagement minimum",
      duration: 1700,
    },
    {
      num: "06",
      label: "Fit Scorer",
      detail: "Scoring engagement fit and deployment slot availability",
      duration: 1500,
    },
    {
      num: "08",
      label: "Routing Coordinator",
      detail: "Routing to senior partner intake queue",
      duration: 1300,
    },
    {
      num: "—",
      label: "Human · Senior Partner",
      detail: "Will personally review and reach out within 5 business days",
      duration: 1400,
    },
  ],
  es: [
    {
      num: "01",
      label: "Recepción de Solicitud",
      detail: "Solicitud recibida y registrada",
      duration: 1100,
    },
    {
      num: "03",
      label: "Validador de Umbral de Capital",
      detail: "Verificando disponibilidad de capital contra el mínimo del compromiso",
      duration: 1700,
    },
    {
      num: "06",
      label: "Calificador de Compatibilidad",
      detail: "Calificando compatibilidad del compromiso y disponibilidad de espacio de despliegue",
      duration: 1500,
    },
    {
      num: "08",
      label: "Coordinador de Enrutamiento",
      detail: "Enrutando a la cola de recepción de socio senior",
      duration: 1300,
    },
    {
      num: "—",
      label: "Humano · Socio Senior",
      detail: "Revisará personalmente y se pondrá en contacto dentro de 5 días hábiles",
      duration: 1400,
    },
  ],
};

type InvestmentTier = {
  id: string;
  price: string;
  name: string;
  description: string;
};

const INVESTMENT_TIERS_BY_LANG: Record<Lang, InvestmentTier[]> = {
  en: [
    {
      id: "pilot",
      price: "$35,000",
      name: "Pilot Engagement",
      description: "Single workflow, proof of concept, ~15 agents",
    },
    {
      id: "foundation",
      price: "$50,000",
      name: "Foundation",
      description: "1–2 functional tiers, partial deployment, ~30 agents",
    },
    {
      id: "standard",
      price: "$100,000",
      name: "Standard",
      description:
        "Full operational layer, all 9 tiers, 80 agents — the iKingdom flagship engagement",
    },
    {
      id: "enterprise",
      price: "$500,000+",
      name: "Enterprise",
      description: "Multi-vertical, large organization, custom architecture",
    },
  ],
  es: [
    {
      id: "pilot",
      price: "$35,000",
      name: "Compromiso Piloto",
      description: "Un solo flujo, prueba de concepto, ~15 agentes",
    },
    {
      id: "foundation",
      price: "$50,000",
      name: "Fundación",
      description: "1–2 niveles funcionales, despliegue parcial, ~30 agentes",
    },
    {
      id: "standard",
      price: "$100,000",
      name: "Estándar",
      description:
        "Capa operacional completa, los 9 niveles, 80 agentes — insignia de iKingdom",
    },
    {
      id: "enterprise",
      price: "$500,000+",
      name: "Empresa",
      description: "Múltiples verticales, organización grande, arquitectura a la medida",
    },
  ],
};

const COPY = {
  en: {
    sectionLabel: "07 — Application",
    headlineA: "We work with",
    headlineItalic: "a few",
    headlineB: "companies a year.",
    framingParagraph:
      "iKingdom is not for everyone. Most companies that apply are not selected. We deploy a small number of full-stack systems each year because each one demands our presence for twelve months. If you\u2019re ready to commit to a strategic, multi-year operational decision, we want to hear from you.",
    ifThisIsYou: "If this is you",
    requirements: [
      "Six-figure or larger annual revenue, verifiable",
      "An established operating business, not a side project",
      "A team and operational layer worth scaling, not replacing",
      "Authority to make decisions beyond the next quarter",
      "Ambition large enough to require autonomous infrastructure",
    ],
    stepOf: (n: number) => `Step ${n} of 3`,
    stepLabels: {
      1: "About you",
      2: "About your business",
      3: "Investment & scope",
    } as Record<1 | 2 | 3, string>,
    approxSeconds: "~90 seconds",
    step1Intro:
      "We start with you. Every iKingdom engagement begins with a single principal who has the authority to commit. Tell us who you are.",
    step2Intro:
      "Now your business. We design the system around your operations, your verticals, and the scale you operate at. Help us understand what we\u2019d be working with.",
    step3Intro:
      "iKingdom engagements are not subscriptions. They\u2019re single, decisive commitments to install a system. Tell us what you\u2019re prepared to commit and what you want us to take over.",
    fields: {
      name: "Full name",
      title: "Title / role",
      email: "Email",
      phone: "Phone",
      company: "Company",
      website: "Website",
      industry: "Industry / sector",
      revenue: "Annual revenue",
    },
    revenueOptions: [
      "Under $1M",
      "$1M – $5M",
      "$5M – $25M",
      "$25M – $100M",
      "$100M+",
    ],
    selectPlaceholder: "Select…",
    step1Footer: "Step 1 of 3 · About you. Takes about 90 seconds.",
    continue: "Continue",
    back: "Back",
    investmentReadiness: "Investment readiness",
    whatAutomated: "What do you want automated?",
    scopePlaceholder:
      "Briefly describe the operations you want iKingdom to take over.",
    submitApplication: "Submit Application",
    live: "Live · Application in pipeline",
    watchLeadA: "Watch your lead",
    watchLeadItalic: "enter the system.",
    pipelineParagraph:
      "Every step you see below is being executed by an iKingdom agent in real time. This is the same flow we install inside our clients\u2019 businesses.",
    nextStep: "Next step",
    nextStepHeadline:
      "A senior partner will reach out personally to schedule a private discovery Zoom.",
    nextStepDetail:
      "You will receive a calendar invitation within five business days. Until then, the system has it.",
    agentPrefix: "Agent",
  },
  es: {
    sectionLabel: "07 — Solicitud",
    headlineA: "Trabajamos con",
    headlineItalic: "unas pocas",
    headlineB: "compañías al año.",
    framingParagraph:
      "iKingdom no es para todos. La mayoría de las compañías que aplican no son seleccionadas. Desplegamos un número pequeño de sistemas completos cada año porque cada uno demanda nuestra presencia durante doce meses. Si estás listo para comprometerte con una decisión operacional estratégica de varios años, queremos saber de ti.",
    ifThisIsYou: "Si esto eres tú",
    requirements: [
      "Ingresos anuales de seis cifras o más, verificables",
      "Un negocio operativo establecido, no un proyecto secundario",
      "Un equipo y una capa operacional que vale la pena escalar, no reemplazar",
      "Autoridad para tomar decisiones más allá del próximo trimestre",
      "Ambición suficientemente grande para requerir infraestructura autónoma",
    ],
    stepOf: (n: number) => `Paso ${n} de 3`,
    stepLabels: {
      1: "Sobre ti",
      2: "Sobre tu negocio",
      3: "Inversión y alcance",
    } as Record<1 | 2 | 3, string>,
    approxSeconds: "~90 segundos",
    step1Intro:
      "Comenzamos contigo. Cada compromiso de iKingdom inicia con un único principal que tiene la autoridad para comprometerse. Cuéntanos quién eres.",
    step2Intro:
      "Ahora tu negocio. Diseñamos el sistema alrededor de tus operaciones, tus verticales y la escala en la que operas. Ayúdanos a entender con qué estaríamos trabajando.",
    step3Intro:
      "Los compromisos de iKingdom no son suscripciones. Son compromisos únicos y decisivos para instalar un sistema. Cuéntanos qué estás preparado para comprometer y qué quieres que tomemos a cargo.",
    fields: {
      name: "Nombre completo",
      title: "Título / cargo",
      email: "Correo electrónico",
      phone: "Teléfono",
      company: "Empresa",
      website: "Sitio web",
      industry: "Industria / sector",
      revenue: "Ingresos anuales",
    },
    revenueOptions: [
      "Menos de $1M",
      "$1M – $5M",
      "$5M – $25M",
      "$25M – $100M",
      "$100M+",
    ],
    selectPlaceholder: "Seleccionar…",
    step1Footer: "Paso 1 de 3 · Sobre ti. Toma cerca de 60 segundos.",
    continue: "Continuar",
    back: "Atrás",
    investmentReadiness: "Disposición de inversión",
    whatAutomated: "¿Qué quieres automatizar?",
    scopePlaceholder:
      "Describe brevemente las operaciones que quieres que iKingdom asuma.",
    submitApplication: "Enviar Solicitud",
    live: "En vivo · Solicitud en pipeline",
    watchLeadA: "Mira tu prospecto",
    watchLeadItalic: "entrar al sistema.",
    pipelineParagraph:
      "Cada paso que ves abajo está siendo ejecutado por un agente de iKingdom en tiempo real. Este es el mismo flujo que instalamos dentro de los negocios de nuestros clientes.",
    nextStep: "Siguiente paso",
    nextStepHeadline:
      "Un socio senior se pondrá en contacto personalmente para agendar un Zoom privado de descubrimiento.",
    nextStepDetail:
      "Recibirás una invitación de calendario dentro de cinco días hábiles. Hasta entonces, el sistema lo tiene en sus manos.",
    agentPrefix: "Agente",
  },
} as const;

type FormData = {
  name: string;
  title: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  industry: string;
  revenue: string;
  investment: string;
  scope: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  industry: "",
  revenue: "",
  investment: "",
  scope: "",
};

type Step = 1 | 2 | 3;

export default function Application({ lang = "en" }: { lang?: Lang }) {
  const t = COPY[lang];
  const PIPELINE = PIPELINE_BY_LANG[lang];
  const INVESTMENT_TIERS = INVESTMENT_TIERS_BY_LANG[lang];

  const [submitted, setSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [step, setStep] = useState<Step>(1);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function handleStep1(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStep(2);
  }

  function handleStep2(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStep(3);
  }

  function handleBackTo(target: Step) {
    setStep(target);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData.investment) return;

    try {
      await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, lang }),
      });
    } catch {
      // Pipeline animation runs regardless — email is best-effort
    }

    setSubmitted(true);
  }

  useEffect(() => {
    if (!submitted) return;

    let cancelled = false;
    let cumulative = 250;

    PIPELINE.forEach((step, i) => {
      setTimeout(() => {
        if (!cancelled) setActiveStep(i);
      }, cumulative);
      cumulative += step.duration;
    });

    return () => {
      cancelled = true;
    };
    // PIPELINE is stable per-render via lang; intentionally not in deps to preserve array size
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted]);

  return (
    <section
      id="apply"
      aria-label={lang === "es" ? "Solicitud" : "Application"}
      className="relative py-32 md:py-48 border-t border-[--color-line] overflow-hidden"
    >
      <div className="relative max-w-[1400px] mx-auto px-6 md:px-10">
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

        <div className="grid md:grid-cols-12 gap-12 md:gap-20">
          {/* Left: framing */}
          <div className="md:col-span-5">
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.4, ease }}
              className="font-display text-balance text-[clamp(2.25rem,5vw,4.5rem)] leading-[0.95] tracking-[-0.02em]"
            >
              {t.headlineA}{" "}
              <span className="italic text-[--color-accent]">
                {t.headlineItalic}
              </span>{" "}
              {t.headlineB}
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease, delay: 0.2 }}
              className="mt-10 space-y-6 text-[--color-fg-muted] text-base md:text-[17px] leading-relaxed"
            >
              <p>{t.framingParagraph}</p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease, delay: 0.35 }}
              className="mt-12"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim] mb-6">
                {t.ifThisIsYou}
              </p>
              <ul className="space-y-4">
                {t.requirements.map((r) => (
                  <li
                    key={r}
                    className="flex items-start gap-4 text-sm md:text-[15px] text-[--color-fg-muted]"
                  >
                    <span className="mt-2 h-px w-5 bg-[--color-accent] flex-shrink-0" />
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Right: form */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, ease, delay: 0.2 }}
            className="md:col-span-7"
          >
            {submitted ? (
              <SubmittedPipeline
                activeStep={activeStep}
                pipeline={PIPELINE}
                t={t}
              />
            ) : (
              <div className="border border-[--color-line-strong] p-8 md:p-12 bg-[--color-bg-card]">
                <StepHeader step={step} t={t} />

                <AnimatePresence mode="wait">
                  {step === 1 && (
                    <motion.form
                      key="step-1"
                      onSubmit={handleStep1}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, ease }}
                      className="space-y-8 mt-10"
                    >
                      <StepIntro>{t.step1Intro}</StepIntro>

                      <div className="grid md:grid-cols-2 gap-8">
                        <Field
                          label={t.fields.name}
                          name="name"
                          value={formData.name}
                          onChange={(v) => update("name", v)}
                          required
                        />
                        <Field
                          label={t.fields.title}
                          name="title"
                          value={formData.title}
                          onChange={(v) => update("title", v)}
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <Field
                          label={t.fields.email}
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={(v) => update("email", v)}
                          required
                        />
                        <Field
                          label={t.fields.phone}
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(v) => update("phone", v)}
                          required
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-6 pt-6">
                        <p className="text-xs text-[--color-fg-dim] max-w-xs leading-relaxed">
                          {t.step1Footer}
                        </p>
                        <PrimaryButton label={t.continue} />
                      </div>
                    </motion.form>
                  )}

                  {step === 2 && (
                    <motion.form
                      key="step-2"
                      onSubmit={handleStep2}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, ease }}
                      className="space-y-8 mt-10"
                    >
                      <StepIntro>{t.step2Intro}</StepIntro>

                      <div className="grid md:grid-cols-2 gap-8">
                        <Field
                          label={t.fields.company}
                          name="company"
                          value={formData.company}
                          onChange={(v) => update("company", v)}
                          required
                        />
                        <Field
                          label={t.fields.website}
                          name="website"
                          type="url"
                          value={formData.website}
                          onChange={(v) => update("website", v)}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <Field
                          label={t.fields.industry}
                          name="industry"
                          value={formData.industry}
                          onChange={(v) => update("industry", v)}
                          required
                        />
                        <Select
                          label={t.fields.revenue}
                          name="revenue"
                          value={formData.revenue}
                          onChange={(v) => update("revenue", v)}
                          options={t.revenueOptions}
                          placeholder={t.selectPlaceholder}
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-6 pt-6">
                        <BackButton onClick={() => handleBackTo(1)} label={t.back} />
                        <PrimaryButton label={t.continue} />
                      </div>
                    </motion.form>
                  )}

                  {step === 3 && (
                    <motion.form
                      key="step-3"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, ease }}
                      className="space-y-8 mt-10"
                    >
                      <StepIntro>{t.step3Intro}</StepIntro>

                      <div>
                        <p className="block text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim] mb-4">
                          {t.investmentReadiness}
                          <span className="text-[--color-accent] ml-1">*</span>
                        </p>
                        <div className="grid sm:grid-cols-2 gap-4">
                          {INVESTMENT_TIERS.map((tier) => {
                            const selected = formData.investment === tier.id;
                            return (
                              <button
                                key={tier.id}
                                type="button"
                                onClick={() => update("investment", tier.id)}
                                className={`text-left p-6 border transition-all duration-300 group relative ${
                                  selected
                                    ? "border-[--color-accent] bg-[--color-accent]/5 shadow-[0_0_0_1px_var(--color-accent)]"
                                    : "border-[--color-line-strong] hover:border-[--color-fg] bg-transparent"
                                }`}
                              >
                                <div className="flex items-start justify-between gap-3 mb-3">
                                  <span
                                    className={`font-display text-2xl md:text-[28px] tracking-[-0.015em] transition-colors duration-300 ${
                                      selected
                                        ? "text-[--color-accent]"
                                        : "text-[--color-fg]"
                                    }`}
                                  >
                                    {tier.price}
                                  </span>
                                  <span
                                    className={`mt-2 h-3 w-3 rounded-full border transition-all duration-300 flex-shrink-0 ${
                                      selected
                                        ? "border-[--color-accent] bg-[--color-accent]"
                                        : "border-[--color-line-strong] bg-transparent"
                                    }`}
                                  />
                                </div>
                                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-[--color-fg-muted] mb-2">
                                  {tier.name}
                                </div>
                                <p className="text-[13px] leading-relaxed text-[--color-fg-muted]">
                                  {tier.description}
                                </p>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label
                          htmlFor="scope"
                          className="block text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim] mb-3"
                        >
                          {t.whatAutomated}
                          <span className="text-[--color-accent] ml-1">*</span>
                        </label>
                        <textarea
                          id="scope"
                          name="scope"
                          rows={5}
                          required
                          value={formData.scope}
                          onChange={(e) => update("scope", e.target.value)}
                          placeholder={t.scopePlaceholder}
                          className="w-full bg-transparent border border-[--color-line-strong] focus:border-[--color-accent] focus:outline-none px-4 py-3 text-[--color-fg] placeholder:text-[--color-fg-dim] text-[15px] resize-none transition-colors duration-300"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-6 pt-6">
                        <BackButton onClick={() => handleBackTo(2)} label={t.back} />
                        <button
                          type="submit"
                          disabled={!formData.investment}
                          className="group inline-flex items-center gap-3 px-7 py-4 bg-[--color-fg] text-[--color-bg] text-sm tracking-wide hover:bg-[--color-fg-muted] transition-all duration-500 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          {t.submitApplication}
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                            className="transition-transform duration-500 group-hover:translate-x-1"
                          >
                            <path
                              d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </motion.form>
                  )}
                </AnimatePresence>
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

function StepIntro({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[14px] md:text-[15px] leading-relaxed text-[--color-fg-muted] border-l border-[--color-accent] pl-5">
      {children}
    </p>
  );
}

function PrimaryButton({ label }: { label: string }) {
  return (
    <button
      type="submit"
      className="group inline-flex items-center gap-3 px-7 py-4 bg-[--color-fg] text-[--color-bg] text-sm tracking-wide hover:bg-[--color-fg-muted] transition-all duration-500 rounded-full"
    >
      {label}
      <svg
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        className="transition-transform duration-500 group-hover:translate-x-1"
      >
        <path
          d="M1 7H13M13 7L7.5 1.5M13 7L7.5 12.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}

function BackButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-sm text-[--color-fg-muted] hover:text-[--color-fg] transition-colors duration-300 inline-flex items-center gap-2"
    >
      <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
        <path
          d="M13 7H1M1 7L6.5 1.5M1 7L6.5 12.5"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="round"
        />
      </svg>
      {label}
    </button>
  );
}

function StepHeader({
  step,
  t,
}: {
  step: Step;
  t: (typeof COPY)[Lang];
}) {
  const label = t.stepLabels[step];
  const progress = step === 1 ? "33%" : step === 2 ? "66%" : "100%";

  return (
    <div className="border-b border-[--color-line] pb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-accent]">
            {t.stepOf(step)}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-fg-dim]">
            · {label}
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[--color-fg-dim]">
          {t.approxSeconds}
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-px bg-[--color-line] overflow-hidden">
        <motion.div
          animate={{ width: progress }}
          transition={{ duration: 0.6, ease }}
          className="h-full bg-[--color-accent]"
        />
      </div>
    </div>
  );
}

function SubmittedPipeline({
  activeStep,
  pipeline,
  t,
}: {
  activeStep: number;
  pipeline: PipelineStep[];
  t: (typeof COPY)[Lang];
}) {
  const allDone = activeStep >= pipeline.length - 1;

  return (
    <div className="border border-[--color-line-strong] p-8 md:p-12 bg-[--color-bg-card]">
      <div className="flex items-center gap-3 mb-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[--color-accent] opacity-60 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[--color-accent]" />
        </span>
        <p className="text-[11px] uppercase tracking-[0.22em] text-[--color-accent]">
          {t.live}
        </p>
      </div>

      <h3 className="font-display text-3xl md:text-5xl leading-[1.05] tracking-[-0.015em] mt-4">
        {t.watchLeadA}{" "}
        <span className="italic text-[--color-fg-muted]">
          {t.watchLeadItalic}
        </span>
      </h3>

      <p className="mt-5 text-sm text-[--color-fg-muted] max-w-md leading-relaxed">
        {t.pipelineParagraph}
      </p>

      <div className="mt-12 space-y-px bg-[--color-line-strong]">
        {pipeline.map((step, i) => {
          const status =
            i < activeStep ? "done" : i === activeStep ? "active" : "pending";
          return (
            <PipelineRow
              key={step.num + step.label}
              step={step}
              status={status}
              agentPrefix={t.agentPrefix}
            />
          );
        })}
      </div>

      <AnimatePresence>
        {allDone && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4, ease }}
            className="mt-10 pt-8 border-t border-[--color-line]"
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim] mb-3">
              {t.nextStep}
            </p>
            <p className="font-display text-2xl md:text-3xl leading-tight tracking-[-0.015em]">
              {t.nextStepHeadline}
            </p>
            <p className="mt-4 text-sm text-[--color-fg-muted] leading-relaxed">
              {t.nextStepDetail}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PipelineRow({
  step,
  status,
  agentPrefix,
}: {
  step: PipelineStep;
  status: "pending" | "active" | "done";
  agentPrefix: string;
}) {
  const isHuman = step.num === "—";
  return (
    <motion.div
      animate={{
        opacity: status === "pending" ? 0.32 : 1,
      }}
      transition={{ duration: 0.5, ease }}
      className="bg-[--color-bg-card] py-5 px-1 grid grid-cols-12 gap-4 items-center"
    >
      <div className="col-span-2 md:col-span-1">
        <span className="font-mono text-xs text-[--color-fg-dim] tabular-nums">
          {step.num}
        </span>
      </div>

      <div className="col-span-8 md:col-span-9">
        <div
          className={`font-mono text-[11px] uppercase tracking-[0.18em] mb-1 transition-colors duration-500 ${
            isHuman
              ? "text-[--color-accent]"
              : status === "done"
                ? "text-[--color-fg-muted]"
                : status === "active"
                  ? "text-[--color-accent]"
                  : "text-[--color-fg-dim]"
          }`}
        >
          {isHuman ? step.label : `${agentPrefix} · ${step.label}`}
        </div>
        <div
          className={`text-[13px] md:text-[14px] transition-colors duration-500 ${
            status === "pending"
              ? "text-[--color-fg-dim]"
              : "text-[--color-fg]"
          }`}
        >
          {step.detail}
        </div>
      </div>

      <div className="col-span-2 flex justify-end">
        <StatusIndicator status={status} />
      </div>
    </motion.div>
  );
}

function StatusIndicator({
  status,
}: {
  status: "pending" | "active" | "done";
}) {
  if (status === "done") {
    return (
      <motion.svg
        initial={{ scale: 0.6, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.4, ease }}
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
      >
        <path
          d="M3 8.5L6.5 12L13 4.5"
          stroke="var(--color-accent)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </motion.svg>
    );
  }
  if (status === "active") {
    return (
      <div className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full rounded-full bg-[--color-accent] opacity-70 animate-ping" />
        <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[--color-accent]" />
      </div>
    );
  }
  return (
    <span className="block w-2 h-2 rounded-full border border-[--color-line-strong]" />
  );
}

function Field({
  label,
  name,
  type = "text",
  value,
  onChange,
  required,
}: {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim] mb-3"
      >
        {label}
        {required && <span className="text-[--color-accent] ml-1">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-[--color-line-strong] focus:border-[--color-accent] focus:outline-none py-3 text-[--color-fg] text-[15px] transition-colors duration-300"
      />
    </div>
  );
}

function Select({
  label,
  name,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: readonly string[];
  placeholder: string;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim] mb-3"
      >
        {label}
        <span className="text-[--color-accent] ml-1">*</span>
      </label>
      <select
        id={name}
        name={name}
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full bg-transparent border-b border-[--color-line-strong] focus:border-[--color-accent] focus:outline-none py-3 text-[--color-fg] text-[15px] transition-colors duration-300 appearance-none cursor-pointer"
      >
        <option value="" disabled className="bg-[--color-bg-card]">
          {placeholder}
        </option>
        {options.map((o) => (
          <option
            key={o}
            value={o}
            className="bg-[--color-bg-card] text-[--color-fg]"
          >
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
