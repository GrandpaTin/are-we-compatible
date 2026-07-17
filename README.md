# Are We Compatible?

A modern, local-first relationship conversation game for two people. Each player answers the same questions privately, then reveals the results through playful 3D cards, alignment scores, category heat colors, and conversation prompts.

**Live game:** [grandpatin.github.io/are-we-compatible](https://grandpatin.github.io/are-we-compatible/)

![Are We Compatible? social preview](og-image.jpg)

## Features

- One-device pass-and-play with a private handoff lock screen
- Automatic one-scan two-phone play with temporary signaling and encrypted WebRTC relay fallback
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
3. Pass the device at the lock screen, or create a private room and scan its single QR from the second phone.
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

The checks validate JavaScript syntax, the full question catalog, slider labels, unique IDs, bundled QR generation, expiring signaling-room behavior, origin protection, PWA assets, GitHub Pages-safe paths, key accessibility invariants, and common secret formats.

## Deployment

The app is designed for GitHub Pages with no build step:

- Source: `main` branch
- Folder: repository root (`/`)
- Entry point: `index.html`

All runtime paths are relative, so assets continue to work when the site is hosted beneath a repository path. The included `.nojekyll` file keeps static delivery predictable.

The one-scan mode uses the companion Cloudflare Worker in [`worker/`](worker/). Its hibernating WebSocket room exchanges temporary WebRTC connection metadata, while short-lived TURN credentials provide encrypted relay fallback on restrictive networks. See [`worker/README.md`](worker/README.md) for deployment and secret configuration.

## Browser support

Current stable versions of Chrome, Edge, Firefox, and Safari are supported. Two-phone mode prefers a direct WebRTC path and automatically uses a configured TURN relay when the network blocks direct traffic. Pass-and-play remains available if either browser does not support WebRTC.

## Screenshots

| Desktop | Mobile |
| --- | --- |
| ![Desktop home screen](docs/home-desktop.png) | ![Mobile home screen](docs/home-mobile.png) |

## Privacy

There are no accounts, analytics, or advertising SDKs. Game data stays in the local browser unless a player explicitly exports it or sends answers to their partner over the encrypted WebRTC channel. The connection service stores only an expiring room token and never receives answers as application data. See [SECURITY.md](SECURITY.md) for practical privacy limitations.

## Roadmap

- Optional multilingual question packs
- Installable iOS/Android wrappers using the same local-first core
- More relationship-type and friendship-oriented wording modes
- Shared post-round goals and reminders stored locally
- Expanded automated cross-browser and accessibility regression coverage

## License

Released under the [MIT License](LICENSE).
