<script setup>
import {ref, computed, onMounted, nextTick} from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const activeStep = ref(0);

const steps = computed(() => [
    {
        title: t('begin.step1.title'),
        text1: t('begin.step1.text1'),
        text2: t('begin.step1.text2'),
        image: "/assets/images/trainUp/howToBegin/step-1.png",
    },
    {
        title: t('begin.step2.title'),
        text1: t('begin.step2.text1'),
        text2: t('begin.step2.text2'),
        image: "/assets/images/trainUp/howToBegin/step-2.png",
    },
    {
        title: t('begin.step3.title'),
        text1: t('begin.step3.text1'),
        text2: t('begin.step3.text2'),
        image: "/assets/images/trainUp/howToBegin/step-3.png",
    },
]);

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
        tabTitles.value = tabTitles.value.slice(0, steps.value.length);
    });
});

</script>

<template>
    <div class="train-up-section">
        <div class="container">
            <div class="train-up-main">
                <div class="d-flex justify-content-between align-items-center train-up-content">
                    <h3 class="text-capitalize">{{ $t('teach_whit_us.why_teach') }}</h3>
                    <p>{{ $t('teach_whit_us.why_text') }}</p>
                    <div class="learn-more-btn-div d-flex justify-content-center align-items-center">
                        <a href="/assets/files/Teach%20On%20Train%20Up.pdf" download class="learn-more-btn text-center text-decoration-none d-flex align-items-center justify-content-center">
                            {{ $t('learn_more') }}
                        </a>
                    </div>
                </div>
                <div class="train-up-list">
                    <div class="items">
                        <div class="item d-flex flex-column align-items-center justify-content-center">
                            <svg width="85" height="72" viewBox="0 0 85 72" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M22.3611 2C22.3611 2 10.0946 2 10.0946 14.2883V28.185L2.5 35.8716L10.0946 43.4798V57.2979C10.0946 57.2979 10.0946 69.5862 22.3611 69.5862"
                                      stroke="url(#paint0_linear_2325_13840)" stroke-width="4" stroke-miterlimit="10"
                                      stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M62.6389 2C62.6389 2 74.9054 2 74.9054 14.2883V28.185L82.5 35.8716L74.9054 43.4798V57.2979C74.9054 57.2979 74.9054 69.5862 62.6389 69.5862"
                                      stroke="url(#paint1_linear_2325_13840)" stroke-width="4" stroke-miterlimit="10"
                                      stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M28.5257 24.1199L23.8333 33.0711L42.5001 59.2382L61.1669 33.0711L56.4744 24.1199H28.5257Z"
                                      stroke="#4BBBE4" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                                <path d="M36.3539 24.1199L34.2899 33.0711L42.4998 59.2382L50.7091 33.0711L48.6458 24.1199H36.3539Z"
                                      stroke="#4BBBE4" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                                <path d="M61.1669 33.0712H23.8333" stroke="#4BBBE4" stroke-width="4"
                                      stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M42.5 18.3487V12.3489" stroke="#4BBBE4" stroke-width="4" stroke-miterlimit="10"
                                      stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M36.9225 19.594L33.9282 14.3972" stroke="#4BBBE4" stroke-width="4"
                                      stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M48.0767 19.594L51.0716 14.3972" stroke="#4BBBE4" stroke-width="4"
                                      stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                <defs>
                                    <linearGradient id="paint0_linear_2325_13840" x1="25.1009" y1="-6.76712"
                                                    x2="63.6574" y2="17.0762" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#4BBBE4"/>
                                        <stop offset="0.182584" stop-color="#45B0D8"/>
                                        <stop offset="0.553562" stop-color="#3C9EC5"/>
                                        <stop offset="0.854126" stop-color="#318AAF"/>
                                        <stop offset="1" stop-color="#114D6D"/>
                                    </linearGradient>
                                    <linearGradient id="paint1_linear_2325_13840" x1="85.2398" y1="-6.76712"
                                                    x2="118.672" y2="16.5212" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#4BBBE4"/>
                                        <stop offset="0.182584" stop-color="#45B0D8"/>
                                        <stop offset="0.553562" stop-color="#3C9EC5"/>
                                        <stop offset="0.835411" stop-color="#318AAF"/>
                                        <stop offset="1" stop-color="#114D6D"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                            <h6 class="item-title mb-0">{{ $t('teach_whit_us.feature1') }}</h6>
                            <p class="item-p mb-0">{{ $t('teach_whit_us.feature1_text') }}</p>
                        </div>
                        <div class="item d-flex flex-column align-items-center justify-content-center">
                            <svg width="85" height="74" viewBox="0 0 85 74" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M37.1412 60.7159L34.5002 71.3913" stroke="#40AEC7" stroke-width="4"
                                      stroke-miterlimit="10" stroke-linecap="round"/>
                                <path d="M37.1412 60.7159L34.5002 71.3913" stroke="url(#paint0_linear_2331_13452)"
                                      stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"/>
                                <path d="M47.8587 60.7159L50.4998 71.3913" stroke="#40AEC7" stroke-width="4"
                                      stroke-miterlimit="10" stroke-linecap="round"/>
                                <path d="M47.8587 60.7159L50.4998 71.3913" stroke="url(#paint1_linear_2331_13452)"
                                      stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"/>
                                <path d="M27.135 71.3914H57.8647" stroke="#40AEC7" stroke-width="4"
                                      stroke-miterlimit="10" stroke-linecap="round"/>
                                <path d="M27.135 71.3914H57.8647" stroke="url(#paint2_linear_2331_13452)"
                                      stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"/>
                                <path d="M2.5 50.0405H75.8963" stroke="url(#paint3_linear_2331_13452)" stroke-width="4"
                                      stroke-miterlimit="10" stroke-linecap="round"/>
                                <path d="M71.84 26.0168L63.8381 20.6772V31.3558L71.84 26.0168Z" stroke="#4BBBE4"
                                      stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                                <path d="M46.6743 19.5259C48.9767 19.5186 50.8373 17.6445 50.8299 15.3401C50.8225 13.0357 48.95 11.1737 46.6476 11.181C44.3451 11.1884 42.4846 13.0624 42.4919 15.3668C42.4993 17.6712 44.3718 19.5333 46.6743 19.5259Z"
                                      stroke="#4BBBE4" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                                <path d="M42.5013 15.3412H34.4994C29.1662 15.3412 29.1662 26.0166 23.8329 26.0166"
                                      stroke="#4BBBE4" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                                <path d="M50.5064 36.6993H42.5046C37.1713 36.6993 37.1714 26.0239 31.8381 26.0239"
                                      stroke="#4BBBE4" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                                <path d="M63.8382 26.0171H15.8318C11.4702 26.0171 7.59735 23.9207 5.16528 20.6794"
                                      stroke="#4BBBE4" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                                <path d="M58.2121 32.836H50.5064V40.5481H58.2121V32.836Z" stroke="#4BBBE4"
                                      stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                                <path d="M2.5 12.6754C2.5 12.6754 2.5 2 13.1665 2H71.8335C71.8335 2 82.5 2 82.5 12.6754V50.0399C82.5 50.0399 82.5 60.7152 71.8335 60.7152H13.1665C13.1665 60.7152 2.5 60.7152 2.5 50.0399"
                                      stroke="#40AEC7" stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"/>
                                <path d="M2.5 12.6754C2.5 12.6754 2.5 2 13.1665 2H71.8335C71.8335 2 82.5 2 82.5 12.6754V50.0399C82.5 50.0399 82.5 60.7152 71.8335 60.7152H13.1665C13.1665 60.7152 2.5 60.7152 2.5 50.0399"
                                      stroke="url(#paint4_linear_2331_13452)" stroke-width="4" stroke-miterlimit="10"
                                      stroke-linecap="round"/>
                                <defs>
                                    <linearGradient id="paint0_linear_2331_13452" x1="37.5056" y1="59.3312" x2="42.4188"
                                                    y2="62.2125" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#4BBBE4"/>
                                        <stop offset="0.182584" stop-color="#45B0D8"/>
                                        <stop offset="0.553562" stop-color="#3C9EC5"/>
                                        <stop offset="0.835411" stop-color="#318AAF"/>
                                        <stop offset="1" stop-color="#114D6D"/>
                                    </linearGradient>
                                    <linearGradient id="paint1_linear_2331_13452" x1="50.8641" y1="59.3312" x2="55.7773"
                                                    y2="62.2125" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#4BBBE4"/>
                                        <stop offset="0.182584" stop-color="#45B0D8"/>
                                        <stop offset="0.553562" stop-color="#3C9EC5"/>
                                        <stop offset="0.835411" stop-color="#318AAF"/>
                                        <stop offset="1" stop-color="#114D6D"/>
                                    </linearGradient>
                                    <linearGradient id="paint2_linear_2331_13452" x1="81.7779" y1="71.5692" x2="82.1758"
                                                    y2="73.9297" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#4BBBE4"/>
                                        <stop offset="0.182584" stop-color="#45B0D8"/>
                                        <stop offset="0.553562" stop-color="#3C9EC5"/>
                                        <stop offset="0.835411" stop-color="#318AAF"/>
                                        <stop offset="1" stop-color="#114D6D"/>
                                    </linearGradient>
                                    <linearGradient id="paint3_linear_2331_13452" x1="83.7433" y1="53.2785" x2="84.0208"
                                                    y2="54.1111" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#4BBBE4"/>
                                        <stop offset="0.182584" stop-color="#45B0D8"/>
                                        <stop offset="0.553562" stop-color="#3C9EC5"/>
                                        <stop offset="0.835411" stop-color="#318AAF"/>
                                        <stop offset="1" stop-color="#114D6D"/>
                                    </linearGradient>
                                    <linearGradient id="paint4_linear_2331_13452" x1="-3.06911" y1="-4.55735"
                                                    x2="87.3974" y2="-54.7455" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#4BBBE4"/>
                                        <stop offset="0.438972" stop-color="#46B2DA"/>
                                        <stop offset="0.553562" stop-color="#3C9EC5"/>
                                        <stop offset="0.745502" stop-color="#45B0D8"/>
                                        <stop offset="0.835411" stop-color="#318AAF"/>
                                        <stop offset="1" stop-color="#114D6D"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                            <h6 class="item-title mb-0">{{ $t('teach_whit_us.feature2') }}</h6>
                            <p class="item-p mb-0">{{ $t('teach_whit_us.feature2_text') }}</p>
                        </div>
                        <div class="item d-flex flex-column align-items-center justify-content-center">
                            <svg width="85" height="85" viewBox="0 0 85 85" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M69.5774 27.5058L74.5316 17.52L67.0542 10.0071L57.1467 14.9848C55.3007 13.9958 53.3313 13.1604 51.3006 12.5734L47.793 2H37.2084L33.7008 12.5734C31.6701 13.1611 29.731 13.9958 27.885 14.9848L17.9465 10.0071L10.4691 17.52L15.4232 27.5058C14.4389 29.3607 13.6075 31.3083 13.0233 33.3494L4.60325 36.1692C3.34764 36.5897 2.5 37.7706 2.5 39.1009C2.5 40.8078 3.8768 42.1912 5.57561 42.1912H11.6106M15.4226 56.9069L10.4684 66.8616L17.9458 74.3745L27.8843 69.3968C29.7303 70.3858 31.6688 71.2212 33.7001 71.8081L37.2077 82.3816H47.7923L51.2999 71.8081C53.3305 71.2212 55.2999 70.3858 57.146 69.3968L67.0535 74.3745L74.5309 66.8616L69.5767 56.9069C70.5611 55.052 71.3925 53.0733 71.9767 51.0329L80.3967 48.2131C81.6523 47.7926 82.5 46.6117 82.5 45.2814C82.5 43.5745 81.1232 42.1912 79.4244 42.1912H73.3894"
                                      stroke="url(#paint0_linear_2333_13483)" stroke-width="4" stroke-miterlimit="10"
                                      stroke-linecap="round" stroke-linejoin="round"/>
                                <path d="M29.3751 32.4757L19.7057 42.1911L29.3751 51.9058" stroke="#4BBBE4"
                                      stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                                <path d="M55.6247 51.9058L65.2941 42.1911L55.6247 32.4757" stroke="#4BBBE4"
                                      stroke-width="4" stroke-miterlimit="10" stroke-linecap="round"
                                      stroke-linejoin="round"/>
                                <path d="M38.2343 51.9058L47.9036 32.4757" stroke="#4BBBE4" stroke-width="4"
                                      stroke-miterlimit="10" stroke-linecap="round" stroke-linejoin="round"/>
                                <defs>
                                    <linearGradient id="paint0_linear_2333_13483" x1="156.222" y1="-176.761"
                                                    x2="265.235" y2="-79.8675" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#4BBBE4"/>
                                        <stop offset="0.438972" stop-color="#46B2DA"/>
                                        <stop offset="0.553562" stop-color="#3C9EC5"/>
                                        <stop offset="0.745502" stop-color="#45B0D8"/>
                                        <stop offset="0.835411" stop-color="#318AAF"/>
                                        <stop offset="0.996347" stop-color="#114D6D"/>
                                    </linearGradient>
                                </defs>
                            </svg>
                            <h6 class="item-title mb-0">{{ $t('teach_whit_us.feature3') }}</h6>
                            <p class="item-p mb-0">{{ $t('teach_whit_us.feature3_text') }}</p>
                        </div>
                    </div>
                </div>
            </div>
            <div class="how-to-begin">
                <h2 class="title">{{ $t('begin.title') }}</h2>
                <div class="w-90 tabs-web">
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
                        <div class="text">
                            <p class="mb-0">{{ steps[activeStep ?? 0].text1 }}</p>
                            <p class="mb-0">{{ steps[activeStep ?? 0].text2 }}</p>
                        </div>
                        <div class="image">
                            <img :src="steps[activeStep ?? 0].image" alt=""/>
                        </div>
                    </div>
                </div>
                <div class="accordion-mobile d-none w-100">
                    <div
                            v-for="(step, index) in steps"
                            :key="index"
                            class="accordion-item"
                    >
                        <button
                                class="accordion-header"
                                @click="activeStep = activeStep === index ? null : index"
                        >
                            {{ step.title }}
                            <span class="arrow" :class="{ open: activeStep === index }">
                                <svg width="12" height="7" viewBox="0 0 12 7" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                <path d="M11.5917 0.841713C11.5142 0.763606 11.422 0.701611 11.3205 0.659304C11.2189 0.616997 11.11 0.595215 11 0.595215C10.89 0.595215 10.7811 0.616997 10.6795 0.659304C10.578 0.701611 10.4858 0.763606 10.4083 0.841713L6.59168 4.65838C6.51421 4.73649 6.42204 4.79848 6.32049 4.84079C6.21894 4.8831 6.11002 4.90488 6.00001 4.90488C5.89 4.90488 5.78108 4.8831 5.67953 4.84079C5.57798 4.79848 5.48581 4.73649 5.40834 4.65838L1.59168 0.841713C1.51421 0.763606 1.42204 0.701611 1.32049 0.659304C1.21894 0.616997 1.11002 0.595215 1.00001 0.595215C0.889999 0.595215 0.781078 0.616997 0.679529 0.659304C0.577979 0.701611 0.485812 0.763606 0.408343 0.841713C0.253134 0.997849 0.166016 1.20906 0.166016 1.42921C0.166016 1.64937 0.253134 1.86058 0.408343 2.01671L4.23334 5.84171C4.70209 6.30988 5.33751 6.57285 6.00001 6.57285C6.66251 6.57285 7.29792 6.30988 7.76667 5.84171L11.5917 2.01671C11.7469 1.86058 11.834 1.64937 11.834 1.42921C11.834 1.20906 11.7469 0.997849 11.5917 0.841713Z"
                                      fill="#001028"/>
                                </svg>
                            </span>
                        </button>

                        <div v-if="activeStep === index"
                             class="accordion-body">
                            <div class="image">
                                <img :src="steps[activeStep ?? 0].image" alt=""/>
                            </div>
                            <p class="mb-0">{{ steps[activeStep ?? 0].text1 }}</p>
                            <p class="mb-0">{{ steps[activeStep ?? 0].text2 }}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.train-up-section {
    padding: 8% 0;
    background-color: var(--secondary-2-10);
}

