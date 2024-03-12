<template>
  <header class="pg-client-header flex justify-around">
    <div id="logo">
      <nuxt-link to="/">
        <div class="flex items-center">
          <img src="/images/logo.jpg" alt="Logo" class="h-[80px]" />
        </div>
      </nuxt-link>
    </div>
    <nav v-if="!user.role">
      <nuxt-link to="/">Patient</nuxt-link>
      <nuxt-link to="/medecin">Médecin</nuxt-link>
    </nav>
    <nav v-else>
      <nuxt-link to="/medecin">Liste des demandes</nuxt-link>
      <nuxt-link to="/medecin/profil">Profil</nuxt-link>
      <nuxt-link :to="`/medecin/modification-mot-de-passe/${user.id}`">Modifier mot de passe</nuxt-link>
      <!-- <nuxt-link :to="`/medecin/conge`">Prendre congé</nuxt-link> -->
    </nav>
    <div class="flex gap-2">
      <q-avatar style="background-color: aliceblue">
        <q-icon name="person" />
        <q-menu anchor="bottom middle" self="top middle" v-if="user.role">
          <q-btn class="p-4 flex gap-2 items-center" @click="logout">
            <q-icon name="logout" />
            <p>Déconnexion</p>
          </q-btn>
        </q-menu>
      </q-avatar>

      <h3 class="text-bold">{{ user.role ? "Médecin" : "Patient" }}</h3>
    </div>
  </header>
</template>

<script setup>
import { getCurrentInstance } from "vue";
const toast = getCurrentInstance().appContext.config.globalProperties.$toast;
const user = userStore();
const { $api } = useNuxtApp();
const router = useRouter();
async function logout() {
  const res = await $api.post(
    "user/logout",
    {},
    {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("tokenmedecin")}`,
      },
    }
  );
  toast.success(res.data.message);
  router.push("/");
  localStorage.removeItem("tokenmedecin");
  user.setDisconnected();
}
</script>
