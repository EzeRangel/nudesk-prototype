# Zod is the single source of truth for the extraction shape

The LLM must return structured output and the server must validate it against the
same shape. We define `LeadExtractionSchema` once, in Zod, and hand that one
definition to the model call; the schema sent to the provider is derived from it,
never authored by hand. The model module (`lib/extract-lead.ts`) additionally
re-validates the result with `LeadExtractionSchema.parse()` as an explicit
second gate.

**Considered options**: hand-maintaining a separate JSON Schema for the provider
(rejected — two definitions of the same shape drift apart); relying only on the
model to respect the shape (rejected — this is why validation exists).

**Consequences**: changing a field is a change to Zod and nothing else. The
provider-facing schema is generated and must never be edited directly. The extra
`.parse()` is deliberate redundancy, not an oversight.
