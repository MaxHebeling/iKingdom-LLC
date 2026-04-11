// iKingdom Agent Function Library
//
// Pure TypeScript implementations of the real backend functions behind
// the decorative agent numbers shown on the website. Each function takes
// an AgentContext (built by the calling API route from engagement.jsonl)
// and returns a deterministic, side-effect-free result.
//
// RULES:
// - No Math.random()
// - No Date.now() — callers pass ts via context if time is required
// - No file IO here — all IO lives in the API route
// - No Anthropic SDK — these are local compute functions, not LLM calls

export type TelemetryEvent = {
  type: string;
  section?: string;
  dwellMs?: number;
  scrollDepth?: number;
  ts: number;
  sessionId: string;
};

export type AgentContext = {
  sessionId: string;
  // Events for the current (focus) session
  recentEvents: TelemetryEvent[];
  // All events across all visitors within the recent window
  allRecentEvents: TelemetryEvent[];
  // Optional "now" timestamp (ms). Callers supply this so the agent
  // functions stay pure.
  ts?: number;
};

// ---------------------------------------------------------------------------
// Shared helpers (pure)
// ---------------------------------------------------------------------------

function uniqueSessions(events: TelemetryEvent[]): string[] {
  const set = new Set<string>();
  for (const e of events) set.add(e.sessionId);
  return Array.from(set);
}

function maxScrollDepth(events: TelemetryEvent[]): number {
  let max = 0;
  for (const e of events) {
    if (typeof e.scrollDepth === "number" && e.scrollDepth > max) {
      max = e.scrollDepth;
    }
  }
  return max;
}

function totalDwell(events: TelemetryEvent[]): number {
  let total = 0;
  for (const e of events) {
    if (typeof e.dwellMs === "number") total += e.dwellMs;
  }
  return total;
}

function dwellBySection(events: TelemetryEvent[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const e of events) {
    if (!e.section) continue;
    const dwell = typeof e.dwellMs === "number" ? e.dwellMs : 0;
    map[e.section] = (map[e.section] || 0) + dwell;
  }
  return map;
}

function eventsBySection(events: TelemetryEvent[]): Record<string, number> {
  const map: Record<string, number> = {};
  for (const e of events) {
    if (!e.section) continue;
    map[e.section] = (map[e.section] || 0) + 1;
  }
  return map;
}

function lastEvent(events: TelemetryEvent[]): TelemetryEvent | undefined {
  if (events.length === 0) return undefined;
  let latest = events[0];
  for (const e of events) if (e.ts > latest.ts) latest = e;
  return latest;
}

// ---------------------------------------------------------------------------
// Agent 01 — Application Receiver
// ---------------------------------------------------------------------------
// Watches the overall telemetry stream and reports whether the intake
// pipeline is monitoring live sessions.

export type Agent01Result = {
  status: "monitoring" | "idle";
  sessionsTracked: number;
};

export function agent01_applicationReceiver(ctx: AgentContext): Agent01Result {
  const sessions = uniqueSessions(ctx.allRecentEvents);
  return {
    status: sessions.length > 0 ? "monitoring" : "idle",
    sessionsTracked: sessions.length,
  };
}

// ---------------------------------------------------------------------------
// Agent 14 — Tier Allocator
// ---------------------------------------------------------------------------
// Decides which content tier this visitor should be routed into based on
// their scroll depth and cumulative dwell. Three bands: intro / mid / deep.

export type Agent14Result = {
  tier: "intro" | "mid" | "deep";
  confidence: number;
};

export function agent14_tierAllocator(ctx: AgentContext): Agent14Result {
  const depth = maxScrollDepth(ctx.recentEvents); // 0..1 or 0..100
  // Normalize — tolerate both 0..1 and 0..100 encodings
  const normDepth = depth > 1 ? depth / 100 : depth;
  const dwellMs = totalDwell(ctx.recentEvents);

  let tier: "intro" | "mid" | "deep";
  if (normDepth >= 0.7) tier = "deep";
  else if (normDepth >= 0.3) tier = "mid";
  else tier = "intro";

  // Confidence scales with how much signal we have (events + dwell).
  const signalPoints = ctx.recentEvents.length + Math.min(dwellMs / 1000, 30);
  const confidence = Math.max(0, Math.min(1, signalPoints / 30));

  return { tier, confidence: Math.round(confidence * 100) / 100 };
}

// ---------------------------------------------------------------------------
// Agent 16 — Engagement Plan Drafter
// ---------------------------------------------------------------------------
// Looks at what the visitor is doing right now and drafts a next-best
// action. Deterministic rules, no randomness.

export type Agent16Result = {
  nextAction: string;
  reason: string;
};

