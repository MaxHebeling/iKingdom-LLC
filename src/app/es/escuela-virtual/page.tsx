import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sitio web + Escuela virtual · iKingdom",
  description: "Completa los dos formularios para construir el sitio web y la escuela virtual de tu ministerio.",
  robots: { index: false, follow: false },
};

const STEPS = [
  {
    n: "1",
    href: "/es/escuela-virtual/sitio-web",
    title: "Sitio web del ministerio",
    body: "Identidad, liderazgo, reuniones, ministerios, predicaciones, eventos, donaciones y dominio.",
    time: "≈ 20 minutos",
  },
  {
    n: "2",
    href: "/es/escuela-virtual/escuela",
    title: "Escuela virtual",
    body: "Programas, estudiantes, contenido, profesores, inscripción y pagos.",
    time: "≈ 15 minutos",
  },
];

export default function Page() {
  return (
    <main
      className="min-h-screen"
      style={{
        background: "#fbfbfd",
        color: "#1d1d1f",
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "SF Pro Display", "SF Pro Text", "Helvetica Neue", Helvetica, Arial, sans-serif',
      }}
    >
      <section className="max-w-4xl mx-auto px-6 md:px-10 pt-24 md:pt-36 pb-24 text-center">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/ikingdom-logo.png" alt="iKingdom" style={{ height: 56, width: "auto", margin: "0 auto 40px" }} />
        <p className="text-[13px] font-medium" style={{ color: "#0071e3" }}>
          Sitio web + Escuela virtual
        </p>
        <h1 className="mt-4 text-[40px] md:text-[60px] font-semibold leading-[1.05] tracking-[-0.025em]">
          Dos formularios.
          <br />
          <span style={{ color: "#86868b" }}>Un solo proyecto.</span>
        </h1>
        <p className="mt-6 max-w-2xl mx-auto text-[18px] leading-[1.45]" style={{ color: "#6e6e73" }}>
          Para construir tu sitio web y tu escuela virtual necesitamos conocer tu ministerio a fondo. Puedes completarlos
          en distintos momentos: el avance se guarda en tu navegador.
        </p>
        <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-5 text-left">
          {STEPS.map((s) => (
            <a
              key={s.n}
              href={s.href}
              className="block rounded-[24px] p-8 transition-transform hover:-translate-y-0.5"
              style={{ background: "#fff", boxShadow: "0 1px 2px rgba(0,0,0,0.04), 0 16px 40px -16px rgba(0,0,0,0.12)" }}
            >
              <span
                className="inline-flex h-9 w-9 items-center justify-center rounded-full text-[15px] font-semibold"
                style={{ background: "#e8f0fe", color: "#0071e3" }}
              >
                {s.n}
              </span>
              <h2 className="mt-5 text-[22px] font-semibold tracking-[-0.01em]">{s.title}</h2>
              <p className="mt-2 text-[15px] leading-[1.5]" style={{ color: "#6e6e73" }}>
                {s.body}
              </p>
              <p className="mt-6 text-[13px] font-medium" style={{ color: "#0071e3" }}>
                Completar formulario · {s.time} →
              </p>
            </a>
          ))}
        </div>
      </section>
    </main>
  );
}
