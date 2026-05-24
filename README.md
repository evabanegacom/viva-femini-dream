# Viva Femini Dream

> React + Vite + TypeScript frontend for the Viva Femini Dream project.

## Quick overview

- **Framework:** Vite + React + TypeScript
- **Entry:** `src/main.tsx`
- See the source in the `src/` directory.

## Prerequisites

- Node.js 18+ (LTS recommended)
- npm (or pnpm/yarn)
- Git (to clone the repository)

## Getting started (local development)

1. Clone the repo and install dependencies:

```bash
git clone https://github.com/evabanegacom/viva-femini-dream.git
cd viva-femini-dream
npm install
```

2. Start the dev server:

```bash
npm run dev
```

The app will be available at http://localhost:5173 by default.

## Available scripts

- `npm run dev` — Start Vite dev server
- `npm run build` — Build production bundle
- `npm run build:dev` — Build with `development` mode
- `npm run preview` — Preview production build locally
- `npm run lint` — Run ESLint
- `npm run format` — Run Prettier to format files

These scripts are defined in [package.json](package.json).

## Build & preview

Build production assets:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Environment variables

This project uses Vite. If you need environment variables, create a `.env` or `.env.local` file and prefix public variables with `VITE_`.

## Deploy

- Netlify: this repo includes a `netlify.toml`; connect the repository in Netlify and it will pick up the build command `npm run build` and publish the `dist/` folder.
- Other static hosts: build with `npm run build` and upload the `dist/` folder.

## Troubleshooting

- If you see module or build errors, ensure Node.js version is compatible (use Node 18+).
- If dependency errors occur, try removing `node_modules` and reinstalling:

```bash
rm -rf node_modules package-lock.json
npm install
```

- If the dev server port is in use, change Vite port via `vite.config.ts` or set `PORT` env variable.

## Where to look in the codebase

- App entry: [src/main.tsx](src/main.tsx)
- App shell and components: [src/components](src/components)
- API helpers: [src/lib/api](src/lib/api)

## Contributing

Feel free to open issues or PRs for improvements.

---

If you want, I can also commit this README for you and run the dev server to verify it starts.
