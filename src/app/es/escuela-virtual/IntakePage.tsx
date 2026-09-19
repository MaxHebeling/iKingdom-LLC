import IntakeClient from "./IntakeClient";
import { INTAKE_FORMS, type IntakeFormKey } from "./forms";

export default function IntakePage({
  formKey,
  nextHref,
  nextLabel,
}: {
  formKey: IntakeFormKey;
  nextHref?: string;
  nextLabel?: string;
}) {
  const form = INTAKE_FORMS[formKey];
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
      <section className="max-w-5xl mx-auto px-6 md:px-10 pt-24 md:pt-36 pb-12 md:pb-16 text-center">
        <p className="text-[13px] font-medium tracking-tight" style={{ color: "#0071e3" }}>
          {form.eyebrow}
        </p>
        <h1 className="mt-4 text-[40px] md:text-[62px] font-semibold leading-[1.05] tracking-[-0.025em]">
          {form.title}
          <br />
          <span style={{ color: "#86868b" }}>{form.titleMuted}</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-[18px] md:text-[20px] leading-[1.45]" style={{ color: "#6e6e73" }}>
          {form.intro}
        </p>
      </section>

      <section className="max-w-3xl mx-auto px-6 md:px-10 pb-28">
        <div className="flex justify-center mb-10">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/ikingdom-logo.png" alt="iKingdom" style={{ height: 56, width: "auto", display: "block" }} />
        </div>
        <div
          className="rounded-[28px] p-6 md:p-14"
          style={{ background: "#ffffff", boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 24px 60px -20px rgba(0,0,0,0.12)" }}
        >
          <IntakeClient formKey={formKey} nextHref={nextHref} nextLabel={nextLabel} />
        </div>
        <p className="mt-10 text-center text-[12px] leading-[1.5] max-w-xl mx-auto" style={{ color: "#86868b" }}>
          Tu información es confidencial y solo la usa el equipo de iKingdom para construir tu proyecto.
        </p>
      </section>
    </main>
  );
}
