
# YouTube Proxy + Recommendations (Vercel)

Endpoints:
- `GET /api/yt?id=VIDEO_ID` → proxies YouTube Data API v3 (uses env `YT_API_KEY`).
- `GET /api/recs?mood=epic,orchestral&limit=8` → returns royalty‑free track suggestions.

## Deploy (no CLI needed)
1) Go to https://vercel.com → New Project → Import → Upload → choose this zip.
2) After it creates, open **Project → Settings → Environment Variables** and add:

   Name: `YT_API_KEY`
   Value: your YouTube Data API v3 key

3) Deploy. Your base URL will look like:
   https://YOUR-PROJECT.vercel.app/

4) Test:
   - https://YOUR-PROJECT.vercel.app/api/yt?id=dQw4w9WgXcQ
   - https://YOUR-PROJECT.vercel.app/api/recs?mood=epic,orchestral&limit=5

— Built 2025-08-12 08:37 UTC
