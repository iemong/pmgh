import puppeteer from 'puppeteer'
import { captureKusa } from './libs/captureKusa'
import { promises as fs } from 'fs'

const main = async () => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()

    const file = await captureKusa(page).catch((e) => {
        console.error(e)
        return ''
    })

    await fs.writeFile('kusa.png', file as string)

    await browser.close()
}

main()
