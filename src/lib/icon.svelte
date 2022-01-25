<script lang="ts">
  let className: string

  export { className as class }
</script>

<div role="img" aria-hidden="true" class="icon h-5 w-5 bg-white {className}" />

<style>
  .icon {
    mask-image: var(--icon-src);
    mask-size: 100%;
    mask-repeat: no-repeat;
  }
</style>
