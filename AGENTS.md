# Repository Guidelines

## Project Structure & Module Organization

This is a pnpm monorepo orchestrated by Vite Task. `apps/web` contains the SvelteKit site: routes live in `src/routes`, reusable Svelte components in `src/lib`, source images in `src/images`, and public files in `static`. `apps/studio` contains the Sanity Studio configuration, document schemas in `schemas`, and Studio assets in `static`. `packages/cv` contains the XeLaTeX CV, split between `cv.tex`, `meta`, `sections`, and `fonts`. Root files such as `vite.config.ts` and `pnpm-workspace.yaml` coordinate the packages. Do not edit `apps/web/static/studio`; it is generated from the Studio build.

## Build, Test, and Development Commands

- `vp install --frozen-lockfile` installs all workspace dependencies using Node `22.22` from `.node-version` and pnpm `10.33` from `package.json`.
- `vp run -r --parallel dev` starts package development servers. Use `vp run web#dev` or `vp run studio#dev` when working on one app.
- `vp run -w build` runs the cached workspace build, including Sanity Studio before the web app copies its output.
- `vp run -w check` runs Oxfmt, Oxlint/type checking, and Svelte diagnostics.
- `vp run -w test` runs unit tests and the deterministic build SEO audit.
- `vp fmt . --write` formats supported first-party files with Oxfmt.
- `vp run --cache cv#build:cv` compiles `packages/cv/out/cv.pdf` with XeLaTeX.

## Coding Style & Naming Conventions

Use strict TypeScript and the repository's Oxfmt settings: two-space indentation, double quotes, 80-character print width, Tailwind class sorting, and no semicolons. Keep Svelte component filenames kebab-case (`button-link.svelte`) and follow SvelteKit route names such as `+page.svelte` and `+layout.ts`. Use lower camel case for Sanity schema identifiers and descriptive Tailwind utility groupings. Run formatting instead of manually aligning code.

## Testing Guidelines

The web package has Vitest unit tests and a deterministic SEO audit, but no coverage threshold. Before opening a PR, run `vp run -w check`, `vp run -w test`, and `vp run -w build`. Manually verify changed web routes in the development server and open Studio after schema changes. If adding tests, prefer co-located `*.test.ts` files and run them through Vite+.

## Commit & Pull Request Guidelines

Human-authored history favors short, lowercase, action-oriented subjects such as `add blog link` and `migrate build tooling.` Keep commits focused on one logical change. PRs should explain the user-visible result, list verification commands, link related issues, and include screenshots for web or Studio UI changes. Commit `pnpm-lock.yaml` with dependency changes, but exclude generated output and local secrets.