.train-up-main {
    display: flex;
    flex-direction: column;
    gap: 60px;
}

.train-up-content h3 {
    width: 29%;
}

.train-up-content h3,
.how-to-begin .title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-100);
}

.train-up-content p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-60);
    width: 39%;
}

.learn-more-btn {
    gap: 10px;
    border-radius: 70px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 1px;
    color: var(--white-229);
    cursor: pointer;
    width: 176px;
    height: 53px;
    background: var(--general-btn);
    outline: none;
    border: none;
    text-transform: capitalize;
}

.train-up-list .items {
    display: flex;
    flex-wrap: wrap;
    gap: 30px;
}

.train-up-list .item {
    flex: 0 0 calc((100% - (30px * 2)) / 3);
    max-width: calc((100% - (30px * 2)) / 3);
    gap: 20px;
}

.item-title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 20px;
    line-height: normal;
    color: var(--primary-100);
    text-align: center;
}

.item-p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    text-align: center;
    color: var(--primary-60)
}

.how-to-begin {
    margin: auto;
    text-align: center;
    padding-top: 100px;
    display: flex;
    flex-direction: column;
    gap: 60px;
    align-items: center;
}

.tab-title {
    margin-bottom: 20px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 22px;
    line-height: normal;
    color: var(--primary-100);
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
    display: flex;
    justify-content: space-between;
    gap: 2rem;
    text-align: left;
}

