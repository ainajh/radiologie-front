<template>
  <CardMedecin v-if="user.type === 'Médecin'" />
  <form class="md:p-4 bg-white">
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
        title="Quel examen d’imagerie médical recherchez-vous ? "
        icon="center_focus_strong"
        :done="formulaire.type_imagerie !== null"
      >
        <div class="flex-col flex">
          <div class="flex gap-3 flex-wrap">
            <div
              v-for="imagerie in listImagerie.list"
              :key="imagerie.id_imagerie"
            >
              <input
                type="radio"
                class="none"
                name="type_imagerie"
                :value="imagerie.name_imagerie"
                :id="imagerie.id_imagerie"
                v-model="formulaire.type_imagerie"
                :checked="formulaire.type_imagerie == imagerie.name_imagerie"
              />
              <label
                class="contour"
                :for="imagerie.id_imagerie"
                style="width: 100px"
                >{{ imagerie.name_imagerie }}</label
              >
            </div>
          </div>
          <q-stepper-navigation>
            <q-btn
              :disable="formulaire.type_imagerie === null"
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
        :done="formulaire.type_examen !== null"
      >
        <div class="flex-col flex">
          <div class="flex gap-3 flex-wrap">
            <div v-for="exam in listType.list" :key="exam.id_type_exam">
              <input
                type="radio"
                class="none"
                name="type_examen"
                :value="exam.name_exam"
                :id="exam.id_type_exam"
                v-model="formulaire.type_examen"
                :checked="formulaire.type_examen == exam.name_exam"
              />
              <label
                class="contour"
                :for="exam.id_type_exam"
                style="width: 100px"
                >{{ exam.name_exam }}</label
              >
            </div>
          </div>

          <q-stepper-navigation>
            <q-btn
              @click="step = 3"
              flat
              color="primary"
              label="Continuer"
              :disable="formulaire.type_examen === null"
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
        :done="formulaire.date_max !== null"
        class="flex flex-col"
      >
        <div class="flex-col flex">
          <q-checkbox
            right-label
            class="self-start"
            v-model="formulaire.urgent"
            label="Urgent"
            style="font-weight: bolder;"
            v-if="user.type === 'Médecin'"
          />
          <q-date
            v-model="formulaire.date_max"
            :options="(date) => validDay(date)"
            today-btn
            flat
          />
          <q-stepper-navigation>
            <q-btn
              :disable="formulaire.date_max === null"
              color="primary"
              label="Continuer"
              @click="step = 4"
              flat
            />
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
            formulaire.nom === null ||
            formulaire.prénom === null ||
            formulaire.date_naissance === null ||
            formulaire.tel === null ||
            formulaire.email === null
          )
        "
      >
        <div class="flex-col flex">
          <div class="min-w-[240px] flex flex-col gap-2">
            <q-input type="text" v-model="formulaire.nom" label="Nom :" />
            <q-input type="text" v-model="formulaire.prénom" label="Prénom :" />
            <q-input
              type="date"
              v-model="formulaire.date_naissance"
              label="Date de naissance :"
            />
            <q-input type="text" v-model="formulaire.tel" label="Téléphone :" />
            <q-input type="email" v-model="formulaire.email" label="Email :" />
          </div>
          <q-stepper-navigation>
            <q-btn
              color="primary"
              label="Continuer"
              :disable="
                formulaire.nom === null ||
                formulaire.prénom === null ||
                formulaire.date_naissance === null ||
                formulaire.tel === null ||
                formulaire.email === null
              "
              @click="step = 5"
              flat
            />
            <q-btn
              flat
              @click="step = 3"
              color="primary"
              label="Back"
              class="q-ml-sm"
            />
          </q-stepper-navigation>
        </div>
      </q-step>
      <q-step :name="5" title="Code de vérification par email" icon="pin">
        <div class="flex-col flex">
          <q-input
            type="number"
            v-model="code"
            outlined
            class="min-w-[240px]"
            label="Code :"
          />
          <q-stepper-navigation>
            <q-btn
              color="primary"
              label="Envoyer"
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

<script setup lang="ts">
import CardMedecin from "./card-medecin.vue";
const step = useState("step", () => 1);
const code = useState("code", () => null);
const user = userStore();
const listImagerie = imagerieStore();
const listType = typeExamStore();
const formulaire = formulaireStore();
function validDay(date: string) {
  return (
    date >=
      `${new Date().getFullYear().toString()}/${(
        new Date().getMonth() + 1
      ).toString()}/${new Date().getDate().toString()}` &&
    date <=
      `${new Date().getFullYear().toString()}/${(
        new Date().getMonth() + 2
      ).toString()}/${new Date().getDate().toString()}` &&
    new Date(date).getDay() !== 6 &&
    new Date(date).getDay() !== 0
  );
}
</script>
