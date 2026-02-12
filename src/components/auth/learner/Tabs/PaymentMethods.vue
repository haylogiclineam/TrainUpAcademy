<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';
import { getUserCards, deleteCard } from '../../../../services/paymentService';

const { t } = useI18n();
const cards = ref([]);
const isLoading = ref(true);

const fetchCards = async () => {
    isLoading.value = true;
    try {
        const response = await getUserCards();
        if (response.data.success) {
            cards.value = response.data.cards;
        }
    } catch (error) {
        console.error('Failed to fetch cards:', error);
    } finally {
        isLoading.value = false;
    }
};

const handleDelete = async (cardId) => {
    if (!confirm(t('auth.paymentMethods.confirm_delete'))) return;
    
    try {
        const response = await deleteCard(cardId);
        if (response.data.success) {
            cards.value = cards.value.filter(c => c.id !== cardId);
        }
    } catch (error) {
        console.error('Failed to delete card:', error);
    }
};

onMounted(fetchCards);

</script>
<template>
    <div>
        <div class="settings-tab-header">
            <h3 class="settings-tab-h3 text-capitalize">{{ $t('auth.paymentMethods.title') }}</h3>
            <p class="settings-tab-p">{{ $t('auth.paymentMethods.subtitle') }}</p>
        </div>

        <form class="settings-tab-body">
            <div class="d-flex flex-column settings-detail-item">
                <p class="settings-tab-p p mb-0 text-capitalize">{{ $t('auth.paymentMethods.saved_methods') }}</p>

                <div v-if="cards.length > 0">
                    <div v-for="card in cards" :key="card.id" class="card-method">
                        <div class="card-details d-flex gap-3">
                            <!-- <div class="card-image d-flex align-items-center justify-content-center">
                                <span v-if="card.card_type === 'Visa'" class="visa-text">VISA</span>
                                <span v-else-if="card.card_type === 'Mastercard'" class="master-text">MC</span>
                                <img src="" alt="">
                            </div> -->
                            <span class="card-number">{{ card.card_pan }}</span>
                        </div>
                        <button type="button" class="delete-button" @click="handleDelete(card.id)">{{ t('auth.paymentMethods.delete_button') }}</button>
                    </div>
                </div>

                <div v-else-if="!isLoading" class="no-exist-card-method d-flex justify-content-center align-items-center">
                    <span class="text-center">{{ t('auth.paymentMethods.no_saved_methods') }}</span>
                </div>

                <div v-if="isLoading" class="text-center p-4">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>
            </div>
        </form>
    </div>
</template>

<style scoped>
.settings-tab-body label {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 20px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-100);
    margin-bottom: 15px;
}

.settings-btn-div {
    width: 100%;
    height: 53px;
    margin-top: 8%;
}

.settings-btn {
    width: 273px;
    height: 50px;
    border-radius: 25px;
    background: var(--general-btn-light);
    border: none;
    outline: none;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
}

.settings-detail-item {
    gap: 20px;
}

.card-image {
    width: 54px;
    height: 36px;
    background-color: var(--payment-method-bg);
    border-radius: 5px;
}

.card-image svg {
    width: 90%;
    height: 100%;
    object-fit: cover;
}

.card-method {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 1rem;
    border-width: 0.5px;
    border-style: solid;
    border-color: var(--primary-50);
    border-radius: 10px;
    background-color: #fff;
    margin-bottom: 1rem;
    box-sizing: border-box;
    -webkit-appearance: none;
}

.card-details {
    display: flex;
    align-items: center;
}

.delete-button {
    padding: 10px;
    border: 1px solid var(--required);
    background-color: transparent;
    color: var(--required);
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    min-width: 15%;
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 14px;
    line-height: normal;
    letter-spacing: 2%;
    text-align: center;
}

.no-exist-card-method{
    border-radius: 8px;
    min-height: 165px;
    background-image: url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='8' ry='8' stroke='%23808793FF' stroke-width='2' stroke-dasharray='7%2c 16' stroke-dashoffset='8' stroke-linecap='round'/%3e%3c/svg%3e");
}

.no-exist-card-method span{
    font-family: var(--font-montserrat);
    font-weight: 300;
    font-size: 20px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-90);
}

.card-number{
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-90);
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .settings-tab-body label{
        font-size: 14px;
    }

    .p{
       font-size: 18px;
    }

    .card-method{
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
    }

    .delete-button{
        min-width: 40%;
    }

    .no-exist-card-method span{
        font-size: 16px;
        width: 80%;
    }

    .no-exist-card-method {
        min-height: 120px;
    }
    .card-image {
        width: 44px;
        height: 29px;
    }

    .card-number{
        font-size: 14px;
    }
}

@media (min-width: 575px) and (max-width: 991px) {
    .settings-tab-body label{
        font-size: 14px;
    }

    .p{
        font-size: 18px;
    }

    .no-exist-card-method span{
        font-size: 16px;
        width: 80%;
    }

    .no-exist-card-method {
        min-height: 120px;
    }
}

/* Extra Large Devices */
@media (min-width: 1000px) {
    .settings-btn:hover {
        width: 283px;
        height: 53px;
        font-size: 20px;
    }

    .delete-button:hover {
        background-color: var(--payment-method-delete-btn-hover);
    }

}

</style>

