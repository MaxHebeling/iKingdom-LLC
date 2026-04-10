/**
 * OG Image component for social sharing (1200x630).
 * Render this as a static SVG-based image via Next.js ImageResponse
 * in /app/opengraph-image.tsx, or use as a visual reference.
 *
 * Usage in /app/opengraph-image.tsx:
 *   import { ImageResponse } from 'next/og'
 *   export default async function Image() {
 *     return new ImageResponse(<OGImage />, { width: 1200, height: 630 })
 *   }
 */

export default function OGImage({
  title = "The world's first AI operations firm",
  subtitle = "Eighty agents. Nine tiers. One fully automated business.",
}: {
  title?: string;
  subtitle?: string;
}) {
  return (
    <div
      style={{
        width: 1200,
        height: 630,
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: "#fbfbfa",
        fontFamily: "Inter, system-ui, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Subtle gold radial wash */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background:
            "radial-gradient(ellipse 100% 70% at 50% 0%, rgba(201, 169, 110, 0.1) 0%, transparent 70%)",
        }}
      />

      {/* Top: logo + label */}
      <div style={{ display: "flex", alignItems: "center", gap: 16, zIndex: 1 }}>
        {/* Gold accent bar instead of logo image (works in ImageResponse) */}
        <div
          style={{
            width: 4,
            height: 32,
            background: "#c9a96e",
            borderRadius: 2,
          }}
        />
        <span
          style={{
            fontSize: 18,
            fontWeight: 600,
            letterSpacing: "0.04em",
            color: "#000000",
          }}
        >
          iKingdom
        </span>
        <div
          style={{
            marginLeft: 16,
            height: 1,
            flex: 1,
            background: "#e8e8e7",
          }}
        />
        <span
          style={{
            fontSize: 11,
            fontWeight: 500,
            letterSpacing: "0.22em",
            textTransform: "uppercase" as const,
            color: "#5c5c5c",
          }}
        >
          ikingdom.org
        </span>
      </div>

      {/* Center: headline */}
      <div style={{ display: "flex", flexDirection: "column", gap: 20, zIndex: 1 }}>
        <h1
          style={{
            fontSize: 64,
            fontWeight: 400,
            lineHeight: 1.05,
            letterSpacing: "-0.025em",
            color: "#000000",
            maxWidth: 900,
            margin: 0,
          }}
        >
          {title}
        </h1>
        <p
          style={{
            fontSize: 20,
            fontWeight: 500,
            lineHeight: 1.5,
            color: "#1a1a1a",
            maxWidth: 700,
            margin: 0,
          }}
        >
          {subtitle}
        </p>
      </div>

      {/* Bottom: stats bar */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 48,
          borderTop: "1px solid #e8e8e7",
          paddingTop: 24,
          zIndex: 1,
        }}
      >
        <OGStat value="80" label="AI Agents" />
        <OGStat value="9" label="Tiers" />
        <OGStat value="$35K–$500K+" label="Investment" />
        <div style={{ flex: 1 }} />
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: 3,
              background: "#c9a96e",
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 500,
              letterSpacing: "0.2em",
              textTransform: "uppercase" as const,
              color: "#5c5c5c",
            }}
          >
            By application only
          </span>
        </div>
      </div>
    </div>
  );
}

function OGStat({ value, label }: { value: string; label: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <span
        style={{
          fontSize: 28,
          fontWeight: 400,
          letterSpacing: "-0.02em",
          color: "#000000",
          lineHeight: 1,
        }}
      >
        {value}
      </span>
      <span
        style={{
          fontSize: 10,
          fontWeight: 500,
          letterSpacing: "0.18em",
          textTransform: "uppercase" as const,
          color: "#5c5c5c",
        }}
      >
        {label}
      </span>
    </div>
  );
}
