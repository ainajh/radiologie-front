<template>
  <client-only>
    <planning-print />
  </client-only>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "print",
});

const commentStore = useCommentScheduleStore();
const { message, dataToPrint } = storeToRefs(commentStore);
const router = useRouter();
onMounted(() => {
  console.log(dataToPrint.value.length);

  if (dataToPrint.value.length === 0) {
    router.push("/dashboard/planning");
    return;
  }
});
</script>
