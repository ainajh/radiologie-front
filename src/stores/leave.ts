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
    async getAllLeave(id = null) {
      const token = useCookie("token");
      const { $api } = useNuxtApp();
      try {
        const response = await $api?.get(`leave/${id ? id : ""}`, {
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
          msg:
            error?.response?.data?.message ||
            "Erreur lors de l'execution de la requête",
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
    async toogleValidationPlanning(id: number, validate: boolean) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.put(
          `schedule/toogleValidationPlanning/${id}/?validate=${validate}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token.value}`,
            },
          }
        );

        this.message = { error: false, msg: response?.data?.message };
        return response?.data?.data;
      } catch (error: any) {
        const err = error?.response?.data?.message;
        this.message = {
          error: true,
          msg: err,
        };
      }
    },
    async revalidateWeek(data: any) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.post(`modif-week/add`, data, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });

        this.message = { error: false, msg: response?.data?.message };
        return response?.data?.data;
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
