import type { Metadata } from "next";
import ApplicationClient from "./ApplicationClient";

export const metadata: Metadata = {
  title: "Aplicación de cliente · iKingdom",
  description:
    "Completa esta aplicación para que nuestro equipo evalúe tu empresa, producto o servicio y prepare una propuesta personalizada.",
  alternates: { canonical: "https://www.ikingdom.org/application" },
  openGraph: {
    title: "Aplicación de cliente · iKingdom",
    description:
      "Aplica para trabajar con iKingdom. Evaluamos tu caso y preparamos una propuesta a la medida.",
    url: "https://www.ikingdom.org/application",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function ApplicationPage() {
  return (
    <main
      className="min-h-screen"
      style={{
        background: "#fbfbfd",
        color: "#1d1d1f",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
        WebkitFontSmoothing: "antialiased",
      }}
    >
      {/* Hero */}
      <section className="relative">
        <div className="max-w-5xl mx-auto px-6 md:px-10 pt-24 md:pt-36 pb-16 md:pb-24 text-center">
          <p
            className="text-[13px] font-medium tracking-tight"
            style={{ color: "#0071e3" }}
          >
            Aplicación de cliente
          </p>
          <h1
            className="mt-4 text-[44px] md:text-[68px] font-semibold leading-[1.05] tracking-[-0.025em]"
            style={{ color: "#1d1d1f" }}
          >
            Cuéntanos sobre tu empresa.
            <br />
            <span style={{ color: "#86868b" }}>Te ayudamos a crecerla.</span>
          </h1>
          <p
            className="mt-6 max-w-2xl mx-auto text-[19px] md:text-[21px] font-normal leading-[1.4]"
            style={{ color: "#6e6e73" }}
          >
            Completa esta aplicación para que podamos evaluar tu empresa y preparar
            una propuesta personalizada. Entre más precisa sea tu información, mejor
            será nuestra evaluación.
          </p>

          {/* Trust strip */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { t: "Revisión cuidadosa", d: "Cada aplicación es leída por nuestro equipo." },
              { t: "Evaluación seria", d: "Analizamos tu negocio antes de proponer." },
              { t: "Propuesta a medida", d: "Si hay buen fit, preparamos una propuesta." },
            ].map((b) => (
              <div
                key={b.t}
                className="rounded-2xl p-6 text-left"
                style={{ background: "#ffffff", boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.04)" }}
              >
                <p className="text-[15px] font-semibold" style={{ color: "#1d1d1f" }}>
                  {b.t}
                </p>
                <p className="mt-1.5 text-[13px] leading-[1.5]" style={{ color: "#6e6e73" }}>
                  {b.d}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form card */}
      <section className="max-w-3xl mx-auto px-6 md:px-10 pb-28">
        <div className="flex justify-center mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/ikingdom-logo.png"
            alt="iKingdom"
            style={{ height: 64, width: "auto", display: "block" }}
          />
        </div>
        <div
          className="rounded-[28px] p-8 md:p-14"
          style={{
            background: "#ffffff",
            boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 24px 60px -20px rgba(0,0,0,0.12)",
          }}
        >
          <ApplicationClient />
        </div>

        <p
          className="mt-10 text-center text-[12px] leading-[1.5] max-w-xl mx-auto"
          style={{ color: "#86868b" }}
        >
          Tu información se trata de forma confidencial y es revisada únicamente por
          nuestro equipo interno con el fin de evaluar tu caso.
        </p>
      </section>
    </main>
  );
}
