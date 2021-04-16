<script lang="ts">
  import "../app.postcss"
  import Navbar from "../lib/Navbar.svelte"
</script>

<Navbar />

<div class="dark">
  <slot />
</div>
