<script lang="ts">
  import ProjectTag from "$lib/project-tag.svelte"
  import ProjectLink from "$lib/project-link.svelte"
  import type { Snippet } from "svelte"
  import { m } from "$lib/paraglide/messages"

  let {
    title,
    description,
    githubLink = null,
    webLink = null,
    googlePlayLink = null,
    saas = false,
    ecommerce = false,
    marketing = false,
    openSource = false,
    android = false,
    webApp = false,
    lighthouse = null,
    heroBg,
    image,
  }: {
    title: string
    description: string
    githubLink?: string | null
    webLink?: string | null
    googlePlayLink?: string | null
    saas?: boolean
    ecommerce?: boolean
    marketing?: boolean
    openSource?: boolean
    android?: boolean
    webApp?: boolean
    lighthouse?: { score: number; link: string } | null
    heroBg: string
    image?: Snippet
  } = $props()
</script>

<article
  class="w-[70vw] flex-shrink-0 snap-center first:ml-6 last:mr-6 sm:mb-4 sm:w-auto sm:basis-1/2 sm:first:ml-0 sm:last:mr-0 xl:basis-1/4"
>
  <div
    class="aspect-w-3 aspect-h-4 mb-6 overflow-hidden rounded-2xl shadow-lg {heroBg}"
  >
    {@render image?.()}
  </div>

  <ul class="mb-4 flex flex-wrap gap-2">
    {#if saas}
      <ProjectTag name={m.tag_saas()} bgColor="bg-red-50 text-red-900" />
    {/if}
    {#if ecommerce}
      <ProjectTag name={m.tag_ecommerce()} bgColor="bg-green-50 text-green-900" />
    {/if}
    {#if marketing}
      <ProjectTag
        name={m.tag_marketing()}
        bgColor="bg-yellow-50 !text-yellow-900"
      />
    {/if}
    {#if openSource}
      <ProjectTag name={m.tag_open_source()} bgColor="bg-blue-50 text-blue-900" />
    {/if}
    {#if android}
      <ProjectTag name={m.tag_android()} bgColor="bg-teal-50 text-teal-900" />
    {/if}
    {#if webApp}
      <ProjectTag name={m.tag_web_app()} bgColor="bg-teal-50 text-teal-900" />
    {/if}
  </ul>

  <div class="prose prose-sm">
    <h3>{title}</h3>
    <p>
      {description}
    </p>
  </div>

  <ul class="mt-4 flex items-center gap-x-4">
    {#if lighthouse}
      <li class="relative h-[36px] w-[36px]">
        <a href={lighthouse.link} target="_blank" rel="noreferrer">
          <p
            class="absolute inset-0 flex items-center justify-center rounded-full border-2 border-[#34D399] text-xs text-green-50 shadow-sm"
          >
            {lighthouse.score}
          </p>
        </a>
      </li>
    {/if}
    {#if githubLink}
      <ProjectLink name="GitHub" link={githubLink} />
    {/if}
    {#if webLink}
      <ProjectLink name="Web" link={webLink} />
    {/if}
    {#if googlePlayLink}
      <ProjectLink name="Google Play" link={googlePlayLink} />
    {/if}
  </ul>
</article>
