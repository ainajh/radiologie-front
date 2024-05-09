<template>
  <section-admin-container
    pageClass="dash-demande"
    title="Statistique des vacations"
  >
    <div class="bg-white shadow-sm rounded-lg grid grid-cols-4 p-5 gap-5">
      <div>
        <QDate v-model="dateRange" range range-fn="rangeFunction" />
      </div>

      <div class="dash-demande__content col-span-3">
        <q-table
          class="w-full"
          flat
          :rows="statVacation"
          :columns="column"
          bordered
          row-key="name"
          :hide-pagination="true"
          :rows-per-page-options="[0]"
        >
          <template v-slot:no-data>
            <div
              class="full-width row flex-center text-secondary font-bold text-xl q-gutter-sm"
            >
              <span>Il n'y a pas de données disponnible</span>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </section-admin-container>
</template>
<script setup>
definePageMeta({
  layout: "admin",
  middleware: "admin",
});
import { useCommentScheduleStore } from "@/stores/commentSchedule";
import { storeToRefs } from "pinia";

const stateVacation = useCommentScheduleStore();

const { statVacation } = storeToRefs(stateVacation);

onMounted(async () => {
  await stateVacation.getStatVacation();
});

const dateRange = ref(null);

const rangeFunction = (day) => {
  const date = dateFns.parse(day, "yyyy/MM/dd");
  const rangeStart = dateFns.format(dateFns.startOfWeek(date), "yyyy/MM/dd");
  const rangeEnd = dateFns.format(dateFns.endOfWeek(date), "yyyy/MM/dd");
  return { from: rangeStart, to: rangeEnd };
};

watch(dateRange, async () => {
  await stateVacation.getStatVacation(dateRange.value);
});

const column = ref([
  {
    field: "nom",
    label: "Nom du radiologue",
    align: "start",
  },
  {
    field: "nombre_matin_apres_midi",
    label: "Vacation pleine",
    align: "start",
    format: (v, row) => {
      return v ? v : "0";
    },
  },
  {
    field: "nombre_midi",
    label: "Vacation midi",
    align: "start",
    format: (v, row) => {
      return v ? v : "0";
    },
  },
]);
</script>
