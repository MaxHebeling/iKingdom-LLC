// ─────────────────────────────────────────────────────────────
// iKingdom — /api/client-application
// Public POST endpoint for the premium /application form.
// Mirrors the fit-intake pattern: rate-limit → sanitize →
// optional Resend email → createLead() into the canonical leads
// table with form_type "client_application".
//
// Reuses the canonical leads table — does NOT introduce a new
// entity. Long-tail qualifying answers (sections 3-9) live as a
// structured Markdown block inside additional_notes so the CRM
// stays one source of truth.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resend, NOTIFY_EMAIL, FROM_EMAIL } from "@/lib/resend";

// Dedicated Supabase project for /application — isolated from any
// other Supabase the site might use. Reads APPLICATION_* env vars.
function getApplicationsClient() {
  const url =
    process.env.APPLICATION_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key =
    process.env.APPLICATION_SUPABASE_SERVICE_ROLE_KEY ??
    process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase credentials missing");
  return createClient(url, key, { auth: { persistSession: false } });
}

// In-memory IP rate limiter (enough for a single Vercel instance —
// good safeguard against brute-force form spam).
const RATE_BUCKET = new Map<string, { count: number; reset: number }>();
function rateLimit(ip: string, max: number, windowMs: number) {
  const now = Date.now();
  const entry = RATE_BUCKET.get(ip);
  if (!entry || now > entry.reset) {
    RATE_BUCKET.set(ip, { count: 1, reset: now + windowMs });
    return { ok: true };
  }
  if (entry.count >= max) return { ok: false };
  entry.count += 1;
  return { ok: true };
}

// ── Payload shape ───────────────────────────────────────────
interface Payload {
  // Section 1
  full_name: string; job_title?: string; company_name: string;
  email: string; phone_whatsapp: string;
  country?: string; city?: string;
  website_url?: string; instagram_url?: string;
  facebook_url?: string; linkedin_url?: string; other_social_url?: string;
  // Section 2
  business_description: string; product_or_service_description: string;
  industry?: string; years_operating?: string; offering_type?: string;
  // Section 3
  primary_offer?: string; secondary_offers?: string; average_ticket?: string;
  current_sales_channels?: string[]; has_defined_sales_process?: string;
  // Section 4
  ideal_customer_description?: string; customer_type?: string[];
  main_problem_solved?: string; differentiator?: string;
  // Section 5
  currently_generating_leads?: string; current_client_acquisition_method?: string;
  has_paid_ads?: string; ad_platforms?: string[];
  has_crm?: string; uses_automations?: string; has_sales_team?: string;
  weakest_part_of_sales_process?: string;
  // Section 6
  main_problem_to_solve?: string; current_growth_blocker?: string;
  priority_improvement_area?: string[]; desired_result_next_3_to_6_months?: string;
  // Section 7
  main_goal?: string; expectations_working_with_us?: string; urgency_level?: string;
  // Section 8
  estimated_budget_range?: string; ready_to_invest_if_fit?: string;
  // Section 9
  desired_start_timeline?: string; best_contact_time?: string; preferred_contact_method?: string;
  // Section 10
  current_website_url?: string; landing_page_url?: string;
  primary_social_links?: string; brochure_or_media_kit_url?: string;
  additional_comments?: string; anything_else_we_should_know?: string;
  // Section 11
  confirm_information_accuracy: boolean;
  consent_to_be_contacted: boolean;
}

// ── Helpers ─────────────────────────────────────────────────
const isValidEmail = (e: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e);
const str = (v: unknown, max = 500) => String(v ?? "").slice(0, max).trim();
const arr = (v: unknown, max = 30) =>
  Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, max).map((s) => String(s).slice(0, 80)) : [];

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

