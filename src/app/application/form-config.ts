// ─────────────────────────────────────────────────────────────
// iKingdom — /application form: declarative section config
// Drives the multi-step wizard. Single source of truth for
// fields, labels, options, and required-flags.
// ─────────────────────────────────────────────────────────────

export type FieldType =
  | "text"
  | "email"
  | "tel"
  | "url"
  | "textarea"
  | "select"
  | "multiselect"
  | "checkbox"
  | "phone-intl"
  | "country";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  options?: { value: string; label: string }[];
  span?: 1 | 2;
  hint?: string;
}

export interface SectionDef {
  id: string;
  index: number;
  label: string;
  title: string;
  subtitle: string;
  fields: FieldDef[];
}

const o = (entries: [string, string][]) => entries.map(([value, label]) => ({ value, label }));

export const SECTIONS: SectionDef[] = [
  {
    id: "contact",
    index: 1,
    label: "Contacto",
    title: "¿Con quién hablamos?",
    subtitle: "Información básica para identificar tu caso.",
    fields: [
      { name: "full_name", label: "Nombre completo", type: "text", required: true, span: 1 },
      { name: "job_title", label: "Cargo / posición", type: "text", span: 1 },
      { name: "company_name", label: "Nombre de la empresa", type: "text", required: true, span: 1 },
      { name: "email", label: "Email corporativo", type: "email", required: true, span: 1 },
      { name: "phone_whatsapp", label: "Teléfono / WhatsApp", type: "phone-intl", required: true, span: 1, placeholder: "Número" },
      { name: "country", label: "País", type: "country", span: 1 },
      { name: "city", label: "Ciudad", type: "text", span: 1 },
      { name: "website_url", label: "Sitio web", type: "url", span: 1, placeholder: "https://…" },
      { name: "instagram_url", label: "Instagram", type: "url", span: 1 },
      { name: "facebook_url", label: "Facebook", type: "url", span: 1 },
      { name: "linkedin_url", label: "LinkedIn", type: "url", span: 1 },
      { name: "other_social_url", label: "Otra red social", type: "url", span: 1 },
    ],
  },
  {
    id: "business",
    index: 2,
    label: "Negocio",
    title: "Tu negocio en detalle.",
    subtitle: "Cuéntanos qué hace tu empresa y desde cuándo opera.",
    fields: [
      {
        name: "business_description",
        label: "Descripción del negocio",
        type: "textarea",
        required: true,
        rows: 4,
        span: 2,
        placeholder: "¿A qué se dedica tu empresa? ¿Cuál es su propósito?",
      },
      {
        name: "product_or_service_description",
        label: "Producto o servicio principal",
        type: "textarea",
        required: true,
        rows: 4,
        span: 2,
        placeholder: "Describe lo que vendes y cómo lo entregas.",
      },
      { name: "industry", label: "Industria / sector", type: "text", span: 1 },
      {
        name: "years_operating",
        label: "Años operando",
        type: "select",
        span: 1,
        options: o([
          ["just_starting", "Apenas empezando"],
          ["less_than_1_year", "Menos de 1 año"],
          ["one_to_three_years", "1 a 3 años"],
          ["three_to_five_years", "3 a 5 años"],
          ["more_than_5_years", "Más de 5 años"],
        ]),
      },
      {
        name: "offering_type",
        label: "Tipo de oferta",
        type: "select",
        span: 1,
        options: o([
          ["services", "Servicios"],
          ["products", "Productos"],
          ["both", "Ambos"],
        ]),
      },
    ],
  },
  {
    id: "offer",
    index: 3,
    label: "Oferta",
    title: "Tu oferta y ventas.",
    subtitle: "Necesitamos entender qué vendes y cómo lo vendes hoy.",
    fields: [
      { name: "primary_offer", label: "Oferta principal", type: "textarea", rows: 3, span: 2 },
      { name: "secondary_offers", label: "Ofertas secundarias", type: "textarea", rows: 3, span: 2 },
      { name: "average_ticket", label: "Ticket promedio (USD)", type: "text", span: 1, placeholder: "Ej. $1,500" },
      {
        name: "has_defined_sales_process",
        label: "¿Tienes un proceso de ventas definido?",
        type: "select",
        span: 1,
        options: o([
          ["yes", "Sí"],
          ["partially", "Parcialmente"],
          ["no", "No"],
        ]),
      },
      {
        name: "current_sales_channels",
        label: "Canales de venta actuales",
        type: "multiselect",
        span: 2,
        options: o([
          ["instagram", "Instagram"],
          ["facebook", "Facebook"],
          ["whatsapp", "WhatsApp"],
          ["website", "Sitio web"],
          ["phone_calls", "Llamadas"],
          ["referrals", "Referidos"],
          ["sales_team", "Equipo de ventas"],
          ["marketplace", "Marketplace"],
          ["email", "Email"],
          ["other", "Otro"],
        ]),
      },
    ],
  },
  {
    id: "customer",
    index: 4,
    label: "Cliente",
    title: "Tu cliente ideal.",
    subtitle: "¿A quién sirves mejor y por qué te eligen?",
    fields: [
      { name: "ideal_customer_description", label: "Cliente ideal", type: "textarea", rows: 4, span: 2 },
      {
        name: "customer_type",
        label: "Tipo de cliente",
        type: "multiselect",
        span: 2,
        options: o([
          ["individuals", "Personas"],
          ["businesses", "Empresas"],
          ["churches", "Iglesias"],
          ["ministries", "Ministerios"],
          ["organizations", "Organizaciones"],
          ["government", "Gobierno"],
          ["other", "Otro"],
        ]),
      },
      { name: "main_problem_solved", label: "Problema principal que resuelves", type: "textarea", rows: 3, span: 2 },
      { name: "differentiator", label: "¿Qué te diferencia?", type: "textarea", rows: 3, span: 2 },
    ],
  },
  {
    id: "marketing",
    index: 5,
    label: "Marketing",
    title: "Marketing y operación actual.",
    subtitle: "Cuéntanos cómo consigues clientes hoy.",
    fields: [
      {
        name: "currently_generating_leads",
        label: "¿Estás generando leads actualmente?",
        type: "select",
        span: 1,
        options: o([
          ["yes", "Sí"],
          ["no", "No"],
          ["very_little", "Muy pocos"],
        ]),
      },
      { name: "current_client_acquisition_method", label: "¿Cómo consigues clientes hoy?", type: "textarea", rows: 3, span: 1 },
      {
        name: "has_paid_ads",
        label: "¿Inviertes en anuncios pagados?",
        type: "select",
        span: 1,
        options: o([
          ["yes", "Sí"],
          ["no", "No"],
        ]),
      },
      {
        name: "ad_platforms",
        label: "Plataformas de anuncios",
        type: "multiselect",
        span: 1,
        options: o([
          ["meta_ads", "Meta Ads"],
          ["google_ads", "Google Ads"],
          ["tiktok_ads", "TikTok Ads"],
          ["youtube_ads", "YouTube Ads"],
          ["other", "Otra"],
        ]),
      },
      {
        name: "has_crm",
        label: "¿Usas un CRM?",
        type: "select",
        span: 1,
        options: o([["yes", "Sí"], ["no", "No"]]),
      },
      {
        name: "uses_automations",
        label: "¿Usas automatizaciones?",
        type: "select",
        span: 1,
        options: o([["yes", "Sí"], ["no", "No"], ["very_few", "Muy pocas"]]),
      },
      {
        name: "has_sales_team",
        label: "¿Tienes equipo de ventas?",
        type: "select",
        span: 1,
        options: o([["yes", "Sí"], ["no", "No"]]),
      },
      { name: "weakest_part_of_sales_process", label: "Parte más débil de tu proceso de ventas", type: "textarea", rows: 3, span: 2 },
    ],
  },
  {
    id: "problem",
    index: 6,
    label: "Problema",
    title: "El problema a resolver.",
    subtitle: "El por qué detrás de tu aplicación.",
    fields: [
      { name: "main_problem_to_solve", label: "Problema principal que quieres resolver", type: "textarea", rows: 4, span: 2 },
      { name: "current_growth_blocker", label: "¿Qué está bloqueando tu crecimiento?", type: "textarea", rows: 3, span: 2 },
      {
        name: "priority_improvement_area",
        label: "Áreas prioritarias a mejorar",
        type: "multiselect",
        span: 2,
        options: o([
          ["more_leads", "Más leads"],
          ["better_follow_up", "Mejor seguimiento"],
          ["automation", "Automatización"],
          ["branding", "Branding"],
          ["website", "Sitio web"],
          ["ads", "Anuncios"],
          ["funnels", "Funnels"],
          ["crm", "CRM"],
          ["ai", "Inteligencia artificial"],
          ["sales_process", "Proceso de ventas"],
          ["other", "Otro"],
        ]),
      },
      { name: "desired_result_next_3_to_6_months", label: "Resultado deseado en 3-6 meses", type: "textarea", rows: 3, span: 2 },
    ],
  },
  {
    id: "goals",
    index: 7,
    label: "Objetivos",
    title: "A dónde quieres llegar.",
    subtitle: "Qué esperas lograr trabajando con nosotros.",
    fields: [
      { name: "main_goal", label: "Objetivo principal", type: "textarea", rows: 3, span: 2 },
      { name: "expectations_working_with_us", label: "Expectativas trabajando con nosotros", type: "textarea", rows: 3, span: 2 },
      {
        name: "urgency_level",
        label: "Nivel de urgencia",
        type: "select",
        span: 2,
        options: o([
          ["immediate", "Inmediato"],
          ["this_month", "Este mes"],
          ["next_3_months", "Próximos 3 meses"],
          ["exploring_only", "Solo explorando"],
        ]),
      },
    ],
  },
  {
    id: "budget",
    index: 8,
    label: "Presupuesto",
    title: "Presupuesto.",
    subtitle: "Esto nos ayuda a recomendarte la mejor solución.",
    fields: [
      {
        name: "estimated_budget_range",
        label: "Rango de presupuesto estimado",
        type: "select",
        span: 2,
        options: o([
          ["not_defined_yet", "Aún no definido"],
          ["under_1000", "Menos de $1,000"],
          ["from_1000_to_3000", "$1,000 – $3,000"],
          ["from_3000_to_5000", "$3,000 – $5,000"],
          ["from_5000_to_10000", "$5,000 – $10,000"],
          ["above_10000", "Más de $10,000"],
        ]),
      },
      {
        name: "ready_to_invest_if_fit",
        label: "¿Listo para invertir si hay buen fit?",
        type: "select",
        span: 2,
        options: o([
          ["yes", "Sí"],
          ["no", "No"],
          ["maybe", "Tal vez"],
        ]),
      },
    ],
  },
  {
    id: "timing",
    index: 9,
    label: "Tiempo",
    title: "Tiempo y contacto.",
    subtitle: "Para coordinar el siguiente paso.",
    fields: [
      {
        name: "desired_start_timeline",
        label: "Cuándo te gustaría empezar",
        type: "select",
        span: 1,
        options: o([
          ["asap", "Lo antes posible"],
          ["two_to_four_weeks", "En 2-4 semanas"],
          ["one_to_three_months", "En 1-3 meses"],
          ["later", "Más adelante"],
        ]),
      },
      { name: "best_contact_time", label: "Mejor horario para contactarte", type: "text", span: 1 },
      {
        name: "preferred_contact_method",
        label: "Método de contacto preferido",
        type: "select",
        span: 2,
        options: o([
          ["email", "Email"],
          ["whatsapp", "WhatsApp"],
          ["phone_call", "Llamada"],
          ["video_call", "Videollamada"],
        ]),
      },
    ],
  },
  {
    id: "links",
    index: 10,
    label: "Links",
    title: "Links y datos extra.",
    subtitle: "Material que nos ayude a evaluar mejor.",
    fields: [
      { name: "current_website_url", label: "Sitio web actual", type: "url", span: 1 },
      { name: "landing_page_url", label: "Landing page relevante", type: "url", span: 1 },
      { name: "primary_social_links", label: "Redes sociales principales", type: "textarea", rows: 2, span: 2 },
      { name: "brochure_or_media_kit_url", label: "Brochure / media kit", type: "url", span: 2 },
      { name: "additional_comments", label: "Comentarios adicionales", type: "textarea", rows: 3, span: 2 },
      { name: "anything_else_we_should_know", label: "¿Algo más que debamos saber?", type: "textarea", rows: 3, span: 2 },
    ],
  },
  {
    id: "consent",
    index: 11,
    label: "Confirmación",
    title: "Un último paso.",
    subtitle: "Confirma y envía tu aplicación.",
    fields: [
      {
        name: "confirm_information_accuracy",
        label: "Confirmo que la información proporcionada es precisa y verídica.",
        type: "checkbox",
        required: true,
        span: 2,
      },
      {
        name: "consent_to_be_contacted",
        label: "Autorizo a iKingdom a contactarme para evaluar mi caso.",
        type: "checkbox",
        required: true,
        span: 2,
      },
    ],
  },
];

// Flat list of all field names for INITIAL state and payload mapping
export const ALL_FIELDS: FieldDef[] = SECTIONS.flatMap((s) => s.fields);
