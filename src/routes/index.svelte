<script lang="ts" context="module">
  import { fade } from "svelte/transition"
  import SocialLink from "$lib/social-link.svelte"
  import Project from "$lib/projects.svelte"
  import TechStacks from "$lib/tech-stacks.svelte"

  import GithubIcon from "$icons/github.svg"
  import StackOverflowIcon from "$icons/stackoverflow.svg"
  import TwitterIcon from "$icons/twitter.svg"
  import LinkedinIcon from "$icons/linkedin.svg"

  import JoyfulImage from "$images/portofolio/joyful.png?width=300;500;700;1200&format=avif;webp;jpg&meta"
  import ObserfyImage from "$images/portofolio/obserfy.png?width=300;500;700;1200&format=avif;webp;jpg&meta"
  import AtreusImage from "$images/portofolio/atreus.png?width=300;500;700;1200&format=avif;webp;jpg&meta"
  import SekitarmuImage from "$images/portofolio/sekitarmu.png?width=300;500;700;1200&format=avif;webp;jpg&meta"
  import Image from "$lib/image.svelte"
  import ButtonLink from "$lib/button-link.svelte"

  const globe = import("$lib/globe.svelte")

  export const prerender = true
</script>

<div
  class="relative overflow-hidden hero-bg border-t border-[#ffffff0A]"
  in:fade={{ duration: 250 }}
