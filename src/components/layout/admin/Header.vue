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
          <li>
            <nuxt-link
              to="/dashboard"
              :class="{ active: $route.path == '/dashboard' }"
              >Liste des demandes</nuxt-link
            >
          </li>
          <li v-if="userDash?.role == 'admin'">
            <nuxt-link
              to="/dashboard/gestion-type"
              :class="{ active: $route.path.includes('gestion-type') }"
              >Gestion Type</nuxt-link
            >
          </li>
          <li
            v-if="userDash?.role == 'admin' || userDash?.role == 'radiologue'"
          >
            <nuxt-link
              to="/dashboard/conge"
              :class="{ active: $route.path.includes('conge') }"
            >
              {{
                userDash?.role == "radiologue" ? "Prise des " : "Gestion des "
              }}
              congés</nuxt-link
            >
          </li>
          <li>
            <nuxt-link
              to="/dashboard/planning"
              :class="{ active: $route.path.includes('planning') }"
              >Planning</nuxt-link
            >
          </li>
          <!-- <li v-if="userDash?.role == 'admin'">
            <nuxt-link
              to="/dashboard/gestion-sous-type"
              :class="{ active: $route.path.includes('gestion-sous-type') }"
              >Gestion Sous Type</nuxt-link
            >
          </li> -->
          <li v-if="userDash?.role == 'admin'">
            <nuxt-link
              to="/dashboard/utilisateur"
              :class="{ active: $route.path.includes('utilisateur') }"
              >Utilisateurs</nuxt-link
            >
          </li>
          <li v-if="userDash?.role == 'admin'">
            <nuxt-link
              to="/dashboard/vacation"
              :class="{ active: $route.path.includes('vacation') }"
              >Nombre de vacations</nuxt-link
            >
          </li>
          <!-- <li v-if="userDash?.role == 'radiologue'">
            <nuxt-link
              to="/dashboard/messagerie"
              :class="{ active: $route.path.includes('messagerie') }"
              >Messagerie</nuxt-link
            >
          </li> -->
          <li v-if="userDash?.role == 'admin'">
            <nuxt-link
              to="/dashboard/statistique"
              :class="{ active: $route.path == '/dashboard/statistique' }"
              >Statistique</nuxt-link
            >
          </li>
        </ul>
      </div>
      <div class="nav-mobile">
        <q-btn flat dense color="accent" icon="segment">
          <q-menu fit anchor="bottom left" self="top left">
            <q-item
              style="min-width: 200px"
              clickable
              to="/dashboard"
              :class="{
                'bg-green-500 text-white': $route.path == '/dashboard',
              }"
            >
              <q-item-section>Liste des demandes</q-item-section>
            </q-item>
            <q-item
              style="min-width: 200px"
              clickable
              to="/dashboard/gestion-type"
              :class="{
                'bg-green-500 text-white': $route.path.includes('gestion-type'),
              }"
              v-if="userDash?.role == 'admin'"
            >
              <q-item-section>Gestion Type</q-item-section>
            </q-item>

            <q-item
              style="min-width: 200px"
              clickable
              to="/dashboard/conge"
              :class="{
                'bg-green-500 text-white': $route.path.includes('conge'),
              }"
              v-if="userDash?.role == 'admin' || userDash?.role == 'radiologue'"
            >
              <q-item-section
                >{{
                  userDash?.role == "radiologue" ? "Prise des " : "Gestion des "
                }}
                congés</q-item-section
              >
            </q-item>

            <q-item
              style="min-width: 200px"
              clickable
              to="/dashboard/planning"
              :class="{
                'bg-green-500 text-white': $route.path.includes('planning'),
              }"
            >
              <q-item-section>Planning</q-item-section>
            </q-item>

            <q-item
              v-if="userDash?.role == 'admin'"
              style="min-width: 200px"
              clickable
              to="/dashboard/utilisateur"
              :class="{
                'bg-green-500 text-white': $route.path.includes('utilisateur'),
              }"
            >
              <q-item-section>Utilisateurs</q-item-section>
            </q-item>
            <q-item
              v-if="userDash?.role == 'admin'"
              style="min-width: 200px"
              clickable
              to="/dashboard/vacation"
              :class="{
                'bg-green-500 text-white': $route.path.includes('vacation'),
              }"
            >
              <q-item-section>Nombre de vacations</q-item-section>
            </q-item>
            <q-item
              v-if="userDash?.role == 'admin'"
              style="min-width: 200px"
              clickable
              to="/dashboard/statistique"
              :class="{
                'bg-green-500 text-white':
                  $route.path == '/dashboard/statistique',
              }"
            >
              <q-item-section>Statistique</q-item-section>
            </q-item>
          </q-menu>
        </q-btn>
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
          <q-avatar style="background-color: aliceblue" dense>
            <q-icon name="person" />
            <q-menu anchor="bottom middle" self="top middle">
              <q-btn class="p-4 flex gap-2 items-center" @click="logout">
                <q-icon name="logout" />
                <p>Déconnexion</p>
              </q-btn>
            </q-menu>
          </q-avatar>
        </div>
        <div
          class="pg-messagerie__side-new"
          style="height: 50px; overflow: hidden; padding: 0 !important"
        >
          <q-select
            v-model="lieu"
            :options="[
              'Savigny',
              'Viry Radio',
              'Viry IRM/Scanner',
              'Athis',
              'Evry',
            ]"
            @update:model-value="changeLocation"
            emit-value
            map-options
            placeholder="Selectionner un utilisateur"
          />
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
});

function logout() {
  authStore.logUserOut();
  router.push("/authentification");
}
</script>
