# Helpers

## capture-screenshots.mjs

Captures the running Expo web build at iOS and Android viewport sizes, ready
for store listings.

Requires Playwright as a dev dependency:

```bash
npm install --save-dev playwright
npx playwright install chromium
```

Then:

```bash
# 1. In one terminal
npx expo start --web --port 8081

# 2. In another
node scripts/capture-screenshots.mjs
```

Screenshots are written to `screenshots/` at the root of the repo.
