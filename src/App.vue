<script setup>
import { computed } from 'vue'
import { useAuthStore } from './stores/auth.js'
import ChatBot from './components/ChatBot.vue'

const auth = useAuthStore()
const readyToRender = computed(() => !auth.isLoading)
</script>

<template>
    <div v-if="!readyToRender" class="loading-spinner">
        <div class="spinner-border text-secondary" role="status">
            <span class="visually-hidden">{{ $t('loading') }}...</span>
        </div>
    </div>
    <div v-else>
        <router-view />
        <ChatBot />
    </div>
</template>

<style scoped>
.loading-spinner {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}
</style>
