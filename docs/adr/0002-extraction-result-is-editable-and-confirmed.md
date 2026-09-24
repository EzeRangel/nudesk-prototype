# The Extraction result is editable and requires explicit Confirmation

The right-hand panel renders the Extraction as an editable form, not a read-only
view, and the result is not final until the Rep Confirms it. This is intentional:
it communicates that the tool assists the Rep's judgment rather than replacing it,
and it keeps a human accountable for what would eventually reach a CRM.

**Considered options**: a read-only JSON view (rejected — it implies the model's
output is authoritative and invites blind copying).

**Consequences**: the UI carries a Confirmed / not-yet-Confirmed distinction, and a
Confirmed Extraction can be unlocked to edit again. "Copy JSON" is always available
regardless of Confirmation state.
