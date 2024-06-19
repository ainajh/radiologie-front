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
  devServer: {
    port: 3001,
  },
  app: {
    head: {
      title: "Radiologie",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.3.0/css/all.min.css",
        },
      ],
      script: [
        {
          defer: true,
          type: "text/javascript",
          async: true,
          src: "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
        },
      ],
    },
  },
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt", "nuxt-quasar-ui"],
  imports: {
    dirs: ["stores", "utils", "services"],
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
