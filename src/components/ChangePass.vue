<template>
  <div class="flex flex-col items-center justify-center mt-4">
    <div class="w-full row wrap justify-center items-center p-5">
      <div class="col-md-5 col-lg-4 col-12 bg-white pt-5">
        <h3
          class="text-xl mx-4 font-bold text-center"
          style="white-space: nowrap"
        >
          Modification du mot de passe
        </h3>
        <form @submit.prevent="submitForm" class="form-custom">
          <div class="mb-5">
            <label class="text-caption">MOT DE PASSE</label>
            <q-input
              class="mt-[5px]"
              outlined
              color="secondary"
              :dense="true"
              v-model="form.newPassword"
              :type="showPass ? 'text' : 'password'"
              required
            >
              <template v-slot:append>
                <q-icon
                  :name="showPass ? 'remove_red_eye' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="showPass = !showPass"
                /> </template
            ></q-input>
          </div>
          <div class="mb-5">
            <label class="text-caption">RÉÉCRIRE LE MOT DE PASSE</label>
            <q-input
              class="mt-[5px]"
              outlined
              :type="showPasstwo ? 'text' : 'password'"
              color="secondary"
              :dense="true"
              v-model="form.repassword"
              required
              ><template v-slot:append>
                <q-icon
                  :name="showPasstwo ? 'remove_red_eye' : 'visibility_off'"
                  class="cursor-pointer"
                  @click="showPasstwo = !showPasstwo"
                /> </template
            ></q-input>
          </div>
          <div class="flex flex-col gap-2 items-center">
            <q-btn
              color="secondary"
              label="Modifier"
              class="px-5 w-[200px]"
              :loading="isLoading"
              type="submit"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { useAuthStore } from "@/stores/auth";
import { mapState } from "pinia";
import { mapActions } from "pinia";
export default {
  data() {
    return {
      form: {
        newPassword: "",
        repassword: "",
      },
      isLoading: false,
      showPass: false,
      showPasstwo: false,
    };
  },
  methods: {
    ...mapActions(useAuthStore, ["changePass"]),
    async submitForm() {
      this.isLoading = true;
      const path = this.$route.path;
      if (this.form.newPassword !== this.form.repassword) {
        this.$toast.error("Les mots de passe ne sont pas identiques");
        this.isLoading = false;
        return;
      }
      this.changePass(
        this.$route.params.id,
        this.form,
        path.includes("dashboard") ? "admin" : "moi"
      );
      const { error, msg } = this.message;
      if (!error) {
        this.$toast.success(
          msg ? msg : "Modification de mot de passe avec succès"
        );

        if (path.includes("dashboard")) {
          this.$router.push("/dashboard/utilisateur");
        } else {
          this.$router.push("/medecin/profil");
        }
      } else {
        this.$toast.error(msg);
      }

      this.isLoading = false;
    },
  },
  computed: {
    ...mapState(useAuthStore, ["message"]),
  },
};
</script>
