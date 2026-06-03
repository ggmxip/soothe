# Soothe — Landing + Privacy site

A small static site that is deployed to `soothe.app` (or your chosen domain) via Vercel.

## Files

- `index.html` — landing page.
- `privacy/index.html` — privacy policy (served at `https://soothe.app/privacy/`).
- `styles.css` — shared styles.
- `vercel.json` — Vercel config (clean URLs, security headers, cache control).
- `assets/` — favicon + app icon.

## Deploy to Vercel (one-time setup)

1. Register your domain. Recommended TLDs for this app: `soothe.app`, `getsoothe.app`, `usesoothe.app`.
   - If you have a Namecheap or Name.com credit from the GitHub Student Dev Pack, use that.
   - `.app` is a real TLD operated by Google and requires HTTPS (Vercel provides it automatically).
2. Push the repo to GitHub.
3. Go to https://vercel.com/new and import the `ggmxip/soothe` repo.
4. **Root Directory** — set to `site`.
5. **Framework Preset** — leave as `Other`.
6. Click **Deploy**.
7. Once deployed, go to **Settings → Domains** and add your registered domain. Vercel will guide you through the DNS records.
8. After the domain is live, update the privacy URL in:
   - `app.json` → `extra.privacyPolicyUrl`
   - `src/screens/PaywallScreen.js` → `PRIVACY_URL`
   - `site/privacy/index.html` → canonical link
   - Submit the same URL in the Play Console and App Store Connect store listings.

## Local preview

```bash
cd site
npx serve .
```

Or any other static server.
