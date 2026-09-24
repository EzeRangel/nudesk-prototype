import "server-only";

import { AISDKError, generateText, NoObjectGeneratedError, Output } from "ai";
import { google } from "@ai-sdk/google";

import { LeadExtractionSchema, type LeadExtraction } from "@/lib/schema";
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
  try {
    const { output } = await generateText({
      model: google(MODEL_ID),
      system: SYSTEM_PROMPT,
      prompt: notes,
      temperature: 0,
      output: Output.object({ schema: LeadExtractionSchema }),
    });

    // The AI SDK has already validated the output against the schema. This is
    // the explicit second gate the spec asks for — see ADR-0001.
    return { ok: true, data: LeadExtractionSchema.parse(output) };
  } catch (error) {
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
