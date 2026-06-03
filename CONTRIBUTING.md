# Contributing to Soothe

Thanks for your interest in Soothe! Bug reports, feature requests, and pull requests are all welcome.

## Reporting a bug

Open a GitHub issue with:

1. Device + OS version (e.g. "Pixel 7, Android 14").
2. App version (visible in **Settings** footer).
3. Steps to reproduce.
4. Expected vs. actual behaviour.
5. Screenshots or a short screen recording if relevant.

## Suggesting a feature

Open a GitHub issue with the `enhancement` label. Briefly describe:

- The problem you're trying to solve.
- The proposed UX.
- Any privacy implications (the app is fully on-device — feature ideas should not require a backend unless explicitly proposed).

## Submitting a pull request

1. Fork the repo and create a topic branch (`git checkout -b feat/streaks`).
2. Run `npm install` and `npx expo start` to verify the change locally.
3. Keep changes focused and well-scoped. One feature or fix per PR.
4. Match the existing code style — `prettier` is recommended.
5. Update `README.md` and/or `app.json` if you changed the user-facing behaviour or the Expo config.
6. Verify the app launches on at least one platform (Android emulator is the fastest).
7. Open a PR with a short, descriptive title and a body that links the relevant issue.

## Coding conventions

- React Native + Expo SDK 54 idioms — check `https://docs.expo.dev/versions/v54.0.0/` before adding a new dependency.
- Hooks for stateful logic; keep screens thin and presentational.
- Colours and spacing must come from `src/theme.js`. Do not hard-code hex values in screens.
- No analytics, crash reporting, or third-party SDKs in `dependencies` without prior discussion.

## Privacy-first commitment

Soothe's value proposition is that the data stays on the device. Any contribution that would require a server, an account, or sending user data off-device will be declined. If your idea needs the cloud, please propose it as a discussion first.

## License

By contributing, you agree that your contributions will be licensed under the [MIT License](./LICENSE).
