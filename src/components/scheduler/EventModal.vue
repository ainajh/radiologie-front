<script setup lang="ts">
import isBeforeToday from "@/utils/functions/is-before-today";
import { ref } from "vue";
import type { DataShift } from "@/utils/constants/shift-interface";
import dayjs from "dayjs";
import UserService from "~/services/user.service";
import Message from "~/pages/medecin/message.vue";

const props = defineProps([
  "date",
  "saveShift",
  "block",
  "userList",
  "actualShift",
]);

const userList = await UserService.getAll();
let isOpen = ref(false);
let inputValue = ref<number>();
let inputSelectTypeSchedule = ref<number>(0);

let inputStartDate = ref(dayjs().format("YYYY-MM-DD"));
let inputEndDate = ref(dayjs().format("YYYY-MM-DD"));

let message = ref();

function toggleModal() {
  if (isBeforeToday(props.date)) return;
  isOpen.value = !isOpen.value;
}

async function saveData() {
  if (inputValue.value) {
    const newSchedule: DataShift = {
      date: dayjs(new Date(props.date)).format("YYYY-MM-DD"),
      shift: props.actualShift,
      idPerson: inputValue.value,
      idType: props.block.id,
      typeOfSchedule: inputSelectTypeSchedule.value,
      dateStart: inputStartDate.value,
      dateEnd: inputEndDate.value,
      message: message.value,
    };
    await props.saveShift(newSchedule);
  }

  isOpen.value = !isOpen.value;
  inputValue.value = 0;
}
</script>
<template>
  <button class="w-full" @click="toggleModal">
    <slot></slot>
  </button>
  <button
    v-if="isOpen"
    class="fixed inset-0 flex items-center justify-center"
    @click="toggleModal"
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
                @click="toggleModal"
                class="text-gray-500 hover:text-gray-700 font-bold text-2xl"
              >
                &times;
              </button>
            </div>
            <div
              class="flex flex-col space-x-2 space-y-4 items-start w-[500px]"
            >
              <p class="" v-if="inputSelectTypeSchedule === 0">
                {{ props.date.format("DD-MM-YYYY") }}
              </p>
              <div
                class="flex flex-row space-x-2"
                v-if="inputSelectTypeSchedule === 1"
              >
                <div class="flex flex-row space-x-1">
                  <label for="date">Start Date:</label>
                  <input type="date" v-model="inputStartDate" />
                </div>
                <div class="flex flex-row space-x-1">
                  <label for="date">End Date:</label>
                  <input type="date" v-model="inputEndDate" />
                </div>
              </div>

              <p>Name :</p>
              <select
                class="form-select py-1 rounded w-full"
                id="block"
                v-model="inputValue"
                placeholder="name"
              >
                <option v-for="(e, i) in userList" :key="i" :value="e?.id">
                  {{ e?.nom }}
                </option>
              </select>
              <p>Type :</p>
              <select
                class="form-select py-1 rounded w-full"
                id="block2"
                v-model="inputSelectTypeSchedule"
              >
                <option :value="0">Working day</option>
                <!-- <option :value="1">Holiday</option> -->
              </select>
              <p>Message :</p>
              <textarea type="t" v-model="message" class="w-full" />

              <div class="flex flex-row items-start space-x-5">
                <button
                  @click="toggleModal"
                  class="text-white px-2 bg-red-500 hover:bg-red-600 rounded text-md"
                >
                  <p>Cancel</p>
                </button>
                <button
                  @click="saveData"
                  class="text-white px-2 bg-cyan-600 hover:bg-cyan-800 rounded text-md"
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
