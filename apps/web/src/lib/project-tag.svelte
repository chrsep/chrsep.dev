<script lang="ts">
  let className = ""
  export { className as class }

  export let name: string
  export let bgColor: string = "bg-blue-700"
</script>

<li
  class="flex-shrink-0 rounded-full px-3 py-1 text-xs text-blue-100 {bgColor} {className}"
>
  {name}
</li>
