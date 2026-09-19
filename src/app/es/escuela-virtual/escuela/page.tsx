import type { Metadata } from "next";
import IntakePage from "../IntakePage";

export const metadata: Metadata = {
  title: "Formulario · Escuela virtual · iKingdom",
  description: "Información necesaria para diseñar tu escuela virtual.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <IntakePage formKey="escuela_virtual" />;
}
