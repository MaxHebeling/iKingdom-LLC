"use client";

import { useState, type FormEvent } from "react";
import { motion } from "framer-motion";

const COPY = {
  en: {
    label: "Stay informed",
    sublabel: "AI operations insights, delivered monthly.",
    placeholder: "your@email.com",
    button: "Subscribe",
    success: "You\u2019re in.",
    error: "Something went wrong. Try again.",
  },
  es: {
    label: "Mantente informado",
    sublabel: "Perspectivas de operaciones de IA, cada mes.",
    placeholder: "tu@correo.com",
    button: "Suscribirse",
    success: "Est\u00E1s dentro.",
    error: "Algo sali\u00F3 mal. Int\u00E9ntalo de nuevo.",
  },
} as const;

export default function NewsletterSignup({ lang = "en" }: { lang?: "en" | "es" }) {
  const t = COPY[lang];
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  return (
    <section className="border-t border-[var(--color-line)] py-16 md:py-20 px-6 md:px-10 max-w-[1400px] mx-auto">
      <motion.div
        className="max-w-xl"
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-60px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-2">
          {t.label}
        </p>
        <p className="text-sm text-[var(--color-fg-muted)] mb-6">
          {t.sublabel}
        </p>

        {status === "success" ? (
          <p className="text-sm text-[var(--color-accent)] font-medium">
            {t.success}
          </p>
        ) : (
          <form onSubmit={handleSubmit} className="flex items-end gap-3">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.placeholder}
              required
              className="flex-1 bg-transparent border-b border-[var(--color-line)] py-2 text-sm text-[var(--color-fg)] placeholder:text-[var(--color-fg-dim)] outline-none focus:border-[var(--color-accent)] transition-colors duration-300"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="shrink-0 bg-[var(--color-accent)] text-white text-sm px-5 py-2 hover:opacity-90 transition-opacity duration-300 disabled:opacity-50"
            >
              {t.button}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="mt-3 text-sm text-red-600">{t.error}</p>
        )}
      </motion.div>
    </section>
  );
}
