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
  "reload",
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
      :saveShift="props.saveShift"
      :block="props.block"
      :userList="$props.userList"
      :actualShift="TimeInDay.Afternoon"
    >
      <Schedule
        :date="e"
        :label="'pm'"
        :saveShift="props.saveShift"
        :shifts="props.shifts"
        :block="props.block"
        :reload="props.reload"
        :index="i"
        :updateShift="props.updateShift"
        :deleteShift="props.deleteShift"
        :monthIndex="props.monthIndex"
        :typeTab="props.typeTab"
        :userList:="props.userList"
        :actualShift="TimeInDay.Afternoon"
      />
    </EventModal>
  </div>
</template>

<style scoped></style>
