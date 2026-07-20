<script lang="ts">
  import { fade } from "svelte/transition"
  import { onMount } from "svelte"
  import Seo from "$lib/seo.svelte"
  import { m } from "$lib/paraglide/messages"
  import { posthog } from "$lib/posthog"

  onMount(() => {
    posthog.capture("cv viewed")
  })
</script>

<Seo title={m.cv_title()} description={m.cv_description()} />

<header
  class="relative block w-full skew-y-6 transform border-b border-black px-6 pt-16 pb-12 sm:skew-y-4 sm:pb-16 md:px-32 lg:pt-24 lg:pb-32 2xl:px-0"
  in:fade
>
  <p
    class="text-ink-600 relative z-10 max-w-7xl -skew-y-6 transform pb-2 font-medium sm:-skew-y-4 lg:text-lg 2xl:mx-auto"
  >
    {m.cv_label()}
  </p>
  <h1
    class="relative z-10 max-w-7xl -skew-y-6 transform text-4xl font-black sm:-skew-y-4 sm:text-5xl lg:text-6xl 2xl:mx-auto"
  >
    Chrisando Eka <br /> Pramudhita
  </h1>

  <div
    class="absolute inset-0 flex items-center justify-center overflow-hidden"
  >
    <div
      class="animate-spin-slow absolute top-[300px] flex blur-3xl filter sm:top-[300px] md:right-1/6 lg:top-[490px]"
    >
      <div
        class="h-[800px] w-[800px] rounded-full bg-green-700 opacity-90"
      ></div>
      <div
        class="-ml-[600px] h-[800px] w-[800px] rounded-full bg-blue-700 opacity-90"
      ></div>
    </div>
  </div>
</header>

<div class="max-w-7xl px-6 md:px-32 2xl:mx-auto 2xl:px-0">
  <article class="prose max-w-xl" in:fade={{ delay: 100 }}>
    <section>
      <h2 id="experience" class="!mt-8">
        {m.cv_experiences()}
        <span class="mt-2 block h-1 w-12 rounded-full bg-blue-500"></span>
      </h2>

      <h3>{m.cv_exp_independent_title()}</h3>
      <h4>{m.cv_exp_independent_role()}</h4>
      <p class="text-sm">{m.cv_period_2018_today()}</p>
      <ul>
        <li>{m.cv_exp_independent_1()}</li>
        <li>{m.cv_exp_independent_2()}</li>
        <li>{m.cv_exp_independent_3()}</li>
        <li>{m.cv_exp_independent_4()}</li>
      </ul>

      <h3>PT. Bank Central Asia Tbk</h3>
      <h4>{m.cv_exp_bca_role()}</h4>
      <p class="text-sm">2017</p>
      <ul>
        <li>{m.cv_exp_bca_1()}</li>
        <li>{m.cv_exp_bca_2()}</li>
        <li>{m.cv_exp_bca_3()}</li>
      </ul>
    </section>

    <section>
      <h2 id="projects">
        {m.cv_personal_projects()}
        <span class="mt-2 block h-1 w-12 rounded-full bg-blue-500"></span>
      </h2>
      <h3>Atreus</h3>
      <p>
        {m.cv_project_atreus_body()}
        <a href="https://github.com/chrsep/atreus"> GitHub. </a>
      </p>
      <p class="text-sm">{m.cv_project_atreus_meta()}</p>

      <h3>Obserfy</h3>
      <p>
        {m.cv_project_obserfy_body()}
        <a href="https://github.com/chrsep/obserfy"> GitHub </a>
        <a href="https://obserfy.com">Web</a>
      </p>
      <p class="text-sm">{m.cv_project_obserfy_meta()}</p>

      <h3>Portal</h3>
      <p>
        {m.cv_project_portal_body()}
        <a href="https://github.com/chrsep/Kingfish"> GitHub. </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.directdev.portal"
        >
          Google Play.
        </a>
      </p>
      <p class="text-sm">{m.cv_project_portal_meta()}</p>
    </section>

    <section>
      <h2 id="education">
        {m.cv_education()}
        <span class="mt-2 block h-1 w-12 rounded-full bg-blue-500"></span>
      </h2>

      <h3>Binus University</h3>
      <h4>{m.cv_edu_binus_degree()}</h4>
      <p>
        {m.cv_edu_binus_body()}
      </p>
      <p class="text-sm">Jakarta, Indonesia | 2014-2018</p>

      <h3>National Sun Yat-sen University</h3>
      <h4>{m.cv_edu_nsysu_degree()}</h4>
      <p>
        {m.cv_edu_nsysu_body()}
      </p>
      <p class="text-sm">Kaohsiung, Taiwan | 2017</p>
    </section>

    <section>
      <h2 id="courses">
        {m.cv_courses()}
        <span class="mt-2 block h-1 w-12 rounded-full bg-blue-500"></span>
      </h2>

      <h3>Deep Learning Specialization</h3>
      <h4>Coursera</h4>
      <ul>
        <li>
          {m.cv_course_dl_1()}
          <a href="https://coursera.org/share/7e2e1b6c4be6fe5b187aee64362ba4a8">
            {m.cv_certificate()}
          </a>
        </li>
        <li>
          {m.cv_course_dl_2()}
          <a href="https://coursera.org/share/228b975f5d801b33f02680a0be0dfcb2">
            {m.cv_certificate()}
          </a>
        </li>
        <li>
          {m.cv_course_dl_3()}
          <a href="https://coursera.org/share/5ebb9114286e6700c399a0f9a90f43cb">
            {m.cv_certificate()}
          </a>
        </li>
        <li>
          {m.cv_course_dl_4()}
          <a href="https://coursera.org/share/0449290a2a586775031187ee0876f2ec">
            {m.cv_certificate()}
          </a>
        </li>
      </ul>

      <h3>Machine Learning</h3>
      <h4>Coursera</h4>
      <p>
        {m.cv_course_ml_body()}
        <a href="https://coursera.org/share/9747c18a12fd68667db0001980a8ab26">
          {m.cv_certificate()}
        </a>
      </p>

      <h3>Global Leadership Experience</h3>
      <h4>Common Purpose</h4>
      <p>
        {m.cv_course_gle_body()}
      </p>
    </section>
  </article>
</div>
