import type { Metadata } from "next";
import IntakePage from "../IntakePage";

export const metadata: Metadata = {
  title: "Formulario · Campus virtual · iKingdom",
  description: "Información necesaria para diseñar el campus virtual de tu escuela.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return <IntakePage formKey="escuela_virtual" />;
}
