<template>
  <div class="w-full bg-white liste-conge border h-full">
    <div class="flex shadow-md items-center px-2 justify-between">
      <h3 class="font-bold text-md">
        Liste des personnes en congés cette semaine
      </h3>
      <div class="flex gap-2">
        <q-btn outline color="red" icon="close" @click="$emit('close')" />
      </div>
    </div>
    <div class="content p-2">
      <div class="w-full border-b-4">
        <slot></slot>
      </div>
      <div class="content_body pr-2 mt-3" v-if="data?.length">
        <div
          class="border-l-4 border h-[60px] p-2 w-full relative"
          :style="{ borderColor: generateColor(item.nom, item.typeOfSchedule) }"
          v-for="(item, i) in data"
        >
          <div class="font-bold">
            {{ item.nom }}
            <span class="text-gray-500 text-xs">
              le
              {{
                dayjs(item.dateStart).format("DD MMMM YYYY") ==
                dayjs(item.dateEnd).format("DD MMMM YYYY")
                  ? dayjs(item.dateEnd).format("DD MMMM YYYY")
                  : dayjs(item.dateStart).format("DD MMMM YYYY") +
                    " au " +
                    dayjs(item.dateEnd).format("DD MMMM YYYY")
              }}
            </span>
          </div>

          <div>
            {{ item.typeOfLeave }}
          </div>
          <div
            class="absolute top-1 right-2 flex gap-2"
            v-if="userDash.role == 'admin' || item.idPerson == userDash.id"
          >
            <i
              class="fa-solid fa-edit cursor-pointer text-blue"
              @click="toggleModal(item)"
            ></i>
            <i
              class="fa-solid fa-trash cursor-pointer text-red"
              @click.stop="$emit('delete', parseInt(item.id))"
            ></i>
          </div>
        </div>
      </div>
      <div class="h-[100px] flex items-center justify-center" v-else>
        Il n'y a pas des radiologues en congés cette semaine.
      </div>
    </div>
    <q-dialog v-model="openModal" persistent>
      <q-card class="w-[80vw] md:w-[40vw]">
        <planningCongeForm
          typed="modify"
          :data="dataLeave || {}"
          :fetchHolidayList="() => $emit('fetchHolidayList')"
          :close="() => (openModal = false)"
        />
      </q-card>
    </q-dialog>
  </div>
</template>
<script setup lang="ts">
import generateColorFromString from "@/utils/functions/generate-color-from-string";
import dayjs from "dayjs";
const props = defineProps({
  data: {
    type: [Object, Array],
  },
});

const userDash: any = useCookie("user");
const openModal = ref(false);
const dataLeave = ref(null);
const generateColor = (str: string, isRed: boolean) => {
  if (isRed) return "#dc2626";
  return generateColorFromString(str);
};
const toggleModal = (data: any) => {
  dataLeave.value = data;
  openModal.value = true;
};
</script>
<style lang="scss">
.liste-conge {
  display: grid;
  grid-template-rows: 50px calc(100% - 50px);
  max-height: 100vh;
  .content {
    max-height: 100%;
    display: grid;
    grid-template-rows: 50px calc(100% - 50px);
    grid-template-columns: 1fr;
    &_body {
      overflow: auto;
      max-height: 100%;
      display: flex;
      flex-direction: column;
      gap: 5px;
    }
  }
}
</style>
