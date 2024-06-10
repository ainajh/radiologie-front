<template>
  <form
    @submit.prevent="submitedForm"
    class="bg-white p-8 border-2 rounded-lg shadow-lg relative"
  >
    <div>
      <h3 class="font-bold text-lg text-center">
        {{ typed == "create" ? "Créér" : "Modifier" }} un congé
      </h3>
    </div>

    <div class="flex flex-col space-x-2 space-y-4 items-start">
      <div>
        <div class="q-gutter-sm">
          <q-radio v-model="form.periode" val="journe" label="Une journée" />
          <q-radio v-model="form.periode" val="periodique" label="Périodique" />
        </div>
      </div>
      <div class="grid grid-cols-1 w-full">
        <q-input
          v-model="form.inputStartDate"
          dense
          outlined
          autofocus
          type="date"
          label="Date de début"
          lazy-rules
          :rules="[required]"
        />
        <q-input
          v-if="form.periode == 'periodique'"
          v-model="form.inputEndDate"
          dense
          outlined
          autofocus
          type="date"
          label="Date du fin"
          lazy-rules
          :rules="[required]"
        />
        <q-select
          v-if="userDash?.role == 'admin'"
          dense
          outlined
          autofocus
          v-model="form.inputName"
          :options="userList"
          label="Nom du radiologue"
          option-label="nom"
          class="mb-4"
          transition-show="flip-up"
          transition-hide="flip-down"
          :rules="[required]"
          option-value="id"
          emit-value
          map-options
        />
        <q-input
          dense
          outlined
          autofocus
          label="Type du congé"
          :rules="[required]"
          v-model="form.typeOfHoliday"
        />
      </div>
      <div class="text-primary flex gap-2 justify-end w-full">
        <q-btn
          outline
          label="Annuler"
          v-close-popup
          color="red"
          class="text-black"
          @click="close"
        />
        <q-btn
          :label="typed === 'create' ? 'Sauvegarder' : 'Modifier'"
          type="submit"
          :color="typed === 'create' ? 'primary' : 'blue'"
        />
      </div>
    </div>
  </form>
</template>

<script lang="ts" setup>
const props = defineProps({
  typed: {
    type: String,
    default: "create",
  },
  data: {
    type: Object,
    default: null,
  },
  fetchHolidayList: {
    type: Function,
    default: () => {},
  },
  close: {
    type: Function,
    default: () => {},
  },
});
import dayjs from "dayjs";
import UserService from "@/services/user.service";
import LeaveService from "~/services/leave.service";
import type { LeaveData } from "~/utils/constants/leave-interface";

const userDash: any = useCookie("user").value;
const userList = computed(async () => {
  return await UserService.getAll();
});

const form = ref({
  periode: "journe",
  inputName: "",
  typeOfHoliday: "",
  inputStartDate: dayjs().format("YYYY-MM-DD"),
  inputEndDate: dayjs().format("YYYY-MM-DD"),
});

const submitedForm = () => {
  if (props.typed == "create") {
    createLeave();
  } else {
    updateLeave();
  }
};

const required = (val: any) => {
  return val !== null || val != "";
};
const createLeave = async () => {
  if (form.value.periode == "journe") {
    form.value.inputEndDate = form.value.inputStartDate;
  }

  const dataHodiday: LeaveData = {
    idPerson: parseInt(
      userDash?.role == "admin" ? form.value.inputName : userDash?.id
    ),
    typeOfLeave: form.value.typeOfHoliday,
    dateStart: dayjs(new Date(form.value.inputStartDate)).format("YYYY-MM-DD"),
    dateEnd: dayjs(new Date(form.value.inputEndDate)).format("YYYY-MM-DD"),
  };
  await LeaveService.create(dataHodiday);
  props.fetchHolidayList();
  props.close();
};
const updateLeave = async () => {
  const newUpdatedLeave: LeaveData = {
    id: form.value.id,
    idPerson: parseInt(form.value.inputName),
    dateStart: dayjs(new Date(form.value.inputStartDate)).format("YYYY-MM-DD"),
    dateEnd: dayjs(new Date(form.value.inputEndDate)).format("YYYY-MM-DD"),
    typeOfLeave: form.value.typeOfHoliday,
  };

  await LeaveService.update(newUpdatedLeave);
  props.fetchHolidayList();
  props.close();
};

onMounted(() => {
  if (props.data) {
    const per =
      dayjs(props.data.dateStart).format("YYYY-MM-DD") !=
      dayjs(props.data.dateEnd).format("YYYY-MM-DD")
        ? "periodique"
        : "journe";
    form.value = {
      id: props.data.id,
      periode: per,
      inputName: props.data.idPerson,
      typeOfHoliday: props.data.typeOfLeave,
      inputStartDate: dayjs(props.data.dateStart).format("YYYY-MM-DD"),
      inputEndDate: dayjs(props.data.dateEnd).format("YYYY-MM-DD"),
    };
  }
});
</script>
