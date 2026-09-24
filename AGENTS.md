<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

Context for any agent (AGY, Opencode, Claude Code, etc.) working on this repo.

## What this project is

A take-home assessment: a tool that turns messy free-text sales notes (typos, informal shorthand) into structured, CRM-ready data using an LLM with structured output (`response_schema`) and a server-side validation layer. See `MASTER_PROMPT.md` for the full spec and the decisions already made — don't reopen them without reason.

## Stack

- Next.js 16 (App Router) + TypeScript
- shadcn/ui + Tailwind CSS
- Server-side Route Handler for the LLM call (never expose the API key to the client)
- Google AI Studio (Gemini) with `response_schema`
- Zod for server-side validation of the model's response

## Conventions

- The extraction schema (`LeadExtractionSchema`) is the single source of truth — it lives in one shared file used both for the LLM prompt (as JSON Schema) and for Zod validation. Don't duplicate the field definitions elsewhere.
- Fields missing from the notes → `null`, never invented. This is a system-prompt rule, not just a schema rule.
- The result panel is **editable**, not read-only — this is an intentional part of the design (human-in-the-loop), don't simplify it into a static view.
- Real CRM mapping and automatic submit-trigger are **intentionally out of scope** — don't implement them even if they seem easy to add; they belong in the README as roadmap items.

## Commands

```bash
pnpm dev       # local development
pnpm build     # production build
pnpm lint      # lint
```

## Environment variables

```
GOOGLE_GENERATIVE_AI_API_KEY=
```

Must live in `.env.local` (gitignored), never hardcoded or committed.

## Suggested workflow (spec-driven)

This project is meant to be developed with the usual planning/implementation loop:

1. **Planning** — use the `conductor` skill on `MASTER_PROMPT.md` to generate the spec/plan (SDD)
2. **Plan review** — use `grill-with-docs` to interview/critique the plan before implementing
3. **Implementation** — use `conductor:implement` to execute the planned track, reviewing afterward with the other agent in the loop

Follow the iteration order described in section 12 of `MASTER_PROMPT.md`: scaffold → LLM integration with one preset → validation/error handling → all presets complete → polish → README/deploy. Don't skip phases or expand scope without confirming.

## What NOT to do

- Don't add authentication, a database, or persistence — out of scope
- Don't implement CRM mapping or automatic submission (see section 9 of MASTER_PROMPT.md)
- Don't change the chosen stack (Next.js/shadcn/Gemini) without asking first

## Documentation language

All documentation for this project — README, code comments, this file, commit messages — is written in English.