// ── Human-readable label maps for enum values ───────────────
const LABELS: Record<string, string> = {
  // years
  just_starting: "Apenas empezando", less_than_1_year: "Menos de 1 año",
  one_to_three_years: "1 a 3 años", three_to_five_years: "3 a 5 años",
  more_than_5_years: "Más de 5 años",
  // offering
  services: "Servicios", products: "Productos", both: "Ambos",
  // yes/partial/no
  yes: "Sí", no: "No", partially: "Parcialmente", very_little: "Muy pocos", very_few: "Muy pocas", maybe: "Tal vez",
  // sales channels
  instagram: "Instagram", facebook: "Facebook", whatsapp: "WhatsApp",
  website: "Sitio web", phone_calls: "Llamadas", referrals: "Referidos",
  sales_team: "Equipo de ventas", marketplace: "Marketplace", email: "Email", other: "Otro",
  // customer types
  individuals: "Personas", businesses: "Empresas", churches: "Iglesias",
  ministries: "Ministerios", organizations: "Organizaciones", government: "Gobierno",
  // ads
  meta_ads: "Meta Ads", google_ads: "Google Ads", tiktok_ads: "TikTok Ads", youtube_ads: "YouTube Ads",
  // priorities
  more_leads: "Más leads", better_follow_up: "Mejor seguimiento",
  automation: "Automatización", branding: "Branding", ads: "Anuncios",
  funnels: "Funnels", crm: "CRM", ai: "Inteligencia artificial", sales_process: "Proceso de ventas",
  // urgency
  immediate: "Inmediato", this_month: "Este mes", next_3_months: "Próximos 3 meses",
  exploring_only: "Solo explorando",
  // budget
  not_defined_yet: "Aún no definido", under_1000: "Menos de $1,000",
  from_1000_to_3000: "$1,000 – $3,000", from_3000_to_5000: "$3,000 – $5,000",
  from_5000_to_10000: "$5,000 – $10,000", above_10000: "Más de $10,000",
  // start timeline
  asap: "Lo antes posible", two_to_four_weeks: "En 2-4 semanas",
  one_to_three_months: "En 1-3 meses", later: "Más adelante",
  // contact
  phone_call: "Llamada", video_call: "Videollamada",
};

const lbl = (v?: string) => (v ? LABELS[v] ?? v : "");
const lblArr = (a?: string[]) => (a && a.length ? a.map(lbl).join(", ") : "");

// ── Build the structured notes block stored in leads.additional_notes ──
function buildNotesBlock(p: Payload): string {
  const lines: string[] = [];
  const push = (label: string, value?: string) => {
    if (!value) return;
    lines.push(`- ${label}: ${value}`);
  };

  lines.push("=== APLICACIÓN DE CLIENTE (form_type: client_application) ===");
  lines.push("");
  lines.push("## Negocio");
  push("Industria", p.industry);
  push("Años operando", lbl(p.years_operating));
  push("Tipo de oferta", lbl(p.offering_type));

  lines.push("");
  lines.push("## Oferta y ventas");
  push("Oferta principal", p.primary_offer);
  push("Ofertas secundarias", p.secondary_offers);
  push("Ticket promedio", p.average_ticket);
  push("Canales de venta", lblArr(p.current_sales_channels));
  push("Proceso de ventas definido", lbl(p.has_defined_sales_process));

  lines.push("");
  lines.push("## Cliente ideal");
  push("Descripción", p.ideal_customer_description);
  push("Tipo de cliente", lblArr(p.customer_type));
  push("Problema que resuelve", p.main_problem_solved);
  push("Diferenciador", p.differentiator);

  lines.push("");
  lines.push("## Marketing y operación");
  push("Generando leads", lbl(p.currently_generating_leads));
  push("Método de adquisición", p.current_client_acquisition_method);
  push("Anuncios pagados", lbl(p.has_paid_ads));
  push("Plataformas de ads", lblArr(p.ad_platforms));
  push("CRM", lbl(p.has_crm));
  push("Automatizaciones", lbl(p.uses_automations));
  push("Equipo de ventas", lbl(p.has_sales_team));
  push("Parte más débil del proceso", p.weakest_part_of_sales_process);

  lines.push("");
  lines.push("## Problema y prioridades");
  push("Problema a resolver", p.main_problem_to_solve);
  push("Bloqueador de crecimiento", p.current_growth_blocker);
  push("Áreas prioritarias", lblArr(p.priority_improvement_area));
  push("Resultado deseado 3-6 meses", p.desired_result_next_3_to_6_months);

  lines.push("");
  lines.push("## Objetivos");
  push("Objetivo principal", p.main_goal);
  push("Expectativas", p.expectations_working_with_us);
  push("Urgencia", lbl(p.urgency_level));

  lines.push("");
  lines.push("## Presupuesto");
  push("Rango estimado", lbl(p.estimated_budget_range));
  push("Listo para invertir", lbl(p.ready_to_invest_if_fit));

  lines.push("");
  lines.push("## Tiempo y contacto");
  push("Inicio deseado", lbl(p.desired_start_timeline));
  push("Mejor horario", p.best_contact_time);
  push("Método preferido", lbl(p.preferred_contact_method));

  lines.push("");
  lines.push("## Links extra");
  push("Sitio web actual", p.current_website_url);
  push("Landing page", p.landing_page_url);
  push("Redes sociales", p.primary_social_links);
  push("Brochure / media kit", p.brochure_or_media_kit_url);

  if (p.additional_comments || p.anything_else_we_should_know) {
    lines.push("");
    lines.push("## Comentarios libres");
    push("Comentarios adicionales", p.additional_comments);
    push("Algo más que debamos saber", p.anything_else_we_should_know);
  }

  return lines.join("\n");
}

