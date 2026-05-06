<script setup>
import { ref, onMounted } from 'vue';
import api from '../../../services/api.js';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const purchasedCourses = ref([]);
const wishlistCourses = ref([]);
const cartCourses = ref([]);
const loading = ref(true);
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.trainup.academy';

const currencySymbols = { AMD: "֏", EUR: "€", USD: "$" };

function getLocalizedField(obj, fieldBase) {
    if (!obj) return "";
    const loc = locale.value;
    const valArm = obj[`${fieldBase}_arm`];
    const valRu = obj[`${fieldBase}_ru`];
    const valEn = obj[`${fieldBase}_en`] || "";
    if (loc === "arm") return valArm || valEn;
    if (loc === "ru") return valRu || valEn;
    return valEn;
}

function getCoursePrice(course) {
    const loc = locale.value;
    const priceKey = `price_${loc}`;
    const currencyKey = `currency_${loc}`;
    let price = course[priceKey];
    let currency = course[currencyKey];
    if (!price || price === "0" || price === "") {
        price = course.price_en;
        currency = course.currency_en;
    }
    const symbol = currencySymbols[currency] || currency;
    return price ? `${price} ${symbol}` : "";
}

onMounted(async () => {
    try {
        const [purchasedRes, wishlistRes, cartRes] = await Promise.all([
            api.get('/api/purchased-courses'),
            api.get('/api/wishlist?per_page=3'),
            api.get('/api/cart?per_page=3')
        ]);

        purchasedCourses.value = purchasedRes.data.courses || [];
        
        if (wishlistRes.data && Array.isArray(wishlistRes.data.data)) {
            wishlistCourses.value = wishlistRes.data.data
                .map(item => item.course)
                .filter(c => c !== null);
        }

        if (cartRes.data && Array.isArray(cartRes.data.data)) {
            cartCourses.value = cartRes.data.data
                .map(item => item.course)
                .filter(c => c !== null);
        }
    } catch (err) {
        console.error('Failed to load profile data:', err);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="my-courses-section">
        <div class="container">
            <div class="my-courses-main">
                <!-- Loading State -->
                <div v-if="loading" class="d-flex justify-content-center py-5">
                    <div class="spinner-border text-primary" role="status"></div>
                </div>

                <template v-else>
                    <!-- My Learning -->
                    <div class="my-learning">
                        <div class="d-flex justify-content-between align-items-center courses-title-block">
                            <h3 class="text-capitalize my-course-section-title">{{ $t('learner_profile.my_learning') }}</h3>
                            <div class="my-course-btn-div d-flex justify-content-center align-items-center">
                                <router-link to="/learner/my-learning">
                                    <button class="my-course-btn">
                                        {{ $t('learner_profile.view_more') }}
                                    </button>
                                </router-link>
                            </div>
                        </div>

                        <div v-if="purchasedCourses.length > 0" class="d-flex align-items-center flex-wrap wrap justify-content-between gap-5 course-list">
                            <div v-for="course in purchasedCourses.slice(0, 3)" :key="course.id" class="course-video-div-main">
                                <router-link :to="`/single-course/${course.id}`" class="text-decoration-none">
                                    <div class="course-video-div position-relative">
                                        <img :src="`${baseUrl}/storage/${course.thumbnail}`" :alt="getLocalizedField(course, 'title')" class="course-video" />
                                    </div>
                                    <div class="custom-title-overlay">
                                        <p class="video-title">{{ getLocalizedField(course, 'title') }}</p>
                                    </div>
                                </router-link>
                            </div>
                        </div>
                        <div v-else class="not-exist-items">
                            <p class="mb-0">{{ $t('learner_profile.no_purchases') }}</p>
                        </div>
                    </div>

                    <!-- Wishlist -->
                    <div class="my-wishlist">
                        <div class="d-flex justify-content-between align-items-center courses-title-block">
                            <h3 class="text-capitalize my-course-section-title">{{ $t('learner_profile.wishlist') }}</h3>
                            <div class="my-course-btn-div d-flex justify-content-center align-items-center">
                                <router-link to="/learner/wishlist">
                                    <button class="my-course-btn">
                                        {{ $t('learner_profile.view_more') }}
                                    </button>
                                </router-link>
                            </div>
                        </div>
                        <div v-if="wishlistCourses.length > 0" class="d-flex align-items-center flex-wrap wrap justify-content-between gap-5 course-list">
                            <div v-for="course in wishlistCourses" :key="course.id" class="course-video-div-main">
                                <router-link :to="`/single-course/${course.id}`" class="text-decoration-none">
                                    <div class="course-video-div position-relative">
                                        <img :src="`${baseUrl}/storage/${course.thumbnail}`" alt="Course Thumbnail" class="course-thumbnail" />
                                    </div>
                                    <div class="custom-title-overlay">
                                        <p class="video-title">{{ getLocalizedField(course, 'title') }}</p>
                                        <p class="price mb-0">{{ getCoursePrice(course) }}</p>
                                    </div>
                                </router-link>
                            </div>
                        </div>
                        <div v-else class="not-exist-items">
                            <p class="mb-0">{{ $t('wishlist_page.empty_wishlist') }}</p>
                        </div>
                    </div>

                    <!-- Cart -->
                    <div class="my-cart">
                        <div class="d-flex justify-content-between align-items-center courses-title-block">
                            <h3 class="text-capitalize my-course-section-title">{{ $t('learner_profile.my_cart') }}</h3>
                            <div class="my-course-btn-div d-flex justify-content-center align-items-center">
                                <router-link to="/learner/shopping-cart">
                                    <button class="my-course-btn">
                                        {{ $t('learner_profile.view_more') }}
                                    </button>
                                </router-link>
                            </div>
                        </div>
                        <div v-if="cartCourses.length > 0" class="d-flex align-items-center flex-wrap wrap justify-content-between gap-5 course-list">
                            <div v-for="course in cartCourses" :key="course.id" class="course-video-div-main">
                                <router-link :to="`/single-course/${course.id}`" class="text-decoration-none">
                                    <div class="course-video-div position-relative">
                                        <img :src="`${baseUrl}/storage/${course.thumbnail}`" alt="Course Thumbnail" class="course-thumbnail" />
                                    </div>
                                    <div class="custom-title-overlay">
                                        <p class="video-title">{{ getLocalizedField(course, 'title') }}</p>
                                        <p class="price mb-0">{{ getCoursePrice(course) }}</p>
                                    </div>
                                </router-link>
                            </div>
                        </div>
                        <div v-else class="not-exist-items">
                            <p class="mb-0">{{ $t('cart_page.empty_message') }}</p>
                        </div>
                    </div>
                </template>
            </div>
        </div>
    </div>
</template>

<style scoped>
.my-courses-section {
    padding: 8% 0;
}

.my-course-section-title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-100);
}

.my-courses-main {
    display: flex;
    flex-direction: column;
    gap: 60px;

}

.my-course-btn {
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
    height: 53px;
}


.my-course-btn:hover {
    height: 56px;
    padding: 0 45px;
    font-size: 18px;
}

.my-course-btn-div {
    height: 56px;
    width: fit-content;
}

.course-video-div {
    width: 100%;
    height: 369px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
}

.course-video-div-main {
    min-height: 369px;
    border-radius: 16px;
    flex: 1 1 calc(50% - 20px);
    max-width: calc(50% - 20px);
}

.course-video-div:before {
    content: "";
    background: var(--single-course-item);
    width: 100%;
    height: 100%;
    position: absolute;
}

.course-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.locked-div {
    padding: 25px;
    z-index: 3;
    cursor: pointer;
}

.play-icon-div {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    cursor: pointer;
}

.custom-title-overlay {
    bottom: 10px;
    left: 0;
    right: 0;
    padding: 10px;
}

.video-title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-100);
    padding-left: 10px;
    margin-bottom: 0 !important;
}

