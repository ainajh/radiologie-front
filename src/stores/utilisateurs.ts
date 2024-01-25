import { defineStore } from "pinia";
export const useUtilisateurStore = defineStore("utilisateurStore", {
  state: () => ({
    allUsers: [],
    message: {
      error: false,
      msg: "",
    },
  }),

  actions: {
    async getAllUsers() {
      const token = useCookie("token");
      const { $api } = useNuxtApp();
      try {
        const response = await $api?.get(`user`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
        this.allUsers = response?.data?.users;
      } catch (error) {
        console.log(error);
      }
    },
    async createUser(data: any) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.post(`user/add`, data, { headers: { Authorization: `Bearer ${token.value}` }});
        this.message = { error: false, msg: response?.data?.message };
      } catch (error: any) {
        const err = error?.response?.data?.error;
        this.message = {
          error: true,
          msg: err,
        };
      }
    },
    async deleteUser(id: number) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.delete(`user/delete/${id}`, {headers: { Authorization: `Bearer ${token.value}` }});
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
    async updateUser(data: any) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.put(`user/update`, {
          ...data,
        }, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
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

    async validateDoctor(id: number) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.post(`user/verify`, { id }, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
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
  },
});
