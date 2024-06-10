<template>
  <q-layout style="min-height: 300px !important">
    <!-- <vue3-html2pdf
      :show-layout="false"
      :float-layout="true"
      :enable-download="true"
      :preview-modal="true"
      :paginate-elements-by-height="300"
      filename="hee hee"
      :pdf-quality="12"
      :manual-pagination="false"
      pdf-format="a4"
      pdf-orientation="landscape"
      pdf-content-width="100%"
      ref="html2Pdf"
    >
      <template v-slot:pdf-content>
        <div class="m-2">
          <div class="planning w-full bg-white">
            <div
              class="planning__header flex items-center justify-between px-2"
            ></div>
            <div class="planning__main overflow-auto" id="pdfContent">
              <div class="planning__main-head w-full">
                <div class="flex w-full h-full flex-nowrap gap-custom">
                  <div
                    class="w-[200px] h-full p-1 text-center text-xs flex-center flex-col"
                  >
                    <span class="capitalize font-bold">{{
                      formatDateToString(currentMonth[weekIndex][0])
                    }}</span>
                    <span class="mx-2">au</span>
                    <span class="capitalize font-bold">{{
                      formatDateToString(currentMonth[weekIndex][6])
                    }}</span>
                  </div>
                  <planning-day
                    v-for="(day, i) in currentMonth[weekIndex]"
                    :key="i"
                    :day="day"
                    :monthIndex="monthIndex"
                  ></planning-day>
                </div>
              </div>
              <div class="planning__main-content w-full">
                <div
                  class="flex w-full min-h-[150px] flex-nowrap gap-custom mb-1 relative"
                  v-for="(e, i) in typeTab"
                  :key="i"
                >
                  <div
                    class="place-sticky min-w-[50px] min-h-[150px] border bg-red-500 vertical-text text-center p-1"
                    :style="{
                      background: `#${e.bg}`,
                    }"
                  >
                    {{ e.nom_place }}
                  </div>
                  <div class="w-full h-full">
                    <div
                      class="w-full min-h-[150px] grid gap-custom"
                      :class="e?.has_noon == 1 ? 'grid-row-3' : 'grid-row-2'"
                    >
                      <div
                        :class="
                          e?.has_noon == 1 ? 'min-h-[50px]' : 'min-h-[100px]'
                        "
                      >
                        <div class="flex flex-nowrap h-full gap-custom">
                          <div
                            class="w-[150px] flex-center text-white font-bold"
                            :style="{
                              background: `#${e.bg}`,
                            }"
                          >
                            {{ TimeInDay.Morning }}
                          </div>
                          <PlanningMorning
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
                            :bg="e?.bg"
                            :listPersonHolyday="dataHolidays"
                            :checkIfHasPersonHoliDay="checkIfHasPersonHoliDay"
                            :weekValidate="isContainValidate"
                          />
                        </div>
                      </div>
                      <div
                        :class="
                          e?.has_noon == 1 ? 'min-h-[50px]' : 'min-h-[100px]'
                        "
                        v-if="e?.has_noon"
                      >
                        <div class="flex flex-nowrap h-full gap-custom">
                          <div
                            class="w-[150px] flex-center text-white font-bold"
                            :style="{
                              background: `#${e.bg}`,
                            }"
                          >
                            {{ TimeInDay.Noon }}
                          </div>
                          <PlanningNoon
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
                            :bg="e?.bg"
                            :listPersonHolyday="dataHolidays"
                            :weekValidate="isContainValidate"
                          />
                        </div>
                      </div>
                      <div
                        :class="
                          e?.has_noon == 1 ? 'min-h-[50px]' : 'min-h-[100px]'
                        "
                      >
                        <div class="flex flex-nowrap h-full gap-custom">
                          <div
                            class="w-[150px] flex-center text-white font-bold"
                            :style="{
                              background: `#${e.bg}`,
                            }"
                          >
                            {{ TimeInDay.Afternoon }}
                          </div>
                          <PlanningAfternoon
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
                            :bg="e?.bg"
                            :listPersonHolyday="dataHolidays"
                            :weekValidate="isContainValidate"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </template>
    </vue3-html2pdf> -->

    <!-- <button @click="exportToPDF($refs.html2Pdf)">click</button> -->

    <div class="planning w-full bg-white">
      <div class="planning__header flex items-center justify-between px-2">
        <div class="hidden lg:flex items-center gap-2">
          <q-btn outline color="black" label="Aujourd'hui" @click="thisMonth" />
          <div class="flex items-center">
            <q-btn flat round icon="chevron_left" @click="increment">
              <q-tooltip class="bg-primary" :offset="[10, 10]">
                Semaine précédente
              </q-tooltip>
            </q-btn>
            <q-btn flat round icon="chevron_right" @click="decrement">
              <q-tooltip class="bg-primary" :offset="[10, 10]">
                Semaine suivante
              </q-tooltip>
            </q-btn>
            <div class="font-bold">Semaine</div>
          </div>
        </div>
        <div class="hidden lg:flex items-center gap-2">
          <q-btn
            outline
            color="red"
            icon="delete"
            label="Effacer la semaine"
            @click="deleteSchredulWeek"
            v-if="userDash?.role == 'admin' && !isContainValidate"
          />
          <q-btn
            flat
            :color="isContainValidate ? 'red' : 'black'"
            icon="event_available"
            :label="
              isContainValidate ? 'Dévalider la semaine' : 'Valider la semaine'
            "
            @click="toggleAllPlanning"
            v-if="userDash?.role == 'admin'"
          />

          <q-btn
            flat
            color="black"
            icon="chat"
            @click="showCommentaire = !showCommentaire"
          >
            <q-badge color="red" rounded floating v-if="allComment.length" />
            <q-tooltip class="bg-primary" :offset="[10, 10]">
              Voir le commentaire cette semaine
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            color="black"
            icon="content_copy"
            v-if="userDash.role == 'admin'"
            @click="copyShcedule"
          >
            <q-tooltip class="bg-primary" :offset="[10, 10]">
              Copier
            </q-tooltip></q-btn
          >
          <q-btn
            flat
            color="black"
            icon="content_paste"
            v-if="isCopy && userDash.role == 'admin'"
            @click="pasteShcedule"
          >
            <q-tooltip class="bg-primary" :offset="[10, 10]">
              Coller
            </q-tooltip>
          </q-btn>
          <q-btn
            flat
            color="red"
            icon="highlight_off"
            v-if="copiedId != null && copiedId != ''"
            @click="cancelCopyShcedule"
          >
            <q-tooltip class="bg-red" :offset="[10, 10]">
              Annuler la copie
            </q-tooltip>
          </q-btn>
          <!-- @click="exportToPDF" -->
          <q-btn flat color="black" icon="print">
            <q-tooltip class="bg-primary" :offset="[10, 10]">
              Imprimer
            </q-tooltip>
          </q-btn>
          <!-- @click="exportToPDF" -->
          <div class="flex items-center">
            <div class="font-bold capitalize">{{ actualDate() }}</div>
            <q-btn
              flat
              round
              icon="chevron_left"
              @click="
              (e: MouseEvent) => {
                previousMonth()
                return e
              }
            "
            >
              <q-tooltip class="bg-primary" :offset="[10, 10]">
                Mois précédent
              </q-tooltip>
            </q-btn>
            <q-btn
              flat
              round
              icon="chevron_right"
              @click=" (e: MouseEvent) => {
                nextMonth() 
                return e
              }
            "
            >
              <q-tooltip class="bg-primary" :offset="[10, 10]">
                Mois suivant
              </q-tooltip>
            </q-btn>
          </div>
          <div class="flex items-center gap-2">
            <q-btn
              outline
              color="black"
              icon="calendar_month"
              @click="showListLeave = !showListLeave"
            >
              <q-badge
                color="red"
                rounded
                floating
                v-if="dataHolidays?.length"
              />
              <q-tooltip class="bg-primary" :offset="[10, 10]">
                Liste des congés
              </q-tooltip>
            </q-btn>

            <q-btn
              outline
              color="black"
              icon="data_saver_on"
              v-if="userDash?.role != 'secretaire'"
              @click="toggleModalCreateHotiday"
            >
              <q-tooltip class="bg-primary" :offset="[10, 10]">
                Ajouter congés
              </q-tooltip>
            </q-btn>
          </div>
        </div>
        <div class="flex lg:hidden w-full">
          <q-btn outline color="accent" icon="menu">
            <q-menu fit>
              <q-list style="min-width: 355px">
                <q-item clickable class="flex justify-between">
                  <q-btn
                    outline
                    color="black"
                    label="Aujourd'hui"
                    @click="thisMonth"
                  />
                  <div class="flex items-center gap-2">
                    <q-btn flat round icon="chevron_left" @click="increment">
                      <q-tooltip class="bg-primary" :offset="[10, 10]">
                        Semaine précédente
                      </q-tooltip>
                    </q-btn>
                    <q-btn flat round icon="chevron_right" @click="decrement">
                      <q-tooltip class="bg-primary" :offset="[10, 10]">
                        Semaine suivante
                      </q-tooltip>
                    </q-btn>
                    <div class="font-bold">Semaine</div>
                  </div>
                </q-item>
                <q-item clickable class="flex justify-between">
                  <q-btn
                    outline
                    color="red"
                    icon="delete"
                    label="Effacer la semaine"
                    @click="deleteSchredulWeek"
                    v-if="userDash?.role == 'admin' && !isContainValidate"
                  />
                  <q-btn flat color="black" icon="print">
                    <q-tooltip class="bg-primary" :offset="[10, 10]">
                      Imprimer
                    </q-tooltip>
                  </q-btn>
                </q-item>
                <q-item clickable class="flex justify-between">
                  <q-btn
                    flat
                    :color="isContainValidate ? 'red' : 'black'"
                    icon="event_available"
                    :label="
                      isContainValidate
                        ? 'Dévalider la semaine'
                        : 'Valider la semaine'
                    "
                    @click="toggleAllPlanning"
                    v-if="userDash?.role == 'admin'"
                  />
                  <q-btn
                    flat
                    color="black"
                    icon="chat"
                    @click="showCommentaire = !showCommentaire"
                  >
                    <q-badge
                      color="red"
                      rounded
                      floating
                      v-if="allComment.length"
                    />
                    <q-tooltip class="bg-primary" :offset="[10, 10]">
                      Voir le commentaire cette semaine
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    color="black"
                    icon="content_copy"
                    v-if="userDash.role == 'admin'"
                    @click="copyShcedule"
                  >
                    <q-tooltip class="bg-primary" :offset="[10, 10]">
                      Copier
                    </q-tooltip></q-btn
                  >
                  <q-btn
                    flat
                    color="black"
                    icon="content_paste"
                    v-if="isCopy && userDash.role == 'admin'"
                    @click="pasteShcedule"
                  >
                    <q-tooltip class="bg-primary" :offset="[10, 10]">
                      Coller
                    </q-tooltip>
                  </q-btn>
                  <q-btn
                    flat
                    color="red"
                    icon="highlight_off"
                    v-if="copiedId != null && copiedId != ''"
                    @click="cancelCopyShcedule"
                  >
                    <q-tooltip class="bg-red" :offset="[10, 10]">
                      Annuler la copie
                    </q-tooltip>
                  </q-btn>
                </q-item>
                <q-item clickable class="flex justify-between">
                  <div class="flex items-center">
                    <div class="font-bold capitalize">{{ actualDate() }}</div>
                    <q-btn
                      flat
                      round
                      icon="chevron_left"
                      @click="
                      (e: MouseEvent) => {
                        previousMonth()
                        return e
                      }
                    "
                    >
                      <q-tooltip class="bg-primary" :offset="[10, 10]">
                        Mois précédent
                      </q-tooltip>
                    </q-btn>
                    <q-btn
                      flat
                      round
                      icon="chevron_right"
                      @click=" (e: MouseEvent) => {
                        nextMonth() 
                        return e
                      }
                    "
                    >
                      <q-tooltip class="bg-primary" :offset="[10, 10]">
                        Mois suivant
                      </q-tooltip>
                    </q-btn>
                  </div>
                  <div class="flex items-center gap-2">
                    <q-btn
                      outline
                      color="black"
                      icon="calendar_month"
                      @click="showListLeave = !showListLeave"
                    >
                      <q-badge
                        color="red"
                        rounded
                        floating
                        v-if="dataHolidays?.length"
                      />
                      <q-tooltip class="bg-primary" :offset="[10, 10]">
                        Liste des congés
                      </q-tooltip>
                    </q-btn>

                    <q-btn
                      outline
                      color="black"
                      icon="data_saver_on"
                      v-if="userDash?.role != 'secretaire'"
                      @click="toggleModalCreateHotiday"
                    >
                      <q-tooltip class="bg-primary" :offset="[10, 10]">
                        Ajouter congés
                      </q-tooltip>
                    </q-btn>
                  </div>
                </q-item>
              </q-list>
            </q-menu>
          </q-btn>
        </div>
      </div>
      <div class="planning__main overflow-auto" id="pdfContent">
        <div class="planning__main-head w-full">
          <div class="flex w-full h-full flex-nowrap gap-custom">
            <div
              class="w-[200px] h-full p-1 text-center text-xs flex-center flex-col"
            >
              <span class="capitalize font-bold">{{
                formatDateToString(currentMonth[weekIndex][0])
              }}</span>
              <span class="mx-2">au</span>
              <span class="capitalize font-bold">{{
                formatDateToString(currentMonth[weekIndex][6])
              }}</span>
            </div>
            <!-- blocs day start  -->
            <planning-day
              v-for="(day, i) in currentMonth[weekIndex]"
              :key="i"
              :day="day"
              :monthIndex="monthIndex"
            ></planning-day>
            <!-- blocs day start  -->
          </div>
        </div>
        <div class="planning__main-content w-full">
          <div
            class="flex w-full min-h-[150px] flex-nowrap gap-custom mb-1 relative"
            v-for="(e, i) in typeTab"
            :key="i"
          >
            <div
              class="place-sticky min-w-[50px] min-h-[150px] border bg-red-500 vertical-text text-center p-1"
              :style="{
                background: `#${e.bg}`,
              }"
            >
              {{ e.nom_place }}
            </div>
            <div class="w-full h-full">
              <div
                class="w-full min-h-[150px] grid gap-custom"
                :class="e?.has_noon == 1 ? 'grid-row-3' : 'grid-row-2'"
              >
                <div
                  :class="e?.has_noon == 1 ? 'min-h-[50px]' : 'min-h-[100px]'"
                >
                  <div class="flex flex-nowrap h-full gap-custom">
                    <div
                      class="w-[150px] flex-center text-white font-bold"
                      :style="{
                        background: `#${e.bg}`,
                      }"
                    >
                      {{ TimeInDay.Morning }}
                    </div>
                    <PlanningMorning
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
                      :bg="e?.bg"
                      :listPersonHolyday="dataHolidays"
                      :checkIfHasPersonHoliDay="checkIfHasPersonHoliDay"
                      :weekValidate="isContainValidate"
                    />
                  </div>
                </div>
                <div
                  :class="e?.has_noon == 1 ? 'min-h-[50px]' : 'min-h-[100px]'"
                  v-if="e?.has_noon"
                >
                  <div class="flex flex-nowrap h-full gap-custom">
                    <div
                      class="w-[150px] flex-center text-white font-bold"
                      :style="{
                        background: `#${e.bg}`,
                      }"
                    >
                      {{ TimeInDay.Noon }}
                    </div>
                    <PlanningNoon
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
                      :bg="e?.bg"
                      :listPersonHolyday="dataHolidays"
                      :weekValidate="isContainValidate"
                    />
                  </div>
                </div>
                <div
                  :class="e?.has_noon == 1 ? 'min-h-[50px]' : 'min-h-[100px]'"
                >
                  <div class="flex flex-nowrap h-full gap-custom">
                    <div
                      class="w-[150px] flex-center text-white font-bold"
                      :style="{
                        background: `#${e.bg}`,
                      }"
                    >
                      {{ TimeInDay.Afternoon }}
                    </div>
                    <PlanningAfternoon
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
                      :bg="e?.bg"
                      :listPersonHolyday="dataHolidays"
                      :weekValidate="isContainValidate"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- modal creation congé  -->
          <q-dialog v-model="isOpen" persistent>
            <q-card class="w-[80vw] md:w-[40vw]">
              <planningCongeForm
                :fetchHolidayList="fetchHolidayList"
                :close="() => (isOpen = false)"
                :isContainValidate="isContainValidate"
              />
            </q-card>
          </q-dialog>
          <!-- modal creation congé  -->
        </div>
      </div>

      <q-drawer v-model="showCommentaire" :width="380" elevated side="right">
        <PlanningCommentaire
          :weekNow="currentMonth[weekIndex]"
          :show="showCommentaire"
          @close="showCommentaire = false"
        />
      </q-drawer>
      <q-drawer v-model="showListLeave" :width="380" elevated side="right">
        <PlanningListeLeaveWeek
          :data="dataHolidays"
          @close="showListLeave = false"
          @delete="deleteHoliday"
          @fetchHolidayList="fetchHolidayList"
        >
          <div class="flex items-center justify-between">
            <div>
              <span class="capitalize font-bold">{{
                formatDateToString(currentMonth[weekIndex][0])
              }}</span>
              <span class="mx-2">au</span>
              <span class="capitalize font-bold">{{
                formatDateToString(currentMonth[weekIndex][6])
              }}</span>
            </div>
            <div>
              <q-btn flat round icon="chevron_left" @click="increment" />
              <q-btn flat round icon="chevron_right" @click="decrement" />
            </div>
          </div>
        </PlanningListeLeaveWeek>
      </q-drawer>
    </div>
  </q-layout>
