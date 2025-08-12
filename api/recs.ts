import type { VercelRequest, VercelResponse } from '@vercel/node'
import catalog from '../data/recs.json' assert { type: 'json' }

// GET /api/recs?mood=epic,orchestral&limit=8
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const qMood = (req.query.mood as string | undefined)?.toLowerCase() || ''
  const qGenre = (req.query.genre as string | undefined)?.toLowerCase() || ''
  const qTempo = (req.query.tempo as string | undefined)?.toLowerCase() || ''
  const limit = Math.min(20, Math.max(1, parseInt((req.query.limit as string) || '8', 10)))

  const keys = (qMood + ' ' + qGenre + ' ' + qTempo).split(/[\s,]+/).filter(Boolean)

  const scored = catalog.map((t:any) => {
    const hay = (t.mood + ' ' + t.genre + ' ' + (t.tags||[]).join(' ')).toLowerCase()
    const match = keys.reduce((acc,k)=> acc + (hay.includes(k) ? 1 : 0), 0)
    return { score: match, t }
  }).filter((x:any) => keys.length === 0 ? true : x.score > 0)
    .sort((a:any,b:any)=> b.score - a.score || a.t.title.localeCompare(b.t.title))
    .slice(0, limit)
    .map((x:any) => x.t)

  res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
  res.status(200).json({ items: scored })
}