import { NextRequest, NextResponse } from "next/server";
import { resend, NOTIFY_EMAIL, FROM_EMAIL } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, company, message } = body;

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

    if (!message || typeof message !== "string" || message.trim().length === 0) {
      return NextResponse.json(
        { error: "Message is required." },
        { status: 400 },
      );
    }

    const companyLine = company ? `<p><strong>Company:</strong> ${company}</p>` : "";

    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `New Contact — ${name.trim()}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name.trim()}</p>
        <p><strong>Email:</strong> ${email.trim()}</p>
        ${companyLine}
        <p><strong>Message:</strong></p>
        <p>${message.trim()}</p>
        <hr />
        <p style="color:#888;font-size:12px;">Sent from ikingdom.ai contact form</p>
      `,
      replyTo: email.trim(),
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Contact form error:", error);
    return NextResponse.json(
      { error: "Something went wrong." },
      { status: 500 },
    );
  }
}
