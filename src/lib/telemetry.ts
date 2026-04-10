import { promises as fs } from "node:fs";
import path from "node:path";

/**
 * Server-side telemetry helpers for the iKingdom engagement pipeline.
 *
 * Storage model: a single newline-delimited JSON file (jsonl) at
 * `data/engagement.jsonl`, one event per line. Kept small (~5MB) by
 * truncating the oldest lines when the file grows past the cap.
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

/**
 * Append a batch of events for a session to the jsonl log.
 * Writes are serialized via an in-process promise chain.
 */
export async function appendEvents(
  sessionId: string,
  events: TelemetryEvent[]
): Promise<number> {
  if (!sessionId || !Array.isArray(events) || events.length === 0) return 0;

  const now = Date.now();
  const lines = events
    .filter((e) => e && typeof e.type === "string")
    .map((e) => {
      const stored: StoredEvent = {
        sessionId,
        receivedAt: now,
        type: String(e.type),
        ts: typeof e.ts === "number" ? e.ts : now,
      };
      if (typeof e.section === "string") stored.section = e.section;
      if (typeof e.dwellMs === "number") stored.dwellMs = e.dwellMs;
      if (typeof e.scrollDepth === "number") stored.scrollDepth = e.scrollDepth;
      return JSON.stringify(stored);
    });

  if (lines.length === 0) return 0;

  const payload = lines.join("\n") + "\n";

  // Chain the write so concurrent callers are serialized.
  const task = writeChain.then(async () => {
    await ensureDir();
    await fs.appendFile(LOG_FILE, payload, "utf8");
    await rotateIfNeeded();
  });
  writeChain = task.catch(() => undefined);
  await task;
  return lines.length;
}

/**
 * Read the most recent events, bounded by line count and age.
 * Returns at most `maxLines` events, all with receivedAt within
 * `maxAgeSeconds` of now.
 */
export async function readRecent(
  maxLines = 200,
  maxAgeSeconds = 60
): Promise<StoredEvent[]> {
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
  const cutoff = Date.now() - maxAgeSeconds * 1000;

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
