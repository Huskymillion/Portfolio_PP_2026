# huskymillion.com — Portfolio Pascal Pfohl
Stack: Next.js 16, React 19, TypeScript, Decap CMS, Cloudflare + R2 (media under `projects/<slug>/`).
Dev: `npm install` → `npm run dev` → http://localhost:3000
Content: `content/` (Markdown/JSON), editable via Decap CMS at `/admin` (config: `public/admin/config.yml`).
Video metadata for JSON-LD: `node scripts/video-meta.mjs` → `content/video-meta.json` (needs `ffprobe`).
