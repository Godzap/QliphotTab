# Faust's Compendium — System Documentation

## Purpose

Faust's Compendium is a structured reference database for a tabletop RPG adaptation of the video game **Lobotomy Corporation**. It serves a small group (~2–5 players) as a shared, living knowledge base that grows as the group encounters new content during play sessions.

**Primary use cases:**
- Quick lookup during play sessions
- Post-session data entry by the compendium manager

The compendium tracks three categories: **Abnormalities**, **Tools**, and **Ordeals**. Each has a different schema. Entries range from fully documented to complete placeholders, and the system reflects that state clearly at a glance via checkboxes.

---

## Information Architecture

### Hub Page: Faust's Compendium

A single root page housing three inline databases. Contains a short intro block written in-character (as Faust from Limbus Company), followed by the three databases.

---

## Database 1: Abnormalities

The largest and most complex database. Each row is a single abnormality entity and also a full page with structured content inside.

### Properties (table columns)

| Property | Type | Notes |
|---|---|---|
| Name | Title | |
| Code | Text | In-game ID, e.g. `T-05-51` |
| Level | Select | Zayin (green) → Teth (blue) → HE (yellow) → Waw (orange) → Aleph (red) |
| Has Managerial Notes | Checkbox | |
| Has Defensive Notes | Checkbox | |
| Has Empirical Research | Checkbox | |
| Notes | Text | Quick tags/summary, rarely used |

### Page Content Structure

Each entry has three sections:

---

#### Managerial Notes

Official card text from the tabletop game. Structured as numbered Guidelines (Guideline 1, 2, 3). Written in third person, past tense, clinical tone.

Conventions:
- In-game effects use bracket notation: `[Death]`, `[Possession]`, `[Give X Token]`
- Damage values include emoji damage type icons (see Damage Types below)
- When not yet available: *"Faust does not have access to this information yet."*

---

#### Defensive Notes

Suppression/combat statistics. Contains:

1. A simple stat block: `Durability: N`
2. A two-row resistance table:

| Damage Type | 🔴 Red | ⬜ White | ⬛ Black | 🌫️ Pale |
|---|---|---|---|---|
| Resistance | value | value | value | value |

**Resistance values:** Normal / Weak / Endured / Resistant / Immune / Absorb / Vulnerable

**Special cases:**
- Non-escaping objects: note stating "Non Escaping Object — this abnormality does not escape and has no defensive stats" with N/A across the table
- Enkephalin-locked stats: note stating the unlock cost (e.g. "12 Enkephalin boxes") and that stats are pending, table filled with `?`
- When not yet available: *"Faust does not have access to this information yet."*

---

#### Empirical Research

Field data collected by players during sessions.

**Primary structure:** a table with columns:

| Work Type | Roll | Result |
|---|---|---|
| Instinct / Insight / Attachment / Repression | Good / Neutral / Bad | plain text |

**Secondary structure:** an "Extra observations" bullet list for:
- Working hypotheses (explicitly flagged as unconfirmed)
- Cross-abnormality interactions
- Special escape behaviors
- Tokens given on escape
- Damage to facility (untyped, no emoji)
- Stat thresholds (e.g. "Temperance 2+ required to survive")

**Important:** This section may be intentionally empty even when the entry is otherwise complete. If Managerial Notes already cover all known behavior, Empirical Research is left blank — not marked as missing.

---

## Database 2: Tools

Same structural pattern as Abnormalities but lighter. Tools are equipment-like items, not creatures.

### Properties

| Property | Type | Notes |
|---|---|---|
| Name | Title | |
| Code | Text | e.g. `D-09-104` |
| Level | Select | Same tier options as Abnormalities |
| Single Use | Checkbox | Flags single-use tools; types are Single Use / Continuous Use / Equippable |
| Has Notes | Checkbox | |
| Has Empirical Research | Checkbox | |
| Notes | Text | Quick tags/summary |

### Page Content Structure

#### Notes

Official card text. Structure:
1. Type descriptor and its definition (e.g. "Single Use — When an Employee works with the Tool, resolve its effects indiscriminately.")
2. Unlock condition(s)
3. Effects, numbered and labeled (Effect 1, Effect 2... or labeled by trigger condition)

Same damage type emoji conventions and `[Death]`/token notation as Abnormalities.

When not available: *"Faust does not have access to this information yet."*

#### Empirical Research

Same format as Abnormalities. Often just bullet points since tools have no work dice mechanic — observations are freeform.

---

## Database 3: Ordeals

