<script setup>
import { ref, onMounted, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '/src/services/api.js'
import { Swiper, SwiperSlide } from 'swiper/vue'
import { Navigation, Autoplay } from 'swiper/modules'
import 'swiper/css'
import 'swiper/css/navigation'

const swiperRef = ref(null)
const swiperModules = [Navigation, Autoplay]
const pricingItems = ref([])
const activeIndex = ref(0)
const { t, locale } = useI18n()
const loading = ref(false)

// Dynamic definition of loop possibility
const canLoop = computed(() => pricingItems.value.length >= 3)

const onSwiper = (swiper) => {
    swiperRef.value = swiper
    activeIndex.value = swiper.realIndex
}

const onSlideChange = (swiper) => {
    activeIndex.value = swiper.realIndex
}

const goToPrev = () => {
    if (swiperRef.value) swiperRef.value.slidePrev()
}

const goToNext = () => {
    if (swiperRef.value) swiperRef.value.slideNext()
}

onMounted(async () => {
    loading.value = true
    try {
        const response = await api.get('/api/pricing')
        pricingItems.value = response.data
    } catch (error) {
        console.error('Error loading pricing:', error)
    } finally {
        loading.value = false
    }
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
                    <h3 class="text-capitalize">{{ $t('pricing.title') }}</h3>
                    <p>{{ $t('pricing.description') }}</p>
                </div>
                <div v-if="loading" class="d-flex justify-content-center align-items-center my-5">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="visually-hidden">{{ $t('loading') }}...</span>
                    </div>
                </div>
                <div v-else class="pricing-swiper-wrapper">
                    <Swiper
                        :modules="swiperModules"
                        :slides-per-view="3"
                        :space-between="19"
                        :centered-slides="true"
                        :loop="canLoop"
                        :autoplay="canLoop ? {
                            delay: 6000,
                            disableOnInteraction: false
                        } : false"
                        :speed="700"
                        :breakpoints="{
                            0: {
                                slidesPerView: 1,
                                spaceBetween: 10,
                                centeredSlides: true
                            },
                            576: {
                                slidesPerView: 1.2,
                                spaceBetween: 15,
                                centeredSlides: true
                            },
                            992: {
                                slidesPerView: 2,
                                spaceBetween: 19,
                                centeredSlides: true
                            },
                            1200: {
                                slidesPerView: 3,
                                spaceBetween: 19,
                                centeredSlides: true
                            }
                        }"
                        @swiper="onSwiper"
                        @slideChange="onSlideChange"
                        class="pricing-swiper"
                    >
                        <SwiperSlide v-for="(item, index) in pricingItems" :key="index">
                            <div
                                class="pricing-slide"
                                :class="{ 'pricing-slide-active': pricingItems.length === 1 || activeIndex === index }"
                            >
                                <div class="pricing-slide-inner" :class="{ 'active-inner': pricingItems.length === 1 || activeIndex === index }">
                                    <div class="slide-content">
                                        <div class="enroll-btn-wrapper">
                                            <button class="enroll-btn">{{ $t('enroll_now') }}</button>
                                        </div>
                                        <div class="package-info">
                                            <h3 class="package-title">{{ item[`title_${locale}`] }}</h3>
                                            <div class="package-desc" v-html="item[`description_${locale}`]"></div>
                                            <h4 class="package-price">
                                                {{ getCurrencySymbol(item[`currency_${locale}`]) }}
                                                {{ item[`price_${locale}`] }}/{{ item[`unit_${locale}`] }}
                                            </h4>
                                        </div>
                                        <div class="divider"></div>
                                        <div class="features-section">
                                            <p class="features-title">{{ $t('package_include') }}</p>
                                            <div
                                                v-for="(feature, fIndex) in item.features"
                                                :key="fIndex"
                                                class="feature-item"
                                            >
                                                <div class="feature-row">
                                                    <img src="/assets/icons/pricing/checkmark.svg" alt="checkmark" />
                                                    <span class="feature-text">{{ feature[`feature_${locale}`] }}</span>
                                                </div>
                                                <div v-if="fIndex < item.features.length - 1" class="divider"></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </SwiperSlide>
                    </Swiper>

                    <!-- Navigation and pagination -->
                    <div class="pricing-controls">
                        <div class="pricing-nav">
                            <button class="nav-btn nav-prev" @click="goToPrev" aria-label="Previous">
                                <img src="/assets/icons/pricing/prev.svg" alt="Previous" />
                            </button>
                            <button class="nav-btn nav-next" @click="goToNext" aria-label="Next">
                                <img src="/assets/icons/pricing/next.svg" alt="Next" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.pricing-section {
    padding: 100px 0;
    background-image: url("/assets/images/repeting-image.jpg");
    background-size: cover;
    position: relative;
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
    gap: 50px;
}

.pricing-title {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 20px;
    max-width: 524px;
    text-align: center;
}

.pricing-title h3 {
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 42px;
    line-height: 51px;
    letter-spacing: 0.02em;
    color: #F5F5F5;
    margin: 0;
}

.pricing-title p {
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    color: #E5E7E9;
    margin: 0;
}

.pricing-swiper-wrapper {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 50px;
    overflow: hidden;
}

.pricing-swiper {
    width: 100%;
    padding: 50px 0;
    overflow: visible;
}

:deep(.swiper-wrapper) {
    align-items: center !important;
}

/* Base style for inactive card */
.pricing-slide {
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 370px;
    min-height: 520px;
    height: auto;
    border: 1px solid #4BBBE4;
    border-radius: 16px;
    padding: 17px 30px;
    box-sizing: border-box;
    transition: transform 0.3s ease, background 0.3s ease;
}

.pricing-slide-inner {
    width: 100%;
    height: 100%;
}

/* Active (centered) card */
.pricing-slide-active {
    transform: scale(1.12);
    background: linear-gradient(308.37deg, #001028 -39.02%, #4BBBE4 143.53%);
    border: none;
    min-height: 520px;
    height: auto;
}

.pricing-slide-active .active-inner {
    background: #001028;
    border-radius: 16px;
    padding: 15px 30px;
    height: auto;
}



.slide-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
    height: 100%;
}

.enroll-btn-wrapper {
    display: flex;
    justify-content: flex-start;
}

.enroll-btn {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px 24px;
    gap: 10px;
    min-width: 163px;
    min-height: 47px;
    width: fit-content;
    height: auto;
    background: linear-gradient(94.91deg, #4BBBE4 -29%, #45B0D8 -0.85%, #114D6D 114%, #002C4A 141.18%);
    border-radius: 25px;
    border: none;
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: #F5F5F5;
    cursor: pointer;
    text-transform: capitalize;
    white-space: nowrap;
}

.package-info {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.package-title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 24px;
    line-height: 29px;
    letter-spacing: 0.02em;
    color: #F5F5F5;
    margin: 0;
}

.package-desc {
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #F5F5F5;
    margin: 0;
}

.package-price {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 34px;
    line-height: 41px;
    color: #F5F5F5;
    margin: 0;
}

.divider {
    width: 100%;
    height: 0;
    border: 0.5px solid #4BBBE4;
}

.features-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.features-title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 18px;
    line-height: 22px;
    color: #F5F5F5;
    margin: 0;
}

.feature-item {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.feature-row {
    display: flex;
    align-items: center;
    gap: 10px;
}

.feature-row img {
    width: 20px;
    height: 20px;
}

.feature-text {
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #66707E;
}

/* Navigation and pagination */
.pricing-controls {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
}

.pricing-nav {
    display: flex;
    align-items: center;
    gap: 14px;
}

.nav-btn {
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
}

.nav-btn:hover {
    opacity: 0.8;
}

/* Responsive */
@media (max-width: 1199px) {
    .pricing-slide {
        width: 100%;
        max-width: 370px;
    }
    
    .pricing-slide-active {
        width: 100%;
        max-width: 446px;
    }
}

@media (max-width: 991px) {
    .pricing-section {
        padding: 60px 0;
    }
    
    .pricing-main {
        gap: 40px;
    }
    
    .pricing-title h3 {
        font-size: 32px;
        line-height: 40px;
    }
    
    .pricing-title p {
        font-size: 16px;
    }
    
    .pricing-slide,
    .pricing-slide-active {
        width: 100%;
        max-width: 370px;
        height: auto;
        min-height: 450px;
    }
    
    .pricing-slide-active .active-inner {
        height: auto;
        min-height: 400px;
    }
}

@media (max-width: 575px) {
    .pricing-section {
        padding: 50px 0;
    }
    
    .pricing-main {
        gap: 30px;
    }
    
    .pricing-title {
        max-width: 100%;
        padding: 0 15px;
    }
    
    .pricing-title h3 {
        font-size: 22px;
        line-height: 28px;
    }
    
    .pricing-title p {
        font-size: 14px;
        line-height: 18px;
    }
    
    .pricing-slide,
    .pricing-slide-active {
        padding: 15px 20px;
        margin: 0 auto;
        transform: none;
        width: 100%;
        max-width: 320px;
    }
    
    :deep(.swiper-slide) {
        display: flex;
        justify-content: center;
    }
    
    .pricing-swiper {
        overflow: hidden;
    }
    
    .enroll-btn {
        width: 100%;
    }
    
    .package-title {
        font-size: 18px;
        text-align: center;
    }
    
    .package-desc {
        font-size: 14px;
        text-align: center;
    }
    
    .package-price {
        font-size: 22px;
        text-align: center;
    }
    
    .pricing-controls {
        flex-direction: column-reverse;
        gap: 20px;
        align-items: start;
    }
}
</style>