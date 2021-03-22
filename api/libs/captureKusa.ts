import puppeteer from 'puppeteer-core'
import chrome from 'chrome-aws-lambda'

const isDev = !process.env.AWS_REGION

const BASE_URL = 'https://github.com/'
const SELECTOR = '.js-calendar-graph'
const HIDDEN_SELECTOR = '.position-sticky'

export const captureKusa = async (userName: string): Promise<string | void | Buffer> => {
    const browser = await puppeteer.launch(
        isDev
            ? {
                  args: [],
                  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
                  headless: true,
              }
            : {
                  args: chrome.args,
                  executablePath: await chrome.executablePath,
                  headless: chrome.headless,
              },
    )
    const page = await browser.newPage()
    await page.goto(`${BASE_URL}${userName}`, { waitUntil: 'domcontentloaded' })

    await page.setViewport({ width: 1980, height: 4000 })

    await page.waitForSelector(SELECTOR)
    await page.waitForSelector(HIDDEN_SELECTOR)

    await page.evaluate((s) => {
        const elms = document.querySelectorAll(s)
        Array.from(elms).forEach((e) => {
            e.style.opacity = '0'
        })
        console.log('run')
    }, HIDDEN_SELECTOR)

    const clip = await page.evaluate((s) => {
        const elm: HTMLElement = document.querySelector(s)
        const { width, height, top: y, left: x } = elm.getBoundingClientRect()
        return {
            width,
            height,
            x,
            y,
        }
    }, SELECTOR)

    return page.screenshot({ clip })
}
