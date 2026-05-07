import { Resend } from "resend";

if (!process.env.RESEND_API_KEY) {
  throw new Error("Missing RESEND_API_KEY environment variable");
}

export const resend = new Resend(process.env.RESEND_API_KEY);

export const NOTIFY_EMAIL = process.env.NOTIFY_EMAIL ?? "executive@ikingdom.org";
export const FROM_EMAIL = process.env.FROM_EMAIL ?? "iKingdom <notifications@ikingdom.org>";
