<template>
  <layout-client-header />
  <section>
    <div
      v-if="loading"
      class="w-[100vw] h-[50vh] flex items-center justify-center"
    >
      <q-circular-progress indeterminate rounded size="50px" class="q-ma-md" />
    </div>
    <slot v-else/>
  </section>
</template>

<script setup lang="ts">
const user = userStore();
const { $api } = useNuxtApp();
const loading = useState("pageloading", () => true);
const router = useRouter();
onMounted(async () => {
  try {
    const token = localStorage.getItem("tokenmedecin");
    if (token) {
      const res = await $api.get("user/check/medecin", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      user.setConnected(res.data.user);
    }
    if(user.role !== "medecin"){
      router.push('/')
    }
  } catch (error) {
    console.log(error);
    localStorage.removeItem("tokenmedecin");
  } finally {
    loading.value = false;
  }
});
</script>
