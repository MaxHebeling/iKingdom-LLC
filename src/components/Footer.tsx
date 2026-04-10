"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const ease = [0.16, 1, 0.3, 1] as const;

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: React.ReactNode;
}) {
  return (
    <motion.a
      href={href}
      className="relative inline-block hover:text-[--color-fg] transition-colors duration-300"
      whileHover="hover"
    >
      {children}
      <motion.span
        className="absolute -bottom-0.5 left-0 h-px bg-[--color-accent]"
        variants={{ hover: { width: "100%" } }}
        initial={{ width: "0%" }}
        transition={{ duration: 0.4, ease }}
      />
    </motion.a>
  );
}

const COPY = {
  en: {
    tagline:
      "The world's first AI operations firm. Designing and deploying autonomous companies for those building what comes next.",
    firmHeader: "The firm",
    method: "Method",
    proof: "Proof",
    process: "Process",
    apply: "Apply",
    contactHeader: "Contact",
    byApplication: "By application only",
    location: "San Diego, CA",
    rights: (year: number) => `\u00A9 ${year} iKingdom LLC. All rights reserved.`,
    established:
      "Established \u00B7 The world\u2019s first AI operations firm \u00B7 San Diego, CA",
  },
  es: {
    tagline:
      "La primera firma de operaciones de IA del mundo. Dise\u00F1ando y desplegando compa\u00F1\u00EDas aut\u00F3nomas para quienes construyen lo que viene.",
    firmHeader: "La firma",
    method: "M\u00E9todo",
    proof: "Pruebas",
    process: "Proceso",
    apply: "Solicitar",
    contactHeader: "Contacto",
    byApplication: "Solo por solicitud",
    location: "San Diego, CA",
    rights: (year: number) =>
      `\u00A9 ${year} iKingdom LLC. Todos los derechos reservados.`,
    established:
      "Establecido \u00B7 La primera firma de operaciones de IA del mundo \u00B7 San Diego, CA",
  },
} as const;

export default function Footer({ lang = "en" }: { lang?: "en" | "es" }) {
  const year = new Date().getFullYear();
  const t = COPY[lang];
  return (
    <footer className="relative border-t border-[--color-line] pt-16 md:pt-20 pb-28 md:pb-32" role="contentinfo">
      <div className="max-w-[1400px] mx-auto px-6 md:px-10">
        <div className="grid md:grid-cols-12 gap-12">
          <motion.div
            className="md:col-span-5"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease }}
          >
            <Image
              src="/ikingdom-logo.png"
              alt="iKingdom — The world's first AI operations firm deploying autonomous AI agents for business automation"
              width={220}
              height={56}
              className="h-10 md:h-12 w-auto"
              loading="lazy"
            />
            <p className="mt-4 text-sm text-[--color-fg-muted] max-w-sm leading-relaxed">
              {t.tagline}
            </p>
          </motion.div>

          <motion.div
            className="md:col-span-3"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease, delay: 0.1 }}
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim] mb-5">
              {t.firmHeader}
            </p>
            <ul className="space-y-3 text-sm text-[--color-fg-muted]">
              <li>
                <FooterLink href="#method">{t.method}</FooterLink>
              </li>
              <li>
                <FooterLink href="#proof">{t.proof}</FooterLink>
              </li>
              <li>
                <FooterLink href="#process">{t.process}</FooterLink>
              </li>
              <li>
                <FooterLink href="#apply">{t.apply}</FooterLink>
              </li>
            </ul>
          </motion.div>

          <motion.div
            className="md:col-span-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 1, ease, delay: 0.2 }}
          >
            <p className="text-[11px] uppercase tracking-[0.22em] text-[--color-fg-dim] mb-5">
              {t.contactHeader}
            </p>
            <ul className="space-y-3 text-sm text-[--color-fg-muted]">
              <li>
                <FooterLink href="mailto:executive@ikingdom.org">
                  executive@ikingdom.org
                </FooterLink>
              </li>
              <li>{t.byApplication}</li>
              <li className="pt-2">
                <span
                  itemProp="address"
                  itemScope
                  itemType="https://schema.org/PostalAddress"
                >
                  <span itemProp="addressLocality">San Diego</span>,{" "}
                  <span itemProp="addressRegion">CA</span>
                </span>
              </li>
            </ul>
          </motion.div>
        </div>

        <motion.div
          className="mt-20 pt-8 border-t border-[--color-line] flex flex-wrap items-center justify-between gap-4"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-40px" }}
          transition={{ duration: 1, ease, delay: 0.3 }}
        >
          <p className="text-xs text-[--color-fg-dim]">{t.rights(year)}</p>
          <p className="text-xs text-[--color-fg-dim] tracking-wide">
            {t.established}
          </p>
        </motion.div>
      </div>
    </footer>
  );
}
