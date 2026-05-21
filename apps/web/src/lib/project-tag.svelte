<script lang="ts">
  let {
    name,
    bgColor = "bg-blue-700",
    class: className = "",
  }: { name: string; bgColor?: string; class?: string } = $props()
</script>

<li
  class="flex-shrink-0 rounded-full px-3 py-1 text-xs text-blue-100 {bgColor} {className}"
>
  {name}
</li>
