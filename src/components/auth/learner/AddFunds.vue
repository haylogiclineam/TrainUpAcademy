<script setup>
import { ref, computed } from "vue";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();

const availableBalance = ref(1240);
const addAmount = ref('');
const paymentMethod = ref('card');

// Card fields
const cardholderName = ref('');
const cardNumber = ref('');
const expirationDate = ref('');
const cvv = ref('');

const platformFeePercent = 2;

const platformFee = computed(() => {
    const amount = parseFloat(addAmount.value) || 0;
    return (amount * platformFeePercent / 100).toFixed(2);
});

const netAmount = computed(() => {
    const amount = parseFloat(addAmount.value) || 0;
    const fee = parseFloat(platformFee.value);
    return (amount - fee).toFixed(2);
});

const isValidAmount = computed(() => {
    const amount = parseFloat(addAmount.value) || 0;
    return amount >= 5 && amount <= 5000;
});

const canSubmit = computed(() => {
    if (!isValidAmount.value) return false;
    if (paymentMethod.value === 'card') {
        return cardholderName.value && cardNumber.value && expirationDate.value && cvv.value;
    }
    return true;
});

const handleCancel = () => {
    router.push('/learner/wallet');
};

const handleAddFunds = () => {
    if (!canSubmit.value) return;
    // TODO: Implement add funds API call
    console.log('Add funds request:', {
        amount: addAmount.value,
        method: paymentMethod.value,
        cardDetails: paymentMethod.value === 'card' ? {
            cardholderName: cardholderName.value,
            cardNumber: cardNumber.value,
            expirationDate: expirationDate.value,
            cvv: cvv.value
        } : null
    });
};
</script>

<template>
    <div class="add-funds-section">
        <div class="container">
            <div class="add-funds-main">
                <h1 class="add-funds-title">{{ t('add_funds.title') }}</h1>
                
                <p class="available-balance">{{ t('add_funds.available_balance') }}: ${{ availableBalance.toLocaleString() }}</p>
                
                <div class="form-section">
                    <label class="section-label">{{ t('add_funds.amount_to_add') }}</label>
                    <div class="input-wrapper">
                        <input 
                            type="text" 
                            v-model="addAmount" 
                            class="form-input amount-input"
                            :placeholder="t('add_funds.amount_placeholder')"
                        />
                    </div>
                    
                    <div class="amount-limits">
                        <span>{{ t('add_funds.minimum') }}</span>
                        <span class="dot"></span>
                        <span>{{ t('add_funds.maximum') }}</span>
                    </div>
                    
                    <div class="fee-row">
                        <span>{{ t('add_funds.platform_fee') }}:</span>
                        <span>-${{ platformFee }}</span>
                    </div>
                    
                    <div class="fee-row net-amount">
                        <span>{{ t('add_funds.net_amount') }}:</span>
                        <span>-${{ netAmount }}</span>
                    </div>
                    
                    <!-- Payment Method Selection -->
                    <div class="payment-method-section">
                        <div class="payment-option" @click="paymentMethod = 'card'">
                            <div class="radio-circle" :class="{ active: paymentMethod === 'card' }">
                                <div class="radio-inner" v-if="paymentMethod === 'card'"></div>
                            </div>
                            <span class="payment-label">{{ t('add_funds.credit_debit_card') }}</span>
                        </div>
                        
                        <!-- Card Fields -->
                        <div v-if="paymentMethod === 'card'" class="card-fields">
                            <div class="input-wrapper">
                                <input 
                                    type="text" 
                                    v-model="cardholderName" 
                                    class="form-input"
                                    :placeholder="t('add_funds.cardholder_name')"
                                />
                            </div>
                            <div class="input-wrapper">
                                <input 
                                    type="text" 
                                    v-model="cardNumber" 
                                    class="form-input"
                                    :placeholder="t('add_funds.card_number')"
                                />
                            </div>
                            <div class="input-wrapper">
                                <input 
                                    type="text" 
                                    v-model="expirationDate" 
                                    class="form-input"
                                    :placeholder="t('add_funds.expiration_date')"
                                />
                            </div>
                            <div class="input-wrapper">
                                <input 
                                    type="text" 
                                    v-model="cvv" 
                                    class="form-input"
                                    :placeholder="t('add_funds.cvv')"
                                />
                            </div>
                        </div>
                        
                        <div class="payment-option" @click="paymentMethod = 'paypal'">
                            <div class="radio-circle" :class="{ active: paymentMethod === 'paypal' }">
                                <div class="radio-inner" v-if="paymentMethod === 'paypal'"></div>
                            </div>
                            <span class="payment-label">{{ t('add_funds.paypal') }}</span>
                        </div>
                    </div>
                    
                    <!-- Info Notes -->
                    <div class="info-notes">
                        <p>• {{ t('add_funds.info_processing') }}</p>
                        <p>• {{ t('add_funds.info_fee') }}</p>
                        <p>• {{ t('add_funds.info_minimum') }}</p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="action-buttons">
                        <button class="btn-cancel" @click="handleCancel">{{ t('add_funds.cancel') }}</button>
                        <button 
                            class="btn-add-funds" 
                            :class="{ disabled: !canSubmit }"
                            @click="handleAddFunds"
                        >
                            {{ t('add_funds.add_funds_btn') }}
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

.fee-row {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
}

.fee-row span {
    font-family: var(--font-montserrat);
    font-style: normal;
    font-weight: 400;
    font-size: 20px;
    line-height: 24px;
    color: var(--primary-100);
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

.card-fields {
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding-left: 41px;
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
    .fee-row span,
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
