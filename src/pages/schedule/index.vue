<script setup lang="ts">
import Month from "@/components/scheduler/Month.vue";
definePageMeta({
  layout: "admin",
});
</script>

<template>
  <div class="w-full bg-white">
    <div class="my-10 mx-5 py-2">
      <ClientOnly>
        <Month />
      </ClientOnly>
    </div>
  </div>
</template>

<style scoped></style>
