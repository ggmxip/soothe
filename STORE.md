# Store copy for Soothe v1.1.0

Copy these directly into the Play Console and App Store Connect store listings.

---

## Google Play Console

### App name (30 char limit)
```
Soothe
```

### Short description (80 char limit)
```
A private, on-device tracker. No accounts. No ads. One-time 4.99 USD unlock.
```

### Full description (4000 char limit)
```
Soothe is a private, on-device tracker for daily habits and money spent. Mindful
logging, calm analytics, zero noise.

WHAT IT DOES
- Log today's count and total cost in one tap.
- Calendar view of every day you've tracked, with monthly totals.
- Yearly breakdown and a projection of where you're heading.
- Multi-currency (INR, USD) with localised formatting.

WHY IT'S DIFFERENT
Most habit apps require an account, want your email, and ship your data to
third-party analytics. Soothe is the opposite: open, log, done. No accounts.
No ads. No servers. Every number lives in local storage on your device.

PRIVACY FIRST
- No account required.
- No data leaves your device.
- No analytics SDKs, no crash reporters, no ad networks.
- Uninstall = delete everything.
Full policy: https://soothe.app/privacy

ONE-TIME PURCHASE
4.99 USD unlocks the app forever, on all your devices. No subscription, no
in-app upsells, no "Pro" tier. Restore your purchase on any device with
your store account.

BUILT OPEN
Soothe is open source. Inspect every line at github.com/ggmxip/soothe.
```

### Screenshots (upload as PNG or JPEG, min 320px, max 3840px)
Recommended sizes (Play will scale):
- Phone: 1080 x 1920 (or 1080 x 2400 for modern devices)
- 7-inch tablet: 1200 x 1920
- 10-inch tablet: 1920 x 1200

Minimum 4 phone screenshots, 8 recommended. Suggested screens:
1. Home (empty state)
2. Home (after a few logs)
3. Calendar (current month)
4. Analytics (year projection)
5. Settings (showing Pro status)
6. Paywall (first-launch)

### Feature graphic (1024 x 500)
Required. A wide banner showing the app name, tagline, and a hero screenshot.

### App icon (512 x 512)
Required. Use the existing `assets/icon.png` (1024 x 1024 source) — Play will
downscale.

### Categorisation
- App category: Health & Fitness
- Tags: habit tracker, expense, wellness, finance
- Content rating: complete the IARC questionnaire.
  - Does the app contain user-generated content? No.
  - Does the app share user location? No.
  - Target age: 18+ recommended for safety given the subject matter.
- Target audience: Not for children.

### Data safety
- Data collected: None.
- Data shared with third parties: None.
- App collects or shares any of the required user data types: No.
- All answers: "No" / "Not collected".
- Data is encrypted in transit: N/A (no data leaves device).
- Users can request that data is deleted: N/A (no data collected).
- Independent security review: No (small project).

### Pricing
- App is free to install.
- Contains in-app purchases: Yes.
- One product: `soothe_lifetime` at 4.99 USD, non-consumable.

---

## App Store Connect

### App name (30 char limit)
```
Soothe
```

### Subtitle (30 char limit)
```
Private habit + spend log
```

### Promotional text (170 char limit)
Can be updated without a new app submission. Suggested:
```
A private, on-device tracker for daily habits and money spent. No accounts.
No ads. No servers. One-time 4.99 USD unlocks everything forever.
```

### Keywords (100 char limit, comma-separated)
```
habit,tracker,expense,wellness,mindful,offline,private,no ads,simple,daily
```

> Note: avoid the words `smoke`, `smoking`, `cigarette`, `vape`, `nicotine` in
> keywords. Apple's ASO algorithm has historically penalised apps with those
> terms, and Apple's review (§1.4.3) treats them as restricted content even
> for tracker apps. The "wellness" + "habit" framing gets you through review.

### Description (up to 4000 chars)
Same as the Play Store long description above.

### What's new in this version
```
First public release.

- Home: one-tap daily counter with running total.
- Calendar: month grid with per-day counts and monthly totals.
- Analytics: yearly breakdown and year-end projection.
- Settings: currency, default price, Pro status, restore, clear data.
- One-time 4.99 USD unlock, no subscription.
- 100% on-device. No accounts. No ads. No servers.
```

### Support URL
```
https://soothe.app
```

### Marketing URL (optional)
```
https://soothe.app
```

### Privacy policy URL
```
https://soothe.app/privacy
```

### Screenshots
- 6.7" display (iPhone 15 Pro Max): 1290 x 2796
- 6.5" display (iPhone 11 Pro Max): 1242 x 2688
- 5.5" display (iPhone 8 Plus): 1242 x 2208
- 12.9" iPad Pro (3rd gen): 2048 x 2732

Minimum 3, up to 10 per device size. iPhone 6.7" alone usually gets through
review.

### App icon (1024 x 1024)
Use `assets/icon.png` (1024 x 1024).

### Age rating
- Apple: 17+ (unrestricted web access would warrant 17+, but our app has no
  web access, so 12+ or 4+ would be defensible. Choose 17+ to be safe given
  the subject matter — Apple's reviewers are more comfortable with this.)
- Actually: complete the age questionnaire honestly. The app has no harmful
  content. Expect 4+ or 9+.

### Pricing
- Price: Free.
- In-App Purchases: one product.
  - Reference name: Soothe Lifetime
  - Product ID: soothe_lifetime
  - Type: Non-Consumable
  - Price: 4.99 USD (price tier 4)
  - Review screenshot: upload a screenshot of the paywall for the reviewer.

### Privacy labels (App Store Connect)
- Data Not Collected.
- Data Not Linked to You.
- Data Not Used to Track You.
- All categories: "Data not collected".

The in-app purchase is processed by Apple under their privacy policy, not
ours. Apple's purchase flow does not count as "data linked to you" for the
purpose of our app's privacy label.

---

## Pre-submission checklist

### Google Play
- [ ] Google Play Console account created, 25 USD paid, identity verified.
- [ ] App created, package name matches `com.soothe.app`.
- [ ] One-time product `soothe_lifetime` created at 4.99 USD, activated.
- [ ] Internal testing track created, build uploaded, tested on a real device.
- [ ] All Data Safety questions answered.
- [ ] IARC content rating completed.
- [ ] Target audience + content classification completed.
- [ ] All store listing fields filled (icon, feature graphic, screenshots, copy).
- [ ] Privacy policy URL resolves and is reachable from a browser.
- [ ] Promoted from internal testing to closed testing, then to production.
- [ ] Staged rollout at 5% for 24h, then 100%.

### Apple App Store
- [ ] Apple Developer Program enrolled, 99 USD/year paid.
- [ ] Bundle ID `com.soothe.app` registered in Certificates, Identifiers & Profiles.
- [ ] App Store Connect record created.
- [ ] Non-consumable in-app purchase `soothe_lifetime` created at 4.99 USD.
- [ ] Build uploaded via EAS / Xcode / Transporter.
- [ ] TestFlight internal testing passed on a real device, including IAP.
- [ ] All store listing fields filled (icon, screenshots, copy, URLs).
- [ ] Age rating completed.
- [ ] Privacy labels completed.
- [ ] App Review information: demo account (N/A — no account), contact info.
- [ ] Submit for review.
