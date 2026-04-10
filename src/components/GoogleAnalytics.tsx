"use client";

import { useState, useEffect } from "react";
import Script from "next/script";

const GA_ID = "G-LFQHB4B845";

function hasConsent(): boolean {
  if (typeof document === "undefined") return false;
  const match = document.cookie.match(/(^| )ikingdom-consent=([^;]+)/);
  return match ? decodeURIComponent(match[2]) === "accepted" : false;
}

export default function GoogleAnalytics() {
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (hasConsent()) {
      setAllowed(true);
      return;
    }
    function onConsent() {
      setAllowed(true);
    }
    window.addEventListener("cookie-consent-accepted", onConsent);
    return () => window.removeEventListener("cookie-consent-accepted", onConsent);
  }, []);

  if (!allowed) return null;

  return (
    <>
      <Script
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', '${GA_ID}');
        `}
      </Script>
    </>
  );
}
