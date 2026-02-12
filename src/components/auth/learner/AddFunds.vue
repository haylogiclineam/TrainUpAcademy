<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";
import { initiatePayment, redirectToPayment, getUserCards, payWithSavedCard } from "../../../services/paymentService";
import api from "../../../services/api";

const { t } = useI18n();
const router = useRouter();

const availableBalance = ref(0);
const addAmount = ref('');
const isLoading = ref(false);
const errorMessage = ref('');
const cards = ref([]);
const selectedMethod = ref('new_card'); // 'new_card' or card.id
const saveCard = ref(false);

onMounted(async () => {
    try {
        const profileRes = await api.get('/api/user/profile');
        availableBalance.value = profileRes.data.user?.balance || 0;
        
        const cardsRes = await getUserCards();
        if (cardsRes.data.success) {
            cards.value = cardsRes.data.cards;
        }
    } catch (e) {
        console.error('Failed to fetch data', e);
    }
});

const netAmount = computed(() => {
    const amount = parseFloat(addAmount.value) || 0;
    return amount.toFixed(2);
});

const isValidAmount = computed(() => {
    const amount = parseFloat(addAmount.value) || 0;
    return amount >= 100 && amount <= 500000;
});

const canSubmit = computed(() => {
    return isValidAmount.value && !isLoading.value;
});

const handleCancel = () => {
    router.push('/learner/wallet');
};

const handleAddFunds = async () => {
    if (!canSubmit.value) return;

    isLoading.value = true;
    errorMessage.value = '';

    try {
        const amount = parseFloat(addAmount.value);
        
        if (selectedMethod.value === 'new_card') {
            const response = await initiatePayment({
                amount: amount,
                description: `Add funds - ${amount} AMD`,
                type: 'add_funds',
                currency: '051',
                save_card: saveCard.value
            });

            if (response.data.success && response.data.redirectUrl) {
                redirectToPayment(response.data.redirectUrl);
            } else {
                errorMessage.value = response.data.message || t('payment.initiation_error');
                isLoading.value = false;
            }
        } else {
            // Saved card payment
            const response = await payWithSavedCard({
                card_id: selectedMethod.value,
                amount: amount,
                type: 'add_funds'
            });

            if (response.data.success) {
                // Success! Refresh balance and redirect or show success
                router.push('/learner/wallet');
            } else {
                errorMessage.value = response.data.message || t('payment.initiation_error');
                isLoading.value = false;
            }
        }
    } catch (err) {
        errorMessage.value = err.response?.data?.message || t('payment.initiation_error');
        isLoading.value = false;
    }
};
</script>

<template>
    <div class="add-funds-section">
        <div class="container">
            <div class="add-funds-main">
                <h1 class="add-funds-title">{{ t('add_funds.title') }}</h1>
                
                <p class="available-balance">{{ t('add_funds.available_balance') }}: {{ availableBalance.toLocaleString() }} ֏</p>
                
                <div class="form-section">
                    <label class="section-label">{{ t('add_funds.amount_to_add') }}</label>
                    <div class="input-wrapper">
                        <input 
                            type="number" 
                            v-model="addAmount" 
                            class="form-input amount-input"
                            :placeholder="t('add_funds.amount_placeholder')"
                            :disabled="isLoading"
                        />
                    </div>
                    
                    <div class="amount-limits">
                        <span>{{ t('add_funds.minimum') }}</span>
                        <span class="dot"></span>
                        <span>{{ t('add_funds.maximum') }}</span>
                    </div>
                    

                    
                    <!-- Payment Methods -->
                    <div class="payment-method-section">
                        <label class="section-label">{{ t('add_funds.select_method') }}</label>
                        
                        <!-- Saved Cards -->
                        <div v-for="card in cards" :key="card.id" class="payment-option" @click="selectedMethod = card.id">
                            <div class="radio-circle" :class="{ active: selectedMethod === card.id }">
                                <div class="radio-inner"></div>
                            </div>
                            <span class="payment-label">{{ card.card_pan }}</span>
                        </div>

                        <!-- New Card -->
                        <div class="payment-option" @click="selectedMethod = 'new_card'">
                            <div class="radio-circle" :class="{ active: selectedMethod === 'new_card' }">
                                <div class="radio-inner"></div>
                            </div>
                            <span class="payment-label">{{ t('add_funds.credit_debit_card') }}</span>
                        </div>

                        <!-- Save Card Checkbox (only if new card) -->
                        <div v-if="selectedMethod === 'new_card'" class="save-card-option">
                            <label class="checkbox-container">
                                <input type="checkbox" v-model="saveCard">
                                <span class="checkmark"></span>
                                <span class="checkbox-label">{{ t('add_funds.save_card_for_future') }}</span>
                            </label>
                        </div>

                        <p v-if="selectedMethod === 'new_card'" class="redirect-info">{{ t('add_funds.redirect_info') }}</p>
                    </div>

                    <!-- Error Message -->
                    <div v-if="errorMessage" class="error-message">
                        {{ errorMessage }}
                    </div>
                    
                    <!-- Info Notes -->
                    <div class="info-notes">
                        <p>• {{ t('add_funds.info_processing') }}</p>

                        <p>• {{ t('add_funds.info_minimum') }}</p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="action-buttons">
                        <button class="btn-cancel" @click="handleCancel" :disabled="isLoading">{{ t('add_funds.cancel') }}</button>
                        <button 
                            class="btn-add-funds" 
                            :class="{ disabled: !canSubmit }"
                            @click="handleAddFunds"
                            :disabled="!canSubmit"
                        >
                            <span v-if="isLoading" class="btn-spinner"></span>
                            <span v-else>{{ t('add_funds.add_funds_btn') }}</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.add-funds-section {
    padding: 8% 0;
    background: var(--white-245);
    min-height: 100vh;
}

