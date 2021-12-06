<script lang="ts">
  export const variant: "primary" | "text" = "primary"

  let className = ""
  export { className as class }
</script>

{#if variant === "primary"}
  <button
    class="transition bg-white p-4 text-black rounded-xl font-bold hover:bg-gray-100 ring-2 ring-white hover:ring-offset-4 ring-offset-default-900 {className}"
  >
    <slot />
  </button>
{:else}
  <button class={className}>
    <slot />
  </button>
{/if}
