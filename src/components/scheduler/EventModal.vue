<script setup lang="ts">
import type { DataShift } from '@/utils/constants/shift-interface'
import { TimeInDay } from '@/utils/constants/time-in-day'
import isBeforeToday from '@/utils/functions/is-before-today'
import { ref } from 'vue'

const props = defineProps(['date', 'isMorning', 'saveShift', 'block'])

let isOpen = ref(false)
let inputValue = ref('')

function toggleModal() {
  if (isBeforeToday(props.date)) return
  isOpen.value = !isOpen.value
}

function saveData() {
  console.log('Save data ', inputValue)
  const newShift: DataShift = {
    name: inputValue.value,
    date: props.date,
    shift: props.isMorning ? TimeInDay.Morning : TimeInDay.Afternoon,
    block: props.block
  }
  props.saveShift(newShift)
  isOpen.value = !isOpen.value
  inputValue.value = ''
}
</script>
<template>
  <button class="w-full" @click="toggleModal">
    <slot></slot>
  </button>
  <button v-if="isOpen" class="fixed inset-0 flex items-center justify-center" @click="toggleModal">
    <transition name="modal-fade">
      <div
        v-if="isOpen"
        class="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      >
        <button @click.stop="" class="">
          <div class="bg-white p-8 rounded-lg shadow-lg">
            <div class="flex justify-end">
              <button
                @click="toggleModal"
                class="text-gray-500 hover:text-gray-700 font-bold text-2xl"
              >
                &times;
              </button>
            </div>
            <div class="flex flex-col space-x-2 space-y-4 items-start">
              <p class="">{{ props.date.format('DD-MM-YYYY') }}</p>
              <p>Name</p>
              <input
                type="name"
                class="form-input px-4 py-1 rounded"
                v-model="inputValue"
                placeholder="Name ..."
              />
              <div class="flex flex-row space-x-5">
                <button
                  @click="toggleModal"
                  class="text-black px-2 bg-pink-300 hover:bg-pink-500 rounded text-md"
                >
                  <p>Cancel</p>
                </button>
                <button
                  @click="saveData"
                  class="text-black px-2 bg-cyan-300 hover:bg-cyan-500 rounded text-md"
                >
                  <p>Save</p>
                </button>
              </div>
            </div>
          </div>
        </button>
      </div>
    </transition>
  </button>
</template>

<style scoped></style>
