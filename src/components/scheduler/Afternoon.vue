<script setup lang="ts">
import Schedule from './Schedule.vue'
import EventModal from './EventModal.vue'
const props = defineProps([
  'week',
  'saveShift',
  'shifts',
  'block',
  'updateShift',
  'deleteShift',
  'monthIndex'
])
</script>

<template>
  <div class="w-full flex flex-row flex-nowrap mr-[1px]" v-for="(e, i) in props.week" :key="i">
    <EventModal :date="e" :saveShift="props.saveShift" :block="props.block">
      <Schedule
        :date="e"
        :label="'pm'"
        :saveShift="props.saveShift"
        :shifts="props.shifts"
        :block="props.block"
        :index="i"
        :updateShift="props.updateShift"
        :deleteShift="props.deleteShift"
        :monthIndex="props.monthIndex"
      />
    </EventModal>
  </div>
</template>

<style scoped></style>
