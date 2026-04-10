import {
  agent01_applicationReceiver,
  agent14_tierAllocator,
  agent16_engagementPlanDrafter,
  agent73_patternLibraryIndexer,
  agent74_crossTenantInsight,
  agent75_demandForecast,
  agent76_funnelIntelligence,
  agent79_qualityScore,
  agent80_checkpointGraduation,
  type AgentContext,
  type TelemetryEvent,
} from "@/lib/agents";
import { readRecent } from "@/lib/telemetry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Consider events from the last 15 minutes "recent".
const RECENT_WINDOW_MS = 15 * 60 * 1000;
// Upper bound on events pulled from the telemetry store per run.
const MAX_RECENT_LINES = 5000;

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
      "Cache-Control": "no-store",
    },
  });
}

export async function OPTIONS(): Promise<Response> {
  return jsonResponse({ ok: true });
}

async function readRecentEvents(now: number): Promise<TelemetryEvent[]> {
  // Delegate storage to the telemetry helper so this route automatically
  // inherits whatever backing store (KV, file, etc.) telemetry.ts uses.
  const stored = await readRecent(
    MAX_RECENT_LINES,
    Math.ceil(RECENT_WINDOW_MS / 1000)
  );

  const cutoff = now - RECENT_WINDOW_MS;
  const events: TelemetryEvent[] = [];

  for (const s of stored) {
    if (
      typeof s.type !== "string" ||
      typeof s.ts !== "number" ||
      typeof s.sessionId !== "string" ||
      s.ts < cutoff
    ) {
      continue;
    }
    events.push({
      type: s.type,
      section: typeof s.section === "string" ? s.section : undefined,
      dwellMs: typeof s.dwellMs === "number" ? s.dwellMs : undefined,
      scrollDepth:
        typeof s.scrollDepth === "number" ? s.scrollDepth : undefined,
      ts: s.ts,
      sessionId: s.sessionId,
    });
  }

  return events;
}

function pickFocusSessionId(events: TelemetryEvent[]): string {
  if (events.length === 0) return "anonymous";
  // Most recent session wins.
  let latest = events[0];
  for (const e of events) if (e.ts > latest.ts) latest = e;
  return latest.sessionId;
}

export async function GET(request: Request): Promise<Response> {
  const now = Date.now();

  try {
    const allRecentEvents = await readRecentEvents(now);

    // Allow the caller to pin a session via ?sessionId=... otherwise pick
    // the most recently active one.
    const url = new URL(request.url);
    const pinnedSessionId = url.searchParams.get("sessionId");
    const sessionId =
      pinnedSessionId && pinnedSessionId.length > 0
        ? pinnedSessionId
        : pickFocusSessionId(allRecentEvents);

    const recentEvents = allRecentEvents.filter(
      (e) => e.sessionId === sessionId
    );

    const ctx: AgentContext = {
      sessionId,
      recentEvents,
      allRecentEvents,
      ts: now,
    };

    const results = {
      "01": agent01_applicationReceiver(ctx),
      "14": agent14_tierAllocator(ctx),
      "16": agent16_engagementPlanDrafter(ctx),
      "73": agent73_patternLibraryIndexer(ctx),
      "74": agent74_crossTenantInsight(ctx),
      "75": agent75_demandForecast(ctx),
      "76": agent76_funnelIntelligence(ctx),
      "79": agent79_qualityScore(ctx),
      "80": agent80_checkpointGraduation(ctx),
    };

    return jsonResponse({
      ok: true,
      sessionId,
      totalEvents: allRecentEvents.length,
      windowMs: RECENT_WINDOW_MS,
      generatedAt: now,
      agents: results,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/agents/run] error:", message);
    return jsonResponse({ ok: false, error: message }, 500);
  }
}
