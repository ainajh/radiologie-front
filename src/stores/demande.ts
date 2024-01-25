import { defineStore } from "pinia";
export const useDemandeStore = defineStore("demandeStore", {
  state: () => ({
    allDemandes: [],
    message: {
      error: false,
      msg: "",
    },
    statistiques: [],
    statistiqueMed: [],
  }),

  actions: {
    async sendCode(data: any) {
      const { $api } = useNuxtApp();
      try {
        const response = await $api?.post(`/demande/sendcode`, {
          email: data,
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
    async addDemande(data: any) {
      const { $api } = useNuxtApp();
      try {
        const response = await $api?.post(`/demande/add`, data);
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
    async deleteDemande(data: any) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.delete(`/demande/delete/${data}`, {
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
        console.log(error);
      }
    },
    async getallDemandes() {
      const token = useCookie("token");
      const { $api } = useNuxtApp();
      try {
        const response = await $api?.get(`demande`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
        this.allDemandes = response?.data?.demandes;
      } catch (error) {
        console.log(error);
      }
    },
    async getStats() {
      const token = useCookie("token");
      const { $api } = useNuxtApp();
      try {
        const response = await $api?.get(`/demande/statistique`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
        this.statistiques = response?.data?.statistiqueDemandes;
        
        console.log(this.statistiques);
        
      } catch (error) {
        console.log(error);
      }
    },
    async getStatsMed() {
      const token = useCookie("token");
      const { $api } = useNuxtApp();
      try {
        const response = await $api?.get(`/demande/statistique/med`, {
          headers: {
            Authorization: `Bearer ${token.value}`,
          },
        });
        this.statistiqueMed = response?.data?.statistiqueDemandes;
        
        console.log(this.statistiques);
        
      } catch (error) {
        console.log(error);
      }
    },
    async addComments(id_demande: Number, content: String) {
      const { $api } = useNuxtApp();
      try {
        const response = await $api?.post(
          `/demande/comment`,
          {
            id_demande,
            content,
          },
          {
            headers: {
              Authorization: `Bearer ${useCookie("token").value}`,
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
    async deleteComments(id: Number) {
      const { $api } = useNuxtApp();
      try {
        const response = await $api?.delete(`/demande/comment/${id}`, {
          headers: {
            Authorization: `Bearer ${useCookie("token").value}`,
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
    async changeStatus(id: Number, lieu: String, date_rdv: String) {
      const { $api } = useNuxtApp();
      try {
        const response = await $api?.put(
          `/demande/update`,
          {
            id,
            lieu,
            date_rdv,
          },
          {
            headers: {
              Authorization: `Bearer ${useCookie("token").value}`,
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
    async changeInfo(data: any){
      const { $api } = useNuxtApp();
      try {
        const response = await $api?.put(
          `/demande/update/info`,
          data,
          {
            headers: {
              Authorization: `Bearer ${useCookie("token").value}`,
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
    }
  },
});
