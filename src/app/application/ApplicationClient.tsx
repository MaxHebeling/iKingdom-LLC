"use client";

import { useState, useTransition, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { getSections, ALL_FIELDS, type FieldDef, type Lang } from "./form-config";
import { COUNTRIES, DEFAULT_COUNTRY } from "./countries";

type FieldValue = string | string[] | boolean | undefined;
type FormState = Record<string, FieldValue>;

const INITIAL: FormState = ALL_FIELDS.reduce<FormState>((acc, f) => {
  if (f.type === "multiselect") acc[f.name] = [];
  else if (f.type === "checkbox") acc[f.name] = false;
  else acc[f.name] = "";
  return acc;
}, {});

const COPY = {
  en: {
    requiredError: "Required",
    emailInvalidError: "Invalid email",
    submitError: "We couldn't submit your application.",
    networkError: "Network error.",
    successTitle: "Application received",
    successBody:
      "We've received your application. Our team will review it to evaluate your case and prepare a possible proposal. We'll be in touch soon.",
    stepLabel: (current: number, total: number) => `Step ${current} of ${total}`,
    previous: "Previous",
    next: "Next",
    submitting: "Submitting…",
    submitApplication: "Submit application",
    selectPlaceholder: "Select…",
    selectCountryPlaceholder: "Select a country…",
    countryCodeLabel: "Country code",
    phoneNumberPlaceholder: "Number",
  },
  es: {
    requiredError: "Requerido",
    emailInvalidError: "Email no válido",
    submitError: "No pudimos enviar tu aplicación.",
    networkError: "Error de red.",
    successTitle: "Aplicación recibida",
    successBody:
      "Hemos recibido tu aplicación. Nuestro equipo la revisará para evaluar tu caso y preparar una posible propuesta. Te contactaremos pronto.",
    stepLabel: (current: number, total: number) => `Paso ${current} de ${total}`,
    previous: "Anterior",
    next: "Siguiente",
    submitting: "Enviando…",
    submitApplication: "Enviar aplicación",
    selectPlaceholder: "Selecciona…",
    selectCountryPlaceholder: "Selecciona un país…",
    countryCodeLabel: "Código de país",
    phoneNumberPlaceholder: "Número",
  },
} as const;

// ── Apple-inspired tokens ────────────────────────────────────────────────────
const C = {
  text:        "#1d1d1f",
  textSoft:    "#424245",
  textMuted:   "#6e6e73",
  textFaint:   "#86868b",
  border:      "#d2d2d7",
  borderSoft:  "#e5e5ea",
  surface:     "#ffffff",
  surfaceAlt:  "#f5f5f7",
  blue:        "#0071e3",
  blueHover:   "#0077ed",
  bluePill:    "#e8f0fe",
  danger:      "#ff3b30",
  dangerSoft:  "#fff5f5",
} as const;

const inputBase: React.CSSProperties = {
  width: "100%",
  background: C.surface,
  borderWidth: 1,
  borderStyle: "solid",
  borderColor: C.border,
  borderRadius: 12,
  padding: "12px 14px",
  fontSize: 15,
  color: C.text,
  outline: "none",
  transition: "border-color 0.15s ease, box-shadow 0.15s ease",
  fontFamily: "inherit",
};

const inputFocus: React.CSSProperties = {
  borderColor: C.blue,
  boxShadow: `0 0 0 4px rgba(0,113,227,0.12)`,
};

// ─────────────────────────────────────────────────────────────────────────────
export default function ApplicationClient({ lang = "es" }: { lang?: Lang }) {
  const t = COPY[lang];
  const SECTIONS = useMemo(() => getSections(lang), [lang]);

  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormState>(INITIAL);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const total = SECTIONS.length;
  const section = SECTIONS[step]!;
  const progress = ((step + 1) / total) * 100;

  const set = (name: string, value: FieldValue) => {
    setValues((v) => ({ ...v, [name]: value }));
    if (errors[name]) setErrors((e) => ({ ...e, [name]: "" }));
  };

  const validateSection = (): boolean => {
    const next: Record<string, string> = {};
    for (const f of section.fields) {
      if (!f.required) continue;
      const v = values[f.name];
      if (f.type === "checkbox") {
        if (v !== true) next[f.name] = t.requiredError;
      } else if (Array.isArray(v)) {
        if (v.length === 0) next[f.name] = t.requiredError;
      } else if (!v || (typeof v === "string" && v.trim().length === 0)) {
        next[f.name] = t.requiredError;
      } else if (f.type === "email" && typeof v === "string") {
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) next[f.name] = t.emailInvalidError;
      }
    }
    setErrors((e) => ({ ...e, ...next }));
    return Object.keys(next).length === 0;
  };

  const goNext = () => {
    if (!validateSection()) return;
    setStep((s) => Math.min(s + 1, total - 1));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goPrev = () => {
    setStep((s) => Math.max(s - 1, 0));
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const submit = () => {
    if (!validateSection()) return;
    setFormError(null);
    startTransition(async () => {
      const payload: Record<string, unknown> = { lang };
      for (const [k, v] of Object.entries(values)) {
        if (typeof v === "string") payload[k] = v.trim();
        else payload[k] = v;
      }
      try {
        const res = await fetch("/api/client-application", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) {
          setFormError(json.error || t.submitError);
          return;
        }
        setSubmittedId(json.id || "ok");
        if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
      } catch (err) {
        setFormError(err instanceof Error ? err.message : t.networkError);
      }
    });
  };

  // ── Success state ─────────────────────────────────────────────────────────
  if (submittedId) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center py-12"
      >
        <div
          className="mx-auto h-16 w-16 rounded-full flex items-center justify-center text-2xl"
          style={{ background: C.bluePill, color: C.blue }}
        >
          ✓
        </div>
        <h2 className="mt-8 text-[32px] md:text-[40px] font-semibold tracking-[-0.02em]" style={{ color: C.text }}>
          {t.successTitle}
        </h2>
        <p
          className="mt-4 max-w-xl mx-auto text-[17px] leading-[1.5]"
          style={{ color: C.textMuted }}
        >
          {t.successBody}
        </p>
      </motion.div>
    );
  }

  // ── Form ──────────────────────────────────────────────────────────────────
  return (
    <div className="space-y-10">
      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[12px] font-medium" style={{ color: C.textFaint }}>
          <span>{t.stepLabel(step + 1, total)}</span>
          <span style={{ color: C.textSoft }}>{section.label}</span>
        </div>
        <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: C.surfaceAlt }}>
          <motion.div
            className="h-full rounded-full"
            style={{ background: C.blue }}
            initial={false}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Section header */}
      <AnimatePresence mode="wait">
        <motion.header
          key={section.id + "-header"}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -4 }}
          transition={{ duration: 0.3 }}
          className="space-y-2"
        >
          <h2 className="text-[28px] md:text-[34px] font-semibold tracking-[-0.02em]" style={{ color: C.text }}>
            {section.title}
          </h2>
          <p className="text-[15px] md:text-[16px] leading-[1.5]" style={{ color: C.textMuted }}>
            {section.subtitle}
          </p>
        </motion.header>
      </AnimatePresence>

      {/* Fields */}
      <AnimatePresence mode="wait">
        <motion.div
          key={section.id + "-fields"}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-x-5 gap-y-5"
        >
          {section.fields.map((f) => (
            <Field
              key={f.name}
              field={f}
              value={values[f.name]}
              error={errors[f.name]}
              onChange={(v) => set(f.name, v)}
              copy={t}
            />
          ))}
        </motion.div>
      </AnimatePresence>

      {formError ? (
        <div
          className="rounded-xl px-4 py-3 text-[14px]"
          style={{ background: C.dangerSoft, color: C.danger, border: `1px solid ${C.danger}33` }}
        >
          {formError}
        </div>
      ) : null}

      {/* Navigation */}
      <div className="flex items-center justify-between gap-4 pt-6" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
        <button
          type="button"
          onClick={goPrev}
          disabled={step === 0 || pending}
          className="text-[15px] font-medium px-5 py-3 rounded-full transition disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ color: C.textSoft, background: "transparent" }}
        >
          ← {t.previous}
        </button>

        {step < total - 1 ? (
          <button
            type="button"
            onClick={goNext}
            className="text-[15px] font-medium px-7 py-3 rounded-full transition-transform active:scale-[0.98]"
            style={{ background: C.blue, color: "#fff" }}
          >
            {t.next}
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="text-[15px] font-semibold px-7 py-3 rounded-full transition-transform active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed"
            style={{ background: C.blue, color: "#fff" }}
          >
            {pending ? t.submitting : t.submitApplication}
          </button>
        )}
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Field renderer
// ─────────────────────────────────────────────────────────────────────────────

