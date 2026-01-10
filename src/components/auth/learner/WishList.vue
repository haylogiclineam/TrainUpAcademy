<script setup>
import {computed, ref, onMounted, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import api from "/src/services/api.js";
import {useI18n} from "vue-i18n";
import {useAuthStore} from "../../../stores/auth.js";
import {useWishlistCount} from '../../../composables/useWishlistCount.js';

const authStore = useAuthStore();
const {locale} = useI18n();

const route = useRoute();
const router = useRouter();

const currentPage = ref(parseInt(route.query.page) || 1);
const totalPages = ref(1);
const courses = ref([]);
const loading = ref(false);
const likedCourses = ref([]);
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const debounceTimeout = ref(null);

const currencySymbols = {AMD: "֏", EUR: "€", USD: "$"};

function getLocalizedField(obj, fieldBase) {
    const loc = locale.value;
    if (!obj) return "";
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

const toggleLike = async (courseId) => {
    if (!authStore.isAuthenticated || authStore.userRole !== "learner") return;

    try {
        if (likedCourses.value.includes(courseId)) {
            const res = await api.post(`/api/wishlist/remove/${courseId}`);

            wishlistCount.value = res.data.wishlist_count ?? wishlistCount.value - 1;

            await fetchWishlist(currentPage.value);

            likedCourses.value = likedCourses.value.filter(id => id !== courseId);
        } else {
            const res = await api.post(`/api/wishlist/add/${courseId}`);
            likedCourses.value.push(courseId);
            wishlistCount.value = res.data.wishlist_count ?? wishlistCount.value + 1;
        }
    } catch (err) {
        console.error("Wishlist API error:", err);
    }
};

const isCourseLiked = (id) => likedCourses.value.includes(id);

const fetchWishlist = async (page = 1) => {
    loading.value = true;
    try {
        const res = await api.get(`/api/wishlist?per_page=3&page=${page}`);
        courses.value = res.data.data.map((item) => item.course);
        currentPage.value = res.data.current_page;
        totalPages.value = res.data.last_page;

        if (courses.value.length === 0 && currentPage.value > 1) {
            await goToPage(currentPage.value - 1);
        }

    } catch (err) {
        console.error(err);
        courses.value = [];
    } finally {
        loading.value = false;
    }
};


const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    router.replace({query: {...route.query, page}});
    fetchWishlist(page);
};

const isActivePage = (page) => page === currentPage.value;

onMounted(async () => {
    await fetchWishlist(currentPage.value);
    if (authStore.isAuthenticated && authStore.userRole === "learner") {
        try {
            const response = await api.get("/api/wishlist");
            likedCourses.value = response.data.data.map((item) => item.course_id);
        } catch (err) {
            console.error("Failed to fetch wishlist:", err);
        }
    }
});

const {wishlistCount, loadWishlistCount} = useWishlistCount();

</script>

<template>
    <div class="my-courses-section">
        <div class="container">
            <div class="my-courses-main">
                <div class="d-flex justify-content-between align-items-center courses-title-block">
                    <h3 class="text-capitalize my-course-section-title">{{ $t('wishlist_page.title') }}</h3>
                </div>
                <div v-if="loading" class="d-flex justify-content-center align-items-center my-5">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="visually-hidden">{{ $t('loading') }}...</span>
                    </div>
                </div>
                <div v-if="!loading && courses.length > 0"
                     class="d-flex align-items-center flex-wrap wrap  gap-5 course-list">
                    <div class="course-video-div-main" v-for="(course, index) in courses" :key="course.id">
                        <div class="course-video-div position-relative">
                            <div @click="toggleLike(course.id)"
                                 class="locked-div position-absolute d-flex align-items-center gap-3">
                                <svg class="remove-course-from-wishlist" width="26" height="25" viewBox="0 0 26 25"
                                     fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18.9636 0C17.7437 0.0189745 16.5504 0.359508 15.5042 0.987211C14.4581 1.61491 13.5961 2.50756 13.0052 3.575C12.4144 2.50756 11.5524 1.61491 10.5063 0.987211C9.46008 0.359508 8.2668 0.0189745 7.04691 0C5.10226 0.0844899 3.27009 0.935192 1.95068 2.36625C0.631259 3.79731 -0.0681519 5.6924 0.00524453 7.6375C0.00524453 14.9771 11.8742 23.4542 12.3791 23.8138L13.0052 24.2569L13.6314 23.8138C14.1362 23.4563 26.0052 14.9771 26.0052 7.6375C26.0786 5.6924 25.3792 3.79731 24.0598 2.36625C22.7404 0.935192 20.9082 0.0844899 18.9636 0Z"
                                          fill="#F5F5F5"/>
                                </svg>
                            </div>

                            <img :src="`${baseUrl}/storage/${course.thumbnail}`" alt="Course Thumbnail"
                                 class="course-thumbnail"/>

                        </div>

                        <RouterLink class="text-decoration-none" :to="`/single-course/${course.id}`">
                            <div class="custom-title-overlay">
                                <p class="video-title">{{ getLocalizedField(course, 'title') }}</p>
                                <p class="mb-0 instructor-name">{{ $t('wishlist_page.instructor') }}:
                                    {{ course.user?.first_name }} {{ course.user?.last_name || '' }}</p>

                                <div class="rating d-flex align-items-center gap-2">
                                    <span class="rate-num">  {{
                                        course.comments_avg_rating ? Number(course.comments_avg_rating).toFixed(1) : '0.0'
                                        }}</span>
                                    <div class="d-flex align-items-center">
                                        <svg
                                                v-for="star in 5"
                                                :key="star"
                                                :class="{ filled: star <= Number(course.comments_avg_rating) }"
                                                width="20"
                                                height="21"
                                                viewBox="0 0 20 21"
                                                fill="none"
                                                style="pointer-events: none; cursor: default;"
                                        >
                                            <path
                                                    d="M16.2225 19.93L10 15.3567L3.77751 19.93L6.16668 12.5442L-0.0524902 8.00002H7.62584L10 0.601685L12.3742 8.00002H20.0517L13.8333 12.5442L16.2225 19.93Z"
                                                    :fill="star <= Number(course.comments_avg_rating) ? '#F0AD4E' : '#D3D3D3'"
                                            />
                                        </svg>
                                    </div>
                                    <span class="rate-title">{{
                                        course.comments_count || '0'
                                        }} ({{ $t('wishlist_page.total_ratings') }})</span>
                                </div>
                                <div class="d-flex align-items-center justify-content-between gap-3 buy-btn-and-price-block">
                                    <div class="buy-btn-div d-flex justify-content-center align-items-center">
                                        <router-link to="/learner/checkout"
                                                     class="buy-btn text-capitalize text-decoration-none text-center d-flex align-items-center justify-content-center">
                                            {{ $t('single_course.buy_now_btn') }}
                                        </router-link>
                                    </div>
                                    <p class="price mb-0">
                                        {{ $t('wishlist_page.price') }}:
                                        {{ getCoursePrice(course) }}
                                    </p>
                                </div>
                            </div>
                        </RouterLink>
                    </div>
                </div>

                <nav v-if="totalPages > 1">
                    <ul class="pagination d-flex justify-content-center mt-0">
                        <li
                                class="page-item page-item-btn"
                                :class="{ 'page-link-disabled': currentPage === 1 }"
                        >
                            <a
                                    class="page-link"
                                    href="#"
                                    tabindex="-1"
                                    aria-disabled="true"
                                    @click.prevent="goToPage(currentPage - 1)"
                            >
                                <svg width="9" height="19" viewBox="0 0 9 19" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.62887 0.394604C8.74647 0.520754 8.83981 0.670837 8.90351 0.836199C8.96721 1.00156 9 1.17893 9 1.35807C9 1.5372 8.96721 1.71457 8.90351 1.87993C8.83981 2.04529 8.74647 2.19538 8.62887 2.32153L2.88245 8.53654C2.76485 8.66269 2.67151 8.81277 2.60781 8.97813C2.54411 9.1435 2.51131 9.32086 2.51131 9.5C2.51131 9.67914 2.54411 9.85651 2.60781 10.0219C2.67151 10.1872 2.76485 10.3373 2.88245 10.4635L8.62887 16.6785C8.74647 16.8046 8.83981 16.9547 8.90351 17.1201C8.96721 17.2854 9 17.4628 9 17.6419C9 17.8211 8.96721 17.9984 8.90351 18.1638C8.83981 18.3292 8.74647 18.4792 8.62887 18.6054C8.39379 18.8581 8.07579 19 7.74432 19C7.41285 19 7.09485 18.8581 6.85977 18.6054L1.1008 12.3768C0.395924 11.6135 0 10.5788 0 9.5C0 8.42119 0.395924 7.38649 1.1008 6.62318L6.85977 0.394604C7.09485 0.141865 7.41285 0 7.74432 0C8.07579 0 8.39379 0.141865 8.62887 0.394604Z"
                                          fill="#C2C2C2"/>
                                </svg>
                            </a>
                        </li>

                        <li>
                            <ul class="list-unstyled d-flex pagination-numbers">
                                <li
                                        v-for="page in totalPages"
                                        :key="page"
                                        class="page-item"
                                        :class="{ active: isActivePage(page) }"
                                >
                                    <a
                                            class="page-link"
                                            href="#"
                                            @click.prevent="goToPage(page)"
                                    >
                                        {{ page }}
                                    </a>
                                </li>
                            </ul>
                        </li>

                        <li
                                class="page-item page-item-btn"
                                :class="{ 'page-link-active': currentPage === totalPages }"
                        >
                            <a
                                    class="page-link"
                                    href="#"
                                    @click.prevent="goToPage(currentPage + 1)"
                            >
                                <svg width="9" height="19" viewBox="0 0 9 19" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.371131 0.394604C0.253532 0.520754 0.160191 0.670837 0.0964931 0.836199C0.0327948 1.00156 0 1.17893 0 1.35807C0 1.5372 0.0327948 1.71457 0.0964931 1.87993C0.160191 2.04529 0.253532 2.19538 0.371131 2.32153L6.11755 8.53654C6.23515 8.66269 6.32849 8.81277 6.39219 8.97813C6.45589 9.1435 6.48869 9.32086 6.48869 9.5C6.48869 9.67914 6.45589 9.85651 6.39219 10.0219C6.32849 10.1872 6.23515 10.3373 6.11755 10.4635L0.371131 16.6785C0.253532 16.8046 0.160191 16.9547 0.0964931 17.1201C0.0327948 17.2854 0 17.4628 0 17.6419C0 17.8211 0.0327948 17.9984 0.0964931 18.1638C0.160191 18.3292 0.253532 18.4792 0.371131 18.6054C0.606211 18.8581 0.924211 19 1.25568 19C1.58715 19 1.90515 18.8581 2.14023 18.6054L7.8992 12.3768C8.60408 11.6135 9 10.5788 9 9.5C9 8.42119 8.60408 7.38649 7.8992 6.62318L2.14023 0.394604C1.90515 0.141865 1.58715 0 1.25568 0C0.924211 0 0.606211 0.141865 0.371131 0.394604Z"
                                          fill="#AEAEAE"/>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </nav>

                <div v-if="!loading && courses.length === 0"
                     class="d-flex align-items-center empty-wishlist-block gap-3">
                    <div class="not-exist-items">
                        <p class="mb-0"> {{ $t('wishlist_page.empty_wishlist') }}</p>
                    </div>
                    <div class="my-course-btn-div d-flex justify-content-center align-items-center">
                        <router-link to="/courses">
                            <button class="my-course-btn"> {{ $t('wishlist_page.courses_btn') }}</button>
                        </router-link>
                    </div>
                </div>
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
    padding: 10px 0;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.video-title {
    font-family: var(--font-montserrat);
    font-weight: 600;
    font-size: 20px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-100);
    margin-bottom: 0 !important;
}

