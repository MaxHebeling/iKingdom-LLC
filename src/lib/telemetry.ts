import { promises as fs } from "node:fs";
import path from "node:path";
import { getRedisClient } from "@/lib/redis";

/**
 * Server-side telemetry helpers for the iKingdom engagement pipeline.
 *
 * Storage model (production): Redis via REDIS_URL. Events are pushed
 * onto a single list at `telemetry:events` (newest first via LPUSH) and
 * periodically trimmed to ~10k entries.
 *
 * Storage model (local dev / no Redis env): newline-delimited JSON file at
 * `data/engagement.jsonl`, one event per line. Kept small (~5MB) by
 * truncating the oldest lines when the file grows past the cap.
 *
 * Selection is automatic: if `REDIS_URL` is set in the environment, Redis
 * is used; otherwise we fall back to the file path so local development
 * keeps working without any config.
 */

export type TelemetryEventType =
  | "section-enter"
  | "section-leave"
  | "section-dwell"
  | "scroll"
  | "idle"
  | "active"
  | "exit"
  | "heartbeat";

export interface TelemetryEvent {
  type: string;
  section?: string;
  dwellMs?: number;
  scrollDepth?: number;
  ts: number;
}

export interface StoredEvent extends TelemetryEvent {
  sessionId: string;
  receivedAt: number;
}

export interface AggregatedStats {
  activeSessions: number;
  sectionDwell: Record<string, number>;
  currentSections: Record<string, number>;
  recentEvents: StoredEvent[];
  engagementScore: number;
  totalEvents: number;
  generatedAt: number;
}

// ---------------------------------------------------------------------------
// Backend selection
// ---------------------------------------------------------------------------

const KV_KEY = "telemetry:events";
// Cap the list at ~10k entries. Trim occasionally (not on every write) to
// avoid doing an extra round-trip against KV on the hot path.
const KV_MAX_LIST_SIZE = 10_000;
const KV_TRIM_INTERVAL_MS = 60_000;
let lastKvTrimAt = 0;

function hasRedisEnv(): boolean {
  return Boolean(process.env.REDIS_URL);
}

// ---------------------------------------------------------------------------
// File backend
// ---------------------------------------------------------------------------

const DATA_DIR = path.join(process.cwd(), "data");
const LOG_FILE = path.join(DATA_DIR, "engagement.jsonl");
const MAX_BYTES = 5 * 1024 * 1024; // ~5MB cap

// Simple serialized write queue so concurrent POSTs don't corrupt lines.
let writeChain: Promise<void> = Promise.resolve();

async function ensureDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore — will surface on write
  }
}

