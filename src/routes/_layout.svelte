<script lang="ts">
  import Nav from "../components/Nav.svelte"

  export let segment: string
</script>

<style lang="postcss">
  @import "/index.css";
</style>

<Nav {segment} />

<main class="p-3 max-w-6xl mx-auto">
  <slot />
</main>
