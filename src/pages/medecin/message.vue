<template>
  <div class="flex flex-nowrap" style="height: calc(100vh - 80px);">
    <div class="users flex flex-col gap-1 p-4 min-w-[300px] w-[30%] h-full" style="border-right: solid 1px #eee;">
      <div v-for="user in users" :key="user.id" @click="select(user)">
        <section-tool-user-online :user="user" />
      </div>
    </div>
    <div v-if="discussion" class="discussions flex flex-col gap-1 flex-nowrap p-4 h-full w-full">
      <div class="flex justify-between items-center font-bold w-full pb-2 px-4" style="border-bottom: solid 1px #eee;">
        <q-avatar style="position: relative; background-color:aliceblue;">
          <q-icon name="person" />
        </q-avatar>
        <p style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">{{ discussion.nom }}</p>
        <span></span>
      </div>
      <div id="message-container"
        class="h-full max-h-full w-full overflow-auto items-start flex flex-col gap-2 flex-nowrap">
        <div
          :class="mes.id_envoyeur !== userStore().id ? 'flex justify-start gap-2 w-full' : 'flex justify-end gap-2 w-full'"
          v-for="mes in messages.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())"
          :key="mes.created_at">
          <q-avatar size="30px" v-if="mes.id_envoyeur !== userStore().id"
            style="position: relative; background-color:aliceblue;">
            <q-icon name="person" />
          </q-avatar>
          <section-tool-message-item :envoyeur="mes.id_envoyeur !== userStore().id" :mes="mes" />
        </div>
      </div>
      <form v-if="discussion" id="send-message" @submit.prevent="sendMessage">
        <input placeholder="Message" v-model="messageInput" multiple />
        <button>
          <img src="/images/send-message.png" alt="" />
        </button>
      </form>
    </div>
    <div v-else class="w-full h-full flex items-center justify-center">
      Séléctionner un utilisateur
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "client",
});
const socket = socketStore();
const discussion = ref<any>(null);
const users = ref<any[]>([]);
const router = useRouter();
const { $api } = useNuxtApp();
const messageInput = ref<string>("");
const messages = ref<{ message: string; created_at: string; id_envoyeur: number; id_receveur: string; }[]>([]);
const room = ref<string | null>();

const select = (user: any) => {
  if (room) {
    socket.emit('leave', { room: room.value });
  }
  messages.value = [];
  room.value = userStore().id! > user.id ? `room-${userStore().id}-${user.id}` : `room-${user.id}-${userStore().id}`;
  socket.emit('join', { room: room.value });
  socket.emit('getMessages', { id: userStore().id, dest_id: user.id, room: room.value });
  discussion.value = user;
  const container = document.getElementById("message-container");
  if (container) {
    setTimeout(() => {
      container.scrollTop = container.scrollHeight;
    }, 1000);
  }
}

const sendMessage = () => {
  if (messageInput.value.trim() !== "") {
    socket.emit('message', { message: messageInput.value, id: userStore().id, dest_id: discussion.value.id, room: room.value });
    messageInput.value = "";
  }
}

onBeforeMount(async () => {
  try {
    const token = localStorage.getItem("tokenmedecin");
    if (token) {
      const u = await $api.get("user/all", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      users.value = u.data.users;
      socket.connect();
      socket.on('online', (data: { users: number[] }) => {
        const usersOnline = data.users;
        users.value = users.value.map(us => ({
          ...us,
          online: usersOnline.includes(us.id.toString())
        }))
      });
      socket.on('message', (data: { message: string; created_at: string; id_envoyeur: number; id_receveur: string; }) => {
        messages.value = [...messages.value, data];
        const container = document.getElementById("message-container");
        if (container) {
          setTimeout(() => {
            container.scrollTop = container.scrollHeight;
          }, 100);
        }
      });
      socket.on('getMessages', (data: { message: string; created_at: string; id_envoyeur: number; id_receveur: string; }[]) => {
        messages.value = data;

      });
    } else {
      throw new Error("Token not found");
    }
  } catch (error) {
    console.log(error);
    router.push("/medecin");
    localStorage.removeItem("tokenmedecin");
  }
})
onMounted(() => {
  const container = document.getElementById("message-container");
  if (container) {
    container.scrollTop = container.scrollHeight;
  }
})
onUnmounted(() => {
  socket.disconnect();
})
</script>