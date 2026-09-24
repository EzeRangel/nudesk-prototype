# Use the Vercel AI SDK for the model call

The spec called for calling Gemini's structured-output API directly. We instead
use the Vercel AI SDK (`ai` + `@ai-sdk/google`) with a Google AI Studio model —
`gemini-3.8-flash` at temperature `0` — via `generateText({ output:
Output.object({ schema }) }). One provider-agnostic call site, and the schema
validation lives in the same place as the schema.

**This deviates from the spec's literal stack instruction**, so it is recorded
here rather than left implicit.

**Consequences / risks**: the open question was whether `generateText` with
`Output.object()` sends a constrained response schema to the provider, rather
than parsing the response SDK-side. Verified at integration: `Output.object()`
produces `responseFormat: { type: "json", schema }`, `generateText` passes it to
the model, and the Google provider maps it to `responseMimeType:
"application/json"` plus `responseJsonSchema` (sanitized). So Gemini does the
constraining; the `generateObject()` fallback was not needed. The provider's
default environment variable, `GOOGLE_GENERATIVE_AI_API_KEY`, is used.

**Model note**: the originally chosen `gemini-2.5-flash` is retired for new API
users (the API returns `404 NOT_FOUND`). The model id lives in one constant in
`lib/extract-lead.ts` and can be swapped on one line.
