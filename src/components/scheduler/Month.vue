<script setup lang="ts">
import dayjs, { Dayjs } from "dayjs";
import { ref, onMounted } from "vue";
import Week from "./Week.vue";
import Morning from "./Morning.vue";
import UpdateLeaveModal from "./UpdateLeaveModal.vue";
import Afternoon from "./Afternoon.vue";
import getMonth from "@/utils/functions/get-month";
import ScheduleService from "@/services/schedule.service";
import TypeService from "@/services/type.service";
import type { DataShift } from "@/utils/constants/shift-interface";
import { TimeInDay } from "@/utils/constants/time-in-day";
import UserService from "@/services/user.service";
import LeaveService from "@/services/leave.service";
import type { LeaveData } from "~/utils/constants/leave-interface";
import isBeforeToday from "~/utils/functions/is-before-today";

let currentMonth = ref(getMonth());
let weekIndex = ref(0);
let monthIndex = ref(0);
let data = ref<any[]>();
let dataHolidays = ref<any[]>();
let copyShcedules = ref<any[]>();
const userList = await UserService.getAll();
const typeTab = await TypeService.getAll();
let isOpen = ref(false);
let inputName = ref("");
let typeOfHoliday = ref("Holiday");
let inputStartDate = ref(dayjs().format("YYYY-MM-DD"));
let inputEndDate = ref(dayjs().format("YYYY-MM-DD"));

onMounted(async () => {
  data.value = await ScheduleService.getAll();
  thisMonth();
  fetchHolidayList();
});

function increment() {
  if (weekIndex.value == 0) {
    weekIndex.value = 4;
    previousMonth(false);
    fetchHolidayList();
    return;
  }
  weekIndex.value--;
  fetchHolidayList();
}

function decrement() {
  if (weekIndex.value == 4) {
    weekIndex.value = 0;
    nextMonth(false);
    fetchHolidayList();
    return;
  }
  weekIndex.value++;
  fetchHolidayList();
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
  fetchHolidayList();
}

function nextMonth(isweekIndexChange = true) {
  monthIndex.value++;
  if (isweekIndexChange) weekIndex.value = 0;
  currentMonth.value = getMonth(monthIndex.value);
  fetchHolidayList();
}

