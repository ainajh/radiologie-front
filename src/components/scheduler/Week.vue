<script setup lang="ts">
import Day from './Day.vue'
const props = defineProps(['week', 'monthIndex'])
</script>

<template>
  <div class="w-full flex flex-row flex-nowrap space-x-1" v-for="(e, i) in props.week" :key="i">
    <Day :day="e" :monthIndex="props.monthIndex" />
  </div>
</template>

<style scoped></style>
