<script lang="ts">
  import Nav from "../components/Nav.svelte"

  export let segment: string
</script>


<style global>
  body {
      @apply bg-black;
  }
</style>

<div>
  <Nav {segment} />

  <main class="p-3 max-w-6xl mx-auto dark">
    <slot />
  </main>
</div>

