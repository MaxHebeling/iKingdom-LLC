import type { Metadata } from "next";
import ApplicationClient from "../application/ApplicationClient";

export const metadata: Metadata = {
  title: "Client Application · iKingdom",
  description:
    "Complete this application so our team can evaluate your company, product, or service and prepare a tailored proposal.",
  alternates: {
    canonical: "https://www.ikingdom.org/partner-application",
    languages: {
      en: "https://www.ikingdom.org/partner-application",
      es: "https://www.ikingdom.org/es/partner-application",
    },
  },
  openGraph: {
    title: "Client Application · iKingdom",
    description:
      "Apply to work with iKingdom. We evaluate your case and prepare a tailored proposal.",
    url: "https://www.ikingdom.org/partner-application",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default function PartnerApplicationPage() {
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
            Client Application
          </p>
          <h1
            className="mt-4 text-[44px] md:text-[68px] font-semibold leading-[1.05] tracking-[-0.025em]"
            style={{ color: "#1d1d1f" }}
          >
            Tell us about your company.
            <br />
            <span style={{ color: "#86868b" }}>We&rsquo;ll help you grow it.</span>
          </h1>
          <p
            className="mt-6 max-w-2xl mx-auto text-[19px] md:text-[21px] font-normal leading-[1.4]"
            style={{ color: "#6e6e73" }}
          >
            Complete this application so we can evaluate your company and prepare a
            tailored proposal. The more precise your information, the better our
            evaluation.
          </p>

          {/* Trust strip */}
          <div className="mt-16 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
            {[
              { t: "Careful review", d: "Every application is read by our team." },
              { t: "Serious evaluation", d: "We analyze your business before proposing." },
              { t: "Tailored proposal", d: "If there's a fit, we prepare a proposal." },
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
          <ApplicationClient lang="en" formKey="partner" />
        </div>

        <p
          className="mt-10 text-center text-[12px] leading-[1.5] max-w-xl mx-auto"
          style={{ color: "#86868b" }}
        >
          Your information is treated confidentially and is reviewed only by our
          internal team for the purpose of evaluating your case.
        </p>
      </section>
    </main>
  );
}
