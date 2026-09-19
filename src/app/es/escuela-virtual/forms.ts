// ─────────────────────────────────────────────────────────────
// iKingdom — Formularios de levantamiento: Escuela Virtual
// Dos formularios (solo español) que capturan todo lo necesario
// para construir (1) el sitio web y (2) la escuela virtual / LMS.
// Reutiliza el tipo FieldDef del wizard de /application.
// Fuente única de verdad: lo usan el cliente y /api/project-intake.
// ─────────────────────────────────────────────────────────────

import type { FieldDef, SectionDef } from "@/app/application/form-config";

export type IntakeFormKey = "sitio_web" | "escuela_virtual";

export interface IntakeForm {
  key: IntakeFormKey;
  slug: string;
  eyebrow: string;
  title: string;
  titleMuted: string;
  intro: string;
  submitLabel: string;
  successTitle: string;
  successBody: string;
  sections: SectionDef[];
}

const opts = (entries: [string, string][]) =>
  entries.map(([value, label]) => ({ value, label }));

const section = (
  id: string,
  index: number,
  label: string,
  title: string,
  subtitle: string,
  fields: FieldDef[],
): SectionDef => ({ id, index, label, title, subtitle, fields });

// ── Bloques compartidos ─────────────────────────────────────
const contactSection = (index: number) =>
  section(
    "contacto",
    index,
    "Contacto",
    "¿Con quién hablamos?",
    "Usaremos estos datos para identificar tu proyecto y enlazar ambos formularios.",
    [
      { name: "full_name", label: "Nombre completo", type: "text", required: true, span: 1 },
      { name: "job_title", label: "Cargo / rol", type: "text", span: 1, placeholder: "Ej. Director, Rector, Pastor" },
      { name: "organization_name", label: "Nombre de la institución u organización", type: "text", required: true, span: 2 },
      { name: "email", label: "Email", type: "email", required: true, span: 1 },
      { name: "phone_whatsapp", label: "Teléfono / WhatsApp", type: "phone-intl", required: true, span: 1 },
      { name: "country", label: "País", type: "country", span: 1 },
      { name: "city", label: "Ciudad", type: "text", span: 1 },
    ],
  );

const consentSection = (index: number) =>
  section(
    "confirmacion",
    index,
    "Confirmación",
    "Un último paso.",
    "Confirma y envía el formulario.",
    [
      {
        name: "confirm_information_accuracy",
        label: "Confirmo que la información proporcionada es correcta.",
        type: "checkbox",
        required: true,
        span: 2,
      },
      {
        name: "consent_to_be_contacted",
        label: "Autorizo a iKingdom a contactarme sobre este proyecto.",
        type: "checkbox",
        required: true,
        span: 2,
      },
    ],
  );

const BUDGET = opts([
  ["not_defined_yet", "Aún no definido"],
  ["under_1000", "Menos de $1,000 USD"],
  ["from_1000_to_3000", "$1,000 – $3,000 USD"],
  ["from_3000_to_5000", "$3,000 – $5,000 USD"],
  ["from_5000_to_10000", "$5,000 – $10,000 USD"],
  ["above_10000", "Más de $10,000 USD"],
]);

const LAUNCH = opts([
  ["asap", "Lo antes posible"],
  ["one_month", "En 1 mes"],
  ["two_to_three_months", "En 2–3 meses"],
  ["more_than_three_months", "En más de 3 meses"],
  ["no_date", "Sin fecha definida"],
]);

// ─────────────────────────────────────────────────────────────
// Formulario 1 — Fase 1: Sitio web público del ministerio
// ─────────────────────────────────────────────────────────────
const YES_NO = opts([
  ["yes", "Sí"],
  ["no", "No"],
]);

const DRIVE_HINT =
  "Comparte una carpeta de Google Drive, Dropbox o similar con acceso de lectura.";

