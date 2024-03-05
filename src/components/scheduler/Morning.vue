<script setup lang="ts">
import Schedule from "./Schedule.vue";
import EventModal from "./EventModal.vue";
import { TimeInDay } from "@/utils/constants/time-in-day";
const props = defineProps([
  "week",
  "saveShift",
  "shifts",
  "block",
  "updateShift",
  "deleteShift",
  "monthIndex",
  "typeTab",
  "userList",
]);
</script>

<template>
  <div
    class="w-full flex flex-row flex-nowrap mr-[1px]"
    v-for="(e, i) in props.week"
    :key="i"
  >
    <EventModal
      :date="e"
      :actualShift="TimeInDay.Morning"
      :saveShift="props.saveShift"
      :block="props.block"
      :userList="props.userList"
    >
      <Schedule
        :userList="props.userList"
        :date="e"
        :isMorning="true"
        :label="'am'"
        :saveShift="props.saveShift"
        :shifts="props.shifts"
        :block="props.block"
        :index="i"
        :updateShift="props.updateShift"
        :deleteShift="props.deleteShift"
        :monthIndex="props.monthIndex"
        :typeTab="props.typeTab"
        :actualShift="TimeInDay.Morning"
      />
    </EventModal>
  </div>
</template>

<style scoped></style>
