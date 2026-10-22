#!/usr/bin/env node
/**
 * Generates content/video-meta.json for the VideoObject JSON-LD (lib/schema.ts).
 *
 * For every published project with layout "video16x9" (frontmatter in content/projects/*.md):
 *  - duration   → ffprobe on <R2_BASE>/projects/<slug>/hero.mp4, as ISO 8601 (PT1M51S)
 *  - uploadDate → Last-Modified header of the same file (YYYY-MM-DD)
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

function isoDuration(seconds) {
  const total = Math.round(seconds);
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  return `PT${h ? `${h}H` : ""}${m ? `${m}M` : ""}${s || (!h && !m) ? `${s}S` : ""}`;
}

const dir = path.join(root, "content/projects");
const out = {};
const missing = [];

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md")).sort()) {
  const slug = file.replace(/\.md$/, "");
  const data = matter(fs.readFileSync(path.join(dir, file), "utf8")).data;
  if (data.published === false || data.layout !== "video16x9") continue;

  const url = `${R2_BASE}/projects/${slug}/hero.mp4`;
  const head = await fetch(url, { method: "HEAD" });
  if (!head.ok) { missing.push(`${slug} (HTTP ${head.status})`); continue; }

  const lastModified = head.headers.get("last-modified");
  const raw = execFileSync(FFPROBE, ["-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", url], { encoding: "utf8" }).trim();
  const seconds = Number(raw);
  if (!lastModified || !Number.isFinite(seconds)) { missing.push(`${slug} (no duration/Last-Modified)`); continue; }

  out[slug] = {
    duration:   isoDuration(seconds),
    uploadDate: new Date(lastModified).toISOString().slice(0, 10),
  };
  console.log(`${slug.padEnd(34)} ${raw.padStart(12)} s → ${out[slug].duration}  ${out[slug].uploadDate}`);
}

fs.writeFileSync(path.join(root, "content/video-meta.json"), JSON.stringify(out, null, 2) + "\n");
console.log(`\nwrote content/video-meta.json (${Object.keys(out).length} entries)`);
if (missing.length) console.log(`missing: ${missing.join(", ")}`);
