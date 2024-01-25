<template>
  <section-client-login v-if="!user.role" />
  <section-client-container v-else />
</template>

<script setup>
definePageMeta({
  layout: "client",
});
const user = userStore();
</script>
