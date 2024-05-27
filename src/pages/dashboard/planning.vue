<template>
  <client-only>
    <planning />
  </client-only>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "admin",
  middleware: "admin",
});
</script>
