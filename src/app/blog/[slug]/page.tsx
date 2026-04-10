import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAllSlugs, getPostBySlug } from "@/lib/blog";
import Breadcrumbs from "@/components/Breadcrumbs";

/* ------------------------------------------------------------------ */
/*  Static params                                                      */
/* ------------------------------------------------------------------ */

export function generateStaticParams() {
  return getAllSlugs("en").map((slug) => ({ slug }));
}

/* ------------------------------------------------------------------ */
/*  Metadata                                                           */
/* ------------------------------------------------------------------ */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug, "en");
  if (!post) return {};

  const url = `https://www.ikingdom.org/blog/${post.slug}`;
  const esUrl = `https://www.ikingdom.org/es/blog/${post.slug}`;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.description,
      type: "article",
      url,
      siteName: "iKingdom",
      locale: "en_US",
      alternateLocale: "es_ES",
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.image
        ? [{ url: post.image, width: 1200, height: 630, alt: post.title }]
        : [{ url: "/og-image.png", width: 1200, height: 630, alt: post.title }],
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.description,
      images: post.image ? [post.image] : ["/og-image.png"],
    },
    alternates: {
      canonical: url,
      languages: {
        en: url,
        es: esUrl,
      },
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function formatDate(dateStr: string): string {
  try {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug, "en");
  if (!post) notFound();

  const esUrl = `https://www.ikingdom.org/es/blog/${post.slug}`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    datePublished: post.date,
    author: {
      "@type": "Organization",
      name: post.author,
      url: "https://www.ikingdom.org",
    },
    publisher: {
      "@type": "Organization",
      name: "iKingdom",
      url: "https://www.ikingdom.org",
      logo: {
        "@type": "ImageObject",
        url: "https://www.ikingdom.org/ikingdom-logo.png",
      },
    },
    mainEntityOfPage: `https://www.ikingdom.org/blog/${post.slug}`,
    image: post.image
      ? `https://www.ikingdom.org${post.image}`
      : "https://www.ikingdom.org/og-image.png",
    keywords: post.tags.join(", "),
    inLanguage: "en",
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hreflang */}
      <link
        rel="alternate"
        hrefLang="en"
        href={`https://www.ikingdom.org/blog/${post.slug}`}
      />
      <link rel="alternate" hrefLang="es" href={esUrl} />

      <article className="pt-32 md:pt-40 pb-20 md:pb-28 px-6 md:px-10 max-w-[800px] mx-auto">
        {/* Breadcrumbs */}
        <Breadcrumbs
          items={[
            { label: "Home", href: "https://www.ikingdom.org" },
            { label: "Blog", href: "https://www.ikingdom.org/blog" },
            { label: post.title },
          ]}
        />

        {/* Back link */}
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-sm text-[var(--color-fg-dim)] hover:text-[var(--color-accent)] transition-colors duration-300 mb-10"
        >
          <span aria-hidden="true">&larr;</span> Back to Blog
        </Link>

        {/* Header */}
        <header className="mb-12">
          <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
            01 &mdash; Blog
          </p>
          <h1 className="font-display text-3xl md:text-5xl tracking-[-0.02em] leading-[1.1] mb-6">
            {post.title}
          </h1>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--color-fg-dim)]">
            <span>{post.author}</span>
            <span aria-hidden="true" className="w-1 h-1 rounded-full bg-[var(--color-fg-dim)]" />
            <time dateTime={post.date}>{formatDate(post.date)}</time>
            <span aria-hidden="true" className="w-1 h-1 rounded-full bg-[var(--color-fg-dim)]" />
            <span>{post.readTime} min read</span>
          </div>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-5">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[11px] uppercase tracking-[0.12em] px-2.5 py-1 border border-[var(--color-line)] text-[var(--color-fg-dim)]"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </header>

        <div className="h-px bg-[var(--color-line)] mb-12" />

        {/* Article body */}
        <div
          className="prose-ikingdom"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />

        <div className="h-px bg-[var(--color-line)] mt-16 mb-8" />

        {/* Footer nav */}
        <div className="flex items-center justify-between text-sm">
          <Link
            href="/blog"
            className="text-[var(--color-fg-dim)] hover:text-[var(--color-accent)] transition-colors duration-300"
          >
            &larr; All posts
          </Link>
          <Link
            href={`/es/blog/${post.slug}`}
            hrefLang="es"
            className="text-[var(--color-fg-dim)] hover:text-[var(--color-accent)] transition-colors duration-300"
          >
            Leer en Espanol &rarr;
          </Link>
        </div>
      </article>
    </>
  );
}
