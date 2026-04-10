import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";

export const metadata: Metadata = {
  title: "Blog — Perspectivas en Operaciones de IA",
  description:
    "Perspectivas sobre operaciones de IA, agentes autonomos y automatizacion empresarial de iKingdom. Aprende a desplegar sistemas de IA que operen tu negocio.",
  openGraph: {
    title: "Blog — Perspectivas en Operaciones de IA | iKingdom",
    description:
      "Perspectivas sobre operaciones de IA, agentes autonomos y automatizacion empresarial de iKingdom.",
    type: "website",
    url: "https://www.ikingdom.org/es/blog",
    siteName: "iKingdom",
    locale: "es_ES",
    alternateLocale: "en_US",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "iKingdom Blog — Perspectivas en Operaciones de IA",
      },
    ],
  },
  alternates: {
    canonical: "https://www.ikingdom.org/es/blog",
    languages: {
      en: "https://www.ikingdom.org/blog",
      es: "https://www.ikingdom.org/es/blog",
    },
  },
};

export default function BlogPageES() {
  const posts = getAllPosts("es");

  return (
    <>
      <header className="pt-32 md:pt-40 pb-16 md:pb-20 px-6 md:px-10 max-w-[1400px] mx-auto">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
          01 &mdash; Blog
        </p>
        <h1 className="font-display text-4xl md:text-6xl tracking-[-0.02em] mb-6">
          Perspectivas en Operaciones de IA
        </h1>
        <p className="text-[var(--color-fg-dim)] max-w-2xl text-lg leading-relaxed">
          Perspectivas sobre sistemas autonomos de IA, inteligencia operativa y
          el futuro de la automatizacion empresarial.
        </p>
        <div className="mt-8 flex items-center gap-4 text-sm">
          <Link
            href="/blog"
            hrefLang="en"
            className="text-[var(--color-fg-dim)] hover:text-[var(--color-accent)] transition-colors duration-300 underline underline-offset-4 decoration-[var(--color-line)]"
          >
            Read in English
          </Link>
        </div>
      </header>

      <div className="border-t border-[var(--color-line)]" />

      <main className="px-6 md:px-10 py-16 md:py-20 max-w-[1400px] mx-auto">
        {posts.length === 0 ? (
          <p className="text-[var(--color-fg-dim)] text-center py-20">
            Aun no hay publicaciones. Vuelve pronto.
          </p>
        ) : (
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </main>
    </>
  );
}
