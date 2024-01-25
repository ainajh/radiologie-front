<template>
  <div v-if="loading">Loading</div>
  <demande v-else />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "client",
});
const loading = useState("loading", () => true);
const user = userStore();
const { $api } = useNuxtApp();
onBeforeMount(async () => {
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
  } catch (error) {
    console.log(error);
    localStorage.removeItem("tokenmedecin");
  } finally {
    loading.value = false;
  }
});
</script>