</template>
<script lang="ts" setup>
//line to use meta

import dayjs, { Dayjs } from "dayjs";
import "dayjs/locale/fr";
dayjs.locale("fr");

import getMonth from "@/utils/functions/get-month";
import ScheduleService from "@/services/schedule.service";
import TypeService from "@/services/type.service";
import type { DataShift } from "@/utils/constants/shift-interface";
import { TimeInDay } from "@/utils/constants/time-in-day";
import UserService from "@/services/user.service";
import LeaveService from "@/services/leave.service";
import type { LeaveData } from "~/utils/constants/leave-interface";
import { useToast } from "vue-toastification";
const toast = useToast();
const userDash: any = useCookie("user").value;
import Swal from "sweetalert2";

import Vue3Html2pdf from "vue3-html2pdf";

const exportToPDF = (references: any) => {
  console.log(references);
  references.generatePdf();
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
let typeOfHoliday = ref("");
let inputStartDate = ref(dayjs().format("YYYY-MM-DD"));
let inputEndDate = ref(dayjs().format("YYYY-MM-DD"));
let copiedId = ref<string>("");
const showCommentaire = ref(false);
const showListLeave = ref(false);
const periode = ref("journe");

onMounted(async () => {
  data.value = await ScheduleService.getAll();
  thisMonth();
  fetchHolidayList();
});

const required = (val) => {
  return val !== null || val != "";
};
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
  const i = currentMonth.value.findIndex((_shift, i) => {
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
  data.value = await ScheduleService.getAll();
  refreshMe();
}

async function cancelCopyShcedule() {
  await ScheduleService.undoCopyPaste(copiedId.value);

  copiedId.value = "";
  data.value = await ScheduleService.getAll();
}

function toggleModalCreateHotiday() {
  isOpen.value = !isOpen.value;
}

async function createHoliday() {
  if (periode.value == "journe") {
    inputEndDate.value = inputStartDate.value;
  }
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
const allComment = ref([]);
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
  allComment.value = commentStore.allComments;
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
const formatDateToString = (date: string) => {
  const dates = dayjs(date);
  return dates.format("DD MMMM YYYY");
};

// Fonction pour vérifier si une date se trouve dans une période
function isDateInRange(date, startDate, endDate) {
  return date >= startDate && date <= endDate;
}

const checkIfHasPersonHoliDay = (id = null) => {
  const hasDuplicate = allScheduleThisWeek.value.map(
    (item) => item.type_of_schedule
  );

  if (hasDuplicate.includes(1)) return true;

  // Variable pour stocker le résultat global
  let isDuringConge = false;

  // Parcourir la liste des plannings
  allScheduleThisWeek.value?.forEach((planning) => {
    // Récupérer l'ID de la personne associée à ce planning
    const personId = planning.person_id;

    // Trouver les congés de cette personne
    const conges = dataHolidays.value.filter(
      (conge) => conge.idPerson === personId
    );

    // Vérifier si le planning est pendant un congé
    const found = conges.some((conge) => {
      const startDate = new Date(conge.dateStart);
      const endDate = new Date(conge.dateEnd);
      const planningDate = new Date(planning.date);
      return isDateInRange(planningDate, startDate, endDate);
    });

    // Mettre à jour la variable isDuringConge si un congé est trouvé
    if (found) {
      isDuringConge = true;
      // Si un congé est trouvé, sortir de la boucle forEach
      return;
    }
  });

  return isDuringConge;
};
const { message } = storeToRefs(commentStore);
const deleteSchredulWeek = async () => {
  const weekList = currentMonth.value[weekIndex.value].map((item) =>
    formatDate(item)
  );
  Swal.fire({
    title: "Supprimer cette semaine?",
    text: "Vous ne pourrez pas revenir en arrière !",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#5cdfe4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Oui, supprimer!",
    cancelButtonText: "Annuler",
  }).then(async (result) => {
    if (result.isConfirmed) {
      await commentStore.deleteAllSheduleThisWeek(weekList);
      const { error, msg } = message.value;
      if (error) {
        toast.error("Il y a une erreur lors de la suppression de la semaine");
      } else {
        refreshMe();
        toast.success("Supression de la semaine en succès");
      }
    }
  });
};
const toggleAllPlanning = async () => {
  const check = checkIfHasPersonHoliDay();

  if (check && !isContainValidate.value) {
    toast.error(
      "Attention le planning ne peut être validé car des médecins sont en vacance ou en doublon, merci de modifier le planning "
    );
    return;
  }

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

onMounted(() => {
  allCommentInThisWeek(true);
  fetchHolidayList();
});
const refreshMe = async () => {
  getAllSheduleThisWeek();
  data.value = await ScheduleService.getAll();
};

watch(
  weekIndex,
  (_newValue, _oldValue) => {
    allCommentInThisWeek(true);
    getAllSheduleThisWeek();
    refreshMe();
  },
  { immediate: true }
);
watch(
  currentMonth,
  (_newValue, _oldValue) => {
    allCommentInThisWeek(true);
    getAllSheduleThisWeek();
    refreshMe();
  },
  { immediate: true }
);
watch(showListLeave, (val) => {
  if (val) {
    showCommentaire.value = false;
  }
});
watch(showCommentaire, (val) => {
  if (val) {
    showListLeave.value = false;
  }
});
</script>
<style lang="scss">
.planning {
  .gap-custom {
    gap: 1px;
  }
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .vertical-text {
    writing-mode: vertical-rl; /* Vertical writing mode from right to left */
    text-orientation: upleft; /* Ensures the text is displayed upright */
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-transform: uppercase;
    font-weight: bold;
    color: white;
    font-size: 0.8em;
  }
  .day {
    width: calc((100% - 200px) / 7);
    min-width: 160px;
  }
  .schedulan {
    width: calc((100% - 150px) / 7);
    min-width: 165px;
  }
  height: calc(100vh - 60px);
  display: grid;
  grid-template-rows: 50px calc(100% - 50px);

  &__header {
  }
  &__main {
    display: grid;
    grid-template-rows: 50px calc(100% - 50px - 3px);
    gap: 3px;
    &-head {
    }
    &-content {
    }
  }
  @media (min-width: 1024px) {
    .lg\:flex {
      display: flex !important;
    }
  }

  .place-sticky {
    position: sticky;
    left: 0;
    z-index: 2;
  }
}
</style>
