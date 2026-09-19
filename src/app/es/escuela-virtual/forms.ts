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
// Formulario 1 — Sitio web
// ─────────────────────────────────────────────────────────────
const SITIO_WEB: IntakeForm = {
  key: "sitio_web",
  slug: "sitio-web",
  eyebrow: "Formulario 1 de 2 · Sitio web",
  title: "Construyamos tu sitio web.",
  titleMuted: "Cuéntanos quiénes son.",
  intro:
    "Este formulario reúne la identidad, el contenido y las funciones que necesita el sitio web de tu institución. Toma unos 10 minutos y tu avance se guarda en este navegador.",
  submitLabel: "Enviar formulario",
  successTitle: "Formulario del sitio web recibido",
  successBody:
    "Gracias. Ya tenemos la información del sitio web. Ahora completa el formulario 2 sobre la escuela virtual para que podamos preparar la propuesta completa.",
  sections: [
    contactSection(1),
    section(
      "identidad",
      2,
      "Identidad",
      "Tu institución y tu marca.",
      "Lo esencial para comunicar quiénes son y cómo se deben ver.",
      [
        {
          name: "organization_description",
          label: "¿Qué es tu institución y a qué se dedica?",
          type: "textarea",
          required: true,
          rows: 4,
          span: 2,
        },
        { name: "mission_vision", label: "Misión, visión y valores", type: "textarea", rows: 4, span: 2 },
        { name: "founded_year", label: "Año de fundación", type: "text", span: 1 },
        {
          name: "has_logo",
          label: "¿Tienen logotipo?",
          type: "select",
          required: true,
          span: 1,
          options: opts([
            ["yes_vector", "Sí, en archivo editable (AI, SVG, PDF)"],
            ["yes_image", "Sí, solo como imagen (PNG/JPG)"],
            ["needs_refresh", "Sí, pero queremos renovarlo"],
            ["no", "No, necesitamos uno"],
          ]),
        },
        {
          name: "brand_colors",
          label: "Colores de la marca",
          type: "text",
          span: 1,
          placeholder: "Ej. azul marino #0B2545 y dorado",
        },
        { name: "brand_fonts", label: "Tipografías (si las tienen)", type: "text", span: 1 },
        {
          name: "desired_style",
          label: "Estilo visual deseado",
          type: "multiselect",
          span: 2,
          options: opts([
            ["modern", "Moderno"],
            ["academic", "Clásico / académico"],
            ["minimal", "Minimalista"],
            ["elegant", "Elegante / premium"],
            ["youthful", "Juvenil / dinámico"],
            ["corporate", "Corporativo"],
            ["warm", "Cálido / cercano"],
          ]),
        },
        {
          name: "brand_assets_url",
          label: "Link a logo, fotos y materiales",
          type: "url",
          span: 2,
          placeholder: "https://drive.google.com/…",
          hint: "Comparte una carpeta de Google Drive, Dropbox o similar con acceso de lectura.",
        },
      ],
    ),
    section(
      "presencia",
      3,
      "Presencia digital",
      "Dominio y redes.",
      "Lo que ya existe y lo que hay que crear.",
      [
        {
          name: "has_domain",
          label: "¿Tienen dominio (ej. miescuela.com)?",
          type: "select",
          required: true,
          span: 1,
          options: opts([
            ["yes", "Sí"],
            ["no", "No, hay que comprarlo"],
            ["not_sure", "No estoy seguro"],
          ]),
        },
        { name: "domain_name", label: "Dominio actual o deseado", type: "text", span: 1, placeholder: "miescuela.com" },
        { name: "current_website_url", label: "Sitio web actual (si existe)", type: "url", span: 2, placeholder: "https://…" },
        {
          name: "needs_institutional_email",
          label: "¿Necesitan correos institucionales?",
          type: "select",
          span: 2,
          options: opts([
            ["already_have", "Ya los tenemos"],
            ["yes", "Sí, necesitamos configurarlos"],
            ["no", "No por ahora"],
          ]),
        },
        { name: "instagram_url", label: "Instagram", type: "url", span: 1 },
        { name: "facebook_url", label: "Facebook", type: "url", span: 1 },
        { name: "youtube_url", label: "YouTube", type: "url", span: 1 },
        { name: "other_social_url", label: "Otra red (TikTok, LinkedIn…)", type: "url", span: 1 },
      ],
    ),
    section(
      "contenido",
      4,
      "Contenido",
      "Estructura y contenido del sitio.",
      "Qué páginas necesitas y a quién le hablas.",
      [
        {
          name: "pages_needed",
          label: "Páginas que necesita el sitio",
          type: "multiselect",
          required: true,
          span: 2,
          options: opts([
            ["home", "Inicio"],
            ["about", "Nosotros / historia"],
            ["programs", "Oferta académica / programas"],
            ["faculty", "Profesores / equipo"],
            ["admissions", "Admisiones / inscripción"],
            ["events", "Eventos / calendario"],
            ["blog", "Blog / noticias"],
            ["testimonials", "Testimonios"],
            ["faq", "Preguntas frecuentes"],
            ["donations", "Donaciones / ofrendas"],
            ["store", "Tienda"],
            ["contact", "Contacto"],
          ]),
        },
        {
          name: "target_audience",
          label: "¿A quién va dirigido el sitio?",
          type: "textarea",
          required: true,
          rows: 3,
          span: 2,
          placeholder: "Edad, perfil, intereses, de dónde son…",
        },
        {
          name: "key_message",
          label: "Mensaje principal que quieres transmitir",
          type: "textarea",
          rows: 3,
          span: 2,
        },
        {
          name: "main_cta",
          label: "Acción principal que debe hacer el visitante",
          type: "select",
          required: true,
          span: 1,
          options: opts([
            ["enroll", "Inscribirse en un curso"],
            ["request_info", "Solicitar información"],
            ["book_call", "Agendar una llamada"],
            ["buy", "Comprar un curso"],
            ["donate", "Donar"],
            ["other", "Otra"],
          ]),
        },
        {
          name: "copy_provider",
          label: "¿Quién escribe los textos?",
          type: "select",
          span: 1,
          options: opts([
            ["client", "Nosotros los proveemos"],
            ["ikingdom", "Que iKingdom los redacte"],
            ["mixed", "Mixto"],
          ]),
        },
        {
          name: "has_photos_videos",
          label: "¿Tienen fotos y videos propios?",
          type: "select",
          span: 2,
          options: opts([
            ["yes_professional", "Sí, profesionales"],
            ["yes_basic", "Sí, pero básicos"],
            ["no", "No, usaremos banco de imágenes o producción"],
          ]),
        },
      ],
    ),
    section(
      "funciones",
      5,
      "Funciones",
      "Funciones y referencias.",
      "Qué debe hacer el sitio y qué te inspira.",
      [
        {
          name: "features_needed",
          label: "Funciones necesarias",
          type: "multiselect",
          span: 2,
          options: opts([
            ["contact_form", "Formulario de contacto"],
            ["whatsapp", "Botón de WhatsApp"],
            ["online_enrollment", "Inscripción en línea"],
            ["online_payments", "Pagos en línea"],
            ["calendar", "Calendario de eventos"],
            ["newsletter", "Newsletter"],
            ["ai_chat", "Chat con IA"],
            ["crm", "Conexión con CRM"],
            ["school_login", "Acceso a la escuela virtual"],
            ["analytics", "Analítica y píxeles (Meta, Google)"],
          ]),
        },
        {
          name: "site_languages",
          label: "Idiomas del sitio",
          type: "select",
          span: 1,
          options: opts([
            ["es", "Solo español"],
            ["es_en", "Español e inglés"],
            ["es_pt", "Español y portugués"],
            ["other", "Otros"],
          ]),
        },
        { name: "competitors", label: "Instituciones de referencia o competencia", type: "text", span: 1 },
        {
          name: "reference_sites",
          label: "Sitios web que te gustan (y por qué)",
          type: "textarea",
          rows: 3,
          span: 2,
          placeholder: "https://… — me gusta el diseño limpio",
        },
        { name: "dislikes", label: "Lo que NO quieres en tu sitio", type: "textarea", rows: 2, span: 2 },
      ],
    ),
    section(
      "tiempos",
      6,
      "Tiempos",
      "Tiempos y presupuesto.",
      "Para planear la entrega.",
      [
        { name: "desired_launch", label: "¿Cuándo quieres lanzar el sitio?", type: "select", required: true, span: 1, options: LAUNCH },
        { name: "estimated_budget_range", label: "Presupuesto estimado (sitio + escuela)", type: "select", span: 1, options: BUDGET },
        { name: "decision_maker", label: "¿Quién aprueba el proyecto?", type: "text", span: 2, placeholder: "Nombre y cargo" },
        { name: "additional_comments", label: "Comentarios adicionales", type: "textarea", rows: 3, span: 2 },
      ],
    ),
    consentSection(7),
  ],
};

// ─────────────────────────────────────────────────────────────
// Formulario 2 — Escuela virtual
// ─────────────────────────────────────────────────────────────
const ESCUELA_VIRTUAL: IntakeForm = {
  key: "escuela_virtual",
  slug: "escuela",
  eyebrow: "Formulario 2 de 2 · Escuela virtual",
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
