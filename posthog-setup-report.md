# PostHog post-wizard report

The wizard has completed a PostHog analytics integration for **chrsep.dev**, a fully prerendered static SvelteKit portfolio site. Because the site has no server-side API routes (all pages use `prerender = true`), the integration uses **posthog-js** (the browser SDK) rather than posthog-node. PostHog is initialized in the root layout on mount and tracks page navigations via SvelteKit's `afterNavigate` hook. Exception autocapture is enabled globally. Individual user actions are tracked with targeted `capture()` calls in each page component.

## Events instrumented

| Event name                         | Description                                                                        | File                                                         |
| ---------------------------------- | ---------------------------------------------------------------------------------- | ------------------------------------------------------------ |
| `$pageview`                        | Fired on every client-side navigation via `afterNavigate`                          | `apps/web/src/routes/+layout.svelte`                         |
| `contact cta clicked`              | User clicked a "Let's work together" email CTA (hero section)                      | `apps/web/src/routes/+page.svelte`                           |
| `social link clicked`              | User clicked a social link; `platform` property identifies which one               | `apps/web/src/routes/+page.svelte`                           |
| `project link clicked`             | User clicked a project GitHub/web link; `project_title` and `link_type` properties | `apps/web/src/lib/projects.svelte`                           |
| `github cta clicked`               | User clicked the "View GitHub" CTA in the open-source section                      | `apps/web/src/routes/+page.svelte`                           |
| `cv viewed`                        | User mounted the CV page                                                           | `apps/web/src/routes/cv/+page.svelte`                        |
| `vibecoding tab switched`          | User switched resource tabs; `tab` property identifies which tab                   | `apps/web/src/routes/resources/vibecoding-demo/+page.svelte` |
| `vibecoding resource link clicked` | User clicked a resource link; `link_label`, `link_group`, `link_href` properties   | `apps/web/src/routes/resources/vibecoding-demo/+page.svelte` |
| `vibecoding pdf downloaded`        | User clicked the workshop PDF download button                                      | `apps/web/src/routes/resources/vibecoding-demo/+page.svelte` |
| `vibecoding presentation opened`   | User opened the vibecoding workshop presentation in a new tab                      | `apps/web/src/routes/resources/vibecoding-demo/+page.svelte` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- **Dashboard**: [Analytics basics (wizard)](https://eu.posthog.com/project/228051/dashboard/834938)
- [Pageviews over time](https://eu.posthog.com/project/228051/insights/kEiiO7te)
- [Contact CTA clicks](https://eu.posthog.com/project/228051/insights/7wv9UXlJ)
- [Social link clicks by platform](https://eu.posthog.com/project/228051/insights/3weMYzb4)
- [Project link clicks by project](https://eu.posthog.com/project/228051/insights/TnsMStRA)
- [Vibecoding engagement funnel](https://eu.posthog.com/project/228051/insights/A89tWJMz)

## Verify before merging

- [ ] Run the cached production build (`vp run -w build`) and fix any lint or type errors introduced by the generated code.
- [ ] Run the test suite — call sites that were rewritten or instrumented may need updated mocks or fixtures.
- [ ] Add `PUBLIC_POSTHOG_KEY` and `PUBLIC_POSTHOG_HOST` to `.env.example` and any monorepo/bootstrap scripts so collaborators know what to set.
- [ ] Wire source-map upload (`posthog-cli sourcemap` or your bundler's upload step) into CI so production stack traces de-minify.

### Agent skill

We've left an agent skill folder in your project. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.
