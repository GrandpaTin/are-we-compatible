# Maintainer guide

This repository contains a zero-build, local-first progressive web app. The production entry point is `index.html`; CSS, game data, the embedded QR library, and application JavaScript intentionally remain in that file to preserve the original single-file distribution requirement. Supporting PWA and repository files live at the project root.

## Architecture map

- `index.html`: visual themes, responsive layout, question catalogs, state model, storage/import/export, nearby WebRTC pairing, audio, render functions, and event handlers.
- `manifest.webmanifest`: install metadata and app icons.
- `sw.js`: offline shell caching with a network-first update strategy.
- `scripts/serve.mjs`: dependency-free local server.
- `tests/production-check.mjs`: dependency-free source, asset, syntax, question-bank, security, and QR smoke checks.

## Development workflow

1. Run `npm test` after every meaningful change.
2. Run `npm start` and test through HTTP; opening `index.html` directly does not exercise the service worker or nearby-phone flow correctly.
3. Test at least one pass-and-play round, a reveal, refresh persistence, export/import, reset cancellation, and the Question Library.
4. For nearby mode, start with `node scripts/serve.mjs --host 0.0.0.0` and open the shown port from two devices on the same network.
5. Bump `CACHE_NAME` in `sw.js` whenever a deployed shell asset changes so existing installs update promptly.

## Safety invariants

- Keep all deployable paths relative so GitHub Pages subfolder hosting works.
- Escape player names, custom prompts, answers, comments, labels, and imported identifiers before inserting them into HTML.
- Do not add analytics, cloud storage, tracking pixels, or remote relay services without an explicit product decision and a privacy review.
- Preserve unanswered-first selection and the per-question history used to avoid repetitive rounds.
- Keep unrevealed card backs inert and hidden from assistive technology.

## graphify

This project has a knowledge graph at graphify-out/ with god nodes, community structure, and cross-file relationships.

When the user types `/graphify`, use the installed graphify skill or instructions before doing anything else.

Rules:
- For codebase questions, first run `graphify query "<question>"` when graphify-out/graph.json exists. Use `graphify path "<A>" "<B>"` for relationships and `graphify explain "<concept>"` for focused concepts. These return a scoped subgraph, usually much smaller than GRAPH_REPORT.md or raw grep output.
- Dirty graphify-out/ files are expected after hooks or incremental updates; dirty graph files are not a reason to skip graphify. Only skip graphify if the task is about stale or incorrect graph output, or the user explicitly says not to use it.
- If graphify-out/wiki/index.md exists, use it for broad navigation instead of raw source browsing.
- Read graphify-out/GRAPH_REPORT.md only for broad architecture review or when query/path/explain do not surface enough context.
- After modifying code, run `graphify update .` to keep the graph current (AST-only, no API cost).
