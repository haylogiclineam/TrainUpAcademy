<script setup>
import {ref, computed, onMounted, nextTick} from "vue";
import api from "../../../services/api";

const activeStep = ref(0);
const userBalance = ref(0);
const availableWithdrawal = ref(0);
const earningsPending = ref(0);
const earningsCanceled = ref(0);
const earningsReceived = ref(0);
const totalEarning = ref(0);
const totalFee = ref(0);
const totalWithdrawn = ref(0);
const withdrawalsList = ref([]);

const steps = computed(() => [
    {
        title: "wallet.balance",
        items: [
            { text: "wallet.my_balance", price: `${Number(userBalance.value).toLocaleString()} ֏` },
        ],
    },
    {
        title: "wallet.available_withdrawal",
        items: [
            { text: "wallet.available_withdrawal_text", price: `${Number(availableWithdrawal.value).toLocaleString()} ֏` },
            // { text: "Total Withdrawn", price: `${Number(totalWithdrawn.value).toLocaleString()} ֏` },
        ],
    },
    {
        title: "wallet.earning_status",
        items: [
            { text: "wallet.earnings_pending", price: `${Number(earningsPending.value).toLocaleString()} ֏`, status: "pending" },
            { text: "wallet.earnings_canceled", price: `${Number(earningsCanceled.value).toLocaleString()} ֏`, status: "canceled" },
            { text: "wallet.earnings_received", price: `${Number(earningsReceived.value).toLocaleString()} ֏`, status: "received" },
            { text: "wallet.platform_fees", price: `${Number(totalFee.value).toLocaleString()} ֏`, status: "received" },
        ],
    },
    {
        title: "wallet.total_gross_earning",
        items: [
            { text: "wallet.total_gross_earning", price: `${Number(totalEarning.value).toLocaleString()} ֏` },
        ],
    }
]);

const statusLabel = (status) => {
    const map = {
        pending: 'wallet.status_pending',
        completed: 'wallet.status_completed',
        rejected: 'wallet.status_rejected',
    };
    return map[status] || status;
};

const statusClass = (status) => {
    const map = {
        pending: 'badge-pending',
        completed: 'badge-completed',
        rejected: 'badge-rejected',
    };
    return map[status] || '';
};


const tabTitles = ref([]);

const activeTabStyle = computed(() => {
    if (!tabTitles.value[activeStep.value]) return {};
    const width = tabTitles.value[activeStep.value].offsetWidth;
    return {
        width: `${width}px`,
        transition: 'width 0.4s ease, left 0.4s ease',
        left: `${tabTitles.value[activeStep.value].offsetLeft}px`,
        position: 'absolute',
        bottom: '0',
        height: '6px',
        borderRadius: '60px',
        backgroundColor: 'var(--primary-60)'
    };
});

const fetchInstructorData = async () => {
    try {
        const { data } = await api.get('/api/instructor/wallet/summary');
        if (data.success) {
            const summary = data.summary;
            userBalance.value = summary.current_balance;
            availableWithdrawal.value = summary.current_balance;
            earningsPending.value = summary.earnings_pending;
            earningsCanceled.value = summary.earnings_canceled;
            earningsReceived.value = summary.earnings_received;
            totalEarning.value = summary.total_gross;
            totalFee.value = summary.total_fee;
            totalWithdrawn.value = summary.total_withdrawn;
        }
    } catch (e) {
        console.error('Failed to fetch instructor data', e);
    }
};

const fetchWithdrawals = async () => {
    try {
        const { data } = await api.get('/api/instructor/wallet/withdrawals');
        if (data.success) {
            withdrawalsList.value = data.withdrawals;
        }
    } catch (e) {
        console.error('Failed to fetch withdrawals', e);
    }
};

onMounted(() => {
    fetchInstructorData();
    fetchWithdrawals();
    nextTick(() => {
        tabTitles.value = tabTitles.value.slice(0, steps.value.length);
    });
});

</script>

