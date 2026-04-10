import Anthropic from "@anthropic-ai/sdk";
import { promises as fs } from "fs";
import path from "path";
import { getRedisClient } from "@/lib/redis";

export type OptimizeInput = {
  section: string;
  currentHeadline: string;
  currentBody?: string;
  dwellAvgMs: number;
  scrollPastRate: number;
  minTargetMs?: number;
};

export type OptimizeResult = {
  analysis: string;
  headlines: string[];
  body: string;
};

export type ActiveVariant = {
  headline: string;
  body: string;
  generatedAt: number;
  dwellTarget: number;
};

export type ActiveVariants = Record<string, ActiveVariant>;

const DATA_DIR = path.join(process.cwd(), "data");
const VARIANTS_PATH = path.join(DATA_DIR, "variants.json");
const KV_VARIANTS_KEY = "optimizer:variants";

function isRedisAvailable(): boolean {
  return Boolean(process.env.REDIS_URL);
}

const SYSTEM_PROMPT = `You are the Optimizer Agent for iKingdom — the world's first AI operations firm. iKingdom designs and installs autonomous AI operations inside ambitious businesses, deploying eighty agents across nine functional tiers as a living operational layer.

Your audience is founders and CEOs of $1M-$100M businesses — sharp, time-poor, allergic to fluff, and skeptical of anything that feels like a pitch. Many of them have been burned by consultants, agencies, and AI vendors selling snapshots instead of systems.

The iKingdom slogan is "The system that scales with you." Every word of copy you suggest should reinforce that identity either explicitly or implicitly.

YOUR JOB:
You analyze engagement telemetry for a single section of the iKingdom marketing site and suggest better copy when the current copy is not hooking visitors. You are not a generic copywriter — you are a conversion-literate editor who understands why founders stop scrolling and why they don't.

STYLE RULES:
- Confident, sophisticated, quietly authoritative.
- Never salesy. Never vague. Never generic.
- Short, punchy headlines — typically 3 to 8 words. A headline is a line, not a paragraph.
- Body copy: one sentence, tight, specific, no throat-clearing.
- Prefer concrete imagery and specifics (numbers, verbs, named outcomes) over abstract claims.
- Never use cliches ("unlock," "supercharge," "game-changer," "revolutionize," "leverage synergies").
- Never use emoji, hashtags, or exclamation points.
- Never mention the reader's dwell time, the telemetry, or the fact that this is being optimized.
- Do not invent products, features, tiers, or agent counts that are not already implied by the input.

RESPONSE FORMAT:
You MUST respond with valid JSON ONLY — no prose before or after, no markdown fences, no code blocks. The JSON must match this exact shape:

{
  "analysis": "2-4 sentences explaining why the current copy likely isn't hooking visitors given the engagement data.",
  "headlines": ["headline variant 1", "headline variant 2", "headline variant 3"],
  "body": "a single replacement body sentence"
}

Return exactly 3 headlines. Return exactly 1 body sentence. Keep analysis under 80 words.`;

function buildUserPrompt(input: OptimizeInput): string {
  const target = input.minTargetMs ?? 5000;
  const dwellSec = (input.dwellAvgMs / 1000).toFixed(1);
  const targetSec = (target / 1000).toFixed(1);
  const scrollPastPct = (input.scrollPastRate * 100).toFixed(0);

  return `Section: ${input.section}

Current headline:
"${input.currentHeadline}"

Current body:
${input.currentBody ? `"${input.currentBody}"` : "(none)"}

Engagement telemetry:
- Average dwell time: ${dwellSec}s (target: ${targetSec}s)
- Scroll-past rate: ${scrollPastPct}% of visitors slid past without engaging

Task:
1. Diagnose why the current copy may not be hooking this audience of founders and CEOs.
2. Propose 3 stronger headline variants, each short and punchy.
3. Propose 1 replacement body sentence.

Respond with JSON only, matching the schema in your instructions.`;
}

