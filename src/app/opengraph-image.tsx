import { ImageResponse } from "next/og";
import OGImage from "@/components/OGImage";

export const runtime = "edge";
export const alt =
  "iKingdom — 80 AI Agents. 9 Tiers. One Autonomous Business. San Diego, CA.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(<OGImage />, {
    ...size,
  });
}
