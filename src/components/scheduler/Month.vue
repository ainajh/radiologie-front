<script setup lang="ts">
import dayjs, { Dayjs } from "dayjs";
import { ref, onMounted } from "vue";
import Week from "./Week.vue";
import Morning from "./Morning.vue";
import UpdateLeaveModal from "./UpdateLeaveModal.vue";
import Afternoon from "./Afternoon.vue";
import Noon from "./Noon.vue";
import getMonth from "@/utils/functions/get-month";
import ScheduleService from "@/services/schedule.service";
import TypeService from "@/services/type.service";
import type { DataShift } from "@/utils/constants/shift-interface";
import { TimeInDay } from "@/utils/constants/time-in-day";
import UserService from "@/services/user.service";
import LeaveService from "@/services/leave.service";
import type { LeaveData } from "~/utils/constants/leave-interface";
import isBeforeToday from "~/utils/functions/is-before-today";
import ValidationDefaultNoonShouldShow from "~/utils/functions/validation-noon-should-show";
import { useToast } from "vue-toastification";
import generateColorFromString from "~/utils/functions/generate-color-from-string";
const toast = useToast();
const userDash: any = useCookie("user").value;
import html2pdf from "html2pdf.js";

const exportToPDF = () => {
  html2pdf(document.getElementById("pdfContent"), {
    margin: [0, 3, 0, 3],
    filename: "planning.pdf",
    image: { type: "jpeg", quality: 1 }, // Augmentez la qualité de l'image si nécessaire
    html2canvas: { scale: 5 },
    jsPDF: {
      format: "a4",
      orientation: "landscape",
    },
  });
};

let currentMonth = ref(getMonth());
let weekIndex = ref(0);
let monthIndex = ref(0);
let data = ref<any[]>();
let dataHolidays = ref<any[]>();
let copyShcedules = ref<any[]>();
const utilisateurStore = useUtilisateurStore();
onMounted(async () => {
  await utilisateurStore.getAllRadiologues();
});
const { userList } = storeToRefs(utilisateurStore);
const typeTab = await TypeService.getAllPlaces();
let isOpen = ref(false);
let isCopy = ref(false);
let inputName = ref("");
let typeOfHoliday = ref("Holiday");
let inputStartDate = ref(dayjs().format("YYYY-MM-DD"));
let inputEndDate = ref(dayjs().format("YYYY-MM-DD"));
let copiedId = ref<string>("");

