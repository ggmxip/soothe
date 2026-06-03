# Changelog

All notable changes to Soothe will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-06-04

### Added

- **One-time in-app purchase** ($4.99 lifetime unlock) via `expo-iap`. Product id: `soothe_lifetime`.
- Hard paywall on first launch via the new `ProGate` wrapper. The app is fully usable after a single one-time purchase; no subscription, no Pro tier, no upsells.
- `usePro` hook that wraps `expo-iap` and persists the unlocked state locally. Validates ownership on launch by calling `getAvailablePurchases`, so a user who switches devices can restore via Settings → Restore purchases.
- New **PaywallScreen** with feature list, price card, "Unlock for $4.99", and "Restore purchases".
- New **Account** section in **Settings** showing the Pro status, a PRO badge, and a Restore button.
- Landing + privacy site under `site/`, ready to deploy to Vercel. Privacy policy is now hosted at `soothe.app/privacy` (or whatever domain you register).
- Bumped `expo@^54.0.35` and `expo-font@^14.0.12`.

### Changed

- App is now gated on first launch by `ProGate`. Web / dev builds show a notice explaining IAP is native-only.
- Version `1.1.0` / iOS `buildNumber` 4 / Android `versionCode` 4.

## [1.0.2] - 2026-06-04

### Added

- `SafeAreaProvider` wrapping the navigator for correct insets on edge-to-edge devices.
- Custom in-app confirmation modal for **Clear all data** (replaces the native `Alert`).
- GitHub issue templates, contribution guide, privacy policy, MIT license, README.

### Changed

- `useStorage.clearAllData` now logs failures instead of swallowing them silently.
- `useStorage.refresh` now clears the in-memory store when no data exists on disk.
- `HomeScreen` syncs local counter / price input with the loaded entry to avoid stale state on focus.
- Bumped `version` and `versionCode` to 1.0.2 / 3.
- Added Expo plugin config: EAS project ID, owner, and `infoPlist` privacy entries.

## [1.0.0] - 2026-05

### Added

- Initial public release.
- **Home** — daily counter, price per stick, today's total.
- **Calendar** — month grid with per-day counts and monthly totals.
- **Analytics** — yearly breakdown and year-end projection.
- **Settings** — currency (INR / USD), default price, clear all data.
- AsyncStorage-backed persistence. No backend, no accounts, no network usage.
