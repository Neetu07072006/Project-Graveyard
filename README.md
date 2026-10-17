# The Project Graveyard

A frontend-only React + Vite experience for preserving unfinished ideas and choosing what happens next.

## Features
- Dark slate / charcoal interface with electric amber accents.
- Responsive dashboard with project stats, search, and status filters.
- Project cards with progress, stack, status, and abandonment context.
- Add-project form for idea, completed work, unfinished work, reason for stopping, and tech stack.
- Project detail panel with history timeline and revival paths: Restart, Continue, Change the idea, Repurpose, Archive.
- Local persistence via `localStorage` (data remains in this browser on this device).
- Demo projects included so the dashboard feels populated immediately.

## Run locally
Install Node.js 18+ first, then in this folder:

```bash
npm install
npm run dev
```

Open the local URL printed by Vite (usually http://localhost:5173).

## Production build
```bash
npm run build
npm run preview
```

## Deploy to GitHub Pages
1. Create a GitHub repository for this project.
2. Make sure the repo name matches the Vite base path in `vite.config.js` (currently `/project-graveyard/`). If you use a different repo name, update that value in `vite.config.js` before deploying.
3. Run the deploy command:

```bash
npm run deploy
```

This builds the app and publishes the generated `dist` folder to the `gh-pages` branch. In GitHub, enable GitHub Pages for the `gh-pages` branch and choose the root folder.

## Notes
This is a frontend prototype. It does not connect to a backend or user account. Project edits are saved in the current browser's local storage. Clearing browser site data will clear those saved projects.
