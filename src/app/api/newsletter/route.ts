import { NextRequest, NextResponse } from "next/server";
import { resend, NOTIFY_EMAIL, FROM_EMAIL } from "@/lib/resend";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email } = body;

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

    await resend.emails.send({
      from: FROM_EMAIL,
      to: NOTIFY_EMAIL,
      subject: `New Newsletter Subscriber`,
      html: `
        <h2>New Newsletter Signup</h2>
        <p><strong>Email:</strong> ${email.trim().toLowerCase()}</p>
        <hr />
        <p style="color:#888;font-size:12px;">Sent from ikingdom.ai newsletter form</p>
      `,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Newsletter signup error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 },
    );
  }
}
