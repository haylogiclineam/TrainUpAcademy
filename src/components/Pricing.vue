<script setup>
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '/src/services/api.js'
import 'vue3-carousel/carousel.css'
import {Carousel, Slide, Navigation} from 'vue3-carousel'

const carouselRef = ref(null)
const pricingItems = ref([])
const currentSlide = ref(0)
const itemsToShow = ref(3)
const { t, locale } = useI18n()
const hoveredIndex = ref(null)
const loading = ref(false);

const isDesktop = ref(window.innerWidth >= 1200)

function updateItemsToShow() {
    const width = window.innerWidth
    isDesktop.value = width >= 1200

    if (width < 576) itemsToShow.value = 1
    else if (width < 992) itemsToShow.value = 1
    else itemsToShow.value = 3
}

onMounted(async () => {
    loading.value = true;
    try {
        const response = await api.get('/api/pricing')
        pricingItems.value = response.data
    } catch (error) {
        console.error('Failed to fetch pricing:', error)
        fetchError.value = true
    }finally {
        loading.value = false;
    }
    updateItemsToShow()
    window.addEventListener('resize', updateItemsToShow)
})

const getCurrencySymbol = (code) => {
    const symbols = { USD: '$', RUB: '₽', AMD: '֏' }
    return symbols[code] || code
}
</script>

<template>
    <div class="pricing-section">
        <div class="container">
            <div class="pricing-main d-flex flex-column align-items-center position-relative">
                <div class="pricing-title">
                    <h3 class="text-capitalize">Our Pricing</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                </div>
                <div v-if="loading" class="d-flex justify-content-center align-items-center my-5">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <Carousel v-else
                    ref="carouselRef"
                    v-model:currentSlide="currentSlide"
                    :wrapAround="true"
                    :autoplay="6000"
                    :itemsToShow="itemsToShow"
                    :transition="700"
                    class="slider-block w-100"
                >
                    <Slide v-for="(item, index) in pricingItems" :key="index">
                        <div
                            class="custom-slide"
                            @mouseover="hoveredIndex = index"
                            @mouseleave="hoveredIndex = null"
                            :class="{ 'slide-active': hoveredIndex === index && isDesktop }">
                            <p v-if="hoveredIndex === index && isDesktop" class="text-capitalize active-title">Lorem Ipsum</p>
                            <div :class="{ 'slide-active-content': hoveredIndex === index && isDesktop }">
                                <div class="slide-content">
                                    <div class="enroll-more-btn-div d-flex justify-content-center">
                                        <button class="enroll-more-btn text-capitalize">{{ $t('enroll_now') }}</button>
                                    </div>
                                    <div class="package-detail">
                                        <h3 class="h3">{{ item[`title_${locale}`] }}</h3>
                                        <p class="p">{{ item[`description_${locale}`] }}</p>
                                        <h4 class="h4">
                                            {{ getCurrencySymbol(item[`currency_${locale}`]) }}
                                            {{ item[`price_${locale}`] }}/{{ item[`unit_${locale}`] }}
                                        </h4>
                                    </div>
                                    <div class="line"></div>
                                    <div class="package-include">
                                        <p class="package-include-title">{{ $t('package_include') }}</p>
                                        <div
                                            v-for="(feature, aIndex) in item.features"
                                            :key="aIndex"
                                            class="include-item d-flex flex-column">
                                            <div class="d-flex align-items-center">
                                                <img src="/assets/icons/pricing/checkmark.svg" alt="checkmark" />
                                                <span class="span">{{ feature[`feature_${locale}`] }}</span>
                                            </div>
                                            <div class="line"></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Slide>

                    <template #addons>
                        <Navigation />
                    </template>
                </Carousel>

            </div>
        </div>
    </div>
</template>

<style scoped>
.pricing-section {
    padding: 8% 0;
    background-image: url("/assets/images/repeting-image.jpg");
    background-size: cover;
    position: relative;
    margin-bottom: 8%;
}

.pricing-section:before {
    content: "";
    top: 0;
    left: 0;
    background: var(--pricing-bg);
    width: 100%;
    height: 100%;
    position: absolute;
}

.pricing-main {
    gap: 30px;
}

