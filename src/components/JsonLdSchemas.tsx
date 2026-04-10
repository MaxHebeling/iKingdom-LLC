export default function JsonLdSchemas() {
  const baseUrl = "https://www.ikingdom.org";

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    "@id": `${baseUrl}/#organization`,
    name: "iKingdom",
    alternateName: "iKingdom LLC",
    url: baseUrl,
    logo: {
      "@type": "ImageObject",
      url: `${baseUrl}/ikingdom-logo.png`,
      width: 220,
      height: 56,
    },
    image: `${baseUrl}/og-image.png`,
    description:
      "The world's first AI operations firm. iKingdom designs and deploys autonomous AI operations for ambitious companies doing $1M-$100M+. 80 agents. 9 tiers. 12-month deployment.",
    founder: {
      "@type": "Person",
      name: "Jordan Talavera",
      jobTitle: "Founder & CEO",
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
      {
        "@type": "State",
        name: "California",
      },
      {
        "@type": "Country",
        name: "United States",
      },
      {
        "@type": "Country",
        name: "Mexico",
      },
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
    sameAs: [],
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
    "@id": `${baseUrl}/#website`,
    name: "iKingdom",
    url: baseUrl,
    description:
      "The world's first AI operations firm. Designing and deploying autonomous AI operations for ambitious businesses.",
    publisher: {
      "@id": `${baseUrl}/#organization`,
    },
    inLanguage: ["en", "es"],
    potentialAction: {
      "@type": "ReadAction",
      target: baseUrl,
    },
  };

  const webPageJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    "@id": `${baseUrl}/#webpage`,
    url: baseUrl,
    name: "iKingdom — The World's First AI Operations Firm",
    description:
      "iKingdom designs and deploys autonomous AI operations for businesses doing $1M-$100M+. 80 agents, 9 tiers, 12-month deployment.",
    isPartOf: {
      "@id": `${baseUrl}/#website`,
    },
    about: {
      "@id": `${baseUrl}/#organization`,
    },
    inLanguage: "en",
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: `${baseUrl}/og-image.png`,
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: "What is iKingdom?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "iKingdom is the world's first AI operations firm. We design and deploy autonomous AI operations inside ambitious businesses using 80 coordinated AI agents across 9 operational tiers.",
        },
      },
      {
        "@type": "Question",
        name: "How much does iKingdom cost?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "iKingdom offers four investment tiers: Pilot Engagement ($35,000) for a single workflow proof of concept, Foundation ($50,000) for 1-2 functional tiers, Standard ($100,000) for the full 80-agent deployment, and Enterprise ($500,000+) for multi-vertical organizations.",
        },
      },
      {
        "@type": "Question",
        name: "How long does an iKingdom deployment take?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "A full iKingdom deployment takes 12 months across four phases: Discovery & Architecture (months 1-2), Build & Integrate (months 3-6), Deploy & Supervise (months 7-10), and Graduate & Scale (months 11-12).",
        },
      },
      {
        "@type": "Question",
        name: "What size businesses does iKingdom work with?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "iKingdom works with established operating businesses generating six-figure or larger annual revenue, typically between $1M and $100M+. We deploy a small number of full-stack systems each year, by application only.",
        },
      },
      {
        "@type": "Question",
        name: "What is the Checkpoint Graduation Model?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The Checkpoint Graduation Model is iKingdom's trust-based autonomy framework. Every AI agent begins under human review. When an agent crosses 98% accuracy across a meaningful sample, its checkpoint graduates — supervision is removed and the agent runs autonomously. By month 18, most clients stop thinking about the system entirely.",
        },
      },
      {
        "@type": "Question",
        name: "What are the 9 tiers of the iKingdom system?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "The 9 tiers are: (1) Application Intake & Qualification, (2) Discovery & Architecture, (3) Engagement & Contracting, (4) Build & Code Generation, (5) Integration & Data, (6) Deployment & Supervision, (7) Client Success & Communication, (8) Finance & Operations, and (9) Intelligence & Learning. Together they cover 80 specialized AI agents.",
        },
      },
      {
        "@type": "Question",
        name: "Where is iKingdom based?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "iKingdom is headquartered in San Diego, California. We serve clients across the United States and Mexico with bilingual English/Spanish support. Deployments are remote-capable and we work with businesses nationwide.",
        },
      },
      {
        "@type": "Question",
        name: "What makes iKingdom different from AI consulting firms?",
        acceptedAnswer: {
          "@type": "Answer",
          text: "iKingdom doesn't just consult — we build and deploy. We use the same 80-agent, 9-tier system on ourselves that we install for clients. Every agent must achieve 98% accuracy before graduating to full autonomy. You own the system forever.",
        },
      },
    ],
  };

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "AI Operations Deployment",
    provider: {
      "@id": `${baseUrl}/#organization`,
    },
    description:
      "Full-stack autonomous AI operations deployment for businesses doing $1M-$100M+. 80 AI agents across 9 operational tiers covering application intake, discovery, contracting, build, integration, deployment, client success, finance, and intelligence.",
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
      description:
        "A fully deployed, self-operating business system with 80 AI agents across 9 tiers that runs your company from lead capture to invoicing.",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: baseUrl,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(serviceJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
    </>
  );
}
