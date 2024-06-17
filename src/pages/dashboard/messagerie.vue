<template>
  <div class="pg-messagerie">
    <div class="pg-messagerie__side">
      <div class="pg-messagerie__side-list">
        <div class="flex justify-between">
          <span :class="onglet === 'actif' ? 'onglet active' : 'onglet'" @click="onglet = 'actif'">Actif</span>
          <span :class="onglet !== 'actif' ? 'onglet active' : 'onglet'" @click="onglet = 'inactif'">Inactif</span>
        </div>
        <div v-if="onglet === 'actif'">
          <q-expansion-item header-style="color: var(--primary-light)" :default-opened="true" :disable="true" expand-separator label="Admin"
            :class="users.filter(u => u.lieu && u.role === 'admin' && me.id !== u.last_message?.id_envoyeur && u.last_message?.lu === 0).length !== 0 ? 'locat not-see' : 'locat'">
            <div class="px-5 pb-2 text-[15px]">
              <section-admin-listdiscu :listdiscu="users.filter(u => u.lieu && u.role === 'admin')" :users="users"
                :select="select" :isActiveDiscu="isActiveDiscu" />
            </div>
          </q-expansion-item>
          <q-expansion-item header-style="color: var(--primary-light)" :default-opened="true" :disable="true"
            v-for="(locat, i) in ['Savigny', 'Viry Radio', 'Viry IRM/Scanner', 'Athis', 'Evry']" :key="i" expand-separator
            :label="locat"
            :class="users.filter(u => u.lieu === locat && u.role !== 'admin' && u.last_message?.lu === 0 && u.last_message?.id_envoyeur !== me.id).length !== 0 ? 'locat not-see' : 'locat'">
            <div class="px-5 pb-2 text-[15px]">
              <div class="flex justify-between">
                <p>Radiologue</p>
                <q-btn flat color="secondary" icon="forum" @click="() => {
                  global = true;
                  listReceiver = users.filter(u => u.lieu === locat && u.role === 'radiologue');
                }" size="10px" />
              </div>
              <section-admin-listdiscu :listdiscu="users.filter(u => u.lieu === locat && u.role === 'radiologue')"
                :users="users" :select="select" :isActiveDiscu="isActiveDiscu" />
            </div>
            <div class="px-5 pb-5 text-[15px]">
              <div class="flex justify-between">
                <p>Secrétaire/Manip</p>
                <q-btn flat color="secondary" icon="forum" @click="{
                  global = true;
                  listReceiver = users.filter(u => u.lieu === locat && u.role === 'secretaire');
                }" size="10px" />
              </div>
              <section-admin-listdiscu :listdiscu="users.filter(u => u.lieu === locat && u.role === 'secretaire')"
                :users="users" :select="select" :isActiveDiscu="isActiveDiscu" />
            </div>
          </q-expansion-item>
        </div>
        <div v-else>
          <section-admin-listdiscu :listdiscu="users.filter(u => !u.lieu)" :users="users" :select="select"
            :isActiveDiscu="isActiveDiscu" />
        </div>
        <q-dialog v-model="global" persistent>
          <q-card style="min-width: 350px">
            <q-card-section>
              <div class="text-h6">Votre message:</div>
            </q-card-section>

            <q-card-section class="q-pt-none">
              <q-input dense v-model="globalMes" autofocus @keyup.enter="global = false" />
            </q-card-section>

            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Annuler" v-close-popup />
              <q-btn flat label="Envoyer" v-close-popup @click="sendGlobalMessage" />
            </q-card-actions>
          </q-card>
        </q-dialog>
      </div>
    </div>
    <div class="pg-messagerie__content" v-if="discussion">
      <div class="pg-messagerie__content-header">
        <h2>{{ discussion?.nom }}</h2>
      </div>
      <div id="message-container" class="pg-messagerie__content-body">
        <div class="item" :class="{ me: mes.id_envoyeur === me['id'] }" v-for="mes in messages.sort(
          (a, b) =>
            new Date(a.created_at).getTime() -
            new Date(b.created_at).getTime()
        )" :key="mes.created_at">
          <div class="message">
            <div class="logo">
              <img src="/images/unity.jpg" alt="" />
            </div>
            <div class="content relative">
              <div v-html="mes.message">
              </div>
              <q-tooltip>
                <p>{{ format(mes.created_at) }}</p>
              </q-tooltip>
              <div class="flex flex-nowrap absolute bottom-[-15px]"
                :style="{ 'left': mes.id_envoyeur === me['id'] ? '' : '0', 'right': mes.id_envoyeur === me['id'] ? '0' : '' }"
                v-if="mes.lu === 1">
                <q-icon name="check" style="color: #2e9b4f" size="15px" />
                <q-icon name="check" style="color: #2e9b4f" size="15px" />
              </div>
            </div>
          </div>
        </div>
      </div>
      <form class="pg-messagerie__content-chatting" v-if="discussion" id="send-message" autocomplete="off"
        @submit.prevent="sendMessage">
        <input autocomplete="false" name="hidden" type="text" style="display:none;">
        <div class="send">
          <input placeholder="Message" id="scrollableTextarea" v-model="messageInput" />
          <button type="submit">
            <img src="/images/send-message.png" alt="" />
          </button>
        </div>
      </form>
    </div>
    <div class="" v-else>
      <div class="pg-messagerie__content-header">
        <h2>Veuillez selectionner une discussion</h2>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "admin",
});
const socket = socketStore();
const discussion = ref<any>(null);
const users = ref<any[]>([]);
const { $api } = useNuxtApp();
const messageInput = ref<string>("");
const messages = ref<
  {
    message: string;
    created_at: string;
    lu: 0 | 1;
    id_envoyeur: number;
    id_receveur: string;
  }[]
