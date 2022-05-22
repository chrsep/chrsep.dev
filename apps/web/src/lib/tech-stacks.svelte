<script lang="ts">
  import Icon from "./icon.svelte"

  const techs = [
    {
      icon: "/icons/react.svg",
      name: "React",
      hoverColor: "group-hover:bg-[#61DAFB]",
    },
    {
      icon: "/icons/nextdotjs.svg",
      name: "NextJS",
      hoverColor: "group-hover:bg-white",
    },
    {
      icon: "/icons/gatsby.svg",
      name: "Gatsby",
      hoverColor: "group-hover:bg-white",
    },
    {
      icon: "/icons/typescript.svg",
      name: "TypeScript",
      hoverColor: "group-hover:bg-[#3178C6]",
    },
    {
      icon: "/icons/tailwindcss.svg",
      name: "TailwindCSS",
      hoverColor: "group-hover:bg-[#38B2AC]",
    },
    {
      icon: "/icons/go.svg",
      name: "Go",
      hoverColor: "group-hover:bt-[#00ADD8]",
    },
    {
      icon: "/icons/prisma.svg",
      name: "Prisma",
      hoverColor: "group-hover:bg-white",
    },
    {
      icon: "/icons/postgresql.svg",
      name: "PostgreSQL",
      hoverColor: "group-hover:bg-[#D9D9D9]",
    },
    {
      icon: "/icons/kotlin.svg",
      name: "Kotlin",
      hoverColor: "group-hover:bg-[#0095D5]",
    },
    {
      icon: "/icons/android.svg",
      name: "Android",
      hoverColor: "group-hover:bg-[#3DDC84]",
    },
  ]
</script>

<div class="mt-2 mb-16 flex rounded-full p-2">
  {#each techs as tech}
    <div class="hover:z-1 group -ml-3 flex">
      <div
        class="rounded-full border-4 border-bg-default-900 bg-default-800 p-2"
      >
        <Icon
          --src="url({tech.icon})"
          class="h-4 w-4 bg-default-500 {tech.hoverColor} transition-colors"
        />
      </div>
    </div>
  {/each}
</div>
