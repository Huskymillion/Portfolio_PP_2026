import fs   from "fs";
import path from "path";
import matter from "gray-matter";
import { PROJECTS, type Project } from "./projects";

// Maps CMS slug (filename without .md) → static project id
const SLUG_TO_ID: Record<string, string> = {
  "kottur":                       "01",
  "freundliche-gruesse":          "02",
  "ewz":                          "03",
  "sfv":                          "04",
  "schweizer-paraplegiker-stiftung": "05",
  "kapo-bern":                    "06",
  "kfh":                          "07",
  "mawave":                       "08",
};

export async function getProjectsFromCMS(): Promise<Project[]> {
  const dir = path.join(process.cwd(), "content", "projects");
  if (!fs.existsSync(dir)) return PROJECTS;

  // Read all markdown files into a slug → frontmatter map
  const cmsMap = new Map<string, Record<string, unknown>>();
  for (const file of fs.readdirSync(dir).filter((f) => f.endsWith(".md"))) {
    const slug = file.replace(/\.md$/, "");
    const raw  = fs.readFileSync(path.join(dir, file), "utf8");
    cmsMap.set(slug, matter(raw).data as Record<string, unknown>);
  }

  return PROJECTS
    .filter((p) => {
      const data = cmsMap.get(p.slug);
      return !data || data.published !== false;
    })
    .map((p) => {
      const data = cmsMap.get(p.slug);
      if (!data) return p;
      return {
        ...p,
        name:        (data.title        as string  | undefined) ?? p.name,
        accent:      (data.accent       as string  | undefined) ?? p.accent,
        layout:      (data.layout       as Project["layout"] | undefined) ?? p.layout,
        extra:       data.hasTimeline   ? ("timeline" as const) : p.extra,
        services:    (data.services     as string  | undefined) ?? p.services,
        tagline:     (data.tagline      as string  | undefined) ?? p.tagline,
        description: (data.description  as string  | undefined) ?? p.description,
      };
    });
}
