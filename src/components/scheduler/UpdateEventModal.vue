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
  "saveShift",
]);
const userList = await UserService.getAll();
let isOpen = ref(false);
let inputName = ref(props.shift?.nom);
let inputPerson = ref<number>(props.shift?.idPerson);
let inputDate = ref(dayjs(props.shift?.date).format("YYYY-MM-DD"));
let inputShift = ref<TimeInDay>(props.shift.shift);
let inputBlock = ref<number>(props.shift.idType);
let message = ref<string | null>(displayMessage(props.shift.message));
const isDuplicate = ref<boolean>(false);
const dateDuplicate = ref(dayjs(new Date()).format("YYYY-MM-DD"));
let inputStartDate = ref(dayjs().format("YYYY-MM-DD"));
let inputEndDate = ref(dayjs().format("YYYY-MM-DD"));
import { useToast } from "vue-toastification";
const toast = useToast();
const getShifts = () => {
  return props.actualShift === TimeInDay.Noon
    ? [TimeInDay.Morning, TimeInDay.Afternoon, TimeInDay.Noon]
    : [TimeInDay.Morning, TimeInDay.Afternoon];
};
const duplicateRadiologue = async () => {
  const updatedShift: DataShift = {
    id: props.shift?.id,
    nom: inputName.value,
    date: dayjs(new Date(dateDuplicate.value)).format("YYYY-MM-DD"),
    shift: inputShift.value,
    idType: inputBlock.value,
    idPerson: inputPerson.value,
    message: message.value,
    dateStart: inputStartDate.value,
    dateEnd: inputEndDate.value,
    typeOfSchedule: 1,
  };
  if (
    isBeforeToday(dayjs(new Date(dateDuplicate.value)))
    // ||
    // dayjs(new Date(dateDuplicate.value)).isSame(props.shift?.date, "day")
    // || dayjs(new Date(dateDuplicate.value)).isBefore(props.shift?.date, "day")
  ) {
    toast.error(
      "Impossible de dupliqué une planning en avant de la date d'aujourd'hui ou la date initial "
    );
    isOpen.value = !isOpen.value;
    return;
  }

  await props.saveShift(updatedShift);
  isOpen.value = !isOpen.value;
};
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
  <div class="w-full" @click.stop="toggleModal">
    <slot></slot>
  </div>
  <button
    v-if="isOpen"
    class="fixed z-50 inset-0 flex items-center justify-center"
    @click.stop="toggleModal"
  >
    <transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed z-50 inset-0 flex items-center justify-center bg-opacity-50"
        style="backdrop-filter: blur(2px)"
      >
        <div
          class="bg-white border-2 md:w-[400px] w-[80vw] px-5 py-4 shadow-xl"
        >
          <div
            class="flex flex-col space-x-2 space-y-4 items-start"
            @click.stop=""
          >
            <!-- <div
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
            </div> -->
            <div class="grid grid-cols-1 gap-4 w-full">
              <q-select
                v-if="!isDuplicate"
                v-model="inputPerson"
                outlined
                dense
                autofocus
                :options="userList"
                label="Nom du radiologue"
                option-label="nom"
                transition-show="flip-up"
                transition-hide="flip-down"
                option-value="id"
                emit-value
                map-options
                :disable="isDuplicate"
              />
              <q-input
                v-if="!isDuplicate"
                outlined
                dense
                autofocus
                label="Date"
                v-model="inputDate"
                type="date"
                :disable="isDuplicate"
              />
              <q-select
                v-if="!isDuplicate"
                v-model="inputShift"
                outlined
                dense
                autofocus
                :options="getShifts()"
                label="Selectionner la vacation"
                transition-show="flip-up"
                transition-hide="flip-down"
                :disable="isDuplicate"
              />
              <q-select
                v-model="inputBlock"
                outlined
                dense
                autofocus
                :options="props?.typeTab"
                label="Selectionner le lieu "
                option-label="nom_place"
                class="mb-4"
                transition-show="flip-up"
                transition-hide="flip-down"
                option-value="id"
                emit-value
                map-options
                :disable="isDuplicate"
                v-if="!isDuplicate"
              />
              <q-input
                v-if="!isDuplicate"
                v-model="message"
                outlined
                dense
                autogrow
                type="textarea"
                label="Message"
              />
            </div>
            <q-input
              v-if="isDuplicate"
              outlined
              dense
              autofocus
              label="Selectionner la date de duplication"
              v-model="dateDuplicate"
              type="date"
              class="w-full"
            />
            <div class="text-primary flex gap-2 justify-end w-full">
              <q-btn
                dense
                outline
                label="Annuler"
                v-close-popup
                color="red"
                class="text-black"
                v-if="!props.shift.is_valid"
                @click.stop="
                  isDuplicate ? (isDuplicate = false) : toggleModal()
                "
              />
              <q-btn
                label="Modifier"
                color="primary"
                dense
                type="submit"
                v-if="!props.shift.is_valid && !isDuplicate"
                @click.stop="updateShift"
              />
              <!-- <q-btn
                label="Dupliquer"
                color="blue"
                dense
                @click="
                  isDuplicate ? duplicateRadiologue() : (isDuplicate = true)
                "
              /> -->
              <q-btn
                v-if="userDash?.role == 'admin' && !isDuplicate"
                @click="
                  toogleValidatePlanning(props.shift.id, !props.shift.is_valid)
                "
                :label="props.shift.is_valid ? 'Dévalider' : 'Valider'"
                :color="props.shift.is_valid ? 'red' : 'indigo'"
                dense
                class="px-1"
              />
            </div>
          </div>
        </div>
        <!-- <button @click.stop="" class="">
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
              <div class="flex w-full gap-2" v-if="!isDuplicate">
                <label for="name">Name :</label>
                <select
                  class="form-select py-1 rounded w-full bordered-1"
                  id="name"
                  :disabled="isDuplicate"
                  v-model="inputPerson"
                >
                  <option v-for="(e, i) in userList" :key="i" :value="e?.id">
                    {{ e?.nom }}
                  </option>
                </select>
              </div>
              <div class="flex w-full gap-2" v-if="!isDuplicate">
                <label for="date">Selectionner la date :</label>
                <input
                  type="date"
                  v-model="inputDate"
                  class="bordered-1 w-full"
                  :disabled="isDuplicate"
                />
              </div>
              <div class="flex w-full gap-2" v-if="!isDuplicate">
                <label for="shift">Selectionner la vacation :</label>
                <select
                  class="form-select py-1 rounded bordered-1 w-full"
                  id="shift"
                  v-model="inputShift"
                  :disabled="isDuplicate"
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
              </div>

              <div class="flex w-full gap-2" v-if="!isDuplicate">
                <label for="block">Selectionner le lieu :</label>
                <select
                  class="form-select py-1 rounded bordered-1 w-full"
                  id="block"
                  v-model="inputBlock"
                  :disabled="isDuplicate"
                >
                  <option
                    v-for="(e, i) in props?.typeTab"
                    :key="i"
                    :value="e?.id"
                  >
                    {{ e?.nom_place }}
                  </option>
                </select>
              </div>

              <div class="w-full flex gap-2" v-if="!isDuplicate">
                <p>Message :</p>
                <textarea
                  v-model="message"
                  class="w-full bordered-1"
                  :disabled="isDuplicate"
                />
              </div>
              <div v-if="isDuplicate" class="w-full flex gap-2">
                <label for="dateDupl"
                  >Selectionner la date de duplication :</label
                >
                <input
                  id="dateDupl"
                  type="date"
                  v-model="dateDuplicate"
                  class="bordered-1 w-full h-[30px]"
                />
              </div>
              <div class="flex flex-row space-x-5">
                <button
                  v-if="!props.shift.is_valid"
                  @click.stop="
                    isDuplicate ? (isDuplicate = false) : toggleModal()
                  "
                  class="text-white px-2 bg-red-500 hover:bg-red-600 rounded text-md"
                >
                  <p>Annuler</p>
                </button>
                <button
                  v-if="!props.shift.is_valid && !isDuplicate"
                  @click.stop="updateShift"
                  class="text-white px-2 bg-cyan-600 hover:bg-cyan-800 rounded text-md"
                >
                  <p>Modifier</p>
                </button>
                <button
                  class="text-white px-2 bg-green-600 hover:bg-cyan-800 rounded text-md"
                  @click="
                    isDuplicate ? duplicateRadiologue() : (isDuplicate = true)
                  "
                >
                  <p>Dupliquer</p>
                </button>
                <button
                  v-if="userDash?.role == 'admin' && !isDuplicate"
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
        </button> -->
      </div>
    </transition>
  </button>
</template>

<style scoped></style>
