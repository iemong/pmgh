import { Page } from 'puppeteer'

const URL = 'https://github.com/iemong'
const SELECTOR = '.js-calendar-graph'
const HIDDEN_SELECTOR = '.position-sticky'

export const captureKusa = async (page: Page): Promise<string | void | Buffer> => {
    await page.goto(URL)

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
