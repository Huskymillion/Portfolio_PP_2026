/**
 * Media routing: Google Drive file IDs → direct URLs.
 *
 * HOW TO ADD A FILE FROM GOOGLE DRIVE
 * ─────────────────────────────────────
 * 1. Upload the file to your Drive folder.
 * 2. Right-click the file → "Share" → "Anyone with the link" → Copy link.
 * 3. The file ID is the long string after /d/ in the URL:
 *      https://drive.google.com/file/d/FILE_ID/view
 * 4. Paste that ID into the matching slot below (e.g. "hero", "panel-01").
 * 5. Leave the string empty ("") to fall back to the local /public/projects/ path.
 *
 * FILE NAMING CONVENTION (local & Drive)
 * ──────────────────────────────────────
 *  hero.mp4            fullscreen video  (video16x9 projects)
 *  poster.jpg          hero video poster (shown before play)
 *  grid-01.mp4         social card video 1  (grid9x16 projects)
 *  grid-02.mp4 … grid-05.mp4
 *  grid-01-thumb.jpg   poster for grid card 1 (optional; shown before video plays)
 *  grid-02-thumb.jpg … grid-05-thumb.jpg
 *  panel-01.jpg        timeline panel image 1  (projects with extra: "timeline")
 *  panel-02.jpg … panel-05.jpg
 *  thumb.jpg           work-index hover preview thumbnail
 *
 * NOTE ON DRIVE VIDEO STREAMING
 * ──────────────────────────────
 * Drive works for files < ~100 MB. For larger videos use Vercel Blob or
 * Cloudflare R2 and paste the CDN URL directly into videoUrl() calls.
 */

type DriveMap = Record<string, string>;

const DRIVE_IDS: Record<string, DriveMap> = {
  "01": { // köttur
    "hero":        "",
    "poster":      "",
    "thumb":       "",
    "panel-01": "", "panel-02": "", "panel-03": "", "panel-04": "", "panel-05": "",
  },
  "02": { // freundliche grüsse
    "thumb":       "",
    "grid-01": "", "grid-02": "", "grid-03": "", "grid-04": "", "grid-05": "",
    "grid-01-thumb": "", "grid-02-thumb": "", "grid-03-thumb": "", "grid-04-thumb": "", "grid-05-thumb": "",
  },
  "03": { // ewz
    "thumb":       "",
    "grid-01": "", "grid-02": "", "grid-03": "", "grid-04": "", "grid-05": "",
    "grid-01-thumb": "", "grid-02-thumb": "", "grid-03-thumb": "", "grid-04-thumb": "", "grid-05-thumb": "",
  },
  "04": { // sfv
    "thumb":       "",
    "grid-01": "", "grid-02": "", "grid-03": "", "grid-04": "", "grid-05": "",
    "grid-01-thumb": "", "grid-02-thumb": "", "grid-03-thumb": "", "grid-04-thumb": "", "grid-05-thumb": "",
  },
  "05": { // schweizer paraplegiker stiftung
    "hero":   "1s--altezqumcSlHGUB-OSu6gsH_arIcD",
    "poster": "",
    "thumb":  "",
  },
  "06": { // kapo bern
    "hero":        "",
    "poster":      "",
    "thumb":       "",
    "panel-01": "", "panel-02": "", "panel-03": "", "panel-04": "", "panel-05": "",
  },
  "07": { // kfh
    "hero":        "",
    "poster":      "",
    "thumb":       "",
    "panel-01": "", "panel-02": "", "panel-03": "", "panel-04": "", "panel-05": "",
  },
  "08": { // mawave
    "thumb":       "",
    "grid-01": "", "grid-02": "", "grid-03": "", "grid-04": "", "grid-05": "",
    "grid-01-thumb": "", "grid-02-thumb": "", "grid-03-thumb": "", "grid-04-thumb": "", "grid-05-thumb": "",
  },
};

function driveImage(id: string) {
  return `https://lh3.googleusercontent.com/d/${id}`;
}

function driveVideo(id: string) {
  return `https://drive.google.com/uc?export=download&id=${id}`;
}

/** Image URL — Drive if ID exists, else local public path. */
export function imageUrl(projectId: string, key: string, ext = "jpg"): string {
  const id = DRIVE_IDS[projectId]?.[key];
  if (id) return driveImage(id);
  return `/projects/${projectId}/${key}.${ext}`;
}

/** Video URL — Drive if ID exists, else local public path. */
export function videoUrl(projectId: string, key: string): string {
  const id = DRIVE_IDS[projectId]?.[key];
  if (id) return driveVideo(id);
  return `/projects/${projectId}/${key}.mp4`;
}
