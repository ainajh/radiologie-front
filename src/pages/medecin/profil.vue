<template>
  <div class="flex flex-col items-center justify-center mt-4">
    <div class="w-full row wrap justify-center items-center p-5">
      <div class="col-md-5 col-lg-4 col-12">
        <h3
          class="text-[20px] text-center mx-4 font-bold"
          style="white-space: nowrap"
        >
          Information du médecin
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

<script setup lang="ts">
definePageMeta({
  layout: "client",
});
const user = userStore();
import { getCurrentInstance } from "vue";
const toast = getCurrentInstance()?.appContext.config.globalProperties.$toast;
const isLoading = useState("loading", () => false);
const form: Ref<{ [key: string]: string | number | null }> = useState(
  "form",
  () => ({
    nom: "",
    adresse: "",
    tel: "",
    email: "",
    rpps: 0,
  })
);
form.value = {
  nom: user.$state.nom,
  adresse: user.$state.adresse,
  tel: user.$state.tel,
  email: user.$state.email,
  rpps: user.$state.rpps,
};
async function submitForm(e: Event) {
  e.preventDefault();
  if (form.value.password !== form.value.repassword) {
    console.log("Hola");
    toast?.error("Les mots de passe ne sont pas identiques");
    return;
  }
  const formKeys = Object.keys(form.value);
  for (let key in formKeys) {
    if (form.value[key] === "") {
      toast?.error("Veuillez remplir tous les champs");
      return;
    }
  }
  isLoading.value = true;
  const { error, msg } = await user.update({
    ...form.value,
    role: user.$state.role,
    id: user.$state.id,
  });
  if (!error) {
    toast?.success(msg);
  } else {
    toast?.error(msg);
  }
  isLoading.value = false;
}
const router = useRouter();
onBeforeMount(() => {
  if (user.$state.role !== "medecin") {
    router.push("/medecin");
  }
});
</script>
