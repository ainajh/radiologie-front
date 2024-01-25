<template>
  <header class="pg-admin__header mx-auto max-w-[1400px]">
    <div class="pg-admin__header-content">
      <nuxt-link to="/dashboard" class="logo">
        <div class="image">
          <img src="/images/logo.jpg" alt="" />
        </div>
        <!-- <div class="title">LOGO</div> -->
      </nuxt-link>
      <div class="nav">
        <ul>
          <li v-if="userDash?.role == 'admin'">
            <nuxt-link to="/dashboard" :class="{ active: $route.path == '/dashboard' }">Liste
              Demande</nuxt-link>
          </li>
          <li v-if="userDash?.role == 'admin'">
            <nuxt-link to="/dashboard/gestion-type" :class="{ active: $route.path.includes('gestion-type') }">Gestion
              Type</nuxt-link>
          </li>
          <!-- <li v-if="userDash?.role == 'admin'">
            <nuxt-link
              to="/dashboard/gestion-sous-type"
              :class="{ active: $route.path.includes('gestion-sous-type') }"
              >Gestion Sous Type</nuxt-link
            >
          </li> -->
          <li v-if="userDash?.role == 'admin'">
            <nuxt-link to="/dashboard/utilisateur"
              :class="{ active: $route.path.includes('utilisateur') }">Utilisateurs</nuxt-link>
          </li>
          <!-- <li v-if="userDash?.role == 'radiologue'">
            <nuxt-link
              to="/dashboard/messagerie"
              :class="{ active: $route.path.includes('messagerie') }"
              >Messagerie</nuxt-link
            >
          </li> -->
          <li v-if="userDash?.role == 'admin'">
            <nuxt-link to="/dashboard/statistique"
              :class="{ active: $route.path == '/dashboard/statistique' }">Statistique</nuxt-link>
          </li>
        </ul>
      </div>
      <div class="user-admin">
        <div class="chat mr-2">
          <q-badge color="red" floating>{{ badge.nb }}</q-badge>
          <nuxt-link to="/dashboard/messagerie" class="image">
            <img src="/images/chat.png" />
          </nuxt-link>
          <!-- <div class="count">2</div> -->
        </div>
        <div class="info">
          <div class="name">{{ userDash?.nom }}</div>
          <div class="role text-capialize">{{ userDash?.role }}</div>
        </div>
        <div class="avatar">
          <q-avatar style="background-color: aliceblue">
            <q-icon name="person" />
            <q-menu anchor="bottom middle" self="top middle">
              <q-btn class="p-4 flex gap-2 items-center" @click="logout">
                <q-icon name="logout" />
                <p>Déconnexion</p>
              </q-btn>
            </q-menu>
          </q-avatar>
        </div>
        <div class="pg-messagerie__side-new">
          <q-select v-model="lieu"
            :options="['Savigny', 'Viry Radio', 'Viry IRM/Scanner', 'Athis', 'Evry']"
            @update:model-value="changeLocation" emit-value map-options class="q-mb-md"
            placeholder="Selectionner un utilisateur" />
        </div>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const router = useRouter();
const userDash: any = useCookie("user").value;
const authStore = useAuthStore();
const badge = badgeStore();
const lieu = ref<string>(useCookie("location").value ?? "Savigny");
const changeLocation = (v: any) => {
  const location = useCookie("location");
  location.value = v;
  window.location.reload();
};

onMounted(() => {
  Notification.requestPermission();
})

function logout() {
  authStore.logUserOut();
  router.push("/authentification");
}

</script>
