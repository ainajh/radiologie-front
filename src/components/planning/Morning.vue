<template>
  <div class="schedulan border" v-for="(e, i) in props.week" :key="i">
    <LazyEventModal
      :date="e"
      :actualShift="TimeInDay.Morning"
      :saveShift="props.saveShift"
      :block="props.block"
      :userList="props.userList"
      :weekValidate="weekValidate"
    >
      <LazyPlanningSchedule
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
        :reload="props.reload"
        :bg="props.bg"
        :listPersonHolyday="listPersonHolyday"
        :checkIfHasPersonHoliDay="checkIfHasPersonHoliDay"
      />
    </LazyEventModal>
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
  "checkIfHasPersonHoliDay",
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
