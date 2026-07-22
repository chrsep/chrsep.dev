# PostHog integration report

## Runtime architecture

`chrsep.dev` is a fully prerendered SvelteKit site. The browser integration uses
`posthog-js`; there is no server SDK because the site has no runtime API routes.

PostHog initializes before hydration from `apps/web/src/hooks.client.ts`. The
initializer is idempotent and reads `PUBLIC_POSTHOG_KEY` and
`PUBLIC_POSTHOG_HOST` from Vite's build-time public environment, so changes
require a rebuild and redeploy. It disables itself in development, tests,
Vercel previews, or when either required value is absent. Calls through
`apps/web/src/lib/analytics.ts` are typed and fail closed so analytics cannot
interrupt rendering or user actions.

Every helper event includes the deployment environment, release, application
surface, locale, and normalized route. Pageview URLs and URL-like properties
have query strings, hashes, and embedded credentials removed before sending.
Unknown route segments are replaced with `:unknown` in automatic location
properties. Feature-flag evaluation is disabled globally. Token-specific remote
configuration remains enabled on known routes so project-side replay settings
work, but is disabled on unknown entry routes so an initial 404 URL cannot be
sent before event redaction runs. An SDK session that begins on an unknown route
keeps remote-config-controlled features off until a full reload on a known route.

## Enabled collection

- Manual `$pageview` events for SvelteKit navigations and explicit
  `$pageleave` capture.
- Browser exception autocapture for uncaught errors, unhandled rejections, and
  `console.error`, plus explicit handled-error capture through SvelteKit's
  client error hook and guarded resource loaders.
- Web Vitals with attribution, replay network timing, heatmaps, dead clicks,
  DOM autocapture, and session replay when enabled for the PostHog project.
- Anonymous event-only processing with `person_profiles: "never"` and Do Not
  Track support.
- Feature-flag evaluation is disabled because this site does not use feature
  flags. Remote configuration remains available on known routes for replay and
  other project-side controls, but is suppressed on unknown entry routes.
- Replay masking for every input and content inside `[data-analytics-mask]`,
  `[data-private]`, or `.ph-mask`. Transcript content is also excluded from DOM
  autocapture with `ph-no-capture`.
- Replay network bodies and headers are disabled. Network URLs, event URL
  properties, exception messages, and autocapture element chains have query
  strings, hashes, and embedded credentials removed. The SDK masks sensitive
  query keys such as `session`, `token`, `code`, and `state` in initial-person
  URL metadata; unknown entry routes suppress configuration requests entirely.

The project still needs a deliberate consent/persistence policy before using
recordings beyond the current public content. The browser configuration masks
known sensitive surfaces but does not replace legal or product review.

## Typed event taxonomy

| Event                     | Purpose                                                    |
| ------------------------- | ---------------------------------------------------------- |
| `contact cta clicked`     | Contact intent by stable placement                         |
| `outbound link clicked`   | External navigation using finite destination IDs and hosts |
| `asset download clicked`  | Download intent for published assets                       |
| `language changed`        | Locale-switch intent                                       |
| `project card viewed`     | One-time project visibility                                |
| `resource tab selected`   | Workshop resource navigation                               |
| `content section viewed`  | One-time content-section visibility                        |
| `agent session selected`  | Transcript selection                                       |
| `agent session read`      | Transcript reading milestones                              |
| `content retry clicked`   | Retry intent after a content failure                       |
| `content load completed`  | Resource load result and duration                          |
| `content load recovered`  | Successful retry after a prior failure                     |
| `resource load failed`    | Non-throwing media/resource failures                       |
| `agent activity expanded` | Expansion of transcript activity details                   |
| `page not found viewed`   | Low-cardinality 404 visibility without raw missing paths   |

The canonical production dashboard and reusable Actions have already been
created for this taxonomy:

