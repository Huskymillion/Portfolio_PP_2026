/**
 * Media routing — Cloudflare R2 CDN
 *
 * All project media is served from the R2 public bucket.
 * Drive IDs can still be used as an override for individual files
 * (paste the Drive file ID into the matching slot; leave "" to use R2).
 *
 * R2 BUCKET STRUCTURE
 * ────────────────────
 *  projects/{id}/hero.mp4
 *  projects/{id}/poster.jpg
 *  projects/{id}/thumb.jpg
 *  projects/{id}/panel-01.jpg … panel-05.jpg
 *  projects/{id}/grid-01.mp4  … grid-05.mp4
 *  projects/{id}/grid-01-thumb.jpg … grid-05-thumb.jpg
 *
 * HOW TO OVERRIDE A FILE WITH GOOGLE DRIVE
 * ─────────────────────────────────────────
 * 1. Share the file → "Anyone with the link" → copy the file ID from the URL.
 * 2. Paste the ID into the matching slot in DRIVE_IDS below.
 * 3. Leave "" to fall through to R2 (preferred for all new uploads).
 */

export const R2_BASE =
  "https://pub-0138911b93ac4d2288711fb008e069c8.r2.dev";

/** Resolve any path to a full URL. Absolute URLs are returned unchanged. */
export function mediaUrl(path: string): string {
  if (path.startsWith("http")) return path;
  return `${R2_BASE}${path.startsWith("/") ? "" : "/"}${path}`;
}

// ─── Google Drive overrides (optional) ───────────────────────────────────────

type DriveMap = Record<string, string>;

const DRIVE_IDS: Record<string, DriveMap> = {
  "01": { // köttur
    "hero": "", "poster": "", "thumb": "",
    "panel-01": "", "panel-02": "", "panel-03": "", "panel-04": "", "panel-05": "",
  },
  "02": { // freundliche grüsse
    "thumb": "",
    "grid-01": "", "grid-02": "", "grid-03": "", "grid-04": "", "grid-05": "",
    "grid-01-thumb": "", "grid-02-thumb": "", "grid-03-thumb": "", "grid-04-thumb": "", "grid-05-thumb": "",
    "panel-01": "", "panel-02": "", "panel-03": "", "panel-04": "", "panel-05": "",
  },
  "03": { // ewz
    "thumb": "",
    "grid-01": "", "grid-02": "", "grid-03": "", "grid-04": "", "grid-05": "",
    "grid-01-thumb": "", "grid-02-thumb": "", "grid-03-thumb": "", "grid-04-thumb": "", "grid-05-thumb": "",
  },
  "04": { // sfv
    "thumb": "",
    "grid-01": "", "grid-02": "", "grid-03": "", "grid-04": "", "grid-05": "",
    "grid-01-thumb": "", "grid-02-thumb": "", "grid-03-thumb": "", "grid-04-thumb": "", "grid-05-thumb": "",
  },
  "05": { // schweizer paraplegiker stiftung
    "hero": "", "poster": "", "thumb": "",
    "panel-01": "", "panel-02": "", "panel-03": "", "panel-04": "",
  },
  "06": { // kapo bern
    "hero": "", "poster": "", "thumb": "",
    "panel-01": "", "panel-02": "", "panel-03": "", "panel-04": "",
  },
  "07": { // kfh
    "hero": "", "poster": "", "thumb": "",
    "panel-01": "", "panel-02": "", "panel-03": "", "panel-04": "",
  },
  "08": { // mawave
    "thumb": "",
    "grid-01": "", "grid-02": "", "grid-03": "", "grid-04": "", "grid-05": "",
    "grid-01-thumb": "", "grid-02-thumb": "", "grid-03-thumb": "", "grid-04-thumb": "", "grid-05-thumb": "",
  },
  "09": { // personal
    "thumb": "",
    "panel-01": "", "panel-02": "", "panel-03": "", "panel-04": "", "panel-05": "",
    "grid-01": "", "grid-02": "", "grid-03": "", "grid-04": "", "grid-05": "",
    "grid-01-thumb": "", "grid-02-thumb": "", "grid-03-thumb": "", "grid-04-thumb": "", "grid-05-thumb": "",
  },
};

function driveImage(id: string) {
  return `https://lh3.googleusercontent.com/d/${id}`;
}

function driveVideo(id: string) {
  return `https://drive.google.com/uc?export=download&confirm=t&id=${id}`;
}

/** Image URL — Drive if ID set, else R2. */
export function imageUrl(projectId: string, key: string, ext = "jpg"): string {
  const id = DRIVE_IDS[projectId]?.[key];
  if (id) return driveImage(id);
  return `${R2_BASE}/projects/${projectId}/${key}.${ext}`;
}

/** Video URL — Drive if ID set, else R2. */
export function videoUrl(projectId: string, key: string): string {
  const id = DRIVE_IDS[projectId]?.[key];
  if (id) return driveVideo(id);
  return `${R2_BASE}/projects/${projectId}/${key}.mp4`;
}
