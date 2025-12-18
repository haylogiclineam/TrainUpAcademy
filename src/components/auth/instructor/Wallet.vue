<script setup>
import {ref, computed, onMounted, nextTick} from "vue";

const activeStep = ref(0);

const steps = [
    {
        title: "Wallet Balance",
        items: [
            { text: "Your Wallet Balance:", price: "$ 1200" },
        ],
    },
    {
        title: "Available for Withdrawal",
        items: [
            { text: "Available for Withdrawal:", price: "$ 1500" },
        ],
    },
    {
        title: "Earning Status",
        items: [
            { text: "Earnings are pending: ", price: "$ 1500", status: "pending" },
            { text: "Earnings were canceled: ", price: "$ 1500", status: "canceled" },
            { text: "Earnings received: ", price: "$ 1500", status: "received" },
        ],
    },
    {
        title: "Total Earning",
        items: [
            { text: "Your Total Earning:", price: "$ 1500" },
        ],
    }
];


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

onMounted(() => {
    nextTick(() => {
        tabTitles.value = tabTitles.value.slice(0, steps.length);
    });
});

</script>

<template>
    <div class="my-wallet-section">
        <div class="container">
            <div class="my-wallet-main">
                <div class="d-flex justify-content-between align-items-center my-wallet-title-block">
                    <h3 class="text-capitalize my-wallet-section-title">Wallet</h3>
                    <div class="purchase-btn-web purchase-history-btn-div d-flex justify-content-center align-items-center">
                        <router-link to="/instructor/purchase-history"
                                     :class="{ active: $route.path === '/instructor/purchase-history' }">
                            <button class="purchase-history-btn text-capitalize">
                                Purchase history
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
                                    <div class="tab-title">{{ step.title }}</div>
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
                                    {{ item.text }}
                                    <span
                                            class="wallet-amount"
                                            :class="{
                                  'wallet-balance': activeStep === 0,
                                  'total-earning': activeStep === 1,
                                  'pending-earning': activeStep === 2 && item.status === 'pending',
                                  'canceled-earning': activeStep === 2 && item.status === 'canceled',
                                  'received-earning': activeStep === 2 && item.status === 'received',
                                  'available-withdrawal': activeStep === 3
                                }" >
                                {{ item.price }}
                              </span>
                                </p>
                            </div>

                            <div v-if="activeStep !== null && activeStep === steps.length - 1" class="mt-3 withdraw-btn-div">
                                <router-link to="/instructor/withdraw-funds">
                                    <button class="withdraw-btn text-capitalize">Withdraw</button>
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
                                {{ step.title }}
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
                                        {{ item.text }}
                                        <span
                                                class="wallet-amount"
                                                :class="{
                                        'wallet-balance': index === 0,
                                        'total-earning': index === 1,
                                        'pending-earning': index === 2 && item.status === 'pending',
                                        'canceled-earning': index === 2 && item.status === 'canceled',
                                        'received-earning': index === 2 && item.status === 'received',
                                        'available-withdrawal': index === 3
                                      }">
                                      {{ item.price }}
                                    </span>
                                    </p>
                                </div>

                                <div v-if="index === steps.length - 1" class="mt-3 withdraw-btn-div">
                                    <router-link to="/instructor/withdraw-funds">
                                        <button class="withdraw-btn text-capitalize">Withdraw</button>
                                    </router-link>
                                </div>

                            </div>

                        </div>
                        <div class="purchase-btn-mobile d-none purchase-history-btn-div d-flex justify-content-center align-items-center">
                            <router-link to="/instructor/purchase-history"
                                         :class="{ active: $route.path === '/instructor/purchase-history' }">
                                <button class="purchase-history-btn text-capitalize">
                                    Purchase history
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
}

.withdraw-btn{
    width: 273px;
    height: 53px;
}

.purchase-history-btn {
    width: 219px;
    height: 53px;
}

.withdraw-btn-div{
    height: 56px;
    width: 278px;
}

.purchase-history-btn-div {
    height: 56px;
    width: 223px;
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
        width: 100%;
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
        width: 70%;
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
        width: 70%;
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
}


@media (min-width: 1200px) {
    .purchase-history-btn:hover {
        height: 56px;
        width: 223px;
        font-size: 18px;
    }

    .withdraw-btn:hover {
        height: 56px;
        width: 278px;
        font-size: 18px;
    }
}
</style>