import { NextRequest, NextResponse } from "next/server";
import { resend, NOTIFY_EMAIL, FROM_EMAIL } from "@/lib/resend";
import { prospectConfirmationEmail } from "@/lib/email-templates";
import { escapeHtml } from "@/lib/escape";

// In-memory rate limiter keyed by IP.
const RATE_BUCKET = new Map<string, { count: number; reset: number }>();
function rateLimit(ip: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = RATE_BUCKET.get(ip);
  if (!entry || now > entry.reset) {
    RATE_BUCKET.set(ip, { count: 1, reset: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count += 1;
  return true;
}

function getClientIp(req: NextRequest): string {
  const xff = req.headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]!.trim();
  return req.headers.get("x-real-ip") || "unknown";
}

export async function POST(req: NextRequest) {
  try {
    // 5 application submissions per IP per 10 minutes. Anyone serious applies
    // once; more than this is spam / bots.
    const ip = getClientIp(req);
    if (!rateLimit(ip, 5, 600_000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const { name, title, email, phone, company, website, industry, revenue, investment, scope, lang } = body;

    if (!name || !email || !phone || !company || !industry || !revenue || !investment || !scope) {
      return NextResponse.json(
        { error: "All required fields must be filled." },
        { status: 400 },
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 },
      );
    }

    // Trim + cap each field to a sane max length.
    const safe = {
      name: String(name).trim().slice(0, 150),
      title: String(title ?? "").trim().slice(0, 150),
      email: String(email).trim().slice(0, 200),
      phone: String(phone).trim().slice(0, 50),
      company: String(company).trim().slice(0, 200),
      website: String(website ?? "").trim().slice(0, 300),
      industry: String(industry).trim().slice(0, 200),
      revenue: String(revenue).trim().slice(0, 100),
      investment: String(investment).trim().slice(0, 100),
      scope: String(scope).trim().slice(0, 5000),
    };

    const websiteLine = safe.website
      ? `<tr><td style="padding:6px 12px;"><strong>Website</strong></td><td style="padding:6px 12px;">${escapeHtml(safe.website)}</td></tr>`
      : "";

    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `New Application — ${safe.name} · ${safe.company}`,
      html: `
        <h2>New Client Application</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:6px 12px;"><strong>Name</strong></td><td style="padding:6px 12px;">${escapeHtml(safe.name)}</td></tr>
          <tr><td style="padding:6px 12px;"><strong>Title</strong></td><td style="padding:6px 12px;">${escapeHtml(safe.title || "—")}</td></tr>
          <tr><td style="padding:6px 12px;"><strong>Email</strong></td><td style="padding:6px 12px;">${escapeHtml(safe.email)}</td></tr>
          <tr><td style="padding:6px 12px;"><strong>Phone</strong></td><td style="padding:6px 12px;">${escapeHtml(safe.phone)}</td></tr>
          <tr><td style="padding:6px 12px;"><strong>Company</strong></td><td style="padding:6px 12px;">${escapeHtml(safe.company)}</td></tr>
          ${websiteLine}
          <tr><td style="padding:6px 12px;"><strong>Industry</strong></td><td style="padding:6px 12px;">${escapeHtml(safe.industry)}</td></tr>
          <tr><td style="padding:6px 12px;"><strong>Revenue</strong></td><td style="padding:6px 12px;">${escapeHtml(safe.revenue)}</td></tr>
          <tr><td style="padding:6px 12px;"><strong>Investment Tier</strong></td><td style="padding:6px 12px;">${escapeHtml(safe.investment)}</td></tr>
        </table>
        <h3>Scope</h3>
        <p>${escapeHtml(safe.scope).replace(/\n/g, "<br />")}</p>
        <hr />
        <p style="color:#888;font-size:12px;">Sent from ikingdom.ai application form</p>
      `,
      replyTo: safe.email,
    });

    // Auto-confirmation to prospect — best-effort, never blocks the response.
    try {
      const confirmation = prospectConfirmationEmail({
        name: safe.name,
        lang: lang === "es" ? "es" : "en",
      });
      await resend.emails.send({
        from: FROM_EMAIL,
        to: safe.email,
        replyTo: NOTIFY_EMAIL,
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
      });
    } catch (confirmErr) {
      console.error("Prospect confirmation email failed:", confirmErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Application form error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
