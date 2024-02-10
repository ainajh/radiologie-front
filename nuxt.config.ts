// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  srcDir: "src/",
  ssr: true,
  devtools: { enabled: false },
  runtimeConfig: {
    public: {
      apiUrl: process.env.API_URL,
      socketUrl: process.env.SOCKET_URL,
      fileUrl: process.env.FILE_URL,
    },
  },
  app: {
    head: {
      title: "Radiologie",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
    },
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "nuxt-quasar-ui"],
  imports: {
    dirs: ["stores", "utils"],
  },
  quasar: {
    config: {
      brand: {
        primary: "#2e9b4f",
        secondary: "#070D3F",
      },
    },
  },
  css: ["@/assets/scss/main.scss"],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@import "@/assets/scss/abstracts/_variables.scss";`,
        },
      },
    },
  },
});
