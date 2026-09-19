"use client";

import { useEffect, useMemo, useRef, useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Field, type FieldCopy } from "@/app/application/ApplicationClient";
import { INTAKE_FORMS, allFields, type IntakeFormKey } from "./forms";

type FieldValue = string | string[] | boolean | undefined;
type FormState = Record<string, FieldValue>;

const C = {
  text: "#1d1d1f",
  textSoft: "#424245",
  textMuted: "#6e6e73",
  textFaint: "#86868b",
  borderSoft: "#e5e5ea",
  surfaceAlt: "#f5f5f7",
  blue: "#0071e3",
  bluePill: "#e8f0fe",
  danger: "#ff3b30",
  dangerSoft: "#fff5f5",
} as const;

const FIELD_COPY: FieldCopy = {
  selectPlaceholder: "Selecciona…",
  selectCountryPlaceholder: "Selecciona un país…",
  countryCodeLabel: "Código de país",
  phoneNumberPlaceholder: "Número",
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const draftKey = (k: IntakeFormKey) => `ikingdom-intake-${k}-v1`;

export default function IntakeClient({
  formKey,
  nextHref,
  nextLabel,
}: {
  formKey: IntakeFormKey;
  nextHref?: string;
  nextLabel?: string;
}) {
  const form = INTAKE_FORMS[formKey];
  const SECTIONS = form.sections;
  const initial = useMemo<FormState>(
    () =>
      allFields(form).reduce<FormState>((acc, f) => {
        if (f.type === "multiselect") acc[f.name] = [];
        else if (f.type === "checkbox") acc[f.name] = false;
        else acc[f.name] = "";
        return acc;
      }, {}),
    [form],
  );

  const [step, setStep] = useState(0);
  const [values, setValues] = useState<FormState>(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const [restored, setRestored] = useState(false);
  const [pending, startTransition] = useTransition();
  const loaded = useRef(false);

  // Restore draft (per-viewer convenience; safe if storage is unavailable).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(draftKey(formKey));
      if (raw) {
        const d = JSON.parse(raw) as { values?: FormState; step?: number };
        if (d.values) {
          setValues((v) => ({ ...v, ...d.values }));
          setRestored(true);
        }
        if (typeof d.step === "number") setStep(Math.min(Math.max(d.step, 0), SECTIONS.length - 1));
      }
    } catch {
      /* ignore */
    }
    loaded.current = true;
  }, [formKey, SECTIONS.length]);

  useEffect(() => {
    if (!loaded.current || submitted) return;
    try {
      window.localStorage.setItem(draftKey(formKey), JSON.stringify({ values, step }));
    } catch {
      /* ignore */
    }
  }, [values, step, formKey, submitted]);

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
      const v = values[f.name];
      if (f.type === "email" && typeof v === "string" && v.trim() && !EMAIL_RE.test(v.trim())) {
        next[f.name] = "Email no válido";
        continue;
      }
      if (!f.required) continue;
      if (f.type === "checkbox") {
        if (v !== true) next[f.name] = "Requerido";
      } else if (Array.isArray(v)) {
        if (v.length === 0) next[f.name] = "Requerido";
      } else if (f.type === "phone-intl") {
        if (!v || typeof v !== "string" || !/\d{4,}/.test(v.replace(/^\+\d{1,4}\s?/, "").replace(/\D/g, ""))) next[f.name] = "Requerido";
      } else if (!v || (typeof v === "string" && v.trim().length === 0)) {
        next[f.name] = "Requerido";
      }
    }
    setErrors((e) => ({ ...e, ...next }));
    return Object.keys(next).length === 0;
  };

  const scrollTop = () => {
    if (typeof window !== "undefined") window.scrollTo({ top: 0, behavior: "smooth" });
  };
  const goNext = () => {
    if (!validateSection()) return;
    setStep((s) => Math.min(s + 1, total - 1));
    scrollTop();
  };
  const goPrev = () => {
    setStep((s) => Math.max(s - 1, 0));
    scrollTop();
  };
  const goTo = (i: number) => {
    if (i > step && !validateSection()) return;
    setStep(i);
    scrollTop();
  };

  const submit = () => {
    if (!validateSection()) return;
    setFormError(null);
    startTransition(async () => {
      const answers: Record<string, unknown> = {};
      for (const [k, v] of Object.entries(values)) answers[k] = typeof v === "string" ? v.trim() : v;
      try {
        const res = await fetch("/api/project-intake", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ form: formKey, answers }),
        });
        const json = await res.json().catch(() => ({}));
        if (!res.ok || !json.success) {
          setFormError(json.error || "No pudimos enviar el formulario. Intenta de nuevo.");
          return;
        }
        try {
          window.localStorage.removeItem(draftKey(formKey));
        } catch {
          /* ignore */
        }
        setSubmitted(true);
        scrollTop();
      } catch {
        setFormError("Error de red. Revisa tu conexión e intenta de nuevo.");
      }
    });
  };

  const resetDraft = () => {
    try {
      window.localStorage.removeItem(draftKey(formKey));
    } catch {
      /* ignore */
    }
    setValues(initial);
    setErrors({});
    setStep(0);
    setRestored(false);
  };

  if (submitted) {
    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center py-12">
        <div className="mx-auto h-16 w-16 rounded-full flex items-center justify-center text-2xl" style={{ background: C.bluePill, color: C.blue }}>
          ✓
        </div>
        <h2 className="mt-8 text-[32px] md:text-[40px] font-semibold tracking-[-0.02em]" style={{ color: C.text }}>
          {form.successTitle}
        </h2>
        <p className="mt-4 max-w-xl mx-auto text-[17px] leading-[1.5]" style={{ color: C.textMuted }}>
          {form.successBody}
        </p>
        {nextHref ? (
          <a
            href={nextHref}
            className="inline-block mt-10 text-[15px] font-semibold px-7 py-3 rounded-full"
            style={{ background: C.blue, color: "#fff" }}
          >
            {nextLabel ?? "Continuar"} →
          </a>
        ) : null}
      </motion.div>
    );
  }

  return (
    <div className="space-y-10">
      {restored ? (
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl px-4 py-3 text-[13px]" style={{ background: C.surfaceAlt, color: C.textSoft }}>
          <span>Recuperamos tu avance guardado en este navegador.</span>
          <button type="button" onClick={resetDraft} className="font-medium underline" style={{ color: C.textMuted }}>
            Empezar de cero
          </button>
        </div>
      ) : null}

      {/* Progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-[12px] font-medium" style={{ color: C.textFaint }}>
          <span>
            Paso {step + 1} de {total}
          </span>
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
        <div className="flex flex-wrap gap-1.5 pt-1" aria-label="Secciones">
          {SECTIONS.map((s, i) => (
            <button
              key={s.id}
              type="button"
              onClick={() => goTo(i)}
              disabled={i > step + 1}
              className="text-[11px] font-medium px-2.5 py-1 rounded-full transition disabled:cursor-not-allowed"
              style={{
                background: i === step ? C.blue : i < step ? C.bluePill : C.surfaceAlt,
                color: i === step ? "#fff" : i < step ? C.blue : C.textFaint,
              }}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

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
            <Field key={f.name} field={f} value={values[f.name]} error={errors[f.name]} onChange={(v) => set(f.name, v)} copy={FIELD_COPY} />
          ))}
        </motion.div>
      </AnimatePresence>

      {formError ? (
        <div className="rounded-xl px-4 py-3 text-[14px]" style={{ background: C.dangerSoft, color: C.danger, border: `1px solid ${C.danger}33` }}>
          {formError}
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-4 pt-6" style={{ borderTop: `1px solid ${C.borderSoft}` }}>
        <button
          type="button"
          onClick={goPrev}
          disabled={step === 0 || pending}
          className="text-[15px] font-medium px-5 py-3 rounded-full transition disabled:opacity-30 disabled:cursor-not-allowed"
          style={{ color: C.textSoft }}
        >
          ← Anterior
        </button>
        {step < total - 1 ? (
          <button type="button" onClick={goNext} className="text-[15px] font-medium px-7 py-3 rounded-full active:scale-[0.98]" style={{ background: C.blue, color: "#fff" }}>
            Siguiente
          </button>
        ) : (
          <button
            type="button"
            onClick={submit}
            disabled={pending}
            className="text-[15px] font-semibold px-7 py-3 rounded-full active:scale-[0.98] disabled:opacity-60"
            style={{ background: C.blue, color: "#fff" }}
          >
            {pending ? "Enviando…" : form.submitLabel}
          </button>
        )}
      </div>
    </div>
  );
}
