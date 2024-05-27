<template>
  <div
    class="bg-[#3B4CB8] day h-full text-white flex flex-col justify-center items-center text-xs"
  >
    <div class="font-bold text-[0.8em]">
      {{ day.format("dddd").toUpperCase() }}
    </div>
    <div
      class="w-[25px] h-[25px] flex justify-center items-center rounded-xl text-xs font-bold"
      :class="{
        'bg-white text-black': !isTheDayToday() && !isBeforeToday(props.day),
        'bg-white text-black opacity-25':
          isBeforeToday(props.day) ||
          (isMemberOfCurrentMonth(props.monthIndex, props.day) &&
            !isTheDayToday()),
        'bg-green-500 text-white ': isTheDayToday(),
      }"
    >
      {{ props.day.format("DD") }}
    </div>
  </div>
</template>

<script setup lang="ts">
//line to use meta
const props = defineProps(["day", "monthIndex"]);

//line to import
import isBeforeToday from "@/utils/functions/is-before-today";
import isMemberOfCurrentMonth from "@/utils/functions/is-member-of-current-month";
import dayjs from "dayjs";

//line to use composable

//line to declare variable

//line to use function
const isTheDayToday = () =>
  props.day.format("DD-MM-YY") === dayjs().format("DD-MM-YY");

//line to use Hooks
</script>