function extractJson(text: string): OptimizeResult {
  const trimmed = text.trim();

  // Strip markdown code fences if the model added them despite instructions.
  let candidate = trimmed;
  const fenceMatch = candidate.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (fenceMatch) {
    candidate = fenceMatch[1].trim();
  }

  // Fall back to locating the first { and last } if there is extra prose.
  if (!candidate.startsWith("{")) {
    const first = candidate.indexOf("{");
    const last = candidate.lastIndexOf("}");
    if (first !== -1 && last !== -1 && last > first) {
      candidate = candidate.slice(first, last + 1);
    }
  }

  const parsed = JSON.parse(candidate) as Partial<OptimizeResult>;

  const analysis = typeof parsed.analysis === "string" ? parsed.analysis : "";
  const headlines = Array.isArray(parsed.headlines)
    ? parsed.headlines.filter((h): h is string => typeof h === "string").slice(0, 3)
    : [];
  const body = typeof parsed.body === "string" ? parsed.body : "";

  if (!analysis || headlines.length === 0 || !body) {
    throw new Error("Optimizer response missing required fields.");
  }

  return { analysis, headlines, body };
}

export async function optimizeSection(
  input: OptimizeInput
): Promise<OptimizeResult> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey === "your_key_here_replace_me") {
    throw new Error("ANTHROPIC_API_KEY is not configured.");
  }

  const client = new Anthropic({ apiKey });

  const PRIMARY_MODEL = "claude-opus-4-6";
  const FALLBACK_MODEL = "claude-sonnet-4-6";

  const userPrompt = buildUserPrompt(input);

  async function callModel(model: string) {
    return client.messages.create({
      model,
      max_tokens: 800,
      system: SYSTEM_PROMPT,
      messages: [{ role: "user", content: userPrompt }],
    });
  }

  let response;
  try {
    response = await callModel(PRIMARY_MODEL);
  } catch (err) {
    const msg = err instanceof Error ? err.message : String(err);
    if (
      msg.toLowerCase().includes("model") ||
      msg.toLowerCase().includes("not_found") ||
      msg.toLowerCase().includes("404")
    ) {
      response = await callModel(FALLBACK_MODEL);
    } else {
      throw err;
    }
  }

  const text = response.content
    .filter((block): block is Anthropic.TextBlock => block.type === "text")
    .map((block) => block.text)
    .join("\n")
    .trim();

  if (!text) {
    throw new Error("Empty response from Optimizer Agent.");
  }

  return extractJson(text);
}

async function ensureDataDir(): Promise<void> {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch {
    // ignore
  }
}

export async function loadActiveVariants(): Promise<ActiveVariants> {
  if (isRedisAvailable()) {
    try {
      const redis = await getRedisClient();
      const raw = await redis.get(KV_VARIANTS_KEY);
      if (raw) {
        const stored = JSON.parse(raw) as ActiveVariants;
        if (stored && typeof stored === "object") {
          return stored;
        }
      }
      return {};
    } catch (err) {
      console.error("[optimizer] redis.get error:", err);
      return {};
    }
  }

  try {
    const raw = await fs.readFile(VARIANTS_PATH, "utf8");
    const parsed = JSON.parse(raw) as ActiveVariants;
    if (parsed && typeof parsed === "object") {
      return parsed;
    }
    return {};
  } catch (err) {
    const code = (err as NodeJS.ErrnoException).code;
    if (code === "ENOENT") {
      return {};
    }
    // Corrupt or unreadable — return empty rather than crash the route.
    return {};
  }
}

export async function saveVariant(
  section: string,
  variant: ActiveVariant
): Promise<ActiveVariants> {
  const current = await loadActiveVariants();
  current[section] = variant;

  if (isRedisAvailable()) {
    const redis = await getRedisClient();
    await redis.set(KV_VARIANTS_KEY, JSON.stringify(current));
    return current;
  }

  await ensureDataDir();
  await fs.writeFile(VARIANTS_PATH, JSON.stringify(current, null, 2), "utf8");
  return current;
}
