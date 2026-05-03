export type Layout = "video16x9" | "grid9x16" | "timeline";

export interface Project {
  id:       string;
  name:     string;
  type:     string;
  services: string;
  layout:   Layout;
  extra?:   Layout;
  accent:   string;
}

export const PROJECTS: Project[] = [
  { id: "01", name: "köttur",                         type: "streetwear brand",           services: "concept + creative direction + campaign",                    layout: "video16x9", extra: "timeline",  accent: "#1a1a2e" },
  { id: "02", name: "freundliche grüsse",              type: "creative agency zurich",     services: "video + motion + concept + photography + edit",              layout: "grid9x16",                     accent: "#2d2d2d" },
  { id: "03", name: "ewz",                             type: "energy provider",            services: "video + motion + edit",                                      layout: "grid9x16",                     accent: "#0f3460" },
  { id: "04", name: "sfv",                             type: "Swiss Football Association", services: "video + motion + concept + edit",                            layout: "grid9x16",                     accent: "#e94560" },
  { id: "05", name: "schweizer paraplegiker stiftung", type: "healthcare",                 services: "video + concept + motion + edit",                            layout: "video16x9",                    accent: "#533483" },
  { id: "06", name: "kapo bern",                       type: "cantonal police",            services: "video + photography + motion + edit",                        layout: "video16x9", extra: "timeline", accent: "#0b3d91" },
  { id: "07", name: "kfh",                             type: "health care",                services: "photography + concept",                                      layout: "video16x9", extra: "timeline", accent: "#1b4332" },
  { id: "08", name: "mawave",                          type: "social first agency",        services: "video + motion + concept + photography + edit + design",     layout: "grid9x16",                     accent: "#3d0000" },
];
