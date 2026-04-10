import type { Metadata } from "next";
import { Inter, Instrument_Serif } from "next/font/google";
import "./globals.css";
import MarginMarks from "@/components/MarginMarks";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  style: ["normal", "italic"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "iKingdom — The world's first AI operations firm",
  description:
    "iKingdom designs and deploys autonomous AI operations for ambitious companies. Eighty agents. Nine tiers. One fully automated business. By application only.",
  metadataBase: new URL("https://ikingdom.ai"),
  openGraph: {
    title: "iKingdom — The world's first AI operations firm",
    description:
      "Eighty agents. Nine tiers. One fully automated business. By application only.",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${instrumentSerif.variable} antialiased`}
    >
      <body className="relative">
        <MarginMarks />
        {children}
      </body>
    </html>
  );
}
