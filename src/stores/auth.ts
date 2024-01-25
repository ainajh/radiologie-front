import { defineStore } from "pinia";
export const useAuthStore = defineStore("authStore", {
  state: () => ({
    message: {
      error: false,
      msg: "",
    },
    authenticated: false,
    loading: false,
  }),

  actions: {
    async login(role: String, data: any) {
      this.loading = true;
      const { $api } = useNuxtAppd();
      try {
        const response = await $api?.post(`user/login/${role}`, data);
        const result = response?.data;
        const token = useCookie("token");
        const userDash = useCookie("user");
        userDash.value = result?.user;
        token.value = result?.token;
        this.authenticated = true;
        this.message = {
          error: false,
          msg: result.message,
        };
      } catch (error: any) {
        const err = error?.response?.data?.error;
        this.message = {
          error: true,
          msg: err,
        };
      }
      this.loading = false;
    },
    logUserOut() {
      const token = useCookie("token");
      const userDash = useCookie("user");
      this.authenticated = false;
      userDash.value = null;
      token.value = null;
    },
    async forgotPass(data: any) {
      const { $api } = useNuxtApp();
      try {
        const response = await $api?.post(`/user/forgot-pass`, data);
        this.message = { error: false, msg: response?.data?.message };
      } catch (error) {
        this.message = {
          error: true,
          msg: (error as any).response?.data?.error,
        };
      }
    },
    async changePass(id: String | Number, data: any, type: any) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.put(
          `/user/change-pass/${id}`,
          { ...data, type },
          {
            headers: {
              Authorization: `Bearer ${
                type == "admin"
                  ? token.value
                  : localStorage.getItem("tokenmedecin")
              }`,
            },
          }
        );
        this.message = { error: false, msg: response?.data?.message };
      } catch (error) {
        this.message = {
          error: true,
          msg: (error as any).response?.data?.error,
        };
      }
    },
  },
});
