import { defineStore } from "pinia";
export const useLeaveStore = defineStore("leaveStore", {
  state: () => ({
    allLeave: [],
    message: {
      error: false,
      msg: "",
    },
  }),

  actions: {
    async getAllLeave() {
      const token = useCookie("token");
      const { $api } = useNuxtApp();
      try {
        const response = await $api?.get(`leave`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
        this.allLeave = response?.data?.data;
      } catch (error) {
        console.log(error);
      }
    },
    async createLeave(data: any) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.post(`leave/add`, data, {
          headers: { Authorization: `Bearer ${token.value}` },
        });
        this.message = { error: false, msg: response?.data?.message };
      } catch (error: any) {
        const err = error?.response?.data?.error;
        this.message = {
          error: true,
          msg: err,
        };
      }
    },
    async deleteLeave(id: number) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.delete(`leave/delete/${id}`, {
          headers: { Authorization: `Bearer ${token.value}` },
        });
        this.message = { error: false, msg: response?.data?.message };
      } catch (error: any) {
        const err = error?.response?.data?.message;
        this.message = {
          error: true,
          msg: err,
        };
        console.log(error);
      }
    },
    async updateLeave(data: any) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.put(
          `leave/update/${data?.id}`,
          {
            ...data,
          },
          {
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          }
        );

        this.message = { error: false, msg: response?.data?.message };
      } catch (error: any) {
        const err = error?.response?.data?.message;
        this.message = {
          error: true,
          msg: err,
        };
      }
    },
  },
});
