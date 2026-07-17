# Are We Compatible?

A modern, local-first relationship conversation game for two people. Each player answers the same questions privately, then reveals the results through playful 3D cards, alignment scores, category heat colors, and conversation prompts.

**Live game:** [grandpatin.github.io/are-we-compatible](https://grandpatin.github.io/are-we-compatible/)

![Are We Compatible? social preview](og-image.jpg)

## Features

- One-device pass-and-play with a private handoff lock screen
- Optional direct two-phone play on a compatible local network, with QR-assisted pairing and manual code fallback
- 309 built-in questions across Connection, Lifestyle, Future, Love, Fun, Spicy, Money, Politics, and Dealbreakers
- Mixed, slider-heavy, and sliders-only rounds with 5, 10, or 15 questions
- Cozy, Curious, Deep, Spicy, and No-filter intensity settings
- Unanswered-first selection, least-recently-seen reuse, exclusions, favorites, custom questions, and custom packs
- Per-question comments, importance ratings, private notes, conversation follow-through, and answer history
- Overall and topic alignment, relationship-fit scoring, match celebrations, and difference heat colors
- Local persistence, readable JSON export/import, optional encrypted backups, and a local privacy PIN
- Four distinct visual themes, three sound themes, reduced motion, high contrast, and adjustable text size
- Installable PWA behavior and offline app-shell support

## Gameplay

1. Enter two player names and choose a session, length, intensity, style, and question packs.
2. Player 1 answers the selected questions privately.
3. Pass the device at the lock screen, or answer independently in nearby two-phone mode.
4. Player 2 answers the exact same questions in the same order.
5. Reveal each card to compare answers, alignment, comments, and suggested discussion prompts.
6. Return later to review saved rounds and each person's answer history in the Question Library.

## Run locally

No build or dependencies are required. Node.js 18 or newer is recommended for the included development server and checks.

```bash
npm start
```

Open `http://127.0.0.1:4173`. To review on another phone connected to the same network:

```bash
node scripts/serve.mjs --host 0.0.0.0
```

Then open `http://YOUR-COMPUTER-IP:4173` on the phone. Your firewall may ask for permission to allow local-network access.

## Quality checks

```bash
npm test
```

The check validates JavaScript syntax, the full question catalog, slider labels, unique IDs, bundled QR generation, PWA assets, GitHub Pages-safe paths, key accessibility invariants, and common secret formats.

## Deployment

The app is designed for GitHub Pages with no build step:

- Source: `main` branch
- Folder: repository root (`/`)
- Entry point: `index.html`

All runtime paths are relative, so assets continue to work when the site is hosted beneath a repository path. The included `.nojekyll` file keeps static delivery predictable.

## Browser support

Current stable versions of Chrome, Edge, Firefox, and Safari are supported. Nearby two-phone mode depends on WebRTC and local-network conditions; pass-and-play remains available when direct pairing is unavailable.

## Screenshots

| Desktop | Mobile |
| --- | --- |
| ![Desktop home screen](docs/home-desktop.png) | ![Mobile home screen](docs/home-mobile.png) |

## Privacy

There are no accounts, analytics, advertising SDKs, or application servers. Game data stays in the local browser unless a player explicitly exports or transfers it. See [SECURITY.md](SECURITY.md) for practical privacy limitations.

## Roadmap

- Optional multilingual question packs
- Installable iOS/Android wrappers using the same local-first core
- More relationship-type and friendship-oriented wording modes
- Shared post-round goals and reminders stored locally
- Expanded automated cross-browser and accessibility regression coverage

## License

Released under the [MIT License](LICENSE).
