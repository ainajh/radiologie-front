<script setup lang="ts">
import dayjs from "dayjs";
import UpdateEventModal from "./UpdateEventModal.vue";
import isBeforeToday from "@/utils/functions/is-before-today";
import generateColorFromString from "@/utils/functions/generate-color-from-string";
import type { DataShift } from "~/utils/constants/shift-interface";
const userDash: any = useCookie("user").value;
const props = defineProps([
  "shift",
  "updateShift",
  "deleteShift",
  "typeTab",
  "reload",
  "block",
  "userList",
  "actualShift",
]);

let isHovering = ref(false);

function onDeleteBadget() {
  props.deleteShift(props.shift?.id);
}

function onDragStart(event: any, shift: DataShift) {
  if (isBeforeToday(dayjs(props.shift?.date))) return;

  event.dataTransfer.dropEffect = "move";
  event.dataTransfer.effectAllowed = "move";
  event.dataTransfer.setData("shift", JSON.stringify(shift));
}

function generateColor(str: string, isRed: boolean) {
  if (isRed) return "#dc2626";
  return generateColorFromString(str);
}

function showMessage() {
  isHovering.value = true;
}

function hideMessage() {
  isHovering.value = false;
}
function displayMessage(mess: string) {
  switch (mess) {
    case null: {
      return "";
    }
    case undefined: {
      return "";
    }
    default: {
      return mess;
    }
  }
}
</script>

<template>
  <div
    class="h-auto w-full relative"
    v-if="props.shift.is_valid || userDash?.role == 'admin'"
    :draggable="
      !props.shift.is_valid && !isBeforeToday(dayjs(props.shift?.date))
    "
    @dragstart="onDragStart($event, props.shift)"
  >
    <UpdateEventModal
      :shift="props.shift"
      :updateShift="props.updateShift"
      :reload="props.reload"
      :typeTab="props.typeTab"
      :block="props.block"
      :userList="props.userList"
      :actualShift="props.actualShift"
    >
      <div
        @mouseover="showMessage"
        @mouseout="hideMessage"
        class="flex flex-nowrap justify-center items-center"
      >
        <button
          class="w-full flex flex-row space-x-0.5 justify-center items-center h-auto my-0.5 px-2 rounded"
          :class="{
            'bg-red-600': props.shift.typeOfSchedule === 1,
            'bg-cyan-800': props.shift.typeOfSchedule === 0,
          }"
          :style="{
            backgroundColor: generateColor(
              props.shift.nom,
              props.shift.typeOfSchedule === 1
            ),
          }"
        >
          <p
            class="text-xs text-start flex-1 py-0.5  w-full rounded text-white relative"
          >
            {{ props.shift.nom }}
            <span
              v-if="!props.shift.is_valid && userDash?.role == 'admin'"
              class="absolute top-1 h-[12px] w-[12px] bg-red-500 rounded"
              :class="props.shift.message ? 'right-5' : 'right-1'"
            ></span>
            <span
              v-if="props.shift.message"
              class="absolute right-1 top-1 h-[12px] w-[12px] rounded"
            >
              <i class="fa-solid fa-comment"></i>
            </span>
          </p>
          <button
            v-if="!isBeforeToday(dayjs(props.shift?.date)) && userDash?.role == 'admin'"
            class="bg-pink-100 flex flex-nowrap justify-center items-center max-h-3 min-w-3 rounded"
            @click.stop="onDeleteBadget"
          >
            <p
              class="items-center flex justify-center text-cyan-800 font-bold text-sm"
            >
              &times;
            </p>
          </button>
        </button>
        <div
          v-if="isHovering && props.shift.message"
          class="absolute z-index-50 bg-black p-1 top-6 opacity-90 rounded text-white"
          style="z-index: 2;"
        >
          {{ displayMessage(props.shift?.message) }}
        </div>
      </div>
    </UpdateEventModal>
  </div>
</template>

<style scoped></style>
