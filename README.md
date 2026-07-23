# chrsep.dev

My personal space on the web.

## Local development

Install dependencies with `pnpm install`, then run the web app with:

```sh
pnpm --filter web dev
```

PostHog is optional for local development and verification. The site skips
analytics when `PUBLIC_POSTHOG_KEY`, `PUBLIC_POSTHOG_HOST`, or
`PUBLIC_POSTHOG_UI_HOST` is absent, so a production credential is never required
to build or test the portfolio. If a local environment requires these variables
to exist, copy `apps/web/.env.example`; its project key and ingestion host are
intentionally non-production, with the latter pointing to the reserved
`.invalid` domain.

The main web verification commands are:

```sh
pnpm --filter web check
pnpm --filter web test
pnpm build
pnpm --filter web test:seo
```
