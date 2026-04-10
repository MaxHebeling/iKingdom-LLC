"use client";

import { useEffect } from "react";

/**
 * EngagementTracker
 *
 * Client-only telemetry collector. Mounts on every page render, collects
 * browser-side engagement signals, and POSTs batched events to
 * /api/telemetry on a 4s tick or on page exit. Renders nothing.
 *
 * Signals collected:
 *  - session-enter / section-enter / section-leave via IntersectionObserver
 *  - scroll depth (max-watermark)
 *  - idle vs active (5s inactivity -> "idle" event, then "active" on wake)
 *  - exit (visibilitychange -> hidden)  — flushes a final batch
 */

const TRACKED_SECTIONS = [
  "top",
  "method",
  "capabilities",
  "continuity",
  "process",
  "console",
  "proof",
  "apply",
] as const;

const FLUSH_INTERVAL_MS = 4000;
const IDLE_THRESHOLD_MS = 5000;
const HEARTBEAT_INTERVAL_MS = 8000;
const SESSION_KEY = "ikingdom:telemetry:sessionId";

type QueuedEvent = {
  type: string;
  section?: string;
  dwellMs?: number;
  scrollDepth?: number;
  ts: number;
};

function makeSessionId(): string {
  // Prefer crypto.randomUUID when available; fall back to a random string.
  try {
    if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
      return crypto.randomUUID();
    }
  } catch {
    // ignore
  }
  return (
    "sess-" +
    Math.random().toString(36).slice(2, 10) +
    "-" +
    Date.now().toString(36)
  );
}

