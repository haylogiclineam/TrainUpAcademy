<script setup>
import { onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const loading = ref(true)
const error = ref(null)

onMounted(async () => {
    // AmeriaBank redirects here with: orderID, responseCode, paymentID, opaque
    const orderID = route.query.orderID
    const responseCode = route.query.responseCode
    const paymentID = route.query.paymentID

    if (!orderID || !paymentID) {
        error.value = 'Missing payment parameters'
        loading.value = false
        return
    }

    try {
        // Forward to backend callback endpoint which handles verification
        const backendUrl = import.meta.env.VITE_API_BASE_URL
        const callbackUrl = `${backendUrl}/api/payments/callback?orderID=${encodeURIComponent(orderID)}&responseCode=${encodeURIComponent(responseCode)}&paymentID=${encodeURIComponent(paymentID)}`

        // The backend callback will redirect us to /payment/result
        window.location.href = callbackUrl
    } catch (err) {
        error.value = err.message || 'Payment processing error'
        loading.value = false
    }
})
</script>

<template>
    <div class="payment-callback-section">
        <div class="container">
            <div class="callback-content">
                <div v-if="loading && !error" class="loading-state">
                    <div class="spinner"></div>
                    <h2 class="loading-title">{{ t('payment.processing_title') }}</h2>
                    <p class="loading-text">{{ t('payment.processing_text') }}</p>
                </div>

                <div v-if="error" class="error-state">
                    <div class="error-icon">
                        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="12" cy="12" r="10" stroke="#E74C3C" stroke-width="2"/>
                            <path d="M15 9L9 15M9 9L15 15" stroke="#E74C3C" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                    </div>
                    <h2 class="error-title">{{ t('payment.error_title') }}</h2>
                    <p class="error-text">{{ error }}</p>
                    <button class="btn-retry" @click="router.push('/learner/wallet')">
                        {{ t('payment.back_to_wallet') }}
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.payment-callback-section {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px 0;
}

.callback-content {
    max-width: 500px;
    margin: 0 auto;
    text-align: center;
}

.loading-state,
.error-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
}

.spinner {
    width: 60px;
    height: 60px;
    border: 4px solid var(--primary-20, #e0e0e0);
    border-top-color: var(--secondary-1-100, #4BBBE4);
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.loading-title,
.error-title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 28px;
    color: var(--primary-100);
    margin: 0;
}

.loading-text,
.error-text {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
    color: var(--primary-60);
    margin: 0;
}

.error-icon {
    margin-bottom: 10px;
}

.btn-retry {
    padding: 14px 40px;
    background: var(--general-btn);
    color: var(--white-245);
    border: none;
    border-radius: 25px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px;
}

.btn-retry:hover {
    opacity: 0.9;
}
</style>
