#!/usr/bin/env node
// Adds context from the lecture transcripts to insight notes (second import round).
//
// Input: import/private/context/NN.json — one file per lecture:
//   { "lecture": "01", "entries": { "<insight note name>": {
//       "context": "2–4 sentences, paraphrased: who speaks, about which project, in answer to what",
//       "at": "presentation, around 00:15" | "Q&A, 01:15:06",
//       "excerpt": "longer passage from the transcript, lightly cleaned",
//       "strategies": [1, 3],
//       "statement": "optional — what the speaker said, when the claim bank mixed in its own reading",
//       "editorial_note": "optional — the claim bank's interpretation, moved out of the statement",
//       "confidence": "optional — e.g. check — figure garbled in the transcript" } } }
//   A file with "transcript": false (lecture without a transcript) gets context from the
//   claim bank only: no excerpt, the claim-bank quote is kept, and a todo/transcript tag is set.
//
// For each entry the note (in content/Insights/ or import/private/held-insights/) gets
// "## Context" and "## From the transcript" at the top of its body, replacing the short
// claim-bank "## Quote", and provisional domain/… tags. `statement` changes only when the
// entry gives one (to separate the speaker's point from the claim bank's interpretation).
// Safe to run again: the sections and tags are replaced, not duplicated.
//
// Usage: node scripts/apply-context.mjs [NN ...]   (default: all files in import/private/context/)

import fs from "node:fs"
import path from "node:path"
import { ROOT, CONTENT } from "./lib/kb.mjs"

const DIR = path.join(ROOT, "import", "private", "context")
const FOLDERS = [path.join(CONTENT, "Insights"), path.join(ROOT, "import", "private", "held-insights")]
export const STRATEGY_TAGS = {
  1: "domain/1-regenerative-park",
  2: "domain/2-adaptive-modular",
  3: "domain/3-urban-hybrid",
  4: "domain/4-mobility-last-mile",
  5: "domain/5-energy-symbiosis",
}
const OWN = ["Context", "From the transcript", "Editorial note"]

const only = process.argv.slice(2)
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json") && (!only.length || only.some((n) => f.startsWith(n.padStart(2, "0")))))
let updated = 0
const missing = []

for (const file of files) {
  const data = JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8"))
  for (const [name, e] of Object.entries(data.entries)) {
    const target = FOLDERS.map((d) => path.join(d, `${name}.md`)).find((p) => fs.existsSync(p))
    if (!target) { missing.push(`${file}: ${name}`); continue }
    const raw = fs.readFileSync(target, "utf8").replace(/\r\n/g, "\n")
    const m = raw.match(/^---\n([\s\S]*?)\n---\n?/)
    let fm = m[1]
    let body = raw.slice(m[0].length)

    // tags: drop old domain/… (formerly strategy/…) tags, add the new ones
    const tm = fm.match(/^tags:(?: \[\])?\n?((?:  - .*\n?)*)/m)
    const noTranscript = data.transcript === false || !e.excerpt
    const tags = tm ? [...tm[1].matchAll(/^  - "?([^"\n]+)"?$/gm)].map((x) => x[1]).filter((t) => !t.startsWith("strategy/") && !t.startsWith("domain/") && t !== "todo/transcript") : []
    for (const s of e.strategies ?? []) if (STRATEGY_TAGS[s]) tags.push(STRATEGY_TAGS[s])
    if (noTranscript) tags.push("todo/transcript")
    const block = tags.length ? `tags:\n${tags.map((t) => `  - "${t}"`).join("\n")}\n` : "tags: []\n"
    fm = tm ? fm.replace(tm[0], block) : fm + "\n" + block
    if (e.statement) fm = fm.replace(/^statement: .*$/m, `statement: ${JSON.stringify(e.statement.trim())}`)
    if (e.confidence) fm = fm.replace(/^confidence: .*$/m, `confidence: ${JSON.stringify(e.confidence.trim())}`)
    fm = fm.replace(/\n+$/, "")

    // body: remove our own sections (and the short claim-bank quote when a transcript excerpt
    // replaces it), then put the new ones first
    const own = noTranscript ? OWN : [...OWN, "Quote"]
    const sections = body.split(/^(?=## )/m)
    const rest = sections.filter((s) => !own.some((h) => s.startsWith(`## ${h}\n`))).join("").trim()
    let intro = `## Context\n\n${e.context.trim()}\n`
    if (!noTranscript)
      intro +=
        `\n## From the transcript\n\n> ${e.excerpt.trim().replace(/\n+/g, "\n>\n> ")}\n\n` +
        `*Automatic transcript, ${e.at}. Lightly cleaned: repeated words and fillers removed, omissions marked […], editorial insertions in [brackets].*\n`
    if (e.editorial_note)
      intro += `\n## Editorial note\n\n${e.editorial_note.trim()}\n\n*An interpretation added when the claim bank was compiled — not said in the lecture.*\n`
    fs.writeFileSync(target, `---\n${fm}\n---\n${intro}${rest ? "\n" + rest + "\n" : ""}`)
    updated++
  }
}
console.log(`Updated ${updated} insight notes from ${files.length} context file(s).`)
if (missing.length) {
  console.log(`Not found (${missing.length}):`)
  for (const x of missing) console.log("  - " + x)
}
