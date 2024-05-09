<script setup lang="ts">
import type { DataShift } from "@/utils/constants/shift-interface";
import { TimeInDay } from "@/utils/constants/time-in-day";
import { ref } from "vue";
import dayjs from "dayjs";
import isBeforeToday from "@/utils/functions/is-before-today";
import UserService from "~/services/user.service";
import { useLeaveStore } from "@/stores/leave";

import ValidationDefaultNoonShouldShow from "~/utils/functions/validation-noon-should-show";
const userDash: any = useCookie("user").value;
const leaveStore = useLeaveStore();

const props = defineProps([
  "shift",
  "updateShift",
  "reload",
  "typeTab",
  "block",
  "userList",
  "actualShift",
]);
const userList = await UserService.getAll();
let isOpen = ref(false);
let inputName = ref(props.shift?.nom);
let inputPerson = ref<number>(props.shift?.idPerson);
let inputDate = ref(dayjs(props.shift?.date).format("YYYY-MM-DD"));
let inputShift = ref<TimeInDay>(props.shift.shift);
let inputBlock = ref<number>(props.shift.idType);
let message = ref<string | null>(displayMessage(props.shift.message));

function toggleModal() {
  if (isBeforeToday(dayjs(props.shift?.date))) return;
  isOpen.value = !isOpen.value;
}

function updateShift() {
  const updatedShift: DataShift = {
    id: props.shift?.id,
    nom: inputName.value,
    date: dayjs(new Date(inputDate.value)).format("YYYY-MM-DD"),
    shift: inputShift.value,
    idType: inputBlock.value,
    idPerson: inputPerson.value,
    message: message.value,
  };
  if (isBeforeToday(dayjs(new Date(inputDate.value)))) {
    isOpen.value = !isOpen.value;
    return;
  }
  props.updateShift(updatedShift);
  isOpen.value = !isOpen.value;
}

function getType() {
  let found = "";
  for (const e of props?.typeTab) {
    if (inputBlock.value === e.id) {
      found = e?.nom_place;
    }
  }

  return ValidationDefaultNoonShouldShow(found);
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
const toogleValidatePlanning = (id: number, validate: boolean) => {
  console.log(validate);
  leaveStore.toogleValidationPlanning(id, validate);
  const updatedShift: DataShift = {
    id: props.shift?.id,
    nom: inputName.value,
    date: dayjs(new Date(inputDate.value)).format("YYYY-MM-DD"),
    shift: inputShift.value,
    idType: inputBlock.value,
    idPerson: inputPerson.value,
    message: message.value,
    is_valid: validate ? 1 : 0,
  };
  props.updateShift(updatedShift);
  isOpen.value = !isOpen.value;
  props.reload();
};
</script>
<template>
  <button class="w-full" @click.stop="toggleModal">
    <slot></slot>
  </button>
  <button
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center"
    @click.stop="toggleModal"
  >
    <transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 flex items-center justify-center bg-opacity-50"
        style="backdrop-filter: blur(2px)"
      >
        <button @click.stop="" class="">
          <div class="bg-white p-8 rounded-lg shadow-lg w-[500px]">
            <div class="flex justify-end">
              <button
                @click.stop="toggleModal"
                class="text-gray-500 hover:text-gray-700 font-bold text-2xl"
              >
                &times;
              </button>
            </div>
            <div class="flex flex-col space-x-2 space-y-4 items-start">
              <label for="name">Name :</label>
              <select
                class="form-select py-1 rounded w-full"
                id="name"
                v-model="inputPerson"
              >
                <option v-for="(e, i) in userList" :key="i" :value="e?.id">
                  {{ e?.nom }}
                </option>
              </select>
              <!-- <input type="name" class="form-input px-4 py-1 rounded" v-model="inputName" /> -->
              <label for="date">Select Date :</label>
              <input type="date" v-model="inputDate" />
              <label for="shift">Select Shift :</label>
              <select
                class="form-select py-1 rounded"
                id="shift"
                v-model="inputShift"
              >
                <option :value="TimeInDay.Morning">
                  {{ TimeInDay.Morning }}
                </option>
                <option :value="TimeInDay.Afternoon">
                  {{ TimeInDay.Afternoon }}
                </option>
                <option
                  v-if="props.actualShift === TimeInDay.Noon || getType()"
                  :value="TimeInDay.Noon"
                >
                  {{ TimeInDay.Noon }}
                </option>
              </select>
              <label for="block">Select Shiftx :</label>
              <select
                class="form-select py-1 rounded"
                id="block"
                v-model="inputBlock"
              >
                <option
                  v-for="(e, i) in props?.typeTab"
                  :key="i"
                  :value="e?.id"
                >
                  {{ e?.nom_place }}
                </option>
              </select>
              <p>Message :</p>
              <textarea v-model="message" class="w-full" />
              <div class="flex flex-row space-x-5">
                <button
                  v-if="!props.shift.is_valid"
                  @click.stop="toggleModal"
                  class="text-white px-2 bg-red-500 hover:bg-red-600 rounded text-md"
                >
                  <p>Cancel</p>
                </button>
                <button
                  v-if="!props.shift.is_valid"
                  @click.stop="updateShift"
                  class="text-white px-2 bg-cyan-600 hover:bg-cyan-800 rounded text-md"
                >
                  <p>Update</p>
                </button>
                <button
                  v-if="userDash?.role == 'admin'"
                  @click="
                    toogleValidatePlanning(
                      props.shift.id,
                      !props.shift.is_valid
                    )
                  "
                  class="text-white px-2 hover:bg-cyan-800 rounded text-md"
                  :class="props.shift.is_valid ? 'bg-red-600' : 'bg-blue-600'"
                >
                  {{ props.shift.is_valid ? "Dévalidé" : "Validé" }}
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
