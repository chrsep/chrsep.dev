<script lang="ts">
  import type { Snippet } from "svelte"

  let {
    text,
    web,
    ringHoverClass,
    iconGroupHoverClass,
    icon,
  }: {
    text: string
    web: string
    ringHoverClass: string
    iconGroupHoverClass: string
    icon?: Snippet<[{ class: string }]>
  } = $props()
</script>

<li class="flex-shrink-0">
  <a
    href={web}
    class="text-ink-800 rounded-xl border px-3 py-2 text-xs hover:ring-2 sm:px-4 sm:py-3 {ringHoverClass} group bg-default-900 flex items-center border-[#ffffff0D] transition"
    target="_blank"
    rel="noreferrer"
  >
    {@render icon?.({
      class: `mr-3 !h-[16px] !w-[16px] ${iconGroupHoverClass} transition`,
    })}

    {text}
  </a>
</li>