<template>
    <div class="my-wallet-section">
        <div class="container">
            <div class="my-wallet-main">
                <div class="d-flex justify-content-between align-items-center my-wallet-title-block">
                    <h3 class="text-capitalize my-wallet-section-title">{{ $t('wallet.title') }}</h3>
                    <div class="purchase-btn-web purchase-history-btn-div d-flex justify-content-center align-items-center">
                        <router-link to="/instructor/purchase-history"
                                     :class="{ active: $route.path === '/instructor/purchase-history' }">
                            <button class="purchase-history-btn text-capitalize">
                                {{ $t('wallet.purchase_history') }}
                            </button>
                        </router-link>
                    </div>
                </div>
                <div class="wallet-tabs">
                    <div class="w-100 tabs-web">
                        <div class="tabs-wrapper">
                            <div class="tabs" style="position: relative;">
                                <div
                                        v-for="(step, index) in steps"
                                        :key="index"
                                        class="tab-title-wrapper"
                                        @click="activeStep = index"
                                        ref="tabTitles"
                                >
                                    <div class="tab-title">{{ $t(step.title) }}</div>
                                </div>
                                <div :style="activeTabStyle"></div>
                            </div>

                            <div class="progress-full"></div>
                        </div>

                        <div class="content">
                            <div
                                    v-for="(item, index) in steps[activeStep]?.items ?? []"
                                    :key="index"
                                    class="wallet-box"
                                    :class="{ 'status-box': activeStep === 2 }"
                            >
                                <p class="wallet-text mb-0">
                                    {{ $t(item.text) }}
                                    <span
                                            class="wallet-amount"
                                            :class="{
                                  'wallet-balance': activeStep === 0,
                                  'available-withdrawal': activeStep === 1,
                                  'pending-earning': activeStep === 2 && item.status === 'pending',
                                  'canceled-earning': activeStep === 2 && item.status === 'canceled',
                                  'received-earning': activeStep === 2 && item.status === 'received',
                                  'total-earning': activeStep === 3
                                }" >
                                {{ item.price }}
                              </span>
                                </p>
                            </div>

                            <!-- Withdrawal Requests List (only in Earning Status tab) -->
                            <div v-if="activeStep === 2" class="withdrawals-list-section">
                                <h4 class="withdrawals-list-title">{{ $t('wallet.withdrawal_requests') }}</h4>

                                <div v-if="withdrawalsList.length === 0" class="no-withdrawals">
                                    {{ $t('wallet.no_withdrawals') }}
                                </div>

                                <div v-else class="withdrawals-table-wrapper">
                                    <table class="withdrawals-table">
                                        <thead>
                                        <tr>
                                            <th>{{ $t('wallet.date') }}</th>
                                            <th>{{ $t('wallet.amount') }}</th>
                                            <th>{{ $t('wallet.status') }}</th>
                                            <th>{{ $t('wallet.admin_notes') }}</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        <tr v-for="w in withdrawalsList" :key="w.id">
                                            <td>{{ w.created_at }}</td>
                                            <td class="withdrawal-amount">{{ Number(w.amount).toLocaleString() }} ֏</td>
                                            <td>
                                                <span class="status-badge" :class="statusClass(w.status)">
                                                    {{ $t(statusLabel(w.status)) }}
                                                </span>
                                            </td>
                                            <td>{{ w.admin_notes || '—' }}</td>
                                        </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div v-if="activeStep === 1" class="mt-3 withdraw-btn-div">
                                <router-link to="/instructor/withdraw-funds">
                                    <button class="withdraw-btn text-capitalize">{{ $t('wallet.withdraw') }}</button>
                                </router-link>
                            </div>
                        </div>
                    </div>
                    <div class="accordion-mobile d-none w-100">
                        <div
                                v-for="(step, index) in steps"
                                :key="index"
                                class="accordion-item">
                            <button
                                    class="accordion-header"
                                    @click="activeStep = activeStep === index ? null : index">
                                {{ $t(step.title) }}
                                <span class="arrow" :class="{ open: activeStep === index }">
                                <svg width="12" height="7" viewBox="0 0 12 7" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                  <path d="M11.5917 0.841713C11.5142 0.763606 11.422 0.701611 11.3205 0.659304C11.2189 0.616997 11.11 0.595215 11 0.595215C10.89 0.595215 10.7811 0.616997 10.6795 0.659304C10.578 0.701611 10.4858 0.763606 10.4083 0.841713L6.59168 4.65838C6.51421 4.73649 6.42204 4.79848 6.32049 4.84079C6.21894 4.8831 6.11002 4.90488 6.00001 4.90488C5.89 4.90488 5.78108 4.8831 5.67953 4.84079C5.57798 4.79848 5.48581 4.73649 5.40834 4.65838L1.59168 0.841713C1.51421 0.763606 1.42204 0.701611 1.32049 0.659304C1.21894 0.616997 1.11002 0.595215 1.00001 0.595215C0.889999 0.595215 0.781078 0.616997 0.679529 0.659304C0.577979 0.701611 0.485812 0.763606 0.408343 0.841713C0.253134 0.997849 0.166016 1.20906 0.166016 1.42921C0.166016 1.64937 0.253134 1.86058 0.408343 2.01671L4.23334 5.84171C4.70209 6.30988 5.33751 6.57285 6.00001 6.57285C6.66251 6.57285 7.29792 6.30988 7.76667 5.84171L11.5917 2.01671C11.7469 1.86058 11.834 1.64937 11.834 1.42921C11.834 1.20906 11.7469 0.997849 11.5917 0.841713Z"
                                        fill="#001028"/>
                                </svg>
                              </span>
                            </button>

                            <div v-if="activeStep === index" class="accordion-body">
                                <div
                                        v-for="(item, itemIndex) in step.items"
                                        :key="itemIndex"
                                        class="wallet-box mb-2"
                                        :class="{ 'status-box': index === 2 }">
                                    <p class="wallet-text mb-0">
                                        {{ $t(item.text) }}
                                        <span
                                                class="wallet-amount"
                                                :class="{
                                        'wallet-balance': index === 0,
                                        'available-withdrawal': index === 1,
                                        'pending-earning': index === 2 && item.status === 'pending',
                                        'canceled-earning': index === 2 && item.status === 'canceled',
                                        'received-earning': index === 2 && item.status === 'received',
                                        'total-earning': index === 3
                                      }">
                                      {{ item.price }}
                                    </span>
                                    </p>
                                </div>

                                <!-- Withdrawal Requests List (mobile accordion) -->
                                <div v-if="index === 2" class="withdrawals-list-section mt-3">
                                    <h4 class="withdrawals-list-title">{{ $t('wallet.withdrawal_requests') }}</h4>

                                    <div v-if="withdrawalsList.length === 0" class="no-withdrawals">
                                        {{ $t('wallet.no_withdrawals') }}
                                    </div>

                                    <div v-else class="withdrawals-cards-mobile">
                                        <div v-for="w in withdrawalsList" :key="w.id" class="withdrawal-card">
                                            <div class="withdrawal-card-row">
                                                <span class="withdrawal-card-label">{{ $t('wallet.date') }}</span>
                                                <span>{{ w.created_at }}</span>
                                            </div>
                                            <div class="withdrawal-card-row">
                                                <span class="withdrawal-card-label">{{ $t('wallet.amount') }}</span>
                                                <span class="withdrawal-amount">{{ Number(w.amount).toLocaleString() }} ֏</span>
                                            </div>
                                            <div class="withdrawal-card-row">
                                                <span class="withdrawal-card-label">{{ $t('wallet.status') }}</span>
                                                <span class="status-badge" :class="statusClass(w.status)">
                                                    {{ $t(statusLabel(w.status)) }}
                                                </span>
                                            </div>
                                            <div v-if="w.admin_notes" class="withdrawal-card-row">
                                                <span class="withdrawal-card-label">{{ $t('wallet.admin_notes') }}</span>
                                                <span>{{ w.admin_notes }}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div v-if="index === 1" class="mt-3 withdraw-btn-div">
                                    <router-link to="/instructor/withdraw-funds">
                                        <button class="withdraw-btn text-capitalize">{{ $t('wallet.withdraw') }}</button>
                                    </router-link>
                                </div>

                            </div>

                        </div>
                        <div class="purchase-btn-mobile d-none purchase-history-btn-div d-flex justify-content-center align-items-center">
                            <router-link to="/instructor/purchase-history"
                                         :class="{ active: $route.path === '/instructor/purchase-history' }">
                                <button class="purchase-history-btn text-capitalize">
                                    {{ $t('wallet.purchase_history') }}
                                </button>
                            </router-link>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.my-wallet-section {
    padding: 8% 0;
}

