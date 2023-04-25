// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: { backendUrl: '', websocketHost: '' },
  },
  css: ['~/assets/css/tailwind.css'],
  nitro: {
    prerender: {
      routes: ['/', '/changelog'],
    },
  },
})
