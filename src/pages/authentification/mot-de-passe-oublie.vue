<template>
  <div class="pg-login row wrap justify-center items-center p-5">
    <div class="pg-login__form col-12 col-md-6 p-5 py-[20px]">
      <form @submit.prevent="submitForm">
        <h1 class="text-h5 font-bold text-secondary text-center">
          Réinitialisation de mot de passe
        </h1>
        <div class="text-justify py-5">
          <p>
            Bienvenue sur la page de réinitialisation de mot de passe. Si vous
            avez oublié votre mot de passe ou si vous souhaitez en définir un
            nouveau, vous êtes au bon endroit.
          </p>
          <p>
            <strong>
              Entrez votre adresse email ci-dessous et nous vous enverrons un
              nouveau mot de passe à cette adresse.</strong
            >
            Veuillez vérifier votre boîte de réception, y compris le dossier des
            courriers indésirables, pour trouver le nouveau mot de passe.
          </p>
          <p>
            Une fois reçu, connectez-vous à votre compte en utilisant ce nouveau
            mot de passe. Nous vous recommandons de le changer dès que possible
            pour des raisons de sécurité.
          </p>
        </div>
        <div class="mb-5 text-center">
          <label class="text-caption">
            Veuillez saisir ici votre adresse email</label
          >
          <q-input
            class="mt-[5px]"
            outlined
            color="secondary"
            dense="dense"
            v-model="form.email"
          />
        </div>

        <div>
          <q-btn
            color="secondary"
            label="Réinitialiser mon mot de passe"
            class="px-5 w-full"
            :loading="isLoading"
            type="submit"
            :disabled="form.email == ''"
          />
        </div>
      </form>
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
      isLoading: false,
      form: {
        email: "",
      },
    };
  },
  methods: {
    ...mapActions(useAuthStore, ["forgotPass"]),
    async submitForm() {
      this.isLoading = true;
      await this.forgotPass(this.form);
      const { error, msg } = this.message;
      if (!error) {
        this.form.email = "";
        this.$toast.success(msg);
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
