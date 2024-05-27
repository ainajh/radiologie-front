<script setup lang="ts">
//line to use meta
const props = defineProps([
  "week",
  "saveShift",
  "shifts",
  "block",
  "updateShift",
  "reload",
  "deleteShift",
  "monthIndex",
  "typeTab",
  "userList",
  "bg",
]);

//line to import
import Schedule from "../scheduler/Schedule.vue";
import EventModal from "../scheduler/EventModal.vue";
import { TimeInDay } from "@/utils/constants/time-in-day";

//line to use composable

//line to declare variable

//line to use function

//line to use Hooks
</script>
<template>
  <div class="schedulan border" v-for="(e, i) in props.week" :key="i">
    <EventModal
      :date="e"
      :saveShift="props.saveShift"
      :block="props.block"
      :userList="$props.userList"
      :actualShift="TimeInDay.Afternoon"
    >
      <PlanningSchedule
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
        :bg="props.bg"
      />
    </EventModal>
  </div>
</template>
