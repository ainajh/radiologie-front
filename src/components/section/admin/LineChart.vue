<template>
  <div style="height: 80vh">
    <Line :data="(data as any)" :options="options" class="line" />
  </div>
  <!-- {{ demandestore.statistiques }} -->
  <!-- 
  <br/>
  <br/>
  <br/>
  <br/>
  {{ data }} -->
  <!-- <Pie :data="(data as any)" :options="options" class="line" /> -->
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
const types = useTypeStore();

const data = ref<ChartData<"bar">>({
  datasets: [],
});
const options = ref({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    x: {
      title: {
        display: true,
        text: "Mois",
      },
    },
    y: {
      title: {
        display: true,
        text: "Nombre de demandes",
      },
      ticks: {
        stepSize: 1, // Force les graduations à 1 en 1
        precision: 0, // Précision des chiffres (aucune décimale)
      },
    },
  },
});

onBeforeMount(async () => {
  // await demandestore.getallDemandes();
  await demandestore.getStats();
  // await types.getAllTypes();
  data.value = {
    labels: [
      "Janvier",
      "Février",
      "Mars",
      "Avril",
      "Mai",
      "Juin",
      "Juillet",
      "Août",
      "Septembre",
      "Octobre",
      "Novembre",
      "Decembre",
    ],
    datasets: demandestore?.statistiques,
  };
});
</script>

<style scoped>
.line {
  width: 50vw;
  height: 80vh;
}
</style>