- [Canonical website analytics dashboard](https://eu.posthog.com/project/228051/dashboard/838904)
- PostHog Actions `145176`, `145177`, `145178`, and `145179`
- [Meaningful engagement](https://eu.posthog.com/project/228051/insights/6H2an3Ar)
- [Workshop page to engagement](https://eu.posthog.com/project/228051/insights/E2AeOHB4)
- [Reliability failures](https://eu.posthog.com/project/228051/insights/p9gM9utJ)

The reliability insight separates browser exceptions, resource failures, and
404 page views. The workshop funnel uses exact English and Indonesian route
allowlists. The outbound and workshop engagement Actions intentionally overlap
for workshop links; the saved engagement insight now states that the series
must not be summed.

The original wizard dashboard remains a legacy historical reference. Its old
event names should not be used for new insights:

- [Analytics basics (wizard)](https://eu.posthog.com/project/228051/dashboard/834938)
- [Pageviews over time](https://eu.posthog.com/project/228051/insights/kEiiO7te)
- [Contact CTA clicks](https://eu.posthog.com/project/228051/insights/7wv9UXlJ)
- [Social link clicks by platform](https://eu.posthog.com/project/228051/insights/3weMYzb4)
- [Project link clicks by project](https://eu.posthog.com/project/228051/insights/TnsMStRA)
- [Vibecoding engagement funnel](https://eu.posthog.com/project/228051/insights/A89tWJMz)

## Environment variables

The checked-in `apps/web/.env.example` documents placeholders only. Real values
belong in Vercel or the developer's untracked environment. Scope the public
variables to Vercel Production; preview deployments are also suppressed in
code so they cannot pollute production analytics.

| Variable                     | Scope                  | Purpose                                            |
| ---------------------------- | ---------------------- | -------------------------------------------------- |
| `PUBLIC_POSTHOG_KEY`         | Browser-safe           | PostHog project key                                |
| `PUBLIC_POSTHOG_HOST`        | Browser-safe           | Event ingestion host                               |
| `PUBLIC_POSTHOG_ENVIRONMENT` | Browser-safe, optional | Label production; suppress development/test builds |
| `PUBLIC_POSTHOG_DISABLED`    | Browser-safe, optional | Emergency client-side disable switch               |
| `POSTHOG_API_KEY`            | Build secret           | Personal API key for source-map upload             |
| `POSTHOG_PROJECT_ID`         | Build secret           | Target PostHog project ID                          |
| `POSTHOG_HOST`               | Build secret           | PostHog host used by the upload CLI                |

Never expose `POSTHOG_API_KEY` through a `PUBLIC_` variable.

## Source maps and releases

`apps/web/vite.config.js` enables hidden production source maps only when all
three build-only PostHog variables are present. The Rollup plugin uploads maps
under release name `chrsep.dev-web`, uses `VERCEL_GIT_COMMIT_SHA` with
`VERCEL_DEPLOYMENT_ID` as a fallback, records the deployment ID as the build,
and deletes local maps after a successful upload. Builds without the complete
credential set generate no production source maps and do not activate the
plugin.

## Verification completed locally

- [x] Installed `@posthog/rollup-plugin` and updated `pnpm-lock.yaml`.
- [x] Ran 29 tests and `svelte-check` with zero errors and zero warnings.
- [x] Built the production site without upload credentials and confirmed that
      neither `.vercel/output` nor `.svelte-kit/output` contains `.map` files.
- [x] Confirmed the prerendered client has no `/_app/env.js` runtime dependency.
- [x] Exercised home, CV, workshop, deep-linked transcript, and 404 flows in a
      production browser build while intercepting every PostHog request locally.
- [x] Confirmed canonical events carry environment, release, surface, locale,
      and route context; repeated activity expansion emits once; a deep link
      emits `agent session selected` without a synthetic tab event.
- [x] Confirmed transcript masking is present, test query values never appear in
      captured requests, and raw unknown 404 path segments are replaced by
      low-cardinality patterns before capture, including session-entry and
      previous-page properties after client-side navigation. Unknown entry
      routes make no flags, decide, or remote-configuration request.
- [x] Confirmed a known route still loads project-side remote configuration and
      requests the replay recorder when recording is enabled, while feature-flag
      evaluation remains disabled.
- [x] Created and verified dashboard `838904`, Actions `145176`–`145179`, and
      seven saved insights. Current reliability series all correctly return zero.

## Deployment-only follow-up

- [ ] Configure `POSTHOG_API_KEY`, `POSTHOG_PROJECT_ID`, and `POSTHOG_HOST` in
      Vercel, redeploy, and confirm source-map upload without printing secrets.
- [ ] Trigger one controlled production browser exception after deployment and
      confirm its stack resolves to the `chrsep.dev-web` release source.
- [ ] Confirm the first real production events arrive on dashboard `838904`.
- [ ] Decide and document the site's consent/persistence policy before relying
      on session recordings. Current masking and DNT support do not replace that
      product/legal decision.
- [ ] Change the PostHog project timezone from UTC to `Asia/Jakarta` in Project
      settings if local-day reporting is preferred.
