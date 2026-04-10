import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "iKingdom LLC Privacy Policy. Learn how we collect, use, and protect your data. CCPA compliant.",
  alternates: {
    canonical: "https://www.ikingdom.org/privacy",
    languages: {
      en: "https://www.ikingdom.org/privacy",
      es: "https://www.ikingdom.org/es/privacy",
    },
  },
};

const sections = [
  { id: "information-we-collect", title: "1. Information We Collect" },
  { id: "how-we-use", title: "2. How We Use Your Information" },
  { id: "third-party-services", title: "3. Third-Party Services" },
  { id: "cookies", title: "4. Cookies & Tracking Technologies" },
  { id: "data-retention", title: "5. Data Retention" },
  { id: "data-security", title: "6. Data Security" },
  { id: "your-rights", title: "7. Your Rights (CCPA)" },
  { id: "children", title: "8. Children\u2019s Privacy" },
  { id: "changes", title: "9. Changes to This Policy" },
  { id: "contact", title: "10. Contact Us" },
];

export default function PrivacyPolicyPage() {
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
          Legal &mdash; Privacy Policy
        </p>
        <h1 className="font-display text-3xl md:text-5xl tracking-[-0.02em] leading-[1.1] mb-6">
          Privacy Policy
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
          iKingdom LLC (&ldquo;iKingdom,&rdquo; &ldquo;we,&rdquo; &ldquo;us,&rdquo; or &ldquo;our&rdquo;) is committed to protecting
          your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your
          information when you visit our website at{" "}
          <a href="https://www.ikingdom.org" target="_blank" rel="noopener noreferrer">
            www.ikingdom.org
          </a>{" "}
          and engage with our services.
        </p>

        <h2 id="information-we-collect">1. Information We Collect</h2>

        <h3>Information You Provide</h3>
        <ul>
          <li>
            <strong>Application &amp; contact forms:</strong> name, email address, company name,
            job title, phone number, and any details you include in your message or application.
          </li>
          <li>
            <strong>Correspondence:</strong> records of communications when you contact us via email
            at executive@ikingdom.org.
          </li>
        </ul>

        <h3>Information Collected Automatically</h3>
        <ul>
          <li>
            <strong>Device &amp; browser data:</strong> IP address, browser type and version,
            operating system, device identifiers, and screen resolution.
          </li>
          <li>
            <strong>Usage data:</strong> pages visited, time spent on pages, referring URLs, click
            patterns, and navigation paths.
          </li>
          <li>
            <strong>Cookies and similar technologies:</strong> see Section 4 below.
          </li>
        </ul>

        <h2 id="how-we-use">2. How We Use Your Information</h2>
        <p>We use the information we collect to:</p>
        <ul>
          <li>Respond to inquiries and process applications for our services.</li>
          <li>Provide, operate, and improve our website and services.</li>
          <li>Analyze website traffic and usage patterns to enhance user experience.</li>
          <li>Communicate with you regarding service updates, if you have opted in.</li>
          <li>Comply with legal obligations and enforce our terms.</li>
        </ul>

        <h2 id="third-party-services">3. Third-Party Services</h2>
        <p>We use the following third-party services that may collect data:</p>
        <ul>
          <li>
            <strong>Google Analytics:</strong> We use Google Analytics to understand how visitors
            interact with our site. Google Analytics collects data such as your IP address, browser
            type, and pages visited. This data is processed in accordance with{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Google&apos;s Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong>Meta Pixel (Facebook):</strong> We use Meta Pixel to measure the effectiveness
            of our advertising and understand user actions on our website. Data collected is subject
            to{" "}
            <a
              href="https://www.facebook.com/privacy/policy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Meta&apos;s Privacy Policy
            </a>
            .
          </li>
          <li>
            <strong>Hosting &amp; infrastructure:</strong> Our website is hosted on Vercel. Vercel
            may collect server logs including IP addresses as part of standard operations.
          </li>
        </ul>
        <p>
          We do not sell your personal information to third parties.
        </p>

        <h2 id="cookies">4. Cookies &amp; Tracking Technologies</h2>
        <p>
          Cookies are small text files placed on your device. We use:
        </p>
        <ul>
          <li>
            <strong>Essential cookies:</strong> required for core website functionality.
          </li>
          <li>
            <strong>Analytics cookies:</strong> used by Google Analytics to track site usage
            (e.g., <code>_ga</code>, <code>_gid</code>).
          </li>
          <li>
            <strong>Marketing cookies:</strong> used by Meta Pixel for advertising measurement
            (e.g., <code>_fbp</code>).
          </li>
        </ul>
        <p>
          You can control cookies through your browser settings. Disabling cookies may affect site
          functionality.
        </p>

        <h2 id="data-retention">5. Data Retention</h2>
        <p>
          We retain personal information only as long as necessary to fulfill the purposes outlined
          in this policy, unless a longer retention period is required by law. Form submissions and
          application data are retained for up to 24 months after the last interaction. Analytics
          data is retained according to the default retention settings of each third-party provider.
        </p>

        <h2 id="data-security">6. Data Security</h2>
        <p>
          We implement reasonable administrative, technical, and physical safeguards to protect your
          personal information. However, no method of transmission over the Internet or electronic
          storage is 100% secure. We cannot guarantee absolute security.
        </p>

        <h2 id="your-rights">7. Your Rights (CCPA)</h2>
        <p>
          If you are a California resident, you have the following rights under the California
          Consumer Privacy Act (CCPA):
        </p>
        <ul>
          <li>
            <strong>Right to Know:</strong> You may request the categories and specific pieces of
            personal information we have collected about you.
          </li>
          <li>
            <strong>Right to Delete:</strong> You may request deletion of your personal information,
            subject to certain exceptions.
          </li>
          <li>
            <strong>Right to Opt-Out:</strong> You have the right to opt out of the sale of your
            personal information. We do not sell personal information.
          </li>
          <li>
            <strong>Right to Non-Discrimination:</strong> We will not discriminate against you for
            exercising any of your CCPA rights.
          </li>
        </ul>
        <p>
          To exercise any of these rights, contact us at{" "}
          <a href="mailto:executive@ikingdom.org">executive@ikingdom.org</a>.
        </p>

        <h2 id="children">8. Children&apos;s Privacy</h2>
        <p>
          Our services are not directed to individuals under the age of 18. We do not knowingly
          collect personal information from children. If we learn that we have collected information
          from a child, we will take steps to delete that information promptly.
        </p>

        <h2 id="changes">9. Changes to This Policy</h2>
        <p>
          We may update this Privacy Policy from time to time. When we do, we will revise the
          &ldquo;Last updated&rdquo; date at the top of this page. We encourage you to review this
          policy periodically.
        </p>

        <h2 id="contact">10. Contact Us</h2>
        <p>
          If you have questions about this Privacy Policy or wish to exercise your rights, please
          contact us:
        </p>
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
          href="/es/privacy"
          hrefLang="es"
          className="text-[var(--color-fg-dim)] hover:text-[var(--color-accent)] transition-colors duration-300"
        >
          Leer en Espa&ntilde;ol &rarr;
        </Link>
      </div>
    </article>
  );
}
