# Privacy Policy for Soothe

**Last updated:** 2026-06-04

Soothe ("the app", "we", "us") is built around a single principle: **your data never leaves your device**. This page explains what data the app handles, in plain language.

## Summary

- We do not collect any personal information.
- We do not transmit any data to any server.
- We do not use analytics, crash reporting, advertising SDKs, or third-party trackers.
- We do not require an account.
- Uninstalling the app permanently deletes all data.

## What data the app stores on your device

All data is stored locally in the app's sandboxed storage area: `AsyncStorage` (Android) / `NSUserDefaults` (iOS). The data is protected by the operating system: iOS encrypts app sandbox data at rest when the device is locked, and Android applies file-based encryption to app storage on a passcode-protected device. Soothe does not implement its own encryption layer.

- **Daily logs** — date, count, and price per stick you have entered. Used to draw the Home counter, Calendar grid, and Analytics charts.
- **Settings** — your preferred currency (INR or USD) and default price per stick.

That is the entire dataset. It lives in a sandboxed area tied to the app bundle identifier (`com.soothe.app`) and is removed automatically when you uninstall the app.

## Network activity

The app does not make network requests for analytics, advertising, telemetry, or any other purpose. The only network traffic originates from the Expo runtime to load the bundled JavaScript and assets when the app is first installed; after that the app runs fully offline.

If a future version adds optional features that require the internet (e.g. cloud sync), this page will be updated **before** that version is released, and any new data flow will be opt-in.

## Children

The app does not target children and we do not knowingly collect information from anyone under the age of 13. If you are a parent and believe your child has provided us with information, please contact us and we will delete it.

## Third parties

The app contains no third-party SDKs that process user data.

## Your rights

- **Access** — all data is on your device and visible inside the app at all times.
- **Delete** — go to **Settings → Data → Clear all data** to wipe logs and reset settings to defaults. Uninstalling the app also deletes everything.
- **Export** — not available in v1. Coming in a future version.

## Changes to this policy

If we change anything material, the change will be reflected here with an updated "Last updated" date and a note in the release notes of the next app version.

## Contact

Questions, concerns, or a data deletion request: **adityaishan.dev@gmail.com** (or open an issue on the GitHub repository).

---

_This document is provided to satisfy the disclosure requirements of the Apple App Store and Google Play Store. It is not legal advice._
