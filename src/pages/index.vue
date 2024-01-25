<template>
  <demande />
</template>

<script setup lang="ts">
definePageMeta({
  layout: "client",
});
const { $api } = useNuxtApp();
const user = userStore();
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
  }
});
</script>
