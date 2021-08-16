<script>
  import {
    Canvas,
    Scene,
    PerspectiveCamera,
    DirectionalLight,
    AmbientLight,
    BoxBufferGeometry,
    Mesh,
    MeshStandardMaterial,
    WebGLRenderer
  } from "svelthree";
  import TechPills from "$lib/TechPills.svelte";
  import { browser } from "$app/env";

  let cubeGeometry = new BoxBufferGeometry(1, 1, 1);
  let cubeMaterial = new MeshStandardMaterial();
</script>

<svelte:head>
  <title>chrsep.dev</title>
</svelte:head>


<section class="flex items-center">
  <div>
    <div class="px-8 py-8 md:pt-32 md:px-32">
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

      <h1 class="font-bold text-3xl sm:text-6xl leading-none mb-6">
        Chrisando E. <br /> Pramudhita
      </h1>

      <p class="sm:text-xl max-w-lg text-secondary">
        Hi there, I'm a fullstack software developer from Indonesia 🇮🇩. I help people
        build fast and accessible web experiences.
      </p>
    </div>

    <div class="px-8 md:px-32 mb-32">
      <h2 class="font-bold text-xl mb-4 sm:mb-6">Techs I work with</h2>

      <ul class="flex flex-wrap max-w-2xl">
        <TechPills text="NextJS" web="https://nextjs.org" />
        <TechPills text="Gatsby" web="https://gatsbyjs.com" />
        <TechPills text="React / Preact" web="https://reactjs.org" />
        <TechPills text="Typescript" web="https://typescriptlang.org" />
        <TechPills text="Tailwind" web="https://tailwindcss.com" />
        <TechPills text="Go" web="https://golang.org" />
        <TechPills text="Prisma" web="https://www.prisma.io/" />
        <TechPills text="Postgres" web="https://www.postgresql.org/" />
        <TechPills text="Kotlin" web="https://kotlinlang.org/" />
        <TechPills text="Android" web="https://developer.android.com/" />
      </ul>
    </div>
  </div>

  <div class="hidden lg:block ml-auto mr-32">
    {#if browser}
      <Canvas let:sti w={500} h={500}>

        <Scene {sti} let:scene id="scene1" props={{ background: 0x000 }}>

          <PerspectiveCamera {scene} id="cam1" pos={[0, 0, 3]} lookAt={[0, 0, 0]} />
          <AmbientLight {scene} intensity={1.25} />
          <DirectionalLight {scene} pos={[3, 3, 3]} />

          <Mesh
            {scene}
            geometry={cubeGeometry}
            material={cubeMaterial}
            mat={{ roughness: 0.5, metalness: 0.5, color: 0xff3e00 }}
            pos={[0, 0, 0]}
            rot={[0.5, 0.6, 0]}
            scale={[1, 1, 1]} />

        </Scene>

        <WebGLRenderer
          {sti}
          sceneId="scene1"
          camId="cam1"
          config={{ antialias: true, alpha: false }} />

      </Canvas>
    {/if}
  </div>
</section>

<!--<section class="px-8 md:px-32 mb-16">-->
<!--  <h2 class="font-bold text-4xl mb-16">Projects</h2>-->

<!--  <ul class="flex">-->
<!--    <li class="w-1/3">Obserfy</li>-->
<!--    <li class="w-1/3">Joyful Montessori</li>-->
<!--    <li class="w-1/3">Portal</li>-->
<!--  </ul>-->
<!--</section>-->


