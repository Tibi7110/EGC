# Instructions for coding agents

## Purpose

Maintain an honest, interactive school demonstration of AI-assisted graphics modeling. The actual app uses browser-local procedural geometry; it does not run machine learning inference.

## Implementation rules

- Use JavaScript ES modules, Vite, and Three.js. Keep the app deployable as static files.
- Keep dependencies minimal. Do not add backend services or secrets without a concrete requirement.
- Preserve the visible simulation disclosure. Do not call preset routing AI inference.
- Attribute research in `SOURCES.md` and the relevant lesson. Keep explanations distinct from the demo implementation.
- Avoid invented timing, quality, productivity, or accuracy benchmarks.
- Keep `src/model.js` independent of browser globals for unit testing.
- Dispose replaced geometries and materials. Share camera state across comparison scenes.
- Preserve labeled controls, focus visibility, keyboard tab navigation, reduced-motion support, and mobile layout.
- Treat prompt content as text. Never insert it into HTML or execute it.
- Exclude credentials, generated build output, node_modules, and browser artifacts from Git.

## Change workflow

Read `readme.md`, `arhitecture.md`, and `progress.md`. Make focused changes and update affected documentation. Run `npm test` and `npm run build`. For changes to interactions or rendering, also run `npm run test:e2e` with Chromium installed. Record actual validation results and blockers in `progress.md`; never imply a deployment succeeded without a returned deployment URL.

User instructions determine Git publishing scope. Do not overwrite existing remote history. This project does not require subagents.
