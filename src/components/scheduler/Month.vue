<script setup lang="ts">
import dayjs from "dayjs";
import { ref, onMounted } from "vue";
import Week from "./Week.vue";
import Morning from "./Morning.vue";
import Afternoon from "./Afternoon.vue";
import getMonth from "@/utils/functions/get-month";
import ScheduleService from "@/services/schedule.service";
import TypeService from "@/services/type.service";
import type { DataShift } from "@/utils/constants/shift-interface";
import { TimeInDay } from "@/utils/constants/time-in-day";
import UserService from "@/services/user.service";

let currentMonth = ref(getMonth());
let weekIndex = ref(0);
let monthIndex = ref(0);
let data = ref<any[]>();
let copyShcedules = ref<any[]>();
const userList = await UserService.getAll();
const typeTab = await TypeService.getAll();

onMounted(async () => {
  data.value = await ScheduleService.getAll();
  thisMonth();
});

function increment() {
  if (weekIndex.value == 0) {
    weekIndex.value = 4;
    previousMonth(false);
    return;
  }
  weekIndex.value--;
}

function decrement() {
  if (weekIndex.value == 4) {
    weekIndex.value = 0;
    nextMonth(false);
    return;
  }
  weekIndex.value++;
}

function thisMonth() {
  currentMonth.value = getMonth();
  monthIndex.value = dayjs().month();
  const i = currentMonth.value.findIndex((shift, i) => {
    const found = currentMonth.value[i].findIndex(
      (e) => e.format("DD") === dayjs().format("DD")
    );
    if (found !== -1) {
      return true;
    }
    return false;
  });
  if (i !== -1) {
    weekIndex.value = i;
  }
}

function nextMonth(isweekIndexChange = true) {
  monthIndex.value++;
  if (isweekIndexChange) weekIndex.value = 0;
  currentMonth.value = getMonth(monthIndex.value);
}

function previousMonth(isweekIndexChange = true) {
  monthIndex.value--;
  if (isweekIndexChange) weekIndex.value = 4;
  currentMonth.value = getMonth(monthIndex.value);
}

function actualDate() {
  return dayjs(new Date(dayjs().year(), monthIndex.value)).format("MMMM YYYY");
}

async function saveShift(dataShift: DataShift) {
  if (data.value === undefined) return;
  await ScheduleService.create(dataShift);
  data.value = await ScheduleService.getAll();
}

async function updateShift(updatedShift: DataShift) {
  if (data.value === undefined) return;
  await ScheduleService.update(updatedShift);
  data.value = await ScheduleService.getAll();
}

async function deleteShift(id: number) {
  if (data.value === undefined) return;
  await ScheduleService.deleteOne(id);
  data.value = await ScheduleService.getAll();
}

async function copyShcedule() {
  copyShcedules.value = [
    currentMonth.value[weekIndex.value][0].format("YYYY-MM-DD"),
    currentMonth.value[weekIndex.value][6].format("YYYY-MM-DD"),
  ];
}

async function pasteShcedule() {
  const pasteShcedules = [
    currentMonth.value[weekIndex.value][0].format("YYYY-MM-DD"),
    currentMonth.value[weekIndex.value][6].format("YYYY-MM-DD"),
  ];
  await ScheduleService.copyPaste(copyShcedules.value, pasteShcedules);
  data.value = await ScheduleService.getAll();
}
</script>

<template>
  <div class="bg-white text-black">
    <div class="flex flex-row flex-nowrap">
      <p class="mx-5">week : {{ weekIndex }}</p>
      <button
        @click="increment"
        class="flex justify-center items-center h-auto min-w-5 rounded bg-slate-400 text-white"
      >
        &lt;
      </button>
      <div class="mx-2">|</div>
      <button
        @click="decrement"
        class="flex justify-center items-center h-auto min-w-5 rounded bg-slate-400 text-white"
      >
        >
      </button>
      <button
        @click="thisMonth"
        class="mx-5 flex justify-center items-center h-auto px-2 rounded bg-slate-400 text-white"
      >
        Today
      </button>
      <p class="mx-5">||</p>
      <p class="mx-5">month</p>
      <button
        @click="
          (e: MouseEvent) => {
            previousMonth()
            return e
          }
        "
        class="flex justify-center items-center h-auto min-w-5 rounded bg-slate-400 text-white"
      >
        &lt;
      </button>
      <div class="mx-2">|</div>
      <button
        @click="
          (e: MouseEvent) => {
            nextMonth() 
            return e
          }
        "
        class="flex justify-center items-center h-auto min-w-5 rounded bg-slate-400 text-white"
      >
        >
      </button>
      <p class="mx-5 w-28">{{ actualDate() }}</p>
      <div class="w-5"></div>
      <button
        @click="copyShcedule"
        class="flex justify-center items-center h-auto min-w-5 rounded bg-slate-400 text-white px-2"
      >
        Copy
      </button>
      <div class="w-5"></div>
      <button
        @click="pasteShcedule"
        class="flex justify-center items-center h-auto min-w-5 rounded bg-slate-400 text-white px-2"
      >
        Paste
      </button>
      <div class="flex-1"></div>
      <div
        class="w-30 max-h-5 flex items-center justify-center bg-cyan-800 px-5 rounded"
      >
        <p class="text-center text-white">Working day</p>
      </div>
      <div class="w-5"></div>
      <div
        class="w-30 max-h-5 flex items-center justify-center bg-green-600 px-5 rounded"
      >
        <p class="text-center text-white">Holiday</p>
      </div>
    </div>
    <div class="w-full flex flex-row flex-nowrap">
      <div class="w-20 max-w-20 flex items-center justify-center">
        <p class="text-center"></p>
      </div>
      <div class="w-full flex flex-row flex-nowrap my-1 space-x-0.5">
        <div class="w-full"></div>
        <Week :week="currentMonth[weekIndex]" :monthIndex="monthIndex" />
      </div>
    </div>

    <div
      class="w-full flex flex-row flex-nowrap"
      v-for="(e, i) in typeTab"
      :key="i"
    >
      <div class="w-20 flex items-center justify-center">
        <p class="text-center w-20 overflow-elipsis">
          {{ e.nom_type + "-" + e.nom_sous_type }}
        </p>
      </div>
      <div class="w-full flex flex-col">
        <div class="flex flex-row flex-nowrap">
          <div class="w-full flex flex-nowrap items-center justify-center">
            <p class="text-center">{{ TimeInDay.Morning }}</p>
          </div>
          <Morning
            :week="currentMonth[weekIndex]"
            :saveShift="saveShift"
            :updateShift="updateShift"
            :shifts="data"
            :block="e"
            :deleteShift="deleteShift"
            :monthIndex="monthIndex"
            :typeTab="typeTab"
            :userList="userList"
          />
        </div>
        <div class="flex flex-row flex-nowrap">
          <div class="w-full flex flex-nowrap items-center justify-center">
            <p class="text-center">{{ TimeInDay.Afternoon }}</p>
          </div>
          <Afternoon
            :week="currentMonth[weekIndex]"
            :saveShift="saveShift"
            :updateShift="updateShift"
            :shifts="data"
            :block="e"
            :deleteShift="deleteShift"
            :monthIndex="monthIndex"
            :typeTab="typeTab"
            :userList="userList"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
