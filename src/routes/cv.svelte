<script lang="ts" context="module">
  import { fade } from "svelte/transition"

  export const prerender = true
</script>

<header
  class="sm:skew-y-4 relative block w-full skew-y-6 transform border-b border-black px-6 pb-12 pt-6 sm:pb-24 md:px-32 lg:pt-40 2xl:px-0"
  in:fade
>
  <p
    class="z-1 sm:-skew-y-4 relative max-w-7xl -skew-y-6 transform pb-2 font-medium text-default-600 lg:text-lg 2xl:mx-auto"
  >
    Curriculum Vitae
  </p>
  <h1
    class="!sm:text-5xl z-1 sm:-skew-y-4 relative max-w-7xl -skew-y-6 transform text-4xl font-black 2xl:mx-auto"
  >
    Chrisando Eka <br /> Pramudhita
  </h1>

  <div
    class="absolute inset-0 flex items-center justify-center overflow-hidden"
  >
    <div
      class="top-70 md:right-1/6 absolute flex animate-spin-slow blur-3xl filter md:top-80"
    >
      <div class="w-200 h-200 rounded-full bg-green-700 opacity-90" />
      <div class="w-200 h-200 -ml-160 rounded-full bg-blue-700 opacity-90" />
    </div>
  </div>
</header>

<div class="max-w-7xl px-6 md:px-32 2xl:mx-auto 2xl:px-0">
  <article class="prose max-w-xl" in:fade={{ delay: 100 }}>
    <section>
      <h2 id="experience" class="!mt-8">
        Experiences
        <span class="mt-2 block h-1 w-12 rounded-full bg-blue-500" />
      </h2>

      <h3>Independent Software Developer</h3>
      <h4>Fullstack Web Developer</h4>
      <p class="text-sm">2018-Today</p>
      <ul>
        <li>
          Designed and deployed e-commerce and marketing sites for SMEs using
          NextJS and Gatsby.
        </li>
        <li>
          Redesigned internal CRM for managing magazine subscriptions and
          printing shipping addresses for a publishing company.
        </li>
        <li>Helped develop analytic dashboard using React.</li>
        <li>
          Developed android app for internal reporting of offsite maintenance
          result for a building automation company.
        </li>
      </ul>

      <h3>PT. Bank Central Asia Tbk</h3>
      <h4>Software Engineering Intern</h4>
      <p class="text-sm">2017</p>
      <ul>
        <li>Implemented new business rules on IBM z/OS.</li>
        <li>Helped test and monitor new codes to be deployed.</li>
        <li>Explored, experimented, and benchmarked technologies to adopt.</li>
      </ul>
    </section>

    <section>
      <h2 id="projects">
        Personal Projects
        <span class="mt-2 block h-1 w-12 rounded-full bg-blue-500" />
      </h2>
      <h3>Atreus</h3>
      <p>
        Open-source automated asset discovery service to experiment with bug
        bounty. Built with NextJS and Go.
        <a
          href="https://play.google.com/store/apps/details?id=com.directdev.portal"
        >
          GitHub.
        </a>
      </p>
      <p class="text-sm">Web Application, Open-source | 2021-Today</p>

      <h3>Obserfy</h3>
      <p>
        Open-source record keeping and parent communication tool for Montessori
        Schools.
        <a href="https://github.com/chrsep/obserfy"> GitHub </a>
        <a href="https://obserfy.com">Web</a>
      </p>
      <p class="text-sm">SaaS, Open-source | 2020-Today</p>

      <h3>Portal</h3>
      <p>
        Open-source, offline-first android app for keeping track of campus info
        and activities with over 20k downloads.
        <a href="https://github.com/chrsep/Kingfish"> GitHub. </a>
        <a
          href="https://play.google.com/store/apps/details?id=com.directdev.portal"
        >
          Google Play.
        </a>
      </p>
      <p class="text-sm">Android, Open-source | 2014-2018</p>
    </section>

    <section>
      <h2 id="education">
        Education
        <span class="mt-2 block h-1 w-12 rounded-full bg-blue-500" />
      </h2>

      <h3>Binus University</h3>
      <h4>Bachelor's Degree in Computer Science</h4>
      <p>
        Graduated with GPA of 3.4 and enrolled in the "Global Class" that uses
        an internationalized curriculum delivered in english.
      </p>
      <p class="text-sm">Jakarta, Indonesia | 2014-2018</p>

      <h3>National Sun-Yat Sen University</h3>
      <h4>Student Exchange</h4>
      <p>
        Learned Python and UNIX through building and debugging various unix
        based text games.
      </p>
      <p class="text-sm">Kaohsiung, Taiwan | 2017</p>
    </section>

    <section>
      <h2 id="courses">
        Courses
        <span class="mt-2 block h-1 w-12 rounded-full bg-blue-500" />
      </h2>

      <h3>Deep Learning Specialization</h3>
      <h4>Coursera</h4>
      <ul>
        <li>
          Learned how convolutional neural networks work.
          <a href="https://coursera.org/share/7e2e1b6c4be6fe5b187aee64362ba4a8">
            Certificate.
          </a>
        </li>
        <li>
          Learned how to structuring machine learning projects.
          <a href="https://coursera.org/share/228b975f5d801b33f02680a0be0dfcb2">
            Certificate.
          </a>
        </li>
        <li>
          Learned about neural networks and deep learning.
          <a href="https://coursera.org/share/5ebb9114286e6700c399a0f9a90f43cb">
            Certificate.
          </a>
        </li>
        <li>
          Learned how to optimize deep neural networks.
          <a href="https://coursera.org/share/0449290a2a586775031187ee0876f2ec">
            Certificate.
          </a>
        </li>
      </ul>

      <h3>Machine Learning</h3>
      <h4>Coursera</h4>
      <p>
        Learned various Machine Learning methodology such as SVM and neural
        networks using Matlab.
        <a href="https://coursera.org/share/9747c18a12fd68667db0001980a8ab26">
          Certificate.
        </a>
      </p>

      <h3>Global Leadership Experience</h3>
      <h4>Common Purpose</h4>
      <p>
        Leadership development program focused on brainstorming about real world
        problems.
      </p>
    </section>
  </article>
</div>
