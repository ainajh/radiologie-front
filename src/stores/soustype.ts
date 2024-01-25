import { defineStore } from "pinia";
export const useSoustypeStore = defineStore("soustypeStore", {
  state: () => ({
    allSousypes: [],
    message: {
      error: false,
      msg: "",
    },
  }),

  actions: {
    // async getallSoustypes() {
    //   const { $api } = useNuxtApp();
    //   try {
    //     const response = await $api?.get(`soustype`);
    //     this.allSousypes = response?.data?.soustypes;
    //   } catch (error) {
    //     console.log(error);
    //   }
    // },
    async createSoustypes(data: any) {
      const { $api } = useNuxtApp();
      try {
        const response = await $api?.post(`soustype/add`, data);
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
    async deleteSoustypes(id: number) {
      const { $api } = useNuxtApp();
      try {
        const response = await $api?.delete(`soustype/delete/${id}`);
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
    async updateSoustypes(data: any) {
      const { $api } = useNuxtApp();
      try {
        const response = await $api?.put(`soustype/update`, {
          ...data,
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
  },
});
