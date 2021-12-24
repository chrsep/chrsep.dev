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
    { icon: ReactIcon, name: "React", hoverColor: "group-hover:text-[#61DAFB]" },
    { icon: NextIcon, name: "NextJS", hoverColor: "group-hover:text-white" },
    { icon: GatsbyIcon, name: "Gatsby", hoverColor: "group-hover:text-white" },
    { icon: TypeScriptIcon, name: "TypeScript", hoverColor: "group-hover:text-[#3178C6]"},
    { icon: TailwindIcon, name: "TailwindCSS", hoverColor: "group-hover:text-[#38B2AC]" },
    { icon: GoIcon, name: "Go", hoverColor: "group-hover:text-[#00ADD8]" },
    { icon: PrismaIcon, name: "Prisma", hoverColor: "group-hover:text-white" },
    { icon: PostgresqlIcon, name: "PostgreSQL", hoverColor: "group-hover:text-[#D9D9D9]" },
    { icon: KotlinIcon, name: "Kotlin", hoverColor: "group-hover:text-[#0095D5]" },
    { icon: AndroidIcon, name: "Android", hoverColor: "group-hover:text-[#3DDC84]" },
  ]
</script>

<div class="flex inline-block rounded-full p-2 mt-3 mb-16">
  {#each techs as tech}
    <div class="-ml-3 flex hover:z-1 transition group">
      <div
        class="border-4 border-bg-default-900 rounded-full p-2 bg-default-900 bg-default-700"
      >
        <svelte:component
          this={tech.icon}
          class="w-4 h-4 text-default-900 group-hover:opacity-100 opacity-30 {tech.hoverColor}"
        />
      </div>
    </div>
  {/each}
</div>
