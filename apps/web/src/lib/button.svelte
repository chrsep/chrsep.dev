<script lang="ts">
  import type { Snippet } from "svelte"

  let {
    variant = "primary",
    class: className = "",
    children,
  }: {
    variant?: "primary" | "secondary"
    class?: string
    children?: Snippet
  } = $props()
</script>

{#if variant === "primary"}
  <button
    class="ring-offset-default-900 flex items-center justify-start rounded-xl bg-white px-6 py-4 font-bold text-black ring-0 ring-white transition duration-200 ease-in-out hover:bg-gray-100 hover:ring-2 hover:ring-offset-4 {className}"
  >
    {@render children?.()}
  </button>
{:else}
  <button
    class="bg-default-700 ring-offset-default-900 flex items-center justify-start rounded-xl px-6 py-4 font-bold text-white ring-0 ring-white transition duration-200 ease-in-out hover:ring-2 hover:ring-offset-4 {className}"
  >
    {@render children?.()}
  </button>
{/if}
