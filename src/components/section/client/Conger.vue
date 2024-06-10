<template>
  <div class="p-4">
    <div>
      <h1 class="text-[30px] font-bold">Prise de congé</h1>
    </div>
    <div class="bg-white shadow-sm rounded-lg">
      <div class="dash-demande__content p-5">
        <q-table
          class="w-full"
          flat
          :rows="allLeave"
          :columns="columns"
          bordered
          row-key="name"
          :filter="filter"
          :hide-pagination="true"
          :rows-per-page-options="[0]"
        >
          <template v-slot:top-left>
            <q-input
              dense
              outlined
              debounce="300"
              v-model="filter"
              placeholder="Search"
            >
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:top-right>
            <q-btn
              color="secondary"
              icon="add"
              label="Ajouter"
              @click="showModal('add', null)"
            />
          </template>
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <div class="w-full">
                <q-btn
                  square
                  dense
                  icon="delete"
                  class="mr-3"
                  @click="deleteType(props.row.id)"
                />
                <q-btn
                  square
                  dense
                  icon="edit"
                  class="mr-3"
                  @click="showModal('update', props.row)"
                />
              </div>
            </q-td>
          </template>
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
    <q-dialog v-model="prompt" persistent>
      <q-card style="min-width: 400px">
        <section-client-conger-form
          v-model="prompt"
          @input="emitUpdate"
          :action="action"
          :datas="datas"
        ></section-client-conger-form
      ></q-card>
    </q-dialog>
  </div>
</template>
<script>
import { useLeaveStore } from "@/stores/leave";
import { useUtilisateurStore } from "@/stores/utilisateurs";
import { mapState } from "pinia";
import { mapActions } from "pinia";

import Swal from "sweetalert2";
const utilisateurStore = useUtilisateurStore();
onMounted(async () => {
  await utilisateurStore.getAllRadiologues();
});
const { userList } = storeToRefs(utilisateurStore);
export default {
  setup() {
    const me = useCookie("user");
    const user = userStore();
    definePageMeta({
      layout: "admin",
      middleware: "admin",
    });
    const formatDateToFrench = (dateString) => {
      const months = [
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
        "Décembre",
      ];

      const date = new Date(dateString);
      const day = date.getDate();
      const month = months[date.getMonth()];
      const year = date.getFullYear();

      return `${day} ${month} ${year}`;
    };

    const columns = [
      {
        field: "id",
        label: "ID",
        align: "center",
      },
      {
        field: "nom",
        label: "Nom",
        align: "center",
      },
      {
        field: "typeOfLeave",
        label: "Type de congés",
        align: "center",
      },
      {
        field: "dateStart",
        name: "dateStart",
        label: "Date de début",
        align: "center",
        format: (v, row) => {
          return v == null ? "" : formatDateToFrench(v);
        },
      },
      {
        field: "dateEnd",
        name: "dateEnd",
        label: "Date de fin",
        align: "center",
        format: (v, row) => {
          return v == null ? "" : formatDateToFrench(v);
        },
      },

      {
        name: "action",
        field: "action",
        label: "Action",
        align: "center",
      },
    ];
    return { columns, formatDateToFrench, user, me };
  },
  data() {
    return {
      prompt: false,
      filter: "",
      form: { name: "" },
      type: "",

      action: null,
      datas: null,
    };
  },
  async mounted() {
    await this.getAllLeave(this.me.role != "admin" ? this.me?.id : "");
    await this.getAllUsers();
  },
  computed: {
    ...mapState(useLeaveStore, ["allLeave", "message"]),
    ...mapState(useUtilisateurStore, ["allUsers"]),
  },
  methods: {
    ...mapActions(useLeaveStore, ["getAllLeave", "deleteLeave"]),
    ...mapActions(useUtilisateurStore, ["getAllUsers"]),
    toggleType(type) {
      this.type = type;
    },
    deleteType(id) {
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
          this.deleteLeave(id);
          const { error, msg } = this.message;
          if (error) {
            Swal.fire(
              "Erreur!",
              "Il y a un erreur lors de la suppression!",
              "error"
            );
          } else {
            Swal.fire("Suppression!", "Type supprimer avec succès", "success");
          }
          await this.getAllLeave(this.me.role != "admin" ? this.me?.id : "");
        }
      });
    },

    showModal(type, datas = null) {
      this.prompt = true;
      this.action = type;
      this.datas = datas;
    },
  },
};
</script>
<style lang="scss">
.dash-demande {
  &__filter {
    background: #edf1f6;
    .q-btn-group {
      box-shadow: none !important;
      .q-btn {
        background: #edf1f6 !important;
        color: #070d3f !important;
        &.active {
          position: relative;
          background: #fff !important;
          &::after {
            content: "";
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 3px;
            background: $primary;
          }
        }
      }
    }
  }
  &__content {
    .q-table {
      thead {
        background: #070d3f;
        color: #fff;
      }
    }
  }
}
</style>
