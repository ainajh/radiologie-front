import { defineStore } from "pinia";
export const useCommentScheduleStore = defineStore("commentScheduleStore", {
  state: (): {
    allComments: {
      id: string;
      id_sender: string;
      comment: string;
      created_at: string;
    }[];
    allScheduleThisWeek: {
      id: number;
      is_valid: boolean;
    }[];
    statVacation: {
      nom: string;
      nombre_matin_apres_midi: string;
      nombre_midi: string;
    }[];
    message: {
      error: boolean;
      msg: string;
    };
    dataToPrint: any;
  } => ({
    allComments: [],
    allScheduleThisWeek: [],
    statVacation: [],
    message: {
      error: false,
      msg: "",
    },
    dataToPrint: [],
  }),

  actions: {
    async getAllSheduleThisWeek(data: string[]) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.post(
          `schedule/getAllSheduleThisWeek`,
          data,
          {
            headers: {
              Authorization: "Bearer " + token.value,
            },
          }
        );

        this.allScheduleThisWeek = response?.data?.schedule;
      } catch (error) {
        console.log(error);
      }
    },
    async deleteAllSheduleThisWeek(data: string[]) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.post(
          `schedule/deleteAllSheduleThisWeek`,
          data,
          {
            headers: {
              Authorization: "Bearer " + token.value,
            },
          }
        );
        this.message = { error: false, msg: response?.data?.message };
      } catch (error) {
        const err = error?.response?.data?.error;
        this.message = {
          error: true,
          msg: err,
        };
      }
    },
    async getAllCommentInThisWeek(data: string[]) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.post(`comment`, data, {
          headers: {
            Authorization: "Bearer " + token.value,
          },
        });
        console.log("voantso");

        this.allComments = response?.data?.commentaire;
      } catch (error) {
        console.log(error);
      }
    },
    async createComment(data: any) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.post(`comment/add`, data, {
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
    async updateComment(data: any) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.put(`comment/update/${data?.id}`, data, {
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
    async deleteComment(id: number) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.delete(`comment/delete/${id}`, {
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
      }
    },
    async getStatVacation(filter: any = null) {
      const { $api } = useNuxtApp();
      const token = useCookie("token");
      try {
        const response = await $api?.post(
          `schedule/statistique`,
          { filter },
          {
            headers: {
              Authorization: "Bearer " + token.value,
            },
          }
        );

        this.statVacation = response?.data?.statistique;
      } catch (error) {
        console.log(error);
      }
    },

    // async deleteTypes(id: number) {
    //   const { $api } = useNuxtApp();
    //   const token = useCookie("token");
    //   try {
    //     const response = await $api?.delete(`type/delete/${id}`, {
    //       headers: {
    //         Authorization: "Bearer " + token.value,
    //       },
    //     });
    //     this.message = { error: false, msg: response?.data?.message };
    //   } catch (error: any) {
    //     const err = error?.response?.data?.error;
    //     this.message = {
    //       error: true,
    //       msg: err,
    //     };
    //     console.log(error);
    //   }
    // },
    // async updateTypes(data: any) {
    //   const { $api } = useNuxtApp();
    //   const token = useCookie("token");
    //   try {
    //     const response = await $api?.put(
    //       `type/update`,
    //       {
    //         ...data,
    //       },
    //       {
    //         headers: {
    //           Authorization: "Bearer " + token.value,
    //         },
    //       }
    //     );
    //     this.message = { error: false, msg: response?.data?.message };
    //   } catch (error: any) {
    //     const err = error?.response?.data?.error;
    //     this.message = {
    //       error: true,
    //       msg: err,
    //     };
    //     console.log(error);
    //   }
    // },
  },
});
