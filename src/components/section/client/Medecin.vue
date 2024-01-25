<template>
  <div class="w-full p-4">
    <slot />
  </div>
</template>

<script lang="ts" setup>
defineProps({
  pageClass: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
});
</script>
