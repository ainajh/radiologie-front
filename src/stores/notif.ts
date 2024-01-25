import { defineStore } from "pinia";

export const badgeStore = defineStore("badgeStore", {
  state: (): {
    nb: number;
  } => {
    return {
      nb: 0,
    };
  },
  actions: {
    getNotif() {
      const { $api } = useNuxtApp();
      const user: any = useCookie("user").value;
      $api.get(`/message/getmessagenonlu?id=${user.id}`).then((res) => {
        if (res.data.count > 0) {
          document.title = "Radiologie 🔴";
          let notification = new Notification("Nouveau message", {
            body: "Vous avez un nouveau message",
          });
          notification.onclick = function () {
            window.open("https://rdvradio91.fr/dashboard/messagerie");
          };
        } else {
          document.title = "Radiologie";
        }
        this.$state.nb = res.data.count;
      });
    },
  },
});