async function rotateIfNeeded(): Promise<void> {
  try {
    const stat = await fs.stat(LOG_FILE);
    if (stat.size <= MAX_BYTES) return;

    // Read full file, drop the oldest half of lines, rewrite.
    const content = await fs.readFile(LOG_FILE, "utf8");
    const lines = content.split("\n").filter((l) => l.length > 0);
    const keep = lines.slice(Math.floor(lines.length / 2));
    await fs.writeFile(LOG_FILE, keep.join("\n") + (keep.length ? "\n" : ""), "utf8");
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === "ENOENT") return;
    // Non-fatal — log and continue
    console.warn("[telemetry] rotate failed:", e.message);
  }
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function normalizeEvents(
  sessionId: string,
  events: TelemetryEvent[]
): StoredEvent[] {
  const now = Date.now();
  const out: StoredEvent[] = [];
  for (const e of events) {
    if (!e || typeof e.type !== "string") continue;
    const stored: StoredEvent = {
      sessionId,
      receivedAt: now,
      type: String(e.type),
      ts: typeof e.ts === "number" ? e.ts : now,
    };
    if (typeof e.section === "string") stored.section = e.section;
    if (typeof e.dwellMs === "number") stored.dwellMs = e.dwellMs;
    if (typeof e.scrollDepth === "number") stored.scrollDepth = e.scrollDepth;
    out.push(stored);
  }
  return out;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Append a batch of events for a session.
 * Returns the number of events actually stored.
 */
export async function appendEvents(
  sessionId: string,
  events: TelemetryEvent[]
): Promise<number> {
  if (!sessionId || !Array.isArray(events) || events.length === 0) return 0;

  const stored = normalizeEvents(sessionId, events);
  if (stored.length === 0) return 0;

  if (hasRedisEnv()) {
    try {
      const redis = await getRedisClient();
      // LPUSH newest-first. Pass each event as a separate string.
      const payloads = stored.map((s) => JSON.stringify(s));
      for (const p of payloads) {
        await redis.lPush(KV_KEY, p);
      }

      // Periodically trim the list to KV_MAX_LIST_SIZE to keep it bounded.
      const now = Date.now();
      if (now - lastKvTrimAt > KV_TRIM_INTERVAL_MS) {
        lastKvTrimAt = now;
        try {
          await redis.lTrim(KV_KEY, 0, KV_MAX_LIST_SIZE - 1);
        } catch (err) {
          const msg = err instanceof Error ? err.message : String(err);
          console.warn("[telemetry] redis ltrim failed:", msg);
        }
      }
      return stored.length;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[telemetry] redis lpush failed:", msg);
      throw err;
    }
  }

  // File fallback. Serialize writes through a promise chain.
  const payload = stored.map((s) => JSON.stringify(s)).join("\n") + "\n";
  const task = writeChain.then(async () => {
    await ensureDir();
    await fs.appendFile(LOG_FILE, payload, "utf8");
    await rotateIfNeeded();
  });
  writeChain = task.catch(() => undefined);
  await task;
  return stored.length;
}

/**
 * Read the most recent events, bounded by count and age.
 * Returns at most `maxLines` events, all with receivedAt within
 * `maxAgeSeconds` of now.
 */
export async function readRecent(
  maxLines = 200,
  maxAgeSeconds = 60
): Promise<StoredEvent[]> {
  const cutoff = Date.now() - maxAgeSeconds * 1000;

  if (hasRedisEnv()) {
    try {
      const redis = await getRedisClient();
      // LPUSH stores newest-first at index 0; take the first maxLines.
      const raw = await redis.lRange(KV_KEY, 0, Math.max(0, maxLines - 1));
      const events: StoredEvent[] = [];
      for (const item of raw) {
        let parsed: StoredEvent | null = null;
        try {
          parsed = JSON.parse(item) as StoredEvent;
        } catch {
          parsed = null;
        }
        if (
          parsed &&
          typeof parsed.receivedAt === "number" &&
          parsed.receivedAt >= cutoff
        ) {
          events.push(parsed);
        }
      }
      // Return oldest-first to match the file-backend contract that downstream
      // aggregate() expects (it uses slice(-10) for "most recent").
      events.reverse();
      return events;
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      console.error("[telemetry] redis lrange failed:", msg);
      return [];
    }
  }

  // File fallback.
  let content: string;
  try {
    content = await fs.readFile(LOG_FILE, "utf8");
  } catch (err) {
    const e = err as NodeJS.ErrnoException;
    if (e.code === "ENOENT") return [];
    throw err;
  }

  const lines = content.split("\n").filter((l) => l.length > 0);
  const tail = lines.slice(-maxLines);

  const events: StoredEvent[] = [];
  for (const line of tail) {
    try {
      const parsed = JSON.parse(line) as StoredEvent;
      if (typeof parsed.receivedAt === "number" && parsed.receivedAt >= cutoff) {
        events.push(parsed);
      }
    } catch {
      // skip malformed line
    }
  }
  return events;
}

/**
 * Aggregate raw events into the shape consumed by the live telemetry
 * endpoint. Returns zero state when events is empty.
 */
export function aggregate(events: StoredEvent[]): AggregatedStats {
  const now = Date.now();

  if (events.length === 0) {
    return {
      activeSessions: 0,
      sectionDwell: {},
      currentSections: {},
      recentEvents: [],
      engagementScore: 0,
      totalEvents: 0,
      generatedAt: now,
    };
  }

  // Active sessions = unique sessionIds within last 90 seconds.
  const activeCutoff = now - 90_000;
  const activeSessionIds = new Set<string>();
  for (const e of events) {
    if (e.receivedAt >= activeCutoff) activeSessionIds.add(e.sessionId);
  }

  // Per-section dwell averages.
  const dwellSum: Record<string, number> = {};
  const dwellCount: Record<string, number> = {};
  for (const e of events) {
    if (
      typeof e.section === "string" &&
      typeof e.dwellMs === "number" &&
      e.dwellMs > 0
    ) {
      dwellSum[e.section] = (dwellSum[e.section] || 0) + e.dwellMs;
      dwellCount[e.section] = (dwellCount[e.section] || 0) + 1;
    }
  }
  const sectionDwell: Record<string, number> = {};
  for (const key of Object.keys(dwellSum)) {
    sectionDwell[key] = Math.round(dwellSum[key] / dwellCount[key]);
  }

  // Currently in view: latest section-enter per active session, minus any
  // subsequent section-leave from the same session for that section.
  const latestEnter: Record<string, { section: string; ts: number }> = {};
  for (const e of events) {
    if (!activeSessionIds.has(e.sessionId)) continue;
    if (e.type === "section-enter" && typeof e.section === "string") {
      const prev = latestEnter[e.sessionId];
      if (!prev || e.ts > prev.ts) {
        latestEnter[e.sessionId] = { section: e.section, ts: e.ts };
      }
    } else if (e.type === "section-leave" && typeof e.section === "string") {
      const prev = latestEnter[e.sessionId];
      if (prev && prev.section === e.section && e.ts >= prev.ts) {
        delete latestEnter[e.sessionId];
      }
    }
  }
  const currentSections: Record<string, number> = {};
  for (const sid of Object.keys(latestEnter)) {
    const sec = latestEnter[sid].section;
    currentSections[sec] = (currentSections[sec] || 0) + 1;
  }

  // Engagement score: average dwell across sections normalized to 5s.
  const dwellValues = Object.values(sectionDwell);
  const avgDwell =
    dwellValues.length > 0
      ? dwellValues.reduce((a, b) => a + b, 0) / dwellValues.length
      : 0;
  const engagementScore = Math.max(
    0,
    Math.min(100, Math.round((avgDwell / 5000) * 100))
  );

  // Recent events: last 10, newest first.
  const recentEvents = events.slice(-10).reverse();

  return {
    activeSessions: activeSessionIds.size,
    sectionDwell,
    currentSections,
    recentEvents,
    engagementScore,
    totalEvents: events.length,
    generatedAt: now,
  };
}
