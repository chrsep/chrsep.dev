<script lang="ts">
  import Nav from "../components/Nav.svelte"

  export let segment: string
</script>


<Nav {segment} />

<main class="p-3 max-w-6xl mx-auto dark">
  <slot />
</main>
