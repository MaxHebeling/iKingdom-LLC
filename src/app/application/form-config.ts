// ─────────────────────────────────────────────────────────────
// iKingdom — /application form: declarative section config
// Drives the multi-step wizard. Single source of truth for
// fields, labels, options, and required-flags.
//
// Bilingual: the underlying SECTIONS_BILINGUAL holds { en, es }
// for every user-visible string. getSections(lang) flattens it
// to the original FieldDef shape the renderer expects.
// ─────────────────────────────────────────────────────────────

export type Lang = "en" | "es";

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

type Bilingual = { en: string; es: string };

interface FieldBilingual {
  name: string;
  label: Bilingual;
  type: FieldType;
  placeholder?: Bilingual;
  required?: boolean;
  rows?: number;
  options?: { value: string; label: Bilingual }[];
  span?: 1 | 2;
  hint?: Bilingual;
}

interface SectionBilingual {
  id: string;
  index: number;
  label: Bilingual;
  title: Bilingual;
  subtitle: Bilingual;
  fields: FieldBilingual[];
}

const T = (en: string, es: string): Bilingual => ({ en, es });

const o = (entries: [string, string, string][]) =>
  entries.map(([value, en, es]) => ({ value, label: T(en, es) }));

const SECTIONS_BILINGUAL: SectionBilingual[] = [
  {
    id: "contact",
    index: 1,
    label: T("Contact", "Contacto"),
    title: T("Who are we talking to?", "¿Con quién hablamos?"),
    subtitle: T(
      "Basic information to identify your case.",
      "Información básica para identificar tu caso.",
    ),
    fields: [
      { name: "full_name", label: T("Full name", "Nombre completo"), type: "text", required: true, span: 1 },
      { name: "job_title", label: T("Job title / role", "Cargo / posición"), type: "text", span: 1 },
      { name: "company_name", label: T("Company name", "Nombre de la empresa"), type: "text", required: true, span: 1 },
      { name: "email", label: T("Work email", "Email corporativo"), type: "email", required: true, span: 1 },
      {
        name: "phone_whatsapp",
        label: T("Phone / WhatsApp", "Teléfono / WhatsApp"),
        type: "phone-intl",
        required: true,
        span: 1,
        placeholder: T("Number", "Número"),
      },
      { name: "country", label: T("Country", "País"), type: "country", span: 1 },
      { name: "city", label: T("City", "Ciudad"), type: "text", span: 1 },
      { name: "website_url", label: T("Website", "Sitio web"), type: "url", span: 1, placeholder: T("https://…", "https://…") },
      { name: "instagram_url", label: T("Instagram", "Instagram"), type: "url", span: 1 },
      { name: "facebook_url", label: T("Facebook", "Facebook"), type: "url", span: 1 },
      { name: "linkedin_url", label: T("LinkedIn", "LinkedIn"), type: "url", span: 1 },
      { name: "other_social_url", label: T("Other social link", "Otra red social"), type: "url", span: 1 },
    ],
  },
  {
    id: "business",
    index: 2,
    label: T("Business", "Negocio"),
    title: T("Your business in detail.", "Tu negocio en detalle."),
    subtitle: T(
      "Tell us what your company does and how long it has been operating.",
      "Cuéntanos qué hace tu empresa y desde cuándo opera.",
    ),
    fields: [
      {
        name: "business_description",
        label: T("Business description", "Descripción del negocio"),
        type: "textarea",
        required: true,
        rows: 4,
        span: 2,
        placeholder: T(
          "What does your company do? What's its purpose?",
          "¿A qué se dedica tu empresa? ¿Cuál es su propósito?",
        ),
      },
      {
        name: "product_or_service_description",
        label: T("Main product or service", "Producto o servicio principal"),
        type: "textarea",
        required: true,
        rows: 4,
        span: 2,
        placeholder: T(
          "Describe what you sell and how you deliver it.",
          "Describe lo que vendes y cómo lo entregas.",
        ),
      },
      { name: "industry", label: T("Industry / sector", "Industria / sector"), type: "text", span: 1 },
      {
        name: "years_operating",
        label: T("Years operating", "Años operando"),
        type: "select",
        span: 1,
        options: o([
          ["just_starting", "Just starting", "Apenas empezando"],
          ["less_than_1_year", "Less than 1 year", "Menos de 1 año"],
          ["one_to_three_years", "1 to 3 years", "1 a 3 años"],
          ["three_to_five_years", "3 to 5 years", "3 a 5 años"],
          ["more_than_5_years", "More than 5 years", "Más de 5 años"],
        ]),
      },
      {
        name: "offering_type",
        label: T("Offering type", "Tipo de oferta"),
        type: "select",
        span: 1,
        options: o([
          ["services", "Services", "Servicios"],
          ["products", "Products", "Productos"],
          ["both", "Both", "Ambos"],
        ]),
      },
    ],
  },
  {
    id: "offer",
    index: 3,
    label: T("Offer", "Oferta"),
    title: T("Your offer and sales.", "Tu oferta y ventas."),
    subtitle: T(
      "We need to understand what you sell and how you sell it today.",
      "Necesitamos entender qué vendes y cómo lo vendes hoy.",
    ),
    fields: [
      { name: "primary_offer", label: T("Primary offer", "Oferta principal"), type: "textarea", rows: 3, span: 2 },
      { name: "secondary_offers", label: T("Secondary offers", "Ofertas secundarias"), type: "textarea", rows: 3, span: 2 },
      {
        name: "average_ticket",
        label: T("Average ticket (USD)", "Ticket promedio (USD)"),
        type: "text",
        span: 1,
        placeholder: T("e.g. $1,500", "Ej. $1,500"),
      },
      {
        name: "has_defined_sales_process",
        label: T("Do you have a defined sales process?", "¿Tienes un proceso de ventas definido?"),
        type: "select",
        span: 1,
        options: o([
          ["yes", "Yes", "Sí"],
          ["partially", "Partially", "Parcialmente"],
          ["no", "No", "No"],
        ]),
      },
      {
        name: "current_sales_channels",
        label: T("Current sales channels", "Canales de venta actuales"),
        type: "multiselect",
        span: 2,
        options: o([
          ["instagram", "Instagram", "Instagram"],
          ["facebook", "Facebook", "Facebook"],
          ["whatsapp", "WhatsApp", "WhatsApp"],
          ["website", "Website", "Sitio web"],
          ["phone_calls", "Phone calls", "Llamadas"],
          ["referrals", "Referrals", "Referidos"],
          ["sales_team", "Sales team", "Equipo de ventas"],
          ["marketplace", "Marketplace", "Marketplace"],
          ["email", "Email", "Email"],
          ["other", "Other", "Otro"],
        ]),
      },
    ],
  },
  {
    id: "customer",
    index: 4,
    label: T("Customer", "Cliente"),
    title: T("Your ideal customer.", "Tu cliente ideal."),
    subtitle: T(
      "Who do you serve best and why do they choose you?",
      "¿A quién sirves mejor y por qué te eligen?",
    ),
    fields: [
      {
        name: "ideal_customer_description",
        label: T("Ideal customer", "Cliente ideal"),
        type: "textarea",
        rows: 4,
        span: 2,
      },
      {
        name: "customer_type",
        label: T("Customer type", "Tipo de cliente"),
        type: "multiselect",
        span: 2,
        options: o([
          ["individuals", "Individuals", "Personas"],
          ["businesses", "Businesses", "Empresas"],
          ["churches", "Churches", "Iglesias"],
          ["ministries", "Ministries", "Ministerios"],
          ["organizations", "Organizations", "Organizaciones"],
          ["government", "Government", "Gobierno"],
          ["other", "Other", "Otro"],
        ]),
      },
      {
        name: "main_problem_solved",
        label: T("Main problem you solve", "Problema principal que resuelves"),
        type: "textarea",
        rows: 3,
        span: 2,
      },
      {
        name: "differentiator",
        label: T("What sets you apart?", "¿Qué te diferencia?"),
        type: "textarea",
        rows: 3,
        span: 2,
      },
    ],
  },
  {
    id: "marketing",
    index: 5,
    label: T("Marketing", "Marketing"),
    title: T("Current marketing and operations.", "Marketing y operación actual."),
    subtitle: T(
      "Tell us how you get customers today.",
      "Cuéntanos cómo consigues clientes hoy.",
    ),
    fields: [
      {
        name: "currently_generating_leads",
        label: T("Are you generating leads right now?", "¿Estás generando leads actualmente?"),
        type: "select",
        span: 1,
        options: o([
          ["yes", "Yes", "Sí"],
          ["no", "No", "No"],
          ["very_little", "Very few", "Muy pocos"],
        ]),
      },
      {
        name: "current_client_acquisition_method",
        label: T("How do you acquire customers today?", "¿Cómo consigues clientes hoy?"),
        type: "textarea",
        rows: 3,
        span: 1,
      },
      {
        name: "has_paid_ads",
        label: T("Do you invest in paid ads?", "¿Inviertes en anuncios pagados?"),
        type: "select",
        span: 1,
        options: o([
          ["yes", "Yes", "Sí"],
          ["no", "No", "No"],
        ]),
      },
      {
        name: "ad_platforms",
        label: T("Ad platforms", "Plataformas de anuncios"),
        type: "multiselect",
        span: 1,
        options: o([
          ["meta_ads", "Meta Ads", "Meta Ads"],
          ["google_ads", "Google Ads", "Google Ads"],
          ["tiktok_ads", "TikTok Ads", "TikTok Ads"],
          ["youtube_ads", "YouTube Ads", "YouTube Ads"],
          ["other", "Other", "Otra"],
        ]),
      },
      {
        name: "has_crm",
        label: T("Do you use a CRM?", "¿Usas un CRM?"),
        type: "select",
        span: 1,
        options: o([
          ["yes", "Yes", "Sí"],
          ["no", "No", "No"],
        ]),
      },
      {
        name: "uses_automations",
        label: T("Do you use automations?", "¿Usas automatizaciones?"),
        type: "select",
        span: 1,
        options: o([
          ["yes", "Yes", "Sí"],
          ["no", "No", "No"],
          ["very_few", "Very few", "Muy pocas"],
        ]),
      },
      {
        name: "has_sales_team",
        label: T("Do you have a sales team?", "¿Tienes equipo de ventas?"),
        type: "select",
        span: 1,
        options: o([
          ["yes", "Yes", "Sí"],
          ["no", "No", "No"],
        ]),
      },
      {
        name: "weakest_part_of_sales_process",
        label: T(
          "Weakest part of your sales process",
          "Parte más débil de tu proceso de ventas",
        ),
        type: "textarea",
        rows: 3,
        span: 2,
      },
    ],
  },
  {
    id: "problem",
    index: 6,
    label: T("Problem", "Problema"),
    title: T("The problem to solve.", "El problema a resolver."),
    subtitle: T("The why behind your application.", "El por qué detrás de tu aplicación."),
    fields: [
      {
        name: "main_problem_to_solve",
        label: T(
          "Main problem you want to solve",
          "Problema principal que quieres resolver",
        ),
        type: "textarea",
        rows: 4,
        span: 2,
      },
      {
        name: "current_growth_blocker",
        label: T("What's blocking your growth?", "¿Qué está bloqueando tu crecimiento?"),
        type: "textarea",
        rows: 3,
        span: 2,
      },
      {
        name: "priority_improvement_area",
        label: T("Priority areas to improve", "Áreas prioritarias a mejorar"),
        type: "multiselect",
        span: 2,
        options: o([
          ["more_leads", "More leads", "Más leads"],
          ["better_follow_up", "Better follow-up", "Mejor seguimiento"],
          ["automation", "Automation", "Automatización"],
          ["branding", "Branding", "Branding"],
          ["website", "Website", "Sitio web"],
          ["ads", "Ads", "Anuncios"],
          ["funnels", "Funnels", "Funnels"],
          ["crm", "CRM", "CRM"],
          ["ai", "Artificial intelligence", "Inteligencia artificial"],
          ["sales_process", "Sales process", "Proceso de ventas"],
          ["other", "Other", "Otro"],
        ]),
      },
      {
        name: "desired_result_next_3_to_6_months",
        label: T(
          "Desired result in the next 3-6 months",
          "Resultado deseado en 3-6 meses",
        ),
        type: "textarea",
        rows: 3,
        span: 2,
      },
    ],
  },
  {
    id: "goals",
    index: 7,
    label: T("Goals", "Objetivos"),
    title: T("Where you want to go.", "A dónde quieres llegar."),
    subtitle: T(
      "What you hope to achieve working with us.",
      "Qué esperas lograr trabajando con nosotros.",
    ),
    fields: [
      {
        name: "main_goal",
        label: T("Main goal", "Objetivo principal"),
        type: "textarea",
        rows: 3,
        span: 2,
      },
      {
        name: "expectations_working_with_us",
        label: T(
          "Expectations of working with us",
          "Expectativas trabajando con nosotros",
        ),
        type: "textarea",
        rows: 3,
        span: 2,
      },
      {
        name: "urgency_level",
        label: T("Urgency level", "Nivel de urgencia"),
        type: "select",
        span: 2,
        options: o([
          ["immediate", "Immediate", "Inmediato"],
          ["this_month", "This month", "Este mes"],
          ["next_3_months", "Next 3 months", "Próximos 3 meses"],
          ["exploring_only", "Just exploring", "Solo explorando"],
        ]),
      },
    ],
  },
  {
    id: "budget",
    index: 8,
    label: T("Budget", "Presupuesto"),
    title: T("Budget.", "Presupuesto."),
    subtitle: T(
      "This helps us recommend the best fit for you.",
      "Esto nos ayuda a recomendarte la mejor solución.",
    ),
    fields: [
      {
        name: "estimated_budget_range",
        label: T("Estimated budget range", "Rango de presupuesto estimado"),
        type: "select",
        span: 2,
        options: o([
          ["not_defined_yet", "Not defined yet", "Aún no definido"],
          ["under_1000", "Under $1,000", "Menos de $1,000"],
          ["from_1000_to_3000", "$1,000 – $3,000", "$1,000 – $3,000"],
          ["from_3000_to_5000", "$3,000 – $5,000", "$3,000 – $5,000"],
          ["from_5000_to_10000", "$5,000 – $10,000", "$5,000 – $10,000"],
          ["above_10000", "Above $10,000", "Más de $10,000"],
        ]),
      },
      {
        name: "ready_to_invest_if_fit",
        label: T(
          "Ready to invest if there's a good fit?",
          "¿Listo para invertir si hay buen fit?",
        ),
        type: "select",
        span: 2,
        options: o([
          ["yes", "Yes", "Sí"],
          ["no", "No", "No"],
          ["maybe", "Maybe", "Tal vez"],
        ]),
      },
    ],
  },
  {
    id: "timing",
    index: 9,
    label: T("Timing", "Tiempo"),
    title: T("Timing and contact.", "Tiempo y contacto."),
    subtitle: T("To coordinate the next step.", "Para coordinar el siguiente paso."),
    fields: [
      {
        name: "desired_start_timeline",
        label: T("When would you like to start?", "Cuándo te gustaría empezar"),
        type: "select",
        span: 1,
        options: o([
          ["asap", "As soon as possible", "Lo antes posible"],
          ["two_to_four_weeks", "In 2-4 weeks", "En 2-4 semanas"],
          ["one_to_three_months", "In 1-3 months", "En 1-3 meses"],
          ["later", "Later", "Más adelante"],
        ]),
      },
      {
        name: "best_contact_time",
        label: T("Best time to reach you", "Mejor horario para contactarte"),
        type: "text",
        span: 1,
      },
      {
        name: "preferred_contact_method",
        label: T("Preferred contact method", "Método de contacto preferido"),
        type: "select",
        span: 2,
        options: o([
          ["email", "Email", "Email"],
          ["whatsapp", "WhatsApp", "WhatsApp"],
          ["phone_call", "Phone call", "Llamada"],
          ["video_call", "Video call", "Videollamada"],
        ]),
      },
    ],
  },
  {
    id: "links",
    index: 10,
    label: T("Links", "Links"),
    title: T("Links and extra info.", "Links y datos extra."),
    subtitle: T(
      "Material to help us evaluate better.",
      "Material que nos ayude a evaluar mejor.",
    ),
    fields: [
      { name: "current_website_url", label: T("Current website", "Sitio web actual"), type: "url", span: 1 },
      { name: "landing_page_url", label: T("Relevant landing page", "Landing page relevante"), type: "url", span: 1 },
      {
        name: "primary_social_links",
        label: T("Primary social profiles", "Redes sociales principales"),
        type: "textarea",
        rows: 2,
        span: 2,
      },
      {
        name: "brochure_or_media_kit_url",
        label: T("Brochure / media kit", "Brochure / media kit"),
        type: "url",
        span: 2,
      },
      {
        name: "additional_comments",
        label: T("Additional comments", "Comentarios adicionales"),
        type: "textarea",
        rows: 3,
        span: 2,
      },
      {
        name: "anything_else_we_should_know",
        label: T(
          "Anything else we should know?",
          "¿Algo más que debamos saber?",
        ),
        type: "textarea",
        rows: 3,
        span: 2,
      },
    ],
  },
  {
    id: "consent",
    index: 11,
    label: T("Confirmation", "Confirmación"),
    title: T("One last step.", "Un último paso."),
    subtitle: T(
      "Confirm and submit your application.",
      "Confirma y envía tu aplicación.",
    ),
    fields: [
      {
        name: "confirm_information_accuracy",
        label: T(
          "I confirm that the information provided is accurate and truthful.",
          "Confirmo que la información proporcionada es precisa y verídica.",
        ),
        type: "checkbox",
        required: true,
        span: 2,
      },
      {
        name: "consent_to_be_contacted",
        label: T(
          "I authorize iKingdom to contact me to evaluate my case.",
          "Autorizo a iKingdom a contactarme para evaluar mi caso.",
        ),
        type: "checkbox",
        required: true,
        span: 2,
      },
    ],
  },
];

export function getSections(lang: Lang): SectionDef[] {
  return SECTIONS_BILINGUAL.map((s) => ({
    id: s.id,
    index: s.index,
    label: s.label[lang],
    title: s.title[lang],
    subtitle: s.subtitle[lang],
    fields: s.fields.map((f) => ({
      name: f.name,
      label: f.label[lang],
      type: f.type,
      placeholder: f.placeholder?.[lang],
      required: f.required,
      rows: f.rows,
      span: f.span,
      hint: f.hint?.[lang],
      options: f.options?.map((opt) => ({ value: opt.value, label: opt.label[lang] })),
    })),
  }));
}

// Flat list of all field names for INITIAL state and payload mapping.
// Lang-agnostic — uses ES labels by default; renderer reads only `name` and `type`.
export const ALL_FIELDS: FieldDef[] = getSections("es").flatMap((s) => s.fields);