onMounted(async () => {
  const weekList = currentMonth.value[weekIndex.value].map((item) =>
    formatDate(item)
  );
  data.value = await ScheduleService.getAll(weekList);
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
      (e) => e.format("DD MMMM YYYY") === dayjs().format("DD MMMM YYYY")
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
  try {
    if (dataShift === undefined) return;
    await ScheduleService.create(dataShift);
    refreshMe();
  } catch (err) {
    console.log(err);
  }
}

async function updateShift(updatedShift: DataShift) {
  try {
    if (updatedShift === undefined) return;
    await ScheduleService.update(updatedShift);
    refreshMe();
  } catch (err) {
    console.log(err);
  }
}

async function deleteShift(id: number) {
  try {
    if (id === undefined) return;
    await ScheduleService.deleteOne(id);
    refreshMe();
  } catch (err) {
    console.log(err);
  }
}

async function copyShcedule() {
  copyShcedules.value = [
    currentMonth.value[weekIndex.value][0].format("YYYY-MM-DD"),
    currentMonth.value[weekIndex.value][6].format("YYYY-MM-DD"),
  ];

  isCopy.value = true;

  toast.success("Copied ! ");
}

async function pasteShcedule() {
  const pasteShcedules = [
    currentMonth.value[weekIndex.value][0].format("YYYY-MM-DD"),
    currentMonth.value[weekIndex.value][6].format("YYYY-MM-DD"),
  ];
  const dataResponseFromCopy = await ScheduleService.copyPaste(
    copyShcedules.value,
    pasteShcedules
  );
  copiedId.value = dataResponseFromCopy?.copiedId ?? "";
  isCopy.value = false;
  copyShcedules.value = [];
  const weekList = currentMonth.value[weekIndex.value].map((item) =>
    formatDate(item)
  );
  data.value = await ScheduleService.getAll(weekList);
}

async function cancelCopyShcedule() {
  await ScheduleService.undoCopyPaste(copiedId.value);

  copiedId.value = "";
  const weekList = currentMonth.value[weekIndex.value].map((item) =>
    formatDate(item)
  );
  data.value = await ScheduleService.getAll(weekList);
}

function toggleModalCreateHotiday() {
  isOpen.value = !isOpen.value;
}

async function createHoliday() {
  try {
    const dataHodiday: LeaveData = {
      idPerson: parseInt(
        userDash?.role == "admin" ? inputName.value : userDash?.id
      ),
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

import { useCommentScheduleStore } from "@/stores/commentSchedule";
import { useLeaveStore } from "@/stores/leave";
const commentStore = useCommentScheduleStore();
const leaveStore = useLeaveStore();

const allScheduleThisWeek = ref([]);
const isContainValidate = ref(false);
function formatDate(dateString: string) {
  const date = new Date(dateString);
  const year = date.getFullYear();
  let month = (date.getMonth() + 1).toString().padStart(2, "0");
  let day = date.getDate().toString().padStart(2, "0");

  return `${year}-${month}-${day}`;
}
const allCommentInThisWeek = async (ancred = false) => {
  const weekList = currentMonth.value[weekIndex.value].map((item) =>
    formatDate(item)
  );
  await commentStore.getAllCommentInThisWeek(weekList);
  if (ancred) return;
  setTimeout(() => {
    const scrollTargetElement = document.getElementById("scroll-target");
    if (scrollTargetElement) {
      // Faire défiler la liste de commentaires jusqu'à l'élément cible
      scrollTargetElement.scrollIntoView({ behavior: "smooth" });
    } else {
      console.error('Element with id "scroll-target" not found in the DOM.');
    }
  }, 500);
};
const getAllSheduleThisWeek = async () => {
  const weekList = currentMonth.value[weekIndex.value].map((item) =>
    formatDate(item)
  );
  await commentStore.getAllSheduleThisWeek(weekList);
  allScheduleThisWeek.value = commentStore.allScheduleThisWeek;
  isContainValidate.value = commentStore.allScheduleThisWeek?.some(
    (item) => item.is_valid === 1
  );
};
const toggleAllPlanning = async () => {
  let modification = [];
  const weekStartEnd = currentMonth.value[weekIndex.value]
    ?.filter((v, idx) => idx == 0 || idx == 6)
    .map((item) => formatDate(item));

  await getAllSheduleThisWeek();
  const allSched = await commentStore.allScheduleThisWeek?.map(
    (item) => item.id
  );
  const isValidExists = await commentStore.allScheduleThisWeek?.some(
    (item) => item.is_valid === 1
  );

  for (let sh of allSched) {
    modification.push(sh);
    await leaveStore.toogleValidationPlanning(sh, !isValidExists);
  }

  const arrToString = (array: any) =>
    "[" + array.map((item: any) => `'${item}'`).join(", ") + "]";
  await leaveStore.revalidateWeek({
    semaine: arrToString(weekStartEnd),
    modification: arrToString(modification),
    valide: !isValidExists,
  });

  refreshMe();
};

const refreshMe = async () => {
  getAllSheduleThisWeek();
  const weekList = currentMonth.value[weekIndex.value].map((item) =>
    formatDate(item)
  );
  data.value = await ScheduleService.getAll(weekList);
};

watch(
  weekIndex,
  (newValue, oldValue) => {
    allCommentInThisWeek(true);
    getAllSheduleThisWeek();
    refreshMe();
  },
  { immediate: true }
);
watch(
  currentMonth,
  (newValue, oldValue) => {
    allCommentInThisWeek(true);
    getAllSheduleThisWeek();
    refreshMe();
  },
  { immediate: true }
);
</script>

<template>
  <div class="flex flex-row flex-nowrap h-5">
    <div class="flex">
      <div class="month flex">
        <p class="mx-5 text-lg">MOIS</p>
        <button
          @click="
          (e: MouseEvent) => {
            previousMonth()
            return e
          }
        "
          class="flex justify-center items-center h-auto min-w-5 rounded bg-cyan-600 text-white"
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
          class="flex justify-center items-center h-auto min-w-5 rounded bg-cyan-600 text-white"
        >
          >
        </button>
      </div>
      <p class="mx-5">||</p>
      <div class="semaine flex">
        <p class="mx-5 text-lg">Semaine : {{ weekIndex }}</p>
        <button
          @click="increment"
          class="flex justify-center items-center h-auto min-w-5 rounded bg-cyan-600 text-white"
        >
          &lt;
        </button>
        <div class="mx-2">|</div>
        <button
          @click="decrement"
          class="flex justify-center items-center h-auto min-w-5 rounded bg-cyan-600 text-white"
        >
          >
        </button>
      </div>
      <button
        @click="thisMonth"
        class="mx-5 flex justify-center items-center h-auto px-2 rounded bg-cyan-600 text-white"
      >
        Aujourd'hui
      </button>

      <p class="mx-5 w-48 text-lg">{{ actualDate() }}</p>
    </div>

    <div class="w-5"></div>
    <button
      v-if="userDash.role == 'admin'"
      @click="copyShcedule"
      class="flex justify-center items-center h-auto min-w-5 rounded bg-cyan-600 text-white px-2"
    >
      Copier
    </button>
    <div v-if="isCopy" class="w-5"></div>
    <button
      v-if="isCopy && userDash.role == 'admin'"
      @click="pasteShcedule"
      class="flex justify-center items-center h-auto min-w-5 rounded bg-cyan-600 text-white px-2"
    >
      Coller
    </button>
    <div v-if="copiedId != null && copiedId != ''" class="w-5"></div>
    <button
      v-if="copiedId != null && copiedId != ''"
      @click="cancelCopyShcedule"
      class="flex justify-center items-center h-auto min-w-5 rounded bg-cyan-600 text-white px-2"
    >
      annuler
    </button>

    <div class="flex-1"></div>
    <!-- <div
      class="w-30 max-h-5 flex items-center justify-center bg-cyan-800 px-5 rounded"
    >
      <p class="text-center text-white">en travaille</p>
    </div>
    <div class="w-5"></div>
    <div
      class="w-30 max-h-5 flex items-center justify-center bg-red-600 px-5 rounded"
    >
      <p class="text-center text-white">en congé / duplication</p>
    </div> -->
    <div
      class="w-30 max-h-5 flex items-center justify-center bg-green-600 mx-2 px-5 rounded text-white"
      @click="exportToPDF"
    >
      Imprimer
    </div>
    <button
      class="flex justify-center items-center h-auto rounded text-white px-2 mx-2"
      :class="`bg-${isContainValidate ? 'red-500' : 'primary'}`"
      @click="toggleAllPlanning"
      v-if="userDash?.role == 'admin'"
    >
      {{ isContainValidate ? "Dévalider" : "Valider" }} tous
    </button>
    <div class="w-5"></div>
    <div
      class="w-30 max-h-5 flex items-center justify-center bg-cyan-600 px-5 rounded"
      v-if="userDash?.role != 'secretaire'"
    >
      <button class="w-full" @click="toggleModalCreateHotiday">
        <p class="text-center text-white">+ ajouter conger</p>
      </button>
    </div>
  </div>
  <div class="bg-white text-black" id="pdfContent">
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
        <p class="text-center w-full overflow-elipsis">
          {{ e.nom_place }}
        </p>
      </div>
      <div class="w-full flex flex-col">
        <div class="flex flex-row flex-nowrap">
          <div
            class="w-full flex flex-nowrap items-center justify-center bg-blue-100"
          >
            <p class="text-center text-sm">{{ TimeInDay.Morning }}</p>
          </div>
          <Morning
            :week="currentMonth[weekIndex]"
            :saveShift="saveShift"
            :updateShift="updateShift"
            :reload="refreshMe"
            :shifts="data"
            :block="e"
            :deleteShift="deleteShift"
            :monthIndex="monthIndex"
            :typeTab="typeTab"
            :userList="userList"
          />
        </div>
        <div class="flex flex-row flex-nowrap" v-if="e?.has_noon">
          <div
            class="w-full flex flex-nowrap items-center justify-center bg-cyan-100"
          >
            <p class="text-center text-sm">{{ TimeInDay.Noon }}</p>
          </div>
          <Noon
            :week="currentMonth[weekIndex]"
            :saveShift="saveShift"
            :updateShift="updateShift"
            :reload="refreshMe"
            :shifts="data"
            :block="e"
            :deleteShift="deleteShift"
            :monthIndex="monthIndex"
            :typeTab="typeTab"
            :userList="userList"
          />
        </div>
        <div class="flex flex-row flex-nowrap">
          <div
            class="w-full flex flex-nowrap items-center justify-center bg-yellow-100"
          >
            <p class="text-center text-sm">
              {{ TimeInDay.Afternoon }}
            </p>
          </div>
          <Afternoon
            :week="currentMonth[weekIndex]"
            :saveShift="saveShift"
            :updateShift="updateShift"
            :reload="refreshMe"
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
  <div class="flex gap-5">
    <div>
      <div class="my-5">
        <div class="flex flex-row items-center">
          <p class="text-xl">Liste des congés :</p>
          <!-- <div class="flex-1"></div> -->
          <!-- <div class="w-5"></div> -->
          <!-- <div
            class="w-30 max-h-5 flex items-center justify-center bg-cyan-800 px-5 rounded"
          >
            <p class="text-center text-white">Working day</p>
          </div> -->
          <div class="flex">
            <div class="month flex">
              <p class="mx-5 text-lg">MOIS</p>
              <button
                @click="
                (e: MouseEvent) => {
                  previousMonth()
                  return e
                }
              "
                class="flex justify-center items-center h-auto min-w-5 rounded bg-cyan-600 text-white"
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
                class="flex justify-center items-center h-auto min-w-5 rounded bg-cyan-600 text-white"
              >
                >
              </button>
            </div>
            <p class="mx-5">||</p>
            <div class="semaine flex">
              <p class="mx-5 text-lg">Semaine : {{ weekIndex }}</p>
              <button
                @click="increment"
                class="flex justify-center items-center h-auto min-w-5 rounded bg-cyan-600 text-white"
              >
                &lt;
              </button>
              <div class="mx-2">|</div>
              <button
                @click="decrement"
                class="flex justify-center items-center h-auto min-w-5 rounded bg-cyan-600 text-white"
              >
                >
              </button>
            </div>
            <button
              @click="thisMonth"
              class="mx-5 flex justify-center items-center h-auto px-2 rounded bg-cyan-600 text-white"
            >
              Aujourd'hui
            </button>

            <p class="mx-5 w-48 text-lg">{{ actualDate() }}</p>
          </div>
          <div
            class="w-30 max-h-5 flex items-center justify-center bg-cyan-600 px-5 rounded"
            v-if="userDash.role != 'secretaire'"
          >
            <button class="w-full" @click="toggleModalCreateHotiday">
              <p class="text-center text-white text-sm">+ Ajouter congé</p>
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
                :style="{
                  backgroundColor: generateColorFromString(holiday.nom),
                }"
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
                  v-if="
                    (!isBeforeToday(dayjs(holiday.dateStart)) &&
                      userDash.role == 'admin') ||
                    userDash.id == holiday.idPerson
                  "
                  class="bg-pink-100 flex flex-nowrap justify-center items-center max-h-3 min-w-3 rounded"
                  @click.stop="() => deleteHoliday(parseInt(holiday.id))"
                >
                  <p
                    class=" items-center flex justify-center text-cyan-800 font-bold text-sm del-x"
                  >
                    &times;
                  </p>
                </button>
              </div>
            </div>
          </UpdateLeaveModal>
        </div>
      </div>
      <button
        v-if="isOpen"
        class="fixed inset-0 flex items-center justify-center"
        @click="toggleModalCreateHotiday"
      >
        <transition name="modal-fade">
          <div
            v-if="isOpen"
            class="fixed inset-0 flex items-center justify-center bg-opacity-50"
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
                  <div class="flex flex-col gap-4 ml-2">
                    <div class="flex flex-row space-x-4">
                      <label for="date">Date de début:</label>
                      <input
                        type="date"
                        v-model="inputStartDate"
                        class="bordered-1"
                      />
                    </div>
                    <div class="flex flex-row space-x-4">
                      <label for="date">Date du fin:</label>
                      <input
                        type="date"
                        v-model="inputEndDate"
                        class="bordered-1"
                      />
                    </div>
                  </div>

                  <div
                    v-if="userDash?.role == 'admin'"
                    class="w-full flex gap-2"
                  >
                    <label>Radiologue</label>
                    <select
                      class="form-select py-1 rounded w-full bordered-1"
                      id="block"
                      v-model="inputName"
                      placeholder="name"
                    >
                      <option
                        v-for="(e, i) in userList"
                        :key="i"
                        :value="e?.id"
                      >
                        {{ e?.nom }}
                      </option>
                    </select>
                  </div>

                  <p>Type du congé</p>
                  <select
                    class="form-select py-1 rounded w-full bordered-1"
                    id="block2"
                    v-model="typeOfHoliday"
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
                      @click="toggleModalCreateHotiday"
                      class="text-black px-2 bg-pink-300 hover:bg-pink-500 rounded text-md"
                    >
                      <p>Annuler</p>
                    </button>
                    <button
                      v-if="userDash?.role != 'secretaire'"
                      @click="createHoliday"
                      class="text-black px-2 bg-cyan-300 hover:bg-cyan-500 rounded text-md"
                    >
                      <p>Sauvegarder</p>
                    </button>
                  </div>
                </div>
              </div>
            </button>
          </div>
        </transition>
      </button>
    </div>
    <div class="border-2 my-5 w-[40%] min-h-[100px]">
      <SchedulerCommentaire :weekNow="currentMonth[weekIndex]" />
    </div>
  </div>
</template>

<style scoped></style>
