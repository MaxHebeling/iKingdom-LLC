import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Pol\u00edtica de Privacidad",
  description:
    "Pol\u00edtica de Privacidad de iKingdom LLC. Conozca c\u00f3mo recopilamos, usamos y protegemos sus datos. Cumplimiento CCPA.",
  alternates: {
    canonical: "https://www.ikingdom.org/es/privacy",
    languages: {
      en: "https://www.ikingdom.org/privacy",
      es: "https://www.ikingdom.org/es/privacy",
    },
  },
};

const sections = [
  { id: "informacion-recopilada", title: "1. Informaci\u00f3n que Recopilamos" },
  { id: "uso-informacion", title: "2. C\u00f3mo Usamos su Informaci\u00f3n" },
  { id: "servicios-terceros", title: "3. Servicios de Terceros" },
  { id: "cookies", title: "4. Cookies y Tecnolog\u00edas de Rastreo" },
  { id: "retencion", title: "5. Retenci\u00f3n de Datos" },
  { id: "seguridad", title: "6. Seguridad de los Datos" },
  { id: "derechos", title: "7. Sus Derechos (CCPA)" },
  { id: "menores", title: "8. Privacidad de Menores" },
  { id: "cambios", title: "9. Cambios a esta Pol\u00edtica" },
  { id: "contacto", title: "10. Cont\u00e1ctenos" },
];

