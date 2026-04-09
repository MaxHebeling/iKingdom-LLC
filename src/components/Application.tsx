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
  "Minimum $100,000 of capital allocated to the engagement",
  "Authority to make a strategic, multi-year operational decision",
  "Willingness to commit to a 12-month, four-phase deployment",
];

type FormData = {
  name: string;
  title: string;
  email: string;
  phone: string;
  company: string;
  website: string;
  revenue: string;
  capital: string;
  scope: string;
};

const EMPTY_FORM: FormData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  company: "",
  website: "",
  revenue: "",
  capital: "",
  scope: "",
};

export default function Application() {
  const [submitted, setSubmitted] = useState(false);
  const [activeStep, setActiveStep] = useState(-1);
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<FormData>(EMPTY_FORM);

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setFormData((prev) => ({ ...prev, [key]: value }));
  }

  function handleNext(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStep(2);
  }

  function handleBack() {
    setStep(1);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
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
      <div className="absolute inset-0 spotlight pointer-events-none" />

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
                months.
              </p>
              <p>
                Engagements begin at <span className="text-[--color-fg]">$100,000</span> and scale into the
                multi-millions depending on the scope of the operational
                takeover. We do not publish a price sheet. We assess fit
                first.
              </p>
              <p className="text-[--color-fg]">
                If you cannot meet the criteria below, this is not the right
                firm for you — and we will tell you so honestly.
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
              <div className="border border-[--color-line] p-8 md:p-12 bg-[--color-bg-elevated]/40 backdrop-blur-sm">
                <StepHeader step={step} />

                <AnimatePresence mode="wait">
                  {step === 1 ? (
                    <motion.form
                      key="step-1"
                      onSubmit={handleNext}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, ease }}
                      className="space-y-8 mt-10"
                    >
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
                          Step 1 of 2 · About you. Takes about 60 seconds.
                        </p>
                        <button
                          type="submit"
                          className="group inline-flex items-center gap-3 px-7 py-4 bg-[--color-accent] text-[--color-bg] text-sm tracking-wide hover:bg-[--color-accent-hover] transition-all duration-500 rounded-full"
                        >
                          Continue
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
                  ) : (
                    <motion.form
                      key="step-2"
                      onSubmit={handleSubmit}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.5, ease }}
                      className="space-y-8 mt-10"
                    >
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
                        <Select
                          label="Capital available"
                          name="capital"
                          value={formData.capital}
                          onChange={(v) => update("capital", v)}
                          options={[
                            "Under $100K (not a fit)",
                            "$100K – $250K",
                            "$250K – $1M",
                            "$1M – $5M",
                            "$5M+",
                          ]}
                        />
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
                          className="w-full bg-transparent border border-[--color-line] focus:border-[--color-accent] focus:outline-none px-4 py-3 text-[--color-fg] placeholder:text-[--color-fg-dim] text-[15px] resize-none transition-colors duration-300"
                        />
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-6 pt-6">
                        <button
                          type="button"
                          onClick={handleBack}
                          className="text-sm text-[--color-fg-muted] hover:text-[--color-fg] transition-colors duration-300 inline-flex items-center gap-2"
                        >
                          <svg
                            width="14"
                            height="14"
                            viewBox="0 0 14 14"
                            fill="none"
                          >
                            <path
                              d="M13 7H1M1 7L6.5 1.5M1 7L6.5 12.5"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                          Back
                        </button>
                        <button
                          type="submit"
                          className="group inline-flex items-center gap-3 px-7 py-4 bg-[--color-accent] text-[--color-bg] text-sm tracking-wide hover:bg-[--color-accent-hover] transition-all duration-500 rounded-full"
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

function StepHeader({ step }: { step: 1 | 2 }) {
  const label = step === 1 ? "About you" : "About your business";

  return (
    <div className="border-b border-[--color-line] pb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-accent]">
            Step {step} of 2
          </span>
          <span className="font-mono text-[10px] uppercase tracking-[0.22em] text-[--color-fg-dim]">
            · {label}
          </span>
        </div>
        <span className="font-mono text-[9px] uppercase tracking-[0.18em] text-[--color-fg-dim]">
          ~60 seconds
        </span>
      </div>

      {/* Progress bar */}
      <div className="h-px bg-[--color-line] overflow-hidden">
        <motion.div
          animate={{ width: step === 1 ? "50%" : "100%" }}
          transition={{ duration: 0.6, ease }}
          className="h-full bg-[--color-accent]"
          style={{
            boxShadow: "0 0 10px var(--color-accent)",
          }}
        />
      </div>
    </div>
  );
}

function SubmittedPipeline({ activeStep }: { activeStep: number }) {
  const allDone = activeStep >= PIPELINE.length - 1;

  return (
    <div className="border border-[--color-line] p-8 md:p-12 bg-[--color-bg-elevated]/40 backdrop-blur-sm">
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
        real time. This is the same flow we install inside our clients'
        businesses.
      </p>

      <div className="mt-12 space-y-px bg-[--color-line]">
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
      className="bg-[--color-bg] py-5 px-1 grid grid-cols-12 gap-4 items-center"
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
        className="w-full bg-transparent border-b border-[--color-line] focus:border-[--color-accent] focus:outline-none py-3 text-[--color-fg] text-[15px] transition-colors duration-300"
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
        className="w-full bg-transparent border-b border-[--color-line] focus:border-[--color-accent] focus:outline-none py-3 text-[--color-fg] text-[15px] transition-colors duration-300 appearance-none cursor-pointer"
      >
        <option value="" disabled className="bg-[--color-bg]">
          Select…
        </option>
        {options.map((o) => (
          <option key={o} value={o} className="bg-[--color-bg] text-[--color-fg]">
            {o}
          </option>
        ))}
      </select>
    </div>
  );
}
