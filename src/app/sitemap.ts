import type { MetadataRoute } from "next";
import { getAllPosts } from "@/lib/blog";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://www.ikingdom.org";
  const lastModified = new Date();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
      alternates: {
        languages: {
          en: baseUrl,
          es: `${baseUrl}/es`,
        },
      },
    },
    {
      url: `${baseUrl}/es`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.9,
      alternates: {
        languages: {
          en: baseUrl,
          es: `${baseUrl}/es`,
        },
      },
    },
    {
      url: `${baseUrl}/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/blog`,
          es: `${baseUrl}/es/blog`,
        },
      },
    },
    {
      url: `${baseUrl}/es/blog`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/blog`,
          es: `${baseUrl}/es/blog`,
        },
      },
    },
    {
      url: `${baseUrl}/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/contact`,
          es: `${baseUrl}/es/contact`,
        },
      },
    },
    {
      url: `${baseUrl}/es/contact`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.6,
      alternates: {
        languages: {
          en: `${baseUrl}/contact`,
          es: `${baseUrl}/es/contact`,
        },
      },
    },
    {
      url: `${baseUrl}/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/about`,
          es: `${baseUrl}/es/about`,
        },
      },
    },
    {
      url: `${baseUrl}/es/about`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/about`,
          es: `${baseUrl}/es/about`,
        },
      },
    },
    {
      url: `${baseUrl}/cases`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/cases`,
          es: `${baseUrl}/es/cases`,
        },
      },
    },
    {
      url: `${baseUrl}/es/cases`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/cases`,
          es: `${baseUrl}/es/cases`,
        },
      },
    },
    {
      // Standalone premium intake form. Bilingual: /application serves EN,
      // /es/application serves ES. Backend is the same /api/client-application.
      url: `${baseUrl}/application`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/application`,
          es: `${baseUrl}/es/application`,
        },
      },
    },
    {
      url: `${baseUrl}/es/application`,
      lastModified,
      changeFrequency: "monthly",
      priority: 0.7,
      alternates: {
        languages: {
          en: `${baseUrl}/application`,
          es: `${baseUrl}/es/application`,
        },
      },
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/privacy`,
          es: `${baseUrl}/es/privacy`,
        },
      },
    },
    {
      url: `${baseUrl}/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.3,
      alternates: {
        languages: {
          en: `${baseUrl}/terms`,
          es: `${baseUrl}/es/terms`,
        },
      },
    },
    {
      url: `${baseUrl}/es/privacy`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
      alternates: {
        languages: {
          en: `${baseUrl}/privacy`,
          es: `${baseUrl}/es/privacy`,
        },
      },
    },
    {
      url: `${baseUrl}/es/terms`,
      lastModified,
      changeFrequency: "yearly",
      priority: 0.2,
      alternates: {
        languages: {
          en: `${baseUrl}/terms`,
          es: `${baseUrl}/es/terms`,
        },
      },
    },
    {
      url: `${baseUrl}/blog/feed.xml`,
      lastModified,
      changeFrequency: "weekly",
      priority: 0.1,
    },
  ];

  // Dynamic blog post pages
  const enPosts = getAllPosts("en");
  const esPosts = getAllPosts("es");
  const esSlugs = new Set(esPosts.map((p) => p.slug));

  const blogPages: MetadataRoute.Sitemap = enPosts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.date),
    changeFrequency: "monthly" as const,
    priority: 0.7,
    alternates: {
      languages: {
        en: `${baseUrl}/blog/${post.slug}`,
        ...(esSlugs.has(post.slug)
          ? { es: `${baseUrl}/es/blog/${post.slug}` }
          : {}),
      },
    },
  }));

  const esBlogPages: MetadataRoute.Sitemap = esPosts
    .filter((post) => !enPosts.some((p) => p.slug === post.slug))
    .map((post) => ({
      url: `${baseUrl}/es/blog/${post.slug}`,
      lastModified: new Date(post.date),
      changeFrequency: "monthly" as const,
      priority: 0.6,
      alternates: {
        languages: {
          es: `${baseUrl}/es/blog/${post.slug}`,
        },
      },
    }));

  return [...staticPages, ...blogPages, ...esBlogPages];
}
