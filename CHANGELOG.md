# Changelog

All notable changes to Soothe will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
