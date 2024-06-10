<script setup lang="ts">
import { ref } from "vue";
import dayjs from "dayjs";
import UserService from "~/services/user.service";
import type { LeaveData } from "~/utils/constants/leave-interface";
import LeaveService from "~/services/leave.service";

const props = defineProps(["dataLeave", "fetchHolidayList"]);

const utilisateurStore = useUtilisateurStore();
onMounted(async () => {
  await utilisateurStore.getAllRadiologues();
});
const { userList } = storeToRefs(utilisateurStore);
let isOpen = ref(false);
let inputName = ref<number>(props.dataLeave.idPerson);
let inputTypeOfHoliday = ref<string>("Holiday");

let inputStartDate = ref(dayjs(props.dataLeave.dateStart).format("YYYY-MM-DD"));
let inputEndDate = ref(dayjs(props.dataLeave.dateEnd).format("YYYY-MM-DD"));

async function updateHoliday() {
  if (form.value.periode == "journe") {
    form.value.inputEndDate = form.value.inputStartDate;
  }
  const newUpdatedLeave: LeaveData = {
    id: props.dataLeave.id,
    idPerson: inputName.value,
    dateStart: dayjs(new Date(inputStartDate.value)).format("YYYY-MM-DD"),
    dateEnd: dayjs(new Date(inputEndDate.value)).format("YYYY-MM-DD"),
    typeOfLeave: inputTypeOfHoliday.value,
  };

  await LeaveService.update(newUpdatedLeave);
  props.fetchHolidayList();

  isOpen.value = !isOpen.value;
}

function toggleModal() {
  isOpen.value = !isOpen.value;
}
</script>
<template>
  <button class="w-[75%]" @click="toggleModal">
    <slot></slot>
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
              <div class="w-full flex flex-col gap-4">
                <div class="flex flex-row">
                  <label for="date">Date de début:</label>
                  <input
                    type="date"
                    v-model="inputStartDate"
                    class="bordered-1 w-full"
                  />
                </div>
                <div class="flex flex-row">
                  <label for="date">Date du fin:</label>
                  <input
                    type="date"
                    v-model="inputEndDate"
                    class="bordered-1 w-full"
                  />
                </div>
              </div>

              <p>Name</p>
              <select
                class="form-select rounded bordered-1 w-full"
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
                class="form-select py-1 rounded bordered-1 w-full"
                id="block2"
                v-model="inputTypeOfHoliday"
              >
                <option :value="'Holiday'">Vacances</option>
              </select>
              <!-- <input
                type="name"
                class="form-input px-4 py-1 rounded"
                v-model="inputValue"
                placeholder="Name ..."
              /> -->
              <div class="flex flex-row space-x-5">
                <button
                  @click="toggleModal"
                  class="text-white px-2 bg-red-500 hover:bg-red-600 rounded text-md"
                >
                  <p>Annuler</p>
                </button>
                <button
                  @click="updateHoliday"
                  class="text-white px-2 bg-cyan-600 hover:bg-cyan-800 rounded text-md"
                >
                  <p>Modifier</p>
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
