import { type Socket, io } from "socket.io-client";
import { defineStore } from "pinia";

export const socketStore = defineStore("socketStore", {
  state: (): {
    socket: Socket | null;
    connected: boolean;
  } => {
    return {
      socket: null,
      connected: false,
    };
  },
  actions: {
    connect(lieu: string) {
      const me: any = useCookie("user");
      const badge = badgeStore();
      if (me.value.id) {
        this.socket = io(useRuntimeConfig().public.socketUrl!, {
          query: { id_user: me.value.id, lieu: lieu },
        });
        badge.getNotif();
        this.emit("join", { room: `roomuser-${me.value.id}` });
        this.on("newmessage", () => {
          badge.getNotif();
        });
        this.on("newlocation", (data: { lieu: string }) => {
          const location = useCookie("location");
          location.value = data.lieu;
          window.location.reload();
        });
      } else {
        this.connect(lieu);
      }
    },
    reconnect(lieu: string) {
      this.connect(lieu);
    },
    disconnect() {
      this.socket?.disconnect();
      this.connected = false;
    },
    emit(event: any, data: any) {
      this.socket?.emit(event, data);
    },
    on(event: any, callback: any) {
      this.socket?.on(event, callback);
    },
    off(event: any, callback: any) {
      this.socket?.off(event, callback);
    },
  },
});
