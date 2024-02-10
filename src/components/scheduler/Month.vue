<script setup lang="ts">
import dayjs from 'dayjs'
import { ref } from 'vue'
import Week from './Week.vue'
import Morning from './Morning.vue'
import Afternoon from './Afternoon.vue'
import getMonth from '@/utils/functions/get-month'
import type { DataShift } from '@/utils/constants/shift-interface'
import { Tab } from '@/utils/data/blocs-data'
import { TimeInDay } from '@/utils/constants/time-in-day'

let currentMonth = ref(getMonth())
let weekIndex = ref(0)
let monthIndex = ref(0)
let data = ref<[DataShift?]>([])

function increment() {
  if (weekIndex.value == 0) {
    weekIndex.value = 4
    previousMonth(false)
    return
  }
  weekIndex.value--
}

function decrement() {
  if (weekIndex.value == 4) {
    weekIndex.value = 0
    nextMonth(false)
    return
  }
  weekIndex.value++
}

function thisMonth() {
  currentMonth.value = getMonth()
  monthIndex.value = dayjs().month()
  const i = currentMonth.value.findIndex((shift, i) => {
    const found = currentMonth.value[i].findIndex((e) => e.format('DD') === dayjs().format('DD'))
    if (found !== -1) {
      return true
    }
    return false
  })
  if (i !== -1) {
    weekIndex.value = i
    return
  }
  console.log('No match found')
  return
}

function nextMonth(isweekIndexChange = true) {
  monthIndex.value++
  if (isweekIndexChange) weekIndex.value = 0
  currentMonth.value = getMonth(monthIndex.value)
}

function previousMonth(isweekIndexChange = true) {
  monthIndex.value--
  if (isweekIndexChange) weekIndex.value = 4
  currentMonth.value = getMonth(monthIndex.value)
}

function actualDate() {
  return dayjs(new Date(dayjs().year(), monthIndex.value)).format('MMMM YYYY')
}

function saveShift(dataShift: DataShift) {
  if (data.value === undefined) {
    data.value = [dataShift]
    return
  }
  data.value.push(dataShift)
}

function updateShift(oldShift: DataShift, dataShift: DataShift) {
  if (data.value === undefined) return
  const index = data.value.findIndex((shift) => {
    return (
      dayjs(shift?.date).format('DD-MM-YYYY') === dayjs(oldShift.date).format('DD-MM-YYYY') &&
      shift?.shift === oldShift.shift &&
      shift?.name === oldShift.name &&
      shift.block === oldShift.block
    )
  })

  if (index !== -1) {
    data.value[index] = dataShift
    return
  }
  console.log('No match found')
  return
}

function deleteShift(dataShift: DataShift) {
  if (data.value === undefined) return
  const index = data.value.findIndex((shift) => {
    return (
      dayjs(shift?.date).format('DD-MM-YYYY') === dayjs(dataShift.date).format('DD-MM-YYYY') &&
      shift?.shift === dataShift.shift &&
      shift?.name === dataShift.name &&
      shift.block === dataShift.block
    )
  })

  if (index !== -1) {
    data.value.splice(index, 1)
    return
  }
  console.log('No match found')
  return
}
</script>

<template>
  <div class="bg-white text-black">
    <div class="flex flex-row flex-nowrap">
      <p class="mx-5">week : {{ weekIndex }}</p>
      <button
        @click="increment"
        class="flex justify-center items-center h-auto min-w-5 rounded bg-slate-400 text-white"
      >
        &lt;
      </button>
      <div class="mx-2">|</div>
      <button
        @click="decrement"
        class="flex justify-center items-center h-auto min-w-5 rounded bg-slate-400 text-white"
      >
        >
      </button>
      <button
        @click="thisMonth"
        class="mx-5 flex justify-center items-center h-auto px-2 rounded bg-slate-400 text-white"
      >
        Today
      </button>
      <p class="mx-5">||</p>
      <p class="mx-5">month</p>
      <button
        @click="
          (e: MouseEvent) => {
            previousMonth()
            return e
          }
        "
        class="flex justify-center items-center h-auto min-w-5 rounded bg-slate-400 text-white"
      >
        &lt;
      </button>
      <div class="mx-2">|</div>
      <button
        @click="
          (e: MouseEvent) => {
            nextMonth()
            return e
          }
        "
        class="flex justify-center items-center h-auto  min-w-5 rounded bg-slate-400 text-white"
      >
        >
      </button>
      <p class="mx-5">{{ actualDate() }}</p>
    </div>
    <div class="w-full flex flex-row flex-nowrap">
      <div class="w-20 flex items-center justify-center">
        <p class="text-center"></p>
      </div>
      <div class="w-full flex flex-row flex-nowrap my-1 space-x-0.5">
        <div class="w-full"></div>
        <Week :week="currentMonth[weekIndex]" :monthIndex="monthIndex" />
      </div>
    </div>

    <div class="w-full flex flex-row flex-nowrap" v-for="(e, i) in Tab" :key="i">
      <div class="w-20 flex items-center justify-center">
        <p class="text-center">{{ e }}</p>
      </div>
      <div class="w-full flex flex-col">
        <div class="flex flex-row flex-nowrap">
          <div class="w-full flex flex-nowrap items-center justify-center">
            <p class="text-center">{{ TimeInDay.Morning }}</p>
          </div>
          <Morning
            :week="currentMonth[weekIndex]"
            :saveShift="saveShift"
            :updateShift="updateShift"
            :shifts="data"
            :block="e"
            :deleteShift="deleteShift"
            :monthIndex="monthIndex"
          />
        </div>
        <div class="flex flex-row flex-nowrap">
          <div class="w-full flex flex-nowrap items-center justify-center">
            <p class="text-center">{{ TimeInDay.Afternoon }}</p>
          </div>
          <Afternoon
            :week="currentMonth[weekIndex]"
            :saveShift="saveShift"
            :updateShift="updateShift"
            :shifts="data"
            :block="e"
            :deleteShift="deleteShift"
            :monthIndex="monthIndex"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