function previousMonth(isweekIndexChange = true) {
  monthIndex.value--;
  if (isweekIndexChange) weekIndex.value = 4;
  currentMonth.value = getMonth(monthIndex.value);
  fetchHolidayList();
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

function toggleModalCreateHotiday() {
  isOpen.value = !isOpen.value;
}

async function createHoliday() {
  try {
    const dataHodiday: LeaveData = {
      idPerson: parseInt(inputName.value),
      typeOfLeave: typeOfHoliday.value,
      dateStart: dayjs(new Date(inputStartDate.value)).format("YYYY-MM-DD"),
      dateEnd: dayjs(new Date(inputEndDate.value)).format("YYYY-MM-DD"),
    };
    await LeaveService.create(dataHodiday);
  } catch (e) {
    console.log(e);
  }

  inputName.value = "";
  inputStartDate.value = dayjs().format("YYYY-MM-DD");
  inputEndDate.value = dayjs().format("YYYY-MM-DD");
  isOpen.value = !isOpen.value;
  fetchHolidayList();
}

async function fetchHolidayList() {
  dataHolidays.value = await LeaveService.getAllBetweenTwoDate(
    currentMonth.value[weekIndex.value][0].format("YYYY-MM-DD"),
    currentMonth.value[weekIndex.value][6].format("YYYY-MM-DD")
  );
}

async function deleteHoliday(id: number) {
  await leaveService.deleteOne(id);
  fetchHolidayList();
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
        class="w-30 max-h-5 flex items-center justify-center bg-red-600 px-5 rounded"
      >
        <button class="w-full" @click="toggleModalCreateHotiday">
          <p class="text-center text-white">+ add holiday</p>
        </button>
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
  <div class="my-5">
    <div class="flex flex-row items-center">
      <p class="text-xl">Leave list :</p>
      <!-- <div class="flex-1"></div> -->
      <!-- <div class="w-5"></div> -->
      <!-- <div
        class="w-30 max-h-5 flex items-center justify-center bg-cyan-800 px-5 rounded"
      >
        <p class="text-center text-white">Working day</p>
      </div> -->
      <div class="w-5"></div>

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
      <div
        class="w-30 max-h-5 flex items-center justify-center bg-cyan-300 px-5 rounded"
      >
        <button class="w-full" @click="toggleModalCreateHotiday">
          <p class="text-center text-black text-sm">+ add holiday</p>
        </button>
      </div>
    </div>
    <div
      class="flex flex-column w-full mx-10 my-3"
      v-for="(holiday, i) in dataHolidays"
      :key="holiday.id"
    >
      <UpdateLeaveModal
        :dataLeave="holiday"
        :fetchHolidayList="fetchHolidayList"
      >
        <div class="flex flex-nowrap justify-center items-center">
          <div
            class="w-full flex flex-row space-x-0.5 justify-center items-center h-auto my-0.5 px-2 bg-red-500 rounded"
          >
            <p
              class="text-sm text-start flex-1 py-0.5 w-full rounded text-white px-2"
            >
              {{
                holiday.nom +
                "  " +
                dayjs(holiday.dateStart).format("DD-MMMM-YYYY") +
                " - " +
                dayjs(holiday.dateEnd).format("DD-MMMM-YYYY")
              }}
            </p>
            <button
              v-if="!isBeforeToday(dayjs(holiday.dateStart))"
              class="bg-pink-100 flex flex-nowrap justify-center items-center max-h-3 min-w-3 rounded"
              @click.stop="() => deleteHoliday(parseInt(holiday.id))"
            >
              <p
                class="items-center flex justify-center text-cyan-800 font-bold text-sm"
              >
                &times;
              </p>
            </button>
          </div>
        </div>
      </UpdateLeaveModal>
    </div>
  </div>
  <div class="h-56"></div>
  <button
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center"
    @click="toggleModalCreateHotiday"
  >
    <transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <button @click.stop="" class="">
          <div class="bg-white p-8 rounded-lg shadow-lg">
            <div class="flex justify-end">
              <button
                @click="toggleModalCreateHotiday"
                class="text-gray-500 hover:text-gray-700 font-bold text-2xl"
              >
                &times;
              </button>
            </div>
            <div
              class="flex flex-col space-x-2 space-y-4 items-start w-[500px]"
            >
              <div class="flex flex-row space-x-2">
                <div class="flex flex-row space-x-1">
                  <label for="date">Start Date:</label>
                  <input type="date" v-model="inputStartDate" />
                </div>
                <div class="flex flex-row space-x-1">
                  <label for="date">End Date:</label>
                  <input type="date" v-model="inputEndDate" />
                </div>
              </div>

              <p>Name</p>
              <select
                class="form-select py-1 rounded w-full"
                id="block"
                v-model="inputName"
                placeholder="name"
              >
                <option v-for="(e, i) in userList" :key="i" :value="e?.id">
                  {{ e?.nom }}
                </option>
              </select>
              <p>Type</p>
              <select
                class="form-select py-1 rounded w-full"
                id="block2"
                v-model="typeOfHoliday"
              >
                <option :value="'Holiday'">Holiday</option>
              </select>
              <!-- <input
                type="name"
                class="form-input px-4 py-1 rounded"
                v-model="inputValue"
                placeholder="Name ..."
              /> -->
              <div class="flex flex-row space-x-5">
                <button
                  @click="toggleModalCreateHotiday"
                  class="text-black px-2 bg-pink-300 hover:bg-pink-500 rounded text-md"
                >
                  <p>Cancel</p>
                </button>
                <button
                  @click="createHoliday"
                  class="text-black px-2 bg-cyan-300 hover:bg-cyan-500 rounded text-md"
                >
                  <p>Save</p>
                </button>
              </div>
            </div>
          </div>
        </button>
      </div>
    </transition>
  </button>
</template>

<style scoped></style>
