// JsonLdSchemas — emits Schema.org markup for SEO + AI Overviews.
//
// Two modes:
//   <JsonLdSchemas />                       — site-wide schemas (Organization
//                                             + WebSite). Mount in layout.tsx.
//   <JsonLdSchemas page="home" lang="en" /> — page-specific schemas (WebPage,
//                                             FAQPage, Service, Breadcrumb).
//                                             Only mount on pages where the
//                                             schema actually matches visible
//                                             content (FAQPage on every page
//                                             violates Google's policy and
//                                             can trigger manual actions).

type Lang = "en" | "es";

type Props = {
  page?: "home";
  lang?: Lang;
};

const BASE_URL = "https://www.ikingdom.org";

function siteWideSchemas() {
  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${BASE_URL}/#organization`,
    name: "iKingdom",
    alternateName: "iKingdom LLC",
    url: BASE_URL,
    logo: {
      "@type": "ImageObject",
      url: `${BASE_URL}/ikingdom-logo.png`,
      width: 220,
      height: 56,
    },
    image: `${BASE_URL}/og-image.png`,
    description:
      "The world's first AI operations firm. iKingdom designs and deploys autonomous AI operations for ambitious companies doing $1M-$100M+. 80 agents. 9 tiers. 12-month deployment.",
    founder: {
      "@type": "Person",
      name: "Jordan Talavera",
      jobTitle: "Founder & CEO",
      url: `${BASE_URL}/about`,
    },
    email: "executive@ikingdom.org",
    address: {
      "@type": "PostalAddress",
      addressLocality: "San Diego",
      addressRegion: "CA",
      addressCountry: "US",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 32.7157,
      longitude: -117.1611,
    },
    areaServed: [
      {
        "@type": "City",
        name: "San Diego",
        sameAs: "https://en.wikipedia.org/wiki/San_Diego",
      },
      { "@type": "State", name: "California" },
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Mexico" },
    ],
    availableLanguage: ["English", "Spanish"],
    serviceType: [
      "AI Operations Consulting",
      "Autonomous AI Agent Deployment",
      "Business Process Automation",
      "AI Systems Integration",
    ],
    knowsAbout: [
      "Artificial Intelligence",
      "AI Operations",
      "Autonomous Agents",
      "Business Automation",
      "AI Deployment",
      "Machine Learning Operations",
    ],
    priceRange: "$$$$",
    sameAs: ["https://www.linkedin.com/company/ikingdom"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      email: "executive@ikingdom.org",
      availableLanguage: ["English", "Spanish"],
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "AI Operations Engagement Tiers",
      itemListElement: [
        {
          "@type": "Offer",
          name: "Pilot Engagement",
          price: "35000",
          priceCurrency: "USD",
          itemOffered: {
            "@type": "Service",
            name: "Pilot Engagement",
            description:
              "Single workflow proof of concept with approximately 15 AI agents.",
          },
        },
        {
          "@type": "Offer",
          name: "Foundation",
          price: "50000",
          priceCurrency: "USD",
          itemOffered: {
            "@type": "Service",
            name: "Foundation Deployment",
            description:
              "1-2 functional tiers, partial deployment with approximately 30 AI agents.",
          },
        },
        {
          "@type": "Offer",
          name: "Standard",
          price: "100000",
          priceCurrency: "USD",
          itemOffered: {
            "@type": "Service",
            name: "Standard Full Deployment",
            description:
              "Full operational layer across all 9 tiers with 80 AI agents — the iKingdom flagship engagement.",
          },
        },
        {
          "@type": "Offer",
          name: "Enterprise",
          price: "500000",
          priceCurrency: "USD",
          itemOffered: {
            "@type": "Service",
            name: "Enterprise Custom Architecture",
            description:
              "Multi-vertical deployment for large organizations with custom AI agent architecture.",
          },
        },
      ],
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "@id": `${BASE_URL}/#website`,
    name: "iKingdom",
    url: BASE_URL,
    description:
      "The world's first AI operations firm. Designing and deploying autonomous AI operations for ambitious businesses.",
    publisher: { "@id": `${BASE_URL}/#organization` },
    inLanguage: ["en", "es"],
    potentialAction: {
      "@type": "ReadAction",
      target: [BASE_URL, `${BASE_URL}/es`],
    },
  };

  return [organizationJsonLd, websiteJsonLd];
}

