import {
  optimizeSection,
  saveVariant,
  type OptimizeInput,
} from "@/lib/optimizer";

export const runtime = "nodejs";

function jsonResponse(body: unknown, status = 200): Response {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    },
  });
}

export async function OPTIONS(): Promise<Response> {
  return jsonResponse({ ok: true });
}

function parseInput(raw: unknown): OptimizeInput | null {
  if (!raw || typeof raw !== "object") return null;
  const r = raw as Record<string, unknown>;

  const section = typeof r.section === "string" ? r.section.trim() : "";
  const currentHeadline =
    typeof r.currentHeadline === "string" ? r.currentHeadline : "";
  const currentBody =
    typeof r.currentBody === "string" ? r.currentBody : undefined;
  const dwellAvgMs =
    typeof r.dwellAvgMs === "number" && Number.isFinite(r.dwellAvgMs)
      ? r.dwellAvgMs
      : NaN;
  const scrollPastRate =
    typeof r.scrollPastRate === "number" && Number.isFinite(r.scrollPastRate)
      ? r.scrollPastRate
      : NaN;
  const minTargetMs =
    typeof r.minTargetMs === "number" && Number.isFinite(r.minTargetMs)
      ? r.minTargetMs
      : undefined;

  if (!section || !currentHeadline) return null;
  if (Number.isNaN(dwellAvgMs) || Number.isNaN(scrollPastRate)) return null;

  return {
    section,
    currentHeadline,
    currentBody,
    dwellAvgMs,
    scrollPastRate,
    minTargetMs,
  };
}

export async function POST(request: Request): Promise<Response> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_key_here_replace_me") {
    return jsonResponse(
      {
        error:
          "The Optimizer Agent is not configured yet. Please set ANTHROPIC_API_KEY in .env.local.",
      },
      500
    );
  }

  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return jsonResponse({ error: "Invalid JSON body." }, 400);
  }

  const input = parseInput(raw);
  if (!input) {
    return jsonResponse(
      {
        error:
          "Invalid request. Required: section (string), currentHeadline (string), dwellAvgMs (number), scrollPastRate (number).",
      },
      400
    );
  }

  try {
    const result = await optimizeSection(input);

    // Persist the first suggested headline + body as the active variant for
    // this section so client polling can pick it up. This is additive — the
    // full response is still returned to the caller for inspection.
    try {
      await saveVariant(input.section, {
        headline: result.headlines[0],
        body: result.body,
        generatedAt: Date.now(),
        dwellTarget: input.minTargetMs ?? 5000,
      });
    } catch (persistErr) {
      console.error("[api/optimize] persist error:", persistErr);
      // Non-fatal: we still return the optimizer result.
    }

    return jsonResponse(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[api/optimize] Optimizer error:", message);
    return jsonResponse(
      { error: `Optimizer Agent failed: ${message}` },
      500
    );
  }
}
