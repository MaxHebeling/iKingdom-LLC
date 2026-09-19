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
// Formulario 2 — Fase 2: Escuela / Campus virtual
// ─────────────────────────────────────────────────────────────
const ESCUELA_VIRTUAL: IntakeForm = {
  key: "escuela_virtual",
  slug: "escuela",
  eyebrow: "Fase 2 · Campus virtual",
  title: "Diseñemos tu campus virtual.",
  titleMuted: "No una sección con videos: una escuela completa.",
  intro:
    "Este formulario define cómo funcionará el campus: estructura académica, alumnos, clases, evaluaciones, certificados, pagos, roles y datos técnicos. Puedes completarlo en varias sesiones: tu avance se guarda en este navegador.",
  submitLabel: "Enviar formulario",
  successTitle: "Información del campus recibida",
  successBody:
    "Gracias. Con esta información diseñaremos la arquitectura de tu campus virtual y te contactaremos para revisar la propuesta.",
  sections: [
    contactSection(1),
    // 1 — Información general
    section(
      "escuela",
      2,
      "La escuela",
      "Información general de la escuela.",
      "Quiénes son, qué enseñan y bajo qué condiciones.",
      [
        { name: "school_name", label: "Nombre oficial de la escuela", type: "text", required: true, span: 2 },
        {
          name: "school_type",
          label: "Tipo de escuela",
          type: "multiselect",
          required: true,
          span: 2,
          options: opts([
            ["bible_school", "Escuela bíblica"],
            ["ministerial_school", "Escuela ministerial"],
            ["institute", "Instituto"],
            ["seminary", "Seminario"],
            ["pastoral_training", "Formación pastoral"],
            ["discipleship", "Discipulado"],
          ]),
        },
        { name: "school_description", label: "Descripción", type: "textarea", required: true, rows: 3, span: 2 },
        { name: "school_purpose", label: "Propósito", type: "textarea", rows: 3, span: 2 },
        { name: "school_director", label: "Director", type: "text", span: 1 },
        { name: "school_coordinators", label: "Coordinadores", type: "text", span: 1 },
        { name: "school_teachers", label: "Profesores", type: "textarea", rows: 3, span: 2, placeholder: "Nombre — materia (uno por línea)" },
        { name: "academic_program", label: "Programa académico", type: "textarea", rows: 4, span: 2, placeholder: "Materias o cursos que componen el programa." },
        { name: "program_duration", label: "Duración", type: "text", span: 1, placeholder: "Ej. 2 años" },
        {
          name: "modality",
          label: "Modalidad",
          type: "select",
          required: true,
          span: 1,
          options: opts([
            ["online", "100% online"],
            ["hybrid", "Híbrida (online + presencial)"],
            ["in_person_support", "Presencial con apoyo online"],
          ]),
        },
        { name: "admission_requirements", label: "Requisitos", type: "textarea", rows: 2, span: 2 },
        { name: "school_costs", label: "Costos", type: "text", span: 1 },
        { name: "academic_cycles", label: "Ciclos académicos", type: "text", span: 1, placeholder: "Ej. marzo–julio y agosto–diciembre" },
        { name: "school_logo_url", label: "Link al logo de la escuela", type: "url", span: 2, placeholder: "https://drive.google.com/…" },
        {
          name: "campus_address",
          label: "¿Dónde vivirá el campus?",
          type: "select",
          span: 2,
          options: opts([
            ["path", "ministerio.org.ar/campus"],
            ["subdomain", "campus.ministerio.org.ar"],
            ["advice", "Que iKingdom recomiende"],
          ]),
        },
      ],
    ),
    // 2 — Estructura académica
    section(
      "estructura",
      3,
      "Estructura",
      "Estructura académica.",
      "Una de las decisiones más importantes: define cómo se organiza todo el campus.",
      [
        {
          name: "academic_structure",
          label: "¿Cómo se organiza la enseñanza?",
          type: "select",
          required: true,
          span: 2,
          options: opts([
            ["year_module_subject_week_class", "Año → Módulo → Materia → Semana → Clase"],
            ["level_course_unit_lesson", "Nivel → Curso → Unidad → Lección"],
            ["program_course_module_class", "Programa → Curso → Módulo → Clase"],
            ["other", "Otra"],
            ["advice", "Necesitamos asesoría"],
          ]),
        },
        {
          name: "structure_detail",
          label: "Detalle de la estructura",
          type: "textarea",
          required: true,
          rows: 6,
          span: 2,
          placeholder: "Ej. Año 1 → Módulo 1: Fundamentos → Materias: Doctrina, Liderazgo… → 8 semanas, 1 clase por semana",
        },
      ],
    ),
    // 3 — Matrícula
    section(
      "matricula",
      4,
      "Matrícula",
      "Matrícula.",
      "¿Cómo entra una persona a la escuela?",
      [
        {
          name: "enrollment_rules",
          label: "Condiciones de ingreso",
          type: "multiselect",
          required: true,
          span: 2,
          options: opts([
            ["open", "Cualquiera puede registrarse"],
            ["admin_approval", "La administración debe aprobarla"],
            ["pay_first", "Debe pagar primero"],
            ["must_be_member", "Tiene que ser miembro"],
            ["pastoral_recommendation", "Necesita recomendación pastoral"],
            ["enrollment_window", "Hay fecha de inscripción"],
          ]),
        },
        { name: "enrollment_dates", label: "Fechas de inscripción", type: "text", span: 2, placeholder: "Ej. del 1 al 28 de febrero" },
      ],
    ),
    // 4 — Datos del alumno
    section(
      "alumno",
      5,
      "Datos del alumno",
      "Datos del alumno.",
      "Qué información se pide al inscribirse. Solo lo necesario: son datos personales.",
      [
        {
          name: "student_fields",
          label: "Datos a solicitar",
          type: "multiselect",
          required: true,
          span: 2,
          options: opts([
            ["first_name", "Nombre"],
            ["last_name", "Apellido"],
            ["document", "Documento / DNI"],
            ["birth_date", "Fecha de nacimiento"],
            ["sex", "Sexo (solo si es administrativamente necesario)"],
            ["email", "Email"],
            ["whatsapp", "WhatsApp"],
            ["country", "País"],
            ["province", "Provincia"],
            ["city", "Ciudad"],
            ["church", "Iglesia"],
            ["pastor", "Pastor"],
            ["ministry", "Ministerio"],
            ["photo", "Fotografía"],
          ]),
        },
        {
          name: "student_admin_fields",
          label: "Datos administrativos del alumno",
          type: "multiselect",
          span: 2,
          options: opts([
            ["enrollment_date", "Fecha de inscripción"],
            ["student_number", "Número de alumno"],
            ["academic_status", "Estado académico"],
            ["assigned_courses", "Cursos asignados"],
          ]),
        },
        { name: "student_number_format", label: "Formato del número de alumno", type: "text", span: 2, placeholder: "Ej. EM-2027-0001 o que lo defina iKingdom" },
        { name: "student_fields_other", label: "Otros datos que necesitan", type: "text", span: 2 },
      ],
    ),
    // 5 — Portal del alumno
    section(
      "portal",
      6,
      "Portal del alumno",
      "Portal del alumno: MI CAMPUS.",
      "Lo que verá cada estudiante al ingresar.",
      [
        {
          name: "portal_features",
          label: "Elementos del portal",
          type: "multiselect",
          required: true,
          span: 2,
          options: opts([
            ["welcome", "Bienvenida"],
            ["name_photo", "Nombre y foto"],
            ["student_number", "Número de alumno"],
            ["program", "Carrera / programa"],
            ["courses", "Cursos"],
            ["next_class", "Próxima clase"],
            ["completed", "Clases completadas"],
            ["pending", "Clases pendientes"],
            ["progress", "Porcentaje de avance"],
            ["grades", "Calificaciones"],
            ["materials", "Materiales"],
            ["assessments", "Evaluaciones"],
            ["certificates", "Certificados"],
            ["notifications", "Notificaciones"],
          ]),
        },
      ],
    ),
    // 6 + 7 — Clases semanales y video
    section(
      "clases",
      7,
      "Clases y video",
      "Clases semanales y video.",
      "Recomendamos que el administrador pueda PUBLICAR AHORA o PROGRAMAR fecha y hora, y que el sistema desbloquee la clase solo.",
      [
        {
          name: "class_release",
          label: "¿Cómo se habilitan las clases?",
          type: "select",
          required: true,
          span: 2,
          options: opts([
            ["scheduled_weekly", "Automáticamente, una nueva cada semana"],
            ["publish_or_schedule", "El administrador elige: publicar ahora o programar"],
            ["all_available", "Todo disponible desde el inicio"],
            ["advice", "Necesitamos asesoría"],
          ]),
        },
        { name: "release_schedule", label: "Día y hora de publicación habitual", type: "text", span: 2, placeholder: "Ej. cada martes a las 20:00 (hora Argentina)" },
        {
          name: "video_host",
          label: "¿Dónde estarán alojados los videos?",
          type: "select",
          required: true,
          span: 2,
          hint: "No recomendamos subir videos pesados al servidor web: conviene una plataforma de video dedicada.",
          options: opts([
            ["vimeo", "Vimeo"],
            ["youtube_unlisted", "YouTube privado / no listado"],
            ["bunny", "Bunny Stream"],
            ["cloudflare", "Cloudflare Stream"],
            ["mux", "Mux"],
            ["advice", "Que iKingdom recomiende"],
          ]),
        },
        { name: "current_video_location", label: "¿Dónde están hoy los videos?", type: "text", span: 2 },
      ],
    ),
    // 8 + 9 + 10 — Protección, estructura de clase y progreso
    section(
      "clase",
      8,
      "Cada clase",
      "Protección, contenido y progreso de cada clase.",
      "Idealmente: alumno autenticado → curso autorizado → clase autorizada.",
      [
        {
          name: "link_sharing",
          label: "¿Un alumno puede compartir el enlace de una clase?",
          type: "select",
          required: true,
          span: 2,
          options: opts([
            ["no", "No, solo alumnos autorizados (recomendado)"],
            ["yes", "Sí, puede compartirse"],
          ]),
        },
        {
          name: "class_components",
          label: "Contenido de cada clase",
          type: "multiselect",
          span: 2,
          options: opts([
            ["video", "Video"],
            ["description", "Descripción"],
            ["bible_text", "Texto bíblico"],
            ["teacher", "Profesor"],
            ["objectives", "Objetivos"],
            ["pdf", "Material PDF"],
            ["reading", "Lectura"],
            ["resources", "Recursos"],
            ["questions", "Preguntas"],
            ["assignment", "Tarea"],
            ["assessment", "Evaluación"],
          ]),
        },
        {
          name: "completion_rule",
          label: "¿Cuándo se considera completada una clase?",
          type: "select",
          required: true,
          span: 2,
          options: opts([
            ["auto_90", "Automático al ver al menos el 90% del video (recomendado)"],
            ["auto_custom", "Automático con otro porcentaje"],
            ["manual_button", "Botón MARCAR COMO COMPLETADA"],
            ["both", "Automático + botón manual"],
          ]),
        },
        { name: "completion_threshold", label: "Porcentaje mínimo (si es otro)", type: "text", span: 1, placeholder: "Ej. 80%" },
        {
          name: "track_video_progress",
          label: "¿Registrar el avance del video (10, 25, 50, 75, 90, 100%)?",
          type: "select",
          span: 1,
          options: YES_NO,
        },
      ],
    ),
    // 11 + 12 — Evaluaciones y tareas
    section(
      "evaluaciones",
      9,
      "Evaluaciones",
      "Evaluaciones y tareas.",
      "Cómo se evalúa y cómo se corrige.",
      [
        {
          name: "assessment_types",
          label: "Tipos de evaluación",
          type: "multiselect",
          span: 2,
          options: opts([
            ["multiple_choice", "Preguntas múltiples"],
            ["true_false", "Verdadero / falso"],
            ["short_answer", "Respuestas escritas"],
            ["essay", "Ensayos"],
            ["assignments", "Tareas"],
            ["file_upload", "Entrega de archivos"],
            ["exams", "Exámenes"],
            ["none", "Sin evaluaciones"],
          ]),
        },
        {
          name: "grading_mode",
          label: "Corrección",
          type: "select",
          span: 2,
          options: opts([
            ["auto", "Automática"],
            ["teacher", "Por el profesor"],
            ["both", "Ambas, según el tipo"],
          ]),
        },
        { name: "passing_grade", label: "Nota mínima para aprobar", type: "text", span: 1, placeholder: "Ej. 6/10" },
        { name: "max_attempts", label: "Cantidad de intentos", type: "text", span: 1, placeholder: "Ej. 2" },
        { name: "time_limit", label: "Tiempo máximo por examen", type: "text", span: 1, placeholder: "Ej. 60 minutos" },
        { name: "deadlines", label: "Fechas límite", type: "text", span: 1, placeholder: "Ej. 7 días después de la clase" },
        {
          name: "assignment_uploads",
          label: "¿Los alumnos suben tareas (PDF/DOCX) para que el profesor las revise y comente?",
          type: "select",
          span: 2,
          options: YES_NO,
        },
      ],
    ),
    // 13 + 14 — Asistencia y certificados
    section(
      "certificados",
      10,
      "Certificados",
      "Asistencia y certificados.",
      "Registro automático por alumno: clase, video visto, evaluación y estado.",
      [
        {
          name: "attendance_tracking",
          label: "¿Registrar asistencia automáticamente?",
          type: "select",
          span: 2,
          options: YES_NO,
        },
        { name: "min_attendance", label: "Asistencia mínima requerida", type: "text", span: 2, placeholder: "Ej. 80% de las clases" },
        {
          name: "certificates",
          label: "¿Quieren certificados?",
          type: "select",
          required: true,
          span: 2,
          options: opts([
            ["auto", "Sí, generados automáticamente"],
            ["manual", "Sí, emitidos por la administración"],
            ["no", "No"],
          ]),
        },
        {
          name: "certificate_conditions",
          label: "Condiciones para emitirlo",
          type: "multiselect",
          span: 2,
          options: opts([
            ["all_classes", "Completar todas las clases"],
            ["attendance", "Cumplir asistencia"],
            ["passed_assessments", "Aprobar evaluaciones"],
            ["no_debt", "No tener cuotas pendientes"],
          ]),
        },
        {
          name: "certificate_fields",
          label: "El certificado incluye",
          type: "multiselect",
          span: 2,
          options: opts([
            ["name", "Nombre"],
            ["course", "Curso"],
            ["date", "Fecha"],
            ["signature", "Firma"],
            ["qr", "QR verificable"],
            ["number", "Número de certificado"],
          ]),
        },
        { name: "certificate_signers", label: "¿Quién firma los certificados?", type: "text", span: 2 },
      ],
    ),
    // 15 — Pagos
    section(
      "pagos",
      11,
      "Pagos",
      "Pagos.",
      "El sistema puede marcar a cada alumno: al día, próximo vencimiento o pago vencido.",
      [
        {
          name: "payment_model",
          label: "Modelo de pago",
          type: "select",
          required: true,
          span: 2,
          options: opts([
            ["free", "Gratuita"],
            ["one_time", "Pago único"],
            ["monthly", "Mensual"],
            ["enrollment_plus_monthly", "Matrícula + mensualidades"],
            ["per_course", "Por curso"],
          ]),
        },
        { name: "prices", label: "Precios", type: "text", span: 2, placeholder: "Ej. matrícula $20.000 + 10 cuotas de $15.000" },
        {
          name: "payment_methods",
          label: "Medios de pago",
          type: "multiselect",
          span: 2,
          options: opts([
            ["mercadopago", "Mercado Pago"],
            ["bank_transfer", "Transferencia"],
            ["paypal", "PayPal"],
            ["stripe", "Stripe"],
            ["cash", "Efectivo en la sede"],
          ]),
        },
        {
          name: "payment_currencies",
          label: "Monedas",
          type: "multiselect",
          span: 1,
          options: opts([
            ["ars", "Pesos argentinos"],
            ["usd", "USD"],
            ["other", "Otra"],
          ]),
        },
        {
          name: "payment_status_tracking",
          label: "¿Control de estado de pago por alumno?",
          type: "select",
          span: 1,
          options: YES_NO,
        },
        {
          name: "block_on_debt",
          label: "Si un alumno tiene pagos vencidos…",
          type: "select",
          span: 2,
          options: opts([
            ["block", "Se bloquea el acceso a nuevas clases"],
            ["warn", "Solo se le avisa"],
            ["nothing", "No pasa nada"],
          ]),
        },
        { name: "scholarships", label: "Becas o descuentos", type: "text", span: 2 },
      ],
    ),
    // 16 + 17 — Profesores y roles
    section(
      "roles",
      12,
      "Roles",
      "Profesores y roles.",
      "El profesor gestiona sus materias, pero no administra toda la plataforma.",
      [
        {
          name: "teacher_permissions",
          label: "El PROFESOR puede",
          type: "multiselect",
          span: 2,
          options: opts([
            ["view_courses", "Ver sus cursos"],
            ["upload_materials", "Subir materiales"],
            ["create_classes", "Crear clases"],
            ["publish_videos", "Publicar videos"],
            ["create_assessments", "Crear evaluaciones"],
            ["review_assignments", "Revisar tareas"],
            ["grade", "Calificar"],
            ["announcements", "Enviar anuncios"],
            ["view_students", "Ver alumnos"],
          ]),
        },
        {
          name: "roles",
          label: "Roles necesarios",
          type: "multiselect",
          required: true,
          span: 2,
          options: opts([
            ["super_admin", "Super Admin — control completo"],
            ["admin", "Administrador — gestión académica"],
            ["academic_director", "Director académico — cursos, docentes y estudiantes"],
            ["teacher", "Profesor — sus materias"],
            ["tutor", "Tutor — seguimiento de alumnos"],
            ["student", "Alumno — su contenido"],
          ]),
        },
        {
          name: "role_assignments",
          label: "¿Quién tendrá cada rol?",
          type: "textarea",
          rows: 4,
          span: 2,
          placeholder: "Rol — nombre — email (uno por línea)",
        },
      ],
    ),
    // 18 + 19 — Panel y analíticas
    section(
      "panel",
      13,
      "Panel",
      "Panel administrativo y analíticas.",
      "El verdadero cerebro del sistema.",
      [
        {
          name: "dashboard_metrics",
          label: "Indicadores del dashboard",
          type: "multiselect",
          span: 2,
          options: opts([
            ["active_students", "Alumnos activos"],
            ["active_courses", "Cursos activos"],
            ["classes_this_week", "Clases esta semana"],
            ["avg_completion", "Finalización promedio"],
            ["pending_assessments", "Evaluaciones pendientes"],
            ["pending_payments", "Pagos pendientes"],
          ]),
        },
        {
          name: "analytics",
          label: "La administración debe poder saber",
          type: "multiselect",
          span: 2,
          options: opts([
            ["logins", "Cuántos alumnos entraron"],
            ["never_logged", "Quién no ingresó"],
            ["watched", "Quién vio la clase"],
            ["dropped_video", "Quién abandonó el video"],
            ["behind", "Quién está atrasado"],
            ["passed", "Quién aprobó"],
            ["missing_assignments", "Quién no entregó tareas"],
            ["avg_progress", "Progreso promedio"],
            ["highest_dropout", "Curso con mayor abandono"],
          ]),
        },
      ],
    ),
    // 20 + 21 — Comunicaciones y recuperación
    section(
      "comunicaciones",
      14,
      "Comunicaciones",
      "Comunicaciones y seguimiento.",
      "Ej. «La clase 7 de Liderazgo Ministerial ya está disponible» o «María Gómez no ingresó en 14 días y tiene 3 clases pendientes».",
      [
        {
          name: "communication_channels",
          label: "Canales de aviso",
          type: "multiselect",
          span: 2,
          options: opts([
            ["email", "Email"],
            ["whatsapp", "WhatsApp"],
            ["in_app", "Notificaciones dentro de la plataforma"],
          ]),
        },
        {
          name: "inactive_alerts",
          label: "¿Avisar cuando un alumno está inactivo?",
          type: "select",
          span: 1,
          options: YES_NO,
        },
        { name: "inactive_days", label: "Días sin ingresar para considerarlo inactivo", type: "text", span: 1, placeholder: "Ej. 14" },
        {
          name: "inactive_alert_recipient",
          label: "¿A quién se avisa?",
          type: "multiselect",
          span: 2,
          options: opts([
            ["tutor", "Tutor"],
            ["teacher", "Profesor"],
            ["admin", "Administración"],
            ["pastor", "Pastor del alumno"],
            ["student", "Al propio alumno"],
          ]),
        },
      ],
    ),
    // 22 — IA
    section(
      "ia",
      15,
      "IA",
      "Asistente de la escuela con IA.",
      "Lo dejamos previsto desde el principio, aunque no se implemente en la versión 1. Respondería solo con las clases, PDFs y material oficial.",
      [
        {
          name: "ai_interest",
          label: "¿Les interesa?",
          type: "select",
          span: 2,
          options: opts([
            ["v1", "Sí, desde la versión 1"],
            ["later", "Sí, más adelante"],
            ["no", "No"],
          ]),
        },
        {
          name: "ai_uses",
          label: "Usos deseados",
          type: "multiselect",
          span: 2,
          options: opts([
            ["content_qa", "Preguntas sobre lo enseñado en las clases"],
            ["pending_tasks", "¿Qué tareas tengo pendientes?"],
            ["next_exam", "¿Cuándo es mi próximo examen?"],
            ["re_explain", "Volver a explicar el tema de una clase"],
          ]),
        },
      ],
    ),
    // 23 — Datos técnicos
    section(
      "tecnico",
      16,
      "Datos técnicos",
      "Información técnica.",
      "No es igual construir para 80 alumnos que para 10.000. Aproximaciones sirven.",
      [
        { name: "current_students", label: "Alumnos actuales", type: "text", required: true, span: 1 },
        { name: "projected_students", label: "Alumnos proyectados (1–2 años)", type: "text", required: true, span: 1 },
        { name: "teacher_count", label: "Cantidad de profesores", type: "text", span: 1 },
        { name: "course_count", label: "Cantidad de cursos", type: "text", span: 1 },
        { name: "classes_per_year", label: "Clases por año", type: "text", span: 1 },
        { name: "avg_video_duration", label: "Duración promedio de video", type: "text", span: 1, placeholder: "Ej. 45 min" },
        { name: "video_count", label: "Cantidad de videos existentes", type: "text", span: 1 },
        { name: "file_sizes", label: "Tamaño aproximado de archivos", type: "text", span: 1, placeholder: "Ej. 1–2 GB por video" },
        { name: "access_countries", label: "Países desde donde accederán", type: "text", span: 1 },
        { name: "concurrent_users", label: "Usuarios simultáneos estimados", type: "text", span: 1 },
      ],
    ),
    // 24 — Protección legal
    section(
      "legal",
      17,
      "Legal",
      "Protección legal.",
      "Datos de la entidad y políticas del campus.",
      [
        { name: "legal_name", label: "Razón social", type: "text", span: 1 },
        { name: "cuit", label: "CUIT", type: "text", span: 1 },
        { name: "legal_representative", label: "Responsable legal", type: "text", span: 2 },
        {
          name: "existing_policies",
          label: "Documentos que YA tienen",
          type: "multiselect",
          span: 2,
          options: opts([
            ["privacy", "Política de privacidad"],
            ["terms", "Términos de uso"],
            ["cookies", "Política de cookies"],
            ["image_rights", "Autorización de imagen"],
            ["data_processing", "Tratamiento de datos personales"],
            ["academic", "Política académica"],
            ["payments_refunds", "Política de pagos / reembolsos"],
          ]),
        },
        {
          name: "policies_drafting",
          label: "Para los documentos que faltan…",
          type: "select",
          span: 2,
          options: opts([
            ["client", "Los redactamos nosotros"],
            ["ikingdom_draft", "Que iKingdom prepare un borrador para revisión legal"],
            ["lawyer", "Los prepara nuestro abogado"],
          ]),
        },
        { name: "policies_url", label: "Link a los documentos existentes", type: "url", span: 2, placeholder: "https://drive.google.com/…" },
        { name: "desired_launch", label: "¿Cuándo quieren abrir el campus?", type: "select", required: true, span: 1, options: LAUNCH },
        { name: "first_cohort_date", label: "Inicio de la primera cohorte", type: "text", span: 1, placeholder: "Ej. marzo 2027" },
        { name: "additional_comments", label: "Comentarios adicionales", type: "textarea", rows: 3, span: 2 },
      ],
    ),
    consentSection(18),
  ],
};

export const INTAKE_FORMS: Record<IntakeFormKey, IntakeForm> = {
  sitio_web: SITIO_WEB,
  escuela_virtual: ESCUELA_VIRTUAL,
};

export const allFields = (form: IntakeForm): FieldDef[] =>
  form.sections.flatMap((s) => s.fields);
