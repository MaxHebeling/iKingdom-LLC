/**
 * Escape user-provided text for safe inclusion inside HTML.
 *
 * Use this anywhere user input is interpolated into an HTML email body, an
 * HTML attribute, or any HTML context where the value could otherwise be
 * interpreted as markup. Internal CRM rendering surfaces (Resend → Gmail)
 * generally sandbox scripts, but escaping is still the correct default for
 * any string-to-HTML boundary.
 */
export function escapeHtml(value: unknown): string {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
}