.my-wallet-section-title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-100);
}

.my-wallet-main {
    display: flex;
    flex-direction: column;
    gap: 60px;
}

.withdraw-btn,
.purchase-history-btn{
    gap: 10px;
    border-radius: 70px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 1px;
    color: var(--white-229);
    cursor: pointer;
    background: var(--general-btn);
    outline: none;
    border: none;
    text-transform: capitalize;
    white-space: nowrap;
    padding: 0 35px;
}

.withdraw-btn{
    height: 53px;
}

.purchase-history-btn {
    height: 53px;
}

.withdraw-btn-div{
    height: 56px;
    width: fit-content;
}

.purchase-history-btn-div {
    height: 56px;
    width: fit-content;
}


.tab-title {
    margin-bottom: 20px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 18px;
    line-height: normal;
    color: var(--primary-90);
}

.tab-title-wrapper:first-child .tab-title {
    text-align: left;
}

.tab-title-wrapper:nth-child(2) .tab-title {
    text-align: center;
}

.tab-title-wrapper:last-child .tab-title {
    text-align: right;
}

.content {
    gap: 2rem;
}

.tabs-wrapper {
    width: 100%;
    position: relative;
    margin-bottom: 2rem;
}

.tabs {
    display: flex;
    justify-content: space-between;
    position: relative;
    z-index: 1;
}

