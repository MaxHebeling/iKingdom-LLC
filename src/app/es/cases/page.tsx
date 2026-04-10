import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Casos de Estudio — Prueba del Sistema",
  description:
    "Descubre como iKingdom despliega operaciones autonomas con IA en la practica. Despliegues activos en construccion, capital, arquitectura y mas.",
  alternates: {
    canonical: "https://www.ikingdom.org/es/cases",
    languages: {
      en: "https://www.ikingdom.org/cases",
      es: "https://www.ikingdom.org/es/cases",
    },
  },
  openGraph: {
    title: "Casos de Estudio — Prueba del Sistema | iKingdom",
    description:
      "Como se ven las operaciones autonomas en la practica. Despliegues activos en tecnologia de construccion, capital y arquitectura.",
    url: "https://www.ikingdom.org/es/cases",
    siteName: "iKingdom",
    locale: "es_ES",
    alternateLocale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "iKingdom Casos de Estudio — Prueba del Sistema",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Casos de Estudio — Prueba del Sistema | iKingdom",
    description:
      "Como se ven las operaciones autonomas en la practica. Despliegues activos en construccion, capital y arquitectura.",
    images: ["/og-image.png"],
  },
};

type CaseStudy = {
  name: string;
  industry: string;
  location: string;
  agents?: number;
  status: string;
  description: string;
  featured?: boolean;
};

const casos: CaseStudy[] = [
  {
    name: "BuildCore Ai",
    industry: "Tecnologia de Construccion",
    location: "San Diego, CA",
    agents: 97,
    status: "Activo",
    description:
      "Plataforma de construccion productizada. El primer y mayor despliegue de iKingdom, sirviendo como prueba de concepto y arquitectura de referencia continua.",
    featured: true,
  },
  {
    name: "Distinct Construction Solutions",
    industry: "Construccion",
    location: "Sur de California",
    status: "Activo",
    description:
      "Primer despliegue de BuildCore. Operaciones de extremo a extremo, desde captacion de leads hasta finalizacion de proyectos.",
  },
  {
    name: "Elite Control Group LLC",
    industry: "Holding",
    location: "California",
    status: "Activo",
    description:
      "Operaciones multi-entidad consolidadas bajo una sola capa autonoma.",
  },
  {
    name: "Kyros Global Capital",
    industry: "Capital e Inversion",
    location: "California",
    status: "Activo",
    description:
      "Operaciones de inversion con due diligence automatizado, monitoreo de portafolio y reporteo.",
  },
  {
    name: "Structura Aeternum",
    industry: "Arquitectura y Construccion",
    location: "California / Texas",
    status: "Activo",
    description:
      "Operaciones multi-estado que abarcan ciclos de arquitectura y construccion.",
  },
];

function CaseCard({ study }: { study: CaseStudy }) {
  return (
    <div
      className={`group relative bg-[var(--color-bg-card)] border border-[var(--color-line)] p-8 transition-all duration-500 hover:border-[var(--color-accent)] ${
        study.featured ? "md:col-span-2" : ""
      }`}
    >
      {study.featured && (
        <span className="absolute top-4 right-4 text-[10px] uppercase tracking-[0.2em] text-[var(--color-accent)] font-semibold">
          Destacado
        </span>
      )}

      <div className="mb-6">
        <h3 className="font-display text-xl md:text-2xl tracking-[-0.02em] mb-1">
          {study.name}
        </h3>
        <p className="text-sm text-[var(--color-fg-dim)]">{study.industry}</p>
      </div>

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-[var(--color-fg-dim)] mb-6">
        <span>{study.location}</span>
        {study.agents && <span>{study.agents} agentes</span>}
        <span className="inline-flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          {study.status}
        </span>
      </div>

      <p className="text-[var(--color-fg-muted)] text-sm leading-relaxed">
        {study.description}
      </p>

      <div className="absolute bottom-0 left-0 h-[2px] w-0 bg-[var(--color-accent)] transition-all duration-500 group-hover:w-full" />
    </div>
  );
}

export default function CasesPageEs() {
  return (
    <article className="pt-32 md:pt-40 pb-20 md:pb-28 px-6 md:px-10 max-w-[1000px] mx-auto">
      <Link
        href="/es"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-fg-dim)] hover:text-[var(--color-accent)] transition-colors duration-300 mb-10"
      >
        <span aria-hidden="true">&larr;</span> Volver al inicio
      </Link>

      <header className="mb-16">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
          Casos de Estudio &mdash; Prueba del Sistema
        </p>
        <h1 className="font-display text-4xl md:text-6xl tracking-[-0.02em] leading-[1.1] mb-6">
          Como se ven las operaciones autonomas en la practica
        </h1>
        <p className="text-lg text-[var(--color-fg-muted)] leading-relaxed max-w-[640px]">
          Cada despliegue listado aqui esta activo. Empresas reales operando con
          el sistema iKingdom, hoy.
        </p>
      </header>

      <div className="h-px bg-[var(--color-line)] mb-16" />

      {/* Grid de casos */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {casos.map((study) => (
          <CaseCard key={study.name} study={study} />
        ))}
      </div>

      <div className="h-px bg-[var(--color-line)] mb-16" />

      {/* Clientes bajo NDA */}
      <section className="mb-16">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
          Bajo NDA
        </p>
        <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] leading-[1.2] mb-6">
          Compromisos adicionales
        </h2>
        <div className="space-y-4 text-[var(--color-fg-muted)] leading-relaxed">
          <p>
            Tambien estamos construyendo para clientes bajo NDA en hipotecas,
            mudanzas y almacenamiento, y horticultura.
          </p>
          <p>
            Estos compromisos seran presentados aqui una vez completados.
          </p>
        </div>
      </section>

      <div className="h-px bg-[var(--color-line)] mb-12" />

      {/* CTA */}
      <div className="text-center">
        <p className="font-display text-xl md:text-2xl tracking-[-0.02em] mb-6">
          Listo para ver que construiriamos para ti?
        </p>
        <Link
          href="/es#apply"
          className="inline-block text-sm tracking-wide px-8 py-3 bg-[var(--color-fg)] text-[var(--color-bg)] hover:bg-[var(--color-accent)] transition-all duration-500 rounded-full"
        >
          Solicitar ahora
        </Link>
      </div>
    </article>
  );
}
