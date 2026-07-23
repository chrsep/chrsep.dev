# chrsep.dev

My personal space on the web.

## Local development

Install the [Vite+ CLI](https://viteplus.dev/guide/) once, then let it select
Node `22.22` and pnpm `10.33` from the repository:

```sh
vp install --frozen-lockfile
vp run web#dev
```

PostHog is optional for local development and verification. The site skips
analytics when `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST`, or
`PUBLIC_POSTHOG_UI_HOST` is absent, so a production credential is never required
to build or test the portfolio. If a local environment requires these variables
to exist, copy `apps/web/.env.example`; its project key and ingestion host are
intentionally non-production, with the latter pointing to the reserved
`.invalid` domain.

The main workspace commands are:

```sh
vp run -w check
vp run -w test
vp run -w build
vp run -r --parallel dev
```

Vite Task caches build, check, and test work under
`node_modules/.vite/task-cache`. Use `vp run -w build -v` to inspect cache
hits, `vp cache clean` to clear the task cache, and
`vp run --cache cv#build:cv` to compile the separate XeLaTeX CV package.

After deployment, run the uncached live SEO audit with:

```sh
SEO_BASE_URL=https://www.chrsep.dev vp run -w seo:live
```