>([]);
const room = ref<string | null>(null);
const userCookie: any = useCookie("user");
const me = userCookie.value;

const isActiveDiscu = ref<string | null>();
const onglet = ref<string>("actif");
const global = ref<boolean>(false);
const globalMes = ref<string>("");
const listReceiver = ref<any[]>([]);

const sendGlobalMessage = () => {
  if (globalMes.value.trim() !== "") {
    for (let user of listReceiver.value) {
      socket.emit("message", {
        message: globalMes.value,
        id: me.id,
        dest_id: user.id,
        room: me.id! > user.id ? `room-${me.id}-${user.id}` : `room-${user.id}-${me.id}`,
      });
    }
    globalMes.value = "";
    listReceiver.value = [];
  }
};

const select = (user: any) => {
  isActiveDiscu.value = user.id;
  if (room.value) {
    socket.emit("leave", { room: room.value });
  }
  messages.value = [];
  room.value =
    me.id! > user.id ? `room-${me.id}-${user.id}` : `room-${user.id}-${me.id}`;
  socket.emit("join", { room: room.value });
  socket.emit("getMessages", {
    id: me.id,
    dest_id: user.id,
    room: room.value,
  });
  discussion.value = user;

  const container = document.getElementById("message-container");
  if (container) {
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 1000);
  }
};

const sendMessage = () => {
  if (messageInput.value.trim() !== "") {
    socket.emit("message", {
      message: messageInput.value,
      id: me?.id,
      dest_id: discussion.value.id,
      room: room.value,
    });
    messageInput.value = "";
  }
};

onBeforeMount(async () => {
  try {
    const token = useCookie("token");
    if (token) {
      const u = await $api.get("user/all", {
        headers: {
          Authorization: `Bearer ${token.value}`,
        },
      });
      users.value = u.data.users;
      socket.on("online", (data: { users: { id: number; lieu: string; last_message: { id_envoyeur: number; id_receveur: number; message: string; lu: 0 | 1 } }[] }) => {
        users.value = data.users
      });
      socket.on(
        "message",
        (data: {
          message: string;
          created_at: string;
          id_envoyeur: number;
          id_receveur: string;
          lu: 0 | 1;
        }) => {
          messages.value = [...messages.value, data];
          const container = document.getElementById("message-container");
          if (container) {
            setTimeout(() => {
              container.scrollTop = container.scrollHeight;
            }, 100);
          }
        }
      );
      socket.on(
        "getMessages",
        (
          data: {
            message: string;
            created_at: string;
            id_envoyeur: number;
            id_receveur: string;
            lu: 0 | 1;
          }[]
        ) => {
          console.log(data);
          messages.value = data;
        }
      );
      socket.on("newdata", () => {
        socket.emit("online", {});
      });
      socket.emit('online', {});
    } else {
      throw new Error("Token not found");
    }
  } catch (error) {
    console.log(error);
    const token = useCookie("token");
    token.value = null;
  }
});

onBeforeUnmount(() => {
  socket.emit("leave", { room: room.value });
  socket.off('newdata', () => { })
  socket.off('getMessages', () => { })
  socket.off('message', () => { });
});
const format = (dateString: string) => {
  const date = new Date(dateString).toLocaleString("fr-FR", {
    timeZone: "Europe/Paris",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
  return date;
};
</script>