Wave-based enemy events drawn randomly from a deck by the GM at set cycle numbers.

### Properties

| Property | Type | Notes |
|---|---|---|
| Name | Title | |
| Color | Select | Crimson (red) / Amber (orange) / Indigo (blue) / Pale (default) |
| Time | Text | e.g. `Cycle 9` |
| Has Description | Checkbox | |
| Has Empirical Research | Checkbox | |

### Page Content Structure

#### Description

- Theme name (in-game title of the ordeal)
- In-game quote (flavor text from the card)
- Physical appearance of the enemy units

#### Empirical Research

Freeform observations:
- Spawn behavior and location tendencies
- Movement behavior and targeting priority
- Damage values and damage types
- Notable interactions with abnormalities or employees

---

## Design Principles

### Checkbox Status System
The three checkboxes per row (Has X / Has Y / Has Z) are the primary "what still needs to be done" signal. A board view grouped by Level provides a visual layout of all entities by danger tier.

### Faust's Voice
All placeholder text uses:
> *"Faust does not have access to this information yet."*

Section descriptions on the hub page are written in a clinical, slightly cold, authoritative tone — as if authored by the character Faust from Limbus Company (Lobotomy Corporation's sequel franchise). The character is intelligent, precise, slightly arrogant, and frames gaps in knowledge as temporary rather than failures.

### Data Integrity
Only one person (the compendium manager) adds or edits entries. Other players can request additions via a dedicated Discord channel (`#record-room` or equivalent). This prevents duplicate or conflicting entries.

### Living Document
Entries are created as placeholders when an entity is first encountered, even with zero data. Information is added incrementally across sessions. Hypotheses are explicitly flagged as such in empirical notes and get confirmed or refuted as more data comes in.

---

## Damage Type Conventions

| Type | Emoji | Notes |
|---|---|---|
| Red | 🔴 | Physical damage |
| White | ⬜ | Holy/mental damage |
| Black | ⬛ | Curse damage |
| Pale | 🌫️ | Highest tier damage |
| Facility damage | *(none)* | Untyped — always written as a plain number |

---

## Token & Effect Notation

In-game mechanical effects use bracket notation throughout:
- `[Death]` — employee is killed
- `[Possession]` — employee is possessed
- `[Give X Token]` — employee receives a named token
- `[Remove X Token]` — token is removed
- `[Gain +N Enkephalin Boxes]` — Enkephalin generated

Damage is written inline, e.g.: `[5 🔴 Red Damage]`, `[7 AoE 🔴 Red Damage]`

---

## Stat Threshold Pattern

Several abnormalities gate effects on employee stat levels. Confirmed patterns logged so far:

| Stat | Abno | Threshold | Effect if below |
|---|---|---|---|
| Temperance | Spider Bud | ≥ 2 | Death |
| Temperance | Void Dream | ≥ 3 | Death |
| Temperance | The Red Shoes | ≥ 3 | Possession on work |
| Prudence | Steam Transport Machine | ≥ 3 | Death |
| Fortitude | Crumbling Armor | ≥ 2 | Death |
| Fortitude | Blue Star | ≥ 5 | Auto-throw into abno |
| Justice | Funeral of Dead Butterflies | ≥ 3 | Qliphoth drop |

---

## Current Scale (as of latest session)

| Category | Count |
|---|---|
| Abnormalities | ~55+ entries (Zayin, Teth, HE, Waw, Aleph) |
| Tools | ~15 entries |
| Ordeals | 3 entries (Crimson, Green, Indigo Dawn) |

---

## Planned AI Layer (Future)

A chat interface similar to NotebookLM — an agent that can answer natural language questions about the compendium:
- *"What work type is safe for Spider Bud?"*
- *"Which abnormalities are weak to Pale damage?"*
- *"What happens if Void Dream escapes?"*

The Notion content would serve as the knowledge source, either via periodic export or live Notion API retrieval.

### Architecture Considerations

- **Data is relational:** abnormalities reference tokens, tokens reference other abnormalities, cross-abno effects exist (e.g. Scaredy Cat reacts to The Road Home). A document store maps well to the current structure but a relational DB would serve filtering/querying better.
- **AI ingestion:** clean structured text per entry is important for retrieval quality. How page content is formatted for chunking/embedding should be decided early — the current three-section structure (Managerial / Defensive / Empirical) maps well to distinct semantic chunks per entity.
- **Incremental updates:** the knowledge base grows session by session. The pipeline needs to handle partial entries and placeholder text gracefully (i.e. "Faust does not have access to this information yet" should not pollute search results as a false answer).
