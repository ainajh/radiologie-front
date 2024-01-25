<template>
  <section-admin-container pageClass="dash-demande" title="Gestion des types">
    <!-- {{ allTypes }} -->
    <div class="bg-white shadow-sm rounded-lg">
      <div class="dash-demande__filter">
        <div class="pl-[50px]">
          <q-btn-group>
            <q-btn label="Tous" :class="type == '' ? 'active' : ''" @click="toggleType('')" />
            <q-btn v-for="(tp, i) in new Set(allTypes.map((a) => a.nom_type))" :key="i" :label="tp"
              :class="type == tp ? 'active' : ''" @click="toggleType(tp)">
              <q-badge :label="badgeType(tp)" floating color="red" />
            </q-btn>
          </q-btn-group>
        </div>
      </div>
      <div class="dash-demande__content p-5">
        <q-table class="w-full" flat :rows="allTypes.filter(t => type === '' ? t : t.nom_type == type)" :columns="columns"
          bordered row-key="name" :filter="filter" :hide-pagination="true" :rows-per-page-options="[0]">
          <template v-slot:top-left>
            <q-input dense outlined debounce="300" v-model="filter" placeholder="Search">
              <template v-slot:append>
                <q-icon name="search" />
              </template>
            </q-input>
          </template>
          <template v-slot:top-right>
            <q-btn color="secondary" icon="add" label="Ajouter" @click="showModal('add')" />
            <q-dialog v-model="prompt" persistent>
              <q-card style="min-width: 400px">
                <q-form @submit.prevent="submited">
                  <q-card-section>
                    <div class="text-body1">
                      NOM D'EXAMEN D'IMAGERIE MEDICAL
                    </div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-input dense outlined v-model="form.nom_type" autofocus @keyup.enter="prompt = false" lazy-rules
                      :rules="[required]" />
                  </q-card-section>
                  <q-card-section>
                    <div class="text-body1">NOM DU TYPE D'EXAMEN</div>
                  </q-card-section>

                  <q-card-section class="q-pt-none">
                    <q-input dense outlined v-model="form.nom_sous_type" autofocus @keyup.enter="prompt = false"
                      lazy-rules :rules="[required]" />
                  </q-card-section>

                  <q-card-actions align="right" class="text-primary">
                    <q-btn outline label="Annuler" v-close-popup color="white" class="text-black" />
                    <q-btn label="Valider" color="secondary" type="submit" :disabled="form.nom_type == '' || form.nom_sous_type == ''
                      " />
                  </q-card-actions>
                </q-form>
              </q-card>
            </q-dialog>
          </template>
          <template v-slot:body-cell-action="props">
            <q-td :props="props">
              <div class="w-full">
                <q-btn square dense icon="delete" class="mx-3" @click="deleteType(props.row.id)" />
                <q-btn square dense icon="edit" @click="showModal('update', props.row)" />
              </div>
            </q-td>
          </template>
          <template v-slot:no-data>
            <div class="full-width row flex-center text-secondary font-bold text-xl q-gutter-sm">
              <span>Il n'y a pas de données disponnible</span>
            </div>
          </template>
        </q-table>
      </div>
    </div>
  </section-admin-container>
</template>
<script>
import { useTypeStore } from "@/stores/type";
import { mapState } from "pinia";
import { mapActions } from "pinia";
import Swal from "sweetalert2";
export default {
  setup() {
    definePageMeta({
      layout: "admin",
      middleware: "admin",
    });
  },
  data() {
    return {
      prompt: false,
      type: "",
      filter: "",
      form: { nom_type: "", nom_sous_type: "" },
      columns: [
        {
          field: "id",
          label: "Numero",
          align: "center",
        },
        {
          field: "nom_type",
          label: "Nom examen d'imagerie Medical",
          align: "center",
        },
        {
          field: "nom_sous_type",
          label: "Nom du type d’examen",
          align: "center",
        },
        {
          name: "action",
          field: "action",
          label: "Action",
          align: "center",
        },
      ],
      action: "add",
    };
  },
  async mounted() {
    await this.getAllTypes();
  },
  methods: {
    ...mapActions(useTypeStore, [
      "getAllTypes",
      "createTypes",
      "deleteTypes",
      "updateTypes",
    ]),
    submited() {
      if (this.action == "add") {
        this.newType();
      } else {
        this.updateType();
      }
    },
    required(val) {
      return val !== "";
    },
    toggleType(type) {
      this.type = type;
    },

    async newType() {
      this.form = {
        nom_sous_type: this.form.nom_sous_type.toUpperCase(),
        nom_type: this.form.nom_type.toUpperCase(),
      };
      await this.createTypes(this.form);
      const { error, msg } = this.message;
      if (!error) {
        await this.getAllTypes();
        this.$toast.success(msg);
        this.prompt = false;
        this.form = { nom_type: "", nom_sous_type: "" };
      } else {
        this.$toast.error(msg);
      }
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
          this.deleteTypes(id);
          const { error, msg } = this.message;
          if (error) {
            Swal.fire(
              "Erreur!",
              msg,
              "error"
            );
          } else {
            Swal.fire("Suppression!", "Type supprimer avec succès", "success");
          }
          await this.getAllTypes();
        }
      });
    },

    showModal(type, data = null) {
      this.prompt = true;
      this.action = type;
      this.form = { nom_type: "", nom_sous_type: "" };
      if (data) {
        this.form = {
          id: data?.id,
          nom_type: data?.nom_type,
          nom_sous_type: data?.nom_sous_type,
        };
      }
    },
    async updateType() {
      await this.updateTypes(this.form);
      const { error, msg } = this.message;
      if (!error) {
        await this.getAllTypes();
        this.$toast.success(msg);
        this.prompt = false;
        this.form.nom = "";
      } else {
        this.$toast.error(msg);
      }
    },
  },
  computed: {
    ...mapState(useTypeStore, ["allTypes", "message"]),
    badgeType() {
      return (type) => {
        return this.allTypes.filter((item) => item.nom_type == type)?.length;
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
}
</style>
