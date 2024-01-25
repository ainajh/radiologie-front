import { defineStore } from "pinia";
export const useTypeStore = defineStore("typeStore", {
  state: (): {
    allTypes: { id: string; nom_type: string; nom_sous_type: string }[];
    message: {
      error: boolean;
      msg: string;
    };
  } => ({
    allTypes: [],
    message: {
      error: false,
      msg: "",
    },
  }),

  actions: {
    async getAllTypes() {
      const { $api } = useNuxtApp();
      try {
        const response = await $api?.get(`type`);
        this.allTypes = response?.data?.types;
      } catch (error) {
        console.log(error);
      }
    },
    async createTypes(data: any) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      console.log(token)
      try {
        const response = await $api?.post(`type/add`, data, {
          headers: {
            Authorization: "Bearer " + token.value,
          },
        });
        this.message = { error: false, msg: response?.data?.message };
      } catch (error: any) {
        const err = error?.response?.data?.error;
        this.message = {
          error: true,
          msg: err,
        };
        console.log(error);
      }
    },
    async deleteTypes(id: number) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.delete(`type/delete/${id}`, {
          headers: {
            Authorization: "Bearer " + token.value,
          },
        });
        this.message = { error: false, msg: response?.data?.message };
      } catch (error: any) {
        const err = error?.response?.data?.error;
        this.message = {
          error: true,
          msg: err,
        };
        console.log(error);
      }
    },
    async updateTypes(data: any) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.put(
          `type/update`,
          {
            ...data,
          },
          {
            headers: {
              Authorization: "Bearer " + token.value,
            },
          }
        );
        this.message = { error: false, msg: response?.data?.message };
      } catch (error: any) {
        const err = error?.response?.data?.error;
        this.message = {
          error: true,
          msg: err,
        };
        console.log(error);
      }
    },
  },
});
