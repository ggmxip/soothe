<div align="center">
  <h1>Soothe</h1>
  <p><strong>A private, on-device daily tracker for smoking habits and money spent.</strong></p>
  <p>Built with React Native + Expo. No accounts. No ads. No servers. Your data never leaves your phone.</p>
</div>

---

## Highlights

- **100% on-device** — every log, every setting, every number lives in local storage. No backend, no telemetry.
- **Minimal, focused** — four screens, one job: help you stay aware.
  - **Home** — count today's sticks and money spent.
  - **Calendar** — visual month grid with per-day logs and monthly totals.
  - **Analytics** — yearly breakdown and a projection of where you're heading.
  - **Settings** — currency, default price, and a destructive "clear all data" button.
- **Multi-currency** — toggle between INR and USD. Localized date and number formatting.
- **Dark by design** — high-contrast, low-glare UI built for late-night use.
- **No internet required** — works fully offline, including first launch.

## Why

Most habit apps require an account, want your email, and ship your data to a third-party analytics provider. Soothe is the opposite: open the app, tap, log, done. If you uninstall the app, your data is gone forever.

## Screenshots

_Add screenshots here before publishing to the stores._

| Home | Calendar | Analytics | Settings |
|------|----------|-----------|----------|
| _todo_ | _todo_ | _todo_ | _todo_ |

## Stack

- React Native `0.81.x`
- Expo SDK `54`
- React Navigation `7` (bottom tabs)
- `@react-native-async-storage/async-storage`
- EAS Build + Submit for production

## Run locally

```bash
npm install
npx expo start
```

Then press `i` for iOS simulator, `a` for Android emulator, or scan the QR code with Expo Go on a physical device.

## Build for production

```bash
# Android App Bundle (Play Store)
eas build --platform android --profile production

# iOS archive (App Store)
eas build --platform ios --profile production
```

Submit with `eas submit` after configuring credentials (see `eas.json`).

## Project structure

```
.
├── App.js                # Root: SafeAreaProvider + Tab Navigator
├── app.json              # Expo config (name, icons, splash, package, EAS)
├── eas.json              # EAS Build / Submit profiles
├── assets/               # icon, adaptive-icon, splash, favicon
└── src/
    ├── theme.js          # colors + spacing tokens
    ├── hooks/
    │   └── useStorage.js # AsyncStorage CRUD + derived selectors
    └── screens/
        ├── HomeScreen.js
        ├── CalendarScreen.js
        ├── AnalyticsScreen.js
        └── SettingsScreen.js
```

## Privacy

See [PRIVACY.md](./PRIVACY.md). Short version: Soothe does not collect, transmit, or sell any data. Period.

## License

[MIT](./LICENSE) © Aditya Ishan

## Contributing

Bug reports and PRs welcome. See [CONTRIBUTING.md](./CONTRIBUTING.md).

---

<div align="center">
  <sub>Built by <a href="https://github.com/ggmxip">@ggmxip</a>. If Soothe helped you, a ⭐ is appreciated.</sub>
</div>
