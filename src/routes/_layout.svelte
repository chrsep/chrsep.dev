<script lang="ts">
  import Nav from "../components/Nav.svelte"

  export let segment: string
</script>

<style global lang="postcss">
  @tailwind base;
  @tailwind components;
  @tailwind utilities;
</style>

<Nav {segment} />

<main>
  <slot />
</main>
