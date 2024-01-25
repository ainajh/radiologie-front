import { defineStore } from "pinia";

export type User = {
  id: number | null;
  role: "medecin" | "radiologue" | "admin" | null;
  email: string;
  adresse: string;
  tel: string;
  is_verified: boolean;
  nom: string;
  rpps: number | null;
};

export const userStore = defineStore({
  id: "user",
  state: (): User => {
    return {
      email: "",
      id: null,
      role: null,
      adresse: "",
      tel: "",
      is_verified: false,
      nom: "",
      rpps: null,
    };
  },
  actions: {
    setConnected(u: {
      role: "medecin" | "radiologue" | "admin";
      email: string;
      id: number;
      nom: string;
      rpps: number;
      is_verified: boolean;
      adresse: string;
      tel: string;
    }) {
      this.$state = u;
    },
    setDisconnected() {
      this.$state = {
        email: "",
        id: null,
        role: null,
        adresse: "",
        tel: "",
        is_verified: false,
        nom: "",
        rpps: null,
      };
    },
    async create(data: any) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.post(`/user/signup`, data, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
        return { error: false, msg: response?.data?.message };
      } catch (error) {
        return { error: true, msg: (error as any).response?.data?.error };
      }
    },
    async update(data: any) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.put(`/user/update`, data, {
          headers: {
            Authorization: `Bearer ${
              data.role === "medecin"
                ? localStorage.getItem("tokenmedecin")
                : token.value
            }`,
          },
        });
        return { error: false, msg: response?.data?.message };
      } catch (error) {
        return { error: true, msg: (error as any).response?.data?.error };
      }
    },
  },
});
