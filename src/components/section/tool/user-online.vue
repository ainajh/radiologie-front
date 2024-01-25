<template>
    <div class="user">
        <q-avatar style="position: relative; background-color:aliceblue;">
          <q-icon name="person" />
          <span v-if="user.online" class="online"></span>
        </q-avatar>
        <p style="max-width: 200px; overflow: hidden; text-overflow: ellipsis;">{{ user.nom }}</p>
    </div>
</template>

<script setup>
defineProps({
    user: {
        type: Object,
        required: true
    }
})
</script>