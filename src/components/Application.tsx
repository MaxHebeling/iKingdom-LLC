"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";

const ease = [0.16, 1, 0.3, 1] as const;

type PipelineStep = {
  num: string;
  label: string;
  detail: string;
  duration: number;
};

const PIPELINE: PipelineStep[] = [
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
];

const requirements = [
  "An existing operating business with verifiable revenue",
  "Authority to make a strategic, multi-year operational decision",
  "Willingness to commit to a 12-month, four-phase deployment",
  "Investment readiness starting at $35,000",
];

type InvestmentTier = {
  id: string;
  price: string;
  name: string;
  description: string;
};

const INVESTMENT_TIERS: InvestmentTier[] = [
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
];

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

export default function Application() {
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!formData.investment) return;
    // Local-only for now — wire to backend later
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
  }, [submitted]);

  return (
    <section
      id="apply"
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
            06 — Application
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
              We work with{" "}
              <span className="italic text-[--color-accent]">a few</span>{" "}
              companies a year.
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease, delay: 0.2 }}
              className="mt-10 space-y-6 text-[--color-fg-muted] text-base md:text-[17px] leading-relaxed"
            >
              <p>
                iKingdom is not for everyone. Most companies that apply are
                not selected. We deploy a small number of full-stack systems
                each year because each one demands our presence for twelve
                months. If you&rsquo;re ready to commit to a strategic,
                multi-year operational decision, we want to hear from you.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 1.2, ease, delay: 0.35 }}
              className="mt-12"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim] mb-6">
                Minimum criteria
              </p>
              <ul className="space-y-4">
                {requirements.map((r) => (
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
              <SubmittedPipeline activeStep={activeStep} />
            ) : (
              <div className="border border-[--color-line-strong] p-8 md:p-12 bg-[--color-bg-card]">
                <StepHeader step={step} />

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
                      <StepIntro>
                        We start with you. Every iKingdom engagement begins
                        with a single principal who has the authority to
                        commit. Tell us who you are.
                      </StepIntro>

                      <div className="grid md:grid-cols-2 gap-8">
                        <Field
                          label="Full name"
                          name="name"
                          value={formData.name}
                          onChange={(v) => update("name", v)}
                          required
                        />
                        <Field
                          label="Title / role"
                          name="title"
                          value={formData.title}
                          onChange={(v) => update("title", v)}
                          required
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <Field
                          label="Email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={(v) => update("email", v)}
                          required
                        />
                        <Field
                          label="Phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(v) => update("phone", v)}
                          required
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-6 pt-6">
                        <p className="text-xs text-[--color-fg-dim] max-w-xs leading-relaxed">
                          Step 1 of 3 · About you. Takes about 90 seconds.
                        </p>
                        <PrimaryButton label="Continue" />
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
                      <StepIntro>
                        Now your business. We design the system around your
                        operations, your verticals, and the scale you operate
                        at. Help us understand what we&rsquo;d be working with.
                      </StepIntro>

                      <div className="grid md:grid-cols-2 gap-8">
                        <Field
                          label="Company"
                          name="company"
                          value={formData.company}
                          onChange={(v) => update("company", v)}
                          required
                        />
                        <Field
                          label="Website"
                          name="website"
                          type="url"
                          value={formData.website}
                          onChange={(v) => update("website", v)}
                        />
                      </div>

                      <div className="grid md:grid-cols-2 gap-8">
                        <Field
                          label="Industry / sector"
                          name="industry"
                          value={formData.industry}
                          onChange={(v) => update("industry", v)}
                          required
                        />
                        <Select
                          label="Annual revenue"
                          name="revenue"
                          value={formData.revenue}
                          onChange={(v) => update("revenue", v)}
                          options={[
                            "Under $1M",
                            "$1M – $5M",
                            "$5M – $25M",
                            "$25M – $100M",
                            "$100M+",
                          ]}
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-6 pt-6">
                        <BackButton onClick={() => handleBackTo(1)} />
                        <PrimaryButton label="Continue" />
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
                      <StepIntro>
                        iKingdom engagements are not subscriptions.
                        They&rsquo;re single, decisive commitments to install
                        a system. Tell us what you&rsquo;re prepared to commit
                        and what you want us to take over.
                      </StepIntro>

                      <div>
                        <p className="block text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim] mb-4">
                          Investment readiness
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
                          What do you want automated?
                          <span className="text-[--color-accent] ml-1">*</span>
                        </label>
                        <textarea
                          id="scope"
                          name="scope"
                          rows={5}
                          required
                          value={formData.scope}
                          onChange={(e) => update("scope", e.target.value)}
                          placeholder="Briefly describe the operations you want iKingdom to take over."
                          className="w-full bg-transparent border border-[--color-line-strong] focus:border-[--color-accent] focus:outline-none px-4 py-3 text-[--color-fg] placeholder:text-[--color-fg-dim] text-[15px] resize-none transition-colors duration-300"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-6 pt-6">
                        <BackButton onClick={() => handleBackTo(2)} />
                        <button
                          type="submit"
                          disabled={!formData.investment}
                          className="group inline-flex items-center gap-3 px-7 py-4 bg-[--color-fg] text-[--color-bg] text-sm tracking-wide hover:bg-[--color-fg-muted] transition-all duration-500 rounded-full disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                          Submit Application
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

function BackButton({ onClick }: { onClick: () => void }) {
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
      Back
    </button>
  );
}

function StepHeader({ step }: { step: Step }) {
  const label =
    step === 1
      ? "About you"
      : step === 2
        ? "About your business"
        : "Investment & scope";

  const progress = step === 1 ? "33%" : step === 2 ? "66%" : "100%";

  return (
    <div className="border-b border-[--color-line] pb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-accent]">
            Step {step} of 3
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-fg-dim]">
            · {label}
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[--color-fg-dim]">
          ~90 seconds
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

function SubmittedPipeline({ activeStep }: { activeStep: number }) {
  const allDone = activeStep >= PIPELINE.length - 1;

  return (
    <div className="border border-[--color-line-strong] p-8 md:p-12 bg-[--color-bg-card]">
      <div className="flex items-center gap-3 mb-2">
        <span className="relative flex h-2 w-2">
          <span className="absolute inline-flex h-full w-full rounded-full bg-[--color-accent] opacity-60 animate-ping" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-[--color-accent]" />
        </span>
        <p className="text-[11px] uppercase tracking-[0.22em] text-[--color-accent]">
          Live · Application in pipeline
        </p>
      </div>

      <h3 className="font-display text-3xl md:text-5xl leading-[1.05] tracking-[-0.015em] mt-4">
        Watch your lead{" "}
        <span className="italic text-[--color-fg-muted]">
          enter the system.
        </span>
      </h3>

      <p className="mt-5 text-sm text-[--color-fg-muted] max-w-md leading-relaxed">
        Every step you see below is being executed by an iKingdom agent in
        real time. This is the same flow we install inside our clients&rsquo;
        businesses.
      </p>

      <div className="mt-12 space-y-px bg-[--color-line-strong]">
        {PIPELINE.map((step, i) => {
          const status =
            i < activeStep ? "done" : i === activeStep ? "active" : "pending";
          return (
            <PipelineRow
              key={step.num + step.label}
              step={step}
              status={status}
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
              Next step
            </p>
            <p className="font-display text-2xl md:text-3xl leading-tight tracking-[-0.015em]">
              A senior partner will reach out personally to schedule a
              private discovery Zoom.
            </p>
            <p className="mt-4 text-sm text-[--color-fg-muted] leading-relaxed">
              You will receive a calendar invitation within five business
              days. Until then, the system has it.
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
}: {
  step: PipelineStep;
  status: "pending" | "active" | "done";
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
          {isHuman ? step.label : `Agent · ${step.label}`}
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
}: {
  label: string;
  name: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
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
          Select…
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
