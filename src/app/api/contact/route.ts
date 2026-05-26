import { NextRequest, NextResponse } from "next/server";
import { resend, NOTIFY_EMAIL, FROM_EMAIL } from "@/lib/resend";
import { contactConfirmationEmail } from "@/lib/email-templates";
import { escapeHtml } from "@/lib/escape";

// In-memory rate limiter keyed by IP. Sufficient for a single Vercel function
// instance against form-spam attempts.
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
    // 5 contact submissions per IP per 10 minutes is enough for any legitimate
    // user (most submit once); blocks form-spam.
    const ip = getClientIp(req);
    if (!rateLimit(ip, 5, 600_000)) {
      return NextResponse.json(
        { error: "Too many requests. Please try again later." },
        { status: 429 },
      );
    }

    const body = await req.json();
    const { name, email, company, message, lang } = body;

    if (!name || typeof name !== "string" || name.trim().length === 0) {
      return NextResponse.json(
        { error: "Name is required." },
        { status: 400 },
      );
    }

    if (
      !email ||
      typeof email !== "string" ||
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {
      return NextResponse.json(
        { error: "A valid email is required." },
        { status: 400 },
      );
    }

    if (
      !message ||
      typeof message !== "string" ||
      message.trim().length === 0
    ) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    // Length caps — anything longer is either spam or accidentally pasted.
    const safeName = name.trim().slice(0, 150);
    const safeEmail = email.trim().slice(0, 200);
    const safeCompany =
      typeof company === "string" ? company.trim().slice(0, 200) : "";
    const safeMessage = message.trim().slice(0, 5000);
    const safeLang: "en" | "es" = lang === "es" ? "es" : "en";

    const companyLine = safeCompany
      ? `<p><strong>Company:</strong> ${escapeHtml(safeCompany)}</p>`
      : "";

    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `New Contact — ${safeName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${escapeHtml(safeName)}</p>
        <p><strong>Email:</strong> ${escapeHtml(safeEmail)}</p>
        ${companyLine}
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(safeMessage).replace(/\n/g, "<br />")}</p>
        <hr />
        <p style="color:#888;font-size:12px;">Sent from ikingdom.ai contact form</p>
      `,
      replyTo: safeEmail,
    });

    // Auto-confirmation to prospect — best-effort.
    try {
      const confirmation = contactConfirmationEmail({
        name: safeName,
        lang: safeLang,
      });
      await resend.emails.send({
        from: FROM_EMAIL,
        to: safeEmail,
        replyTo: NOTIFY_EMAIL,
        subject: confirmation.subject,
        html: confirmation.html,
        text: confirmation.text,
      });
    } catch (confirmErr) {
      console.error(
        "[api/contact] Prospect confirmation email failed:",
        confirmErr,
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