.pricing-title {
    width: 42%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.pricing-title h3 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    text-align: center;
    color: var(--white-245);
    margin: 0;
}

.pricing-title p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    text-align: center;
    color: var(--primary-10);
}

.slider-block {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 60px;
}

.custom-slide {
    min-height: 501px;
    border-radius: 16px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border: 1px solid var(--secondary-1-100);
    padding: 15px 23px 17px;
}

.next-prev svg {
    cursor: pointer !important;
}

.next-prev svg:hover path {
    fill: var(--primary-50) !important;
    animation-timing-function: ease-out;
    animation-duration: 200ms;

}

.enroll-more-btn {
    gap: 10px;
    border-radius: 70px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 1px;
    color: var(--white-229);
    cursor: pointer;
    width: 163px;
    height: 47px;
    background: var(--general-btn);
    border: none;
    outline: none;
}

.enroll-more-btn:hover {
    height: 50px;
    width: 173px;
    font-size: 18px;
}

.enroll-more-btn-div {
    height: 50px;
    width: 173px;
}

.package-detail {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.package-detail .h3,
.package-detail .h4,
.package-detail .p {
    font-weight: 300;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--white-245);
}

.package-detail .h3 {
    font-family: var(--font-montserrat);
    font-size: 24px;
    margin: 0;
}

.package-detail .p {
    font-family: var(--font-inter);
    font-size: 16px;
    margin: 0;
}

.package-detail .h4 {
    font-family: var(--font-montserrat);
    font-size: 34px;
    margin: 0;
}

.slide-content {
    gap: 18px;
    display: flex;
    flex-direction: column;
    padding: 25px;
    border-radius: 16px;
    position: relative;
    z-index: 1;
    height: 100%;
    width: 100%;
}

.line {
    border-width: 0.5px;
    border-style: solid;
    box-sizing: border-box;
    border-color: var(--secondary-1-100) !important;
}

.package-include-title,
.package-include .p {
    font-weight: 300;
    line-height: normal;
    letter-spacing: 0%;

}

.package-include-title {
    font-family: var(--font-montserrat);
    font-size: 18px;
    color: var(--white-245);
}

.package-include .span {
    font-family: var(--font-inter);
    font-size: 16px;
    color: var(--primary-60);
}

.package-include img {
    margin-right: 10px;
}

.include-item {
    gap: 20px;
    margin-top: 6%;
}

.include-item:last-child .line {
    display: none;
}

.active-title {
    font-family: var(--font-inter);
    color: var(--primary-10);
    font-weight: 300;
}

.slide-active {
    background: var(--pricing-slider-border);
    border-radius: 16px;
    background-clip: padding-box !important;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 15px 23px 17px;
    flex-direction: column;
    transform: scale(1.05);
    transition: all 0.3s ease-in-out;
    border: unset;
    cursor: pointer;
}

.slide-active p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-10);
}

.slide-active-content {
    width: 330px;
    min-height: 501px;
    background: var(--primary-100);
    border-radius: 16px;
}

:deep(.carousel__slide) {
    align-items: unset !important;
}

:deep(.carousel__icon) {
    fill: #dee2e6 !important;

}

:deep(.carousel__next),
:deep(.carousel__prev){
    background-color: var(--primary-60);
    border-radius: 50%;
}

:deep(.carousel__next){
    right: -5%;
}

:deep(.carousel__prev){
   left: -5%;
}


