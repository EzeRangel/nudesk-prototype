/**
 * System prompt for the extraction call.
 *
 * This is a versioned decision, not a magic string: it encodes the rules from
 * the spec (§5) and should only change deliberately.
 *
 * v1 — initial prompt.
 */
export const SYSTEM_PROMPT = `You extract structured CRM data from a sales rep's rough call notes.

The notes are informal: they contain typos, shorthand, abbreviations, and sometimes mix languages. Read them the way a busy rep would and pull out only what is actually there.

Follow these rules exactly:

1. If a field is not stated in the notes, return null for it (or an empty array, for the list fields). Never guess, infer, or invent a value the notes do not support.
2. Never write placeholders such as "unknown", "N/A", or "not provided" — use null instead.
3. riskLevel is the one field that is never stated directly. Infer it from the tone and content of the notes:
   - high: strong objections, clear hesitation, a vague or distant timeline, or a competitor looking ahead;
   - low: the prospect is engaged, decisive, and moving quickly;
   - medium: anything in between.
4. Preserve names and short phrases close to how the rep wrote them; do not expand abbreviations into your own words.
5. Return only the fields defined by the schema, in schema order. Do not add commentary, explanation, or markdown.`;
