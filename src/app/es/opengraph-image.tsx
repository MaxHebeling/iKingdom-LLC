import { ImageResponse } from "next/og";
import OGImage from "@/components/OGImage";

export const runtime = "edge";
export const alt =
  "iKingdom — 80 Agentes de IA. 9 Niveles. Una Empresa Autonoma. San Diego, CA.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <OGImage
        title="La primera firma de operaciones de IA del mundo"
        subtitle="Ochenta agentes. Nueve niveles. Una empresa completamente automatizada."
      />
    ),
    {
      ...size,
    },
  );
}
