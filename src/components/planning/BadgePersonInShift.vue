<script setup lang="ts">
import dayjs from "dayjs";
import UpdateEventModal from "../scheduler/UpdateEventModal.vue";
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
  "saveShift",
  "bg",
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
      :saveShift="props.saveShift"
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
        <div
          class="w-full flex flex-row space-x-0.5 justify-center items-center h-[35px] my-0.5 px-2 rounded"
          :class="{
            'bg-red-600': props.shift.typeOfSchedule === 1,
            'opacity-50': props.shift.is_valid && userDash?.role == 'admin',
          }"
         
          :style="{
            backgroundColor: generateColor(
              props.shift.nom,
              props.shift.typeOfSchedule === 1
            ),
          }"
        >
          <p
            class="text-xs text-start flex-1 py-0.5 w-full rounded text-white relative"
          >
            {{ props.shift.nom }} 
            <!-- <span
              v-if="!props.shift.is_valid && userDash?.role == 'admin'"
              class="absolute top-1 h-[12px] w-[12px] bg-red-500 rounded"
              :class="props.shift.message ? 'right-5' : 'right-1'"
            ></span> -->
            <span
              v-if="props.shift.message"
              class="absolute right-1 x h-[12px] w-[12px] rounded"
            >
              <span class="material-icons text-black text-[15px]"> question_answer </span>
            </span>
          </p>
          <button
            v-if="
              !isBeforeToday(dayjs(props.shift?.date)) &&
              userDash?.role == 'admin'
            "
            class="bg-white flex flex-nowrap justify-center items-center max-h-3 min-w-3 rounded"
            @click.stop="onDeleteBadget"
          >
            <p
              class="items-center flex justify-center text-cyan-800 font-bold text-sm"
            >
              &times;
            </p>
          </button>
        </div>
        <div
          v-if="isHovering && props.shift.message"
          class="absolute z-index-50 bg-black p-1 top-9 opacity-90 rounded text-white"
          style="z-index: 2"
        >
          {{ displayMessage(props.shift?.message) }}
        </div>
      </div>
    </UpdateEventModal>
  </div>
</template>

<style scoped></style>
<!-- <div
class="h-[30px] bg-green-500 w-full"
:style="{
  backgroundColor: generateColor(
    props.shift.nom,
    props.shift.typeOfSchedule === 1
  ),
}"
>
<div class="flex justify-between items-center p-1">
  <div class="text-[11px] text-white">{{ props.shift.nom }}</div>
  <div class="flex gap-3">
    <div>
      <span class="material-icons text-white"> question_answer </span>
    </div>
    <div><span class="material-icons text-white"> more_vert </span></div>
  </div>
</div>
</div> -->
