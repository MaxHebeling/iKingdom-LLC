import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "T\u00e9rminos de Servicio",
  description:
    "T\u00e9rminos de Servicio de iKingdom LLC. Revise los t\u00e9rminos que rigen el uso de nuestro sitio web y servicios de operaciones de IA.",
  alternates: {
    canonical: "https://www.ikingdom.org/es/terms",
    languages: {
      en: "https://www.ikingdom.org/terms",
      es: "https://www.ikingdom.org/es/terms",
    },
  },
};

const sections = [
  { id: "aceptacion", title: "1. Aceptaci\u00f3n de los T\u00e9rminos" },
  { id: "servicios", title: "2. Descripci\u00f3n de los Servicios" },
  { id: "solicitud", title: "3. Proceso de Solicitud" },
  { id: "propiedad-intelectual", title: "4. Propiedad Intelectual" },
  { id: "pago", title: "5. T\u00e9rminos de Pago" },
  { id: "confidencialidad", title: "6. Confidencialidad" },
  { id: "limitacion", title: "7. Limitaci\u00f3n de Responsabilidad" },
  { id: "indemnizacion", title: "8. Indemnizaci\u00f3n" },
  { id: "terminacion", title: "9. Terminaci\u00f3n" },
  { id: "ley-aplicable", title: "10. Ley Aplicable" },
  { id: "cambios", title: "11. Cambios a los T\u00e9rminos" },
  { id: "contacto", title: "12. Cont\u00e1ctenos" },
];

