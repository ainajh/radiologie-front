<template>
  <div :class="envoyeur ? 'message etranger' : 'message'">
    <p>{{ mes.message }}</p>
    <q-tooltip>
      <p>{{ format(mes.created_at) }}</p>
    </q-tooltip>
  </div>
</template>

<script setup lang="ts">
defineProps({
  mes: {
    type: Object,
    required: true
  },
  envoyeur: {
    type: Boolean,
    required: true
  }
})
const format = (date: string) => {
  const d = new Date(date);
  return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`;
}
</script>