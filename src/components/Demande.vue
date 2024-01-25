<template>
  <form class="md:p-4 bg-white mt-2" @submit="submitDemande">
    <q-stepper
      v-model="step"
      vertical
      color="primary"
      class="flex justify-center w-full pt-0"
      flat
      animated
    >
      <q-step
        :name="1"
        title="Quel examen d’imagerie médical recherchez-vous ?"
        icon="center_focus_strong"
        :done="form.type !== null"
      >
        <div class="flex-col flex">
          <div class="flex gap-3 flex-wrap">
            <div
              v-for="(imagerie, i) in new Set(
                types.allTypes.map((a) => a.nom_type)
              )"
              :key="i"
            >
              <input
                type="radio"
                class="none"
                name="id_type"
                :value="imagerie"
                :id="imagerie"
                v-model="form.type"
                :checked="form.type == imagerie"
              />
              <label class="contour" :for="imagerie">{{ imagerie }}</label>
            </div>
          </div>
          <q-stepper-navigation>
            <q-btn
              :disable="form.type === null"
              @click="step = 2"
              flat
              color="primary"
              label="Continuer"
            />
          </q-stepper-navigation>
        </div>
      </q-step>

      <q-step
        :name="2"
        title="Quel type d’examen ?"
        icon="sensor_occupied"
        :done="form.sous_type !== null"
      >
        <div class="flex-col flex">
          <div class="flex gap-3 flex-wrap">
            <div
              v-for="(exam, i) in types.allTypes
                .filter((t) => t.nom_type === form.type)
                .map((i) => i.nom_sous_type)"
              :key="i"
            >
              <input
                type="radio"
                class="none"
                name="id_sous_type"
                :value="exam"
                :id="exam"
                v-model="form.sous_type"
                :checked="form.sous_type == exam"
              />
              <label class="contour" :for="exam">{{ exam }}</label>
            </div>
          </div>
          <q-stepper-navigation>
            <q-btn
              @click="step = 3"
              flat
              color="primary"
              label="Continuer"
              :disable="form.sous_type === null"
            />
            <q-btn
              flat
              @click="step = 1"
              color="primary"
              label="Retour"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </div>
      </q-step>
      <q-step
        :name="3"
        title="Sélectionner la date maximale souhaitée"
        icon="event"
        :done="form.rdv !== null || form.urgent"
        class="flex flex-col"
      >
        <div class="flex-col flex">
          <q-checkbox
            right-label
            class="self-start"
            label="Urgent"
            :model-value="form.urgent"
            @update:model-value="(value, e) => getValue(value)"
            style="font-weight: bolder"
            v-if="user.role === 'medecin'"
          />
          <q-date
            v-model="form.rdv"
            :options="validDay()"
            today-btn
            flat
            :locale="{
              daysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
              months: [
                'Janvier',
                'Février',
                'Mars',
                'Avril',
                'Mai',
                'Juin',
                'Juillet',
                'Août',
                'Septembre',
                'Octobre',
                'Novembre',
                'Décembre',
              ],
            }"
            v-if="form.urgent === false"
          />
          <q-stepper-navigation>
            <q-btn color="primary" label="Continuer" @click="step = 4" flat />
            <q-btn
              flat
              @click="step = 2"
              color="primary"
              label="Retour"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </div>
      </q-step>
      <q-step
        :name="4"
        title="Veuillez remplir ce formulaire"
        icon="contact_mail"
        :done="
          !(
            form.nom === null ||
            form.prenom === null ||
            form.datenais === null ||
            form.tel === null ||
            form.email === null
          )
        "
      >
        <div class="flex-col flex">
          <div class="min-w-[240px] flex flex-col gap-2">
            <q-input
              type="text"
              v-model="form.nom"
              label="Nom du patient :"
              lazy-rules
              :rules="[required]"
            />
            <q-input
              type="text"
              v-model="form.prenom"
              label="Prénom du patient :"
              lazy-rules
              :rules="[required]"
            />
            <q-input
              type="date"
              v-model="form.datenais"
              label="Date de naissance :"
              lazy-rules
              :rules="[required]"
            />
            <q-input
              type="text"
              v-model="form.tel"
              label="Téléphone du patient :"
              lazy-rules
              :rules="[required]"
            />
            <q-input
              type="email"
              v-model="form.email"
              label="Email du patient :"
              lazy-rules
              :rules="user.role ? [] : [required]"
            />
            <q-file
              v-model="form.ordonnance"
              label="Ordonnance du patient"
              accept="image/*,.pdf"
            >
              <template v-slot:prepend>
                <q-icon name="attach_file" />
              </template>
            </q-file>
          </div>
          <q-stepper-navigation>
            <q-btn
              color="primary"
              :label="user.role !== 'medecin' ? 'Continuer' : 'Envoyer'"
              :disable="
                form.nom_patient === null ||
                form.prenom === null ||
                form.datenais === null ||
                form.tel === null
              "
              type="submit"
              :loading="btnLoading"
              flat
            />
            <q-btn
              flat
              @click="step = 3"
              color="primary"
              label="Retour"
              class="q-ml-sm"
              type="button"
            />
          </q-stepper-navigation>
        </div>
      </q-step>
      <q-step
        :name="5"
        title="Code de vérification par email"
        icon="pin"
        v-if="user.role !== 'medecin'"
      >
        <div class="flex-col flex">
          <q-input
            type="number"
            v-model="form.code"
            outlined
            class="min-w-[240px]"
            label="Code :"
            lazy-rules
            :rules="[required]"
          />
          <q-stepper-navigation>
            <q-btn
              color="primary"
              label="Envoyer"
              :loading="btnLoading"
              type="button"
              @click="createDemande"
              icon="send"
              flat
              style="background-color: rgba(46, 155, 79, 0.1)"
            />
            <q-btn
              flat
              @click="step = 4"
              color="primary"
              label="Retour"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </div>
      </q-step>
    </q-stepper>
  </form>
