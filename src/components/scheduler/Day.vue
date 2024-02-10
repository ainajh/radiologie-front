<script setup lang="ts">
import isBeforeToday from '@/utils/functions/is-before-today';
import isMemberOfCurrentMonth from '@/utils/functions/is-member-of-current-month';
import dayjs from 'dayjs'
const props = defineProps(['day', 'monthIndex'])

function isTheDayToday() {
  return props.day.format('DD-MM-YY') === dayjs().format('DD-MM-YY')
}
</script>

<template>
  <div class="my-2 flex-1 bg-slate-300 h-auto w-10">
    <p class="text-center">{{ props.day.format('dddd') }}</p>
    <div class="flex justify-center">
      <p
        class="text-center rounded-full w-6 my-1"
        :class="{
          'bg-white': !isTheDayToday() && !isBeforeToday(props.day),
          'bg-gray-200 opacity-15':
            isBeforeToday(props.day) ||
            (isMemberOfCurrentMonth(props.monthIndex, props.day) && !isTheDayToday()),
          ' bg-cyan-900 text-white ': isTheDayToday()
        }"
      >
        {{ props.day.format('DD') }}
      </p>
    </div>
  </div>
</template>

<style scoped></style>
