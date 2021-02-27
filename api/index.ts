import type { NowRequest, NowResponse } from '@vercel/node'
import { captureKusa } from './libs/captureKusa'

process.env.TZ = 'Asia/Tokyo'

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { user } = req.query
    try {
        if (user === 'favicon.ico') throw new Error('request from favicon')
        const file = await captureKusa(String(user) || '')

        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0)
        tomorrow.setMinutes(0)
        tomorrow.setSeconds(0)
        tomorrow.setMilliseconds(0)

        res.statusCode = 200
        res.setHeader('Content-Type', 'image/jpeg')
        res.setHeader('Cache-Control', 'public, immutable, no-transform, s-maxage=86400, max-age=86400')
        res.setHeader('Expires', tomorrow.getTime())
        res.end(file)
    } catch (e) {
        res.statusCode = 500
        res.setHeader('Content-Type', 'text/html')

        res.end('<h1>Internal Server Error</h1><p>Sorry, there was a problem.</p>')
        console.error(e)
    }
}