const SITIO_WEB: IntakeForm = {
  key: "sitio_web",
  slug: "sitio-web",
  eyebrow: "Fase 1 · Sitio web del ministerio",
  title: "Construyamos el sitio web de tu ministerio.",
  titleMuted: "Empecemos por conocerlos.",
  intro:
    "Este formulario reúne la información, los materiales y las decisiones que necesitamos para construir el sitio web público de tu ministerio. Puedes completarlo en varias sesiones: tu avance se guarda en este navegador.",
  submitLabel: "Enviar formulario",
  successTitle: "Información recibida",
  successBody:
    "Gracias. Ya tenemos la información del sitio web de tu ministerio. Nuestro equipo la revisará y te contactará para confirmar los siguientes pasos.",
  sections: [
    // 0 — Quién completa
    section(
      "responsable",
      1,
      "Responsable",
      "¿Quién completa este formulario?",
      "Tu contacto directo para cualquier duda sobre el proyecto.",
      [
        { name: "full_name", label: "Nombre completo", type: "text", required: true, span: 1 },
        { name: "job_title", label: "Cargo o función en el ministerio", type: "text", span: 1 },
        { name: "email", label: "Email", type: "email", required: true, span: 1 },
        { name: "phone_whatsapp", label: "WhatsApp", type: "phone-intl", required: true, span: 1 },
      ],
    ),
    // 1 — Información institucional
    section(
      "institucional",
      2,
      "Institucional",
      "Información institucional.",
      "Quiénes son, qué creen y dónde están.",
      [
        { name: "organization_name", label: "Nombre oficial completo del ministerio", type: "text", required: true, span: 2 },
        { name: "short_name", label: "Nombre corto o siglas", type: "text", span: 1 },
        { name: "founded_year", label: "Año de fundación", type: "text", span: 1 },
        {
          name: "organization_type",
          label: "¿Qué representa el sitio?",
          type: "multiselect",
          required: true,
          span: 2,
          hint: "Puedes elegir varias. Esto define la arquitectura del sitio.",
          options: opts([
            ["local_church", "Iglesia local"],
            ["international_ministry", "Ministerio internacional"],
            ["church_network", "Red de iglesias"],
            ["school", "Escuela / instituto ministerial"],
            ["other", "Otro"],
          ]),
        },
        { name: "slogan", label: "Eslogan", type: "text", span: 2 },
        { name: "history", label: "Historia del ministerio", type: "textarea", rows: 5, span: 2 },
        { name: "mission", label: "Misión", type: "textarea", rows: 3, span: 2 },
        { name: "vision", label: "Visión", type: "textarea", rows: 3, span: 2 },
        { name: "values", label: "Valores", type: "textarea", rows: 3, span: 2 },
        {
          name: "statement_of_faith",
          label: "Declaración de fe / doctrina (si desean publicarla)",
          type: "textarea",
          rows: 4,
          span: 2,
        },
        {
          name: "spiritual_covering",
          label: "Cobertura espiritual, denominación o red apostólica",
          type: "text",
          span: 2,
        },
      ],
    ),
    // 2 — Identidad visual
    section(
      "marca",
      3,
      "Identidad visual",
      "Logo, colores y tipografías.",
      "Idealmente el logo en PNG transparente y en SVG/vectorial, versión clara y oscura.",
      [
        {
          name: "logo_formats",
          label: "Formatos de logo disponibles",
          type: "multiselect",
          required: true,
          span: 2,
          options: opts([
            ["png_transparent", "PNG transparente"],
            ["svg_vector", "SVG / vectorial (AI, EPS, PDF)"],
            ["light_version", "Versión clara"],
            ["dark_version", "Versión oscura"],
            ["jpg_only", "Solo JPG / imagen"],
            ["none", "No tenemos logo"],
          ]),
        },
        { name: "logo_url", label: "Link a la carpeta del logo", type: "url", span: 2, placeholder: "https://drive.google.com/…", hint: DRIVE_HINT },
        { name: "brand_colors", label: "Colores institucionales", type: "text", span: 1, placeholder: "Ej. azul #0B2545, dorado #C9A227" },
        { name: "brand_fonts", label: "Tipografías (si ya las tienen)", type: "text", span: 1 },
      ],
    ),
    // 3 — Ubicación y contacto
    section(
      "ubicacion",
      4,
      "Ubicación y contacto",
      "Ubicación y datos de contacto.",
      "Los datos públicos que verá cualquier visitante.",
      [
        { name: "country", label: "País", type: "country", required: true, span: 1 },
        { name: "province", label: "Provincia / estado", type: "text", span: 1 },
        { name: "city", label: "Ciudad", type: "text", required: true, span: 1 },
        { name: "address", label: "Dirección física", type: "text", span: 1 },
        { name: "google_maps_url", label: "Link de Google Maps", type: "url", span: 2, placeholder: "https://maps.app.goo.gl/…" },
        { name: "public_phone", label: "Teléfono", type: "phone-intl", span: 1 },
        { name: "public_whatsapp", label: "WhatsApp", type: "phone-intl", span: 1 },
        { name: "public_email", label: "Correo electrónico", type: "email", span: 1 },
        { name: "office_hours", label: "Horarios de atención", type: "text", span: 1, placeholder: "Ej. lun a vie 9 a 17 h" },
      ],
    ),
    // 4 — Pastores y liderazgo
    section(
      "liderazgo",
      5,
      "Liderazgo",
      "Pastores y liderazgo.",
      "Quiénes guían el ministerio y cómo quieren presentarlos.",
      [
        {
          name: "senior_pastors",
          label: "Pastores principales",
          type: "textarea",
          required: true,
          rows: 4,
          span: 2,
          placeholder: "Nombre completo — cargo o función — redes sociales (uno por línea)",
        },
        {
          name: "pastors_bio",
          label: "Biografía de los pastores principales",
          type: "textarea",
          rows: 5,
          span: 2,
          placeholder: "Una versión corta. Si tienen una extendida, pégala también.",
        },
        {
          name: "wants_extended_bio_page",
          label: "¿Quieren una sección dedicada con la biografía extendida?",
          type: "select",
          span: 2,
          options: YES_NO,
        },
        {
          name: "leadership_team",
          label: "Equipo pastoral, líderes y directores de áreas",
          type: "textarea",
          rows: 4,
          span: 2,
          placeholder: "Nombre — cargo / área (uno por línea)",
        },
        { name: "school_teachers", label: "Profesores de la escuela", type: "textarea", rows: 3, span: 2, placeholder: "Nombre — materia (uno por línea)" },
        {
          name: "leadership_display",
          label: "¿A quiénes quieren mostrar en el sitio?",
          type: "select",
          required: true,
          span: 2,
          options: opts([
            ["senior_only", "Solo pastores principales"],
            ["pastoral_team", "Equipo pastoral"],
            ["all_leadership", "Todo el liderazgo"],
            ["leadership_plus_teachers", "Liderazgo + maestros de la escuela por separado"],
          ]),
        },
        { name: "leadership_photos_url", label: "Link a fotos profesionales del liderazgo", type: "url", span: 2, placeholder: "https://drive.google.com/…", hint: DRIVE_HINT },
      ],
    ),
    // 5 — Reuniones y actividades
    section(
      "reuniones",
      6,
      "Reuniones",
      "Reuniones y actividades.",
      "Después podrán cambiar los horarios ustedes mismos, sin depender del programador.",
      [
        {
          name: "meeting_types",
          label: "Reuniones y actividades que tienen",
          type: "multiselect",
          required: true,
          span: 2,
          options: opts([
            ["general", "Reunión general / culto"],
            ["youth", "Jóvenes"],
            ["kids", "Niños"],
            ["women", "Mujeres"],
            ["men", "Hombres"],
            ["couples", "Matrimonios"],
            ["ministerial_school", "Escuela ministerial"],
            ["small_groups", "Grupos pequeños / Casas de Paz / células"],
            ["prayer", "Oración"],
            ["evangelism", "Evangelismo"],
            ["other", "Otras actividades"],
          ]),
        },
        {
          name: "meeting_schedule",
          label: "Detalle de cada reunión",
          type: "textarea",
          required: true,
          rows: 6,
          span: 2,
          placeholder: "Nombre — día — horario — dirección — presencial / online (una por línea)\nEj. Culto general — domingo — 10:00 h — Av. San Martín 123 — presencial y online",
        },
      ],
    ),
    // 6 — Ministerios y áreas
    section(
      "ministerios",
      7,
      "Ministerios",
      "Ministerios y áreas.",
      "Qué ministerios quieren mostrar y la información de cada uno.",
      [
        {
          name: "ministries",
          label: "Ministerios a mostrar",
          type: "multiselect",
          span: 2,
          options: opts([
            ["kids", "Niños"],
            ["youth", "Jóvenes"],
            ["women", "Mujeres"],
            ["men", "Hombres"],
            ["couples", "Matrimonios"],
            ["worship", "Adoración"],
            ["intercession", "Intercesión"],
            ["evangelism", "Evangelismo"],
            ["missions", "Misiones"],
            ["social_action", "Acción social"],
            ["ministerial_school", "Escuela ministerial"],
            ["small_groups", "Grupos pequeños"],
            ["media", "Multimedia"],
          ]),
        },
        {
          name: "ministries_detail",
          label: "Información de cada ministerio",
          type: "textarea",
          rows: 7,
          span: 2,
          placeholder: "Por cada ministerio: nombre — responsable — descripción — horarios — forma de contacto — redes propias (si tienen)",
        },
        { name: "ministries_assets_url", label: "Link a logos y fotos de los ministerios", type: "url", span: 2, placeholder: "https://drive.google.com/…", hint: DRIVE_HINT },
      ],
    ),
    // 7 — Fotografías y videos
    section(
      "multimedia",
      8,
      "Fotos y videos",
      "Fotografías y videos.",
      "Idealmente archivos originales: las fotos descargadas de WhatsApp, Facebook o Instagram pierden calidad.",
      [
        {
          name: "photo_categories",
          label: "Fotos que pueden enviarnos",
          type: "multiselect",
          span: 2,
          options: opts([
            ["building", "Edificio"],
            ["auditorium", "Auditorio"],
            ["meetings", "Reuniones"],
            ["worship", "Adoración"],
            ["preaching", "Predicación"],
            ["kids", "Niños"],
            ["youth", "Jóvenes"],
            ["events", "Eventos"],
            ["baptisms", "Bautismos"],
            ["social", "Actividades sociales"],
            ["pastors", "Pastores"],
            ["team", "Equipo"],
            ["historic", "Fotos históricas"],
          ]),
        },
        {
          name: "photos_original_quality",
          label: "¿Las fotos son originales (no descargadas de redes)?",
          type: "select",
          span: 2,
          options: opts([
            ["yes", "Sí, originales"],
            ["mixed", "Algunas sí, otras no"],
            ["no", "No, la mayoría son de redes"],
          ]),
        },
        { name: "photos_url", label: "Link a la carpeta de fotos", type: "url", span: 2, placeholder: "https://drive.google.com/…", hint: "Si puedes, organízala en subcarpetas por categoría." },
        {
          name: "video_types",
          label: "Videos disponibles",
          type: "multiselect",
          span: 2,
          options: opts([
            ["institutional", "Video institucional"],
            ["testimonials", "Testimonios"],
            ["reels", "Reels"],
            ["events", "Videos de eventos"],
            ["ministry", "Videos del ministerio"],
          ]),
        },
        { name: "videos_url", label: "Link a la carpeta de videos", type: "url", span: 2, placeholder: "https://drive.google.com/…" },
      ],
    ),
    // 8 — Predicaciones
    section(
      "predicaciones",
      9,
      "Predicaciones",
      "Biblioteca de predicaciones.",
      "Organizada por predicador → serie → tema → fecha.",
      [
        {
          name: "wants_sermon_library",
          label: "¿Quieren una biblioteca pública de mensajes?",
          type: "select",
          required: true,
          span: 2,
          options: YES_NO,
        },
        {
          name: "sermon_formats",
          label: "Formatos de los mensajes",
          type: "multiselect",
          span: 2,
          options: opts([
            ["video", "Video"],
            ["audio", "Audio"],
            ["youtube", "YouTube"],
            ["vimeo", "Vimeo"],
            ["text", "Texto / bosquejo"],
          ]),
        },
        { name: "sermons_source_url", label: "Canal o carpeta donde están los mensajes", type: "url", span: 2, placeholder: "https://youtube.com/@…" },
        {
          name: "sermon_volume",
          label: "Mensajes que hay para cargar",
          type: "select",
          span: 2,
          options: opts([
            ["under_20", "Menos de 20"],
            ["20_100", "20 – 100"],
            ["over_100", "Más de 100"],
            ["new_only", "Solo los nuevos, de aquí en adelante"],
          ]),
        },
      ],
    ),
    // 9 — Transmisiones en vivo
    section(
      "en_vivo",
      10,
      "En vivo",
      "Transmisiones en vivo.",
      "Podemos crear una sección EN VIVO que detecte automáticamente cuando hay una transmisión activa.",
      [
        {
          name: "live_platforms",
          label: "¿Dónde transmiten?",
          type: "multiselect",
          span: 2,
          options: opts([
            ["youtube", "YouTube"],
            ["facebook", "Facebook"],
            ["instagram", "Instagram"],
            ["other", "Otra plataforma"],
            ["none", "No transmitimos"],
          ]),
        },
        {
          name: "wants_live_section",
          label: "¿Quieren la sección EN VIVO automática?",
          type: "select",
          span: 2,
          options: YES_NO,
        },
      ],
    ),
    // 10 — Eventos
    section(
      "eventos",
      11,
      "Eventos",
      "Eventos.",
      "Anunciar un evento y registrar o cobrar desde el sitio son dos niveles distintos.",
      [
        {
          name: "events_level",
          label: "¿Qué necesitan hacer con los eventos?",
          type: "select",
          required: true,
          span: 2,
          options: opts([
            ["announce", "Solo anunciarlos"],
            ["register", "Anunciar y registrar personas"],
            ["register_and_sell", "Anunciar, registrar y cobrar entradas"],
            ["none", "No necesitamos eventos"],
          ]),
        },
        {
          name: "event_fields",
          label: "Información a publicar de cada evento",
          type: "multiselect",
          span: 2,
          options: opts([
            ["name", "Nombre"],
            ["date_time", "Fecha y hora"],
            ["venue", "Lugar y dirección"],
            ["description", "Descripción"],
            ["speakers", "Oradores"],
            ["flyer", "Flyer"],
            ["price", "Precio"],
            ["capacity", "Cupo"],
            ["registration", "Registro"],
            ["qr", "Entrada con QR"],
            ["payment", "Pago"],
            ["contact", "Contacto"],
          ]),
        },
        { name: "upcoming_events", label: "Próximos eventos a publicar", type: "textarea", rows: 3, span: 2 },
      ],
    ),
    // 11 — Formularios del sitio
    section(
      "formularios",
      12,
      "Formularios",
      "Contacto, visitantes y oración.",
      "Esto convierte el sitio en una herramienta ministerial y no solo en una página informativa.",
      [
        {
          name: "site_forms",
          label: "Formularios que quieren en el sitio",
          type: "multiselect",
          required: true,
          span: 2,
          options: opts([
            ["general_contact", "Contacto general"],
            ["new_visitor", "Soy nuevo"],
            ["prayer", "Necesito oración"],
            ["visit", "Quiero visitar la iglesia"],
            ["salvation", "Quiero aceptar a Jesús"],
            ["baptism", "Quiero bautizarme"],
            ["serve", "Quiero servir"],
            ["counseling", "Necesito consejería"],
            ["membership", "Quiero formar parte"],
            ["school_info", "Quiero información de la escuela"],
          ]),
        },
        {
          name: "wants_visitor_crm",
          label: "¿Quieren que los datos de visitantes entren a un pequeño CRM del ministerio?",
          type: "select",
          span: 2,
          options: YES_NO,
        },
        {
          name: "forms_follow_up",
          label: "¿Quién recibe y da seguimiento a cada formulario?",
          type: "textarea",
          rows: 3,
          span: 2,
          placeholder: "Ej. Oración → equipo de intercesión (email / WhatsApp)",
        },
        {
          name: "prayer_privacy",
          label: "Peticiones de oración",
          type: "select",
          span: 1,
          options: opts([
            ["private", "Siempre privadas"],
            ["optional_public", "La persona elige si se publica"],
            ["public_after_review", "Públicas tras aprobación"],
          ]),
        },
        {
          name: "prayer_confirmation",
          label: "¿La persona recibe confirmación?",
          type: "select",
          span: 1,
          options: YES_NO,
        },
        { name: "prayer_readers", label: "¿Quién puede leer las peticiones?", type: "text", span: 2 },
      ],
    ),
    // 12 — Testimonios
    section(
      "testimonios",
      13,
      "Testimonios",
      "Testimonios.",
      "Qué pueden enviar las personas y cómo se publica.",
      [
        {
          name: "testimony_types",
          label: "Tipos de testimonio permitidos",
          type: "multiselect",
          span: 2,
          options: opts([
            ["written", "Escritos"],
            ["photos", "Con fotografías"],
            ["video", "En video"],
            ["none", "No habrá testimonios"],
          ]),
        },
        {
          name: "testimony_approval",
          label: "¿Requieren aprobación antes de publicarse?",
          type: "select",
          span: 2,
          options: YES_NO,
        },
      ],
    ),
    // 13 — Donaciones
    section(
      "donaciones",
      14,
      "Donaciones",
      "Ofrendas y donaciones.",
      "Por seguridad, el sitio nunca guarda datos de tarjetas: los pagos se procesan en la pasarela.",
      [
        {
          name: "online_giving",
          label: "¿Reciben ofrendas online?",
          type: "select",
          required: true,
          span: 1,
          options: opts([
            ["yes", "Sí, ya lo hacemos"],
            ["want_to", "Queremos empezar"],
            ["no", "No"],
          ]),
        },
        {
          name: "international_giving",
          label: "¿Reciben donaciones internacionales?",
          type: "select",
          span: 1,
          options: YES_NO,
        },
        {
          name: "giving_methods",
          label: "Medios de donación",
          type: "multiselect",
          span: 2,
          options: opts([
            ["mercadopago", "Mercado Pago"],
            ["bank_transfer", "Transferencia bancaria"],
            ["paypal", "PayPal"],
            ["stripe", "Stripe"],
          ]),
        },
        {
          name: "giving_currencies",
          label: "Monedas",
          type: "multiselect",
          span: 2,
          options: opts([
            ["ars", "Pesos argentinos"],
            ["usd", "Dólares (USD)"],
            ["other", "Otra"],
          ]),
        },
        {
          name: "bank_details",
          label: "Datos para transferencia que se publicarán",
          type: "textarea",
          rows: 4,
          span: 2,
          placeholder: "Alias — CBU/CVU — titular — CUIT (si corresponde) — banco",
          hint: "Solo los datos que aparecerán públicamente en la página de donaciones.",
        },
      ],
    ),
    // 14 — Redes sociales
    section(
      "redes",
      15,
      "Redes",
      "Redes sociales oficiales.",
      "Pega el enlace completo de cada cuenta.",
      [
        { name: "facebook_url", label: "Facebook", type: "url", span: 1 },
        { name: "instagram_url", label: "Instagram", type: "url", span: 1 },
        { name: "youtube_url", label: "YouTube", type: "url", span: 1 },
        { name: "tiktok_url", label: "TikTok", type: "url", span: 1 },
        { name: "spotify_url", label: "Spotify", type: "url", span: 1 },
        { name: "whatsapp_channel_url", label: "WhatsApp (canal o comunidad)", type: "url", span: 1 },
        { name: "telegram_url", label: "Telegram", type: "url", span: 1 },
        { name: "x_url", label: "X (Twitter)", type: "url", span: 1 },
      ],
    ),
    // 15 — Dominio
    section(
      "dominio",
      16,
      "Dominio",
      "Dominio, hosting y correos.",
      "Ejemplo: ministerio.org.ar y correos como info@ministerio.org.ar",
      [
        {
          name: "has_domain",
          label: "¿Ya tienen dominio?",
          type: "select",
          required: true,
          span: 1,
          options: opts([
            ["yes", "Sí"],
            ["no", "No, hay que comprarlo"],
            ["not_sure", "No estoy seguro"],
          ]),
        },
        { name: "domain_name", label: "Dominio actual o deseado", type: "text", span: 1, placeholder: "ministerio.org.ar" },
        { name: "domain_buyer", label: "¿Quién lo compró?", type: "text", span: 1 },
        { name: "domain_registrar", label: "¿Dónde está registrado?", type: "text", span: 1, placeholder: "Ej. NIC Argentina, GoDaddy" },
        { name: "domain_access", label: "¿Quién tiene acceso a la cuenta?", type: "text", span: 2 },
        { name: "current_hosting", label: "Hosting actual (si tienen)", type: "text", span: 1 },
        {
          name: "corporate_emails",
          label: "Correos corporativos",
          type: "select",
          span: 1,
          options: opts([
            ["have", "Ya los tenemos"],
            ["need", "Necesitamos crearlos"],
            ["no", "No por ahora"],
          ]),
        },
        { name: "current_website_url", label: "Sitio web actual (si existe)", type: "url", span: 2, placeholder: "https://…" },
        { name: "additional_comments", label: "Comentarios adicionales", type: "textarea", rows: 3, span: 2 },
      ],
    ),
    consentSection(17),
  ],
};