export function agent16_engagementPlanDrafter(
  ctx: AgentContext
): Agent16Result {
  if (ctx.recentEvents.length === 0) {
    return {
      nextAction: "await_signal",
      reason: "No telemetry for this session yet.",
    };
  }

  const dwell = dwellBySection(ctx.recentEvents);
  const last = lastEvent(ctx.recentEvents);
  const lastSection = last?.section;
  const lastDwell = lastSection ? dwell[lastSection] || 0 : 0;

  // Stalled on the apply section → hand off to Khloe
  if (lastSection === "apply" && lastDwell > 8000) {
    return {
      nextAction: "offer_chat_with_channel",
      reason: "Visitor has stalled on the apply section >8s.",
    };
  }

  // Bouncing off the method section quickly → highlight a case study
  if (lastSection === "method" && lastDwell < 2000) {
    return {
      nextAction: "highlight_case_study",
      reason: "Visitor sliding past method section (<2s dwell).",
    };
  }

  // Long dwell on tiers → show pricing comparison
  if (lastSection === "tiers" && lastDwell > 5000) {
    return {
      nextAction: "show_pricing_comparison",
      reason: "Extended dwell on tiers — likely evaluating fit.",
    };
  }

  // Top of funnel, low scroll — nudge them deeper
  const depth = maxScrollDepth(ctx.recentEvents);
  const normDepth = depth > 1 ? depth / 100 : depth;
  if (normDepth < 0.2) {
    return {
      nextAction: "scroll_prompt",
      reason: "Visitor stuck near the top of the page.",
    };
  }

  return {
    nextAction: "continue_observation",
    reason: "Engagement nominal; no intervention required.",
  };
}

// ---------------------------------------------------------------------------
// Agent 73 — Pattern Library Indexer
// ---------------------------------------------------------------------------
// Aggregates cross-visitor engagement patterns.

export type Agent73Result = {
  topSection: string;
  lowestDwellSection: string;
  totalSessions: number;
};

export function agent73_patternLibraryIndexer(
  ctx: AgentContext
): Agent73Result {
  const eventsPerSection = eventsBySection(ctx.allRecentEvents);
  const dwellPerSection = dwellBySection(ctx.allRecentEvents);

  let topSection = "";
  let topCount = -1;
  for (const [section, count] of Object.entries(eventsPerSection)) {
    if (count > topCount) {
      topCount = count;
      topSection = section;
    }
  }

  let lowestDwellSection = "";
  let lowestDwell = Number.POSITIVE_INFINITY;
  for (const [section, dwell] of Object.entries(dwellPerSection)) {
    if (dwell < lowestDwell) {
      lowestDwell = dwell;
      lowestDwellSection = section;
    }
  }

  return {
    topSection: topSection || "none",
    lowestDwellSection: lowestDwellSection || "none",
    totalSessions: uniqueSessions(ctx.allRecentEvents).length,
  };
}

// ---------------------------------------------------------------------------
// Agent 74 — Cross-Tenant Insight
// ---------------------------------------------------------------------------
// Compares the focus visitor's pattern to the broader population.

export type Agent74Result = {
  matchType: string;
  similarSessions: number;
};

export function agent74_crossTenantInsight(ctx: AgentContext): Agent74Result {
  const focusDepth = maxScrollDepth(ctx.recentEvents);
  const normFocus = focusDepth > 1 ? focusDepth / 100 : focusDepth;

  const sessions = uniqueSessions(ctx.allRecentEvents).filter(
    (s) => s !== ctx.sessionId
  );

  let similar = 0;
  for (const sid of sessions) {
    const sidEvents = ctx.allRecentEvents.filter((e) => e.sessionId === sid);
    const depth = maxScrollDepth(sidEvents);
    const normDepth = depth > 1 ? depth / 100 : depth;
    if (Math.abs(normDepth - normFocus) <= 0.15) similar++;
  }

  let matchType: string;
  if (normFocus >= 0.7) matchType = "deep_reader";
  else if (normFocus >= 0.3) matchType = "mid_funnel_browser";
  else if (normFocus > 0) matchType = "surface_skimmer";
  else matchType = "no_signal";

  return { matchType, similarSessions: similar };
}

// ---------------------------------------------------------------------------
// Agent 75 — Demand Forecast
// ---------------------------------------------------------------------------
// Estimates the probability that the visitor will submit an application.

export type Agent75Result = {
  applyProbability: number;
  signal: string;
};

export function agent75_demandForecast(ctx: AgentContext): Agent75Result {
  if (ctx.recentEvents.length === 0) {
    return { applyProbability: 0, signal: "cold" };
  }

  const depth = maxScrollDepth(ctx.recentEvents);
  const normDepth = depth > 1 ? depth / 100 : depth;
  const dwellMs = totalDwell(ctx.recentEvents);
  const sectionDwell = dwellBySection(ctx.recentEvents);
  const tiersDwell = sectionDwell["tiers"] || 0;
  const applyDwell = sectionDwell["apply"] || 0;

  // Weighted score, each term in 0..1.
  const depthScore = Math.min(normDepth, 1) * 0.35;
  const dwellScore = Math.min(dwellMs / 60000, 1) * 0.2;
  const tiersScore = Math.min(tiersDwell / 10000, 1) * 0.2;
  const applyScore = Math.min(applyDwell / 10000, 1) * 0.25;

  const probability = Math.round(
    (depthScore + dwellScore + tiersScore + applyScore) * 100
  );

  let signal: string;
  if (probability >= 70) signal = "hot";
  else if (probability >= 40) signal = "warm";
  else if (probability >= 15) signal = "curious";
  else signal = "cold";

  return { applyProbability: probability / 100, signal };
}

