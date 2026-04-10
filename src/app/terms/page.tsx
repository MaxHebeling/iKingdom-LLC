import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "iKingdom LLC Terms of Service. Review the terms governing use of our website and AI operations services.",
  alternates: {
    canonical: "https://www.ikingdom.org/terms",
    languages: {
      en: "https://www.ikingdom.org/terms",
      es: "https://www.ikingdom.org/es/terms",
    },
  },
  openGraph: {
    title: "Terms of Service | iKingdom",
    description: "Terms governing use of iKingdom website and AI operations services.",
    url: "https://www.ikingdom.org/terms",
    type: "website",
  },
};

const sections = [
  { id: "acceptance", title: "1. Acceptance of Terms" },
  { id: "services", title: "2. Description of Services" },
  { id: "application", title: "3. Application Process" },
  { id: "intellectual-property", title: "4. Intellectual Property" },
  { id: "payment", title: "5. Payment Terms" },
  { id: "confidentiality", title: "6. Confidentiality" },
  { id: "limitation", title: "7. Limitation of Liability" },
  { id: "indemnification", title: "8. Indemnification" },
  { id: "termination", title: "9. Termination" },
  { id: "governing-law", title: "10. Governing Law" },
  { id: "changes", title: "11. Changes to Terms" },
  { id: "contact", title: "12. Contact Us" },
];

