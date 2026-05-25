import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import ContactForm from "../../contact/ContactForm";

export const metadata: Metadata = {
  title: "Contacto — Hablemos de tus operaciones",
  description:
    "Comunícate con iKingdom para consultoría en operaciones de IA, despliegue de agentes autónomos y automatización empresarial. Con sede en San Diego, CA.",
  openGraph: {
    title: "Contacto — Hablemos de tus operaciones",
    description:
      "Comunícate con iKingdom para consultoría en operaciones de IA y despliegue de agentes autónomos.",
    type: "website",
    url: "https://www.ikingdom.org/es/contact",
    siteName: "iKingdom",
    locale: "es_ES",
    alternateLocale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "iKingdom — Contacto",
      },
    ],
  },
  alternates: {
    canonical: "https://www.ikingdom.org/es/contact",
    languages: {
      en: "https://www.ikingdom.org/contact",
      es: "https://www.ikingdom.org/es/contact",
    },
  },
};

export default function ContactPageES() {
  return (
    <>
      <Nav lang="es" />
      <header className="pt-32 md:pt-40 pb-16 md:pb-20 px-6 md:px-10 max-w-[1400px] mx-auto">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
          Contacto &mdash; Conversemos
        </p>
        <h1 className="font-display text-4xl md:text-6xl tracking-[-0.02em] mb-6">
          Hablemos de tus operaciones
        </h1>
      </header>

      <div className="border-t border-[var(--color-line)]" />

      <main className="px-6 md:px-10 py-16 md:py-20 max-w-[1400px] mx-auto">
        <div className="grid md:grid-cols-2 gap-16 md:gap-20">
          <ContactForm lang="es" />

          <div>
            <h2 className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-8">
              Información de contacto
            </h2>

            <div className="space-y-6 text-sm text-[var(--color-fg-muted)]">
              <div>
                <p className="text-[var(--color-fg)] font-medium mb-1">Correo electrónico</p>
                <a
                  href="mailto:executive@ikingdom.org"
                  className="hover:text-[var(--color-accent)] transition-colors duration-300"
                >
                  executive@ikingdom.org
                </a>
              </div>

              <div>
                <p className="text-[var(--color-fg)] font-medium mb-1">Ubicación</p>
                <p>San Diego, California</p>
              </div>

              <div className="pt-4 border-t border-[var(--color-line)]">
                <p className="leading-relaxed">
                  Para evaluar un compromiso formal, te recomendamos comenzar
                  con el formulario de solicitud en nuestra página principal.
                </p>
                <a
                  href="/es#apply"
                  className="inline-block mt-3 text-[var(--color-accent)] hover:opacity-80 transition-opacity duration-300 underline underline-offset-4"
                >
                  Ir al formulario de solicitud
                </a>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer lang="es" />
    </>
  );
}
