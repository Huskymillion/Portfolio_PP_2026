export type Layout = "video16x9" | "grid9x16" | "timeline";

export interface Credit { label: string; names: string }

export interface Project {
  id:           string;      // internal id (displayId fallback) — anchor + media folder = slug
  displayId?:   string;      // UI-only number label; falls back to id if omitted
  slug:         string;
  name:         string;
  type:         string;
  services:     string;
  layout:       Layout;
  extra?:       Layout;
  accent:       string;
  tagline?:     string;
  description?: string;
  panelCount?:  number;
  gridCount?:   number;   // social card count; omit = default 5; 0 = don't render
  darkSection?: boolean;  // true = section bg #111, text inverted to white
  role?:          string;     // volle Rolle, im Case sichtbar
  award?:         string;     // eine Zeile, optional
  credits?:       Credit[];   // Team, getrennt von der Rolle
  gridCaptions?:  string[];   // Captions für grid-01…05, Reihenfolge = Dateinummer
}

export const PROJECTS: Project[] = [
  {
    id: "01", displayId: "01", slug: "kottur", name: "köttur", type: "own label · brand film",
    services: "creative direction + direction + design",
    layout: "video16x9", extra: "timeline", accent: "#1a1a2e",
    tagline:     "this is why. 1.618",
    description: "Streetwear that takes cut, material and print equally seriously: designed along the golden ratio, made with certified partners across Europe. The brand film is a manifesto shot on 16 mm, because a label built on craft shouldn't look digitally smooth.",
    panelCount:  5,
  },
  {
    id: "03b", displayId: "02", slug: "riders-rights", name: "riders rights", type: "labour rights campaign · syndicom",
    services: "direction + camera + edit + motion",
    layout: "video16x9", accent: "#b51c1c",
    tagline:     "when the order becomes the message",
    description: "To reach isolated Uber Eats couriers, Freundliche Grüsse registered a Zurich restaurant on the app for syndicom, and every order brought a rider to labour rights experts. Filmed undercover with real couriers, the film stays documentary and close to the people, its rhythm following the rush of the action.",
  },
  {
    id: "06", displayId: "03", slug: "kapo-bern", name: "kapo bern", type: "image campaign · cantonal police of bern",
    services: "visual concept + camera + photo + edit",
    layout: "video16x9", extra: "timeline", accent: "#0b3d91",
    tagline:     "«zum glück war die polizei zur stelle»",
    description: "Not crime, but everyday moments where the police help: a threat, a missing mother, a cycling accident. Film and photo share one perspective: a slightly low camera that keeps the people affected at the centre, not the police.",
    panelCount:  4,
  },
  { id: "10", displayId: "04", slug: "woz", name: "woz", type: "case film · woz die wochenzeitung",
    services: "direction + motion + edit + sound", layout: "video16x9", accent: "#2b2b2b",
    tagline:     "the news in the news",
    description: "WOZ placed part of its current issue as an interactive banner on zeit.de and spiegel.de: journalism inside other people's news. The case film turns it into a world of paper, gritty stop-motion and cut-outs, analogue in texture, digital in pace.",
  },
  {
    id: "03", displayId: "05", slug: "ewz", name: "ewz × ekz", type: "recruiting campaign · ewz + ekz",
    services: "film concept + camera + edit + motion",
    layout: "grid9x16", accent: "#0f3460",
    tagline:     "«komm ins team power»",
    description: "ewz and EKZ were looking for career changers to become grid electricians, social-first. A snorricam strapped to real employees at real sites keeps the view on the person, not the job, while motion and UI sounds speak the language of the feed.",
  },
  {
    id: "05", displayId: "06", slug: "schweizer-paraplegiker-stiftung", name: "schweizer paraplegiker-stiftung", type: "employer branding · six job profiles",
    services: "interview concept + camera + edit + motion",
    layout: "video16x9", extra: "timeline", accent: "#533483",
    tagline:     "the person behind the job",
    description: "Six job profiles for the Swiss Paraplegic Group, each built from half a day with one protagonist and a single interview. Documentary and unstaged, showing people with real lives, not job titles.",
    panelCount:  4,
    darkSection: true,
  },
  {
    id: "08", displayId: "07", slug: "mawave", name: "mawave", type: "social-first agency · munich",
    services: "production setup + concept + camera + edit",
    layout: "grid9x16", accent: "#3d0000",
    tagline:     "from smartphone to in-house studio",
    description: "Mawave turns brands into social content, but its own channels had no production behind them. What followed: an in-house studio with equipment, a rental system and team training, and one visual language across the agency's TikTok, Instagram and LinkedIn, its case films and the personal brand of founder Jason Modemann.",
  },
  {
    id: "02", displayId: "08", slug: "freundliche-gruesse", name: "freundliche grüsse", type: "creative agency · zürich",
    services: "concept + camera + edit + motion",
    layout: "grid9x16", accent: "#2d2d2d",
    tagline:     "more from two years at freundliche grüsse",
    description: "Two years of concept-to-final-edit production, with AI-supported workflows built in. More from that time:",
  },
  {
    /*
     * PERSONAL PROJECT — Media placement guide
     * ─────────────────────────────────────────
     * Panel images  → projects/personal/panel-01.jpg, panel-02.jpg, …
     * Social videos → projects/personal/grid-01.mp4,  grid-02.mp4,  …
     * Thumbnail     → projects/personal/thumb.jpg
     *
     * After adding files: update panelCount / gridCount to the actual file count
     * so the components render the right number of frames.
     */
    id: "09", displayId: "09", slug: "personal", name: "personal", type: "analog photos + private projects",
    services: "photography + analog + personal",
    layout: "grid9x16", extra: "timeline", accent: "#2c2c2c",
    tagline:     "analog moments + personal work",
    description: "A collection of analog photography and personal creative projects — work made for the love of it.",
    panelCount:  5,  // panel-01…panel-05 in projects/personal/
    gridCount:   5,  // grid-01…grid-05.mp4 in projects/personal/
  },
  // unpublished (published: false in content/projects/*.md)
  {
    id: "04", displayId: "05", slug: "sfv", name: "sfv", type: "Swiss Football Association",
    services: "video + motion + concept + edit",
    layout: "grid9x16", accent: "#e94560",
    tagline:     "football is more than a game",
    description: "Campaign and editorial video production for the Swiss Football Association — capturing the emotion and culture of the sport.",
  },
  {
    id: "07", displayId: "08", slug: "kfh", name: "kfh", type: "health care",
    services: "photography + concept",
    layout: "video16x9", extra: "timeline", accent: "#0a0a0a",
    tagline:     "health care, humanised",
    description: "Concept and photography work for KFH, translating a complex healthcare brand into warm, accessible visual communication.",
    panelCount:  4,
    darkSection: true,
  },
];
