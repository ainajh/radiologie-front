<template>
  <q-form @submit.prevent="submited()" class="py-3">
    <!-- nom  -->
    <q-card-section class="q-pt-none">
      <q-input dense outlined autofocus label="Nom" v-model="form.nom" lazy-rules :rules="[required]" />
    </q-card-section>
    <!-- nom -->

    <!-- prénom  -->
    <!-- <q-card-section class="q-pt-none">
      <q-input dense outlined autofocus label="Prénom" />
    </q-card-section> -->
    <!-- prénom -->

    <!-- Téléphone  -->
    <q-card-section class="q-pt-none">
      <q-input dense outlined autofocus label="Téléphone" v-model="form.tel" lazy-rules :rules="[required]" />
    </q-card-section>
    <!-- Téléphone -->
    <!-- Adresse  -->
    <q-card-section class="q-pt-none">
      <q-input dense outlined autofocus label="Adresse" v-model="form.adresse" lazy-rules :rules="[required]" />
    </q-card-section>
    <!-- Adresse -->
    <!-- Adresse  -->
    <q-card-section class="q-pt-none">
      <q-input dense outlined autofocus label="Numero RPPS" v-model="form.rpps" lazy-rules :rules="[required]" />
    </q-card-section>
    <!-- Adresse -->

    <!-- Role -->
    <q-card-section class="q-pt-none">
      <q-select :options="roleDatas" label="Rôle" dense outlined autofocus v-model="form.role" option-label="label"
        option-value="id" lazy-rules :rules="[required]" />
    </q-card-section>
    <!-- Role-->

    <!-- Addresse Email  -->
    <q-card-section class="q-pt-none">
      <q-input dense outlined autofocus label="Addresse Email" v-model="form.email" lazy-rules :rules="[required]" />
    </q-card-section>
    <!-- Addresse Email -->

    <q-card-actions align="right" class="text-primary">
      <q-btn outline label="Annuler" v-close-popup color="white" class="text-black" />
      <q-btn :label="!datas?.is_verified ? 'Validé' : 'Ne Pas Validé'" :color="!datas?.is_verified ? 'green' : 'red'"
        type="button" @click="validMedecin" v-if="datas?.role == 'medecin' && !datas?.is_verified" />
      <q-btn :label="action == 'add' ? 'Créer' : 'Modifier'" color="secondary" type="submit" :loading="loading" />
    </q-card-actions>
  </q-form>
</template>
<script>
import { useUtilisateurStore } from "@/stores/utilisateurs";
import { mapState } from "pinia";
import { mapActions } from "pinia";
export default {
  props: ["modelValue", "datas", "action"],
  emits: ["update:modelValue"],
  data() {
    return {
      form: {
        nom: "",
        tel: "",
        email: "",
        adresse: "",
        password: "",
        rpps: "",
        role: "",
      },
      is_verified: null,
      loading: false,
      roleDatas: [
        { label: "Administrateur", id: "admin" },
        { label: "Radiologue", id: "radiologue" },
        { label: "Secrétaire/Manip", id: "secretaire" },
        { label: "Médecin", id: "medecin" },
      ],
    };
  },
  mounted() {
    if (this.action == "update") {
      this.form = { ...this.datas };
    }
  },
  methods: {
    ...mapActions(useUtilisateurStore, [
      "getAllUsers",
      "createUser",
      "updateUser",
      "validateDoctor",
    ]),
    required(val) {
      return val !== "";
    },
    async submited() {
      this.loading = true;
      if (this.action === "add") {
        await this.handleNewUser();
        this.loading = false;
        return;
      } else if (this.action === "update") {
        await this.handleUpdateUser();
        this.loading = false;
        return;
      }
    },
    async handleNewUser() {
      this.form.role = this.form?.role?.id;
      await this.createUser(this.form);
      this.isSuccess();
    },
    async handleUpdateUser() {
      const data = { ...this.form, role: this.form.role.id ?? this.form.role };
      await this.updateUser(data);
      this.isSuccess();
    },
    async isSuccess() {
      const { error, msg } = this.message;
      if (!error) {
        await this.getAllUsers();
        this.$toast.success(msg);
        this.form = {
          nom: "",
          tel: "",
          email: "",
          adresse: "",
          password: "",
          rpps: "",
          role: "",
        };
        this.$emit("update:modelValue", false);
      } else {
        this.$toast.error(msg);
      }
    },
    async validMedecin() {
      await this.validateDoctor(this.datas?.id);
      this.isSuccess();
    },
  },
  computed: {
    ...mapState(useUtilisateurStore, ["allUsers", "message"]),
  },
};
</script>
