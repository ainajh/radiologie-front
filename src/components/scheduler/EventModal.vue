<script setup lang="ts">
import isBeforeToday from "@/utils/functions/is-before-today";
import { ref } from "vue";
import type { DataShift } from "@/utils/constants/shift-interface";
import dayjs from "dayjs";
import UserService from "~/services/user.service";
import Message from "~/pages/medecin/message.vue";
const userDash: any = useCookie("user").value;
const props = defineProps([
  "date",
  "saveShift",
  "block",
  "userList",
  "actualShift",
  "weekValidate",
]);

const utilisateurStore = useUtilisateurStore();
 
const { userList } = storeToRefs(utilisateurStore);
let isOpen = ref(false);
let inputValue = ref<number>();
let inputSelectTypeSchedule = ref<number>(0);

let inputStartDate = ref(dayjs().format("YYYY-MM-DD"));
let inputEndDate = ref(dayjs().format("YYYY-MM-DD"));

let message = ref();

function toggleModal() {
  if (props.weekValidate) return;
  if (isBeforeToday(props.date)) return;
  if (userDash?.role == "admin") isOpen.value = !isOpen.value;
}

async function saveData() {
  if (inputValue.value) {
    const newSchedule: DataShift = {
      date: dayjs(new Date(props.date)).format("YYYY-MM-DD"),
      shift: props.actualShift,
      idPerson: inputValue.value,
      idType: props.block.id,
      typeOfSchedule: 0,
      dateStart: inputStartDate.value,
      dateEnd: inputEndDate.value,
      message: message.value,
    };
    await props.saveShift(newSchedule);
  }

  isOpen.value = !isOpen.value;
  inputValue.value = null;
}
</script>
<template>
  <button class="w-full" @click="toggleModal">
    <slot></slot>
    <i class="fa fa-solid fa-plus opacity-0"></i>
  </button>
  <button
    v-if="isOpen"
    class="fixed z-50 inset-0 flex items-center justify-center"
    @click="toggleModal"
  >
    <transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed z-50 inset-0 flex items-center justify-center bg-opacity-50"
        style="backdrop-filter: blur(2px)"
      >
        <button @click.stop="" class="">
          <div
            class="bg-white border-2 md:w-[400px] w-[80vw] px-5 min-h-[200px] py-4 shadow-xl"
          >
            <div class="flex flex-col space-x-2 space-y-4 items-start">
              <div
                v-if="inputSelectTypeSchedule === 0"
                class="text-center w-full"
              >
                Le
                <span class="font-bold">{{
                  props.date.format("DD MMMM YYYY")
                }}</span>
                dans
                <span class="font-bold" :style="{ color: `#${block.bg}` }">{{
                  block.nom_place
                }}</span>
              </div>
              <div class="grid grid-cols-1 w-full">
                <q-select
                  v-model="inputValue"
                  dense
                  outlined
                  :options="userList"
                  label="Nom du radiologue"
                  option-label="nom"
                  class="mb-4"
                  option-value="id"
                  emit-value
                  map-options
                  behavior="dialog"
                />
              </div>
              <div class="text-primary flex gap-2 justify-end w-full">
                <q-btn
                  outline
                  label="Annuler"
                  v-close-popup
                  color="red"
                  class="text-black"
                  @click="toggleModal"
                />
                <q-btn
                  label="Sauvegarder"
                  color="primary"
                  type="submit"
                  @click="saveData"
                  v-if="inputValue"
                />
              </div>
            </div>
            <!-- <div class="flex justify-end">
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
                {{ props.date.format("DD MMMM YYYY") }}
              </p>
              <div
                class="flex flex-row space-x-2"
                v-if="inputSelectTypeSchedule === 1"
              >
                <div class="flex flex-row space-x-1">
                  <label for="date">Date de debut:</label>
                  <input type="date" v-model="inputStartDate" />
                </div>
                <div class="flex flex-row space-x-1">
                  <label for="date">Date du fin:</label>
                  <input type="date" v-model="inputEndDate" />
                </div>
              </div>

              <p>Nom du personnel :</p>
              <select
                class="form-select py-1 rounded w-full bordered-1"
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
                class="form-select py-1 rounded w-full bordered-1"
                id="block2"
                v-model="inputSelectTypeSchedule"
              >
                <option :value="0">Jour de travail</option>
              </select>

              <div class="flex flex-row items-start space-x-5">
                <button
                  @click="toggleModal"
                  class="text-white px-2 bg-red-500 hover:bg-red-600 rounded text-md"
                >
                  <p>Fermer</p>
                </button>
                <button
                  @click="saveData"
                  class="text-white px-2 bg-cyan-600 hover:bg-cyan-800 rounded text-md"
                >
                  <p>Sauvegarder</p>
                </button>
              </div>
            </div> -->
          </div>
        </button>
      </div>
    </transition>
  </button>
</template>

<style scoped></style>