.tab-title-wrapper {
    position: relative;
    cursor: pointer;
}

.progress-full {
    position: absolute;
    bottom: 0;
    left: 0;
    height: 6px;
    width: 100%;
    background-color: var(--primary-20);
    border-radius: 60px;
    z-index: 0;
}
.wallet-box {
    width: 100%;
    border: 1px solid var(--white-245);
    border-radius: 8px;
    box-shadow: 0px 0px 6px 0px var(--box-shadow-0000001A);
    padding: 19px 25px;
    margin-bottom: 15px;
}

.wallet-text {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 18px;
    line-height: normal;
    color: var(--primary-100);
}

.wallet-amount {
    font-weight: 400;
    margin-left: 5px;
    font-family: var(--font-montserrat);
}

.wallet-amount.wallet-balance,
.wallet-amount.total-earning {
    color: var(--secondary-1-100);
}

.wallet-amount.pending-earning {
    color: #EBB364;
}

.wallet-amount.canceled-earning {
    color: #F06260;
}

.wallet-amount.received-earning {
    color: #59BF86;
}

.wallet-amount.available-withdrawal {
    color: var(--primary-90);
}

.wallet-box.status-box {
    background: #F5F5F5;
    border: 1px solid #F5F5F5;
    height: 62px;
    padding: 0 27px;
    display: flex;
    align-items: center;
    margin-bottom: 20px;
}

.status-box .wallet-text {
    color: #1A283E;
    font-weight: 500;
    line-height: 150%;
}

/* Withdrawals List Section */
.withdrawals-list-section {
    margin-top: 30px;
}

.withdrawals-list-title {
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 20px;
    color: var(--primary-100);
    margin-bottom: 20px;
}

.no-withdrawals {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 15px;
    color: var(--primary-60);
    background: #F5F5F5;
    border-radius: 8px;
    padding: 20px 25px;
    text-align: center;
}

.withdrawals-table-wrapper {
    overflow-x: auto;
    border-radius: 10px;
    border: 1px solid var(--white-245);
    box-shadow: 0px 0px 6px 0px var(--box-shadow-0000001A);
}

.withdrawals-table {
    width: 100%;
    border-collapse: collapse;
    font-family: var(--font-montserrat);
}

.withdrawals-table thead {
    background: #F5F5F5;
}

.withdrawals-table th {
    font-weight: 500;
    font-size: 14px;
    color: #1A283E;
    padding: 14px 20px;
    text-align: left;
    white-space: nowrap;
}

