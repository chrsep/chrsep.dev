<script lang="ts">
  import ProjectTag from "$lib/project-tag.svelte"
  import ProjectLink from "$lib/project-link.svelte"

  export let title: string
  export let description: string

  export let githubLink: string = null
  export let webLink: string = null
  export let googlePlayLink: string = null

  export let saas: boolean = false
  export let ecommerce: boolean = false
  export let marketing: boolean = false
  export let openSource: boolean = false
  export let android: boolean = false
  export let webApp: boolean = false

  export let lighthouse: {
    score: number
    link: string
  } = null

  export let heroBg: string
</script>

<article
  class="w-[70vw] flex-shrink-0 snap-center first:ml-6 last:mr-6 sm:mb-4 sm:w-auto sm:basis-1/2 sm:first:ml-0 sm:last:mr-0 xl:basis-1/4"
>
  <div
    class="aspect-w-3 aspect-h-4 mb-6 overflow-hidden rounded-2xl shadow-lg {heroBg}"
  >
    <slot name="image" />
  </div>

  <ul class="mb-4 flex flex-wrap gap-2">
    {#if saas}
      <ProjectTag name="SaaS" bgColor="bg-red-50 text-red-900" />
    {/if}
    {#if ecommerce}
      <ProjectTag name="E-commerce" bgColor="bg-green-50 text-green-900" />
    {/if}
    {#if marketing}
      <ProjectTag
        name="Marketing Site"
        bgColor="bg-yellow-50 !text-yellow-900"
      />
    {/if}
    {#if openSource}
      <ProjectTag name="Open Source" bgColor="bg-blue-50 text-blue-900" />
    {/if}
    {#if android}
      <ProjectTag name="Android" bgColor="bg-teal-50 text-teal-900" />
    {/if}
    {#if webApp}
      <ProjectTag name="Web Application" bgColor="bg-teal-50 text-teal-900" />
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
            class="border-2 absolute inset-0 flex items-center justify-center rounded-full border-[#34D399] text-xs text-green-50 shadow-sm"
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
