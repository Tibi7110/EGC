# Form Lab

An interactive school project exploring how AI techniques can assist graphics modeling. Compare a traditional workflow with an AI-assisted concept in a live 3D viewport.

**This is an educational simulation.** Geometry is procedural and prompt matching is deterministic. There is no trained model, AI API, or claim of measured productivity improvement.

## Run locally

Requires Node.js 22 and npm.

```bash
npm ci
npm run dev
```

Open the URL printed by Vite. For a production preview:

```bash
npm run build
npm run preview
```

## Explore

- **Text to 3D:** compare a coarse wireframe starting point with a curved vessel concept.
- **AI materials:** compare a neutral surface with ceramic, terracotta, or metallic material parameters.
- **Geometry cleanup:** compare a deliberately noisy mesh with a smooth reference.
- Drag to orbit, scroll to zoom, and move the comparison slider.
- Try a preset or enter keywords such as `green ceramic vase`, `warm clay`, or `twisted chrome`.
- Change surface detail, inspect wireframe, and export an OBJ mesh for Blender.

The prompt input supports three curated vessel directions, not arbitrary object generation. The export contains geometry and normals; it does not include material files or textures. Both sides use synchronized camera views; the dividing line reveals corresponding portions of the object.

## Validation

```bash
npm test
npx playwright install chromium
npm run test:e2e
npm run build
```

Tests cover geometry, prompt routing, browser controls, model export, mobile overflow, keyboard tabs, and WebGL failure. Browser tests need Chromium; some Linux systems also need `npx playwright install --with-deps chromium`.

## Host on GitHub Pages

1. Push this directory as the root of a GitHub repository, on branch `main`.
2. In repository **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**.
3. Run the included deployment workflow, or push another commit to `main`.
4. Open the URL reported by the **Deploy** job.

The workflow runs unit and browser tests, builds the app, and publishes `dist/`. Pull requests run checks without deployment. Relative asset paths support hosting beneath a repository name. Repository access and a working GitHub login are required; pushing alone does not enable Pages settings.

Other static hosts can use build command `npm run build` and output directory `dist`. No server, secrets, or environment variables are needed.

## Project documents

- [Agent instructions](agents.md), discovered automatically through [AGENTS.md](AGENTS.md)
- [Architecture](arhitecture.md)
- [Progress and verification](progress.md)
- [School presentation guide](PRESENTATION.md)
- [Research references](SOURCES.md)
- [Contribution guide](CONTRIBUTING.md)

## Limitations

A browser with WebGL support is needed for the 3D view. If unavailable, the app shows an explanation and keeps lessons accessible. The interface uses system fallback fonts and makes no runtime font requests. Dependencies and browsers must be downloaded once. The demo uses no external 3D assets, user uploads, or inference services. Mesh counts represent this procedural demo, not research-model benchmarks.
