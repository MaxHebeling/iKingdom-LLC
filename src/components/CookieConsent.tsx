"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";

function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(^| )" + name + "=([^;]+)"));
  return match ? decodeURIComponent(match[2]) : null;
}

function setCookie(name: string, value: string, days: number) {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  document.cookie = `${name}=${encodeURIComponent(value)};expires=${expires};path=/;SameSite=Lax`;
}

const COOKIE_NAME = "ikingdom-consent";

const text = {
  en: {
    message: "We use cookies to analyze traffic and improve your experience.",
    privacy: "Privacy Policy",
    accept: "Accept",
    decline: "Decline",
  },
  es: {
    message: "Usamos cookies para analizar el tráfico y mejorar tu experiencia.",
    privacy: "Política de Privacidad",
    accept: "Aceptar",
    decline: "Rechazar",
  },
};

export default function CookieConsent() {
  const [visible, setVisible] = useState(false);
  const pathname = usePathname();
  const lang = pathname.startsWith("/es") ? "es" : "en";
  const t = text[lang];

  useEffect(() => {
    const consent = getCookie(COOKIE_NAME);
    if (!consent) {
      setVisible(true);
    }
  }, []);

  function handleAccept() {
    setCookie(COOKIE_NAME, "accepted", 365);
    setVisible(false);
    // Dispatch a custom event so GA4 and Meta Pixel can load immediately
    window.dispatchEvent(new Event("cookie-consent-accepted"));
  }

  function handleDecline() {
    setCookie(COOKIE_NAME, "declined", 365);
    setVisible(false);
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: "100%" }}
          animate={{ y: 0 }}
          exit={{ y: "100%" }}
          transition={{ type: "spring", damping: 30, stiffness: 300 }}
          className="fixed bottom-0 left-0 right-0 z-[999] border-t border-[--color-border]"
        >
          <div className="bg-[--color-surface] px-6 py-4 md:px-8">
            <div className="mx-auto flex max-w-5xl flex-col items-start gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-[--color-fg] leading-relaxed">
                {t.message}{" "}
                <Link
                  href="/privacy"
                  className="underline underline-offset-2 text-[--color-fg-dim] hover:text-[--color-fg] transition-colors"
                >
                  {t.privacy}
                </Link>
              </p>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={handleDecline}
                  className="rounded-md border border-[--color-border] px-4 py-1.5 text-sm text-[--color-fg-dim] hover:text-[--color-fg] hover:border-[--color-fg] transition-colors cursor-pointer"
                >
                  {t.decline}
                </button>
                <button
                  onClick={handleAccept}
                  className="rounded-md bg-[--color-accent] px-4 py-1.5 text-sm text-[--color-fg] font-medium hover:opacity-90 transition-opacity cursor-pointer"
                >
                  {t.accept}
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
