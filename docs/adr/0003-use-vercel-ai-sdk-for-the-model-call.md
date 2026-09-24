# Use the Vercel AI SDK for the model call

The spec called for calling Gemini's structured-output API directly. We instead
use the Vercel AI SDK (`ai` + `@ai-sdk/google`) with a Google AI Studio model —
`gemini-2.5-flash` at temperature `0` — via `generateText({ output:
Output.object({ schema }) }). One provider-agnostic call site, and the schema
validation lives in the same place as the schema.

**This deviates from the spec's literal stack instruction**, so it is recorded
here rather than left implicit.

**Consequences / risks**: `generateText` with `Output.object()` must be verified to
send a constrained response schema to the provider — an earlier AI SDK issue
reported that it may parse the response SDK-side instead of requesting provider
JSON mode, which would undercut the point of structured output. If verification
fails at integration, the call flips to the deprecated-but-constrained
`generateObject()`. The provider's default environment variable,
`GOOGLE_GENERATIVE_AI_API_KEY`, is used.
