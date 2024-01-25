<template>
  <change-pass></change-pass>
</template>
<script>
export default {
  setup() {
    definePageMeta({
      layout: "admin",
      middleware: "admin",
    });
  },
};
</script>