export default function EngagementTracker() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // --- session id (per-tab, cleared on tab close via sessionStorage) ---
    let sessionId: string;
    try {
      const existing = window.sessionStorage.getItem(SESSION_KEY);
      if (existing && existing.length > 0) {
        sessionId = existing;
      } else {
        sessionId = makeSessionId();
        window.sessionStorage.setItem(SESSION_KEY, sessionId);
      }
    } catch {
      // sessionStorage unavailable (private mode, etc.) — in-memory id only.
      sessionId = makeSessionId();
    }

    // --- event queue & flush logic ---
    const queue: QueuedEvent[] = [];
    let flushing = false;

    const enqueue = (ev: QueuedEvent) => {
      queue.push(ev);
      if (queue.length > 500) queue.splice(0, queue.length - 500);
    };

    const flush = async (useBeacon = false) => {
      if (queue.length === 0 || flushing) return;
      flushing = true;
      const batch = queue.splice(0, queue.length);
      const body = JSON.stringify({ sessionId, events: batch });
      try {
        if (useBeacon && "sendBeacon" in navigator) {
          const blob = new Blob([body], { type: "application/json" });
          navigator.sendBeacon("/api/telemetry", blob);
        } else {
          await fetch("/api/telemetry", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body,
            keepalive: true,
          });
        }
      } catch {
        // On failure, put events back at the front so we retry next tick.
        queue.unshift(...batch);
      } finally {
        flushing = false;
      }
    };

    // --- session heartbeat on mount ---
    enqueue({ type: "session-enter", ts: Date.now() });

    // --- IntersectionObserver: per-section enter/leave + dwell accumulation ---
    const dwellState = new Map<
      string,
      { enteredAt: number | null; accumulatedMs: number }
    >();
    for (const id of TRACKED_SECTIONS) {
      dwellState.set(id, { enteredAt: null, accumulatedMs: 0 });
    }

    const handleIntersect: IntersectionObserverCallback = (entries) => {
      const now = Date.now();
      for (const entry of entries) {
        const id = entry.target.id;
        if (!id) continue;
        const state = dwellState.get(id);
        if (!state) continue;

        if (entry.isIntersecting) {
          if (state.enteredAt == null) {
            state.enteredAt = now;
            enqueue({ type: "section-enter", section: id, ts: now });
          }
        } else {
          if (state.enteredAt != null) {
            const elapsed = now - state.enteredAt;
            state.accumulatedMs += elapsed;
            state.enteredAt = null;
            enqueue({
              type: "section-leave",
              section: id,
              dwellMs: elapsed,
              ts: now,
            });
          }
        }
      }
    };

    const observer = new IntersectionObserver(handleIntersect, {
      // Consider a section "in view" once ~30% of it is visible.
      threshold: [0, 0.3, 0.6, 1],
      rootMargin: "0px 0px -10% 0px",
    });

    // Defer observing until the next frame so sections are in the DOM.
    const observeFrame = requestAnimationFrame(() => {
      for (const id of TRACKED_SECTIONS) {
        const el = document.getElementById(id);
        if (el) observer.observe(el);
      }
    });

    // --- scroll depth watermark ---
    let maxScrollDepth = 0;
    const handleScroll = () => {
      const doc = document.documentElement;
      const scrollTop = window.scrollY || doc.scrollTop || 0;
      const winH = window.innerHeight || doc.clientHeight || 1;
      const docH = Math.max(
        doc.scrollHeight,
        doc.offsetHeight,
        document.body.scrollHeight,
        document.body.offsetHeight
      );
      const denom = Math.max(1, docH - winH);
      const pct = Math.min(100, Math.max(0, Math.round((scrollTop / denom) * 100)));
      if (pct > maxScrollDepth) {
        maxScrollDepth = pct;
        enqueue({ type: "scroll", scrollDepth: pct, ts: Date.now() });
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    // --- idle/active detection (5s of no input = "idle") ---
    let lastActivity = Date.now();
    let isIdle = false;
    const markActivity = () => {
      lastActivity = Date.now();
      if (isIdle) {
        isIdle = false;
        enqueue({ type: "active", ts: lastActivity });
      }
    };
    const activityEvents: Array<keyof WindowEventMap> = [
      "mousemove",
      "mousedown",
      "keydown",
      "touchstart",
      "wheel",
    ];
    for (const ev of activityEvents) {
      window.addEventListener(ev, markActivity, { passive: true });
    }

    const idleInterval = window.setInterval(() => {
      if (!isIdle && Date.now() - lastActivity >= IDLE_THRESHOLD_MS) {
        isIdle = true;
        enqueue({ type: "idle", ts: Date.now() });
      }
    }, 1000);

    // --- periodic dwell heartbeat for currently-visible sections ---
    const heartbeatInterval = window.setInterval(() => {
      const now = Date.now();
      for (const [id, state] of dwellState.entries()) {
        if (state.enteredAt != null) {
          const elapsed = now - state.enteredAt;
          if (elapsed >= FLUSH_INTERVAL_MS) {
            enqueue({
              type: "section-dwell",
              section: id,
              dwellMs: elapsed,
              ts: now,
            });
            // Reset the window so dwell events represent intervals, not totals.
            state.accumulatedMs += elapsed;
            state.enteredAt = now;
          }
        }
      }
    }, FLUSH_INTERVAL_MS);

    // --- presence heartbeat ---
    // Pure liveness ping so an idle reader who isn't scrolling or clicking
    // still counts as a live visitor. Without this, a quiet visitor would
    // drop out of the activeSessions count as soon as the 90s staleness
    // window elapsed on their last real event.
    const presenceInterval = window.setInterval(() => {
      enqueue({ type: "heartbeat", ts: Date.now() });
    }, HEARTBEAT_INTERVAL_MS);

    // --- periodic flush ---
    const flushInterval = window.setInterval(() => {
      flush(false);
    }, FLUSH_INTERVAL_MS);

    // --- exit / visibility hidden — final flush ---
    const handleVisibility = () => {
      if (document.visibilityState === "hidden") {
        const now = Date.now();
        // Close out any open sections before flushing.
        for (const [id, state] of dwellState.entries()) {
          if (state.enteredAt != null) {
            const elapsed = now - state.enteredAt;
            state.accumulatedMs += elapsed;
            state.enteredAt = null;
            enqueue({
              type: "section-leave",
              section: id,
              dwellMs: elapsed,
              ts: now,
            });
          }
        }
        enqueue({
          type: "exit",
          scrollDepth: maxScrollDepth,
          ts: now,
        });
        flush(true);
      }
    };
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pagehide", handleVisibility);

    // --- cleanup ---
    return () => {
      cancelAnimationFrame(observeFrame);
      observer.disconnect();
      window.removeEventListener("scroll", handleScroll);
      for (const ev of activityEvents) {
        window.removeEventListener(ev, markActivity);
      }
      window.clearInterval(idleInterval);
      window.clearInterval(heartbeatInterval);
      window.clearInterval(presenceInterval);
      window.clearInterval(flushInterval);
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pagehide", handleVisibility);
      // Best-effort final flush on unmount.
      flush(true);
    };
  }, []);

  return null;
}
