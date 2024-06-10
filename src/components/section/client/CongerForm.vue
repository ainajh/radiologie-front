<template>
  <q-form @submit.prevent="submited()" class="py-3">
    <h2 class="text-center text-xl py-2 font-bold">Prendre un congé</h2>
    <div class="mb-2 ml-2">
      <div class="q-gutter-sm">
        <q-radio v-model="form.periode" val="journe" label="Une journée" />
        <q-radio v-model="form.periode" val="periodique" label="Périodique" />
      </div>
    </div>
    <!-- Date de debut  -->
    <q-card-section class="q-pt-none">
      <q-input
        dense
        outlined
        autofocus
        type="date"
        label="Date de debut"
        v-model="form.dateStart"
        lazy-rules
        :rules="[required]"
      />
    </q-card-section>
    <!-- Date de debut -->
    <!-- Date de fin  -->
    <q-card-section class="q-pt-none" v-if="form.periode == 'periodique'">
      <q-input
        dense
        outlined
        autofocus
        type="date"
        label="Date de fin"
        v-model="form.dateEnd"
        lazy-rules
        :rules="[required]"
      />
    </q-card-section>
    <!-- Date de fin -->
    <!-- Type  -->
    <q-card-section class="q-pt-none" v-if="me.role == 'admin'">
      <q-select
        v-model="form.idPerson"
        :options="allUsers.filter((item) => item.role === 'radiologue')"
        label="Nom du radiologue"
        emit-value
        map-options
        option-value="id"
        option-label="nom"
        dense
        outlined
        autofocus
        lazy-rules
        :rules="[required]"
        behavior="dialog"
      />
    </q-card-section>
    <q-card-section class="q-pt-none">
      <q-input
        dense
        outlined
        autofocus
        label="Type"
        v-model="form.typeOfLeave"
        lazy-rules
        :rules="[required]"
      />
    </q-card-section>
    <!-- Type -->

    <q-card-actions align="right" class="text-primary">
      <q-btn
        outline
        label="Annuler"
        v-close-popup
        color="white"
        class="text-black"
      />
      <q-btn
        :label="action == 'add' ? 'Créer' : 'Modifier'"
        color="secondary"
        type="submit"
        :loading="loading"
      />
    </q-card-actions>
  </q-form>
</template>
<script>
import { useLeaveStore } from "@/stores/leave";
import { mapState } from "pinia";
import { mapActions } from "pinia";
import { useUtilisateurStore } from "@/stores/utilisateurs";
export default {
  props: ["modelValue", "datas", "action"],
  emits: ["update:modelValue"],
  setup() {
    const user = userStore();
    const me = useCookie("user");
    return { user, me };
  },
  data() {
    return {
      form: {
        periode: "journe",
        idPerson: null,
        typeOfLeave: null,
        dateStart: null,
        dateEnd: null,
      },
      is_verified: null,
      loading: false,
    };
  },
  mounted() {
    if (this.action == "update") {
      this.form = {
        ...this.datas,
        dateStart: this.formateDate(this.datas?.dateStart),
        dateEnd: this.formateDate(this.datas?.dateEnd),
      };
    }
  },
  methods: {
    ...mapActions(useLeaveStore, ["getAllLeave", "createLeave", "updateLeave"]),
    required(val) {
      return val !== null;
    },

    formateDate(dateS) {
      const date = new Date(dateS);

      const year = date.getFullYear();
      const month = (date.getMonth() + 1).toString().padStart(2, "0");
      const day = date.getDate().toString().padStart(2, "0");

      return `${year}-${month}-${day}`;
    },
    async submited() {
      this.loading = true;

      if (this.form.periode == "journe") {
        this.form.dateEnd = this.form.dateStart;
      }

      if (this.me.role != "admin") {
        this.form.idPerson = this.me?.id;
      }
      if (this.action === "add") {
        await this.handleNewLeave();
        this.loading = false;
        return;
      } else if (this.action === "update") {
        await this.handleupdateLeave();
        this.loading = false;
        return;
      }
    },
    async handleNewLeave() {
      await this.createLeave(this.form);
      this.isSuccess();
    },
    async handleupdateLeave() {
      const data = { ...this.form };
      await this.updateLeave(data);
      this.isSuccess();
    },
    async isSuccess() {
      const { error, msg } = this.message;
      if (!error) {
        await this.getAllLeave(this.me.role != "admin" ? this.me?.id : "");
        this.$toast.success(msg);
        this.form = {
          idPerson: null,
          typeOfLeave: null,
          dateStart: null,
          dateEnd: null,
        };
        this.$emit("update:modelValue", false);
      } else {
        this.$toast.error(msg);
      }
    },
  },
  computed: {
    ...mapState(useLeaveStore, ["allLeave", "message"]),
    ...mapState(useUtilisateurStore, ["allUsers"]),
  },
};
</script>
