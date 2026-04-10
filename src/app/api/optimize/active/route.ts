import { loadActiveVariants } from "@/lib/optimizer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function OPTIONS(): Promise<Response> {
  return jsonResponse({ ok: true });
}

export async function GET(): Promise<Response> {
  try {
    const variants = await loadActiveVariants();
    return jsonResponse(variants);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/optimize/active] error:", message);
    return jsonResponse({}, 200);
  }
}
