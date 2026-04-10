import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact — Get in Touch | iKingdom",
  description:
    "Reach out to iKingdom for AI operations consulting, autonomous agent deployment, and business automation inquiries. Based in San Diego, CA.",
  openGraph: {
    title: "Contact — Get in Touch | iKingdom",
    description:
      "Reach out to iKingdom for AI operations consulting and autonomous agent deployment.",
    type: "website",
    url: "https://www.ikingdom.org/contact",
    siteName: "iKingdom",
    locale: "en_US",
    alternateLocale: "es_ES",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "iKingdom — Contact",
      },
    ],
  },
  alternates: {
    canonical: "https://www.ikingdom.org/contact",
    languages: {
      en: "https://www.ikingdom.org/contact",
      es: "https://www.ikingdom.org/es/contact",
    },
  },
};

export default function ContactPage() {
  return (
    <>
      <Nav lang="en" />
      <header className="pt-32 md:pt-40 pb-16 md:pb-20 px-6 md:px-10 max-w-[1400px] mx-auto">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
          Contact &mdash; Get in Touch
        </p>
        <h1 className="font-display text-4xl md:text-6xl tracking-[-0.02em] mb-6">
          Let&rsquo;s talk about your operations
        </h1>
      </header>

      <div className="border-t border-[var(--color-line)]" />

      <main className="px-6 md:px-10 py-16 md:py-20 max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-20">
          <ContactForm lang="en" />

          <div>
            <h2 className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-8">
              Contact Information
            </h2>

            <div className="space-y-6 text-sm text-[var(--color-fg-muted)]">
              <div>
                <p className="text-[var(--color-fg)] font-medium mb-1">Email</p>
                <a
                  href="mailto:executive@ikingdom.org"
                  className="hover:text-[var(--color-accent)] transition-colors duration-300"
                >
                  executive@ikingdom.org
                </a>
              </div>

              <div>
                <p className="text-[var(--color-fg)] font-medium mb-1">Location</p>
                <p>San Diego, California</p>
              </div>

              <div className="pt-4 border-t border-[var(--color-line)]">
                <p className="leading-relaxed">
                  For formal engagement inquiries, we recommend starting with the
                  application form on our homepage.
                </p>
                <a
                  href="/#apply"
                  className="inline-block mt-3 text-[var(--color-accent)] hover:opacity-80 transition-opacity duration-300 underline underline-offset-4"
                >
                  Go to application form
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer lang="en" />
    </>
  );
}
