// Shared loader for the Rethinking Logistics knowledge base.
// Forgiving by design: no required fields, no allowed-value lists, broken YAML
// is reported but never stops anything.

import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"
import yaml from "js-yaml"

const here = path.dirname(fileURLToPath(import.meta.url))
export const ROOT = path.resolve(here, "..", "..")
export const CONTENT = path.join(ROOT, "content")
export const SKIP_DIRS = new Set(["Templates", ".obsidian", "Overviews", ".trash", "Attachments"])

export const loadConfig = () => JSON.parse(fs.readFileSync(path.join(ROOT, "site.config.json"), "utf8"))
export const loadSchema = () => yaml.load(fs.readFileSync(path.join(ROOT, "schema", "schema.yml"), "utf8"))

/** Split a markdown file into { fmText, data, body, error }. Never throws. */
export function parseNote(raw) {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?/)
  if (!m) return { fmText: null, data: {}, body: raw, error: null }
  let data = {}
  let error = null
  try {
    data = yaml.load(m[1]) ?? {}
    if (typeof data !== "object" || Array.isArray(data)) data = {}
  } catch (e) {
    error = e.message.split("\n")[0]
  }
  return { fmText: m[1], data: normalise(data), body: raw.slice(m[0].length), error }
}

function normalise(v) {
  if (v instanceof Date) return v.toISOString().slice(0, 10)
  if (Array.isArray(v)) return v.map(normalise)
  if (v && typeof v === "object") return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, normalise(x)]))
  return v
}

export const asList = (v) => (v === undefined || v === null || v === "" ? [] : Array.isArray(v) ? v : [v])

/** "[[Name|alias]]" → "Name"; plain text stays as is. */
export function linkName(value) {
  if (typeof value !== "string") return null
  const m = value.match(/\[\[([^\]|#]+)(?:#[^\]|]*)?(?:\|[^\]]*)?\]\]/)
  return (m ? m[1] : value).trim() || null
}

/** Lower-case, accents removed — so "Zizkova" finds "Žižková". */
export const key = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase().trim()

function walk(dir, out = []) {
  if (!fs.existsSync(dir)) return out
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    if (e.name.startsWith(".")) continue
    const full = path.join(dir, e.name)
    if (e.isDirectory()) {
      if (!SKIP_DIRS.has(e.name)) walk(full, out)
    } else if (e.name.endsWith(".md")) out.push(full)
  }
  return out
}

/**
 * Load all notes. Each note: { file, rel, name, type, data, body, fmText, error,
 *   links: {field: [{name, note|null}]} }
 */
export function loadKB() {
  const schema = loadSchema()
  const folderType = Object.fromEntries(Object.entries(schema.types).map(([t, d]) => [d.folder, t]))
  const all = walk(CONTENT).map((file) => {
    const rel = path.relative(CONTENT, file).split(path.sep).join("/")
    const raw = fs.readFileSync(file, "utf8")
    const p = parseNote(raw)
    return { file, rel, raw, name: path.basename(file, ".md"), type: folderType[rel.split("/")[0]] ?? null, ...p, links: {} }
  })
  // Notes with `draft: true` are ignored everywhere (and Quartz does not publish them).
  const notes = all.filter((n) => n.data.draft !== true)
  const drafts = all.filter((n) => n.data.draft === true)

  const byName = new Map()
  for (const n of notes) {
    byName.set(key(n.name), n)
    for (const a of asList(n.data.aliases)) if (typeof a === "string") byName.set(key(a), n)
  }
  const find = (name) => (name ? byName.get(key(name)) ?? null : null)

  // Resolve the human-typed relations
  for (const r of schema.relations) {
    for (const n of notes.filter((x) => x.type === r.from)) {
      n.links[r.field] = asList(n.data[r.field])
        .map(linkName)
        .filter(Boolean)
        .map((name) => ({ name, note: find(name) }))
    }
  }
  return { schema, notes, drafts, byName, find }
}

/** Compute the auto_ fields for every note: Map(note → {auto_field: [names]}) */
export function computeAuto(kb) {
  const { schema, notes } = kb
  const auto = new Map(notes.map((n) => [n, {}]))
  const add = (note, field, name) => {
    const o = auto.get(note)
    o[field] ??= []
    if (!o[field].includes(name)) o[field].push(name)
  }
  // make sure every auto field exists (empty) on the right note types, so stale values get cleared
  for (const r of schema.relations) for (const n of notes) if (n.type === r.to) auto.get(n)[r.auto] ??= []
  for (const d of schema.derived ?? []) for (const n of notes) if (n.type === d.on) auto.get(n)[d.auto] ??= []

  for (const r of schema.relations) {
    for (const n of notes.filter((x) => x.type === r.from)) {
      for (const l of n.links[r.field] ?? []) {
        if (l.note && l.note.type === r.to) add(l.note, r.auto, n.name)
      }
    }
  }
  // Derived relations: follow each path step by step. A step is an auto_ field
  // (computed above) or a field people type (resolved links).
  const stepNames = (c, step) => (step.startsWith("auto_") ? auto.get(c)?.[step] ?? [] : (c.links[step] ?? []).map((l) => l.note?.name).filter(Boolean))
  for (const d of schema.derived ?? []) {
    const paths = d.paths ?? [d.path]
    for (const n of notes.filter((x) => x.type === d.on)) {
      for (const p of paths) {
        let current = [n]
        for (const step of p) {
          const next = []
          for (const c of current) for (const name of stepNames(c, step)) {
            const t = kb.find(name)
            if (t && !next.includes(t)) next.push(t)
          }
          current = next
        }
        for (const t of current) add(n, d.auto, t.name)
      }
    }
  }
  for (const o of auto.values()) for (const k of Object.keys(o)) o[k].sort((a, b) => a.localeCompare(b, "en", { sensitivity: "base" }))
  return auto
}

// Badges for insights: who made the statement, and where the evidence stands.
export const SOURCE_TYPES = { expert: "Expert", student: "Student", external: "External" }
export const EVIDENCE_STATUSES = { "open-for-review": "Open for expert review", "expert-reviewed": "Expert-reviewed", disputed: "Disputed" }
export const QUOTE_TYPES = { paraphrase: "Paraphrased", verbatim: "Verbatim quote" }
const badge = (group, value, labels) => {
  if (!value) return ""
  const v = String(value).trim()
  const cls = key(v).replace(/[^a-z0-9]+/g, "-")
  return `<span class="rl-badge rl-badge--${group} rl-badge--${group}-${cls}">${labels[key(v)] ?? v}</span>`
}
export const insightBadges = (d) => [badge("source", d.source_type, SOURCE_TYPES), badge("evidence", d.evidence_status, EVIDENCE_STATUSES)].filter(Boolean).join(" ")

export const wl = (name) => `[[${name}]]`
export const byName = (a, b) => a.name.localeCompare(b.name, "en", { sensitivity: "base" })
export const ofType = (kb, t) => kb.notes.filter((n) => n.type === t).sort(byName)

/** Read a "## Heading" section from a note body (first match, case-insensitive). */
export function section(body, heading) {
  const re = new RegExp(`^##\\s+${heading}\\s*$([\\s\\S]*?)(?=^##\\s|(?![\\s\\S]))`, "im")
  const m = body.match(re)
  return m ? m[1].trim() : ""
}