/* Extra Small Devices */
@media (max-width: 575px) {
    .pricing-section {
        padding: 18% 0 13%;
        margin-bottom: 18%;
    }

    .pricing-title {
        width: 100%;
    }

    .pricing-title h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .pricing-title p {
        font-size: 14px;
    }

    .slider-circle-block svg {
        width: 12px;
        height: 12px;
    }

    .next-prev svg {
        width: 30px;
        height: 30px;
    }

    .slide-active,
    .slide-active-content{
        width: 100%;
    }

    .pricing-main{
        gap: 40px;
    }
    .enroll-more-btn,
    .enroll-more-btn-div{
        width: 100%;
    }

    .enroll-more-btn:hover{
        width: 100%;
        background: var(--general-btn);
        height: 47px;
    }

    .enroll-more-btn,
    .package-detail .h3{
        font-size: 18px;
        text-align: center;
    }

    .package-detail .p{
        font-size: 14px;
        text-align: center;
    }

    .slide-active{
        border-radius: 8px;
    }

    .slide-content{
        padding: 25px 11px;
    }

    .package-detail .h4{
        font-size: 22px;
        text-align: center;
    }

    .slide-active-content{
        min-height: 270px !important;
    }

    .slide-active p{
        text-align: center;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .pricing-section {
        padding: 10% 0 8%;
        margin-bottom: 10%;
    }

    .pricing-title {
        width: 100%;
    }

    .pricing-title h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .pricing-title p {
        font-size: 14px;
    }

    .slider-circle-block svg {
        width: 12px;
        height: 12px;
    }

    .next-prev svg {
        width: 30px;
        height: 30px;
    }

    .slide-active,
    .slide-active-content{
        width: 100%;
    }

    .pricing-main{
        gap: 40px;
    }
    .enroll-more-btn,
    .enroll-more-btn-div{
        width: 100%;
    }

    .enroll-more-btn:hover{
        width: 100%;
        background: var(--general-btn);
        height: 47px;
    }

    .enroll-more-btn,
    .package-detail .h3{
        font-size: 18px;
        text-align: center;
    }

    .package-detail .p{
        font-size: 14px;
        text-align: center;
    }

    .slide-active{
        border-radius: 8px;
    }

    .slide-content{
        padding: 25px 11px;
    }

    .package-detail .h4{
        font-size: 22px;
        text-align: center;
    }

    .slide-active-content{
        min-height: 270px !important;
    }

    .slide-active p{
        text-align: center;
    }

    .w-100{
        width: 78% !important;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .pricing-section {
        padding: 10% 0 8%;
        margin-bottom: 10%;
    }

    .pricing-title {
        width: 100%;
    }

    .pricing-title h3 {
        font-size: 38px;
        font-weight: 300;
    }

    .pricing-title p {
        font-size: 16px;
    }

    .slider-circle-block svg {
        width: 14px;
        height: 14px;
    }

    .next-prev svg {
        width: 34px;
        height: 34px;
    }

    .slide-active,
    .slide-active-content{
        width: 100%;
    }

    .pricing-main{
        gap: 35px;
    }
    .enroll-more-btn,
    .enroll-more-btn-div{
        width: 100%;
    }

    .enroll-more-btn:hover{
        width: 100%;
        background: var(--general-btn);
        height: 47px;
    }

    .enroll-more-btn,
    .package-detail .h3{
        font-size: 20px;
        text-align: center;
    }

    .package-detail .p{
        font-size: 16px;
        text-align: center;
    }

    .slide-active{
        border-radius: 8px;
    }

    .slide-content{
        padding: 25px 11px;
    }

    .package-detail .h4{
        font-size: 22px;
        text-align: center;
    }

    .slide-active-content{
        min-height: 270px !important;
    }

    .slide-active p{
        text-align: center;
        font-size: 18px;
    }

    .w-100{
        width: 68% !important;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .w-100{
        gap:10px;
    }

    .custom-slide{
        width: 95%;
    }

    .slide-active{
        width: 337px;
    }

    .slide-active-content{
        width: 100%;
    }

    .package-detail .h4{
        font-size: 30px;
    }
}


/* Extra Large Devices */
@media (min-width: 1200px) {
    .w-100{
        gap:30px;
    }
    .custom-slide{
        width: 94%;
    }

    :deep(.carousel__next){
        right: -2%;
    }

    :deep(.carousel__prev ){
        left: -2%;
    }

    :deep(.carousel__viewport) {
        min-height: 700px !important;
        padding: 45px 0 !important;
    }

    :deep(.carousel) {
        min-height: 700px !important;
    }
}

/* Extra Large Devices */
@media (min-width: 1600px) {
    .custom-slide{
        width: 75%;
    }

    .slide-active{
        width:95%;
    }

    .slide-active-content{
        width: 100%;
    }

    .slide-content{
        padding: 32px;
        gap:44px;
    }

    :deep(.carousel__viewport) {
        min-height: 700px !important;
        padding: 45px 0 !important;
    }

    :deep(.carousel) {
        min-height: 700px !important;
    }

}


</style>