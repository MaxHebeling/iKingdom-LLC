import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Nosotros — iKingdom",
  description:
    "iKingdom es la primera firma de operaciones con IA del mundo. Fundada por Jordan Talavera en San Diego, CA. 80 agentes, 9 niveles, operaciones totalmente autonomas.",
  alternates: {
    canonical: "https://www.ikingdom.org/es/about",
    languages: {
      en: "https://www.ikingdom.org/about",
      es: "https://www.ikingdom.org/es/about",
    },
  },
  openGraph: {
    title: "Nosotros — iKingdom",
    description:
      "La firma detras del sistema. Conoce a iKingdom, nuestro fundador Jordan Talavera y como desplegamos 80 agentes de IA en 9 niveles.",
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
        alt: "Nosotros — iKingdom, La Primera Firma de Operaciones con IA",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Nosotros — iKingdom",
    description:
      "La firma detras del sistema. 80 agentes de IA. 9 niveles. Fundada por Jordan Talavera en San Diego, CA.",
    images: ["/og-image.png"],
  },
};

const valores = [
  {
    title: "Autonomia sobre dependencia",
    description:
      "Construimos sistemas que son tuyos. Sin mensualidades para acceder a tus propias operaciones. Cuando nos vamos, el sistema se queda.",
  },
  {
    title: "Precision antes que escala",
    description:
      "Cada agente debe alcanzar un 98% de precision antes de graduarse a autonomia completa. No lanzamos rapido para arreglar despues.",
  },
  {
    title: "Sistemas, no capturas",
    description:
      "Un dashboard es una captura. Un sistema es lo que opera el negocio. Nosotros construimos sistemas.",
  },
  {
    title: "Propiedad, no licenciamiento",
    description:
      "Tu eres dueno de tu despliegue, tus agentes, tus datos. iKingdom es el constructor, no el arrendador.",
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
      "Operaciones con IA",
      "Agentes Autonomos",
      "Automatizacion Empresarial",
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
            La firma detras del sistema
          </h1>
          <p className="text-lg text-[var(--color-fg-muted)] leading-relaxed max-w-[640px]">
            iKingdom es la primera firma de operaciones con IA del mundo. No
            asesoramos. No consultamos. Construimos lo que opera tu empresa.
          </p>
        </header>

        <div className="h-px bg-[var(--color-line)] mb-16" />

        {/* Nuestra Historia */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
            02 &mdash; Nuestra Historia
          </p>
          <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] leading-[1.2] mb-6">
            Origen
          </h2>
          <div className="space-y-4 text-[var(--color-fg-muted)] leading-relaxed">
            <p>
              iKingdom nacio de una premisa: las empresas no necesitan mas
              herramientas. Necesitan operaciones que se ejecuten solas.
            </p>
            <p>
              La empresa tipica funciona con docenas de plataformas desconectadas,
              cada una requiriendo una persona para operarla, un gerente para
              supervisarla y un proceso para mantenerla. El resultado es una
              empresa que depende completamente de la disponibilidad humana para
              funcionar. Saca a un empleado clave y toda la cadena se rompe.
            </p>
            <p>
              Nos propusimos resolver eso. No reemplazando personas, sino
              construyendo una capa operativa que maneja el trabajo repetitivo y de
              alto volumen de forma autonoma&mdash;para que las personas que
              quedan se concentren en juicio, relaciones y crecimiento.
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
              Jordan es un constructor. Antes de iKingdom, paso anos disenando y
              desplegando sistemas operativos en multiples industrias&mdash;construccion,
              finanzas, bienes raices y tecnologia&mdash;aprendiendo de primera
              mano que se rompe cuando un negocio escala sin infraestructura.
            </p>
            <p>
              Desde San Diego, California, Jordan fundo iKingdom para cerrar la
              brecha entre lo que la IA puede hacer y lo que las empresas
              realmente necesitan que haga. No un chatbot. No un dashboard. Una
              capa operativa completamente autonoma que reemplaza el trabajo
              manual del que la mayoria de las empresas aun dependen.
            </p>
            <p>
              Lidera personalmente cada proyecto, desde la arquitectura hasta la
              graduacion.
            </p>
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)] mb-16" />

        {/* Que Hacemos */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
            04 &mdash; Que Hacemos
          </p>
          <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] leading-[1.2] mb-6">
            80 agentes. 9 niveles. Un sistema.
          </h2>
          <div className="space-y-4 text-[var(--color-fg-muted)] leading-relaxed">
            <p>
              Cada despliegue de iKingdom sigue la misma arquitectura: 80 agentes
              de IA especializados organizados en 9 niveles operativos. Juntos
              cubren todo, desde la captacion de leads y calificacion hasta
              facturacion, reportes e inteligencia interna.
            </p>
            <p>
              Los agentes no se lanzan autonomos. Comienzan bajo revision humana.
              Cuando un agente cruza el 98% de precision en una muestra
              significativa, su checkpoint se gradua&mdash;la supervision se
              retira y el agente opera solo. Este es el Modelo de Graduacion por
              Checkpoint, y es como garantizamos precision sin sacrificar
              velocidad.
            </p>
            <p>
              El despliegue completo toma 12 meses. Para el mes 18, la mayoria de
              los clientes dejan de pensar en el sistema. Simplemente funciona.
            </p>
          </div>
        </section>

        <div className="h-px bg-[var(--color-line)] mb-16" />

        {/* Nuestros Clientes */}
        <section className="mb-16">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
            05 &mdash; Nuestros Clientes
          </p>
          <h2 className="font-display text-2xl md:text-3xl tracking-[-0.02em] leading-[1.2] mb-6">
            Industrias que atendemos
          </h2>
          <div className="space-y-4 text-[var(--color-fg-muted)] leading-relaxed">
            <p>
              iKingdom trabaja con empresas operativas establecidas que facturan
              entre $1M y $100M+ anuales. Desplegamos un numero reducido de
              sistemas completos cada ano, solo por aplicacion.
            </p>
            <p>
              Nuestros compromisos actuales y pasados abarcan construccion,
              tecnologia de construccion, capital e inversion, arquitectura,
              hipotecas, mudanzas y almacenamiento, y horticultura.
            </p>
            <p>
              Si tu negocio tiene operaciones reales e ingresos reales, y quieres
              que esas operaciones se ejecuten solas, hablemos.
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
            En que creemos
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
            Solicitar un compromiso
          </Link>
        </div>
      </article>
    </>
  );
}
