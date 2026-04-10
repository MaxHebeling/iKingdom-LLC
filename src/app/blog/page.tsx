import type { Metadata } from "next";
import Link from "next/link";
import { getAllPosts } from "@/lib/blog";
import BlogCard from "@/components/BlogCard";
import NewsletterSignup from "@/components/NewsletterSignup";

export const metadata: Metadata = {
  title: "Blog — AI Operations Insights",
  description:
    "Insights on AI operations, autonomous agents, and business automation from iKingdom. Learn how to deploy AI systems that run your business.",
  openGraph: {
    title: "Blog — AI Operations Insights | iKingdom",
    description:
      "Insights on AI operations, autonomous agents, and business automation from iKingdom.",
    type: "website",
    url: "https://www.ikingdom.org/blog",
    siteName: "iKingdom",
    locale: "en_US",
    alternateLocale: "es_ES",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "iKingdom Blog — AI Operations Insights",
      },
    ],
  },
  alternates: {
    canonical: "https://www.ikingdom.org/blog",
    languages: {
      en: "https://www.ikingdom.org/blog",
      es: "https://www.ikingdom.org/es/blog",
    },
  },
};

export default function BlogPage() {
  const posts = getAllPosts("en");

  return (
    <>
      <header className="pt-32 md:pt-40 pb-16 md:pb-20 px-6 md:px-10 max-w-[1400px] mx-auto">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
          01 &mdash; Blog
        </p>
        <h1 className="font-display text-4xl md:text-6xl tracking-[-0.02em] mb-6">
          AI Operations Insights
        </h1>
        <p className="text-[var(--color-fg-dim)] max-w-2xl text-lg leading-relaxed">
          Perspectives on autonomous AI systems, operational intelligence, and
          the future of business automation.
        </p>
        <div className="mt-8 flex items-center gap-4 text-sm">
          <Link
            href="/es/blog"
            hrefLang="es"
            className="text-[var(--color-fg-dim)] hover:text-[var(--color-accent)] transition-colors duration-300 underline underline-offset-4 decoration-[var(--color-line)]"
          >
            Leer en Espanol
          </Link>
        </div>
      </header>

      <div className="border-t border-[var(--color-line)]" />

      <main className="px-6 md:px-10 py-16 md:py-20 max-w-[1400px] mx-auto">
        {posts.length === 0 ? (
          <p className="text-[var(--color-fg-dim)] text-center py-20">
            No posts yet. Check back soon.
          </p>
        ) : (
          <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <BlogCard key={post.slug} post={post} />
            ))}
          </div>
        )}
      </main>

      <NewsletterSignup lang="en" />
    </>
  );
}
