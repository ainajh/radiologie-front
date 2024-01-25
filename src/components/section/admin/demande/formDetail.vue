<template>
  <q-form @submit.prevent="() => { }">
    <div class="q-pa-md" style="max-width: 100%">
      <q-list bordered separator>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label caption lines="2">Type d'examen d’imagerie médical</q-item-label>
            <q-item-label>{{ datas?.nom_type }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label caption lines="2">Type d’examen</q-item-label>
            <q-item-label>{{ datas?.nom_sous_type }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-input v-model="nom_patient" outlined label="Nom du patient" />
        <q-input v-model="email" outlined label="Email" />
        <q-input v-model="tel" outlined label="Téléphone" />
        <q-input v-model="datenais" type="date" outlined label="Date de naissance" />
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label caption lines="2">Examen ajouté le</q-item-label>
            <q-item-label>{{
              formatDateToFrench(datas?.created_at)
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label caption lines="2">Examen demandé avant le
            </q-item-label>
            <q-chip v-if="datas?.rdv" square color="green" text-color="white" :label="formatDateToFrench(datas?.rdv)" />
            <q-chip v-else square color="red" text-color="white" label="Urgent" />
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label caption lines="2">Ordonnance du Patient
            </q-item-label>
            <!-- <q-item-label>{{ convertUrlFile(datas?.ordonnance) }}</q-item-label> -->
            <q-btn v-if="datas?.ordonnance" color="secondary" label="Voir l'ordonnance du patient" tag="a"
              :href="convertUrlFile(datas?.ordonnance)" target="_blank" class="mt-3" icon="attach_file" />
            <q-item-label v-else class="text-red">Le patient n'a pas indiqué son ordonnance
            </q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple>
          <q-item-section>
            <q-item-label caption lines="2">Status</q-item-label>
            <q-item-label>{{
              datas?.lieu == "" || datas?.lieu == null
              ? "Non Pris"
              : "Déja pris"
            }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item clickable v-ripple v-if="datas?.date_rdv">
          <q-item-section>
            <q-item-label caption lines="2">Date de rendez-vous prévue avec le patient</q-item-label>
            <q-item-label>{{
              formatDateToFrench(datas?.date_rdv)
            }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
    <div class="p-4" v-if="datas?.date_rdv == null">
      <div class="text-red" v-if="datas?.date_rdv == null">
        Vous n'avez pas encore pris une date de rendez-vous sur ce patient
      </div>
      <q-input filled v-model="date_rdv" mask="date" :rules="['date']" outlined
        label="Date de rendez-vous prévue avec le patient">
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="date_rdv" :options="validDay()" today-btn
                :locale="{ daysShort: ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'], months: ['Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin', 'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'] }"
                flat>
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Close" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
      </q-input>
    </div>

    <div class="px-4">
      <q-select label="Destination" :options="destinations" dense outlined autofocus v-model="lieu" />
    </div>

    <q-card-actions align="right" class="text-primary">
      <q-btn outline label="Annuler" v-close-popup color="white" class="text-black" />

      <!-- <q-btn label="Supprimer" color="red" type="button" /> -->
      <q-btn label="Valider" color="primary" type="button" @click="updatestatus()" v-if="datas?.lieu == '' || datas.lieu == null || datas?.date_rdv == null
        " :disabled="lieu == null" />
      <q-btn label="Modifier" color="secondary" type="button" @click="updateInfo()" />
    </q-card-actions>
  </q-form>
</template>

<script>
import { useDemandeStore } from "@/stores/demande";
import { mapState } from "pinia";
import { mapActions } from "pinia";
import { addDays, differenceInDays, format } from "date-fns";
export default {
  props: ["modelValue", "datas"],
  emits: ["update:modelValue", "refresh"],
  data() {
    return {
      destinations: ["Viry", "Savigny", "Athis", "Evry"],
      lieu: null,
      date_rdv: "",
      datenais: this.format(this.datas.datenais),
      nom_patient: this.datas.nom_patient,
      email: this.datas.email,
      tel: this.datas.tel,
    };
  },
  mounted() {
    this.lieu = this.datas?.lieu;
    if (this.datas?.date_rdv == null) {
      this.date_rdv = this.today;
    } else {
      this.date_rdv = this.formatDate(this.datas?.date_rdv);
    }
  },
  methods: {
    ...mapActions(useDemandeStore, ["getallDemandes", "changeStatus", "changeInfo"]),
    async updatestatus() {
      await this.changeStatus(this.datas?.id, this.lieu, this.date_rdv);
      const { error, msg } = this.message;
      if (!error) {
        await this.getallDemandes();
        this.$emit("refresh");
        this.$emit("update:modelValue", false);
        this.$toast.success(msg);
      } else {
        this.$toast.error(msg);
      }
    },
    async updateInfo(){
      await this.changeInfo({datenais: this.datenais, nom_patient: this.nom_patient, email: this.email, tel: this.tel, id: this.datas?.id});
      const { error, msg } = this.message;
      if (!error) {
        await this.getallDemandes();
        this.$emit("refresh");
        this.$emit("update:modelValue", false);
        this.$toast.success(msg);
      } else {
        this.$toast.error(msg);
      }
    },
    format(date) {
      const now = new Date(date);
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    validDay() {
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
    },
  },
  computed: {
    ...mapState(useDemandeStore, ["message"]),
    formatDateToFrench() {
      return (dateString) => {
        const months = [
          "Janvier",
          "Février",
          "Mars",
          "Avril",
          "Mai",
          "Juin",
          "Juillet",
          "Août",
          "Septembre",
          "Octobre",
          "Novembre",
          "Décembre",
        ];
        const date = new Date(dateString);
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();
        return `${day} ${month} ${year}`;
      };
    },
    today() {
      const now = new Date();
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, "0");
      const day = String(now.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    },
    formatDate() {
      return (date) => {
        const now = new Date(date);
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, "0");
        const day = String(now.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      };
    },

    convertUrlFile() {
      return (url) => {
        const config = useRuntimeConfig();
        return config.public.fileUrl + url;
      };
    },
  },
};
</script>