</template>

<script setup>
import { onMounted, getCurrentInstance } from "vue";
import { addDays, differenceInDays, format } from "date-fns";
const step = useState("step", () => 1);
const user = userStore();
const btnLoading = useState("btnLoading", () => false);
const types = useTypeStore();
const demandestore = useDemandeStore();
const toast = getCurrentInstance().appContext.config.globalProperties.$toast;
const form = useState("formulaire", () => ({
  nom: null,
  email: null,
  datenais: null,
  tel: null,
  type: null,
  sous_type: null,
  rdv: null,
  urgent: false,
  prenom: null,
  id_medecin: null,
  code: null,
  ordonnance: null,
}));
const required = (val) => val !== null && val !== "";
function validDay() {
  const start = new Date();
  const end = new Date(
    start.getFullYear(),
    start.getMonth() + 1,
    start.getDate()
  );
  const disableDate = [];
  for (let i = 0; i <= differenceInDays(end, start); i++) {
    disableDate.push(format(addDays(start, i), "yyyy/MM/dd"));
  }
  return disableDate;
}
function getValue(v) {
  form.value.urgent = v;
  form.value.rdv = null;
}
const socket = socketStore();
const submitDemande = async (e) => {
  e.preventDefault();
  btnLoading.value = true;
  if (user.role !== "medecin") {
    // step.value = 5;
    await demandestore.sendCode(form.value.email);
    const { error, msg } = demandestore.message;
    if (!error) {
      //show message when i received msg
      toast.success(msg);
      step.value = 5;
    } else {
      toast.error(msg);
    }
  } else {
    const formData = new FormData();
    const types = useTypeStore();
    let nomFrmt = form.value.nom.toUpperCase();
    let prenomFrmt = form.value.prenom.replace(/\b\w/g, function (char) {
      return char.toUpperCase();
    });

    let fullName = nomFrmt + " " + prenomFrmt;
    const nom = formData.append("nom_patient", fullName);
    formData.append("email", form.value.email);
    formData.append("datenais", form.value.datenais);
    formData.append("tel", form.value.tel);
    formData.append(
      "id_type",
      types.allTypes.find(
        (type) =>
          type.nom_type === form.value.type &&
          type.nom_sous_type === form.value.sous_type
      )?.id
    );
    formData.append("sous_type", form.value.sous_type);
    formData.append("rdv", form.value.rdv);
    formData.append("urgent", form.value.urgent);
    formData.append("prenom", form.value.prenom);
    formData.append("id_medecin", user.id);
    formData.append("code", form.value.code);
    formData.append("ordonnance", form.value.ordonnance);
    await demandestore.addDemande(formData);
    const { error, msg } = demandestore.message;
    if (!error) {
      socket.emit("get demande");
      form.value = {
        nom: null,
        email: null,
        datenais: null,
        tel: null,
        type: null,
        sous_type: null,
        rdv: null,
        urgent: false,
        prenom: null,
        id_medecin: null,
        code: null,
        ordonnance: null,
      };
      toast.success(msg);
      step.value = 1;
    } else {
      toast.error(msg);
    }
  }
  btnLoading.value = false;
};

const createDemande = async () => {
  btnLoading.value = true;
  const formData = new FormData();
  const types = useTypeStore();
  let nomFrmt = form.value.nom.toUpperCase();
  let prenomFrmt = form.value.prenom.replace(/\b\w/g, function (char) {
    return char.toUpperCase();
  });

  let fullName = nomFrmt + " " + prenomFrmt;
  const nom = formData.append("nom_patient", fullName);
  formData.append("email", form.value.email);
  formData.append("datenais", form.value.datenais);
  formData.append("tel", form.value.tel);
  formData.append(
    "id_type",
    types.allTypes.find(
      (type) =>
        type.nom_type === form.value.type &&
        type.nom_sous_type === form.value.sous_type
    )?.id
  );
  formData.append("sous_type", form.value.sous_type);
  formData.append("rdv", form.value.rdv);
  formData.append("urgent", form.value.urgent);
  formData.append("prenom", form.value.prenom);
  formData.append("id_medecin", user.role === "medecin" ? user.id : null);
  formData.append("code", form.value.code);

  formData.append("ordonnance", form.value.ordonnance);
  await demandestore.addDemande(formData);
  const { error, msg } = demandestore.message;
  if (!error) {
    socket.emit("get demande");
    toast.success(msg);
    step.value = 1;
    form.value = {
      nom: null,
      email: null,
      datenais: null,
      tel: null,
      type: null,
      sous_type: null,
      rdv: null,
      urgent: false,
      prenom: null,
      id_medecin: null,
      code: null,
      ordonnance: null,
    };
  } else {
    toast.error(msg);
  }
  btnLoading.value = false;
};
const getAllTypes = async () => {
  await types.getAllTypes();
};

onMounted(async () => {
  await getAllTypes();
});
</script>
