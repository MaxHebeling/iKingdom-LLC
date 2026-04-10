import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Case Studies — Proof of System",
  description:
    "See how iKingdom deploys autonomous AI operations in practice. Live deployments across construction, capital, architecture, and more.",
  alternates: {
    canonical: "https://www.ikingdom.org/cases",
    languages: {
      en: "https://www.ikingdom.org/cases",
      es: "https://www.ikingdom.org/es/cases",
    },
  },
  openGraph: {
    title: "Case Studies — Proof of System | iKingdom",
    description:
      "What autonomous operations look like in practice. Live deployments across construction technology, capital, and architecture.",
    url: "https://www.ikingdom.org/cases",
    siteName: "iKingdom",
    locale: "en_US",
    alternateLocale: "es_ES",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "iKingdom Case Studies — Proof of System",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Case Studies — Proof of System | iKingdom",
    description:
      "What autonomous operations look like in practice. Live deployments across construction, capital, and architecture.",
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

const cases: CaseStudy[] = [
  {
    name: "BuildCore Ai",
    industry: "Construction Technology",
    location: "San Diego, CA",
    agents: 97,
    status: "Live",
    description:
      "Productized construction platform. The first and largest iKingdom deployment, serving as both proof of concept and ongoing reference architecture.",
    featured: true,
  },
  {
    name: "Distinct Construction Solutions",
    industry: "Construction",
    location: "Southern California",
    status: "Live",
    description:
      "First BuildCore deployment. End-to-end operations from lead capture to project completion.",
  },
  {
    name: "Elite Control Group LLC",
    industry: "Holding Company",
    location: "California",
    status: "Live",
    description:
      "Multi-entity operations consolidated under a single autonomous layer.",
  },
  {
    name: "Kyros Global Capital",
    industry: "Capital & Investment",
    location: "California",
    status: "Live",
    description:
      "Investment operations with automated due diligence, portfolio monitoring, and reporting.",
  },
  {
    name: "Structura Aeternum",
    industry: "Architecture & Build",
    location: "California / Texas",
    status: "Live",
    description:
      "Cross-state operations spanning architecture and construction build cycles.",
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
          Featured
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
        {study.agents && <span>{study.agents} agents</span>}
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

export default function CasesPage() {
  return (
    <article className="pt-32 md:pt-40 pb-20 md:pb-28 px-6 md:px-10 max-w-[1000px] mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-fg-dim)] hover:text-[var(--color-accent)] transition-colors duration-300 mb-10"
      >
        <span aria-hidden="true">&larr;</span> Back to Home
      </Link>

      <header className="mb-16">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
          Case Studies &mdash; Proof of System
        </p>
        <h1 className="font-display text-4xl md:text-6xl tracking-[-0.02em] leading-[1.1] mb-6">
          What autonomous operations look like in practice
        </h1>
        <p className="text-lg text-[var(--color-fg-muted)] leading-relaxed max-w-[640px]">
          Every deployment listed here is live. Real businesses running on the
          iKingdom system, today.
        </p>
      </header>

      <div className="h-px bg-[var(--color-line)] mb-16" />

      {/* Case study grid */}
      <div className="grid md:grid-cols-2 gap-6 mb-16">
        {cases.map((study) => (
          <CaseCard key={study.name} study={study} />
        ))}
      </div>

      <div className="h-px bg-[var(--color-line)] mb-16" />

      {/* NDA Clients */}
      <section className="mb-16">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
          Under NDA
        </p>
        <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] leading-[1.2] mb-6">
          Additional engagements
        </h2>
        <div className="space-y-4 text-[var(--color-fg-muted)] leading-relaxed">
          <p>
            We&apos;re also building for clients under NDA in mortgage brokerage,
            moving &amp; storage, and horticulture.
          </p>
          <p>
            These engagements will be featured here upon completion.
          </p>
        </div>
      </section>

      <div className="h-px bg-[var(--color-line)] mb-12" />

      {/* CTA */}
      <div className="text-center">
        <p className="font-display text-xl md:text-2xl tracking-[-0.02em] mb-6">
          Ready to see what we&apos;d build for you?
        </p>
        <Link
          href="/#apply"
          className="inline-block text-sm tracking-wide px-8 py-3 bg-[var(--color-fg)] text-[var(--color-bg)] hover:bg-[var(--color-accent)] transition-all duration-500 rounded-full"
        >
          Apply now
        </Link>
      </div>
    </article>
  );
}