.withdrawals-table td {
    font-weight: 400;
    font-size: 14px;
    color: var(--primary-90);
    padding: 14px 20px;
    border-top: 1px solid #f0f0f0;
}

.withdrawals-table tbody tr:hover {
    background: #fafafa;
}

.withdrawal-amount {
    font-weight: 500;
    color: var(--primary-100);
}

.status-badge {
    display: inline-block;
    padding: 4px 14px;
    border-radius: 20px;
    font-size: 13px;
    font-weight: 500;
    white-space: nowrap;
}

.badge-pending {
    background: #FFF3E0;
    color: #E68A00;
}

.badge-completed {
    background: #E8F5E9;
    color: #2E7D32;
}

.badge-rejected {
    background: #FFEBEE;
    color: #C62828;
}

/* Mobile withdrawal cards */
.withdrawals-cards-mobile {
    display: flex;
    flex-direction: column;
    gap: 12px;
}

.withdrawal-card {
    background: #fff;
    border: 1px solid var(--white-245);
    border-radius: 10px;
    box-shadow: 0px 0px 6px 0px var(--box-shadow-0000001A);
    padding: 16px 20px;
}

.withdrawal-card-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 0;
    font-family: var(--font-montserrat);
    font-size: 14px;
    color: var(--primary-90);
}

.withdrawal-card-row:not(:last-child) {
    border-bottom: 1px solid #f0f0f0;
}

.withdrawal-card-label {
    font-weight: 500;
    color: #1A283E;
}

@media (max-width: 575px) {
    .my-wallet-main {
        gap: 60px;
    }

    .my-wallet-section-title {
        font-size: 22px;
        font-weight: 300;
    }

    .purchase-history-btn,
    .purchase-history-btn-div,
    .withdraw-btn,
    .withdraw-btn-div{
        width: fit-content;
        padding: 0 35px;
    }
}

@media (min-width: 576px) and (max-width: 767px) {
    .my-wallet-main {
        gap: 60px;
    }

    .my-wallet-section-title {
        font-size: 22px;
        font-weight: 300;
    }

    .purchase-history-btn,
    .purchase-history-btn-div,
    .withdraw-btn,
    .withdraw-btn-div{
        width: fit-content;
        padding: 0 35px;
    }
}

@media (min-width: 768px) and (max-width: 991px) {
    .my-wallet-main {
        gap: 60px;
    }

    .my-wallet-section-title {
        font-size: 22px;
        font-weight: 300;
    }

    .purchase-history-btn,
    .purchase-history-btn-div,
    .withdraw-btn,
    .withdraw-btn-div{
        width: fit-content;
        padding: 0 35px;
    }
}

@media (max-width: 991px) {
    .tabs-web {
        display: none !important;
    }

    .accordion-mobile {
        display: block !important;
    }

    .accordion-header {
        width: 100%;
        padding: 15px 0;
        background: none;
        border: none;
        cursor: pointer;
        display: flex;
        justify-content: space-between;
        align-items: center;
        font-family: var(--font-montserrat);
        font-weight: 400;
        font-size: 16px;
        line-height: normal;
        color: var(--primary-100);
    }

    .accordion-body {
        padding-bottom: 15px;
        font-family: var(--font-inter);
        font-weight: 300;
        font-size: 15px;
        line-height: normal;
        color: var(--primary-60);
    }

    .arrow {
        transition: transform 0.3s;
    }

    .accordion-body p {
        text-align: left;
    }

    .purchase-btn-web{
        display: none !important;
    }

    .purchase-btn-mobile{
        display: block !important;
    }

    .my-wallet-title-block{
        flex-direction: column;
    }

    .wallet-text{
        font-size: 16px;
    }

    .wallet-box{
        padding: 17px 25px;
    }

    .withdrawals-list-title {
        font-size: 17px;
    }
}


@media (min-width: 1200px) {
    .purchase-history-btn:hover {
        height: 56px;
        padding: 0 45px;
        font-size: 18px;
    }

    .withdraw-btn:hover {
        height: 56px;
        padding: 0 45px;
        font-size: 18px;
    }
}
</style>