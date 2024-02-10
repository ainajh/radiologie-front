<script setup lang="ts">
import dayjs from 'dayjs'
import BadgePersonInShift from './BadgePersonInShift.vue'
import type { DataShift } from '@/utils/constants/shift-interface'
import { TimeInDay } from '@/utils/constants/time-in-day'
import isBeforeToday from '@/utils/functions/is-before-today'
const props = defineProps([
  'date',
  'isMorning',
  'label',
  'saveShift',
  'updateShift',
  'shifts',
  'block',
  'deleteShift',
  'monthIndex'
])

function filteredShifts(): [DataShift?] {
  const desiredShift = props.isMorning ? TimeInDay.Morning : TimeInDay.Afternoon
  if (props.shifts.length != 0) {
    return props.shifts.filter((shift: DataShift) => {
      return (
        dayjs(shift.date).format('DD-MM-YYYY') === dayjs(props.date).format('DD-MM-YYYY') &&
        shift.shift === desiredShift &&
        shift.block === props.block
      )
    })
  }
  return []
}
</script>

<template>
  <div
    class="flex-1 h-full w-full min-h-20 p-0.5"
    :class="{
      'bg-pink-200': props.isMorning,
      'bg-cyan-200': !props.isMorning,
      ' bg-slate-200 ': isBeforeToday(props.date)
    }"
  >
    <p class="text-center text-gray-400">
      {{ props.label }}
    </p>
    <div v-for="(shift, i) in filteredShifts()" :key="shift?.name">
      <BadgePersonInShift
        :name="shift?.name"
        :shift="shift"
        :updateShift="props.updateShift"
        :deleteShift="props.deleteShift"
      />
    </div>
  </div>
</template>

<style scoped></style>
