<script setup lang="ts">
definePageMeta({
  layout: 'marketing',
  middleware: 'guest',
})

useHead({
  title: 'Changelog | Pavrel',
  meta: [{ name: 'description', content: 'Unleash your creativity. Pavrel is a home for your ideas.' }],
  bodyAttrs: {
    class: 'bg-slate-50 antialiased font-sans',
  },
})
</script>

<template>
  <article class="prose prose-slate mx-auto max-w-4xl py-16 px-8">
    <h1>Changelog</h1>

    <h2 id="april-2023">April 2023</h2>

    <h3 id="april-2023-moving-between-teams">Moving ideas between teams</h3>

    <p>
      You can now easily move ideas between teams! Once a draft idea has been shaped (for example), and you're ready to
      move it across for the rest of your team to view and collaborate on, you can now easily do so from the Actions
      menu.
    </p>

    <img src="/changelog/2304/move-teams.png" alt="Move teams screenshot" class="mx-auto w-full max-w-[700px]" />

    <h3 id="april-2023-branding-refresh">Branding refresh</h3>

    <p>
      Pavrel is designed to help create the building blocks towards amazing products. With that in mind, we've refreshed
      our logo and branding.
    </p>

    <p>
      The new brand can be seen throughout the site, including while loading your workspace. Check it out next time you
      log in!
    </p>

    <p>
      <span class="md:flex md:items-center md:justify-center md:space-x-8">
        <img src="/changelog/2304/branding-light.png" class="w-full md:w-auto md:max-w-[300px]" />
        <img src="/changelog/2304/branding-dark.png" class="w-full md:w-auto md:max-w-[300px]" />
      </span>
    </p>

    <h3 id="april-2023-custom-logo">Custom workspace logo</h3>

    <p>
      You can now add a logo for your workspace! This helps to personalise your workspace and provide a recognisable
      image for new people who are joining.
    </p>

    <p>
      To set your workspace logo, simply go to <code>Settings > General</code> and upload your image. Your workspace
      colleagues should see this update in real-time.
    </p>

    <p>
      <img src="/changelog/2304/logo-upload.png" alt="Logo upload screenshot" class="mx-auto w-full max-w-[550px]" />
    </p>

    <h3 id="april-2023-fixes-improvements">Fixes & Improvements</h3>

    <ul>
      <li>Updated colour scheme in dark mode to have a friendlier blue tint</li>
      <li>Fixed white screen flash in dark mode when refreshing the page</li>
      <li>Set more useful page titles across all pages</li>
      <li>Better handling for redirections when login session has expired</li>
      <li>Better indications for functionality which is only available while online</li>
      <li>Added extra messages to confirm once an action has been completed</li>
    </ul>
  </article>
</template>
