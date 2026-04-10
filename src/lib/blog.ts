import fs from "fs";
import path from "path";

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  author: string;
  tags: string[];
  image?: string;
  content: string;
  html: string;
  readTime: number;
  locale: "en" | "es";
}

export type BlogPostMeta = Omit<BlogPost, "content" | "html">;

/* ------------------------------------------------------------------ */
/*  Frontmatter parser (manual YAML — no external deps)               */
/* ------------------------------------------------------------------ */

function parseFrontmatter(raw: string): {
  data: Record<string, unknown>;
  content: string;
} {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { data: {}, content: raw };

  const yamlBlock = match[1];
  const content = match[2];
  const data: Record<string, unknown> = {};

  for (const line of yamlBlock.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;

    const colonIdx = trimmed.indexOf(":");
    if (colonIdx === -1) continue;

    const key = trimmed.slice(0, colonIdx).trim();
    let value: string | string[] = trimmed.slice(colonIdx + 1).trim();

    // Strip surrounding quotes
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }

    // Parse inline YAML arrays: ["a", "b"]
    if (typeof value === "string" && value.startsWith("[") && value.endsWith("]")) {
      const inner = value.slice(1, -1);
      value = inner
        .split(",")
        .map((s) => s.trim().replace(/^["']|["']$/g, ""))
        .filter(Boolean);
    }

    data[key] = value;
  }

  return { data, content };
}

/* ------------------------------------------------------------------ */
/*  Markdown → HTML converter (regex-based, no external deps)         */
/* ------------------------------------------------------------------ */

function markdownToHtml(md: string): string {
  let html = md;

  // Fenced code blocks (```lang ... ```)
  html = html.replace(
    /```(\w*)\n([\s\S]*?)```/g,
    (_match, lang: string, code: string) => {
      const escaped = escapeHtml(code.trimEnd());
      const cls = lang ? ` class="language-${lang}"` : "";
      return `<pre><code${cls}>${escaped}</code></pre>`;
    },
  );

  // Inline code (must come after fenced blocks)
  html = html.replace(/`([^`]+)`/g, "<code>$1</code>");

  // Headings (# through ######)
  html = html.replace(/^######\s+(.+)$/gm, "<h6>$1</h6>");
  html = html.replace(/^#####\s+(.+)$/gm, "<h5>$1</h5>");
  html = html.replace(/^####\s+(.+)$/gm, "<h4>$1</h4>");
  html = html.replace(/^###\s+(.+)$/gm, "<h3>$1</h3>");
  html = html.replace(/^##\s+(.+)$/gm, "<h2>$1</h2>");
  html = html.replace(/^#\s+(.+)$/gm, "<h1>$1</h1>");

  // Horizontal rules
  html = html.replace(/^(?:---|\*\*\*|___)\s*$/gm, "<hr />");

  // Blockquotes
  html = html.replace(/^>\s*(.+)$/gm, "<blockquote><p>$1</p></blockquote>");
  // Merge consecutive blockquotes
  html = html.replace(/<\/blockquote>\n<blockquote>/g, "\n");

  // Images ![alt](src)
  html = html.replace(
    /!\[([^\]]*)\]\(([^)]+)\)/g,
    '<img src="$2" alt="$1" loading="lazy" />',
  );

  // Links [text](url)
  html = html.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>',
  );

  // Bold & italic
  html = html.replace(/\*\*\*(.+?)\*\*\*/g, "<strong><em>$1</em></strong>");
  html = html.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
  html = html.replace(/\*(.+?)\*/g, "<em>$1</em>");
  html = html.replace(/___(.+?)___/g, "<strong><em>$1</em></strong>");
  html = html.replace(/__(.+?)__/g, "<strong>$1</strong>");
  html = html.replace(/_(.+?)_/g, "<em>$1</em>");

  // Unordered lists
  html = html.replace(/^[\t ]*[-*+]\s+(.+)$/gm, "<li>$1</li>");
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, "<ul>\n$1</ul>\n");

  // Ordered lists
  html = html.replace(/^[\t ]*\d+\.\s+(.+)$/gm, "<li>$1</li>");
  // (ordered list items that aren't already inside <ul>)
  html = html.replace(
    /(?<!<\/ul>\n)((?:<li>.*<\/li>\n?)+)(?!<\/ul>)/g,
    "<ol>\n$1</ol>\n",
  );

  // Paragraphs: wrap remaining loose lines
  const lines = html.split("\n");
  const result: string[] = [];
  const blockTags =
    /^<(h[1-6]|p|ul|ol|li|pre|blockquote|hr|img|div|table|thead|tbody|tr|td|th)/;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) {
      result.push("");
      continue;
    }
    if (blockTags.test(line) || line.startsWith("</")) {
      result.push(lines[i]);
    } else {
      result.push(`<p>${line}</p>`);
    }
  }

  return result.join("\n").trim();
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/* ------------------------------------------------------------------ */
/*  Read time estimator                                                */
/* ------------------------------------------------------------------ */

function estimateReadTime(text: string): number {
  const words = text.split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 225));
}

/* ------------------------------------------------------------------ */
/*  Public API                                                         */
/* ------------------------------------------------------------------ */

const CONTENT_DIR = path.join(process.cwd(), "content", "blog");

function getPostsDir(locale: "en" | "es"): string {
  return path.join(CONTENT_DIR, locale);
}

export function getAllPosts(locale: "en" | "es" = "en"): BlogPostMeta[] {
  const dir = getPostsDir(locale);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  const posts: BlogPostMeta[] = files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = parseFrontmatter(raw);

    const slug =
      (data.slug as string) || file.replace(/\.md$/, "");
    const tags = Array.isArray(data.tags) ? (data.tags as string[]) : [];

    return {
      slug,
      title: (data.title as string) || slug,
      description: (data.description as string) || "",
      date: (data.date as string) || "",
      author: (data.author as string) || "iKingdom",
      tags,
      image: (data.image as string) || undefined,
      readTime: estimateReadTime(content),
      locale,
    };
  });

  return posts.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );
}

export function getPostBySlug(
  slug: string,
  locale: "en" | "es" = "en",
): BlogPost | null {
  const dir = getPostsDir(locale);
  if (!fs.existsSync(dir)) return null;

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md"));

  for (const file of files) {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = parseFrontmatter(raw);
    const fileSlug =
      (data.slug as string) || file.replace(/\.md$/, "");

    if (fileSlug === slug) {
      const tags = Array.isArray(data.tags) ? (data.tags as string[]) : [];
      return {
        slug: fileSlug,
        title: (data.title as string) || fileSlug,
        description: (data.description as string) || "",
        date: (data.date as string) || "",
        author: (data.author as string) || "iKingdom",
        tags,
        image: (data.image as string) || undefined,
        content,
        html: markdownToHtml(content),
        readTime: estimateReadTime(content),
        locale,
      };
    }
  }

  return null;
}

export function getAllSlugs(locale: "en" | "es" = "en"): string[] {
  return getAllPosts(locale).map((p) => p.slug);
}
