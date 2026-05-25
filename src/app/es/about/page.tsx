import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nosotros — La firma detrás del sistema",
  description:
    "iKingdom es la primera firma de operaciones de IA del mundo. Fundada por Jordan Talavera en San Diego, CA. 80 agentes, 9 niveles, operaciones totalmente autónomas.",
  alternates: {
    canonical: "https://www.ikingdom.org/es/about",
    languages: {
      en: "https://www.ikingdom.org/about",
      es: "https://www.ikingdom.org/es/about",
    },
  },
  openGraph: {
    title: "Nosotros — La firma detrás del sistema",
    description:
      "La firma detrás del sistema. Conoce a iKingdom, a nuestro fundador Jordan Talavera y cómo desplegamos 80 agentes de IA en 9 niveles.",
    url: "https://www.ikingdom.org/es/about",
    siteName: "iKingdom",
    locale: "es_ES",
    alternateLocale: "en_US",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Nosotros — iKingdom, la primera firma de operaciones de IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nosotros — La firma detrás del sistema",
    description:
      "La firma detrás del sistema. 80 agentes de IA. 9 niveles. Fundada por Jordan Talavera en San Diego, CA.",
    images: ["/og-image.png"],
  },
};

const valores = [
  {
    title: "Autonomía sobre dependencia",
    description:
      "Construimos sistemas que te pertenecen. Sin cuotas mensuales para acceder a tus propias operaciones. Cuando nos vamos, el sistema se queda.",
  },
  {
    title: "Precisión antes que escala",
    description:
      "Cada agente debe alcanzar el 98% de precisión antes de graduarse a autonomía completa. No lanzamos rápido para corregir después.",
  },
  {
    title: "Sistemas, no instantáneas",
    description:
      "Un dashboard es una instantánea. Un sistema es lo que opera el negocio. Nosotros construimos sistemas.",
  },
  {
    title: "Propiedad, no licenciamiento",
    description:
      "Eres dueño de tu despliegue, tus agentes, tus datos. iKingdom es el constructor, no el arrendador.",
  },
];

