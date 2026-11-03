#!/usr/bin/env node
// Checks that every number on a domain page traces to a linked note.
//
// For each line of a domain note's body (a paragraph, list item or table row), every
// number must appear in at least one note linked from that same line ([[…]]): a case
// study, metric, insight, challenge or overview page. Numbers 0–3, ordinals in lists
// and numbers inside the link targets themselves are ignored.
//
// It only reports (exit code 1 when something is untraced); it never edits notes.
// Usage: node scripts/check-domain-numbers.mjs

import fs from "node:fs"
import path from "node:path"
import { CONTENT, loadKB } from "./lib/kb.mjs"

const kb = loadKB()
// Thousands separators ("1,800", "120 000") are removed, but only inside a number that
// does not continue a word — "P1 225 m" stays "P1 225", not "1225".
const norm = (s) => s.replace(/(?<![\p{L}\d.])(\d{1,3}(?:[,   ]\d{3})+)(?!\d)/gu, (m) => m.replace(/[,   ]/g, "")).replace(/−/g, "-")
const textOf = new Map()
const noteText = (name) => {
  if (textOf.has(name)) return textOf.get(name)
  let t = ""
  const n = kb.find(name)
  if (n) t = n.raw
  else {
    const p = path.join(CONTENT, "Overviews", `${name}.md`)
    if (fs.existsSync(p)) t = fs.readFileSync(p, "utf8")
  }
  t = norm(t)
  textOf.set(name, t)
  return t
}

let problems = 0
for (const s of kb.notes.filter((n) => n.type === "domain" || n.type === "strategy")) {
  const lines = s.body.split(/\r?\n/)
  lines.forEach((line, i) => {
    if (/^#|^!\[\[|^\s*$/.test(line)) return
    const links = [...line.matchAll(/\[\[([^\]|#]+)(?:[|#][^\]]*)?\]\]/g)].map((m) => m[1].trim())
    const bare = norm(line.replace(/\[\[[^\]]*\]\]/g, " ").replace(/^\s*\d+\.\s/, ""))
    const nums = [...bare.matchAll(/\d+(?:\.\d+)?/g)].map((m) => m[0]).filter((x) => parseFloat(x) > 3)
    for (const x of new Set(nums)) {
      const ok = links.some((l) => new RegExp(`(^|[^\\d.])${x.replace(".", "\\.")}(?![\\d])`).test(noteText(l)))
      if (!ok) {
        problems++
        console.log(`${s.rel}:${i + 1}: "${x}" not found in ${links.length ? links.map((l) => `[[${l}]]`).join(", ") : "any linked note (no link on this line)"}`)
      }
    }
  })
}
console.log(problems ? `\n⚠️  ${problems} number(s) on domain and strategy pages not traced to a linked note` : "✅ Every number on domain and strategy pages traces to a linked note")
process.exit(problems ? 1 : 0)
