import type { VercelRequest, VercelResponse } from '@vercel/node'

// GET /api/yt?id=VIDEO_ID
export default async function handler(req: VercelRequest, res: VercelResponse) {
  try {
    const id = (req.query.id as string) || ''
    if (!id) return res.status(400).json({ error: 'Missing id' })

    const key = process.env.YT_API_KEY
    if (!key) return res.status(500).json({ error: 'Server not configured: missing YT_API_KEY' })

    const parts = ['snippet','contentDetails','status','topicDetails']
    const url = `https://www.googleapis.com/youtube/v3/videos?key=${key}&id=${encodeURIComponent(id)}&part=${parts.join(',')}`
    const upstream = await fetch(url)
    const data = await upstream.json()

    res.setHeader('Cache-Control', 's-maxage=300, stale-while-revalidate=600')
    res.status(upstream.status).json(data)
  } catch (e:any) {
    res.status(500).json({ error: e?.message || 'Unknown error' })
  }
}