<template>
  <section-admin-container
    pageClass="dash-demande"
    title="Gestion des demandes"
  >
    <div class="bg-white shadow-sm rounded-lg">
      <div class="dash-demande__filter">
        <div class="pl-[50px]">
          <q-btn-group>
            <q-btn
              label="Tous"
              :class="type == '' ? 'active' : ''"
              @click="toggleType('')"
            />
            <q-btn
              v-for="(tp, i) in new Set(allTypes.map((a) => a.nom_type))"
              :key="i"
              :label="tp"
              :class="type == tp ? 'active' : ''"
              @click="toggleType(tp)"
            >
              <q-badge :label="badgeType(tp)" floating color="red" />
            </q-btn>
          </q-btn-group>
        </div>
      </div>
      <div class="dash-demande__content p-5">
        <q-dialog v-model="openComs" persistent>
          <q-card style="min-width: 350px">
            <q-card-section class="flex flex-col gap-2">
              <div v-for="c in current_d.comments" :key="c.id">
                <div class="bg-[#ccc] rounded p-2 relative" v-if="c.content">
                  <div class="content">
                    {{ c.content }}
                  </div>
                  <q-icon
                    v-if="c.content"
                    name="cancel"
                    class="absolute top-[-5px] right-[-5px] text-black cursor-pointer"
                    size="17px"
                    @click="deleteComs(c.id)"
                  />
                </div>
              </div>
            </q-card-section>
            <q-card-section class="q-pt-none">
              <q-input
                dense
                v-model="coms"
                label="Votre commentaire:"
                autofocus
                @keyup.enter="addCommentaire(current_d.id_demande)"
              />
            </q-card-section>
            <q-card-actions align="right" class="text-primary">
              <q-btn flat label="Annuler" v-close-popup />
              <q-btn
                flat
                label="Envoyer"
                v-close-popup
                @click="addCommentaire(current_d.id_demande)"
              />
            </q-card-actions>
          </q-card>
        </q-dialog>
        <q-dialog v-model="showModalDetail" persistent ref="myModal">
          <q-card style="min-width: 550px">
            <section-admin-demande-form-detail
              v-model="showModalDetail"
              @refresh="showDemandeByStatus('attente')"
              :datas="selectedRows"
            ></section-admin-demande-form-detail>
          </q-card>
        </q-dialog>
        <q-table
          class="w-full"
          flat
          :rows="
            filteredDemandes.filter((d) =>
              type !== '' ? d.nom_type === type : d
            )
          "
          :columns="filtertype === null ? columnsDefault : columns"
          :sort-method="customSort"
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
            <div class="flex gap-2">
              <q-btn
                :color="filtertype == null ? 'secondary' : 'primary'"
                :label="`Voir les listes des demandes ${
                  filtertype == null ? 'traités' : 'en attente'
                }`"
                @click="showDemandeByStatus('accepte')"
              />

              <q-btn
                color="secondary"
                label="Ajouter"
                to="/dashboard/ajout-demande"
              />
            </div>
          </template>
          <template v-slot:body-cell-rdv="props">
            <q-td :props="props">
              <div class="w-full">
                <div v-if="props.value">
                  {{ formatDateToFrench(props.value) }}
                </div>
                <q-badge
                  v-else
                  class="bg-red w-full p-2 justify-center"
                  label="Urgent"
                />
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-nom_medecin="props">
            <q-td :props="props">
              <div
                class="font-bold"
                :style="{
                  color: props.row.role_user !== 'medecin' ? '#0ac1c4' : 'red',
                }"
                :class="props.row.ordonnance ? 'border-doctor' : ''"
              >
                {{
                  props.value
                    ? props.row.role_user == "secretaire"
                      ? props.value
                      : "Dr " + props.value
                    : "---"
                }}
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-comments="props">
            <q-td :props="props">
              <div class="w-full">
                <q-btn
                  square
                  dense
                  icon="comment"
                  class="mr-3"
                  :style="{
                    background:
                      convertToJson(props.row.comments).length !== 0 &&
                      convertToJson(props.row.comments)[0].content != null
                        ? 'var(--secondary)'
                        : 'white',
                    color:
                      convertToJson(props.row.comments).length !== 0 &&
                      convertToJson(props.row.comments)[0].content != null
                        ? 'white'
                        : 'black',
                  }"
                  @click="
                    () => {
                      openComs = true;
                      current_d = {
                        id_demande: props.row.id,
                        comments: convertToJson(props.row.comments),
                      };
                    }
                  "
                >
                  <q-tooltip
                    v-if="convertToJson(props.row.comments)[0].content != null"
                    v-for="(comment, index) in convertToJson(
                      props.row.comments
                    ).sort(
                      (a, b) =>
                        new Date(a.created).getTime() -
                        new Date(b.created).getTime()
                    )"
                    :key="comment.id"
                    :offset="[0, 40 * index + 10]"
                  >
                    <div class="text-body2">
                      {{ comment.content }}
                    </div>
                  </q-tooltip>
                </q-btn>
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <div class="w-full">
                <q-badge
                  :class="
                    props.value === '' || props.value == null
                      ? 'bg-[#fbfb26] text-black'
                      : 'bg-white text-secondary text-base '
                  "
                  :label="
                    props.value === '' || props.value == null
                      ? 'Non pris'
                      : props.value
                  "
                  class="w-full py-2 justify-center"
                />
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <div class="w-full">
                <q-btn
                  square
                  dense
                  icon="remove_red_eye"
                  class="mr-3"
                  @click="
                    showModalDetail = !showModalDetail;
                    selectedRows = props.row;
                  "
                />
                <q-btn
                  square
                  dense
                  icon="delete"
                  color="red"
                  class="mr-3"
                  @click="trashDemande(props.row.id)"
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
  </section-admin-container>
</template>
<script>
import { useDemandeStore } from "@/stores/demande";
import { useTypeStore } from "@/stores/type";
import { mapState } from "pinia";
import { mapActions } from "pinia";
import { socketStore } from "@/stores/socket";
import Swal from "sweetalert2";
export default {
  setup() {
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
        name: "nom_patient",
        field: "nom_patient",
        label: "Nom du patient",
        align: "center",
      },
      {
        name: "nom_medecin",
        field: "nom_medecin",
        label: "Nom du medecin",
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
        },
      },
      {
        field: "rdv",
        label: "Examen demandé avant le",
        align: "center",
        name: "rdv",
        sortable: true,
      },
      {
        field: "date_rdv",
        label: "Date de rendez-vous",
        align: "center",
        name: "date_rdv",
        format: (v, row) => {
          return v == null ? "" : formatDateToFrench(v);
        },
      },

      {
        name: "status",
        field: "lieu",
        label: "Lieu",
        align: "center",
      },
      {
        name: "created_at",
        field: "created_at",
        label: "Examen ajouté le",
        sortable: true,
        align: "center",
        format: (v, row) => {
          return formatDateToFrench(v);
        },
      },
      {
        name: "action",
        field: "action",
        label: "Action",
        align: "center",
      },
    ];
    const columnsDefault = [
      {
        name: "nom_patient",
        field: "nom_patient",
        label: "Nom du patient",
        align: "center",
      },
      {
        name: "nom_medecin",
        field: "nom_medecin",
        label: "Nom du medecin",
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
        },
      },
      {
        field: "rdv",
        label: "Examen demandé avant le",
        align: "center",
        name: "rdv",
        sortable: true,
      },
      {
        name: "comments",
        field: "comments",
        label: "Commentaire",
        align: "center",
      },

      {
        name: "status",
        field: "lieu",
        label: "Lieu",
        align: "center",
      },
      {
        name: "created_at",
        field: "created_at",
        label: "Examen ajouté le",
        sortable: true,
        align: "center",
        format: (v, row) => {
          return formatDateToFrench(v);
        },
      },
      {
        name: "action",
        field: "action",
        label: "Action",
        align: "center",
      },
    ];

    const showColumn = () => {
      const userDash = useCookie("user");

      return userDash.value["role"] == "radiologue" ||
        userDash.value["role"] == "secretaire"
        ? columns.filter((tem, index) => index != 1)
        : columns;
    };
    definePageMeta({
      layout: "admin",
      middleware: "admin",
    });

    return { columns, columnsDefault, formatDateToFrench, showColumn };
  },
  data() {
    return {
      user: useCookie("user").value,
      type: "",
      filter: "",
      showModalDetail: false,
      selectedRows: null,
      socket: socketStore(),
      filteredDemandes: [],
      filtertype: null,
      current_d: null,
      coms: "",
      openComs: false,
    };
  },
  async mounted() {
    await this.getallDemandes();
    await this.getAllTypes();
    this.showDemandeByStatus("attente");
  },
  created() {
    this.socket.on("get demande", async (data) => {
      await this.getallDemandes();
      this.showDemandeByStatus("attente");
    });
  },
  beforeDestroy() {
    this.socket.off("get demande", () => {});
  },
  methods: {
    ...mapActions(useDemandeStore, [
      "getallDemandes",
      "changeStatus",
      "deleteDemande",
      "addComments",
      "deleteComments",
    ]),
    ...mapActions(useTypeStore, ["getAllTypes"]),
    convertToJson(commentsJSON) {
      // Parse the JSON string into an array of objects
      const commentsArray = JSON.parse(commentsJSON);
      // Sort the comments array by date of creation

      // Return the sorted array
      return commentsArray;
    },
    toggleType(type) {
      this.type = type;
    },
    async addCommentaire(id_demande) {
      await this.addComments(id_demande, this.coms);
      const { error, msg } = this.message;
      if (!error) {
        await this.getallDemandes();
        this.showDemandeByStatus("attente");
        this.$toast.success(msg);
        this.openComs = false;
        this.coms = "";
      } else {
        this.$toast.error(msg);
      }
    },
    async deleteComs(id) {
      await this.deleteComments(id);
      const { error, msg } = this.message;
      if (!error) {
        await this.getallDemandes();
        this.showDemandeByStatus("attente");
        this.$toast.success(msg);
        this.openComs = false;
      } else {
        this.$toast.error(msg);
      }
    },
    async updatestatus(id, status) {
      await this.changeStatus(id, status);
      const { error, msg } = this.message;
      if (!error) {
        await this.getallDemandes();
        this.$toast.success(msg);
      } else {
        this.$toast.error(msg);
      }
    },
    async trashDemande(id) {
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
          await this.deleteDemande(id);
          const { error, msg } = this.message;
          if (error) {
            Swal.fire(
              "Erreur!",
              "Il y a un erreur lors de la suppression!",
              "error"
            );
          } else {
            Swal.fire(
              "Suppression!",
              "Demande supprimer avec succès",
              "success"
            );
          }
          await this.getallDemandes();
          this.showDemandeByStatus("attente");
        }
      });
    },
    customSort(rows, sortBy, descending) {
      const data = [...rows];
      if (sortBy) {
        data.sort((a, b) => {
          const x = descending ? b : a;
          const y = descending ? a : b;
          return (
            parseFloat(new Date(x[sortBy]).getTime()) -
            parseFloat(new Date(y[sortBy]).getTime())
          );
        });
      }
      return data;
    },
    showDemandeByStatus(status = "attente") {
      if (this.filtertype == "accepte") {
        this.filteredDemandes = this.allDemandes?.filter(
          (e) => e.lieu == null || e.lieu == ""
        );
        this.filtertype = null;
        return;
      }
      if (status === "attente") {
        this.filteredDemandes = this.allDemandes?.filter(
          (e) => e.lieu == null || e.lieu == ""
        );
      } else {
        this.filtertype = status;
        this.filteredDemandes = this.allDemandes?.filter(
          (e) => e.lieu != null && e.lieu != ""
        );
      }
    },
  },
  computed: {
    ...mapState(useDemandeStore, ["allDemandes", "message"]),
    ...mapState(useTypeStore, ["allTypes"]),

    getNameType() {
      return (id) => {
        const type = this.allTypes.filter((item) => item.id == id);
        return type?.[0]?.nom_type;
      };
    },
    badgeType() {
      return (type) => {
        return this.filteredDemandes?.filter((item) => item.nom_type == type)
          ?.length;
      };
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

  .border-doctor {
    border-bottom: 5px solid $secondary;
  }
}
</style>
