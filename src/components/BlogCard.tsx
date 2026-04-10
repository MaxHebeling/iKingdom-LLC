import Link from "next/link";
import type { BlogPostMeta } from "@/lib/blog";

function formatDate(dateStr: string, locale: "en" | "es"): string {
  try {
    const date = new Date(dateStr + "T00:00:00");
    return date.toLocaleDateString(locale === "es" ? "es-ES" : "en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateStr;
  }
}

export default function BlogCard({ post }: { post: BlogPostMeta }) {
  const href =
    post.locale === "es" ? `/es/blog/${post.slug}` : `/blog/${post.slug}`;
  const readLabel = post.locale === "es" ? "min de lectura" : "min read";

  return (
    <Link href={href} className="group block">
      <article className="relative h-full border border-[var(--color-line)] bg-[var(--color-bg-card)] p-6 md:p-8 transition-all duration-500 hover:border-[var(--color-accent)] hover:shadow-[0_2px_24px_rgba(201,169,110,0.08)]">
        {/* Top meta line */}
        <div className="flex items-center gap-3 text-xs text-[var(--color-fg-dim)] uppercase tracking-[0.14em] mb-4">
          <time dateTime={post.date}>{formatDate(post.date, post.locale)}</time>
          <span aria-hidden="true" className="w-1 h-1 rounded-full bg-[var(--color-fg-dim)]" />
          <span>
            {post.readTime} {readLabel}
          </span>
        </div>

        {/* Title */}
        <h3 className="font-display text-xl md:text-2xl leading-tight mb-3 group-hover:text-[var(--color-accent)] transition-colors duration-500">
          {post.title}
        </h3>

        {/* Description */}
        <p className="text-sm text-[var(--color-fg-dim)] leading-relaxed mb-5 line-clamp-3">
          {post.description}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-[11px] uppercase tracking-[0.12em] px-2.5 py-1 border border-[var(--color-line)] text-[var(--color-fg-dim)] transition-colors duration-300 group-hover:border-[var(--color-accent)] group-hover:text-[var(--color-accent)]"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        {/* Bottom accent line */}
        <span
          className="absolute bottom-0 left-0 h-px bg-[var(--color-accent)] transition-all duration-500 w-0 group-hover:w-full"
          aria-hidden="true"
        />
      </article>
    </Link>
  );
}
