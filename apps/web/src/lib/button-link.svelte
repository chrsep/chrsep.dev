<script lang="ts">
  import type { Snippet } from "svelte"

  let {
    variant = "primary",
    class: className = "",
    href = "",
    target = "",
    rel = "",
    onclick,
    children,
  }: {
    variant?: "primary" | "secondary"
    class?: string
    href?: string
    target?: string
    rel?: string
    onclick?: (event: MouseEvent) => void
    children?: Snippet
  } = $props()
</script>

{#if variant === "primary"}
  <a
    class="ring-offset-default-900 flex items-center justify-start rounded-xl bg-white px-6 py-4 font-bold text-black ring-0 ring-white transition duration-200 ease-in-out hover:bg-gray-100 hover:ring-2 hover:ring-offset-4 {className}"
    {href}
    {rel}
    {target}
    {onclick}
  >
    {@render children?.()}
  </a>
{:else}
  <a
    class="bg-default-700 ring-offset-default-900 flex items-center justify-start rounded-xl px-6 py-4 font-bold text-white ring-0 ring-white transition duration-200 ease-in-out hover:ring-2 hover:ring-offset-4 {className}"
    {href}
    {rel}
    {target}
    {onclick}
  >
    {@render children?.()}
  </a>
{/if}
