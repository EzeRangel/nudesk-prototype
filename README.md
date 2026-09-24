# Notes → CRM

Turn messy sales-call notes into structured, CRM-ready data — with a human in the loop.

A sales rep pastes rough notes from a call (typos, shorthand, mixed languages). An LLM extracts the useful fields into a structured shape, and the rep reviews and edits the result before using it. **Nothing is ever sent to a CRM automatically.**

**Live prototype:** https://nudesk-prototype.vercel.app

## How it works

```
browser                     Next.js route handler              Gemini
  │  POST /api/extract            │                              │
  ├──────────────────────────────►│  call notes                  │
  │                               ├─────────────────────────────►│  structured output
  │                               │◄─────────────────────────────┤  (response JSON schema)
  │                               │  validate with Zod           │
  │◄──────────────────────────────┤                              │
  │  editable form + Confirm       │                              │
```

- The model is **forced into a schema** (constrained decoding), not politely asked for JSON.
- The **same schema validates the response server-side** before it reaches the browser.
- The result panel is **editable**, and the flow ends with the rep confirming and copying the JSON.

## Run it locally

Requirements: Node 20.9+, pnpm, and a Google AI Studio API key.

```bash
pnpm install
cp .env.example .env.local   # then put your key in .env.local
pnpm dev
```

Open http://localhost:3000, click one of the example notes, and press **Extract**.

```bash
pnpm build   # production build
pnpm lint    # lint
```

### Environment

| Variable | Purpose |
| --- | --- |
| `GOOGLE_GENERATIVE_AI_API_KEY` | Google AI Studio key used for the extraction call. Server-side only. |

`.env.local` is gitignored and the key is never sent to the client.

## Key decisions

- **Structured output, schema-first.** `LeadExtractionSchema` (Zod) is the single source of truth. It is passed to the model through the AI SDK's `Output.object()`, which sends a JSON schema to Gemini so decoding is constrained; the same schema then validates the response server-side with `.parse()`. Two layers, one definition. → `docs/adr/0001-zod-is-the-single-source-of-truth.md`
- **Human in the loop.** The extraction arrives as an editable form, not read-only JSON, and there is an explicit Confirm step. The tool assists the rep's judgement instead of replacing it. → `docs/adr/0002-extraction-result-is-editable-and-confirmed.md`
- **Vercel AI SDK over the provider SDK.** `ai` + `@ai-sdk/google` keep the model call provider-agnostic and keep the schema validation next to the schema. → `docs/adr/0003-use-vercel-ai-sdk-for-the-model-call.md`
- **Absent means null.** If the notes give no concrete value for a field — including when they only say it is unknown, unconfirmed, or still pending — the field is `null` (or an empty array). Values are never invented. Enforced in `lib/system-prompt.ts` and again by the schema.
- **Errors are explicit.** A failed extraction returns a structured envelope — `{ error: true, kind, message, raw }` — so the UI can show the raw model output instead of crashing. Kinds: `empty`, `invalid_request`, `too_long`, `payload_too_large`, `rate_limited`, `validation`, `upstream`.

`CONTEXT.md` holds the project glossary.

## Cost & abuse guardrails

The endpoint spends real money per call, so it is guarded on both ends:

- **Input limits.** Notes are capped at 4,000 characters, the request body at 16 KB, and the body must be valid JSON with a non-empty string `notes` field.
- **Output cap.** Each call may generate at most 1,024 tokens.
- **Rate limits.** 8 requests per minute per client IP, with a 120/minute per-instance backstop. Exceeding either returns `429` with a `Retry-After` header.
- **Prompt injection.** The system prompt treats the notes strictly as data, so text that looks like instructions is ignored rather than executed.

The limiter is **in-memory** (the project has no database), so it is per-instance and resets on a cold start. It stops casual overuse of the demo, not a determined distributed attacker — a real deployment would move it to a shared store and add auth. See `docs/adr/0004-in-memory-abuse-guardrails.md`.

## Out of scope (and what would come next)

- **CRM field mapping.** Fields map to this schema directly today. The natural next step is a configurable `mapping.json` that maps these fields onto a specific CRM (HubSpot, Salesforce, …).
- **Automatic submission.** A real product would POST the confirmed payload to a CRM API. Deliberately omitted — the flow ends at Copy JSON.
- No auth, database, or persistence.

## Tech stack

Next.js 16 (App Router) · TypeScript · Tailwind CSS v4 · shadcn/ui · Zod · Vercel AI SDK (`ai` + `@ai-sdk/google`) with Google AI Studio (Gemini 3.5 Flash).

## Project structure

```
app/
  api/extract/route.ts   # POST endpoint: validation + error envelope
  page.tsx               # the single screen
components/              # notes input, editable result panel, form, raw JSON
lib/
  schema.ts              # LeadExtractionSchema — the single source of truth
  extract-lead.ts        # server-only model call
  system-prompt.ts       # versioned extraction rules
  presets.ts             # three messy example notes
docs/adr/                # decision records
CONTEXT.md               # glossary
```