type FieldCopy = (typeof COPY)[Lang];

function Field({
  field,
  value,
  error,
  onChange,
  copy,
}: {
  field: FieldDef;
  value: FieldValue;
  error?: string;
  onChange: (v: FieldValue) => void;
  copy: FieldCopy;
}) {
  const colSpan = field.span === 2 ? "md:col-span-2" : "md:col-span-1";
  const [focused, setFocused] = useState(false);

  if (field.type === "checkbox") {
    const checked = value === true;
    return (
      <label
        className={`${colSpan} flex items-start gap-3 cursor-pointer rounded-2xl px-5 py-4 transition`}
        style={{
          background: checked ? C.bluePill : C.surfaceAlt,
          border: `1px solid ${error ? C.danger : checked ? C.blue : "transparent"}`,
        }}
      >
        <span
          className="mt-0.5 inline-flex items-center justify-center rounded-md shrink-0"
          style={{
            width: 22,
            height: 22,
            background: checked ? C.blue : C.surface,
            border: `1.5px solid ${checked ? C.blue : C.border}`,
            color: "#fff",
            fontSize: 13,
            fontWeight: 700,
          }}
        >
          {checked ? "✓" : ""}
        </span>
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="sr-only"
        />
        <span className="text-[14px] leading-[1.45]" style={{ color: C.text }}>
          {field.label}
          {field.required ? <span style={{ color: C.blue }}> *</span> : null}
        </span>
      </label>
    );
  }

  const styleFor = focused ? { ...inputBase, ...inputFocus } : inputBase;
  const styleErr = error ? { ...styleFor, borderColor: C.danger, boxShadow: `0 0 0 4px ${C.danger}22` } : styleFor;

  return (
    <div className={`${colSpan} space-y-2`}>
      <label className="flex items-center justify-between gap-3">
        <span className="text-[13px] font-medium" style={{ color: C.textSoft }}>
          {field.label}
          {field.required ? <span style={{ color: C.blue }}> *</span> : null}
        </span>
        {error ? (
          <span className="text-[12px]" style={{ color: C.danger }}>
            {error}
          </span>
        ) : null}
      </label>

      {field.type === "textarea" ? (
        <textarea
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={field.placeholder}
          rows={field.rows ?? 3}
          style={{ ...styleErr, resize: "none" }}
        />
      ) : field.type === "select" ? (
        <select
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...styleErr, appearance: "none", cursor: "pointer", color: value ? C.text : C.textFaint }}
        >
          <option value="">{copy.selectPlaceholder}</option>
          {field.options?.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      ) : field.type === "country" ? (
        <select
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{ ...styleErr, appearance: "none", cursor: "pointer", color: value ? C.text : C.textFaint }}
        >
          <option value="">{copy.selectCountryPlaceholder}</option>
          {COUNTRIES.map((c) => (
            <option key={c.iso2} value={c.name}>
              {c.name}
            </option>
          ))}
        </select>
      ) : field.type === "phone-intl" ? (
        <PhoneIntl
          value={(value as string) ?? ""}
          onChange={(v) => onChange(v)}
          baseStyle={styleErr}
          focused={focused}
          setFocused={setFocused}
          placeholder={field.placeholder ?? copy.phoneNumberPlaceholder}
          countryCodeLabel={copy.countryCodeLabel}
        />
      ) : field.type === "multiselect" ? (
        <MultiSelect
          options={field.options ?? []}
          value={(value as string[]) ?? []}
          onChange={(next) => onChange(next)}
        />
      ) : (
        <input
          type={field.type === "tel" ? "tel" : field.type === "email" ? "email" : field.type === "url" ? "url" : "text"}
          value={(value as string) ?? ""}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder={field.placeholder}
          style={styleErr}
        />
      )}

      {field.hint ? (
        <p className="text-[12px]" style={{ color: C.textFaint }}>
          {field.hint}
        </p>
      ) : null}
    </div>
  );
}

