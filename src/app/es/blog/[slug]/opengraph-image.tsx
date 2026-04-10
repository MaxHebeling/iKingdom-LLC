import { ImageResponse } from "next/og";
import { getPostBySlug } from "@/lib/blog";

export const runtime = "nodejs";

export const alt = "iKingdom Blog";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OgImage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPostBySlug(slug, "es");

  const title = post?.title ?? slug;
  const date = post?.date
    ? new Date(post.date + "T00:00:00").toLocaleDateString("es-ES", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "";

  return new ImageResponse(
    (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          width: "100%",
          height: "100%",
          backgroundColor: "#0A0A0A",
          padding: "60px 80px",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 24,
            color: "#c9a96e",
            fontFamily: "serif",
            letterSpacing: "0.12em",
            textTransform: "uppercase" as const,
          }}
        >
          iKingdom Blog
        </div>
        <div
          style={{
            display: "flex",
            fontSize: title.length > 80 ? 40 : 52,
            color: "#ffffff",
            fontFamily: "serif",
            lineHeight: 1.2,
            maxWidth: "1040px",
          }}
        >
          {title}
        </div>
        <div
          style={{
            display: "flex",
            fontSize: 18,
            color: "#888888",
            fontFamily: "sans-serif",
          }}
        >
          {date}
        </div>
      </div>
    ),
    { ...size },
  );
}