// ── Email HTML builder (reuses fit-intake aesthetic) ────────
function buildEmailHtml(p: Payload, notesMd: string): string {
  return `
    <div style="font-family:'Space Grotesk',monospace;background:#080F1A;color:#B4D2FF;padding:40px;max-width:680px;margin:0 auto;">
      <div style="border-bottom:1px solid rgba(100,160,255,0.15);padding-bottom:20px;margin-bottom:32px;">
        <p style="margin:0 0 6px;font-size:9px;letter-spacing:0.4em;text-transform:uppercase;color:rgba(212,175,55,0.6);">
          CLIENT APPLICATION / NUEVA SOLICITUD PREMIUM
        </p>
        <h1 style="margin:0;font-size:20px;font-weight:600;letter-spacing:-0.02em;color:#B4D2FF;">
          ${esc(p.full_name)} — ${esc(p.company_name)}
        </h1>
        <p style="margin:6px 0 0;font-size:12px;color:rgba(100,160,255,0.5);">
          ${esc(p.email)} · ${esc(p.phone_whatsapp)}
        </p>
      </div>
      <pre style="white-space:pre-wrap;font-family:'Space Grotesk',monospace;font-size:12px;color:#B4D2FF;line-height:1.6;">${esc(notesMd)}</pre>
      <div style="margin-top:32px;padding-top:16px;border-top:1px solid rgba(100,160,255,0.08);">
        <p style="margin:0;font-size:10px;color:rgba(100,160,255,0.2);letter-spacing:0.1em;">
          iKingdom · ikingdom.org/application · ${new Date().toISOString()}
        </p>
      </div>
    </div>`;
}

