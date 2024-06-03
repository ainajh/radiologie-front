<template>
  <div class="schedulan border" v-for="(e, i) in props.week" :key="i">
    <EventModal
      :date="e"
      :actualShift="TimeInDay.Noon"
      :saveShift="props.saveShift"
      :block="props.block"
      :userList="props.userList"
      :weekValidate="weekValidate"
    >
      <PlanningSchedule
        :userList="props.userList"
        :date="e"
        :label="'noon'"
        :saveShift="props.saveShift"
        :shifts="props.shifts"
        :block="props.block"
        :index="i"
        :updateShift="props.updateShift"
        :deleteShift="props.deleteShift"
        :monthIndex="props.monthIndex"
        :typeTab="props.typeTab"
        :actualShift="TimeInDay.Noon"
        :reload="props.reload"
        :bg="props.bg"
        :listPersonHolyday="listPersonHolyday"
      />
    </EventModal>
  </div>
</template>

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
  "listPersonHolyday",
  "weekValidate",
]);

//line to import
import Schedule from "../scheduler/Schedule.vue";
import EventModal from "../scheduler/EventModal.vue";
import { TimeInDay } from "@/utils/constants/time-in-day";

//line to use composable

//line to declare variable

//line to use function
const isTheDayToday = () =>
  props.day.format("DD-MM-YY") === dayjs().format("DD-MM-YY");

//line to use Hooks
</script>
