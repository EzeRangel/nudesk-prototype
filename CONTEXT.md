# Notes → CRM

A tool that turns a sales rep's messy free-text call notes into structured, CRM-ready
lead information, while keeping the rep in control of the final result.

## Language

### Entities

**Rep**:
The salesperson who writes a Note and reviews its Extraction. The tool's only user.
_Avoid_: User, salesperson, agent.

**Note**:
The raw, unstructured free text a Rep writes after a call. May contain typos,
abbreviations, and mixed languages.
_Avoid_: Transcript, call log, message.

**Lead**:
A prospective customer described by a Note.
_Avoid_: Contact, prospect, deal, opportunity.

**Extraction**:
The structured lead information produced from a single Note. Composed of named
Fields such as client name, company, budget, and timeline.
_Avoid_: Result, output, parse, response.

**Risk Level**:
An inferred classification — low, medium, or high — of how likely a Lead is to
convert or stall. Inferred from the tone and content of a Note, never stated
directly by the Rep.
_Avoid_: Score, priority, confidence.

### Workflow

**Preset**:
A canned, deliberately messy Note offered as a one-click demonstration. The UI
labels these "Example 1–3".
_Avoid_: Sample, template.

**Confirmation**:
A Rep's explicit sign-off that an Extraction is accurate. An Extraction is not
final until Confirmed. Confirmation is never a submission to a CRM.
_Avoid_: Submit, save, approval, sync.
