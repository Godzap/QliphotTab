# Faust's Compendium

A Lobotomy Corporation TTRPG reference app. Lists abnormalities, tools, and ordeals with their managerial guidelines, defensive stats, and empirical research notes.

**Stack:** React 18 + Vite + Tailwind CSS + Framer Motion  
**Hosted:** GitHub Pages → `https://<username>.github.io/lobotomy-corporation/`

---

## Running locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Project structure

```
src/
  data/
    abnormalities.json   ← main data file
    tools.json
    ordeals.json
    index.js             ← exports getAll(), getById(), CATEGORY_META
  pages/
  components/
public/
  images/
    abnormalities/       ← portraits named {lowercase-code}.png  (e.g. f-01-02.png)
    tools/
    ordeals/
scripts/
  convert-md-to-json.cjs       ← rebuilds abnormalities.json from compendium MD files
  convert-tools-to-json.cjs    ← rebuilds tools.json from compendium MD files
  download-images.cjs          ← downloads portraits from wiki URLs
```

---

## Adding new entries

### Option A — run the conversion scripts (batch)

If you have the Faust compendium Notion export:

```bash
node scripts/convert-md-to-json.cjs      <path-to-faust-compendium-files>
node scripts/convert-tools-to-json.cjs   <path-to-faust-compendium-files>
```

These scripts read the CSV files (as metadata) and the MD files (as content) from the export folder. Only entries present in `Abnormalities*.csv` / `Tools*.csv` are included — tools and ordeals won't bleed into the wrong list.

### Option B — add an entry manually (or via AI agent)

Edit the relevant JSON file directly. The schemas are below.

---

## JSON schemas

### Abnormality

```json
{
  "id": "f-01-02",
  "name": "Scorched Girl",
  "code": "F-01-02",
  "level": "Teth",
  "image": "f-01-02.png",
  "notes": "",

  "hasManagerialNotes": true,
  "hasDefensiveNotes": true,
  "hasEmpiricalResearch": true,

  "managerialNotes": {
    "guidelines": [
      "Guideline 1: <full text of guideline 1. Inline tokens use [Square Bracket Notation].>",
      "Guideline 2: <full text of guideline 2.>",
      "Guideline 3: <full text of guideline 3.>"
    ]
  },

  "defensiveNotes": {
    "durability": 29,
    "isNonEscaping": false,
    "enkephalinLocked": false,
    "enkephalinCost": null,
    "resistances": {
      "red":   "Endured",
      "white": "Normal",
      "black": "Weak",
      "pale":  "Weak"
    }
  },

  "empiricalResearch": {
    "workTable": [
      { "workType": "Insight",    "roll": "Neutral", "result": "Qliphoth -1" },
      { "workType": "Instinct",   "roll": "Good",    "result": "Nothing happens" },
      { "workType": "Repression", "roll": "Bad",     "result": "Qliphoth -1" }
    ],
    "extraObservations": [
      "When she escapes, gives a Fourth March Flame token to a random worker in the department.",
      "If she reaches her target, she explodes, dealing 12 AoE 🔴 Red damage — then is permanently removed from the game."
    ]
  }
}
```

**Field notes:**

| Field | Values / notes |
|---|---|
| `id` | `code.toLowerCase()` if code exists, else kebab-case name |
| `level` | `"Zayin"` `"Teth"` `"HE"` `"Waw"` `"Aleph"` — exact casing |
| `image` | filename in `public/images/abnormalities/`, or `null` |
| `isNonEscaping` | `true` for objects that never breach (no defensive stats) |
| `enkephalinLocked` | `true` if the cell requires Enkephalin to open |
| `enkephalinCost` | integer or `null` |
| `resistances` | `"Endured"` `"Normal"` `"Weak"` `"Resistant"` or `"N/A"` if non-escaping |
| `workType` | `"Instinct"` `"Insight"` `"Attachment"` `"Repression"` |
| `roll` | `"Good"` `"Neutral"` `"Bad"` |
| Inline tokens | Wrap in `[Square Brackets]` — they render as highlighted tags in the UI |
| Damage inline | Use emoji: `🔴 Red` `⬜ White` `⬛ Black` `🩵 Pale` |

---

### Tool

```json
{
  "id": "t-09-85",
  "name": "We Can Change Anything",
  "code": "T-09-85",
  "level": "Zayin",
  "image": null,
  "usageType": "Single Use",
  "notes": "",

  "hasNotes": true,
  "hasEmpiricalResearch": false,

  "toolNotes": {
    "typeDescriptor": "Single Use",
    "typeDefinition": "When an Employee works with the Tool, resolve its effects indiscriminately.",
    "unlockConditions": [
      "An employee has died as a result of We Can Change Anything."
    ],
    "effects": [
      { "label": "Effect 1", "text": "Employees can be placed into We Can Change Anything, generating Enkephalin based on their stats." },
      { "label": "Effect 2", "text": "The employee placed inside perishes instantly. [Death]" }
    ]
  },

  "empiricalResearch": {
    "observations": [
      "Confirmed: generates 3 Enkephalin boxes per stat point above 1."
    ]
  }
}
```

**Field notes:**

| Field | Values / notes |
|---|---|
| `usageType` | `"Single Use"` or `"Equippable"` |
| `typeDefinition` | The generic rule text for that usage type |
| `unlockConditions` | Array of strings, one per condition |
| `effects` | Array of `{ "label": "Effect N", "text": "..." }` |
| `observations` | Free-form strings, one per bullet point |

---

### Ordeal

```json
{
  "id": "crimson-dawn",
  "name": "Crimson Dawn",
  "color": "Crimson",
  "time": "Cycle 9",
  "image": null,

  "hasDescription": true,
  "hasEmpiricalResearch": true,

  "description": {
    "themeName": "The Bleeding Morning",
    "quote": "\"When the sun rises red, it is not the light that arrives — it is the hunger.\"",
    "appearance": "A wave of hunched, crimson-robed figures that move in jerking, erratic patterns."
  },

  "empiricalResearch": {
    "observations": [
      "Spawns at facility perimeter — 6 units observed.",
      "Each talon strike deals [4 🔴 Red Damage]. They attack twice per turn."
    ]
  }
}
```

**Field notes:**

| Field | Values / notes |
|---|---|
| `color` | `"Crimson"` `"Indigo"` `"Green"` `"Violet"` |
| `time` | `"Cycle N"` when it first appears |
| `themeName` | Flavour subtitle |

---

## Adding portrait images

Name the file `{lowercase-code}.png` (e.g. `F-01-02` → `f-01-02.png`) and place it in `public/images/abnormalities/`. For entries with no code, use kebab-case name (e.g. `one-sin-and-hundreds-of-good-deeds.png`).

Wiki portraits follow the pattern:
```
https://lobotomycorporation.wiki.gg/images/{PascalCaseName}Portrait.png?<hash>
```
The hash is required and unique per image — get it by right-clicking the portrait on the wiki page and copying the image URL.

---

## Deployment

Push to `main`. GitHub Actions (`.github/workflows/deploy.yml`) builds and deploys automatically.

First-time setup: repo **Settings → Pages → Source → GitHub Actions**.

If the repo is not named `lobotomy-corporation`, update `base` in `vite.config.js` to match.
