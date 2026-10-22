#!/usr/bin/env node
/**
 * Generates content/video-meta.json for the VideoObject JSON-LD (lib/schema.ts).
 *
 * For every published project with layout "video16x9" (frontmatter in content/projects/*.md):
 *  - duration   → ffprobe on <R2_BASE>/projects/<slug>/hero.mp4, as ISO 8601 (PT1M51S)
 *  - uploadDate → Last-Modified header (YYYY-MM-DD) of the original upload: for projects
 *                 moved in the slug migration (Briefing A5, 1a) the old numeric folder,
 *                 since the slug folders were created by copying; otherwise the slug folder
 * An uploadDate already in content/video-meta.json is kept (fixed once written).
 * Missing files are skipped and reported — values are never estimated.
 *
 * Usage: node scripts/video-meta.mjs   (needs ffprobe on PATH, or FFPROBE=/path/to/ffprobe)
 */
import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";
import matter from "gray-matter";

const root = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const FFPROBE = process.env.FFPROBE || "ffprobe";

const mediaSrc = fs.readFileSync(path.join(root, "lib/media.ts"), "utf8");
const R2_BASE = mediaSrc.match(/export const R2_BASE\s*=\s*"([^"]+)"/)[1];

/** slug → numeric R2 folder from before the slug migration (original upload dates) */
const LEGACY_FOLDER = {
  "kottur": "01", "freundliche-gruesse": "02", "ewz": "03", "riders-rights": "03b", "sfv": "04",
  "schweizer-paraplegiker-stiftung": "05", "kapo-bern": "06", "kfh": "07", "mawave": "08", "personal": "09",
};

async function lastModified(folder) {
  const res = await fetch(`${R2_BASE}/projects/${folder}/hero.mp4`, { method: "HEAD" });
  return res.ok ? res.headers.get("last-modified") : null;
}

function isoDuration(seconds) {
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s || (!h && !m) ? `${s}S` : ""}`;
}

const dir = path.join(root, "content/projects");
const metaPath = path.join(root, "content/video-meta.json");
const existing = fs.existsSync(metaPath) ? JSON.parse(fs.readFileSync(metaPath, "utf8")) : {};
const out = {};
const missing = [];

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
  const slug = file.replace(/\.md$/, "");
  const data = matter(fs.readFileSync(path.join(dir, file), "utf8")).data;
  if (data.published === false || data.layout !== "video16x9") continue;

  const url = `${R2_BASE}/projects/${slug}/hero.mp4`;
  const head = await fetch(url, { method: "HEAD" });
  if (!head.ok) { missing.push(`${slug} (HTTP ${head.status})`); continue; }

  const legacy = LEGACY_FOLDER[slug];
  const uploaded = (legacy && await lastModified(legacy)) || head.headers.get("last-modified");
  const raw = execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", url], { encoding: "utf8" }).trim();
  const seconds = Number(raw);
  if (!uploaded || !Number.isFinite(seconds)) { missing.push(`${slug} (no duration/Last-Modified)`); continue; }

  out[slug] = {
    duration:   isoDuration(seconds),
    uploadDate: existing[slug]?.uploadDate ?? new Date(uploaded).toISOString().slice(0, 10),
  };
  console.log(`${slug.padEnd(34)} ${raw.padStart(12)} s → ${out[slug].duration}  ${out[slug].uploadDate}`);
}

fs.writeFileSync(metaPath, JSON.stringify(out, null, 2) + "\n");
console.log(`\nwrote content/video-meta.json (${Object.keys(out).length} entries)`);
if (missing.length) console.log(`missing: ${missing.join(", ")}`);