export default function TermsPage() {
  return (
    <article className="pt-32 md:pt-40 pb-20 md:pb-28 px-6 md:px-10 max-w-[800px] mx-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-fg-dim)] hover:text-[var(--color-accent)] transition-colors duration-300 mb-10"
      >
        <span aria-hidden="true">&larr;</span> Back to Home
      </Link>

      <header className="mb-12">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
          Legal &mdash; Terms of Service
        </p>
        <h1 className="font-display text-3xl md:text-5xl tracking-[-0.02em] leading-[1.1] mb-6">
          Terms of Service
        </h1>
        <p className="text-sm text-[var(--color-fg-dim)]">
          Last updated: April 2026
        </p>
      </header>

      <div className="h-px bg-[var(--color-line)] mb-12" />

      {/* Table of Contents */}
      <nav className="mb-12 p-6 border border-[var(--color-line)]" aria-label="Table of contents">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
          Contents
        </p>
        <ol className="space-y-2 text-sm text-[var(--color-fg-muted)]">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="hover:text-[var(--color-accent)] transition-colors duration-300"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="prose-ikingdom">
        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and use of the website
          and services provided by iKingdom LLC (&ldquo;iKingdom,&rdquo; &ldquo;we,&rdquo;
          &ldquo;us,&rdquo; or &ldquo;our&rdquo;). By accessing our website or engaging our
          services, you agree to be bound by these Terms.
        </p>

        <h2 id="acceptance">1. Acceptance of Terms</h2>
        <p>
          By accessing or using our website at{" "}
          <a href="https://www.ikingdom.org" target="_blank" rel="noopener noreferrer">
            www.ikingdom.org
          </a>
          , you acknowledge that you have read, understood, and agree to be bound by these Terms.
          If you do not agree, you must discontinue use of our website and services immediately.
        </p>

        <h2 id="services">2. Description of Services</h2>
        <p>
          iKingdom is an AI operations firm based in San Diego, California. We design and deploy
          autonomous AI agent systems for businesses. Our services include, but are not limited to:
        </p>
        <ul>
          <li>AI operations consulting and strategy.</li>
          <li>Design and deployment of autonomous AI agent architectures.</li>
          <li>Business process automation through AI systems.</li>
          <li>Ongoing AI operations management and optimization.</li>
        </ul>
        <p>
          The specific scope, deliverables, and terms of any engagement are defined in a separate
          service agreement or statement of work between iKingdom and the client.
        </p>

        <h2 id="application">3. Application Process</h2>
        <p>
          Our services are available by application only. Submitting an application does not
          guarantee acceptance. We reserve the right to accept or decline any application at our
          sole discretion. Application information you provide will be handled in accordance with
          our{" "}
          <Link href="/privacy" className="underline hover:text-[var(--color-accent)]">
            Privacy Policy
          </Link>
          .
        </p>

        <h2 id="intellectual-property">4. Intellectual Property</h2>
        <ul>
          <li>
            <strong>Our IP:</strong> All content on this website, including text, graphics, logos,
            images, software, and the iKingdom brand, is the property of iKingdom LLC and is
            protected by applicable intellectual property laws. You may not reproduce, distribute,
            or create derivative works without our prior written consent.
          </li>
          <li>
            <strong>Client deliverables:</strong> Ownership of deliverables produced during an
            engagement will be defined in the applicable service agreement. Unless otherwise agreed
            in writing, iKingdom retains ownership of its proprietary tools, frameworks,
            methodologies, and pre-existing intellectual property.
          </li>
        </ul>

        <h2 id="payment">5. Payment Terms</h2>
        <p>
          Payment terms, including fees, schedules, and methods, are specified in the applicable
          service agreement or statement of work. Unless otherwise stated:
        </p>
        <ul>
          <li>Invoices are due within 30 days of issuance.</li>
          <li>Late payments may incur interest at 1.5% per month or the maximum rate permitted by law.</li>
          <li>All fees are non-refundable unless explicitly stated in the service agreement.</li>
        </ul>

        <h2 id="confidentiality">6. Confidentiality</h2>
        <p>
          Both parties agree to maintain the confidentiality of any proprietary or confidential
          information disclosed during the course of an engagement. Confidentiality obligations
          survive the termination of any service agreement for a period of two (2) years unless
          otherwise agreed.
        </p>

        <h2 id="limitation">7. Limitation of Liability</h2>
        <p>
          To the fullest extent permitted by law:
        </p>
        <ul>
          <li>
            iKingdom provides its website and services on an &ldquo;as is&rdquo; and &ldquo;as
            available&rdquo; basis without warranties of any kind, whether express or implied.
          </li>
          <li>
            iKingdom shall not be liable for any indirect, incidental, special, consequential, or
            punitive damages, including loss of profits, data, or business opportunities.
          </li>
          <li>
            Our total aggregate liability for any claim arising from or related to these Terms or
            our services shall not exceed the total fees paid by you to iKingdom in the twelve (12)
            months preceding the claim.
          </li>
        </ul>

        <h2 id="indemnification">8. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless iKingdom LLC, its officers, directors, employees,
          and agents from any claims, damages, losses, or expenses (including reasonable
          attorneys&apos; fees) arising from your use of our website, violation of these Terms, or
          infringement of any third-party rights.
        </p>

        <h2 id="termination">9. Termination</h2>
        <p>
          We may suspend or terminate your access to our website at any time and for any reason
          without notice. Termination of a service engagement is governed by the applicable service
          agreement. Sections regarding intellectual property, confidentiality, limitation of
          liability, indemnification, and governing law survive termination.
        </p>

        <h2 id="governing-law">10. Governing Law</h2>
        <p>
          These Terms are governed by and construed in accordance with the laws of the State of
          California, United States, without regard to its conflict of law provisions. Any dispute
          arising under these Terms shall be subject to the exclusive jurisdiction of the state and
          federal courts located in San Diego County, California.
        </p>

        <h2 id="changes">11. Changes to Terms</h2>
        <p>
          We reserve the right to modify these Terms at any time. Changes take effect when posted
          on this page. Your continued use of the website or services after changes are posted
          constitutes acceptance of the revised Terms. We encourage you to review this page
          periodically.
        </p>

        <h2 id="contact">12. Contact Us</h2>
        <p>If you have questions about these Terms, please contact us:</p>
        <ul>
          <li>
            <strong>Email:</strong>{" "}
            <a href="mailto:executive@ikingdom.org">executive@ikingdom.org</a>
          </li>
          <li>
            <strong>Company:</strong> iKingdom LLC
          </li>
          <li>
            <strong>Location:</strong> San Diego, CA
          </li>
        </ul>
      </div>

      <div className="h-px bg-[var(--color-line)] mt-16 mb-8" />

      <div className="flex items-center justify-between text-sm">
        <Link
          href="/"
          className="text-[var(--color-fg-dim)] hover:text-[var(--color-accent)] transition-colors duration-300"
        >
          &larr; Home
        </Link>
        <Link
          href="/es/terms"
          hrefLang="es"
          className="text-[var(--color-fg-dim)] hover:text-[var(--color-accent)] transition-colors duration-300"
        >
          Leer en Espa&ntilde;ol &rarr;
        </Link>
      </div>
    </article>
  );
}
