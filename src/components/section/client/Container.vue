<template>
  <div class="p-4">
    <div>
      <h1 class="text-[30px] font-bold">Liste des demandes</h1>
    </div>
    <q-table class="w-full" flat :rows="rows" table-header-class="header-medecin" row-key="nom_patient" :columns="columns"
      bordered :filter="search" :loading="loading">
      <template v-slot:loading>
        <div class="width-full flex justify-center">
          <q-circular-progress indeterminate rounded size="50px" class="q-ma-md" />
        </div>
      </template>
      <template v-slot:top-left>
        <q-input dense outlined debounce="300" v-model="search" placeholder="Recherche" color="secondary">
          <template v-slot:append>
            <q-icon name="search" />
          </template>
        </q-input>
      </template>
      <template v-slot:top-right>
        <div class="py-1 flex w-full justify-between items-center">
          <div class="flex gap-3 items-center">
            <q-btn label="Ajouter" flat class="flat-btn" to="/" />
          </div>
        </div>
      </template>
      <template v-slot:body-cell-date_max="props">
        <q-td :props="props">
          <div class="w-full">
            <q-badge :class="props.value === 'Urgent' ? 'bg-[#e60000]' : 'bg-[#009933]'
              " :label="props.value === null ? 'Urgent' : props.value" class="w-full p-2 justify-center" />
          </div>
        </q-td>
      </template>
      <template v-slot:body-cell-status="props">
        <q-td :props="props">
          <div class="w-full">
            <q-badge :class="props.value === 'pris'
                ? 'bg-[#009933] text-white'
                : 'bg-[#f5ea20] text-black'
              " :label="props.value === 'pris' ? 'Déjà pris' : 'Non pris'" class="w-full p-2 justify-center" />
          </div>
        </q-td>
      </template>
      <template v-slot:no-data>
        <div class="full-width row flex-center text-[17px]">
          <span>Il n'y a pas de données disponnible</span>
        </div>
      </template>
      <template v-slot:body-cell-action="props">
        <q-td :props="props">
          <q-btn square dense icon="delete" class="mx-3" @click="deleteDemande(props.row.id)" />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script setup lang="ts">
import Swal from "sweetalert2";
const search = useState("search", () => "");
const { $api } = useNuxtApp();
const columns: {
  name: string;
  field: string;
  label: string;
  align?: "center" | "left" | "right" | undefined;
  format?: (a: any, b: any) => any;
  sortable?: boolean;
  sort?: (a: any, b: any) => any;
}[] = [
    {
      field: "id",
      name: "id",
      label: "ID",
      align: "center",
    },
    {
      name: "nom_patient",
      field: "nom_patient",
      label: "Nom du patient",
      align: "center",
    },
    {
      name: "nom_type",
      field: "nom_type",
      label: "Type",
      align: "center",
    },
    {
      name: "nom_sous_type",
      field: "nom_sous_type",
      label: "Sous type",
      align: "center",
    },
    {
      name: "tel",
      field: "tel",
      label: "Téléphone",
      align: "center",
    },
    {
      name: "email",
      field: "email",
      label: "Email",
      align: "center",
      format: (v, row) => {
        return v ? v : "-";
      }
    },
    {
      name: "datenais",
      field: "datenais",
      label: "Date de Naissance",
      align: "center",
      format: (v: any, row: any) => {
        return new Date(v).toLocaleDateString();
      },
    },
    {
      field: "rdv",
      label: "Rendez-vous donné avant le",
      align: "center",
      name: "date_max",
      format: (v: any, row: any) => {
        if (v) {
          return new Date(v).toLocaleDateString();
        }
        return "Urgent";
      },
    },
    {
      name: "date_rdv",
      field: "date_rdv",
      label: "Date de rendez-vous",
      align: "center",
      format: (v: any, row: any) => {
        if (v) return new Date(v).toLocaleDateString();
        return "-";
      },
    },
    {
      name: "status",
      field: "lieu",
      label: "Statut",
      align: "center",
      format: (v: any, row: any) => {
        if (v) {
          return "pris";
        }
        return "non pris";
      },
    },
    {
      name: "lieu",
      field: "lieu",
      label: "Lieu",
      align: "center",
      format: (v: any, row: any) => {
        if (v) {
          return v;
        }
        return "-";
      },
    },
    {
      field: "action",
      label: "Action",
      align: "center",
      name: "action",
    },
  ];
const rows = useState("rows", () => []);
const loading = useState("TableLoading", () => true);
function deleteDemande(id: string) {
  Swal.fire({
    title: "Etes vous sure de le supprimer?",
    text: "Vous ne pourrez pas revenir en arrière !",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#5cdfe4",
    cancelButtonColor: "#d33",
    confirmButtonText: "Oui, supprimer!",
    cancelButtonText: "Annuler",
  }).then(async (result) => {
    if (result.isConfirmed) {
      const { $api } = useNuxtApp();
      try {
        await $api?.delete(`/demande/delete/${id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenmedecin")}`,
          },
        });
        Swal.fire("Suppression!", "Type supprimer avec succès", "success");
        loading.value = true;
        const res = await $api.get("demande/mine", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("tokenmedecin")}`,
          },
        });
        rows.value = res.data.demandes;
      } catch (error) {
        console.log(error);
        Swal.fire(
          "Erreur!",
          "Il y a un erreur lors de la suppression!",
          "error"
        );
      }
      loading.value = false;
    }
  });
}
onBeforeMount(async () => {
  try {
    const token = localStorage.getItem("tokenmedecin");
    if (token) {
      const res = await $api.get("demande/mine", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      rows.value = res.data.demandes;
    }
  } catch (error) {
    console.log(error);
    localStorage.removeItem("tokenmedecin");
  } finally {
    loading.value = false;
  }
});
</script>
