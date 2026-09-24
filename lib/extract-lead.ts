import "server-only";

import { AISDKError, generateText, NoObjectGeneratedError, Output } from "ai";
import { google } from "@ai-sdk/google";

import { LeadExtractionSchema, type LeadExtraction } from "@/lib/schema";
import { MAX_OUTPUT_TOKENS } from "@/lib/limits";
import { SYSTEM_PROMPT } from "@/lib/system-prompt";

/** The single place to change the model. */
const MODEL_ID = "gemini-3.5-flash";

export type ExtractLeadResult =
  | { ok: true; data: LeadExtraction }
  | { ok: false; kind: "validation"; raw: string | null }
  | { ok: false; kind: "upstream" };

/**
 * Runs the extraction against Gemini and returns a discriminated result that
 * the route can turn into a response. It never throws for the expected failure
 * modes (schema mismatch, provider error) — those come back as `ok: false`.
 */
export async function extractLead(notes: string): Promise<ExtractLeadResult> {
  let output: LeadExtraction | undefined;

  try {
    const generated = await generateText({
      model: google(MODEL_ID),
      system: SYSTEM_PROMPT,
      prompt: notes,
      temperature: 0,
      maxOutputTokens: MAX_OUTPUT_TOKENS,
      output: Output.object({ schema: LeadExtractionSchema }),
    });
    output = generated.output;

    // The AI SDK has already validated this, so it is normally a no-op. It is
    // the explicit second gate from ADR-0001: if it ever rejects we return the
    // raw object instead of throwing, so the UI still gets its fallback.
    return { ok: true, data: LeadExtractionSchema.parse(output) };
  } catch (error) {
    if (output !== undefined) {
      return { ok: false, kind: "validation", raw: safeStringify(output) };
    }
    if (NoObjectGeneratedError.isInstance(error)) {
      return { ok: false, kind: "validation", raw: error.text ?? null };
    }
    if (AISDKError.isInstance(error)) {
      console.error("[extract] model call failed:", error);
      return { ok: false, kind: "upstream" };
    }
    throw error;
  }
}

function safeStringify(value: unknown): string | null {
  try {
    return JSON.stringify(value);
  } catch {
    return null;
  }
}