// ─────────────────────────────────────────────────────────────
export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() ?? "unknown";
  const { ok } = rateLimit(ip, 3, 60_000);
  if (!ok) {
    return NextResponse.json(
      { error: "Demasiadas solicitudes. Intenta en un minuto." },
      { status: 429 },
    );
  }

  const contentLength = Number(req.headers.get("content-length") ?? 0);
  if (contentLength > 80_000) {
    return NextResponse.json({ error: "Payload too large" }, { status: 413 });
  }

  let body: Payload;
  try {
    body = (await req.json()) as Payload;
  } catch {
    return NextResponse.json({ error: "Invalid body" }, { status: 400 });
  }

  // Required fields
  const fullName = str(body.full_name, 200);
  const companyName = str(body.company_name, 200);
  const email = str(body.email, 200);
  const phone = str(body.phone_whatsapp, 60);
  const businessDescription = str(body.business_description, 4000);
  const productDescription = str(body.product_or_service_description, 4000);

  if (!fullName || !companyName || !email || !phone || !businessDescription || !productDescription) {
    return NextResponse.json({ error: "Faltan campos requeridos." }, { status: 400 });
  }
  if (!isValidEmail(email)) {
    return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  }
  if (body.confirm_information_accuracy !== true || body.consent_to_be_contacted !== true) {
    return NextResponse.json({ error: "Debes confirmar y autorizar el contacto." }, { status: 400 });
  }

  // Sanitized payload — used for the notes block + email
  const safe: Payload = {
    full_name: fullName,
    job_title: str(body.job_title, 200),
    company_name: companyName,
    email,
    phone_whatsapp: phone,
    country: str(body.country, 120),
    city: str(body.city, 120),
    website_url: str(body.website_url, 500),
    instagram_url: str(body.instagram_url, 500),
    facebook_url: str(body.facebook_url, 500),
    linkedin_url: str(body.linkedin_url, 500),
    other_social_url: str(body.other_social_url, 500),
    business_description: businessDescription,
    product_or_service_description: productDescription,
    industry: str(body.industry, 200),
    years_operating: str(body.years_operating, 60),
    offering_type: str(body.offering_type, 60),
    primary_offer: str(body.primary_offer, 2000),
    secondary_offers: str(body.secondary_offers, 2000),
    average_ticket: str(body.average_ticket, 120),
    current_sales_channels: arr(body.current_sales_channels),
    has_defined_sales_process: str(body.has_defined_sales_process, 60),
    ideal_customer_description: str(body.ideal_customer_description, 2000),
    customer_type: arr(body.customer_type),
    main_problem_solved: str(body.main_problem_solved, 2000),
    differentiator: str(body.differentiator, 2000),
    currently_generating_leads: str(body.currently_generating_leads, 60),
    current_client_acquisition_method: str(body.current_client_acquisition_method, 2000),
    has_paid_ads: str(body.has_paid_ads, 60),
    ad_platforms: arr(body.ad_platforms),
    has_crm: str(body.has_crm, 60),
    uses_automations: str(body.uses_automations, 60),
    has_sales_team: str(body.has_sales_team, 60),
    weakest_part_of_sales_process: str(body.weakest_part_of_sales_process, 2000),
    main_problem_to_solve: str(body.main_problem_to_solve, 2000),
    current_growth_blocker: str(body.current_growth_blocker, 2000),
    priority_improvement_area: arr(body.priority_improvement_area),
    desired_result_next_3_to_6_months: str(body.desired_result_next_3_to_6_months, 2000),
    main_goal: str(body.main_goal, 2000),
    expectations_working_with_us: str(body.expectations_working_with_us, 2000),
    urgency_level: str(body.urgency_level, 60),
    estimated_budget_range: str(body.estimated_budget_range, 60),
    ready_to_invest_if_fit: str(body.ready_to_invest_if_fit, 60),
    desired_start_timeline: str(body.desired_start_timeline, 60),
    best_contact_time: str(body.best_contact_time, 200),
    preferred_contact_method: str(body.preferred_contact_method, 60),
    current_website_url: str(body.current_website_url, 500),
    landing_page_url: str(body.landing_page_url, 500),
    primary_social_links: str(body.primary_social_links, 2000),
    brochure_or_media_kit_url: str(body.brochure_or_media_kit_url, 500),
    additional_comments: str(body.additional_comments, 4000),
    anything_else_we_should_know: str(body.anything_else_we_should_know, 4000),
    confirm_information_accuracy: true,
    consent_to_be_contacted: true,
  };

  const notesBlock = buildNotesBlock(safe);

  // ── Persist to dedicated client_applications table ───────
  let leadId: string | null = null;
  try {
    const supabase = getApplicationsClient();
    const { data, error } = await supabase
      .from("client_applications")
      .insert({
        status: "new",
        source: "application_form",
        full_name: safe.full_name,
        job_title: safe.job_title || null,
        company_name: safe.company_name,
        email: safe.email,
        phone_whatsapp: safe.phone_whatsapp,
        country: safe.country || null,
        city: safe.city || null,
        website_url: safe.website_url || null,
        instagram_url: safe.instagram_url || null,
        facebook_url: safe.facebook_url || null,
        linkedin_url: safe.linkedin_url || null,
        other_social_url: safe.other_social_url || null,
        business_description: safe.business_description,
        product_or_service_description: safe.product_or_service_description,
        industry: safe.industry || null,
        years_operating: safe.years_operating || null,
        offering_type: safe.offering_type || null,
        primary_offer: safe.primary_offer || null,
        secondary_offers: safe.secondary_offers || null,
        average_ticket: safe.average_ticket || null,
        current_sales_channels: safe.current_sales_channels ?? [],
        has_defined_sales_process: safe.has_defined_sales_process || null,
        ideal_customer_description: safe.ideal_customer_description || null,
        customer_type: safe.customer_type ?? [],
        main_problem_solved: safe.main_problem_solved || null,
        differentiator: safe.differentiator || null,
        currently_generating_leads: safe.currently_generating_leads || null,
        current_client_acquisition_method: safe.current_client_acquisition_method || null,
        has_paid_ads: safe.has_paid_ads || null,
        ad_platforms: safe.ad_platforms ?? [],
        has_crm: safe.has_crm || null,
        uses_automations: safe.uses_automations || null,
        has_sales_team: safe.has_sales_team || null,
        weakest_part_of_sales_process: safe.weakest_part_of_sales_process || null,
        main_problem_to_solve: safe.main_problem_to_solve || null,
        current_growth_blocker: safe.current_growth_blocker || null,
        priority_improvement_area: safe.priority_improvement_area ?? [],
        desired_result_next_3_to_6_months: safe.desired_result_next_3_to_6_months || null,
        main_goal: safe.main_goal || null,
        expectations_working_with_us: safe.expectations_working_with_us || null,
        urgency_level: safe.urgency_level || null,
        estimated_budget_range: safe.estimated_budget_range || null,
        ready_to_invest_if_fit: safe.ready_to_invest_if_fit || null,
        desired_start_timeline: safe.desired_start_timeline || null,
        best_contact_time: safe.best_contact_time || null,
        preferred_contact_method: safe.preferred_contact_method || null,
        current_website_url: safe.current_website_url || null,
        landing_page_url: safe.landing_page_url || null,
        primary_social_links: safe.primary_social_links || null,
        brochure_or_media_kit_url: safe.brochure_or_media_kit_url || null,
        additional_comments: safe.additional_comments || null,
        anything_else_we_should_know: safe.anything_else_we_should_know || null,
        confirm_information_accuracy: true,
        consent_to_be_contacted: true,
      })
      .select("id")
      .single();
    if (error) throw error;
    leadId = data!.id as string;
  } catch (err) {
    console.error("[iKingdom/application] DB insert failed:", err);
    return NextResponse.json(
      { error: "No pudimos guardar tu aplicación. Intenta de nuevo." },
      { status: 500 },
    );
  }

  // ── Resend notification ──────────────────────────────────
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      replyTo: safe.email,
      subject: `Client Application: ${safe.full_name} — ${safe.company_name}`,
      html: buildEmailHtml(safe, notesBlock),
    });
  } catch (err) {
    console.error("[iKingdom/application] Email send failed:", err);
  }

  return NextResponse.json({ success: true, id: leadId }, { status: 200 });
}
