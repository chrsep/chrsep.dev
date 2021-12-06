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

<article class="mb-4 md:mb-8">
  <div
    class="aspect-w-16 aspect-h-9 bg-red-200 mb-6 rounded-xl sm:rounded-2xl xl:rounded-3xl shadow-lg {heroBg}"
  />

  <ul class="flex flex-wrap mb-4 gap-2">
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

  <h3 class="mb-1 text-lg font-bold">{title}</h3>
  <p class="text-default-800 max-w-md">{description}</p>

  <ul class="flex items-center gap-x-4 mt-4">
    {#if lighthouse}
      <li class="relative w-[32px] h-[32px]">
        <a href="#">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 64 64"
            stroke-width="6"
            class="overflow-visible"
            fill="none"
            height="32"
            width="32"
          >
            <circle
              cx="32"
              cy="32"
              r="29"
              fill="none"
              stroke="currentColor"
              transform="rotate(-90 32 32)"
            />
            <circle
              cx="32"
              cy="32"
              r="29"
              fill="none"
              stroke="#34D399"
              stroke-dasharray="182.212373908208 182.212373908208"
              stroke-dashoffset="29.153979825313286"
              stroke-linecap="round"
              stroke-linejoin="round"
              transform="rotate(-90 32 32)"
              class="filter drop-shadow-sm"
            />
          </svg>
          <p
            class="flex items-center justify-center absolute inset-0 text-xs text-green-50 shadow-sm"
          >
            93
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
