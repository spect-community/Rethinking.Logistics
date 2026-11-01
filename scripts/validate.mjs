#!/usr/bin/env node
// Friendly check of all notes. It only WARNS — it never stops the build.
// Usage: node scripts/validate.mjs

import { loadKB } from "./lib/kb.mjs"

const kb = loadKB()
const { schema, notes } = kb
const warnings = []
const w = (n, msg) => warnings.push(`${n.rel}: ${msg}`)

for (const n of notes) {
  if (n.error) w(n, `properties could not be read (${n.error}). Check the YAML at the top of the note.`)
  if (!n.type) continue
  const def = schema.types[n.type]
  for (const r of schema.relations.filter((r) => r.from === n.type)) {
    for (const l of n.links[r.field] ?? []) {
      if (!l.note) w(n, `"${r.field}" links to "${l.name}", which has no page yet (a placeholder page is shown on the website)`)
      else if (l.note.type !== r.to) w(n, `"${r.field}" should link to ${schema.types[r.to].plural.toLowerCase()}, but "${l.name}" is in ${l.note.rel.split("/")[0]}/`)
    }
  }
  if (n.type === "metric" && !n.data.calculation) w(n, `no "calculation" — say how the metric is calculated (formula or tool)`)
  if (n.type === "case-study" && !n.data.portfolio) w(n, `no "portfolio" link`)
  if (n.type === "insight") {
    if (!(n.links.source ?? []).length) w(n, `no "source" — link the lecture, questionnaire or publication it comes from`)
    if (!n.data.evidence_status) w(n, `no "evidence_status" — use open-for-review, expert-reviewed or disputed`)
    if (!n.data.statement) w(n, `no "statement" — write the claim itself`)
  }
  const known = new Set([...(def.fields ?? []), ...schema.relations.filter((r) => r.from === n.type).map((r) => r.field), "tags", "title", "description"])
  for (const k of Object.keys(n.data)) if (!known.has(k) && !k.startsWith("auto_")) w(n, `extra property "${k}" (fine — it is shown on the page, just not used in overviews)`)
}

for (const n of kb.drafts) warnings.push(`${n.rel}: marked "draft: true" — ignored and not published (delete it if it is obsolete)`)

const counts = Object.fromEntries(Object.keys(schema.types).map((t) => [t, notes.filter((n) => n.type === t).length]))
console.log(`Rethinking Logistics — ${Object.entries(counts).map(([k, v]) => `${v} ${k}`).join(" · ")}`)
if (warnings.length) {
  console.log(`\n⚠️  ${warnings.length} note(s) to look at (nothing is blocked):`)
  for (const x of warnings) console.log("  - " + x)
} else console.log("✅ All good")
