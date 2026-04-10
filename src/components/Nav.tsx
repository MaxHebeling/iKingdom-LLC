"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import Image from "next/image";

const COPY = {
  en: {
    links: [
      { id: "method", label: "Method" },
      { id: "console", label: "System" },
      { id: "proof", label: "Proof" },
      { id: "process", label: "Process" },
    ],
    blogLink: { href: "/blog", label: "Blog" },
    apply: "Apply",
    menuOpen: "Open navigation menu",
    menuClose: "Close navigation menu",
  },
  es: {
    links: [
      { id: "method", label: "Método" },
      { id: "console", label: "Sistema" },
      { id: "proof", label: "Pruebas" },
      { id: "process", label: "Proceso" },
    ],
    blogLink: { href: "/es/blog", label: "Blog" },
    apply: "Solicitar",
    menuOpen: "Abrir menú de navegación",
    menuClose: "Cerrar menú de navegación",
  },
} as const;

const SECTION_IDS = ["top", "method", "capabilities", "process", "console", "proof", "apply"];

export default function Nav({ lang = "en" }: { lang?: "en" | "es" }) {
  const { scrollY, scrollYProgress } = useScroll();
  const borderOpacity = useTransform(scrollY, [0, 80], [0, 1]);
  const bgOpacity = useTransform(scrollY, [0, 80], [0, 0.9]);
  const progressScale = useTransform(scrollYProgress, [0, 1], [0, 1]);

  const [activeSection, setActiveSection] = useState<string>("top");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Close mobile menu on Escape key
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMobileMenuOpen(false);
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [mobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];
    SECTION_IDS.forEach((id) => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) setActiveSection(id);
          });
        },
        { rootMargin: "-40% 0px -40% 0px", threshold: 0 },
      );
      o.observe(el);
      observers.push(o);
    });
    return () => observers.forEach((o) => o.disconnect());
  }, []);

  const closeMobileMenu = useCallback(() => setMobileMenuOpen(false), []);

  const t = COPY[lang];

  return (
    <>
      <motion.header
        className="fixed top-0 inset-x-0 z-50 backdrop-blur-md"
        role="banner"
      >
        <motion.div
          style={{ opacity: bgOpacity }}
          className="absolute inset-0 bg-[--color-bg]/90 -z-10"
        />
        <motion.div
          style={{ opacity: borderOpacity }}
          className="absolute bottom-0 inset-x-0 h-px bg-[--color-line-strong]"
        />

        {/* Scroll progress line */}
        <motion.div
          style={{ scaleX: progressScale, transformOrigin: "0% 50%" }}
          className="absolute top-0 inset-x-0 h-[2px] bg-[--color-accent] origin-left z-10"
          aria-hidden="true"
        />

        <nav
          className="max-w-[1400px] mx-auto px-6 md:px-10 h-16 md:h-20 flex items-center justify-between"
          aria-label="Main navigation"
        >
          <a
            href="#top"
            className="block hover:opacity-80 transition-opacity duration-500"
          >
            <Image
              src="/ikingdom-logo.png"
              alt="iKingdom — AI Operations Firm | Autonomous Business Automation"
              width={140}
              height={36}
              className="h-7 md:h-9 w-auto"
              priority
            />
          </a>
          <div className="flex items-center gap-8">
            {/* Desktop nav links */}
            {t.links.map((link) => {
              const isActive = activeSection === link.id;
              return (
                <a
                  key={link.id}
                  href={`#${link.id}`}
                  aria-current={isActive ? "true" : undefined}
                  className={`hidden md:inline-flex items-center gap-2 text-sm transition-colors duration-300 ${
                    isActive
                      ? "text-[--color-fg]"
                      : "text-[--color-fg-muted] hover:text-[--color-fg]"
                  }`}
                >
                  <motion.span
                    animate={{
                      width: isActive ? 16 : 0,
                      opacity: isActive ? 1 : 0,
                    }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    className="block h-px bg-[--color-accent]"
                    aria-hidden="true"
                  />
                  {link.label}
                </a>
              );
            })}

            {/* Blog link */}
            <a
              href={t.blogLink.href}
              className="hidden md:inline-flex items-center gap-2 text-sm text-[--color-fg-muted] hover:text-[--color-fg] transition-colors duration-300"
            >
              {t.blogLink.label}
            </a>

            {/* Apply CTA */}
            <motion.a
              href="#apply"
              className="text-sm tracking-wide px-5 py-2.5 bg-[--color-fg] text-[--color-bg] hover:bg-[--color-accent] hover:text-[--color-bg] transition-all duration-500 rounded-full"
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            >
              {t.apply}
            </motion.a>

            {/* Language toggle */}
            <div
              className="hidden md:flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.18em]"
              role="group"
              aria-label="Language selector"
            >
              <a
                href="/"
                aria-current={lang === "en" ? "page" : undefined}
                hrefLang="en"
                className={`transition-colors ${
                  lang === "en"
                    ? "text-[--color-fg]"
                    : "text-[--color-fg-dim] hover:text-[--color-fg]"
                }`}
              >
                EN
              </a>
              <span className="text-[--color-fg-dim]" aria-hidden="true">
                /
              </span>
              <a
                href="/es"
                aria-current={lang === "es" ? "page" : undefined}
                hrefLang="es"
                className={`transition-colors ${
                  lang === "es"
                    ? "text-[--color-fg]"
                    : "text-[--color-fg-dim] hover:text-[--color-fg]"
                }`}
              >
                ES
              </a>
            </div>

            {/* Mobile hamburger button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((v) => !v)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? t.menuClose : t.menuOpen}
              className="md:hidden flex flex-col justify-center items-center w-10 h-10 gap-1.5"
            >
              <motion.span
                animate={
                  mobileMenuOpen
                    ? { rotate: 45, y: 4 }
                    : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.3 }}
                className="block w-5 h-px bg-[--color-fg]"
              />
              <motion.span
                animate={
                  mobileMenuOpen ? { opacity: 0 } : { opacity: 1 }
                }
                transition={{ duration: 0.2 }}
                className="block w-5 h-px bg-[--color-fg]"
              />
              <motion.span
                animate={
                  mobileMenuOpen
                    ? { rotate: -45, y: -4 }
                    : { rotate: 0, y: 0 }
                }
                transition={{ duration: 0.3 }}
                className="block w-5 h-px bg-[--color-fg]"
              />
            </button>
          </div>
        </nav>
      </motion.header>

      {/* Mobile menu overlay */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-40 md:hidden"
          >
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-[--color-bg]/95 backdrop-blur-sm"
              onClick={closeMobileMenu}
              aria-hidden="true"
            />

            {/* Menu content */}
            <motion.nav
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="relative pt-24 px-6 flex flex-col gap-8"
              aria-label="Mobile navigation"
            >
              {t.links.map((link, i) => (
                <motion.a
                  key={link.id}
                  href={`#${link.id}`}
                  onClick={closeMobileMenu}
                  initial={{ opacity: 0, x: -16 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.06,
                    ease: [0.16, 1, 0.3, 1],
                  }}
                  className="font-display text-4xl tracking-[-0.015em] text-[--color-fg] hover:text-[--color-accent] transition-colors duration-300"
                >
                  {link.label}
                </motion.a>
              ))}

              {/* Mobile blog link */}
              <motion.a
                href={t.blogLink.href}
                onClick={closeMobileMenu}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{
                  duration: 0.4,
                  delay: t.links.length * 0.06,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="font-display text-4xl tracking-[-0.015em] text-[--color-fg] hover:text-[--color-accent] transition-colors duration-300"
              >
                {t.blogLink.label}
              </motion.a>

              {/* Mobile language toggle */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center gap-3 mt-4 text-sm font-semibold uppercase tracking-[0.18em]"
              >
                <a
                  href="/"
                  onClick={closeMobileMenu}
                  hrefLang="en"
                  className={`transition-colors ${
                    lang === "en"
                      ? "text-[--color-fg]"
                      : "text-[--color-fg-dim] hover:text-[--color-fg]"
                  }`}
                >
                  EN
                </a>
                <span className="text-[--color-fg-dim]" aria-hidden="true">
                  /
                </span>
                <a
                  href="/es"
                  onClick={closeMobileMenu}
                  hrefLang="es"
                  className={`transition-colors ${
                    lang === "es"
                      ? "text-[--color-fg]"
                      : "text-[--color-fg-dim] hover:text-[--color-fg]"
                  }`}
                >
                  ES
                </a>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