export default function PrivacyPolicyPageES() {
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
          Legal &mdash; Pol&iacute;tica de Privacidad
        </p>
        <h1 className="font-display text-3xl md:text-5xl tracking-[-0.02em] leading-[1.1] mb-6">
          Pol&iacute;tica de Privacidad
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
          iKingdom LLC (&ldquo;iKingdom,&rdquo; &ldquo;nosotros&rdquo; o &ldquo;nuestro&rdquo;) se compromete a proteger
          su privacidad. Esta Pol&iacute;tica de Privacidad explica c&oacute;mo recopilamos, usamos, divulgamos y
          protegemos su informaci&oacute;n cuando visita nuestro sitio web en{" "}
          <a href="https://www.ikingdom.org" target="_blank" rel="noopener noreferrer">
            www.ikingdom.org
          </a>{" "}
          y utiliza nuestros servicios.
        </p>

        <h2 id="informacion-recopilada">1. Informaci&oacute;n que Recopilamos</h2>

        <h3>Informaci&oacute;n que Usted Proporciona</h3>
        <ul>
          <li>
            <strong>Formularios de solicitud y contacto:</strong> nombre, direcci&oacute;n de correo
            electr&oacute;nico, nombre de la empresa, cargo, n&uacute;mero de tel&eacute;fono y cualquier
            detalle que incluya en su mensaje o solicitud.
          </li>
          <li>
            <strong>Correspondencia:</strong> registros de comunicaciones cuando nos contacta por
            correo electr&oacute;nico a executive@ikingdom.org.
          </li>
        </ul>

        <h3>Informaci&oacute;n Recopilada Autom&aacute;ticamente</h3>
        <ul>
          <li>
            <strong>Datos del dispositivo y navegador:</strong> direcci&oacute;n IP, tipo y versi&oacute;n del
            navegador, sistema operativo, identificadores de dispositivo y resoluci&oacute;n de pantalla.
          </li>
          <li>
            <strong>Datos de uso:</strong> p&aacute;ginas visitadas, tiempo en cada p&aacute;gina, URLs de
            referencia, patrones de clics y rutas de navegaci&oacute;n.
          </li>
          <li>
            <strong>Cookies y tecnolog&iacute;as similares:</strong> consulte la Secci&oacute;n 4 a
            continuaci&oacute;n.
          </li>
        </ul>

        <h2 id="uso-informacion">2. C&oacute;mo Usamos su Informaci&oacute;n</h2>
        <p>Utilizamos la informaci&oacute;n recopilada para:</p>
        <ul>
          <li>Responder consultas y procesar solicitudes para nuestros servicios.</li>
          <li>Proporcionar, operar y mejorar nuestro sitio web y servicios.</li>
          <li>Analizar el tr&aacute;fico y los patrones de uso del sitio web para mejorar la experiencia del usuario.</li>
          <li>Comunicarnos con usted sobre actualizaciones de servicios, si ha dado su consentimiento.</li>
          <li>Cumplir con obligaciones legales y hacer cumplir nuestros t&eacute;rminos.</li>
        </ul>

        <h2 id="servicios-terceros">3. Servicios de Terceros</h2>
        <p>Utilizamos los siguientes servicios de terceros que pueden recopilar datos:</p>
        <ul>
          <li>
            <strong>Google Analytics:</strong> Usamos Google Analytics para entender c&oacute;mo los
            visitantes interact&uacute;an con nuestro sitio. Google Analytics recopila datos como su
            direcci&oacute;n IP, tipo de navegador y p&aacute;ginas visitadas. Estos datos se procesan de
            acuerdo con la{" "}
            <a
              href="https://policies.google.com/privacy"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pol&iacute;tica de Privacidad de Google
            </a>
            .
          </li>
          <li>
            <strong>Meta Pixel (Facebook):</strong> Usamos Meta Pixel para medir la efectividad de
            nuestra publicidad y comprender las acciones de los usuarios en nuestro sitio web. Los
            datos recopilados est&aacute;n sujetos a la{" "}
            <a
              href="https://www.facebook.com/privacy/policy/"
              target="_blank"
              rel="noopener noreferrer"
            >
              Pol&iacute;tica de Privacidad de Meta
            </a>
            .
          </li>
          <li>
            <strong>Alojamiento e infraestructura:</strong> Nuestro sitio web est&aacute; alojado en
            Vercel. Vercel puede recopilar registros del servidor, incluyendo direcciones IP, como
            parte de sus operaciones est&aacute;ndar.
          </li>
        </ul>
        <p>No vendemos su informaci&oacute;n personal a terceros.</p>

        <h2 id="cookies">4. Cookies y Tecnolog&iacute;as de Rastreo</h2>
        <p>
          Las cookies son peque&ntilde;os archivos de texto colocados en su dispositivo. Utilizamos:
        </p>
        <ul>
          <li>
            <strong>Cookies esenciales:</strong> necesarias para la funcionalidad b&aacute;sica del sitio web.
          </li>
          <li>
            <strong>Cookies de an&aacute;lisis:</strong> utilizadas por Google Analytics para rastrear el
            uso del sitio (por ejemplo, <code>_ga</code>, <code>_gid</code>).
          </li>
          <li>
            <strong>Cookies de marketing:</strong> utilizadas por Meta Pixel para la medici&oacute;n
            publicitaria (por ejemplo, <code>_fbp</code>).
          </li>
        </ul>
        <p>
          Puede controlar las cookies a trav&eacute;s de la configuraci&oacute;n de su navegador.
          Deshabilitar las cookies puede afectar la funcionalidad del sitio.
        </p>

        <h2 id="retencion">5. Retenci&oacute;n de Datos</h2>
        <p>
          Retenemos la informaci&oacute;n personal solo mientras sea necesario para cumplir los
          prop&oacute;sitos descritos en esta pol&iacute;tica, a menos que la ley requiera un per&iacute;odo
          de retenci&oacute;n m&aacute;s largo. Los env&iacute;os de formularios y datos de solicitud se
          retienen hasta 24 meses despu&eacute;s de la &uacute;ltima interacci&oacute;n. Los datos de
          an&aacute;lisis se retienen seg&uacute;n la configuraci&oacute;n predeterminada de cada proveedor.
        </p>

        <h2 id="seguridad">6. Seguridad de los Datos</h2>
        <p>
          Implementamos medidas administrativas, t&eacute;cnicas y f&iacute;sicas razonables para proteger
          su informaci&oacute;n personal. Sin embargo, ning&uacute;n m&eacute;todo de transmisi&oacute;n por
          Internet o almacenamiento electr&oacute;nico es 100% seguro. No podemos garantizar una
          seguridad absoluta.
        </p>

        <h2 id="derechos">7. Sus Derechos (CCPA)</h2>
        <p>
          Si es residente de California, tiene los siguientes derechos bajo la Ley de Privacidad
          del Consumidor de California (CCPA):
        </p>
        <ul>
          <li>
            <strong>Derecho a Saber:</strong> Puede solicitar las categor&iacute;as y piezas
            espec&iacute;ficas de informaci&oacute;n personal que hemos recopilado sobre usted.
          </li>
          <li>
            <strong>Derecho a Eliminar:</strong> Puede solicitar la eliminaci&oacute;n de su
            informaci&oacute;n personal, sujeto a ciertas excepciones.
          </li>
          <li>
            <strong>Derecho a Optar por No Participar:</strong> Tiene derecho a optar por no
            participar en la venta de su informaci&oacute;n personal. No vendemos informaci&oacute;n personal.
          </li>
          <li>
            <strong>Derecho a la No Discriminaci&oacute;n:</strong> No lo discriminaremos por ejercer
            cualquiera de sus derechos bajo la CCPA.
          </li>
        </ul>
        <p>
          Para ejercer cualquiera de estos derechos, cont&aacute;ctenos en{" "}
          <a href="mailto:executive@ikingdom.org">executive@ikingdom.org</a>.
        </p>

        <h2 id="menores">8. Privacidad de Menores</h2>
        <p>
          Nuestros servicios no est&aacute;n dirigidos a personas menores de 18 a&ntilde;os. No recopilamos
          intencionalmente informaci&oacute;n personal de menores. Si descubrimos que hemos recopilado
          informaci&oacute;n de un menor, tomaremos medidas para eliminar esa informaci&oacute;n de inmediato.
        </p>

        <h2 id="cambios">9. Cambios a esta Pol&iacute;tica</h2>
        <p>
          Podemos actualizar esta Pol&iacute;tica de Privacidad peri&oacute;dicamente. Cuando lo hagamos,
          revisaremos la fecha de &ldquo;&Uacute;ltima actualizaci&oacute;n&rdquo; en la parte superior de
          esta p&aacute;gina. Le recomendamos revisar esta pol&iacute;tica peri&oacute;dicamente.
        </p>

        <h2 id="contacto">10. Cont&aacute;ctenos</h2>
        <p>
          Si tiene preguntas sobre esta Pol&iacute;tica de Privacidad o desea ejercer sus derechos,
          cont&aacute;ctenos:
        </p>
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
          href="/privacy"
          hrefLang="en"
          className="text-[var(--color-fg-dim)] hover:text-[var(--color-accent)] transition-colors duration-300"
        >
          Read in English &rarr;
        </Link>
      </div>
    </article>
  );
}