export default function AboutPageEs() {
  const personJsonLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Jordan Talavera",
    jobTitle: "Fundador y CEO",
    worksFor: {
      "@type": "Organization",
      "@id": "https://www.ikingdom.org/#organization",
      name: "iKingdom",
    },
    url: "https://www.ikingdom.org/es/about",
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Diego",
      addressRegion: "CA",
      addressCountry: "US",
    },
    knowsAbout: [
      "Operaciones de IA",
      "Agentes Autónomos",
      "Automatización Empresarial",
      "Arquitectura de Sistemas",
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
          href="/es"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-fg-dim)] hover:text-[var(--color-accent)] transition-colors duration-300 mb-10"
        >
          <span aria-hidden="true">&larr;</span> Volver al inicio
        </Link>

        <header className="mb-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
            01 &mdash; Nosotros
          </p>
          <h1 className="font-display text-4xl md:text-6xl tracking-[-0.02em] leading-[1.1] mb-6">
            La firma detrás del sistema
          </h1>
          <p className="text-lg text-[var(--color-fg-muted)] leading-relaxed max-w-[640px]">
            iKingdom es la primera firma de operaciones de IA del mundo. No
            asesoramos. No consultamos. Construimos lo que opera tu empresa.
          </p>
        </header>

        <div className="h-px bg-[var(--color-line)] mb-16" />

        {/* Nuestra Historia */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
            02 &mdash; Nuestra historia
          </p>
          <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] leading-[1.2] mb-6">
            Origen
          </h2>
          <div className="space-y-4 text-[var(--color-fg-muted)] leading-relaxed">
            <p>
              iKingdom nació de una premisa: las empresas no necesitan más
              herramientas. Necesitan operaciones que se ejecuten solas.
            </p>
            <p>
              La empresa típica opera con docenas de plataformas desconectadas,
              cada una requiriendo a una persona para usarla, a un gerente para
              supervisarla y a un proceso para mantenerla. El resultado es una
              empresa que depende por completo de la disponibilidad humana para
              funcionar. Pierde a un empleado clave y la cadena entera se rompe.
            </p>
            <p>
              Nos propusimos resolver eso. No reemplazando personas, sino
              construyendo una capa operacional que maneja el trabajo repetitivo
              y de alto volumen de forma autónoma &mdash; para que las personas
              que permanecen se concentren en juicio, relaciones y crecimiento.
            </p>
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)] mb-16" />

        {/* Jordan Talavera */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
            03 &mdash; Liderazgo
          </p>
          <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] leading-[1.2] mb-6">
            Jordan Talavera, Fundador y CEO
          </h2>
          <div className="space-y-4 text-[var(--color-fg-muted)] leading-relaxed">
            <p>
              Jordan es un constructor. Antes de iKingdom, pasó años diseñando
              y desplegando sistemas operacionales en múltiples industrias
              &mdash; construcción, finanzas, bienes raíces y tecnología &mdash;
              aprendiendo de primera mano qué se rompe cuando un negocio escala
              sin infraestructura.
            </p>
            <p>
              Desde San Diego, California, Jordan fundó iKingdom para cerrar la
              brecha entre lo que la IA puede hacer y lo que las empresas
              realmente necesitan que haga. No un chatbot. No un dashboard. Una
              capa operacional completamente autónoma que reemplaza el trabajo
              manual del que la mayoría de las empresas aún dependen.
            </p>
            <p>
              Lidera personalmente cada despliegue, desde la arquitectura hasta
              la graduación.
            </p>
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)] mb-16" />

        {/* Qué Hacemos */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
            04 &mdash; Qué hacemos
          </p>
          <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] leading-[1.2] mb-6">
            80 agentes. 9 niveles. Un sistema.
          </h2>
          <div className="space-y-4 text-[var(--color-fg-muted)] leading-relaxed">
            <p>
              Cada despliegue de iKingdom sigue la misma arquitectura: 80
              agentes de IA especializados organizados en 9 niveles
              operacionales. En conjunto cubren todo, desde la captación y
              calificación de prospectos hasta facturación, reportes e
              inteligencia interna.
            </p>
            <p>
              Los agentes no se lanzan autónomos. Comienzan bajo revisión
              humana. Cuando un agente supera el 98% de precisión en una
              muestra significativa, su checkpoint gradúa &mdash; la
              supervisión se retira y el agente opera por su cuenta. Este es el
              Modelo de Graduación por Checkpoint, y así garantizamos precisión
              sin sacrificar velocidad.
            </p>
            <p>
              El despliegue completo toma 12 meses. A los 18 meses, la mayoría
              de los clientes ya no piensa en el sistema. Simplemente funciona.
            </p>
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)] mb-16" />

        {/* Nuestros Clientes */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
            05 &mdash; Nuestros clientes
          </p>
          <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] leading-[1.2] mb-6">
            Industrias que atendemos
          </h2>
          <div className="space-y-4 text-[var(--color-fg-muted)] leading-relaxed">
            <p>
              iKingdom trabaja con empresas establecidas que facturan entre $1M
              y $100M+ anuales. Desplegamos un número reducido de sistemas
              completos cada año, solo por solicitud.
            </p>
            <p>
              Nuestros despliegues actuales y previos abarcan construcción,
              tecnología de construcción, capital e inversión, arquitectura,
              hipotecas, mudanzas y almacenamiento, y horticultura.
            </p>
            <p>
              Si tu negocio tiene operaciones reales e ingresos reales, y
              quieres que esas operaciones se ejecuten solas, hablemos.
            </p>
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)] mb-16" />

        {/* Nuestros Valores */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
            06 &mdash; Valores
          </p>
          <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] leading-[1.2] mb-8">
            En qué creemos
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            {valores.map((valor) => (
              <div key={valor.title} className="space-y-2">
                <h3 className="font-display text-lg tracking-[-0.01em]">
                  {valor.title}
                </h3>
                <p className="text-sm text-[var(--color-fg-dim)] leading-relaxed">
                  {valor.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)] mb-12" />

        {/* CTA */}
        <div className="text-center">
          <Link
            href="/es#apply"
            className="inline-block text-sm tracking-wide px-8 py-3 bg-[var(--color-fg)] text-[var(--color-bg)] hover:bg-[var(--color-accent)] transition-all duration-500 rounded-full"
          >
            Iniciar solicitud
          </Link>
        </div>
      </article>
    </>
  );
}
