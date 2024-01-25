<template>
  <div class="page-content" :class="pageClass">
    <div class="page-content__header">
      <div class="page-content__header-back">
        <img src="/images/dashboard/title_back.png" alt="" />
      </div>
      <div class="page-content__header-title" v-if="title">
        <h1>{{ title }}</h1>
      </div>
    </div>
    <div class="page-content__body">
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    pageClass: {
      type: String,
      default: "",
    },
    title: {
      type: String,
      default: "",
    },
  },
};
</script>
