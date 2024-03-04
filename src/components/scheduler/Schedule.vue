<script setup lang="ts">
import dayjs from "dayjs";
import BadgePersonInShift from "./BadgePersonInShift.vue";
import type { DataShift } from "@/utils/constants/shift-interface";
import { TimeInDay } from "@/utils/constants/time-in-day";
import isBeforeToday from "@/utils/functions/is-before-today";
const props = defineProps([
  "date",
  "isMorning",
  "label",
  "saveShift",
  "updateShift",
  "shifts",
  "block",
  "deleteShift",
  "monthIndex",
  "typeTab",
  "actualShift",
  "userList",
]);

function filteredShifts(): [DataShift?] {
  const desiredShift = props.actualShift;
  if (props.shifts?.length != 0) {
    return props.shifts?.filter((shift: DataShift) => {
      return (
        dayjs(shift.date).format("DD-MM-YYYY") ===
          dayjs(props.date).format("DD-MM-YYYY") &&
        shift.shift === desiredShift &&
        shift.idType === props.block?.id
      );
    });
  }
  return [];
}
</script>

<template>
  <div
    class="flex-1 h-full w-full min-h-20 p-0.5"
    :class="{
      ' bg-blue-100 ':
        props.actualShift === TimeInDay.Morning && !isBeforeToday(props?.date),
      ' bg-cyan-100 ':
        props.actualShift === TimeInDay.Noon && !isBeforeToday(props?.date),
      ' bg-yellow-100 ':
        props.actualShift === TimeInDay.Afternoon &&
        !isBeforeToday(props?.date),
      ' bg-slate-100 ': isBeforeToday(props?.date),
    }"
  >
    <p class="text-center text-gray-400">
      {{ props.label }}
    </p>
    <div v-for="(shift, i) in filteredShifts()" :key="shift?.id">
      <BadgePersonInShift
        :userList="props.userList"
        :name="shift?.nom"
        :shift="shift"
        :updateShift="props.updateShift"
        :deleteShift="props.deleteShift"
        :typeTab="props.typeTab"
        :block="props.block"
        :actualShift="props.actualShift"
      />
    </div>
  </div>
</template>

<style scoped></style>
