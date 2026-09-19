import type { Metadata } from "next";
import IntakePage from "../IntakePage";

export const metadata: Metadata = {
  title: "Formulario · Sitio web del ministerio · iKingdom",
  description: "Información necesaria para construir el sitio web público de tu ministerio.",
  robots: { index: false, follow: false },
};

export default function Page() {
  return (
    <IntakePage
      formKey="sitio_web"
      nextHref="/es/escuela-virtual/escuela"
      nextLabel="Continuar con la escuela virtual"
    />
  );
}
