<script lang="ts">
  import Seo from "$lib/seo.svelte"
  import { m } from "$lib/paraglide/messages"
  import { posthog } from "$lib/posthog"

  type LinkGroup = {
    id: string
    title: string
    description: string
    links: readonly {
      label: string
      description: string
      domain: string
      href: string
    }[]
  }

  const linkGroups = [
    {
      id: "resources",
      title: m.vibe_group_resources_title(),
      description: m.vibe_group_resources_description(),
      links: [
        {
          label: "Skills.sh",
          description: m.vibe_link_skills_description(),
          domain: "skills.sh",
          href: "https://www.skills.sh/",
        },
        {
          label: "chrsep/inventory",
          description: m.vibe_link_inventory_repo_description(),
          domain: "github.com",
          href: "https://github.com/chrsep/inventory",
        },
        {
          label: m.vibe_link_inventory_demo_label(),
          description: m.vibe_link_inventory_demo_description(),
          domain: "inventory-wine-five.vercel.app",
          href: "https://inventory-wine-five.vercel.app/",
        },
        {
          label: "chrsep/vibecoding-workshop",
          description: m.vibe_link_workshop_repo_description(),
          domain: "github.com",
          href: "https://github.com/chrsep/vibecoding-workshop",
        },
      ],
    },
    {
      id: "tools",
      title: m.vibe_group_tools_title(),
      description: m.vibe_group_tools_description(),
      links: [
        {
          label: "Vercel",
          description: m.vibe_link_vercel_description(),
          domain: "vercel.com",
          href: "https://vercel.com/",
        },
        {
          label: "GitHub",
          description: m.vibe_link_github_description(),
          domain: "github.com",
          href: "https://github.com/",
        },
        {
          label: "Neon",
          description: m.vibe_link_neon_description(),
          domain: "neon.com",
          href: "https://neon.com/",
        },
        {
          label: "Codex",
          description: m.vibe_link_codex_description(),
          domain: "openai.com/codex",
          href: "https://openai.com/codex/",
        },
      ],
    },
  ] as const satisfies readonly LinkGroup[]
</script>

<Seo
  title={m.vibe_links_seo_title()}
  description={m.vibe_links_seo_description()}
/>

<div class="pt-8 sm:pt-10">
  <div class="grid gap-12 lg:grid-cols-2 lg:gap-16">
    {#each linkGroups as group}
      <section aria-labelledby={`link-group-${group.id}`}>
        <div class="min-h-24 border-b border-[#ffffff1f] pb-5">
          <h3
            id={`link-group-${group.id}`}
            class="text-ink-900 text-lg font-bold"
          >
            {group.title}
          </h3>
          <p class="text-ink-700 mt-2 max-w-md text-sm leading-6">
            {group.description}
          </p>
        </div>

        <ul>
          {#each group.links as link}
            <li class="border-b border-[#ffffff14]">
              <a
                class="group -mx-3 flex min-h-24 items-center justify-between gap-5 px-3 py-4 transition-colors hover:bg-[#ffffff08] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                href={link.href}
                target="_blank"
                rel="noreferrer"
                onclick={() =>
                  posthog.capture("vibecoding resource link clicked", {
                    link_label: link.label,
                    link_group: group.id,
                    link_href: link.href,
                  })}
              >
                <span class="min-w-0">
                  <span class="text-ink-900 block font-semibold">
                    {link.label}
                  </span>
                  <span class="text-ink-700 mt-1 block text-sm leading-5">
                    {link.description}
                  </span>
                  <span class="text-ink-700 mt-1.5 block text-xs">
                    {link.domain}
                  </span>
                </span>
                <span
                  class="text-ink-700 group-hover:text-ink-900 shrink-0 text-lg transition-colors"
                  aria-hidden="true"
                >
                  ↗
                </span>
              </a>
            </li>
          {/each}
        </ul>
      </section>
    {/each}
  </div>
</div>
