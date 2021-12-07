<script lang="ts">
  export let text: string
  export let web: string
  export let icon: string
  export let ringHoverClass: string
  export let iconGroupHoverClass: string
</script>

<li class="flex-shrink-0">
  <a
    href={web}
    class="text-default-800 border border-white rounded-xl text-xs sm:px-4 px-3 sm:py-3 py-2 border-opacity-20 hover:ring-2 {ringHoverClass} transition flex items-center group bg-default-900"
    target="_blank"
    rel="noreferrer"
  >
    <slot
      name="icon"
      class="mr-3 !w-[16px] !h-[16px] {iconGroupHoverClass} transition"
    />

    {text}
  </a>
</li>
