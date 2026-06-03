# Deployment guide — Soothe v1.1.0

This walks through every action you need to take between today and the app being
live on the Play Store and App Store, with the Product Hunt launch at the end.

The code is already on `master` and ready to build. The remaining work is
mostly accounts, registry, store consoles, and review wait time.

## 1. Register your domain (Day 1)

Recommended order, since `.app` TLDs are real and look right for this product:

1. Try to register `soothe.app` at Namecheap or Name.com (you have credits for
   both via GitHub Student Dev Pack). If taken, fall back to:
   - `getsoothe.app`
   - `usesoothe.app`
   - `sootheapp.app`
2. Use Vercel for hosting (free tier, instant custom-domain, free SSL).
   Save the DigitalOcean $200 credit for a later phase if you add a backend.

## 2. Deploy the site to Vercel (Day 1, after domain)

1. Go to https://vercel.com/new and import `ggmxip/soothe`.
2. Set **Root Directory** to `site`.
3. Leave framework preset as `Other`.
4. Click **Deploy**.
5. After the first deploy, go to **Settings → Domains** → add the registered
   domain. Vercel will give you the DNS records to add at your registrar.
6. Verify `https://soothe.app` and `https://soothe.app/privacy/` both load.
7. Update the live URLs in:
   - `app.json` → `extra.privacyPolicyUrl`
   - `src/screens/PaywallScreen.js` → `PRIVACY_URL`
   - `site/privacy/index.html` → `<link rel="canonical">`

The site uses the same dark + red theme as the app, so it looks like a
natural extension of the product.

## 3. Register developer accounts (Day 1, runs in parallel)

### Google Play Console
- URL: https://play.google.com/console
- Cost: 25 USD one-time.
- Time: 24-48 hours for identity verification (you'll need a bank account
  and government ID).
- Required for: publishing the Android app.

### Apple Developer Program
- URL: https://developer.apple.com/programs/enroll
- Cost: 99 USD/year.
- Time: 24-48 hours for approval.
- Required for: publishing the iOS app, and even for installing a
  TestFlight build on your own device.

## 4. Create the in-app purchase product (Day 2)

### Google Play
1. Play Console → your app → Monetize → Products → In-app products.
2. Create managed product with product ID `soothe_lifetime`, price 4.99 USD.
3. Activate the product.

### App Store Connect
1. App Store Connect → your app → In-App Purchases.
2. Create a non-consumable with reference name "Soothe Lifetime",
   product ID `soothe_lifetime`, price 4.99 USD (price tier 4).
3. Add a review screenshot of the paywall (helps the reviewer).

## 5. Run an EAS build (Day 3)

```bash
# Android: AAB (production-signed)
eas build --platform android --profile production

# iOS: IPA (will need an Apple Distribution certificate in EAS)
eas build --platform ios --profile production
```

EAS will prompt you to log in, link the project (already linked), and
configure credentials. The first iOS build will ask you to create an Apple
Distribution certificate and provisioning profile — EAS handles that
automatically.

Build times:
- Android AAB: 10-20 minutes
- iOS IPA: 15-30 minutes

## 6. Internal testing (Day 3-4)

### Google Play
1. Play Console → your app → Testing → Internal testing.
2. Create a release from the new AAB.
3. Add yourself as a tester (use a real Gmail, not the dev account email).
4. Open the opt-in URL on your Android phone, accept, install.
5. Smoke test: open app → paywall appears → tap "Unlock for 4.99" → Google
   Play purchase dialog → confirm with a test card → app unlocks.
6. Verify Settings → Account shows "Soothe Pro" + PRO badge.
7. Test "Restore purchases" path by uninstalling and reinstalling.

### iOS TestFlight
1. App Store Connect → TestFlight tab → add the build (EAS auto-uploads if
   `eas submit` is configured, otherwise use Transporter / Xcode).
2. Add yourself as an internal tester.
3. Install TestFlight on your iPhone, accept the invite, install.
4. Sign into the sandbox tester account (App Store Connect → Users and
   Access → Sandbox Testers → create one if you haven't).
5. Repeat the same smoke test as Android.

## 7. Submit to stores (Day 4)

### Google Play
1. Promote the internal-testing release to **closed testing** (alpha or
   beta). Optional but helps with staged rollouts.
2. Promote to **production**. Fill in:
   - Release notes.
   - Rollout percentage: start at 5%.
3. Submit for review. First-time Play submissions take 3-7 days.

### App Store
1. App Store Connect → your build → select the latest.
2. Fill in version information, screenshot set, copy, URLs.
3. Submit for review. First-time App submissions take 24-48 hours.

## 8. While reviews are pending (Day 4-10)

- Polish Product Hunt assets: logo (240 x 240), gallery images (1270 x 760),
  optional 30-60 second screen recording.
- Draft the first-comment (see the plan in `STORE.md` or earlier in this
  thread for the full text).
- Pre-warm 50-100 supporters via DMs, bento, LinkedIn, indie maker
  Discords. Confirm they will upvote at 12:01 AM PT on launch day.
- Pick a **Tuesday, Wednesday, or Thursday** for the Product Hunt launch
  (best engagement windows).

## 9. Launch day (Day 7-10)

- T-0: both apps approved and live.
- T+0 (12:01 AM PT): Product Hunt goes live.
- Day of: stay online, reply to every comment, post to relevant
  communities (r/SideProject, IndieHackers, Show HN as a separate
  submission), push socials.
- Within 24 hours of Product Hunt: respond to all Play + App reviews.

## 10. Post-launch

- Add Sentry (`@sentry/react-native`) for crash monitoring.
- Plan v1.2: streaks, daily goals, CSV export, possibly a second screen
  for time-since-last-stick.
- Optional: a real landing page (the current Vercel site is a static
  one-pager — a Next.js site with a changelog blog is a good upgrade once
  you have a backend or a CMS).

## When to involve me again

- After dev accounts are created, if you want me to walk through store
  console setup.
- When a store review comes back with questions or rejections (common
  things: data safety answers, privacy policy wording, screenshots
  showing the right text).
- When the first reviews come in and you want help with responses.
- When you're ready to plan v1.2.