// ---------------------------------------------------------------------------
// Agent 76 — Funnel Intelligence
// ---------------------------------------------------------------------------
// Identifies the visitor's current stage in the funnel.

export type Agent76Result = {
  stage: "awareness" | "interest" | "consideration" | "intent";
  stuckAt?: string;
};

export function agent76_funnelIntelligence(ctx: AgentContext): Agent76Result {
  if (ctx.recentEvents.length === 0) {
    return { stage: "awareness" };
  }

  const sections = new Set<string>();
  for (const e of ctx.recentEvents) if (e.section) sections.add(e.section);

  const depth = maxScrollDepth(ctx.recentEvents);
  const normDepth = depth > 1 ? depth / 100 : depth;

  let stage: Agent76Result["stage"] = "awareness";
  if (sections.has("apply") || normDepth >= 0.9) stage = "intent";
  else if (sections.has("tiers") || normDepth >= 0.6) stage = "consideration";
  else if (sections.has("method") || normDepth >= 0.3) stage = "interest";

  // Detect "stuck" — the last event's section has > 8s dwell but depth
  // hasn't progressed past that section's normal location.
  const last = lastEvent(ctx.recentEvents);
  const dwell = dwellBySection(ctx.recentEvents);
  let stuckAt: string | undefined;
  if (last?.section && (dwell[last.section] || 0) > 8000) {
    stuckAt = last.section;
  }

  return stuckAt ? { stage, stuckAt } : { stage };
}

// ---------------------------------------------------------------------------
// Agent 79 — Quality Score
// ---------------------------------------------------------------------------
// Scores overall engagement quality across ALL current sessions.
// Average dwell ÷ target (5s) → 0..100, then mapped to a letter grade.

export type Agent79Result = {
  score: number;
  grade: "A" | "B" | "C" | "D" | "F";
};

export function agent79_qualityScore(ctx: AgentContext): Agent79Result {
  const sessions = uniqueSessions(ctx.allRecentEvents);
  if (sessions.length === 0) {
    return { score: 0, grade: "F" };
  }

  const TARGET_DWELL_MS = 5000;
  let sum = 0;
  for (const sid of sessions) {
    const sidEvents = ctx.allRecentEvents.filter((e) => e.sessionId === sid);
    sum += totalDwell(sidEvents);
  }
  const avgDwell = sum / sessions.length;
  const score = Math.max(
    0,
    Math.min(100, Math.round((avgDwell / TARGET_DWELL_MS) * 100))
  );

  let grade: Agent79Result["grade"];
  if (score >= 90) grade = "A";
  else if (score >= 75) grade = "B";
  else if (score >= 60) grade = "C";
  else if (score >= 40) grade = "D";
  else grade = "F";

  return { score, grade };
}

// ---------------------------------------------------------------------------
// Agent 80 — Checkpoint Graduation Coordinator
// ---------------------------------------------------------------------------
// Tracks how many agent functions are running successfully. In this
// library we expose 9 callable agents; "active" counts those that return
// a non-idle/non-zero state against the current context; "graduatedToday"
// counts agents that have crossed their graduation threshold for this run.

export type Agent80Result = {
  active: number;
  total: number;
  gradutedToday: number;
};

export function agent80_checkpointGraduation(
  ctx: AgentContext
): Agent80Result {
  const TOTAL_AGENTS = 9;

  const a01 = agent01_applicationReceiver(ctx);
  const a14 = agent14_tierAllocator(ctx);
  const a16 = agent16_engagementPlanDrafter(ctx);
  const a73 = agent73_patternLibraryIndexer(ctx);
  const a74 = agent74_crossTenantInsight(ctx);
  const a75 = agent75_demandForecast(ctx);
  const a76 = agent76_funnelIntelligence(ctx);
  const a79 = agent79_qualityScore(ctx);

  const activeFlags: boolean[] = [
    a01.status === "monitoring",
    a14.confidence > 0,
    a16.nextAction !== "await_signal",
    a73.totalSessions > 0,
    a74.similarSessions >= 0 && a74.matchType !== "no_signal",
    a75.applyProbability > 0,
    a76.stage !== "awareness" || ctx.recentEvents.length > 0,
    a79.score > 0,
    // agent80 itself always reporting = active
    true,
  ];

  const active = activeFlags.filter(Boolean).length;

  // "Graduated" = agents that cleared a strong confidence bar this run.
  const graduatedFlags: boolean[] = [
    a01.sessionsTracked >= 1,
    a14.confidence >= 0.5,
    a16.nextAction !== "await_signal" &&
      a16.nextAction !== "continue_observation",
    a73.totalSessions >= 2,
    a74.similarSessions >= 1,
    a75.applyProbability >= 0.4,
    a76.stage === "consideration" || a76.stage === "intent",
    a79.score >= 60,
  ];
  const gradutedToday = graduatedFlags.filter(Boolean).length;

  return { active, total: TOTAL_AGENTS, gradutedToday };
}
