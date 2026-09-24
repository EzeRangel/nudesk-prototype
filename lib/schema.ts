import { z } from "zod";

/**
 * The single source of truth for a Lead Extraction.
 *
 * This schema is handed to the model as the response schema (via the AI SDK) and
 * re-validated on the server. Field definitions must not be duplicated anywhere
 * else — see docs/adr/0001-zod-is-the-single-source-of-truth.md.
 *
 * Fields that the notes do not mention must be `null` (or an empty array), never
 * invented. This is enforced by the system prompt, and again by this schema.
 */
export const LeadExtractionSchema = z.object({
  clientName: z
    .string()
    .nullable()
    .describe("Full name of the person the rep spoke with. Null if not stated."),
  company: z
    .string()
    .nullable()
    .describe("Company that person belongs to. Null if not stated."),
  budget: z
    .string()
    .nullable()
    .describe(
      "Anything the notes say about budget or price, kept close to the original wording. Null if not stated.",
    ),
  timeline: z
    .string()
    .nullable()
    .describe("When a decision or next step is expected. Null if not stated."),
  isDecisionMaker: z
    .boolean()
    .nullable()
    .describe(
      "Whether this person can make the final decision. Null if the notes are unclear or silent.",
    ),
  objections: z
    .array(z.string())
    .describe("Concerns or objections the prospect raised. Empty array if none."),
  competitors: z
    .array(z.string())
    .describe("Competing products or vendors mentioned. Empty array if none."),
  riskLevel: z
    .enum(["low", "medium", "high"])
    .describe(
      "Inferred risk that the deal stalls, based on the tone and content of the notes. Never stated directly by the rep.",
    ),
  nextAction: z
    .string()
    .nullable()
    .describe("The agreed or implied next step. Null if not stated."),
});

export type LeadExtraction = z.infer<typeof LeadExtractionSchema>;
