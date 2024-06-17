<template>
  <section-admin-container
    pageClass="dash-demande"
    title="Gestion des Utilisateurs"
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
              v-for="(tp, i) in new Set(allUsers.map((a) => a.role))"
              :key="i"
              :label="
                tp == 'medecin'
                  ? 'Médecin Correspondant'
                  : tp == 'admin'
                  ? 'Admin'
                  : tp == 'radiologue'
                  ? 'Radiologue'
                  : tp == 'secretaire'
                  ? 'Secrétaire/Manip'
                  : tp
              "
              :class="type == tp ? 'active' : ''"
              @click="toggleType(tp)"
            >
              <q-badge :label="badgeType(tp)" floating color="red" />
            </q-btn>
          </q-btn-group>
        </div>
      </div>
      <div class="dash-demande__content p-5">
        <q-table
          class="w-full"
          flat
          :rows="allUsers.filter((u) => (type === '' ? u : u.role == type))"
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
          <template v-slot:body-cell-role="props">
            <q-td :props="props">
              <div class="w-full">
                <q-badge
                  :label="
                    props.value == 'secretaire'
                      ? 'secrétaire/manip'
                      : props.value
                  "
                  class="w-full p-2 justify-center capitalize"
                  :class="{
                    'bg-secondary': props.value === 'admin',
                    'bg-blue': props.value === 'medecin',
                    'bg-pink': props.value === 'radiologue',
                  }"
                />
              </div>
            </q-td>
          </template>
          <template v-slot:body-cell-is_verified="props">
            <q-td :props="props">
              <div class="w-full">
                <q-btn
                  square
                  dense
                  class="text-white"
                  :class="props.value ? 'bg-green ' : 'bg-red'"
                  :icon="props.value ? 'check' : 'close'"
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
                <q-btn
                  square
                  dense
                  icon="key"
                  :to="`/dashboard/modification-mot-de-passe/${props.row.id}`"
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
        <section-admin-user-form
          v-model="prompt"
          @input="emitUpdate"
          :action="action"
          :datas="datas"
        ></section-admin-user-form
      ></q-card>
    </q-dialog>
  </section-admin-container>
</template>
<script>
import { useUtilisateurStore } from "@/stores/utilisateurs";
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
      filter: "",
      form: { name: "" },
      type: "",

      columns: [
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
          field: "tel",
          name: "phone",
          label: "Téléphone",
          align: "center",
        },
        {
          field: "adresse",
          label: "Adresse",
          align: "center",
        },

        {
          field: "email",
          label: "Email",
          align: "center",
        },
        {
          field: "rpps",
          label: "RPPS",
          align: "center",
        },
        {
          field: "role",
          name: "role",
          label: "Role",
          align: "center",
        },
        {
          field: "is_verified",
          name: "is_verified",
          label: "Validé",
          align: "center",
        },
        {
          name: "action",
          field: "action",
          label: "Action",
          align: "center",
        },
      ],
      action: null,
      datas: null,
    };
  },
  async mounted() {
    await this.getAllUsers();
  },
  computed: {
    ...mapState(useUtilisateurStore, ["allUsers", "message"]),
    badgeType() {
      return (type) => {
        return this.allUsers.filter((item) => item.role == type)?.length;
      };
    },
  },
  methods: {
    ...mapActions(useUtilisateurStore, ["getAllUsers", "deleteUser"]),
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
          this.deleteUser(id);
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
          await this.getAllUsers();
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
