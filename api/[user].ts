import type { NowRequest, NowResponse } from '@vercel/node'
import { captureKusa } from './libs/captureKusa'

process.env.TZ = 'Asia/Tokyo'

export default async (req: NowRequest, res: NowResponse): Promise<void> => {
    const { user } = req.query
    const userParams = new URLSearchParams(String(user).replace(/^.*?(\?|$)/, '$1'))
    const userName = userParams.get('id')
    try {
        const file = await captureKusa(userName || '')

        const tomorrow = new Date()
        tomorrow.setDate(tomorrow.getDate() + 1)
        tomorrow.setHours(0)
        tomorrow.setMinutes(0)
        tomorrow.setSeconds(0)
        tomorrow.setMilliseconds(0)
        console.log(`[LOG] tomorrow is ${tomorrow.toString()}`)

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
