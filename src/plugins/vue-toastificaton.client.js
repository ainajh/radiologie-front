import { defineNuxtPlugin } from "#app";
import * as vt from "vue-toastification";
import "vue-toastification/dist/index.css"; // if needed

export default defineNuxtPlugin((nuxtApp) => {
  const options = {
    transition: "Vue-Toastification__slideBlurred",
    maxToasts: 20,
    newestOnTop: true,
    hideProgressBar: true,
  };
  nuxtApp.vueApp.use(vt.default, options);
  return {
    provide: {
      toast: vt.useToast(),
    },
  };
});
