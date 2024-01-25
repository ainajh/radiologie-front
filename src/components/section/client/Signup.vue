<template>
  <div class="flex flex-col items-center justify-center mt-4">
    <div class="w-full row wrap justify-center items-center p-5">
      <div class="col-md-5 col-lg-4 col-12">
        <h3 class="text-[20px] mx-4 font-bold" style="white-space: nowrap">
          Inscription du médecin
        </h3>
        <form @submit.prevent="submitForm" class="form-custom">
          <div class="mb-5">
            <label class="text-caption">NOM</label>
            <q-input
              class="mt-[5px]"
              outlined
              type="text"
              color="secondary"
              :dense="true"
              v-model="form.nom"
              required
            />
          </div>
          <div class="mb-5">
            <label class="text-caption">TELEPHONE</label>
            <q-input
              class="mt-[5px]"
              outlined
              type="text"
              color="secondary"
              :dense="true"
              v-model="form.tel"
              required
            />
          </div>
          <div class="mb-5">
            <label class="text-caption">ADRESSE</label>
            <q-input
              class="mt-[5px]"
              outlined
              type="text"
              color="secondary"
              :dense="true"
              v-model="form.adresse"
              required
            />
          </div>
          <div class="mb-5">
            <label class="text-caption">ADRESSE E-MAIL</label>
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
              type="password"
              color="secondary"
              :dense="true"
              v-model="form.password"
              required
            />
          </div>
          <div class="mb-5">
            <label class="text-caption">RÉÉCRIRE LE MOT DE PASSE</label>
            <q-input
              class="mt-[5px]"
              outlined
              type="password"
              color="secondary"
              :dense="true"
              v-model="form.repassword"
              required
            />
          </div>
          <div class="mb-5">
            <label class="text-caption">N° RPPS</label>
            <q-input
              class="mt-[5px]"
              outlined
              type="number"
              color="secondary"
              :dense="true"
              v-model="form.rpps"
              required
            />
          </div>
          <div class="flex flex-col gap-2 items-center">
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
              label="Se connecter"
              class="px-5 w-[200px]"
              to="/medecin"
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
const isLoading = useState("loading", () => false);
const user = userStore();
const form = useState("form", () => ({
  nom: "",
  adresse: "",
  tel: "",
  email: "",
  password: "",
  repassword: "",
  rpps: "",
}));
async function submitForm(e) {
  e.preventDefault();
  if (form.value.password !== form.value.repassword) {
    console.log("Hola");
    toast.error("Les mots de passe ne sont pas identiques");
    return;
  }
  const formKeys = Object.keys(form.value);
  for (let key in formKeys) {
    if (form.value[key] === "") {
      toast.error("Veuillez remplir tous les champs");
      return;
    }
  }
  isLoading.value = true;
  const { error, msg } = await user.create(form.value);
  if (!error) {
    toast.success(msg);
    form.value.nom = "";
    form.value.adresse = "";
    form.value.tel = "";
    form.value.email = "";
    form.value.password = "";
    form.value.repassword = "";
    form.value.rpps = "";
  } else {
    toast.error(msg);
  }
  isLoading.value = false;
}
</script>
