import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export interface ProjectData {
  title:       string;
  slug:        string;
  year:        number;
  category:    string;
  client:      string;
  accent:      string;
  layout:      "video16x9" | "grid9x16";
  hasTimeline: boolean;
  coverImage?: string;
  services:    string;
  description: string;
  tags?:       string[];
  featured:    boolean;
  published:   boolean;
  media?:      { type: "image" | "video"; file: string; caption?: string }[];
}

export interface ClientData {
  name:      string;
  logo?:     string;
  url?:      string;
  industry?: string;
  order:     number;
}

export interface HeroSettings {
  leftWords:  string[];
  rightWords: string[];
  reelUrl?:   string;
}

export interface AboutSettings {
  headline: string;
  bio:      string;
  location: string;
  email:    string;
}

export interface ContactSettings {
  email:     string;
  phone:     string;
  instagram: string;
  linkedin:  string;
}

function readDir<T>(subdir: string): T[] {
  const dir = path.join(contentDir, subdir);
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((f) => f.endsWith(".md"))
    .map((file) => {
      const raw = fs.readFileSync(path.join(dir, file), "utf8");
      return matter(raw).data as T;
    });
}

export function getProjects(): ProjectData[] {
  return readDir<ProjectData>("projects")
    .filter((p) => p.published !== false)
    .sort((a, b) => b.year - a.year);
}

export function getClients(): ClientData[] {
  return readDir<ClientData>("clients").sort(
    (a, b) => (a.order ?? 99) - (b.order ?? 99)
  );
}

export function getSiteSettings<T>(name: string): T | null {
  const file = path.join(contentDir, "settings", `${name}.md`);
  if (!fs.existsSync(file)) return null;
  const raw = fs.readFileSync(file, "utf8");
  return matter(raw).data as T;
}