// ─────────────────────────────────────────────────────────────
// Formulario 2 — Escuela virtual
// ─────────────────────────────────────────────────────────────
const ESCUELA_VIRTUAL: IntakeForm = {
  key: "escuela_virtual",
  slug: "escuela",
  eyebrow: "Fase 2 · Escuela virtual",
  title: "Diseñemos tu escuela virtual.",
  titleMuted: "Cursos, alumnos y operación.",
  intro:
    "Este formulario define cómo funcionará tu plataforma de estudio: programas, estudiantes, contenido, profesores y pagos. Toma unos 15 minutos y tu avance se guarda en este navegador.",
  submitLabel: "Enviar formulario",
  successTitle: "Formulario de la escuela virtual recibido",
  successBody:
    "Gracias. Con esta información nuestro equipo diseñará la arquitectura de tu escuela virtual y te contactará para revisar la propuesta.",
  sections: [
    contactSection(1),
    section(
      "escuela",
      2,
      "La escuela",
      "Tu escuela virtual.",
      "Qué se enseña y con qué propósito.",
      [
        { name: "school_name", label: "Nombre de la escuela virtual", type: "text", required: true, span: 2, placeholder: "Si aún no lo tienen, escribe una idea" },
        {
          name: "training_type",
          label: "Tipo de formación",
          type: "multiselect",
          required: true,
          span: 2,
          options: opts([
            ["free_courses", "Cursos libres"],
            ["diplomas", "Diplomados"],
            ["certifications", "Certificaciones"],
            ["degree_programs", "Carreras / programas largos"],
            ["ministerial", "Formación ministerial / teológica"],
            ["corporate", "Capacitación corporativa"],
            ["languages", "Idiomas"],
            ["kids_youth", "Niños / jóvenes"],
            ["other", "Otro"],
          ]),
        },
        { name: "subject_area", label: "Área temática principal", type: "text", required: true, span: 2 },
        {
          name: "school_purpose",
          label: "Propósito de la escuela y resultado que debe lograr el alumno",
          type: "textarea",
          required: true,
          rows: 4,
          span: 2,
        },
        {
          name: "issues_certificates",
          label: "¿Entregarán certificados?",
          type: "select",
          span: 1,
          options: opts([
            ["yes_auto", "Sí, automáticos al terminar"],
            ["yes_manual", "Sí, emitidos manualmente"],
            ["no", "No"],
          ]),
        },
        { name: "accreditation", label: "Aval o acreditación (si aplica)", type: "text", span: 1 },
      ],
    ),
    section(
      "estudiantes",
      3,
      "Estudiantes",
      "Tus estudiantes.",
      "Quiénes son y cuántos esperas.",
      [
        {
          name: "student_profile",
          label: "Perfil del estudiante",
          type: "textarea",
          required: true,
          rows: 3,
          span: 2,
          placeholder: "Edad, ocupación, nivel de estudios, motivación…",
        },
        {
          name: "students_at_launch",
          label: "Alumnos esperados al lanzar",
          type: "select",
          required: true,
          span: 1,
          options: opts([
            ["under_50", "Menos de 50"],
            ["50_200", "50 – 200"],
            ["200_1000", "200 – 1,000"],
            ["over_1000", "Más de 1,000"],
          ]),
        },
        {
          name: "students_first_year",
          label: "Alumnos esperados el primer año",
          type: "select",
          span: 1,
          options: opts([
            ["under_200", "Menos de 200"],
            ["200_1000", "200 – 1,000"],
            ["1000_5000", "1,000 – 5,000"],
            ["over_5000", "Más de 5,000"],
          ]),
        },
        { name: "student_countries", label: "Países de los alumnos", type: "text", span: 2, placeholder: "Ej. México, Argentina, EE. UU." },
        {
          name: "main_device",
          label: "¿Desde dónde estudiarán?",
          type: "select",
          span: 1,
          options: opts([
            ["mobile", "Principalmente celular"],
            ["desktop", "Principalmente computadora"],
            ["both", "Ambos"],
          ]),
        },
        {
          name: "tech_level",
          label: "Nivel tecnológico del alumno",
          type: "select",
          span: 1,
          options: opts([
            ["basic", "Básico"],
            ["medium", "Medio"],
            ["advanced", "Avanzado"],
          ]),
        },
      ],
    ),
    section(
      "oferta",
      4,
      "Oferta académica",
      "Programas y cursos.",
      "Cómo está organizada la enseñanza.",
      [
        {
          name: "courses_at_launch",
          label: "Cursos / programas al lanzar",
          type: "select",
          required: true,
          span: 1,
          options: opts([
            ["1", "1"],
            ["2_5", "2 – 5"],
            ["6_15", "6 – 15"],
            ["over_15", "Más de 15"],
          ]),
        },
        { name: "average_duration", label: "Duración promedio de un curso", type: "text", span: 1, placeholder: "Ej. 8 semanas" },
        {
          name: "course_list",
          label: "Lista de cursos o programas",
          type: "textarea",
          required: true,
          rows: 5,
          span: 2,
          placeholder: "Nombre de cada curso y, si lo tienes, sus módulos principales.",
        },
        {
          name: "course_structure",
          label: "Estructura de los cursos",
          type: "select",
          span: 2,
          options: opts([
            ["program_course_module_lesson", "Programa → cursos → módulos → lecciones"],
            ["course_module_lesson", "Curso → módulos → lecciones"],
            ["course_lesson", "Curso → lecciones"],
            ["not_sure", "Necesito asesoría"],
          ]),
        },
        {
          name: "study_mode",
          label: "Modalidad",
          type: "select",
          required: true,
          span: 1,
          options: opts([
            ["self_paced", "A su propio ritmo"],
            ["cohorts", "Por generaciones con fechas"],
            ["mixed", "Mixta"],
          ]),
        },
        {
          name: "live_classes",
          label: "¿Clases en vivo?",
          type: "select",
          span: 1,
          options: opts([
            ["no", "No"],
            ["zoom", "Sí, por Zoom"],
            ["meet", "Sí, por Google Meet"],
            ["youtube", "Sí, transmisión (YouTube)"],
            ["other", "Sí, otra plataforma"],
          ]),
        },
      ],
    ),
    section(
      "contenido",
      5,
      "Contenido",
      "Material de estudio.",
      "Qué existe hoy y qué hay que producir.",
      [
        {
          name: "content_formats",
          label: "Formatos que ya tienen",
          type: "multiselect",
          span: 2,
          options: opts([
            ["recorded_video", "Videos grabados"],
            ["pdf", "PDF / manuales"],
            ["slides", "Presentaciones"],
            ["audio", "Audios / podcast"],
            ["books", "Libros"],
            ["none", "Aún nada"],
          ]),
        },
        {
          name: "content_readiness",
          label: "¿Qué tan listo está el contenido?",
          type: "select",
          required: true,
          span: 1,
          options: opts([
            ["ready", "100% listo"],
            ["partial", "Parcialmente"],
            ["to_create", "Hay que crearlo"],
          ]),
        },
        {
          name: "needs_video_production",
          label: "¿Necesitan producción o edición de video?",
          type: "select",
          span: 1,
          options: opts([
            ["yes", "Sí"],
            ["editing_only", "Solo edición"],
            ["no", "No"],
          ]),
        },
        {
          name: "course_languages",
          label: "Idiomas de los cursos",
          type: "multiselect",
          span: 2,
          options: opts([
            ["es", "Español"],
            ["en", "Inglés"],
            ["pt", "Portugués"],
            ["other", "Otro"],
          ]),
        },
        {
          name: "assessments",
          label: "Evaluaciones",
          type: "multiselect",
          span: 2,
          options: opts([
            ["quizzes", "Cuestionarios"],
            ["assignments", "Tareas"],
            ["final_exam", "Examen final"],
            ["projects", "Proyectos"],
            ["attendance", "Asistencia"],
            ["none", "Ninguna"],
          ]),
        },
        {
          name: "community",
          label: "Comunidad entre alumnos",
          type: "select",
          span: 1,
          options: opts([
            ["forum", "Foro dentro de la plataforma"],
            ["whatsapp_telegram", "Grupo de WhatsApp / Telegram"],
            ["none", "No es necesario"],
          ]),
        },
        { name: "content_url", label: "Link a material existente", type: "url", span: 1, placeholder: "https://drive.google.com/…" },
      ],
    ),
    section(
      "operacion",
      6,
      "Operación",
      "Profesores y administración.",
      "Quién opera la escuela día a día.",
      [
        {
          name: "teacher_count",
          label: "Número de profesores",
          type: "select",
          span: 1,
          options: opts([
            ["1", "Solo uno"],
            ["2_5", "2 – 5"],
            ["6_20", "6 – 20"],
            ["over_20", "Más de 20"],
          ]),
        },
        {
          name: "teachers_upload_content",
          label: "¿Los profesores subirán su contenido?",
          type: "select",
          span: 1,
          options: opts([
            ["yes", "Sí"],
            ["no", "No, lo sube el equipo administrativo"],
            ["ikingdom", "Que iKingdom lo cargue"],
          ]),
        },
        {
          name: "admin_roles",
          label: "Roles que necesitan acceso",
          type: "multiselect",
          span: 2,
          options: opts([
            ["admin", "Administrador"],
            ["teacher", "Profesor"],
            ["tutor", "Tutor / mentor"],
            ["registrar", "Control escolar"],
            ["finance", "Finanzas"],
          ]),
        },
        {
          name: "reports_needed",
          label: "Reportes necesarios",
          type: "multiselect",
          span: 2,
          options: opts([
            ["progress", "Avance de alumnos"],
            ["grades", "Calificaciones"],
            ["attendance", "Asistencia"],
            ["payments", "Pagos"],
            ["certificates", "Certificados emitidos"],
          ]),
        },
      ],
    ),
    section(
      "pagos",
      7,
      "Inscripción y pagos",
      "Inscripción y pagos.",
      "Cómo acceden y pagan los alumnos.",
      [
        {
          name: "access_model",
          label: "Modelo de acceso",
          type: "select",
          required: true,
          span: 2,
          options: opts([
            ["free", "Gratuito"],
            ["per_course", "Pago por curso"],
            ["subscription", "Suscripción mensual / anual"],
            ["per_program", "Pago por programa completo"],
            ["installments", "Inscripción + mensualidades"],
            ["mixed", "Mixto / con becas"],
          ]),
        },
        { name: "approx_prices", label: "Precios aproximados", type: "text", span: 1, placeholder: "Ej. $49 USD por curso" },
        {
          name: "currencies",
          label: "Monedas",
          type: "multiselect",
          span: 1,
          options: opts([
            ["usd", "USD"],
            ["mxn", "MXN"],
            ["ars", "ARS"],
            ["other", "Otra"],
          ]),
        },
        {
          name: "payment_gateways",
          label: "Métodos de pago",
          type: "multiselect",
          span: 2,
          options: opts([
            ["stripe", "Stripe (tarjeta)"],
            ["paypal", "PayPal"],
            ["mercadopago", "Mercado Pago"],
            ["transfer", "Transferencia / depósito"],
            ["not_sure", "Aún no sé"],
          ]),
        },
        {
          name: "enrollment_requirements",
          label: "Requisitos o proceso de inscripción",
          type: "textarea",
          rows: 3,
          span: 2,
          placeholder: "Documentos, entrevista, aprobación manual…",
        },
      ],
    ),
    section(
      "extras",
      8,
      "Plataforma",
      "Integraciones y plataforma actual.",
      "Lo que debe conectarse o migrarse.",
      [
        {
          name: "extra_features",
          label: "Funciones adicionales",
          type: "multiselect",
          span: 2,
          options: opts([
            ["mobile_app", "App móvil"],
            ["gamification", "Gamificación (insignias, puntos)"],
            ["ai_tutor", "Tutor con IA"],
            ["email_marketing", "Email marketing"],
            ["whatsapp_notifications", "Avisos por WhatsApp"],
            ["crm", "Conexión con CRM"],
            ["calendar", "Calendario académico"],
          ]),
        },
        {
          name: "current_platform",
          label: "Plataforma que usan hoy",
          type: "select",
          span: 1,
          options: opts([
            ["none", "Ninguna"],
            ["hotmart", "Hotmart"],
            ["teachable_thinkific", "Teachable / Thinkific"],
            ["moodle", "Moodle"],
            ["classroom", "Google Classroom"],
            ["other", "Otra"],
          ]),
        },
        {
          name: "migrate_students",
          label: "¿Hay alumnos o contenido para migrar?",
          type: "select",
          span: 1,
          options: opts([
            ["no", "No"],
            ["students", "Sí, alumnos"],
            ["content", "Sí, contenido"],
            ["both", "Sí, ambos"],
          ]),
        },
      ],
    ),
    section(
      "tiempos",
      9,
      "Tiempos",
      "Tiempos y comentarios.",
      "Para planear el lanzamiento.",
      [
        { name: "desired_launch", label: "¿Cuándo quieres abrir la escuela?", type: "select", required: true, span: 1, options: LAUNCH },
        { name: "first_cohort_date", label: "Fecha de la primera generación", type: "text", span: 1, placeholder: "Ej. enero 2027" },
        { name: "additional_comments", label: "Comentarios adicionales", type: "textarea", rows: 3, span: 2 },
      ],
    ),
    consentSection(10),
  ],
};

export const INTAKE_FORMS: Record<IntakeFormKey, IntakeForm> = {
  sitio_web: SITIO_WEB,
  escuela_virtual: ESCUELA_VIRTUAL,
};

export const allFields = (form: IntakeForm): FieldDef[] =>
  form.sections.flatMap((s) => s.fields);
