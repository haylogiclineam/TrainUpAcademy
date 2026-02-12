<script setup>
import { ref, computed, onMounted } from "vue";
import api from "../../../services/api";
import { useRouter } from "vue-router";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const router = useRouter();

const availableBalance = ref(0);
const withdrawAmount = ref('');
const paymentMethod = ref('bank');

// Bank transfer fields
const bankName = ref('');
const accountHolderName = ref('');
const accountNumber = ref('');

const platformFeePercent = 0;



const isValidAmount = computed(() => {
    const amount = parseFloat(withdrawAmount.value) || 0;
    return amount >= 20 && amount <= availableBalance.value;
});

const canSubmit = computed(() => {
    if (!isValidAmount.value) return false;
    if (paymentMethod.value === 'bank') {
        return bankName.value && accountHolderName.value && accountNumber.value;
    }
    return true;
});

const handleCancel = () => {
    router.push('/instructor/wallet');
};

const fetchBalance = async () => {
    try {
        const { data } = await api.get('/api/instructor/wallet/summary');
        if (data.success) {
            availableBalance.value = data.summary.current_balance;
        }
    } catch (e) {
        console.error('Failed to fetch balance', e);
    }
};

onMounted(() => {
    fetchBalance();
});

const handleWithdraw = async () => {
    if (!canSubmit.value) return;
    
    try {
        const response = await api.post('/api/instructor/wallet/withdraw', {
            amount: parseFloat(withdrawAmount.value),
            payment_method: paymentMethod.value,
            payment_details: {
                bankName: bankName.value,
                accountHolderName: accountHolderName.value,
                accountNumber: accountNumber.value
            }
        });

        if (response.data.success) {
            alert('Withdrawal request submitted successfully');
            router.push('/instructor/wallet');
        }
    } catch (err) {
        alert(err.response?.data?.message || 'Failed to submit withdrawal request');
    }
};
</script>

<template>
    <div class="withdraw-funds-section">
        <div class="container">
            <div class="withdraw-funds-main">
                <h1 class="withdraw-title">{{ t('withdraw_funds.title') }}</h1>
                
                <p class="available-balance">{{ t('withdraw_funds.available_balance') }}: {{ availableBalance.toLocaleString() }} ֏</p>
                
                <div class="form-section">
                    <label class="section-label">{{ t('withdraw_funds.amount_to_withdraw') }}</label>
                    <div class="input-wrapper">
                        <input 
                            type="text" 
                            v-model="withdrawAmount" 
                            class="form-input amount-input"
                            :placeholder="t('withdraw_funds.amount_placeholder')"
                        />
                    </div>
                    
                    <div class="amount-limits">
                        <span>{{ t('withdraw_funds.minimum') }}</span>
                        <span class="dot"></span>
                        <span>{{ t('withdraw_funds.maximum') }}</span>
                    </div>
                    

                    
                    <!-- Payment Method Selection -->
                    <div class="payment-method-section">
                        <div class="payment-option" @click="paymentMethod = 'bank'">
                            <div class="radio-circle" :class="{ active: paymentMethod === 'bank' }">
                                <div class="radio-inner" v-if="paymentMethod === 'bank'"></div>
                            </div>
                            <span class="payment-label">{{ t('withdraw_funds.bank_transfer') }}</span>
                        </div>
                        
                        <!-- Bank Transfer Fields -->
                        <div v-if="paymentMethod === 'bank'" class="bank-fields">
                            <div class="input-wrapper">
                                <input 
                                    type="text" 
                                    v-model="bankName" 
                                    class="form-input"
                                    :placeholder="t('withdraw_funds.bank_name')"
                                />
                            </div>
                            <div class="input-wrapper">
                                <input 
                                    type="text" 
                                    v-model="accountHolderName" 
                                    class="form-input"
                                    :placeholder="t('withdraw_funds.account_holder_name')"
                                />
                            </div>
                            <div class="input-wrapper">
                                <input 
                                    type="text" 
                                    v-model="accountNumber" 
                                    class="form-input"
                                    :placeholder="t('withdraw_funds.account_number')"
                                />
                            </div>
                        </div>
                    </div>
                    
                    <!-- Info Notes -->
                    <div class="info-notes">
                        <p>• {{ t('withdraw_funds.info_processing') }}</p>

                        <p>• {{ t('withdraw_funds.info_minimum') }}</p>
                    </div>
                    
                    <!-- Action Buttons -->
                    <div class="action-buttons">
                        <button class="btn-cancel" @click="handleCancel">{{ t('withdraw_funds.cancel') }}</button>
                        <button 
                            class="btn-withdraw" 
                            :class="{ disabled: !canSubmit }"
                            @click="handleWithdraw"
                        >
                            {{ t('withdraw_funds.request_withdrawal') }}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.withdraw-funds-section {
    padding: 8% 0;
    background: var(--white-245);
    min-height: 100vh;
}

.withdraw-funds-main {
    max-width: 635px;
}

.withdraw-title {
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

.bank-fields {
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

.btn-withdraw {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 15px 40px;
    gap: 10px;
    width: 267px;
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

.btn-withdraw.disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.btn-cancel:hover {
    opacity: 0.9;
}

.btn-withdraw:hover:not(.disabled) {
    opacity: 0.9;
}

@media (max-width: 767px) {
    .withdraw-title {
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
    .btn-withdraw {
        width: 100%;
    }
    
    .bank-fields {
        padding-left: 0;
    }
}
</style>
