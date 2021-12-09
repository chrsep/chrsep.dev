<script lang="ts" context="module">
  import { fade } from "svelte/transition"

  import TechPills from "$lib/tech-pills.svelte"
  import SocialLink from "$lib/social-link.svelte"
  import Project from "$lib/projects.svelte"
  import Button from "$lib/button.svelte"

  import GithubIcon from "$icons/github.svg"
  import StackOverflowIcon from "$icons/stackoverflow.svg"
  import TwitterIcon from "$icons/twitter.svg"
  import LinkedinIcon from "$icons/linkedin.svg"

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

  const globe = import("$lib/globe.svelte")

  export const prerender = true
</script>

<div class="relative overflow-hidden" in:fade={{ duration: 250 }}>
  <header
    class="px-6 sm:px-8 pb-8 sm:pb-16 pt-28 sm:pt-40 md:px-32 relative z-1 max-w-[1920px] mx-auto"
  >
    <ul class="flex mb-6 gap-4">
      <SocialLink
        text="@chrsep"
        href="https://github.com/chrsep"
        icon="/icons/github.svg"
      >
        <GithubIcon slot="icon" let:class={className} class={className} />
      </SocialLink>

      <SocialLink
        text="Chrisando"
        href="https://linkedin.com/in/chrsep"
        icon="/icons/linkedin.svg"
      >
        <LinkedinIcon slot="icon" let:class={className} class={className} />
      </SocialLink>
      <SocialLink
        text="@_chrsep"
        href="https://twitter.com/_chrsep"
        icon="/icons/twitter.svg"
      >
        <TwitterIcon slot="icon" let:class={className} class={className} />
      </SocialLink>
      <SocialLink
        text="@chrsep"
        href="https://stackoverflow.com/users/story/6656573"
        icon="/icons/stackoverflow.svg"
        class="hidden sm:flex"
      >
        <StackOverflowIcon
          slot="icon"
          let:class={className}
          class={className}
        />
      </SocialLink>
    </ul>

    <h1 class="text-xl sm:text-2xl max-w-md">
      <span class="font-black text-default-900">👋 Hi there, I'm Chris!</span>
      <span class="text-default-700">
        I'm a fullstack software developer from Indonesia. I help businesses
        build <b class="text-default-900">fast</b> and
        <b class="text-default-900">beautiful</b> websites and apps.
      </span>
    </h1>

    <div class="mt-8">
      <a
        href="mailto:hi@chrsep.dev"
        class="inline-block w-full sm:w-auto mb-4 sm:mb-0 sm:mr-4"
      >
        <Button class="w-full sm:w-auto group">
          Let's work together!
          <span
            class="transition-transform transform mr-1 group-hover:translate-x-2 ease-in-out duration-200 ml-auto sm:ml-3"
          >
            ->
          </span>
        </Button>
      </a>

      <a href="/cv" class="inline-block w-full sm:w-auto ">
        <Button variant="secondary" class="w-full sm:w-auto group">
          Get to know me
          <span
            class="text-lg transition-transform transform mr-1 group-hover:translate-x-2 ease-in-out duration-200 ml-auto sm:ml-3"
          >
            👨‍💻
          </span>
        </Button>
      </a>
    </div>
  </header>

  <article
    class="px-6 pt-16 sm:px-8 md:px-32 pb-16 relative z-1 max-w-[1920px] mx-auto"
  >
    <h2 class="font-bold text-xl mb-4 sm:mb-6 text-gray-300">
      Techs I work with
    </h2>

    <ul class="flex flex-wrap max-w-2xl gap-2">
      <TechPills
        text="Next"
        web="https://nextjs.org"
        icon="/icons/nextdotjs.svg"
        ringHoverClass="hover:ring-white"
        iconGroupHoverClass="group-hover:text-white"
      >
        <NextIcon let:class={className} class={className} slot="icon" />
      </TechPills>
      <TechPills
        text="Gatsby"
        web="https://gatsbyjs.com"
        icon="/icons/gatsby.svg"
        ringHoverClass="hover:ring-[#663399]"
        iconGroupHoverClass="group-hover:text-white"
      >
        <GatsbyIcon let:class={className} class={className} slot="icon" />
      </TechPills>
      <TechPills
        text="React / Preact"
        web="https://reactjs.org"
        icon="/icons/react.svg"
        ringHoverClass="hover:ring-[#61DAFB]"
        iconGroupHoverClass="group-hover:text-[#61DAFB]"
      >
        <ReactIcon let:class={className} class={className} slot="icon" />
      </TechPills>
      <TechPills
        text="Typescript"
        web="https://typescriptlang.org"
        icon="/icons/typescript.svg"
        ringHoverClass="hover:ring-[#3178C6]"
        iconGroupHoverClass="group-hover:text-[#3178C6]"
      >
        <TypeScriptIcon let:class={className} class={className} slot="icon" />
      </TechPills>
      <TechPills
        text="Tailwind"
        web="https://tailwindcss.com"
        icon="/icons/tailwindcss.svg"
        ringHoverClass="hover:ring-[#38B2AC]"
        iconGroupHoverClass="group-hover:text-[#38B2AC]"
      >
        <TailwindIcon let:class={className} class={className} slot="icon" />
      </TechPills>
      <TechPills
        text="Golang"
        web="https://golang.org"
        icon="/icons/go.svg"
        ringHoverClass="hover:ring-[#00ADD8]"
        iconGroupHoverClass="group-hover:text-[#00ADD8]"
      >
        <GoIcon let:class={className} class={className} slot="icon" />
      </TechPills>
      <TechPills
        text="Prisma"
        web="https://www.prisma.io/"
        icon="/icons/prisma.svg"
        ringHoverClass="hover:ring-white"
        iconGroupHoverClass="group-hover:text-white"
      >
        <PrismaIcon let:class={className} class={className} slot="icon" />
      </TechPills>
      <TechPills
        text="Postgres"
        web="https://www.postgresql.org/"
        icon="/icons/postgresql.svg"
        ringHoverClass="hover:ring-[#4169E1]"
        iconGroupHoverClass="group-hover:text-white]"
      >
        <PostgresqlIcon let:class={className} class={className} slot="icon" />
      </TechPills>
      <TechPills
        text="Kotlin"
        web="https://kotlinlang.org/"
        icon="/icons/kotlin.svg"
        ringHoverClass="hover:ring-[#0095D5]"
        iconGroupHoverClass="group-hover:text-[#0095D5]"
      >
        <KotlinIcon let:class={className} class={className} slot="icon" />
      </TechPills>
      <TechPills
        text="Android"
        web="https://developer.android.com/"
        icon="/icons/android.svg"
        ringHoverClass="hover:ring-[#3DDC84]"
        iconGroupHoverClass="group-hover:text-[#3DDC84]"
      >
        <AndroidIcon let:class={className} class={className} slot="icon" />
      </TechPills>
    </ul>
  </article>

  {#await globe then module}
    <svelte:component this={module.default} />
  {/await}
</div>

<div class="border-t border-b border-[#ffffff0D]">
  <article
    class="px-6 sm:px-8 md:px-32 mb-32 py-16 bg-default-900  z-1 relative max-w-[1920px] mx-auto"
  >
    <h2 class="font-bold text-3xl mb-8 leading-tight">
      <span class="mr-1">🛠</span>️ Some things I've worked on
    </h2>

    <section
      class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-12 sm:gap-8"
    >
      <Project
        title="Obserfy"
        description="Record keeping and parent communication tool for Montessori Schools."
        saas
        openSource
        githubLink="https://github.com/obserfy/obserfy"
        webLink="https://obserfy.com"
        heroBg="bg-gradient-to-br from-teal-500 to-green-400"
        lighthouse={{
          score: 95,
          link: "https://lighthouse-metrics.com/checks/e60a7390-4ae2-4bad-9117-5c45592c4875",
        }}
      />
      <Project
        title="Joyful Montessori"
        description="Marketing site and blog for a Montessori Preschool. Built for speed and high conversion."
        marketing
        webLink="https://www.joyfulmontessori.id"
        heroBg="bg-gradient-to-br from-pink-600 to-fuchsia-600"
        lighthouse={{
          score: 100,
          link: "https://lighthouse-metrics.com/checks/94428dfe-3b2f-4f97-8210-086b73c5ddfe",
        }}
      />
      <Project
        title="Sekitarmu"
        description="A platform for discovering local small and medium businesses in a Community."
        ecommerce
        openSource
        webLink="https://www.sekitarmu.id"
        githubLink="https://github.com/chrsep/grayson"
        heroBg="bg-gradient-to-br from-blue-800 to-sky-600"
        lighthouse={{
          score: 92,
          link: "https://lighthouse-metrics.com/checks/271a1f5e-6f0a-425a-86d1-d50600008b18",
        }}
      />
      <Project
        title="Atreus"
        description="Automated asset discovery service built for bug bounty."
        openSource
        webApp
        githubLink="https://github.com/chrsep/atreus"
        heroBg="bg-gradient-to-br from-purple-500 to-indigo-600"
      />
      <Project
        title="Portal"
        description="Offline-first android app for keeping track of campus info and activities with over 20k downloads."
        android
        openSource
        githubLink="https://github.com/chrsep/Kingfish"
        googlePlayLink="https://play.google.com/store/apps/details?id=com.directdev.portal"
        heroBg="bg-gradient-to-br from-gray-800 to-gray-700"
      />
      <Project
        title="Timetravelers"
        description="Product listing for Travel agency, offering a wide range of travel packages and visa services."
        ecommerce
        webLink="https://timetravelers.id"
        heroBg="bg-gradient-to-br from-yellow-400 to-orange-500"
      />
    </section>
  </article>
</div>
