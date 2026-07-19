# Repository Guidelines

## Project Structure & Module Organization

This is a PNPM/Turborepo monorepo. `apps/web` contains the SvelteKit site: routes live in `src/routes`, reusable Svelte components in `src/lib`, source images in `src/images`, and public files in `static`. `apps/studio` contains the Sanity Studio configuration, document schemas in `schemas`, and Studio assets in `static`. `packages/cv` contains the XeLaTeX CV, split between `cv.tex`, `meta`, `sections`, and `fonts`. Root files such as `turbo.json` and `pnpm-workspace.yaml` coordinate the packages. Do not edit `apps/web/static/studio`; it is generated from the Studio build.

## Build, Test, and Development Commands

- `pnpm install` installs all workspace dependencies using Node `22.22` from `.nvmrc`.
- `pnpm dev` starts package development servers through Turbo. Use `pnpm --filter web dev` or `pnpm --filter studio dev` when working on one app.
- `pnpm build` builds the workspace, including Sanity Studio before the web app copies its output.
- `pnpm --filter web check` runs Svelte and TypeScript diagnostics.
- `pnpm --filter web format` formats the web package with Prettier.
- `pnpm --filter studio exec eslint .` checks Studio code with Sanity's ESLint configuration.
- `pnpm --filter cv build:cv` compiles `packages/cv/out/cv.pdf` with XeLaTeX.

## Coding Style & Naming Conventions

Use strict TypeScript and Prettier defaults: two-space indentation, double quotes, and the repository's no-semicolon rule. Keep Svelte component filenames kebab-case (`button-link.svelte`) and follow SvelteKit route names such as `+page.svelte` and `+layout.ts`. Use lower camel case for Sanity schema identifiers and descriptive Tailwind utility groupings. Run formatting instead of manually aligning code.

## Testing Guidelines

No automated test suite or coverage threshold is currently configured. Before opening a PR, run the relevant static checks and `pnpm build`. Manually verify changed web routes in the development server and open Studio after schema changes. If adding tests, prefer co-located `*.test.ts` files and add the runner command to that package's `package.json`.

## Commit & Pull Request Guidelines

Human-authored history favors short, lowercase, action-oriented subjects such as `add blog link` and `fix turborepo config.` Keep commits focused on one logical change. PRs should explain the user-visible result, list verification commands, link related issues, and include screenshots for web or Studio UI changes. Commit `pnpm-lock.yaml` with dependency changes, but exclude generated output and local secrets.
