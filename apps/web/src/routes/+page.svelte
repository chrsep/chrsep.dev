<script lang="ts">
  import { fade } from "svelte/transition"

  import SocialLink from "$lib/social-link.svelte"
  import Project from "$lib/projects.svelte"
  import TechStacks from "$lib/tech-stacks.svelte"

  import JoyfulImage from "$images/portofolio/joyful.png?w=300;500;700;1200&format=avif;webp;jpg&as=metadata"
  import ObserfyImage from "$images/portofolio/obserfy.png?w=300;500;700;1200&format=avif;webp;jpg&as=metadata"
  import AtreusImage from "$images/portofolio/atreus.png?w=300;500;700;1200&format=avif;webp;jpg&as=metadata"
  import SekitarmuImage from "$images/portofolio/sekitarmu.png?w=300;500;700;1200&format=avif;webp;jpg&as=metadata"
  import Image from "$lib/image.svelte"
  import ButtonLink from "$lib/button-link.svelte"
  import Icon from "$lib/icon.svelte"
  import Seo from "$lib/seo.svelte"
  import { m } from "$lib/paraglide/messages"
  import { localizeHref } from "$lib/paraglide/runtime"
  import { posthog } from "$lib/posthog"

  const globeModule = import("$lib/globe.svelte")
</script>

<Seo title={m.site_title()} description={m.site_description()} />

<div
  class="hero-bg relative overflow-hidden border-t border-[#ffffff0A]"
  in:fade={{ duration: 250 }}
>
  <header
    class="relative z-1 mx-auto max-w-[1920px] px-6 pt-6 pb-8 sm:px-8 sm:pt-40 sm:pb-16 md:h-[720px] md:px-32"
  >
    <ul class="mb-6 flex gap-4">
      <SocialLink
        text="@chrsep"
        href="https://github.com/chrsep"
        icon="/icons/github.svg"
        onclick={() =>
          posthog.capture("social link clicked", { platform: "github" })}
      />
      <SocialLink
        text="Chrisando"
        href="https://linkedin.com/in/chrsep"
        icon="/icons/linkedin.svg"
        onclick={() =>
          posthog.capture("social link clicked", { platform: "linkedin" })}
      />
      <SocialLink
        text="@_chrsep"
        href="https://twitter.com/_chrsep"
        icon="/icons/twitter.svg"
        onclick={() =>
          posthog.capture("social link clicked", { platform: "twitter" })}
      />
      <SocialLink
        text="@chrsep"
        href="https://stackoverflow.com/users/6656573/chrsep"
        class="hidden sm:flex"
        icon="/icons/stackoverflow.svg"
        onclick={() =>
          posthog.capture("social link clicked", { platform: "stackoverflow" })}
      />
    </ul>

    <h1 class="max-w-md text-xl sm:text-2xl">
      <span class="text-ink-900 font-black">{m.home_hero_greeting()}</span>
      <span class="text-ink-700">
        <!-- eslint-disable-next-line svelte/no-at-html-tags -- static, developer-authored message -->
        {@html m.home_hero_pitch()}
      </span>
    </h1>

    <div class="mt-8">
      <ButtonLink
        href="mailto:hi@chrsep.dev"
        class="group mb-4 !inline-block w-full sm:mr-2 sm:mb-0 sm:w-auto"
        onclick={() =>
          posthog.capture("contact cta clicked", { location: "hero" })}
      >
        {m.lets_work_together()}
        <span
          class="mr-1 ml-auto transform transition-transform duration-200 ease-in-out group-hover:translate-x-2 sm:ml-3"
        >
          ->
        </span>
      </ButtonLink>

      <ButtonLink
        variant="secondary"
        href={localizeHref("/cv")}
        class="group !inline-block w-full sm:w-auto"
      >
        {m.home_more_about_me()}
        <span
          class="mr-1 ml-auto transform text-lg transition-transform duration-200 ease-in-out group-hover:translate-x-2 sm:ml-3"
        >
          👨‍💻
        </span>
      </ButtonLink>
    </div>

    <div class="flex items-center">
      <TechStacks />
    </div>
  </header>

  {#await globeModule then m}
    {@const Globe = m.default}
    <Globe />
  {/await}
</div>

<div class="border-t border-[#ffffff0D] pt-16">
  <article
    class="bg-default-900 relative z-1 mx-auto max-w-[1920px] px-6 sm:px-8 md:px-32"
  >
    <div class="prose mb-8 max-w-lg">
      <h2>{m.home_projects_heading()}</h2>
      <p>
        {m.home_projects_body()}
      </p>
    </div>
  </article>

  <section
    class="mx-auto flex max-w-[1920px] snap-x snap-mandatory gap-8 overflow-auto pb-8 sm:px-8 md:grid md:grid-cols-2 md:px-32 lg:gap-16 xl:grid-cols-4 xl:gap-8"
  >
    <Project
      title="Obserfy"
      description={m.home_project_obserfy_description()}
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
      {#snippet image()}
        <Image
          meta={ObserfyImage}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 90vw"
          alt=""
        />
      {/snippet}
    </Project>

    <Project
      title="Joyful Montessori"
      description={m.home_project_joyful_description()}
      marketing
      webLink="https://www.joyfulmontessori.id"
      heroBg="bg-default-700"
      lighthouse={{
        score: 100,
        link: "https://lighthouse-metrics.com/checks/94428dfe-3b2f-4f97-8210-086b73c5ddfe",
      }}
    >
      {#snippet image()}
        <Image
          meta={JoyfulImage}
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 90vw"
          alt=""
        />
      {/snippet}
    </Project>

    <Project
      title="Sekitarmu"
      description={m.home_project_sekitarmu_description()}
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
      {#snippet image()}
        <Image
          meta={SekitarmuImage}
          loading="lazy"
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 90vw"
          alt=""
        />
      {/snippet}
    </Project>

    <Project
      title="Atreus"
      description={m.home_project_atreus_description()}
      openSource
      webApp
      githubLink="https://github.com/chrsep/atreus"
      heroBg="bg-default-700"
    >
      {#snippet image()}
        <Image
          meta={AtreusImage}
          loading="lazy"
          sizes="(min-width: 1280px) 25vw, (min-width: 768px) 50vw, 90vw"
          alt=""
        />
      {/snippet}
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

  <section class="mt-8 flex items-center">
    <div class="relative mx-auto inline-block">
      <div
        class="absolute -z-10 h-40 w-40 rounded-full bg-indigo-800 opacity-80 blur-3xl filter"
      ></div>
      <div
        class="absolute right-0 bottom-0 -z-10 h-40 w-40 rounded-full bg-blue-800 opacity-80 blur-3xl filter"
      ></div>

      <div
        class="bg-default-700 bg-opacity-60 border-opacity-10 m-6 items-end rounded-3xl border border-white p-6 lg:flex"
      >
        <div class="prose prose-sm max-w-md">
          <h2>{m.home_open_source_heading()}</h2>
          <p>
            {m.home_open_source_body()}
          </p>
        </div>

        <ButtonLink
          href="https://github.com/chrsep"
          target="_blank"
          rel="noreferrer"
          class="mt-6 ml-0 w-full flex-shrink-0 !px-6 !py-4 text-xs sm:w-auto lg:ml-8"
          onclick={() => posthog.capture("github cta clicked")}
        >
          {m.home_open_source_cta()}
          <Icon
            --src="url(/icons/github.svg)"
            class={"ml-auto h-4 w-4 bg-black lg:ml-4"}
          />
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