const HOMEPAGE_COPY = {
  en: {
    pageUrl: BASE_URL,
    pageName: "iKingdom — The World's First AI Operations Firm",
    pageDescription:
      "iKingdom designs and deploys autonomous AI operations for businesses doing $1M-$100M+. 80 agents, 9 tiers, 12-month deployment.",
    breadcrumbHome: "Home",
    serviceDescription:
      "Full-stack autonomous AI operations deployment for businesses doing $1M-$100M+. 80 AI agents across 9 operational tiers covering application intake, discovery, contracting, build, integration, deployment, client success, finance, and intelligence.",
    serviceOutputDescription:
      "A fully deployed, self-operating business system with 80 AI agents across 9 tiers that runs your company from lead capture to invoicing.",
    faqs: [
      {
        q: "What is iKingdom?",
        a: "iKingdom is the world's first AI operations firm. We design and deploy autonomous AI operations inside ambitious businesses using 80 coordinated AI agents across 9 operational tiers.",
      },
      {
        q: "How much does iKingdom cost?",
        a: "iKingdom offers four investment tiers: Pilot Engagement ($35,000) for a single workflow proof of concept, Foundation ($50,000) for 1-2 functional tiers, Standard ($100,000) for the full 80-agent deployment, and Enterprise ($500,000+) for multi-vertical organizations.",
      },
      {
        q: "How long does an iKingdom deployment take?",
        a: "A full iKingdom deployment takes 12 months across four phases: Discovery & Architecture (months 1-2), Build & Integrate (months 3-6), Deploy & Supervise (months 7-10), and Graduate & Scale (months 11-12).",
      },
      {
        q: "What size businesses does iKingdom work with?",
        a: "iKingdom works with established operating businesses generating six-figure or larger annual revenue, typically between $1M and $100M+. We deploy a small number of full-stack systems each year, by application only.",
      },
      {
        q: "What is the Checkpoint Graduation Model?",
        a: "The Checkpoint Graduation Model is iKingdom's trust-based autonomy framework. Every AI agent begins under human review. When an agent crosses 98% accuracy across a meaningful sample, its checkpoint graduates — supervision is removed and the agent runs autonomously. By month 18, most clients stop thinking about the system entirely.",
      },
      {
        q: "What are the 9 tiers of the iKingdom system?",
        a: "The 9 tiers are: (1) Application Intake & Qualification, (2) Discovery & Architecture, (3) Engagement & Contracting, (4) Build & Code Generation, (5) Integration & Data, (6) Deployment & Supervision, (7) Client Success & Communication, (8) Finance & Operations, and (9) Intelligence & Learning. Together they cover 80 specialized AI agents.",
      },
      {
        q: "Where is iKingdom based?",
        a: "iKingdom is headquartered in San Diego, California. We serve clients across the United States and Mexico with bilingual English/Spanish support. Deployments are remote-capable and we work with businesses nationwide.",
      },
      {
        q: "What makes iKingdom different from AI consulting firms?",
        a: "iKingdom doesn't just consult — we build and deploy. We use the same 80-agent, 9-tier system on ourselves that we install for clients. Every agent must achieve 98% accuracy before graduating to full autonomy. You own the system forever.",
      },
    ],
  },
  es: {
    pageUrl: `${BASE_URL}/es`,
    pageName: "iKingdom — La primera firma de operaciones de IA del mundo",
    pageDescription:
      "iKingdom diseña y despliega operaciones autónomas de IA para empresas que facturan entre $1M y $100M+. 80 agentes, 9 niveles, despliegue de 12 meses.",
    breadcrumbHome: "Inicio",
    serviceDescription:
      "Despliegue completo de operaciones autónomas con IA para empresas que facturan $1M-$100M+. 80 agentes de IA en 9 niveles operacionales que cubren recepción de solicitudes, descubrimiento, contratación, construcción, integración, despliegue, éxito del cliente, finanzas e inteligencia.",
    serviceOutputDescription:
      "Un sistema empresarial completamente desplegado y auto-operativo, con 80 agentes de IA en 9 niveles, que opera tu empresa desde la captación de prospectos hasta la facturación.",
    faqs: [
      {
        q: "¿Qué es iKingdom?",
        a: "iKingdom es la primera firma de operaciones de IA del mundo. Diseñamos y desplegamos operaciones autónomas de IA dentro de empresas ambiciosas, usando 80 agentes de IA coordinados en 9 niveles operacionales.",
      },
      {
        q: "¿Cuánto cuesta iKingdom?",
        a: "iKingdom ofrece cuatro niveles de inversión: Pilot Engagement ($35,000) para una prueba de concepto de un solo workflow, Foundation ($50,000) para 1-2 niveles funcionales, Standard ($100,000) para el despliegue completo de 80 agentes, y Enterprise ($500,000+) para organizaciones multi-vertical.",
      },
      {
        q: "¿Cuánto dura un despliegue de iKingdom?",
        a: "Un despliegue completo de iKingdom toma 12 meses, repartidos en cuatro fases: Descubrimiento y Arquitectura (meses 1-2), Construcción e Integración (meses 3-6), Despliegue y Supervisión (meses 7-10), y Graduación y Escala (meses 11-12).",
      },
      {
        q: "¿Con qué tamaño de empresas trabaja iKingdom?",
        a: "iKingdom trabaja con empresas establecidas que generan ingresos anuales de seis cifras o más, típicamente entre $1M y $100M+. Desplegamos un número reducido de sistemas completos cada año, solo por solicitud.",
      },
      {
        q: "¿Qué es el Modelo de Graduación por Checkpoint?",
        a: "El Modelo de Graduación por Checkpoint es el marco de autonomía basado en confianza de iKingdom. Cada agente de IA comienza bajo revisión humana. Cuando un agente supera el 98% de precisión en una muestra significativa, su checkpoint se gradúa — la supervisión se retira y el agente opera de forma autónoma. A los 18 meses, la mayoría de los clientes ya no piensa en el sistema.",
      },
      {
        q: "¿Cuáles son los 9 niveles del sistema iKingdom?",
        a: "Los 9 niveles son: (1) Recepción y Calificación de Solicitudes, (2) Descubrimiento y Arquitectura, (3) Compromiso y Contratación, (4) Construcción y Generación de Código, (5) Integración y Datos, (6) Despliegue y Supervisión, (7) Éxito del Cliente y Comunicación, (8) Finanzas y Operaciones, y (9) Inteligencia y Aprendizaje. En conjunto abarcan 80 agentes de IA especializados.",
      },
      {
        q: "¿Dónde tiene su sede iKingdom?",
        a: "iKingdom tiene su sede en San Diego, California. Atendemos clientes en Estados Unidos y México con soporte bilingüe inglés/español. Los despliegues son remotos y trabajamos con empresas a nivel nacional e internacional.",
      },
      {
        q: "¿Qué hace diferente a iKingdom de las firmas de consultoría en IA?",
        a: "iKingdom no solo asesora — construye y despliega. Usamos el mismo sistema de 80 agentes y 9 niveles internamente que instalamos para nuestros clientes. Cada agente debe alcanzar el 98% de precisión antes de graduarse a autonomía completa. El sistema te pertenece para siempre.",
      },
    ],
  },
} as const;

