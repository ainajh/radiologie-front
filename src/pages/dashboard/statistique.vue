<template>
  <section-admin-container pageClass="pg-admin-user" title="Statistique">
    <div class="dash-demande__filter pb-5">
      <div class="pl-[50px]">
        <q-btn-group>
          <q-btn
            label="Statistique demandes"
            :class="type == 'demande' ? 'active' : ''"
            @click="type = 'demande'"
          />
          <q-btn
            label="Statistique medecin"
            :class="type == 'medecin' ? 'active' : ''"
            @click="type = 'medecin'"
          />
        </q-btn-group>
      </div>
    </div>
    <div>
      <section-admin-line-chart v-if="type == 'demande'" />
      <section-admin-pie-chart v-if="type == 'medecin'" />
    </div>
  </section-admin-container>
</template>
<script>
export default {
  setup() {
    definePageMeta({
      layout: "admin",
      middleware: "admin",
    });
  },
  data() {
    return {
      type: "demande",
    };
  },
};
</script>

<style>
.line-chart {
  width: 50vw;
  height: 40vh;
}
</style>
