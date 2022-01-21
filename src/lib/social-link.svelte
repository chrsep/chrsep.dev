<script lang="ts">
  export let href: string
  export let text: string

  let className: string = ""
  export { className as class }
</script>

<li>
  <a
    {href}
    class="text-sm flex items-center transition-opacity opacity-40 font-medium hover:opacity-100 {className}"
    target="_blank"
    rel="noreferrer"
  >
    <slot name="icon" class="w-4 h-4 mr-1 object-cover" width="16px" />
    {text}
  </a>
</li>
