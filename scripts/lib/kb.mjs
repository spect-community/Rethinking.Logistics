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
    // `tagged`: collect notes of one type whose tags start with a prefix built from this note's fields
    if (d.tagged) {
      for (const n of notes.filter((x) => x.type === d.on)) {
        const prefix = d.tagged.prefix.replace(/\{(\w+)\}/g, (_, k) => String(n.data[k] ?? ""))
        for (const t of notes.filter((x) => x.type === d.tagged.type))
          if ((t.data.tags ?? []).some((tag) => String(tag).startsWith(prefix))) add(n, d.auto, t.name)
      }
      continue
    }
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

// ── Page tokens ──────────────────────────────────────────────────────────────
// Hand-written pages (e.g. the home page) can use tokens that the website build fills in:
//   {{count:<type>}}   number of published notes of that type, e.g. {{count:case-study}}
//   {{schema-diagram}} a radial diagram (inline SVG) of all types and relations in schema/schema.yml
// {{repo}}, {{contact}} and {{project}} are filled from site.config.json by build-site.mjs.
export const SITE_TOKENS = ["repo", "contact", "project"]
export const tokensIn = (text) => [...String(text).matchAll(/\{\{([^{}]+)\}\}/g)].map((m) => m[1].trim())
export const knownToken = (schema, t) => SITE_TOKENS.includes(t) || t === "schema-diagram" || (/^count:/.test(t) && t.slice(6) in schema.types)

export function schemaDiagram(kb) {
  // Radial diagram: every type on a ring (in schema order), size by number of notes,
  // every relation as a curved arrow labelled with its verb. Colours follow the site theme.
  const { schema } = kb
  const types = Object.keys(schema.types)
  const S = 860, C = S / 2, R = 285
  const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;")
  const node = {}
  types.forEach((t, i) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / types.length
    const n = ofType(kb, t).length
    node[t] = { x: C + R * Math.cos(a), y: C + R * Math.sin(a), a, n, r: 24 + 1.35 * Math.sqrt(n) }
  })
  const edges = schema.relations.map((r) => ({ from: r.from, to: r.to, verb: r.verb ?? r.label.toLowerCase(), dashed: false }))
  for (const dr of schema.derived ?? []) if (dr.tagged) edges.push({ from: dr.tagged.type, to: dr.on, verb: dr.verb ?? "tagged with", dashed: true })
  const f = (v) => v.toFixed(1)
  const cls = (t) => t.replace(/[^a-z0-9]/gi, "-")
  const out = [`<figure class="rl-schema"><svg viewBox="0 0 ${S} ${S}" role="img" aria-label="Diagram of all note types and the links between them" xmlns="http://www.w3.org/2000/svg">`,
    `<defs><marker id="rl-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" style="fill:var(--gray)"/></marker></defs>`]
  for (const e of edges) {
    const a = node[e.from], b = node[e.to]
    if (!a || !b) continue
    const mx = (a.x + b.x) / 2, my = (a.y + b.y) / 2
    const cx = C + (mx - C) * 0.35, cy = C + (my - C) * 0.35
    const cut = (p, r) => { const dx = cx - p.x, dy = cy - p.y, d = Math.hypot(dx, dy) || 1; return [p.x + (dx / d) * r, p.y + (dy / d) * r] }
    const [x1, y1] = cut(a, a.r + 2), [x2, y2] = cut(b, b.r + 6)
    const lx = 0.25 * x1 + 0.5 * cx + 0.25 * x2, ly = 0.25 * y1 + 0.5 * cy + 0.25 * y2
    const title = `${schema.types[e.from].plural} ${e.verb} ${schema.types[e.to].plural.toLowerCase()}`
    out.push(`<g class="rl-edge rl-e-${cls(e.from)} rl-e-${cls(e.to)}"><title>${esc(title)}</title><path d="M${f(x1)},${f(y1)} Q${f(cx)},${f(cy)} ${f(x2)},${f(y2)}" marker-end="url(#rl-arrow)" style="fill:none;stroke:var(--gray);stroke-width:1.4${e.dashed ? ";stroke-dasharray:5 4" : ""}"/><text x="${f(lx)}" y="${f(ly)}" text-anchor="middle" dominant-baseline="middle" style="font-size:12px;fill:var(--darkgray);paint-order:stroke;stroke:var(--light);stroke-width:4px">${esc(e.verb)}</text></g>`)
  }
  for (const t of types) {
    const p = node[t], d = schema.types[t]
    const lr = p.r + 16, tx = p.x + Math.cos(p.a) * lr, ty = p.y + Math.sin(p.a) * lr
    const anchor = Math.abs(Math.cos(p.a)) < 0.3 ? "middle" : Math.cos(p.a) > 0 ? "start" : "end"
    const base = Math.sin(p.a) > 0.5 ? "hanging" : Math.sin(p.a) < -0.5 ? "auto" : "middle"
    out.push(`<g class="rl-node rl-n-${cls(t)}"><title>${esc(`${d.plural}: ${p.n} — ${d.description}`)}</title><circle cx="${f(p.x)}" cy="${f(p.y)}" r="${f(p.r)}" style="fill:var(--highlight);stroke:var(--secondary);stroke-width:2"/><text x="${f(p.x)}" y="${f(p.y)}" text-anchor="middle" dominant-baseline="central" style="font-size:15px;font-weight:700;fill:var(--secondary)">${p.n}</text><text x="${f(tx)}" y="${f(ty)}" text-anchor="${anchor}" dominant-baseline="${base}" style="font-size:16px;font-weight:600;fill:var(--dark)">${esc(d.plural)}</text></g>`)
  }
  // labels show on hover; hovering a type highlights its links
  const css = [".rl-schema .rl-edge text{opacity:0;transition:opacity .15s}", ".rl-schema .rl-edge,.rl-schema .rl-node{transition:opacity .15s}", ".rl-schema .rl-edge:hover text{opacity:1}", ".rl-schema .rl-node{cursor:default}",
    ...types.map((t) => `.rl-schema svg:has(.rl-n-${cls(t)}:hover) .rl-edge:not(.rl-e-${cls(t)}){opacity:.12}.rl-schema svg:has(.rl-n-${cls(t)}:hover) .rl-e-${cls(t)} text{opacity:1}.rl-schema svg:has(.rl-n-${cls(t)}:hover) .rl-e-${cls(t)} path{stroke:var(--secondary)}`)]
  out.push(`<style>${css.join("")}</style></svg><figcaption>Point at a type to see its links.</figcaption></figure>`)
  return out.join("")
}

export function fillTokens(kb, text) {
  return String(text).replace(/\{\{([^{}]+)\}\}/g, (m, raw) => {
    const t = raw.trim()
    if (t === "schema-diagram") return schemaDiagram(kb)
    if (/^count:/.test(t) && t.slice(6) in kb.schema.types) return String(ofType(kb, t.slice(6)).length)
    return m
  })
}