.add-funds-main {
    max-width: 635px;
}

.add-funds-title {
    font-family: var(--font-montserrat);
    font-style: normal;
    font-weight: 400;
    font-size: 42px;
    line-height: 51px;
    letter-spacing: 0.02em;
    color: var(--primary-100);
    margin-bottom: 20px;
}

.available-balance {
    font-family: var(--font-montserrat);
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    letter-spacing: 0.02em;
    color: var(--primary-100);
    margin-bottom: 40px;
}

.form-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.section-label {
    font-family: var(--font-montserrat);
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    color: var(--primary-100);
}

.input-wrapper {
    width: 100%;
}

.form-input {
    box-sizing: border-box;
    width: 100%;
    height: 60px;
    border: 0.5px solid var(--primary-50);
    border-radius: 8px;
    padding: 0 20px;
    font-family: var(--font-inter);
    font-style: normal;
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    letter-spacing: 0.02em;
    color: var(--primary-100);
    background: transparent;
    outline: none;
}

.form-input::placeholder {
    color: var(--primary-50);
}

.amount-limits {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
}

.amount-limits span {
    font-family: var(--font-montserrat);
    font-style: normal;
    font-weight: 400;
    font-size: 16px;
    line-height: 20px;
    letter-spacing: 0.02em;
    color: var(--primary-100);
}

.amount-limits .dot {
    width: 8px;
    height: 8px;
    background: var(--primary-90);
    border-radius: 50%;
}



.payment-method-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
    margin-top: 20px;
}

.payment-option {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 10px;
    cursor: pointer;
}

.radio-circle {
    width: 31px;
    height: 31px;
    border-radius: 50%;
    border: 2px solid var(--secondary-1-100);
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
}

.radio-circle.active {
    background: var(--secondary-1-100);
}

.radio-inner {
    width: 15px;
    height: 15px;
    background: white;
    border-radius: 50%;
}

.payment-label {
    font-family: var(--font-montserrat);
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    color: var(--primary-100);
}

.redirect-info {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 15px;
    line-height: 1.5;
    color: var(--primary-60);
    padding-left: 41px;
    margin: 0;
}

.error-message {
    background: #fdf2f2;
    border: 1px solid #e74c3c;
    border-radius: 8px;
    padding: 12px 16px;
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 14px;
    color: #c0392b;
}

.save-card-option {
    margin-top: 10px;
    padding-left: 41px;
}

.checkbox-container {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 35px;
    cursor: pointer;
    user-select: none;
}

.checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    height: 24px;
    width: 24px;
    background-color: transparent;
    border: 1px solid var(--secondary-1-100);
    border-radius: 4px;
}

.checkbox-container:hover input ~ .checkmark {
    background-color: rgba(75, 187, 228, 0.1);
}

.checkbox-container input:checked ~ .checkmark {
    background-color: var(--secondary-1-100);
}

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
    display: block;
}

.checkbox-container .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.checkbox-label {
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 16px;
    color: var(--primary-90);
}

.btn-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: spin 0.6s linear infinite;
}

@keyframes spin {
    to { transform: rotate(360deg); }
}

.info-notes {
    margin-top: 40px;
}

.info-notes p {
    font-family: var(--font-montserrat);
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    color: var(--primary-100);
    margin-bottom: 16px;
}

.action-buttons {
    display: flex;
    flex-direction: row;
    gap: 20px;
    margin-top: 20px;
}

.btn-cancel {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 15px 80px;
    gap: 10px;
    width: 223px;
    height: 50px;
    background: var(--primary-20);
    border-radius: 25px;
    border: none;
    cursor: pointer;
    font-family: var(--font-montserrat);
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 22px;
    color: var(--primary-70);
}

.btn-add-funds {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 15px 60px;
    gap: 10px;
    width: 220px;
    height: 50px;
    background: var(--general-btn);
    border-radius: 25px;
    border: none;
    cursor: pointer;
    font-family: var(--font-montserrat);
    font-style: normal;
    font-weight: 500;
    font-size: 18px;
    line-height: 22px;
    color: var(--white-245);
}

.btn-add-funds.disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-cancel:hover {
    opacity: 0.9;
}

.btn-add-funds:hover:not(.disabled) {
    opacity: 0.9;
}

@media (max-width: 767px) {
    .add-funds-title {
        font-size: 28px;
        line-height: 34px;
    }
    
    .available-balance,
    .section-label,
    .payment-label,
    .info-notes p {
        font-size: 16px;
        line-height: 20px;
    }
    
    .action-buttons {
        flex-direction: column;
    }
    
    .btn-cancel,
    .btn-add-funds {
        width: 100%;
    }
    
    .card-fields {
        padding-left: 0;
    }
}
</style>
