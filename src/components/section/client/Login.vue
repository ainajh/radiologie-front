<template>
  <div class="flex flex-col items-center justify-center mt-4">
    <div class="w-full row wrap justify-center items-center p-5">
      <div class="col-md-5 col-lg-4 col-12">
        <h3 class="text-[20px] mx-4 font-bold" style="white-space: nowrap">
          Authentification du médecin
        </h3>
        <form @submit.prevent="submitForm" class="form-custom">
          <div class="mb-5">
            <label class="text-caption"> ADRESSE E-MAIL / NOM</label>
            <q-input
              class="mt-[5px]"
              outlined
              type="email"
              color="secondary"
              :dense="true"
              v-model="form.email"
              required
            />
          </div>
          <div class="mb-5">
            <label class="text-caption">MOT DE PASSE</label>
            <q-input
              class="mt-[5px]"
              outlined
              color="secondary"
              :type="showPass ? 'text' : 'password'"
              v-model="form.password"
              :dense="true"
              required
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
          <div>
            <q-checkbox
              v-model="checked"
              color="primary"
              label="Se souvenir de moi?"
            />
          </div>
          <div class="flex flex-col gap-2 items-center">
            <q-btn
              flat
              color="secondary"
              label="Mot de passe oublié"
              class="w-[200px]"
              to="/authentification/mot-de-passe-oublie"
            />
            <q-btn
              color="secondary"
              label="Validé"
              class="px-5 w-[200px]"
              :loading="isLoading"
              type="submit"
            />
            <q-btn
              color="secondary"
              flat
              label="S'inscrire"
              class="px-5 w-[200px]"
              to="/medecin/add"
            />
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { getCurrentInstance } from "vue";
const toast = getCurrentInstance().appContext.config.globalProperties.$toast;
const checked = useState("checked", () => false);
const showPass = useState("show", () => false);
const isLoading = useState("loginloading", () => false);
const { $api } = useNuxtApp();
const form = useState("form", () => ({
  email: "",
  password: "",
}));
const user = userStore();
async function submitForm(e) {
  e.preventDefault();
  isLoading.value = true;
  try {
    const res = await $api.post("/user/login/medecin", form.value);
    user.setConnected(res.data.user);
    localStorage.setItem("tokenmedecin", res.data.token);
    toast.success("Vous êtes connecté");
  } catch (error) {
    toast.error(error.response.data.error);
  } finally {
    isLoading.value = false;
  }
}
</script>
