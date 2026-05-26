"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

const COPY = {
  en: {
    name: "Name",
    email: "Email",
    company: "Company",
    message: "Message",
    submit: "Send Message",
    sending: "Sending\u2026",
    success: "Thank you. We\u2019ll be in touch soon.",
    error: "Something went wrong. Please try again.",
  },
  es: {
    name: "Nombre",
    email: "Correo electr\u00F3nico",
    company: "Empresa",
    message: "Mensaje",
    submit: "Enviar mensaje",
    sending: "Enviando\u2026",
    success: "Gracias. Nos pondremos en contacto pronto.",
    error: "Algo sali\u00F3 mal. Int\u00E9ntalo de nuevo.",
  },
} as const;

const ease = [0.16, 1, 0.3, 1] as const;

export default function ContactForm({ lang = "en" }: { lang?: "en" | "es" }) {
  const t = COPY[lang];
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: "",
  });

  function updateField(field: keyof typeof formData, value: string) {
    setFormData((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, lang }),
      });

      if (res.ok) {
        setStatus("success");
        setFormData({ name: "", email: "", company: "", message: "" });
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease }}
        className="flex items-start py-8"
      >
        <p className="text-lg text-[var(--color-accent)]">{t.success}</p>
      </motion.div>
    );
  }

  const inputClass =
    "w-full bg-transparent border-b border-[var(--color-line)] py-3 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-dim)] outline-none focus:border-[var(--color-accent)] transition-colors duration-300";

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease }}
      className="space-y-8"
    >
      <div>
        <label htmlFor="contact-name" className="block text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-2">
          {t.name} *
        </label>
        <input
          id="contact-name"
          type="text"
          required
          value={formData.name}
          onChange={(e) => updateField("name", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-email" className="block text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-2">
          {t.email} *
        </label>
        <input
          id="contact-email"
          type="email"
          required
          value={formData.email}
          onChange={(e) => updateField("email", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-company" className="block text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-2">
          {t.company}
        </label>
        <input
          id="contact-company"
          type="text"
          value={formData.company}
          onChange={(e) => updateField("company", e.target.value)}
          className={inputClass}
        />
      </div>

      <div>
        <label htmlFor="contact-message" className="block text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-2">
          {t.message} *
        </label>
        <textarea
          id="contact-message"
          required
          rows={5}
          value={formData.message}
          onChange={(e) => updateField("message", e.target.value)}
          className={`${inputClass} resize-none`}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600">{t.error}</p>
      )}

      <button
        type="submit"
        disabled={status === "loading"}
        className="bg-[var(--color-accent)] text-white text-sm px-8 py-3 hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
      >
        {status === "loading" ? t.sending : t.submit}
      </button>
    </motion.form>
  );
}
