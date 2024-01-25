<template>
    <div class="item" v-for="(item, i) in listdiscu" :key="i" :class="{
        active: isActiveDiscu == item.id,
        'd-none': me['id'] == item.id,
    }" @click="select(item)">
        <div class="logo">
            <img src="/images/logo.png" alt="" />
        </div>
        <div class="content">
            <div class="user items-center">
                <span v-if="item.lieu" class="online"></span>
                <div class="w-full">
                    <div class="name">{{ item.nom }} {{ users.find(u => u.id == item.id).lieu ? '(' + users.find(u => u.id
                        ==
                        item.id).lieu + ')' : '' }}</div>
                    <div class="last">
                        <span v-if="item.last_message?.id_envoyeur == me['id']">Vous: </span>
                        <span :class="item.last_message?.lu === 0 ? 'font-bold' : 'font-normal'">{{
                            item.last_message?.message
                        }}</span>
                    </div>
                </div>
                <span class="not-see"
                    v-if="item.last_message?.lu === 0 && item.last_message?.id_envoyeur != me['id']"></span>
                <div class="absolute bottom-[-8px] left-0 flex flex-nowrap" v-if="item.last_message?.lu === 1">
                    <q-icon name="check" style="color: #2e9b4f" size="15px" />
                    <q-icon name="check" style="color: #2e9b4f" size="15px" />
                </div>
            </div>
        </div>
    </div>
</template>

<script setup>
defineProps({
    listdiscu: {
        type: Array,
        required: true
    },
    users: {
        type: Array,
        required: true
    },
    select: {
        type: Function,
        required: true
    },
    isActiveDiscu: {
        required: true
    },
})
const userCookie = useCookie("user");
const me = userCookie.value;
</script>