.text {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    width: 60%;
    color: var(--primary-60);
}

.image {
    width: calc(396px + (100vw - 1200px) * 0.2);
    max-width: 100%;
    height: 264px;
    min-width: 396px;
}

.image img {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    object-fit: cover;
}

.w-90 {
    width: 90%;
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

@media (max-width: 991px) {
    .train-up-section {
        padding: 70px 0 70px;
        background-position: center;
    }

    .train-up-content {
        flex-direction: column;
        gap: 20px;
    }

    .train-up-content p,
    .train-up-content h3,
    .how-to-begin .title {
        width: 100%;
        text-align: center;
    }

    .train-up-content h3,
    .how-to-begin .title {
        font-size: 22px;
    }

    .train-up-content p {
        font-size: 14px;
    }

    .learn-more-btn {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .train-up-list .items {
        flex-direction: column;
    }

    .train-up-list .item {
        max-width: 100%;
        gap: 10px;
    }

    .item svg {
        width: 60px;
    }

    .item-title {
        font-size: 18px;
    }

    .item-p {
        font-size: 16px;
    }

    .how-to-begin {
        padding-top: 50px;
    }

    .how-to-begin {
        gap: 20px;
    }

    .train-up-main {
        gap: 30px;
    }

    .tabs-web {
        display: none !important;
    }

    .accordion-mobile {
        display: block !important;
    }

    .accordion-item {
        border-bottom: 1px solid var(--primary-20);
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

    .image {
        width: 100%;
        max-width: 100%;
        height: 218px;
        min-width: 100%;
        margin-bottom: 10px;
    }

    .image img {
        width: 100%;
        height: 100%;
        border-radius: 16px;
        object-fit: cover;
    }

    .accordion-body p {
        text-align: left;
    }
}


/* Extra Large Devices */
@media (min-width: 1200px) {
    .learn-more-btn:hover {
        height: 56px;
        width: 186px;
        font-size: 18px;
    }

    .learn-more-btn-div {
        height: 56px;
        width: 186px;
    }
}

</style>