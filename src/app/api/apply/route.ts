import { NextRequest, NextResponse } from "next/server";
import { resend, NOTIFY_EMAIL, FROM_EMAIL } from "@/lib/resend";
import { prospectConfirmationEmail } from "@/lib/email-templates";

export async function POST(req: NextRequest) {
  try {
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

    const websiteLine = website ? `<tr><td><strong>Website</strong></td><td>${website}</td></tr>` : "";

    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `New Application — ${name} · ${company}`,
      html: `
        <h2>New Client Application</h2>
        <table style="border-collapse:collapse;width:100%;max-width:600px;">
          <tr><td style="padding:6px 12px;"><strong>Name</strong></td><td style="padding:6px 12px;">${name}</td></tr>
          <tr><td style="padding:6px 12px;"><strong>Title</strong></td><td style="padding:6px 12px;">${title || "—"}</td></tr>
          <tr><td style="padding:6px 12px;"><strong>Email</strong></td><td style="padding:6px 12px;">${email}</td></tr>
          <tr><td style="padding:6px 12px;"><strong>Phone</strong></td><td style="padding:6px 12px;">${phone}</td></tr>
          <tr><td style="padding:6px 12px;"><strong>Company</strong></td><td style="padding:6px 12px;">${company}</td></tr>
          ${websiteLine}
          <tr><td style="padding:6px 12px;"><strong>Industry</strong></td><td style="padding:6px 12px;">${industry}</td></tr>
          <tr><td style="padding:6px 12px;"><strong>Revenue</strong></td><td style="padding:6px 12px;">${revenue}</td></tr>
          <tr><td style="padding:6px 12px;"><strong>Investment Tier</strong></td><td style="padding:6px 12px;">${investment}</td></tr>
        </table>
        <h3>Scope</h3>
        <p>${scope}</p>
        <hr />
        <p style="color:#888;font-size:12px;">Sent from ikingdom.ai application form</p>
      `,
      replyTo: email,
    });

    // Auto-confirmation to prospect — best-effort, never blocks the response.
    try {
      const confirmation = prospectConfirmationEmail({
        name,
        lang: lang === "es" ? "es" : "en",
      });
      await resend.emails.send({
        from: FROM_EMAIL,
        to: email,
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
