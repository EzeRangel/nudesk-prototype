# Master Prompt — "Notes → CRM" (take-home mini-project)

## 1. Context and goal

I'm building a mini-project for a take-home assessment (role: AI Solutions Builder). The goal of the exercise is to demonstrate how I think, how I build, and good scoping judgment — **not** a finished product or a real CRM integration.

**What the app does:** a sales rep pastes messy free-text notes from a call (typos, mixed language, abbreviations) into a textarea. An LLM extracts that information and structures it into fields ready to insert into a CRM. The user can edit the result before "confirming" it (human-in-the-loop) — there is no automatic submission to any real CRM.

**Success criteria:** it should spin up locally in minutes, be explainable in 60 seconds, and the code should reflect deliberate decisions (no over-engineering, no under-engineering).

---

## 2. Stack

- **Frontend:** Next.js 16 (App Router), TypeScript
- **UI:** shadcn/ui + Tailwind CSS
- **Backend:** Next.js Route Handler (server-side), NEVER expose the API key to the client
- **LLM:** Google AI Studio (Gemini), using **structured output / `response_schema`** — do not parse free-text JSON
- **Validation:** Zod, validating the LLM's response server-side before returning it to the client
- **Deploy:** Vercel (new project, environment variables for the API key)

---

## 3. Layout / UI

A single screen, two panels:

**Left panel:**
- Large textarea to paste the notes
- "Extract" button
- Below the textarea, a row of **preset** buttons ("Example 1", "Example 2", "Example 3") that fill the textarea with deliberately messy sample notes (see section 6)

**Right panel:**
- Structured result, shown as an **editable form** (not read-only JSON) — each schema field is an editable input/select
- A "View raw JSON" toggle to show the object as-is
- "Copy JSON" button
- Loading state (skeleton or spinner) while processing
- If validation fails: show the LLM's raw text as a fallback, with a clear error message (no silent crash)

Use shadcn components: `Textarea`, `Button`, `Card`, `Input`, `Select`, `Skeleton`, `Alert` for the error state.

---

## 4. Data schema (source of truth — Zod)

```ts
import { z } from "zod";

export const LeadExtractionSchema = z.object({
  clientName: z.string().nullable(),
  company: z.string().nullable(),
  budget: z.string().nullable(),
  timeline: z.string().nullable(),
  isDecisionMaker: z.boolean().nullable(),
  objections: z.array(z.string()),
  competitors: z.array(z.string()),
  riskLevel: z.enum(["low", "medium", "high"]),
  nextAction: z.string().nullable(),
});

export type LeadExtraction = z.infer<typeof LeadExtractionSchema>;
```

This same schema (translated to JSON Schema) is used as the `response_schema` in the Gemini call, to force structured output on the model side. Zod validation happens *after*, as a second line of defense — don't rely solely on the model respecting the schema.

---

## 5. LLM system prompt

Explicit, non-negotiable rules:

- If a field isn't present in the notes, it must be `null` (or an empty array, as appropriate). **Never invent values.**
- `riskLevel` is inferred from the tone/content of the notes (strong objections, hesitation, vague timeline → higher risk), not a field the rep declares directly.
- Output must strictly match the schema — no extra text, no markdown, no explanation.

Write the full system prompt inside the code (not as a loose comment) and treat it as a versioned decision, not a magic string.

---

## 6. Presets (example notes — deliberately messy)

Generate 3 realistic example notes, each with at least: typos, mixed language, abbreviations, and **at least one schema field missing** (to prove the `null` behavior works and the model doesn't hallucinate). Expected tone example:

> "call w/ john smith from acme corp, super interested but worried abt price, says he's comparing w/ another similar tool (maybe Zendesk?), budget not confirmed yet, decides in ~2 weeks, he's NOT the final decision maker"

---

## 7. Validation

- Server-side: validate the LLM's response against `LeadExtractionSchema` with Zod before returning it to the client
- If validation fails: respond with a structured error (`{ error: true, raw: "..." }`) so the frontend can show the raw-text fallback
- Also handle the empty-textarea case (don't call the LLM, show an inline message)

---

## 8. Human-in-the-loop

The result is **not** considered "confirmed" until the user reviews it. The right-panel form must be editable from first render — this is intentional, not a nice-to-have: it communicates that the system assists the rep rather than replacing them.

---

## 9. Explicitly out of scope (document in README, do not build)

- Configurable field mapping to a real CRM (Salesforce/HubSpot/etc.) — mention that the natural next step would be a configurable `mapping.json`
- Automatic trigger to submit to a CRM via API — mention that a CRM API call would normally go here

Do not implement these two. If the agent has spare time, prioritize polishing UX and error handling over expanding scope.

---

## 10. Deploy

- Deploy to Vercel
- Environment variables: `GOOGLE_AI_API_KEY` (or whatever name the chosen SDK uses)
- Confirm `.env.local` is in `.gitignore` before the first commit

---

## 11. Deliverables

- Public GitHub repo
- README (in English) with: what it is, how to run it locally, key decisions (why `response_schema`, why an editable human-in-the-loop panel, what was left out of scope and why)
- Screenshots or a short demo video

---

## 12. Final instruction for the agent

Work in small, verifiable iterations: (1) scaffold + static UI with mock data, (2) real LLM integration with one preset, (3) validation + error handling, (4) all 3 presets complete, (5) visual polish, (6) README + deploy. Confirm with me before moving from one phase to the next if anything is unclear — but don't stop for decisions already made in this document.

All code comments, commit messages, README, and any other project documentation should be written in English.