function homepageSchemas(lang: Lang) {
  const t = HOMEPAGE_COPY[lang];

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${t.pageUrl}/#webpage`,
    url: t.pageUrl,
    name: t.pageName,
    description: t.pageDescription,
    isPartOf: { "@id": `${BASE_URL}/#website` },
    about: { "@id": `${BASE_URL}/#organization` },
    inLanguage: lang,
    datePublished: "2025-01-01",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${BASE_URL}/og-image.png`,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: lang,
    mainEntity: t.faqs.map((f) => ({
      "@type": "Question",
      name: f.q,
      acceptedAnswer: { "@type": "Answer", text: f.a },
    })),
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Operations Deployment",
    provider: { "@id": `${BASE_URL}/#organization` },
    description: t.serviceDescription,
    serviceType: "AI Operations Consulting & Deployment",
    areaServed: [
      { "@type": "Country", name: "United States" },
      { "@type": "Country", name: "Mexico" },
    ],
    offers: {
      "@type": "AggregateOffer",
      priceCurrency: "USD",
      lowPrice: "35000",
      highPrice: "500000",
      offerCount: "4",
    },
    termsOfService: "By application only",
    serviceOutput: {
      "@type": "Thing",
      name: "Autonomous AI Operations System",
      description: t.serviceOutputDescription,
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: t.breadcrumbHome,
        item: t.pageUrl,
      },
    ],
  };

  return [webPageJsonLd, faqJsonLd, serviceJsonLd, breadcrumbJsonLd];
}

export default function JsonLdSchemas({ page, lang = "en" }: Props = {}) {
  const schemas = page === "home" ? homepageSchemas(lang) : siteWideSchemas();

  return (
    <>
      {schemas.map((schema, i) => (
        <script
          // eslint-disable-next-line react/no-array-index-key
          key={i}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
        />
      ))}
    </>
  );
}
