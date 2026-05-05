export type Layout = "video16x9" | "grid9x16" | "timeline";

export interface Project {
  id:           string;
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
}

export const PROJECTS: Project[] = [
  {
    id: "01", slug: "kottur", name: "köttur", type: "streetwear brand",
    services: "concept + creative direction + campaign",
    layout: "video16x9", extra: "timeline", accent: "#1a1a2e",
    tagline:     "a sustainable streetwear label from the allgäu",
    description: "Concept, creative direction and full campaign production for köttur — a brand built around conscious fashion and raw visual identity.",
    panelCount:  5,
  },
  {
    id: "02", slug: "freundliche-gruesse", name: "freundliche grüsse", type: "creative agency zurich",
    services: "video + motion + concept + photography + edit",
    layout: "grid9x16", accent: "#2d2d2d",
    tagline:     "zürich's creative agency for bold ideas",
    description: "Ongoing content production across video, motion and photography for one of Zurich's most distinct creative studios.",
  },
  {
    id: "03", slug: "ewz", name: "ewz", type: "energy provider",
    services: "video + motion + edit",
    layout: "grid9x16", accent: "#0f3460",
    tagline:     "energy for the city of zurich",
    description: "Video and motion work translating ewz's commitment to sustainable urban energy into compelling visual storytelling.",
  },
  {
    id: "04", slug: "sfv", name: "sfv", type: "Swiss Football Association",
    services: "video + motion + concept + edit",
    layout: "grid9x16", accent: "#e94560",
    tagline:     "football is more than a game",
    description: "Campaign and editorial video production for the Swiss Football Association — capturing the emotion and culture of the sport.",
  },
  {
    id: "05", slug: "schweizer-paraplegiker-stiftung", name: "schweizer paraplegiker stiftung", type: "healthcare",
    services: "video + concept + motion + edit",
    layout: "video16x9", extra: "timeline", accent: "#533483",
    tagline:     "support. dignity. independence.",
    description: "Sensitive and human-centred video storytelling for one of Switzerland's most important healthcare foundations.",
    panelCount:  4,
    darkSection: true,
  },
  {
    id: "06", slug: "kapo-bern", name: "kapo bern", type: "cantonal police",
    services: "video + photography + motion + edit",
    layout: "video16x9", extra: "timeline", accent: "#0b3d91",
    tagline:     "serving and protecting the canton",
    description: "Photography, video and motion production for the Cantonal Police of Bern — balancing authority with approachability.",
    panelCount:  4,
  },
  {
    id: "07", slug: "kfh", name: "kfh", type: "health care",
    services: "photography + concept",
    layout: "video16x9", extra: "timeline", accent: "#0a0a0a",
    tagline:     "health care, humanised",
    description: "Concept and photography work for KFH, translating a complex healthcare brand into warm, accessible visual communication.",
    panelCount:  4,
    darkSection: true,
  },
  {
    id: "08", slug: "mawave", name: "mawave", type: "social first agency",
    services: "video + motion + concept + photography + edit + design",
    layout: "grid9x16", accent: "#3d0000",
    tagline:     "we translate brands to social media",
    description: "As creative content producer, responsible for the full outbound visual representation and concept — translating brands into scroll-stopping social content.",
  },
  {
    /*
     * PERSONAL PROJECT — Media placement guide
     * ─────────────────────────────────────────
     * Panel images  → public/projects/09/panel-01.jpg, panel-02.jpg, …
     * Social videos → public/projects/09/grid-01.mp4,  grid-02.mp4,  …
     * Thumbnail     → public/projects/09/thumb.jpg
     *
     * After adding files: update panelCount / gridCount to the actual file count
     * so the components render the right number of frames.
     */
    id: "09", slug: "personal", name: "personal", type: "analog photos + private projects",
    services: "photography + analog + personal",
    layout: "grid9x16", extra: "timeline", accent: "#2c2c2c",
    tagline:     "analog moments + personal work",
    description: "A collection of analog photography and personal creative projects — work made for the love of it.",
    panelCount:  5,  // panel-01…panel-05 in public/projects/09/
    gridCount:   5,  // grid-01…grid-05.mp4 in public/projects/09/
  },
];
