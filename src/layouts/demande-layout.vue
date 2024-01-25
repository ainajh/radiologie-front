<template>
  <nav class="fixed bg-gray-100 top-0 flex items-center w-full justify-between p-4" style="box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
    <div>
      <h1 style="line-height: 2;">Centre médicale</h1>
    </div>
    <div class="flex gap-2 flex-wrap items-center justify-center">
      <q-btn-toggle
        unelevated
        v-model="user.type"
        toggle-color="primary"
        style="text-transform: none"
        :options="[
          { label: 'Patient', value: 'Patient' },
          { label: 'Médecin', value: 'Médecin' },
        ]"
        @update:model-value="(v: 'Patient' | 'Médecin')=>user.changeType(v)"
      />
      <nuxt-link to="/authentification" style="font-size: 14px;" ><strong>Se connecter</strong></nuxt-link>
    </div>
  </nav>
  <section class="mt-[70px]">
    <slot />
  </section>
</template>

<script setup lang="ts">
const user = userStore();
</script>
