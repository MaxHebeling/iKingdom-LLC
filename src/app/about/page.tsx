import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About — iKingdom",
  description:
    "iKingdom is the world's first AI operations firm. Founded by Jordan Talavera in San Diego, CA. 80 agents, 9 tiers, full autonomous operations.",
  alternates: {
    canonical: "https://www.ikingdom.org/about",
    languages: {
      en: "https://www.ikingdom.org/about",
      es: "https://www.ikingdom.org/es/about",
    },
  },
  openGraph: {
    title: "About — iKingdom",
    description:
      "The firm behind the system. Learn about iKingdom, our founder Jordan Talavera, and how we deploy 80 AI agents across 9 tiers.",
    url: "https://www.ikingdom.org/about",
    siteName: "iKingdom",
    locale: "en_US",
    alternateLocale: "es_ES",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "About iKingdom — The World's First AI Operations Firm",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About — iKingdom",
    description:
      "The firm behind the system. 80 AI agents. 9 tiers. Founded by Jordan Talavera in San Diego, CA.",
    images: ["/og-image.png"],
  },
};

const values = [
  {
    title: "Autonomy over dependency",
    description:
      "We build systems you own. No monthly retainers for access to your own operations. When we leave, the system stays.",
  },
  {
    title: "Accuracy before scale",
    description:
      "Every agent must reach 98% accuracy before graduating to full autonomy. We don't ship fast and fix later.",
  },
  {
    title: "Systems not snapshots",
    description:
      "A dashboard is a snapshot. A system is what runs the business. We build systems.",
  },
  {
    title: "Ownership not licensing",
    description:
      "You own your deployment, your agents, your data. iKingdom is the builder, not the landlord.",
  },
];

export default function AboutPage() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jordan Talavera",
    jobTitle: "Founder & CEO",
    worksFor: {
      "@type": "Organization",
      "@id": "https://www.ikingdom.org/#organization",
      name: "iKingdom",
    },
    url: "https://www.ikingdom.org/about",
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Diego",
      addressRegion: "CA",
      addressCountry: "US",
    },
    knowsAbout: [
      "AI Operations",
      "Autonomous Agents",
      "Business Automation",
      "Systems Architecture",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
      />

      <article className="pt-32 md:pt-40 pb-20 md:pb-28 px-6 md:px-10 max-w-[800px] mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-fg-dim)] hover:text-[var(--color-accent)] transition-colors duration-300 mb-10"
        >
          <span aria-hidden="true">&larr;</span> Back to Home
        </Link>

        <header className="mb-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
            01 &mdash; About
          </p>
          <h1 className="font-display text-4xl md:text-6xl tracking-[-0.02em] leading-[1.1] mb-6">
            The firm behind the system
          </h1>
          <p className="text-lg text-[var(--color-fg-muted)] leading-relaxed max-w-[640px]">
            iKingdom is the world&apos;s first AI operations firm. We don&apos;t advise.
            We don&apos;t consult. We build the thing that runs your company.
          </p>
        </header>

        <div className="h-px bg-[var(--color-line)] mb-16" />

        {/* Our Story */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
            02 &mdash; Our Story
          </p>
          <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] leading-[1.2] mb-6">
            Origin
          </h2>
          <div className="space-y-4 text-[var(--color-fg-muted)] leading-relaxed">
            <p>
              iKingdom was founded on a premise: businesses don&apos;t need more tools.
              They need operations that run themselves.
            </p>
            <p>
              The typical business runs on dozens of disconnected platforms, each
              requiring a person to operate, a manager to oversee, and a process to
              maintain. The result is a company that depends entirely on human
              availability to function. Remove a key employee and the whole chain
              breaks.
            </p>
            <p>
              We set out to solve that. Not by replacing people, but by building
              an operational layer that handles the repetitive, high-volume work
              autonomously&mdash;so that the people who remain can focus on judgment,
              relationships, and growth.
            </p>
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)] mb-16" />

        {/* Jordan Talavera */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
            03 &mdash; Leadership
          </p>
          <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] leading-[1.2] mb-6">
            Jordan Talavera, Founder &amp; CEO
          </h2>
          <div className="space-y-4 text-[var(--color-fg-muted)] leading-relaxed">
            <p>
              Jordan is a builder. Before iKingdom, he spent years designing and
              deploying operational systems across industries&mdash;construction,
              finance, real estate, and technology&mdash;learning firsthand what
              breaks when a business scales without infrastructure.
            </p>
            <p>
              Based in San Diego, California, Jordan founded iKingdom to close
              the gap between what AI can do and what businesses actually need it
              to do. Not a chatbot. Not a dashboard. A fully autonomous operating
              layer that replaces the manual work most companies still depend on.
            </p>
            <p>
              He leads every engagement personally, from architecture through
              graduation.
            </p>
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)] mb-16" />

        {/* What We Do */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
            04 &mdash; What We Do
          </p>
          <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] leading-[1.2] mb-6">
            80 agents. 9 tiers. One system.
          </h2>
          <div className="space-y-4 text-[var(--color-fg-muted)] leading-relaxed">
            <p>
              Every iKingdom deployment follows the same architecture: 80
              specialized AI agents organized across 9 operational tiers.
              Together, they cover everything from lead intake and qualification to
              invoicing, reporting, and internal intelligence.
            </p>
            <p>
              Agents don&apos;t ship autonomous. They start under human review. When an
              agent crosses 98% accuracy across a meaningful sample, its checkpoint
              graduates&mdash;supervision is removed and the agent runs on its own.
              This is the Checkpoint Graduation Model, and it&apos;s how we guarantee
              accuracy without sacrificing speed.
            </p>
            <p>
              The full deployment takes 12 months. By month 18, most clients stop
              thinking about the system entirely. It just runs.
            </p>
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)] mb-16" />

        {/* Our Clients */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
            05 &mdash; Our Clients
          </p>
          <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] leading-[1.2] mb-6">
            Industries we serve
          </h2>
          <div className="space-y-4 text-[var(--color-fg-muted)] leading-relaxed">
            <p>
              iKingdom works with established operating businesses doing $1M to
              $100M+ in annual revenue. We deploy a small number of full-stack
              systems each year, by application only.
            </p>
            <p>
              Our current and past engagements span construction, construction
              technology, capital and investment, architecture, mortgage brokerage,
              moving and storage, and horticulture.
            </p>
            <p>
              If your business has real operations and real revenue, and you want
              those operations to run themselves, we should talk.
            </p>
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)] mb-16" />

        {/* Our Values */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
            06 &mdash; Values
          </p>
          <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] leading-[1.2] mb-8">
            What we believe
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {values.map((value) => (
              <div key={value.title} className="space-y-2">
                <h3 className="font-display text-lg tracking-[-0.01em]">
                  {value.title}
                </h3>
                <p className="text-sm text-[var(--color-fg-dim)] leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)] mb-12" />

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/#apply"
            className="inline-block text-sm tracking-wide px-8 py-3 bg-[var(--color-fg)] text-[var(--color-bg)] hover:bg-[var(--color-accent)] transition-all duration-500 rounded-full"
          >
            Apply for an engagement
          </Link>
        </div>
      </article>
    </>
  );
}