>
  <header
    class="px-6 sm:px-8 pb-8 sm:pb-16 pt-6 sm:pt-40 md:px-32 relative z-1 max-w-[1920px] mx-auto md:h-[720px]"
  >
    <ul class="flex mb-6 gap-4">
      <SocialLink text="@chrsep" href="https://github.com/chrsep">
        <GithubIcon slot="icon" let:class={className} class={className} />
      </SocialLink>
      <SocialLink text="Chrisando" href="https://linkedin.com/in/chrsep">
        <LinkedinIcon slot="icon" let:class={className} class={className} />
      </SocialLink>
      <SocialLink text="@_chrsep" href="https://twitter.com/_chrsep">
        <TwitterIcon slot="icon" let:class={className} class={className} />
      </SocialLink>
      <SocialLink
        text="@chrsep"
        href="https://stackoverflow.com/users/6656573/chrsep"
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
        <b class="text-default-900">beautiful</b> websites and web-apps.
      </span>
    </h1>

    <div class="mt-8">
      <ButtonLink
        href="mailto:hi@chrsep.dev"
        class="!inline-block w-full sm:w-auto mb-4 sm:mb-0 sm:mr-2 group"
      >
        Let's work together!
        <span
          class="transition-transform transform mr-1 group-hover:translate-x-2 ease-in-out duration-200 ml-auto sm:ml-3"
        >
          ->
        </span>
      </ButtonLink>

      <ButtonLink variant="secondary" href="/cv" class="!inline-block w-full sm:w-auto group">
        More about me
        <span
          class="text-lg transition-transform transform mr-1 group-hover:translate-x-2 ease-in-out duration-200 ml-auto sm:ml-3"
        >
          👨‍💻
        </span>
      </ButtonLink>
    </div>

    <div class="flex items-center">
      <TechStacks />
    </div>
  </header>

  {#await globe then module}
    <svelte:component this={module.default} />
  {/await}
</div>

<div class="border-t border-[#ffffff0D] pt-16">
  <article
    class="px-6 sm:px-8 md:px-32 bg-default-900  z-1 relative max-w-[1920px] mx-auto"
  >
    <div class="mb-8 max-w-lg prose">
      <h2>Recent Projects</h2>
      <p>
        I love building and shipping products, so I try to learn things
        that allows me to fully ship a product on my own. Below are some recent
        projects I've been working on.
      </p>
    </div>
  </article>

  <section
    class="flex md:grid md:grid-cols-2 xl:grid-cols-4 overflow-auto md:px-32 sm:px-8 snap-x snap-mandatory gap-8 lg:gap-16 xl:gap-8 pb-8 max-w-[1920px] mx-auto"
  >
    <Project
      title="Obserfy"
      description="Record keeping and parent communication tool for Montessori Schools."
      saas
      openSource
      githubLink="https://github.com/obserfy/obserfy"
      webLink="https://obserfy.com"
      heroBg="bg-default-700"
      lighthouse={{
        score: 95,
        link: "https://lighthouse-metrics.com/checks/e60a7390-4ae2-4bad-9117-5c45592c4875",
      }}
    >
      <Image
        meta={ObserfyImage}
        slot="image"
        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 90vw"
        alt=""
      />
    </Project>

    <Project
      title="Joyful Montessori"
      description="Marketing site and blog for a Montessori Preschool. Built for speed and high conversion."
      marketing
      webLink="https://www.joyfulmontessori.id"
      heroBg="bg-default-700"
      lighthouse={{
        score: 100,
        link: "https://lighthouse-metrics.com/checks/94428dfe-3b2f-4f97-8210-086b73c5ddfe",
      }}
    >
      <Image
        meta={JoyfulImage}
        slot="image"
        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 90vw"
        alt=""
      />
    </Project>

    <Project
      title="Sekitarmu"
      description="A platform for discovering local small and medium businesses in a Community."
      ecommerce
      openSource
      webLink="https://www.sekitarmu.id"
      githubLink="https://github.com/chrsep/grayson"
      heroBg="bg-default-700"
      lighthouse={{
        score: 92,
        link: "https://lighthouse-metrics.com/checks/271a1f5e-6f0a-425a-86d1-d50600008b18",
      }}
    >
      <Image
        meta={SekitarmuImage}
        loading="lazy"
        slot="image"
        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 90vw"
        alt=""
      />
    </Project>

    <Project
      title="Atreus"
      description="Automated asset discovery service built for trying out bug bounty."
      openSource
      webApp
      githubLink="https://github.com/chrsep/atreus"
      heroBg="bg-default-700">
      <Image
        meta={AtreusImage}
        loading="lazy"
        slot="image"
        sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 90vw"
        alt=""
      />
    </Project>
    <!--      <Project-->
    <!--        title="Portal"-->
    <!--        description="Offline-first android app for keeping track of campus info and activities with over 20k downloads."-->
    <!--        android-->
    <!--        openSource-->
    <!--        githubLink="https://github.com/chrsep/Kingfish"-->
    <!--        googlePlayLink="https://play.google.com/store/apps/details?id=com.directdev.portal"-->
    <!--        heroBg="bg-gradient-to-br from-gray-800 to-gray-700"-->
    <!--      />-->
    <!--      <Project-->
    <!--        title="Timetravelers"-->
    <!--        description="Product listing for Travel agency, offering a wide range of travel packages and visa services."-->
    <!--        ecommerce-->
    <!--        webLink="https://timetravelers.id"-->
    <!--        heroBg="bg-gradient-to-br from-yellow-400 to-orange-500"-->
    <!--      />-->
  </section>

  <section class="flex items-center mt-8">
    <div class="mx-auto relative inline-block">
      <div
        class="w-40 h-40 absolute bg-indigo-800 rounded-full -z-10 filter blur-3xl opacity-80"
      />
      <div
        class="w-40 h-40 absolute bg-blue-800 rounded-full -z-10 filter blur-3xl bottom-0 right-0 opacity-80"
      />

      <div
        class="bg-default-700 bg-opacity-60 p-6 m-6 rounded-3xl lg:flex items-end border border-white border-opacity-10"
      >
        <div class="max-w-md prose prose-sm">
          <h2>Open Source</h2>
          <p>
            Most of my projects are open-sourced and I try to contribute back to
            the tools that I use when I can. Check out my contributions on GitHub!
          </p>
        </div>

        <ButtonLink
          href="https://github.com/chrsep"
          target="_blank"
          rel="noreferrer"
          class="ml-0 lg:ml-8 !px-6 !py-4 text-xs flex-shrink-0 mt-6 w-full sm:w-auto"
        >
          Explore GitHub
          <GithubIcon class={"w-4 h-4 ml-auto sm:ml-2"} />
        </ButtonLink>
      </div>
    </div>
  </section>
</div>

<style>
    .hero-bg {
        background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='88' height='24' viewBox='0 0 88 24'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='autumn' fill='%239C92AC' fill-opacity='0.04'%3E%3Cpath d='M10 0l30 15 2 1V2.18A10 10 0 0 0 41.76 0H39.7a8 8 0 0 1 .3 2.18v10.58L14.47 0H10zm31.76 24a10 10 0 0 0-5.29-6.76L4 1 2 0v13.82a10 10 0 0 0 5.53 8.94L10 24h4.47l-6.05-3.02A8 8 0 0 1 4 13.82V3.24l31.58 15.78A8 8 0 0 1 39.7 24h2.06zM78 24l2.47-1.24A10 10 0 0 0 86 13.82V0l-2 1-32.47 16.24A10 10 0 0 0 46.24 24h2.06a8 8 0 0 1 4.12-4.98L84 3.24v10.58a8 8 0 0 1-4.42 7.16L73.53 24H78zm0-24L48 15l-2 1V2.18A10 10 0 0 1 46.24 0h2.06a8 8 0 0 0-.3 2.18v10.58L73.53 0H78z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    }
</style>
