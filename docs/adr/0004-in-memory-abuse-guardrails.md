# Abuse guardrails are in-memory and per-instance

The extract endpoint spends real money on a paid model API, so it caps the input
size, caps the output token budget, and rate-limits requests both per client IP
and per instance. The limiter is deliberately storage-free, because this project
has no database.

The consequence: the counters live in process memory, so they reset on a cold
start and do not coordinate across instances. This stops casual overuse of the
demo but not a determined distributed attacker. A production deployment would
move the counters to a shared store (for example Redis/Upstash) and would
probably add authentication as well. This is recorded because a reader could
otherwise assume the rate limiting is stronger than it is.

The per-IP key is taken from the platform's `x-forwarded-for` header, so it is
only as trustworthy as the proxy in front of the app (Vercel sets it). Behind an
untrusted proxy a client could spoof the value and dodge the per-IP limit; the
global backstop still applies.
