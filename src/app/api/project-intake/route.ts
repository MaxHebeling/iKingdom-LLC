// ─────────────────────────────────────────────────────────────
// iKingdom — /api/project-intake
// POST de los formularios de levantamiento (/es/escuela-virtual/*).
// rate-limit → validación contra la config de forms.ts → Supabase
// (tabla project_intakes, mismo proyecto que client_applications)
// → aviso interno por Resend → confirmación al cliente.
// ─────────────────────────────────────────────────────────────

import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { resend, NOTIFY_EMAIL, FROM_EMAIL } from "@/lib/resend";
import { INTAKE_FORMS, type IntakeFormKey } from "@/app/es/escuela-virtual/forms";

function getClient() {
  const url = process.env.APPLICATION_SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.APPLICATION_SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error("Supabase credentials missing");
  return createClient(url, key, { auth: { persistSession: false } });
}

const RATE_BUCKET = new Map<string, { count: number; reset: number }>();
function rateLimit(ip: string, max: number, windowMs: number) {
  const now = Date.now();
  const e = RATE_BUCKET.get(ip);
  if (!e || now > e.reset) {
    RATE_BUCKET.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (e.count >= max) return false;
  e.count += 1;
  return true;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#x27;");

type Answer = string | string[] | boolean;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(ip, 5, 60_000)) {
    return NextResponse.json({ error: "Demasiadas solicitudes. Intenta en un minuto." }, { status: 429 });
  }
  if (Number(req.headers.get("content-length") ?? 0) > 200_000) {
    return NextResponse.json({ error: "El formulario es demasiado grande." }, { status: 413 });
  }

  let body: { form?: unknown; answers?: unknown };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Solicitud inválida." }, { status: 400 });
  }

  const formKey = body.form as IntakeFormKey;
  const form = INTAKE_FORMS[formKey];
  if (!form || typeof body.answers !== "object" || body.answers === null) {
    return NextResponse.json({ error: "Formulario desconocido." }, { status: 400 });
  }
  const raw = body.answers as Record<string, unknown>;

  // Sanitize: only fields declared in the config, typed and length-capped.
  const answers: Record<string, Answer> = {};
  const missing: string[] = [];
  for (const s of form.sections) {
    for (const f of s.fields) {
      const v = raw[f.name];
      let clean: Answer;
      if (f.type === "checkbox") clean = v === true;
      else if (f.type === "multiselect") {
        const allowed = new Set((f.options ?? []).map((o) => o.value));
        clean = Array.isArray(v) ? v.filter((x): x is string => typeof x === "string" && allowed.has(x)).slice(0, 40) : [];
      } else if (f.type === "select") {
        const allowed = new Set((f.options ?? []).map((o) => o.value));
        clean = typeof v === "string" && allowed.has(v) ? v : "";
      } else {
        clean = typeof v === "string" ? v.trim().slice(0, f.type === "textarea" ? 6000 : 500) : "";
      }
      answers[f.name] = clean;
      if (f.required) {
        const empty = clean === false || clean === "" || (Array.isArray(clean) && clean.length === 0);
        if (empty) missing.push(f.label);
      }
    }
  }
  if (missing.length) {
    return NextResponse.json({ error: `Faltan campos requeridos: ${missing.slice(0, 5).join(", ")}.` }, { status: 400 });
  }
  const email = String(answers.email ?? "");
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Email inválido." }, { status: 400 });
  }
  const fullName = String(answers.full_name ?? "");
  const orgName = String(answers.organization_name ?? "");

  // Human-readable summary (labels, not internal values).
  const lines: string[] = [`=== ${form.eyebrow.toUpperCase()} ===`];
  for (const s of form.sections) {
    const block: string[] = [];
    for (const f of s.fields) {
      if (f.type === "checkbox") continue;
      const v = answers[f.name];
      const label = (x: string) => f.options?.find((o) => o.value === x)?.label ?? x;
      const text = Array.isArray(v) ? v.map(label).join(", ") : typeof v === "string" ? (f.options ? label(v) : v) : "";
      if (text) block.push(`- ${f.label}: ${text}`);
    }
    if (block.length) lines.push("", `## ${s.title.replace(/\.$/, "")}`, ...block);
  }
  const summary = lines.join("\n");

  let id: string | null = null;
  try {
    const { data, error } = await getClient()
      .from("project_intakes")
      .insert({
        form_key: formKey,
        project_type: "escuela_virtual",
        full_name: fullName,
        email,
        phone_whatsapp: String(answers.phone_whatsapp ?? "") || null,
        organization_name: orgName,
        answers,
        summary_md: summary,
      })
      .select("id")
      .single();
    if (error) throw error;
    id = data!.id as string;
  } catch (err) {
    console.error("[iKingdom/project-intake] DB insert failed:", err);
  }

  let emailed = false;
  try {
    const r = await resend.emails.send({
      from: FROM_EMAIL,
      to: process.env.INTAKE_NOTIFY_EMAIL ?? NOTIFY_EMAIL,
      replyTo: email,
      subject: `${form.eyebrow}: ${orgName} — ${fullName}`,
      html: `<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:720px;margin:0 auto;padding:32px;color:#1d1d1f">
        <p style="font-size:12px;color:#0071e3;margin:0 0 6px">${esc(form.eyebrow)}</p>
        <h1 style="font-size:22px;margin:0">${esc(orgName)}</h1>
        <p style="font-size:13px;color:#6e6e73;margin:6px 0 24px">${esc(fullName)} · ${esc(email)} · ${esc(String(answers.phone_whatsapp ?? ""))}${id ? ` · ID ${esc(id)}` : ""}</p>
        <pre style="white-space:pre-wrap;font-family:inherit;font-size:14px;line-height:1.55">${esc(summary)}</pre>
      </div>`,
    });
    emailed = !r.error;
    if (r.error) console.error("[iKingdom/project-intake] Email error:", r.error);
  } catch (err) {
    console.error("[iKingdom/project-intake] Email send failed:", err);
  }

  if (!id && !emailed) {
    return NextResponse.json({ error: "No pudimos guardar el formulario. Intenta de nuevo." }, { status: 500 });
  }

  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      replyTo: NOTIFY_EMAIL,
      subject: `Recibimos tu formulario — ${form.eyebrow}`,
      html: `<div style="font-family:-apple-system,Helvetica,Arial,sans-serif;max-width:560px;margin:0 auto;padding:32px;color:#1d1d1f">
        <h1 style="font-size:22px">Hola ${esc(fullName.split(" ")[0] || fullName)},</h1>
        <p style="font-size:15px;line-height:1.6;color:#424245">Recibimos la información de <strong>${esc(orgName)}</strong> (${esc(form.eyebrow)}). Nuestro equipo la revisará y te contactará con los siguientes pasos.</p>
        <p style="font-size:15px;line-height:1.6;color:#424245">— Equipo iKingdom</p>
      </div>`,
    });
  } catch (err) {
    console.error("[iKingdom/project-intake] Confirmation failed:", err);
  }

  return NextResponse.json({ success: true, id }, { status: 200 });
}
