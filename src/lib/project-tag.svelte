<script lang="ts">
  let className = ""
  export { className as class }

  export let name: string
  export let bgColor: string = "bg-blue-700"
</script>

<li
  class="text-xs px-3 py-1 rounded-full text-blue-100 flex-shrink-0 {bgColor} {className}"
>
  {name}
</li>
