<template>
  <div class="pg-login row wrap justify-center items-center p-5">
    <div class="pg-login__form col-12 col-md-4 p-5 py-[50px]">
      <form @submit.prevent="submitForm">
        <div class="mb-5">
          <label class="text-caption"> ADRESSE E-MAIL / NOM</label>
          <q-input
            class="mt-[5px]"
            outlined
            color="secondary"
            dense="dense"
            v-model="form.email"
          />
        </div>
        <div class="mb-5">
          <label class="text-caption"> MOT DE PASSE</label>
          <q-input
            class="mt-[5px]"
            outlined
            color="secondary"
            :type="showPass ? 'text' : 'password'"
            v-model="form.password"
            dense="dense"
          >
            <template v-slot:append>
              <q-icon
                :name="showPass ? 'remove_red_eye' : 'visibility_off'"
                class="cursor-pointer"
                @click="showPass = !showPass"
              />
            </template>
          </q-input>
        </div>
        <div class="mb-5">
          <label class="text-caption">Rôle</label>
          <q-select
            :options="['admin', 'radiologue', 'secretaire']"
            label="Rôle"
            dense
            outlined
            autofocus
            v-model="form.role"
          />
        </div>
        <div class="mb-5">
          <q-checkbox
            v-model="checked"
            color="secondary"
            label="Se souvenir de moi?"
          />
        </div>
        <div class="row justify-end">
          <q-btn
            color="secondary"
            label="Se connecter"
            class="px-5"
            :loading="loading"
            type="submit"
            :disable="disableBtn"
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
  setup() {
    definePageMeta({
      middleware: "admin",
    });
  },
  data() {
    return {
      checked: false,
      showPass: false,
      isLoading: false,
      form: {
        email: "",
        password: "",
        role: "admin",
      },
      disableBtn: false,
    };
  },
  methods: {
    ...mapActions(useAuthStore, ["login"]),
    async submitForm() {
      await this.login(this.form.role, this.form);
      const { error, msg } = this.message;
      if (!error) {
        this.$toast.success(msg);
        if (this.authenticated) {
          this.$router.push("/dashboard");
        }
      } else {
        this.$toast.error(msg);
      }
    },
  },
  computed: {
    ...mapState(useAuthStore, ["message", "authenticated", "loading"]),
  },
  watch: {
    form: {
      handler(val) {
        const { email, password, role } = this.form;
        if (email && password && role) {
          this.disableBtn = false;
        } else {
          this.disableBtn = true;
        }
      },
      deep: true,
    },
  },
};
</script>
