#!/usr/bin/env node
// Capture screenshots of the running Expo web build for store listings.
//
// Usage:
//   1. Run `npx expo start --web --port 8081` in one terminal.
//   2. In another: `node scripts/capture-screenshots.mjs`
//   3. Screenshots land in `screenshots/`.
import { chromium, devices } from 'playwright'
import { mkdir } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'screenshots')
const URL = process.env.SOOTHE_URL || 'http://localhost:8081'

const SHOTS = [
  // [name, viewport, wait]
  ['paywall', { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true }, 1500],
  ['home', { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true }, 1500],
  ['calendar', { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true }, 1500],
  ['analytics', { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true }, 1500],
  ['settings', { width: 390, height: 844, deviceScaleFactor: 3, isMobile: true }, 1500],
  // Android
  ['paywall-android', { width: 412, height: 915, deviceScaleFactor: 2.625, isMobile: true }, 1500],
  ['home-android', { width: 412, height: 915, deviceScaleFactor: 2.625, isMobile: true }, 1500],
]

const TAB_SELECTORS = {
  home: 'a[href*="Home"]',
  calendar: 'a[href*="Calendar"]',
  analytics: 'a[href*="Analytics"]',
  settings: 'a[href*="Settings"]',
}

async function main() {
  await mkdir(OUT, { recursive: true })
  const browser = await chromium.launch()
  for (const [name, viewport, wait] of SHOTS) {
    const ctx = await browser.newContext({
      ...viewport,
      userAgent:
        viewport.isMobile
          ? devices['iPhone 14']?.userAgent ||
            'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15'
          : undefined,
    })
    const page = await ctx.newPage()
    await page.goto(URL, { waitUntil: 'networkidle' })
    await page.waitForTimeout(wait)

    if (name !== 'paywall' && name !== 'paywall-android' && TAB_SELECTORS[name]) {
      const tab = await page.$(TAB_SELECTORS[name])
      if (tab) {
        await tab.click()
        await page.waitForTimeout(800)
      }
    }

    const path = join(OUT, `${name}.png`)
    await page.screenshot({ path, fullPage: false })
    console.log(`saved ${path}`)
    await ctx.close()
  }
  await browser.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
