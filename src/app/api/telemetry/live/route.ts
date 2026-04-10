import { aggregate, readRecent } from "@/lib/telemetry";

export const runtime = "nodejs";
// Always execute fresh — this is a live read endpoint.
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
    // Last 200 lines OR last 60 seconds of events — whichever is smaller.
    const events = await readRecent(200, 60);
    const stats = aggregate(events);
    return jsonResponse(stats);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/telemetry/live] read failed:", message);
    // Fall back gracefully to zero state.
    return jsonResponse({
      activeSessions: 0,
      sectionDwell: {},
      currentSections: {},
      recentEvents: [],
      engagementScore: 0,
      totalEvents: 0,
      generatedAt: Date.now(),
      error: message,
    });
  }
}
