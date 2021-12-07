<script lang="ts">
  export const variant: "primary" | "text" = "primary"

  let className = ""
  export { className as class }
</script>

{#if variant === "primary"}
  <button
    class="flex justify-center items-center transition bg-white p-4 text-black rounded-xl font-bold hover:bg-gray-100 ring-0 hover:ring-2 ring-white hover:ring-offset-4 ring-offset-default-900 ease-in-out duration-200 {className}"
  >
    <slot />
  </button>
{:else}
  <button class={className}>
    <slot />
  </button>
{/if}
