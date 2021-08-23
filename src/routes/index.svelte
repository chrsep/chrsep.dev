<script>
  import TechPills from "$lib/TechPills.svelte";
</script>


<section class="px-8 py-8 md:pt-32 md:px-32">
  <div class="flex">
    <a href="https://github.com/chrsep"
       class="border  rounded-lg text-xs px-4 py-2 border-opacity-30 mr-2 hover:border-blue-300 transition mb-6 flex items-center"
       target="_blank">
      <img src="/icons/github.svg" class="w-4 h-4 mr-2 opacity-60" alt="" />
      @chrsep
    </a>

    <a href="https://twitter.com/_chrsep"
       class="border  rounded-lg text-xs px-4 py-2 border-opacity-30 mr-2 hover:border-blue-300 transition mb-6 flex items-center"
       target="_blank">
      <img src="/icons/twitter.svg" class="w-4 h-4 mr-2 opacity-60" alt="" />
      @_chrsep
    </a>
  </div>

  <h1 class="font-bold text-4xl sm:text-6xl leading-none mb-6">
    Chrisando E. <br /> Pramudhita
  </h1>

  <p class="sm:text-xl max-w-lg text-secondary">
    Hi there, I'm a fullstack software developer from Indonesia 🇮🇩. I help people
    build fast and accessible web experiences.
  </p>
</section>

<section class="px-8 md:px-32 mb-32">
  <h2 class="font-bold text-xl mb-4 sm:mb-6">Techs I work with</h2>

  <ul class="flex flex-wrap max-w-2xl">
    <TechPills text="Next" web="https://nextjs.org" icon="/icons/nextdotjs.svg" />
    <TechPills text="Gatsby" web="https://gatsbyjs.com" icon="/icons/gatsby.svg" />
    <TechPills text="React / Preact" web="https://reactjs.org" icon="/icons/react.svg" />
    <TechPills text="Typescript" web="https://typescriptlang.org" icon="/icons/typescript.svg" />
    <TechPills text="Tailwind" web="https://tailwindcss.com" icon="/icons/tailwindcss.svg" />
    <TechPills text="Go" web="https://golang.org" icon="/icons/go.svg" />
    <TechPills text="Prisma" web="https://www.prisma.io/" icon="/icons/prisma.svg" />
    <TechPills text="Postgres" web="https://www.postgresql.org/" icon="/icons/postgresql.svg" />
    <TechPills text="Kotlin" web="https://kotlinlang.org/" icon="/icons/kotlin.svg" />
    <TechPills text="Android" web="https://developer.android.com/" icon="/icons/android.svg" />
  </ul>
</section>


<!--<section class="px-8 md:px-32 mb-16">-->
<!--  <h2 class="font-bold text-4xl mb-16">Projects</h2>-->

<!--  <ul class="flex">-->
<!--    <li class="w-1/3">Obserfy</li>-->
<!--    <li class="w-1/3">Joyful Montessori</li>-->
<!--    <li class="w-1/3">Portal</li>-->
<!--  </ul>-->
<!--</section>-->