.not-exist-items p {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 20px;
    line-height: normal;
    letter-spacing: 0%;
}

.not-exist-items {
    width: 100%;
    border-radius: 16px;
    display: flex;
    align-items: center;
}

.not-exist-items p {
    color: var(--primary-90);
}

.instructor-name,
.rate-num,
.rate-title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 18px;
    line-height: 100%;
    letter-spacing: 2%;
    color: var(--primary-100);
}

.price {
    font-family: var(--font-montserrat);
    font-weight: 600;
    font-size: 20px;
    line-height: 100%;
    letter-spacing: 0%;
    color: var(--secondary-1-100);
}

.course-thumbnail {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

svg {
    fill: var(--white-245);
    transition: fill 0.2s;
}

.filled {
    fill: var(--star-rating);
}

polygon {
    stroke: none;
    stroke-width: 0;
}

.buy-btn-div {
    height: 56px;
}

.buy-btn {
    padding: 0 25px;
    width: fit-content;
    height: 44px;
    border-radius: 70px;
    background: var(--general-btn-light);
    border: none;
    outline: none;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
    white-space: nowrap;
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .my-courses-main {
        gap: 60px;
    }

    .courses-title-block {
        flex-direction: column;
        gap: 30px;
    }

    .my-course-section-title {
        font-size: 22px;
        font-weight: 300;
    }

    .my-course-btn-div {
        width: fit-content;
        height: 50px;
    }

    .my-course-btn:hover {
        padding: 0 45px;
        height: 47px;
        font-size: 18px;
    }

    .my-course-btn {
        padding: 0 35px;
        height: 47px;
        font-size: 18px;
    }

    .course-video-div-main {
        flex: 1 1 100%;
        max-width: 100%;
    }

    .video-title,
    .instructor-name,
    .rate-num,
    .rate-title,
    .price {
        font-size: 16px;
    }

    .course-list {
        gap: 20px !important;
    }

    .not-exist-items p {
        font-size: 16px;
        text-align: center;
    }

    .not-exist-items {
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .course-video-div,
    .not-exist-items {
        border-radius: 8px;
    }

    .play-icon-div svg {
        width: 60px;
        height: 60px;
    }

    .empty-wishlist-block {
        flex-direction: column;
    }

    .buy-btn-div {
        width: fit-content;
        height: 50px;
    }

    .buy-btn {
        padding: 0 25px;
        width: fit-content;
        height: 47px;
    }


    .buy-btn-and-price-block {
        flex-direction: column-reverse;
        align-items: start !important;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .my-courses-main {
        gap: 60px;
    }

    .courses-title-block {
        flex-direction: column;
        gap: 30px;
    }

    .my-course-section-title {
        font-size: 22px;
        font-weight: 300;
    }

    .my-course-btn-div {
        width: fit-content;
        height: 50px;
    }

    .my-course-btn:hover {
        padding: 0 45px;
        height: 47px;
        font-size: 18px;
    }

    .my-course-btn {
        padding: 0 35px;
        height: 47px;
        font-size: 18px;
    }

    .course-video-div-main {
        flex: 1 1 100%;
        max-width: 100%;
    }

    .video-title,
    .instructor-name,
    .rate-num,
    .rate-title,
    .price {
        font-size: 16px;
    }

    .course-list {
        gap: 20px !important;
    }

    .not-exist-items p {
        font-size: 16px;
        text-align: center;
    }

    .not-exist-items {
        padding: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }

    .course-video-div,
    .not-exist-items {
        border-radius: 8px;
    }

    .play-icon-div svg {
        width: 60px;
        height: 60px;
    }

    .empty-wishlist-block {
        flex-direction: column;
    }

    .buy-btn-div {
        width: fit-content;
        height: 50px;
    }

    .buy-btn {
        padding: 0 25px;
        width: fit-content;
        height: 47px;
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

    .my-course-btn-div {
        width: fit-content;
        height: 50px;
    }

    .my-course-btn:hover {
        padding: 0 45px;
        height: 47px;
        font-size: 18px;
    }

    .my-course-btn {
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

    .not-exist-items p {
        font-size: 16px;
        padding: 20px;
    }

    .buy-btn {
        font-size: 14px;
    }

    .buy-btn-div {
        width: fit-content;
        height: 40px;
    }

    .buy-btn {
        padding: 0 25px;
        width: fit-content;
        height: 40px;
        font-size: 16px;
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

    .buy-btn-div {
        width: fit-content;
        height: 45px;
    }

    .buy-btn {
        padding: 0 25px;
        width: fit-content;
        height: 40px;
    }
}

/* Extra Large Devices */
@media (min-width: 1200px) {
    .course-video-div-main {
        flex: 1 1 30%;
        max-width: 30%;
    }

    .buy-btn:hover {
        padding: 0 35px;
        height: 46px;
        font-size: 18px;
        width: fit-content;
    }
}

</style>