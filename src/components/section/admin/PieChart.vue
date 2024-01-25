<template>
  <div style="height: 70vh">
    <div class="dash-demande__filter pb-5 text-center">
      <div class="pl-[50px]">
        <q-btn-group>
          <q-btn
            v-for="(item, index) in buttons"
            :key="index"
            :label="item.label"
            :class="item.value == valueToShow ? 'active' : ''"
            @click="filterData(item.value)"
          />
        </q-btn-group>
      </div>
    </div>
    <Pie :data="(data as any)" :options="options" class="line" />
  </div>
</template>

<script setup lang="ts">
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  type ChartData,
} from "chart.js";
import { Line, Pie } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const demandestore = useDemandeStore();

const data = ref<ChartData<"bar">>({
  datasets: [],
});

const buttons = [
  { label: "Tous les demandes", value: "nombre_demandes" },
  { label: "Demande cette année", value: "demandes_cette_annee" },
  { label: "Demande ce mois", value: "demandes_ce_mois" },
  { label: "Demande cette semaine", value: "demandes_cette_semaine" },
];
const datasPie = ref<ChartData<"bar">>({});
const valueToShow = ref("nombre_demandes");
const options = ref({
  responsive: true,
  maintainAspectRatio: false,
});

const formatData = (inputData: any, value: any) => {
  const labels = inputData?.map((item) => item.medecin);
  const data = inputData?.map((item) => {
    if (value === "nombre_demandes") {
      return item.nombre_demandes;
    } else if (value === "demandes_ce_mois") {
      return parseInt(item.demandes_ce_mois);
    } else if (value === "demandes_cette_semaine") {
      return parseInt(item.demandes_cette_semaine);
    } else if (value === "demandes_cette_annee") {
      return parseInt(item.demandes_cette_annee);
    }
    return 0;
  });

  // Générer des couleurs aléatoires pour le fond
  function generateRandomColor() {
    return "#" + Math.floor(Math.random() * 16777215).toString(16);
  }

  // Créer le format attendu par Chart.js
  const chartData = {
    labels: labels,
    datasets: [
      {
        backgroundColor: data.map(() => generateRandomColor()), // Utilisation de couleurs aléatoires pour le fond
        data: data,
      },
    ],
  };

  return chartData;
};

const filterData = async (type: string) => {
  await demandestore.getStatsMed();
  valueToShow.value = type;
  data.value = {
    ...formatData(demandestore?.statistiqueMed, type),
  };
};

onBeforeMount(async () => {
  // await demandestore.getallDemandes();
  await demandestore.getStatsMed();
  // await types.getAllTypes();

  data.value = {
    ...formatData(demandestore?.statistiqueMed, valueToShow.value),
  };
});
</script>

<style scoped>
.line {
  width: 50vw;
  height: 80vh;
}
</style>