function PhoneIntl({
  value,
  onChange,
  baseStyle,
  focused,
  setFocused,
  placeholder,
  countryCodeLabel,
}: {
  value: string;
  onChange: (v: string) => void;
  baseStyle: React.CSSProperties;
  focused: boolean;
  setFocused: (f: boolean) => void;
  placeholder?: string;
  countryCodeLabel: string;
}) {
  // Parse "+<dial> <number>" — default to MX if empty.
  const parsed = (() => {
    const m = value.match(/^(\+\d{1,4})\s?(.*)$/);
    if (m) return { dial: m[1]!, number: m[2] ?? "" };
    return { dial: DEFAULT_COUNTRY.value.split("|")[0]!, number: value };
  })();

  const update = (dial: string, number: string) => {
    const cleaned = number.replace(/[^\d\s\-()]/g, "");
    onChange(`${dial}${cleaned ? ` ${cleaned}` : ""}`);
  };

  // Silence unused-var TS warning while keeping the hook signature stable.
  void focused;

  return (
    <div
      style={{
        ...baseStyle,
        padding: 0,
        display: "flex",
        alignItems: "stretch",
        overflow: "hidden",
      }}
    >
      <select
        value={parsed.dial}
        onChange={(e) => update(e.target.value, parsed.number)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        aria-label={countryCodeLabel}
        style={{
          appearance: "none",
          background: C.surfaceAlt,
          border: "none",
          borderRight: `1px solid ${C.borderSoft}`,
          padding: "12px 12px",
          fontSize: 15,
          color: C.text,
          cursor: "pointer",
          fontFamily: "inherit",
          maxWidth: 130,
        }}
      >
        {COUNTRIES.map((c) => (
          <option key={c.iso2 + c.dial} value={c.dial}>
            {c.name} ({c.dial})
          </option>
        ))}
      </select>
      <input
        type="tel"
        value={parsed.number}
        onChange={(e) => update(parsed.dial, e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        placeholder={placeholder}
        inputMode="tel"
        style={{
          flex: 1,
          background: "transparent",
          border: "none",
          outline: "none",
          padding: "12px 14px",
          fontSize: 15,
          color: C.text,
          fontFamily: "inherit",
        }}
      />
    </div>
  );
}

function MultiSelect({
  options,
  value,
  onChange,
}: {
  options: { value: string; label: string }[];
  value: string[];
  onChange: (next: string[]) => void;
}) {
  const toggle = (v: string) => {
    if (value.includes(v)) onChange(value.filter((x) => x !== v));
    else onChange([...value, v]);
  };
  return (
    <div className="flex flex-wrap gap-2 pt-1">
      {options.map((opt) => {
        const active = value.includes(opt.value);
        return (
          <button
            key={opt.value}
            type="button"
            onClick={() => toggle(opt.value)}
            className="text-[13px] font-medium px-4 py-2 rounded-full transition active:scale-[0.97]"
            style={{
              background: active ? C.blue : C.surfaceAlt,
              color: active ? "#fff" : C.textSoft,
              border: `1px solid ${active ? C.blue : "transparent"}`,
            }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}
