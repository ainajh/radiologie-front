<template>
  <q-layout class="pg-admin">
    <LayoutAdminHeader />
    <main class="pg-admin__main">
      <div class="pg-admin__main-content mx-auto">
        <slot></slot>
      </div>
    </main>
  </q-layout>
</template>

<script setup lang="ts">
const socket = socketStore();

onMounted(() => {
  socket.connect(useCookie('location').value ?? "Savigny");
})

onBeforeUnmount(() => {
  socket.disconnect();
});
</script>