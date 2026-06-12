<script lang="ts">
  let { class: className = "" }: { class?: string } = $props()
</script>

<div role="img" aria-hidden="true" class="icon h-5 w-5 bg-white {className}"></div>

<style>
  .icon {
    mask-image: var(--src);
    mask-size: 100%;
    mask-repeat: no-repeat;
  }
</style>
