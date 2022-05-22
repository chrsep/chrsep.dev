<script lang="ts">
  export let href: string
  export let text: string

  let className: string = ""
  export { className as class }
</script>

<li>
  <a
    {href}
    class="flex items-center text-sm font-medium opacity-40 transition-opacity hover:opacity-100 {className}"
    target="_blank"
    rel="noreferrer"
  >
    <slot name="icon" class="mr-1 h-4 w-4 object-cover" width="16px" />
    {text}
  </a>
</li>
