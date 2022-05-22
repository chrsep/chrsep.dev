<script lang="ts">
  import NextIcon from "$icons/nextdotjs.svg"
  import GatsbyIcon from "$icons/gatsby.svg"
  import ReactIcon from "$icons/react.svg"
  import TypeScriptIcon from "$icons/typescript.svg"
  import TailwindIcon from "$icons/tailwindcss.svg"
  import GoIcon from "$icons/go.svg"
  import PrismaIcon from "$icons/prisma.svg"
  import PostgresqlIcon from "$icons/postgresql.svg"
  import KotlinIcon from "$icons/kotlin.svg"
  import AndroidIcon from "$icons/android.svg"

  const techs = [
    {
      icon: ReactIcon,
      name: "React",
      hoverColor: "group-hover:text-[#61DAFB]",
    },
    { icon: NextIcon, name: "NextJS", hoverColor: "group-hover:text-white" },
    { icon: GatsbyIcon, name: "Gatsby", hoverColor: "group-hover:text-white" },
    {
      icon: TypeScriptIcon,
      name: "TypeScript",
      hoverColor: "group-hover:text-[#3178C6]",
    },
    {
      icon: TailwindIcon,
      name: "TailwindCSS",
      hoverColor: "group-hover:text-[#38B2AC]",
    },
    { icon: GoIcon, name: "Go", hoverColor: "group-hover:text-[#00ADD8]" },
    { icon: PrismaIcon, name: "Prisma", hoverColor: "group-hover:text-white" },
    {
      icon: PostgresqlIcon,
      name: "PostgreSQL",
      hoverColor: "group-hover:text-[#D9D9D9]",
    },
    {
      icon: KotlinIcon,
      name: "Kotlin",
      hoverColor: "group-hover:text-[#0095D5]",
    },
    {
      icon: AndroidIcon,
      name: "Android",
      hoverColor: "group-hover:text-[#3DDC84]",
    },
  ]
</script>

<div class="mt-2 mb-16 inline-block flex rounded-full p-2">
  {#each techs as tech}
    <div class="hover:z-1 group -ml-3 flex">
      <div
        class="rounded-full border-4 border-bg-default-900 bg-default-900 bg-default-700 p-2"
      >
        <svelte:component
          this={tech.icon}
          class="h-4 w-4 text-default-600 {tech.hoverColor}"
        />
      </div>
    </div>
  {/each}
</div>
