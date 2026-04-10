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
    // Pull a generous window so the 90s active-session cutoff in aggregate()
    // can actually see every recently-active visitor. 2000 lines covers
    // dozens of concurrent visitors pinging every 4–8s without early sessions
    // getting truncated off the tail.
    const events = await readRecent(2000, 120);
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
