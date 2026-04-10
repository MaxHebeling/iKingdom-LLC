import { appendEvents, type TelemetryEvent } from "@/lib/telemetry";

export const runtime = "nodejs";
// Always execute fresh — this is a write endpoint.
export const dynamic = "force-dynamic";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function OPTIONS(): Promise<Response> {
  return jsonResponse({ ok: true });
}

export async function POST(request: Request): Promise<Response> {
  let body: { sessionId?: unknown; events?: unknown };
  try {
    body = await request.json();
  } catch {
    return jsonResponse({ ok: false, error: "Invalid JSON body." }, 400);
  }

  const sessionId =
    typeof body.sessionId === "string" && body.sessionId.trim().length > 0
      ? body.sessionId.trim().slice(0, 128)
      : null;

  if (!sessionId) {
    return jsonResponse({ ok: false, error: "Missing sessionId." }, 400);
  }

  const rawEvents = Array.isArray(body.events) ? body.events : [];
  const events: TelemetryEvent[] = [];
  for (const raw of rawEvents) {
    if (!raw || typeof raw !== "object") continue;
    const r = raw as Record<string, unknown>;
    if (typeof r.type !== "string") continue;
    const ev: TelemetryEvent = {
      type: r.type,
      ts: typeof r.ts === "number" ? r.ts : Date.now(),
    };
    if (typeof r.section === "string") ev.section = r.section;
    if (typeof r.dwellMs === "number") ev.dwellMs = r.dwellMs;
    if (typeof r.scrollDepth === "number") ev.scrollDepth = r.scrollDepth;
    events.push(ev);
  }

  try {
    const received = await appendEvents(sessionId, events);
    return jsonResponse({ ok: true, received });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/telemetry] write failed:", message);
    return jsonResponse({ ok: false, error: message }, 500);
  }
}
