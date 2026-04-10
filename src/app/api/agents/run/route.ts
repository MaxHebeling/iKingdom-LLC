import { promises as fs } from "fs";
import path from "path";
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

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Keep this in sync with the telemetry pipeline.
const ENGAGEMENT_FILE = path.join(process.cwd(), "data", "engagement.jsonl");

// Consider events from the last 15 minutes "recent".
const RECENT_WINDOW_MS = 15 * 60 * 1000;

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
  let raw: string;
  try {
    raw = await fs.readFile(ENGAGEMENT_FILE, "utf-8");
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") return [];
    throw err;
  }

  const events: TelemetryEvent[] = [];
  const cutoff = now - RECENT_WINDOW_MS;
  const lines = raw.split("\n");

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    try {
      const parsed = JSON.parse(trimmed) as Partial<TelemetryEvent>;
      if (
        typeof parsed.type === "string" &&
        typeof parsed.ts === "number" &&
        typeof parsed.sessionId === "string" &&
        parsed.ts >= cutoff
      ) {
        events.push({
          type: parsed.type,
          section:
            typeof parsed.section === "string" ? parsed.section : undefined,
          dwellMs:
            typeof parsed.dwellMs === "number" ? parsed.dwellMs : undefined,
          scrollDepth:
            typeof parsed.scrollDepth === "number"
              ? parsed.scrollDepth
              : undefined,
          ts: parsed.ts,
          sessionId: parsed.sessionId,
        });
      }
    } catch {
      // Skip malformed lines
    }
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