export default function TermsPageES() {
  return (
    <article className="pt-32 md:pt-40 pb-20 md:pb-28 px-6 md:px-10 max-w-[800px] mx-auto">
      <Link
        href="/es"
        className="inline-flex items-center gap-2 text-sm text-[var(--color-fg-dim)] hover:text-[var(--color-accent)] transition-colors duration-300 mb-10"
      >
        <span aria-hidden="true">&larr;</span> Volver al Inicio
      </Link>

      <header className="mb-12">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
          Legal &mdash; T&eacute;rminos de Servicio
        </p>
        <h1 className="font-display text-3xl md:text-5xl tracking-[-0.02em] leading-[1.1] mb-6">
          T&eacute;rminos de Servicio
        </h1>
        <p className="text-sm text-[var(--color-fg-dim)]">
          &Uacute;ltima actualizaci&oacute;n: abril 2026
        </p>
      </header>

      <div className="h-px bg-[var(--color-line)] mb-12" />

      {/* Tabla de Contenidos */}
      <nav className="mb-12 p-6 border border-[var(--color-line)]" aria-label="Tabla de contenidos">
        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-fg-dim)] mb-4">
          Contenido
        </p>
        <ol className="space-y-2 text-sm text-[var(--color-fg-muted)]">
          {sections.map((s) => (
            <li key={s.id}>
              <a
                href={`#${s.id}`}
                className="hover:text-[var(--color-accent)] transition-colors duration-300"
              >
                {s.title}
              </a>
            </li>
          ))}
        </ol>
      </nav>

      <div className="prose-ikingdom">
        <p>
          Estos T&eacute;rminos de Servicio (&ldquo;T&eacute;rminos&rdquo;) rigen su acceso y uso del sitio web y
          los servicios proporcionados por iKingdom LLC (&ldquo;iKingdom,&rdquo; &ldquo;nosotros&rdquo;
          o &ldquo;nuestro&rdquo;). Al acceder a nuestro sitio web o contratar nuestros servicios,
          acepta estar sujeto a estos T&eacute;rminos.
        </p>

        <h2 id="aceptacion">1. Aceptaci&oacute;n de los T&eacute;rminos</h2>
        <p>
          Al acceder o utilizar nuestro sitio web en{" "}
          <a href="https://www.ikingdom.org" target="_blank" rel="noopener noreferrer">
            www.ikingdom.org
          </a>
          , usted reconoce que ha le&iacute;do, entendido y acepta estar sujeto a estos T&eacute;rminos.
          Si no est&aacute; de acuerdo, debe dejar de usar nuestro sitio web y servicios de inmediato.
        </p>

        <h2 id="servicios">2. Descripci&oacute;n de los Servicios</h2>
        <p>
          iKingdom es una firma de operaciones de IA con sede en San Diego, California. Dise&ntilde;amos
          y desplegamos sistemas de agentes de IA aut&oacute;nomos para empresas. Nuestros servicios
          incluyen, entre otros:
        </p>
        <ul>
          <li>Consultor&iacute;a y estrategia de operaciones de IA.</li>
          <li>Dise&ntilde;o y despliegue de arquitecturas de agentes de IA aut&oacute;nomos.</li>
          <li>Automatizaci&oacute;n de procesos empresariales mediante sistemas de IA.</li>
          <li>Gesti&oacute;n y optimizaci&oacute;n continua de operaciones de IA.</li>
        </ul>
        <p>
          El alcance espec&iacute;fico, los entregables y los t&eacute;rminos de cualquier compromiso se
          definen en un acuerdo de servicio o declaraci&oacute;n de trabajo separado entre iKingdom y el cliente.
        </p>

        <h2 id="solicitud">3. Proceso de Solicitud</h2>
        <p>
          Nuestros servicios est&aacute;n disponibles solo por solicitud. Enviar una solicitud no
          garantiza la aceptaci&oacute;n. Nos reservamos el derecho de aceptar o rechazar cualquier
          solicitud a nuestra exclusiva discreci&oacute;n. La informaci&oacute;n de su solicitud se
          manejar&aacute; de acuerdo con nuestra{" "}
          <Link href="/es/privacy" className="underline hover:text-[var(--color-accent)]">
            Pol&iacute;tica de Privacidad
          </Link>
          .
        </p>

        <h2 id="propiedad-intelectual">4. Propiedad Intelectual</h2>
        <ul>
          <li>
            <strong>Nuestra PI:</strong> Todo el contenido de este sitio web, incluyendo texto,
            gr&aacute;ficos, logotipos, im&aacute;genes, software y la marca iKingdom, es propiedad de
            iKingdom LLC y est&aacute; protegido por las leyes de propiedad intelectual aplicables. No
            puede reproducir, distribuir ni crear obras derivadas sin nuestro consentimiento previo
            por escrito.
          </li>
          <li>
            <strong>Entregables del cliente:</strong> La propiedad de los entregables producidos
            durante un compromiso se definir&aacute; en el acuerdo de servicio aplicable. A menos que se
            acuerde por escrito, iKingdom retiene la propiedad de sus herramientas propietarias,
            marcos de trabajo, metodolog&iacute;as y propiedad intelectual preexistente.
          </li>
        </ul>

        <h2 id="pago">5. T&eacute;rminos de Pago</h2>
        <p>
          Los t&eacute;rminos de pago, incluyendo tarifas, cronogramas y m&eacute;todos, se especifican en
          el acuerdo de servicio o declaraci&oacute;n de trabajo aplicable. A menos que se indique lo
          contrario:
        </p>
        <ul>
          <li>Las facturas vencen dentro de los 30 d&iacute;as posteriores a su emisi&oacute;n.</li>
          <li>Los pagos atrasados pueden generar intereses del 1.5% mensual o la tasa m&aacute;xima permitida por la ley.</li>
          <li>Todas las tarifas no son reembolsables a menos que se indique expl&iacute;citamente en el acuerdo de servicio.</li>
        </ul>

        <h2 id="confidencialidad">6. Confidencialidad</h2>
        <p>
          Ambas partes acuerdan mantener la confidencialidad de cualquier informaci&oacute;n propietaria
          o confidencial divulgada durante el curso de un compromiso. Las obligaciones de
          confidencialidad sobreviven la terminaci&oacute;n de cualquier acuerdo de servicio por un
          per&iacute;odo de dos (2) a&ntilde;os, a menos que se acuerde lo contrario.
        </p>

        <h2 id="limitacion">7. Limitaci&oacute;n de Responsabilidad</h2>
        <p>En la m&aacute;xima medida permitida por la ley:</p>
        <ul>
          <li>
            iKingdom proporciona su sitio web y servicios &ldquo;tal cual&rdquo; y &ldquo;seg&uacute;n
            disponibilidad&rdquo; sin garant&iacute;as de ning&uacute;n tipo, ya sean expresas o impl&iacute;citas.
          </li>
          <li>
            iKingdom no ser&aacute; responsable de ning&uacute;n da&ntilde;o indirecto, incidental, especial,
            consecuente o punitivo, incluyendo p&eacute;rdida de ganancias, datos u oportunidades
            comerciales.
          </li>
          <li>
            Nuestra responsabilidad total agregada por cualquier reclamaci&oacute;n relacionada con estos
            T&eacute;rminos o nuestros servicios no exceder&aacute; las tarifas totales pagadas por usted a
            iKingdom en los doce (12) meses anteriores a la reclamaci&oacute;n.
          </li>
        </ul>

        <h2 id="indemnizacion">8. Indemnizaci&oacute;n</h2>
        <p>
          Usted acepta indemnizar y mantener indemne a iKingdom LLC, sus funcionarios, directores,
          empleados y agentes de cualquier reclamaci&oacute;n, da&ntilde;o, p&eacute;rdida o gasto (incluyendo
          honorarios razonables de abogados) que surja de su uso de nuestro sitio web, violaci&oacute;n
          de estos T&eacute;rminos o infracci&oacute;n de derechos de terceros.
        </p>

        <h2 id="terminacion">9. Terminaci&oacute;n</h2>
        <p>
          Podemos suspender o terminar su acceso a nuestro sitio web en cualquier momento y por
          cualquier raz&oacute;n sin previo aviso. La terminaci&oacute;n de un compromiso de servicio se rige
          por el acuerdo de servicio aplicable. Las secciones sobre propiedad intelectual,
          confidencialidad, limitaci&oacute;n de responsabilidad, indemnizaci&oacute;n y ley aplicable
          sobreviven la terminaci&oacute;n.
        </p>

        <h2 id="ley-aplicable">10. Ley Aplicable</h2>
        <p>
          Estos T&eacute;rminos se rigen e interpretan de acuerdo con las leyes del Estado de California,
          Estados Unidos, sin tener en cuenta sus disposiciones sobre conflicto de leyes. Cualquier
          disputa que surja bajo estos T&eacute;rminos estar&aacute; sujeta a la jurisdicci&oacute;n exclusiva
          de los tribunales estatales y federales ubicados en el Condado de San Diego, California.
        </p>

        <h2 id="cambios">11. Cambios a los T&eacute;rminos</h2>
        <p>
          Nos reservamos el derecho de modificar estos T&eacute;rminos en cualquier momento. Los cambios
          entran en vigor cuando se publican en esta p&aacute;gina. Su uso continuado del sitio web o
          servicios despu&eacute;s de la publicaci&oacute;n de los cambios constituye la aceptaci&oacute;n de los
          T&eacute;rminos revisados. Le recomendamos revisar esta p&aacute;gina peri&oacute;dicamente.
        </p>

        <h2 id="contacto">12. Cont&aacute;ctenos</h2>
        <p>Si tiene preguntas sobre estos T&eacute;rminos, cont&aacute;ctenos:</p>
        <ul>
          <li>
            <strong>Correo electr&oacute;nico:</strong>{" "}
            <a href="mailto:executive@ikingdom.org">executive@ikingdom.org</a>
          </li>
          <li>
            <strong>Empresa:</strong> iKingdom LLC
          </li>
          <li>
            <strong>Ubicaci&oacute;n:</strong> San Diego, CA
          </li>
        </ul>
      </div>

      <div className="h-px bg-[var(--color-line)] mt-16 mb-8" />

      <div className="flex items-center justify-between text-sm">
        <Link
          href="/es"
          className="text-[var(--color-fg-dim)] hover:text-[var(--color-accent)] transition-colors duration-300"
        >
          &larr; Inicio
        </Link>
        <Link
          href="/terms"
          hrefLang="en"
          className="text-[var(--color-fg-dim)] hover:text-[var(--color-accent)] transition-colors duration-300"
        >
          Read in English &rarr;
        </Link>
      </div>
    </article>
  );
}
