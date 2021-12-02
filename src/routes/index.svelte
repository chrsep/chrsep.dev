<script>
  import TechPills from "$lib/tech-pills.svelte"
  import SocialLink from "$lib/social-link.svelte"
  import Project from "$lib/projects.svelte"
</script>

<article class="px-8 py-8 md:pt-32 md:px-32">
  <div class="flex mb-6">
    <SocialLink
      text="@chrsep"
      href="https://github.com/chrsep"
      icon="/icons/github.svg"
      class="!font-base !opacity-80 font-bold"
    />
    <SocialLink
      text="@_chrsep"
      href="https://twitter.com/_chrsep"
      icon="/icons/twitter.svg"
    />
    <SocialLink
      text="@chrsep"
      href="https://stackoverflow.com/users/6656573/chrsep"
      icon="/icons/stackoverflow.svg"
    />
    <SocialLink
      text="Chrisando"
      href="https://linkedin.com/in/chrsep"
      icon="/icons/linkedin.svg"
    />
  </div>

  <h1 class="font-black text-4xl sm:text-6xl leading-none mb-6">
    Chrisando E. <br /> Pramudhita
  </h1>

  <p class="sm:text-xl max-w-lg text-default-800">
    Hi there, I'm a fullstack software developer from Indonesia 🇮🇩. I help build
    fast and beautiful digital experiences.
  </p>
</article>

<article class="px-8 md:px-32 mb-32">
  <h2 class="font-bold text-xl mb-4 sm:mb-6">Techs I work with</h2>

  <ul class="flex flex-wrap max-w-2xl">
    <TechPills
      text="Next"
      web="https://nextjs.org"
      icon="/icons/nextdotjs.svg"
      ringHoverClass="hover:ring-white"
      iconGroupHoverClass="group-hover:bg-white"
    />
    <TechPills
      text="Gatsby"
      web="https://gatsbyjs.com"
      icon="/icons/gatsby.svg"
      ringHoverClass="hover:ring-[#663399]"
      iconGroupHoverClass="group-hover:bg-white"
    />
    <TechPills
      text="React / Preact"
      web="https://reactjs.org"
      icon="/icons/react.svg"
      ringHoverClass="hover:ring-[#61DAFB]"
      iconGroupHoverClass="group-hover:bg-[#61DAFB]"
    />
    <TechPills
      text="Typescript"
      web="https://typescriptlang.org"
      icon="/icons/typescript.svg"
      ringHoverClass="hover:ring-[#3178C6]"
      iconGroupHoverClass="group-hover:bg-[#3178C6]"
    />
    <TechPills
      text="Tailwind"
      web="https://tailwindcss.com"
      icon="/icons/tailwindcss.svg"
      ringHoverClass="hover:ring-[#38B2AC]"
      iconGroupHoverClass="group-hover:bg-[#38B2AC]"
    />
    <TechPills
      text="Go"
      web="https://golang.org"
      icon="/icons/go.svg"
      ringHoverClass="hover:ring-[#00ADD8]"
      iconGroupHoverClass="group-hover:bg-[#00ADD8]"
    />
    <TechPills
      text="Prisma"
      web="https://www.prisma.io/"
      icon="/icons/prisma.svg"
      ringHoverClass="hover:ring-white"
      iconGroupHoverClass="group-hover:bg-white"
    />
    <TechPills
      text="Postgres"
      web="https://www.postgresql.org/"
      icon="/icons/postgresql.svg"
      ringHoverClass="hover:ring-[#4169E1]"
      iconGroupHoverClass="group-hover:bg-white]"
    />
    <TechPills
      text="Kotlin"
      web="https://kotlinlang.org/"
      icon="/icons/kotlin.svg"
      ringHoverClass="hover:ring-[#0095D5]"
      iconGroupHoverClass="group-hover:bg-[#0095D5]"
    />
    <TechPills
      text="Android"
      web="https://developer.android.com/"
      icon="/icons/android.svg"
      ringHoverClass="hover:ring-[#3DDC84]"
      iconGroupHoverClass="group-hover:bg-[#3DDC84]"
    />
  </ul>
</article>

<article class="px-8 md:px-32 mb-32">
  <h2 class="font-bold text-4xl">Projects</h2>

  <section class="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8">
    <Project
      title="Obserfy"
      description="Record keeping and parent communication tool for Montessori Schools."
      saas
      openSource
      githubLink="https://github.com/obserfy/obserfy"
      webLink="https://obserfy.com"
    />
    <Project
      title="Atreus"
      description="Automated asset discovery service and vulnerability scanning for bug bounty."
      openSource
      githubLink="https://github.com/chrsep/atreus"
    />
    <Project
      title="Joyful Montessori"
      description="Marketing site and blog for a Montessori Preschool. Built for speed and high conversion."
      marketing
      webLink="https://www.joyfulmontessori.id"
    />
    <Project
      title="Portal"
      description="Offline-first android app for keeping track of campus info and activities with over 20k downloads."
      app
      openSource
      githubLink="https://github.com/chrsep/Kingfish"
      googlePlayLink="https://play.google.com/store/apps/details?id=com.directdev.portal"
    />
    <Project
      title="Sekitarmu"
      description="A platform for discovering local small and medium businesses in a Community."
      saas
      openSource
      webLink="https://www.sekitarmu.id"
      githubLink="https://github.com/chrsep/grayson"
    />
    <Project
      title="Timetravelers"
      description="Product listing for Travel agency, offering a wide range of travel packages and visa services."
      ecommerce
      webLink="https://timetravelers.id"
    />
  </section>
</article>