.not-exist-items p,
.not-exist-items a {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 20px;
    line-height: normal;
    letter-spacing: 0%;
}

.not-exist-items {
    width: 100%;
    padding: 30px;
    border-radius: 16px;
    background: var(--primary-10);
    display: flex;
    align-items: center;
}

.not-exist-items p {
    color: var(--primary-90);
}

.not-exist-items a {
    color: var(--secondary-1-100);
}

.my-learning,
.my-wishlist,
.my-cart{
    display: flex;
    flex-direction: column;
    gap: 60px
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .my-courses-main {
        gap: 30px;
    }

    .courses-title-block {
        flex-direction: column;
        gap: 30px;
    }

    .my-course-section-title {
        font-size: 22px;
        font-weight: 300;
    }

    .my-course-btn-div{
        width: fit-content;
        height: 50px;
    }

    .my-course-btn:hover{
        padding: 0 45px;
        height: 47px;
        font-size: 18px;
    }

    .my-course-btn{
        padding: 0 35px;
        height: 47px;
        font-size: 18px;
    }

    .course-video-div-main {
        flex: 1 1 100%;
        max-width: 100%;
    }

    .video-title {
        font-size: 16px;
    }

    .course-list {
        gap: 20px !important;
    }

    .not-exist-items p,
    .not-exist-items a {
        font-size: 16px;
    }

    .not-exist-items {
        padding: 20px;
    }

    .course-video-div,
    .not-exist-items {
        border-radius: 8px;
    }

    .play-icon-div svg{
        width: 60px;
        height: 60px;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .my-courses-main {
        gap: 30px;
    }

    .courses-title-block {
        flex-direction: column;
        gap: 30px;
    }

    .my-course-section-title {
        font-size: 22px;
        font-weight: 300;
    }

    .my-course-btn-div{
        width: fit-content;
        height: 50px;
    }

    .my-course-btn:hover{
        padding: 0 45px;
        height: 47px;
        font-size: 18px;
    }

    .my-course-btn{
        padding: 0 35px;
        height: 47px;
        font-size: 18px;
    }

    .course-video-div-main {
        flex: 1 1 100%;
        max-width: 100%;
    }

    .video-title {
        font-size: 16px;
    }

    .course-list {
        gap: 20px !important;
    }

    .not-exist-items p,
    .not-exist-items a {
        font-size: 16px;
    }

    .not-exist-items {
        padding: 20px;
    }

    .course-video-div,
    .not-exist-items {
        border-radius: 8px;
    }

    .play-icon-div svg{
        width: 60px;
        height: 60px;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .my-courses-main {
        gap: 30px;
    }

    .courses-title-block {
        gap: 30px;
    }

    .my-course-section-title {
        font-size: 22px;
        font-weight: 300;
    }

    .my-course-btn-div{
        width: fit-content;
        height: 50px;
    }

    .my-course-btn:hover {
        padding: 0 45px;
        height: 47px;
        font-size: 18px;
    }

    .my-course-btn{
        padding: 0 35px;
        height: 47px;
        font-size: 18px;
    }

    .course-video-div-main {
        flex: 1 1 100%;
        max-width: 100%;
    }

    .video-title {
        font-size: 16px;
    }

    .course-list {
        gap: 20px !important;
    }

    .not-exist-items p,
    .not-exist-items a {
        font-size: 16px;
    }

    .not-exist-items {
        padding: 20px;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .course-video-div-main {
        flex: 1 1 45%;
        max-width: 45%;
    }

    .course-list {
        gap: unset;
    }
}

/* Extra Large Devices */
@media (min-width: 1200px) {
    .course-video-div-main {
        flex: 1 1 30%;
        max-width: 30%;
    }
}

</style>