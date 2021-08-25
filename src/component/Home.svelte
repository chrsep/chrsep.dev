<script lang="ts">
  import BaseLayout from "$layout/BaseLayout";
  import SocialLink from "$component/SocialLink.svelte";
  import TechPills from "$component/TechPills.svelte";
</script>

<BaseLayout>
  <section class="px-8 py-8 md:pt-32 md:px-32">
    <div class="flex mb-6">
      <SocialLink text="@chrsep" href="https://github.com/chrsep" icon="/icons/github.svg" />
      <SocialLink text="@_chrsep" href="https://twitter.com/_chrsep" icon="/icons/twitter.svg" />
    </div>

    <h1 class="font-bold text-4xl sm:text-6xl leading-none mb-6">
      Chrisando E. <br /> Pramudhita
    </h1>

    <p class="sm:text-xl max-w-lg text-secondary">
      Hi there, I'm a fullstack software developer from Indonesia 🇮🇩. I help people
      build fast and beautiful digital experiences.
    </p>
  </section>

  <section class="px-8 md:px-32 mb-32">
    <h2 class="font-bold text-xl mb-4 sm:mb-6">Techs I work with</h2>

    <ul class="flex flex-wrap max-w-2xl">
      <TechPills
        text="Next" web="https://nextjs.org"
        icon="/icons/nextdotjs.svg"
        ringHoverClass="hover:ring-white"
        iconGroupHoverClass="group-hover:bg-white" />
      <TechPills
        text="Gatsby" web="https://gatsbyjs.com"
        icon="/icons/gatsby.svg"
        ringHoverClass="hover:ring-[#663399]"
        iconGroupHoverClass="group-hover:bg-white" />
      <TechPills
        text="React / Preact"
        web="https://reactjs.org"
        icon="/icons/react.svg"
        ringHoverClass="hover:ring-[#61DAFB]"
        iconGroupHoverClass="group-hover:bg-[#61DAFB]" />
      <TechPills
        text="Typescript"
        web="https://typescriptlang.org"
        icon="/icons/typescript.svg"
        ringHoverClass="hover:ring-[#3178C6]"
        iconGroupHoverClass="group-hover:bg-[#3178C6]" />
      <TechPills
        text="Tailwind" web="https://tailwindcss.com"
        icon="/icons/tailwindcss.svg"
        ringHoverClass="hover:ring-[#38B2AC]"
        iconGroupHoverClass="group-hover:bg-[#38B2AC]" />
      <TechPills
        text="Go"
        web="https://golang.org"
        icon="/icons/go.svg"
        ringHoverClass="hover:ring-[#00ADD8]"
        iconGroupHoverClass="group-hover:bg-[#00ADD8]" />
      <TechPills
        text="Prisma"
        web="https://www.prisma.io/"
        icon="/icons/prisma.svg"
        ringHoverClass="hover:ring-white"
        iconGroupHoverClass="group-hover:bg-white" />
      <TechPills
        text="Postgres"
        web="https://www.postgresql.org/"
        icon="/icons/postgresql.svg"
        ringHoverClass="hover:ring-[#4169E1]"
        iconGroupHoverClass="group-hover:bg-white]" />
      <TechPills
        text="Kotlin"
        web="https://kotlinlang.org/"
        icon="/icons/kotlin.svg"
        ringHoverClass="hover:ring-[#0095D5]"
        iconGroupHoverClass="group-hover:bg-[#0095D5]" />
      <TechPills
        text="Android"
        web="https://developer.android.com/"
        icon="/icons/android.svg"
        ringHoverClass="hover:ring-[#3DDC84]"
        iconGroupHoverClass="group-hover:bg-[#3DDC84]" />
    </ul>
  </section>
</BaseLayout>
