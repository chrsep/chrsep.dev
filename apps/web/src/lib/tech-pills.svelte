<script lang="ts">
  export let text: string
  export let web: string
  export let ringHoverClass: string
  export let iconGroupHoverClass: string
</script>

<li class="flex-shrink-0">
  <a
    href={web}
    class="rounded-xl border px-3 py-2 text-xs text-default-800 hover:ring-2 sm:px-4 sm:py-3 {ringHoverClass} group flex items-center border-[#ffffff0D] bg-default-900 transition"
    target="_blank"
    rel="noreferrer"
  >
    <slot
      name="icon"
      class="mr-3 !h-[16px] !w-[16px] {iconGroupHoverClass} transition"
    />

    {text}
  </a>
</li>
