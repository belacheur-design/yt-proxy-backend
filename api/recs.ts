import type { VercelRequest, VercelResponse } from '@vercel/node'
import fs from 'node:fs'
import path from 'node:path'

// Load catalog at runtime (works on Node 18/20)
const catalogPath = path.join(process.cwd(), 'data', 'recs.json')
const raw = fs.readFileSync(catalogPath, 'utf-8')
const catalog = JSON.parse(raw) as Array<{
  title: string; artist: string; mood: string; genre: string; tempo: string;
  license: string; url: string; tags?: string[];
}>

// GET /api/recs?mood=epic,orchestral&limit=8
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const qMood  = (req.query.mood  as string | undefined)?.toLowerCase() || ''
  const qGenre = (req.query.genre as string | undefined)?.toLowerCase() || ''
  const qTempo = (req.query.tempo as string | undefined)?.toLowerCase() || ''
  const limit  = Math.min(20, Math.max(1, parseInt((req.query.limit as string) || '8', 10)))

  const keys = (qMood + ' ' + qGenre + ' ' + qTempo).split(/[\\s,]+/).filter(Boolean)

  const scored = catalog
    .map((t) => {
      const hay = (t.mood + ' ' + t.genre + ' ' + (t.tags || []).join(' ')).toLowerCase()
      const match = keys.reduce((acc, k) => acc + (hay.includes(k) ? 1 : 0), 0)
      return { score: match, t }
    })
    .filter(x => keys.length === 0 ? true : x.score > 0)
    .sort((a, b) => b.score - a.score || a.t.title.localeCompare(b.t.title))
    .slice(0, limit)
    .map(x => x.t)

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
  res.status(200).json({ items: scored })
}
