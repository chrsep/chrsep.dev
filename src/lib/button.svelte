<script lang="ts">
  export let variant: "primary" | "secondary" = "primary"

  let className = ""
  export { className as class }
</script>

{#if variant === "primary"}
  <button
    class="flex items-center justify-start rounded-xl bg-white py-4 px-6 font-bold text-black ring-0 ring-white ring-offset-default-900 transition duration-200 ease-in-out hover:bg-gray-100 hover:ring-2 hover:ring-offset-4 {className}"
  >
    <slot />
  </button>
{:else}
  <button
    class="flex justify-start items-center transition text-white py-4 px-6 text-black rounded-xl font-bold bg-default-700 ring-0 hover:ring-2 ring-white hover:ring-offset-4 ring-offset-default-900 ease-in-out duration-200 {className}"
  >
    <slot />
  </button>
{/if}
