import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import JsonLdSchemas from "@/components/JsonLdSchemas";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#fbfbfa",
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: {
    default: "iKingdom — The World's First AI Operations Firm | San Diego, CA",
    template: "%s | iKingdom",
  },
  description:
    "We design and deploy 80 autonomous AI agents across 9 tiers to run your business. San Diego, CA. By application only.",
  metadataBase: new URL("https://www.ikingdom.org"),
  keywords: [
    "AI operations firm",
    "autonomous business operations",
    "AI agents for business",
    "business automation San Diego",
    "AI deployment services",
    "autonomous AI systems",
    "iKingdom",
    "AI operations consulting",
    "enterprise AI automation",
    "AI-powered business operations",
  ],
  authors: [{ name: "iKingdom", url: "https://www.ikingdom.org" }],
  creator: "iKingdom",
  publisher: "iKingdom",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "any" },
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-96x96.png", sizes: "96x96", type: "image/png" },
    ],
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
  alternates: {
    canonical: "https://www.ikingdom.org",
    languages: {
      en: "https://www.ikingdom.org",
      es: "https://www.ikingdom.org/es",
      "x-default": "https://www.ikingdom.org",
    },
  },
  openGraph: {
    title: "iKingdom — The World's First AI Operations Firm",
    description:
      "We design and deploy autonomous AI operations for ambitious companies. 80 agents. 9 tiers. One fully automated business. Based in San Diego, CA. By application only.",
    type: "website",
    url: "https://www.ikingdom.org",
    siteName: "iKingdom",
    locale: "en_US",
    alternateLocale: "es_ES",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "iKingdom — 80 AI Agents. 9 Tiers. One Autonomous Business.",
        type: "image/png",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "iKingdom — The World's First AI Operations Firm",
    description:
      "We design and deploy autonomous AI operations for ambitious companies. 80 agents. 9 tiers. By application only.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  category: "technology",
  other: {
    "geo.region": "US-CA",
    "geo.placename": "San Diego",
    "geo.position": "32.7157;-117.1611",
    ICBM: "32.7157, -117.1611",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} antialiased`}
    >
      <head>
        <link rel="dns-prefetch" href="https://fonts.googleapis.com" />
        <link rel="dns-prefetch" href="https://fonts.gstatic.com" />
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <JsonLdSchemas />
      </head>
      <body className="relative">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[--color-fg] focus:text-[--color-bg] focus:rounded-md focus:text-sm focus:outline-none"
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
