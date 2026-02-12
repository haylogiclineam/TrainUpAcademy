<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePurchasedCourses } from '../../../composables/usePurchasedCourses.js'
import Header from '../../../components/Header.vue'
import Footer from '../../../components/Footer.vue'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const { refetchPurchasedCourses } = usePurchasedCourses()

const status = ref(route.query.status || 'unknown')
const orderId = ref(route.query.orderId || '')
const paymentId = ref(route.query.paymentId || '')
const message = ref(route.query.message || '')

const isSuccess = computed(() => status.value === 'success')
const isFailed = computed(() => status.value === 'failed')

const goToWallet = () => {
    router.push('/learner/wallet')
}

const goToLearning = () => {
    router.push('/learner/my-learning')
}

const tryAgain = () => {
    router.push('/learner/add-funds')
}

const goHome = () => {
    router.push('/')
}

onMounted(async () => {
    if (isSuccess.value) {
        await refetchPurchasedCourses()
    }
})
</script>

<template>
    <Header />
    <div class="payment-result-section">
        <div class="container">
            <div class="result-content">
                <!-- Success State -->
                <div v-if="isSuccess" class="result-state success-state">
                    <div class="result-icon success-icon">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#27AE60" stroke-width="2"/>
                            <path d="M8 12L11 15L16 9" stroke="#27AE60" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <h1 class="result-title">{{ t('payment.success_title') }}</h1>
                    <p class="result-text">{{ t('payment.success_text') }}</p>

                    <div v-if="orderId" class="result-details">
                        <div class="detail-row">
                            <span class="detail-label">{{ t('payment.order_id') }}:</span>
                            <span class="detail-value">{{ orderId }}</span>
                        </div>
                    </div>

                    <div class="result-actions">
                        <button class="btn-primary" @click="goToWallet">
                            {{ t('payment.back_to_wallet') }}
                        </button>
                        <button class="btn-secondary" @click="goToLearning">
                            {{ t('payment.go_to_learning') }}
                        </button>
                    </div>
                </div>

                <!-- Failed State -->
                <div v-if="isFailed" class="result-state failed-state">
                    <div class="result-icon failed-icon">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#E74C3C" stroke-width="2"/>
                            <path d="M15 9L9 15M9 9L15 15" stroke="#E74C3C" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <h1 class="result-title">{{ t('payment.failed_title') }}</h1>
                    <p class="result-text">{{ t('payment.failed_text') }}</p>

                    <p v-if="message" class="result-message">{{ message }}</p>

                    <div class="result-actions">
                        <button class="btn-primary" @click="tryAgain">
                            {{ t('payment.try_again') }}
                        </button>
                        <button class="btn-secondary" @click="goHome">
                            {{ t('payment.go_home') }}
                        </button>
                    </div>
                </div>

                <!-- Unknown State -->
                <div v-if="!isSuccess && !isFailed" class="result-state unknown-state">
                    <div class="result-icon">
                        <svg width="80" height="80" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#F39C12" stroke-width="2"/>
                            <path d="M12 8V12M12 16H12.01" stroke="#F39C12" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <h1 class="result-title">{{ t('payment.unknown_title') }}</h1>
                    <p class="result-text">{{ t('payment.unknown_text') }}</p>

                    <div class="result-actions">
                        <button class="btn-primary" @click="goToWallet">
                            {{ t('payment.back_to_wallet') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <Footer />
</template>

<style scoped>
.payment-result-section {
    min-height: 60vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 80px 0;
}

.result-content {
    max-width: 550px;
    margin: 0 auto;
    text-align: center;
}

.result-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.result-icon {
    margin-bottom: 10px;
}

.result-title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 36px;
    line-height: normal;
    color: var(--primary-100);
    margin: 0;
}

.result-text {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: 1.6;
    color: var(--primary-60);
    margin: 0;
    max-width: 450px;
}

.result-message {
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 14px;
    color: var(--primary-50);
    background: var(--primary-10, #f5f5f5);
    padding: 12px 20px;
    border-radius: 8px;
    margin: 0;
}

.result-details {
    width: 100%;
    max-width: 350px;
    background: var(--primary-10, #f5f5f5);
    border-radius: 12px;
    padding: 20px 24px;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.detail-label {
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 16px;
    color: var(--primary-60);
}

.detail-value {
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 16px;
    color: var(--primary-100);
}

.result-actions {
    display: flex;
    flex-direction: row;
    gap: 16px;
    margin-top: 10px;
}

.btn-primary {
    padding: 14px 36px;
    background: var(--general-btn);
    color: var(--white-245);
    border: none;
    border-radius: 25px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    cursor: pointer;
    white-space: nowrap;
}

.btn-secondary {
    padding: 14px 36px;
    background: transparent;
    color: var(--primary-60);
    border: 0.5px solid var(--primary-50);
    border-radius: 25px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    cursor: pointer;
    white-space: nowrap;
}

.btn-primary:hover {
    opacity: 0.9;
}

.btn-secondary:hover {
    background: var(--primary-10, #f5f5f5);
}

@media (max-width: 575px) {
    .result-title {
        font-size: 24px;
    }

    .result-text {
        font-size: 15px;
    }

    .result-actions {
        flex-direction: column;
        width: 100%;
    }

    .btn-primary,
    .btn-secondary {
        width: 100%;
        text-align: center;
    }
}
</style>
