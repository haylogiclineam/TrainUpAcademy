<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "/src/services/api.js";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "../../../stores/auth.js";
import { useCartCount } from '../../../composables/useCartCount.js';
import { useWishlistCount } from '../../../composables/useWishlistCount.js';

const authStore = useAuthStore();
const { locale } = useI18n();

const route = useRoute();
const router = useRouter();

const currentPage = ref(parseInt(route.query.page) || 1);
const totalPages = ref(1);
const cartCourses = ref([]);
const totalCartCount = ref(0);
const loading = ref(false);
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const currencySymbols = { AMD: "֏",   EUR: "€", USD: "$" };
const likedCourses = ref([]);
const { wishlistCount, loadWishlistCount } = useWishlistCount();

const toggleLike = async (courseId) => {
    if (!authStore.isAuthenticated || authStore.userRole !== 'learner') return;

    try {
        if (likedCourses.value.includes(courseId)) return;

        const res = await api.post(`/api/wishlist/add/${courseId}`);
        likedCourses.value.push(courseId);

        wishlistCount.value = res.data.wishlist_count ?? wishlistCount.value + 1;
    } catch (err) {
        console.error('Wishlist API error', err);
    }
};

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


const fetchCart = async (page = 1) => {
    loading.value = true;
    try {
        const res = await api.get(`/api/cart?per_page=4&page=${page}`);
        cartCourses.value = res.data.data.map((item) => item.course);
        currentPage.value = res.data.current_page;
        totalPages.value = res.data.last_page;

        totalCartCount.value = res.data.total;

        if (cartCourses.value.length === 0 && currentPage.value > 1) {
            await goToPage(currentPage.value - 1);
        }
    } catch (err) {
        console.error("Cart fetch error:", err);
        cartCourses.value = [];
    } finally {
        loading.value = false;
    }
};
const { cartCount, loadCartCount } = useCartCount();
const removeFromCart = async (courseId) => {
    try {
        await api.post(`/api/cart/remove/${courseId}`);
        await fetchCart(currentPage.value);
        await loadCartCount();
    } catch (err) {
        console.error("Remove from cart error:", err);
    }
};

const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;
    router.replace({ query: { ...route.query, page } });
    fetchCart(page);
};

const isActivePage = (page) => page === currentPage.value;

onMounted(() => {
    fetchCart(currentPage.value);
});
</script>

<template>
    <div class="my-cart-section">
        <div class="container">
            <div class="my-cart-main">
                <div class="d-flex justify-content-between align-items-center my-cart-title-block">
                    <h3 class="text-capitalize my-cart-section-title">
                        {{ $t("cart_page.title") }}
                    </h3>
                </div>

                <!-- Loading -->
                <div v-if="loading" class="d-flex justify-content-center align-items-center my-5">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="visually-hidden">{{ $t('loading') }}...</span>
                    </div>
                </div>

                <!-- Courses -->
                <div v-if="!loading && cartCourses.length > 0">
                    <p class="cart-course-count">
                        {{ totalCartCount }} {{ $t("cart_page.courses_in_cart") }}
                    </p>
                    <hr />
                    <div v-for="(course, index) in cartCourses" :key="course.id" class="shopping-cart-body">
                        <div class="cart-item d-flex align-items-center justify-content-between">
                            <div class="d-flex video-content-block">
                                <div class="d-flex gap-3">
                                    <div class="course-video-div-main d-flex">
                                        <div class="course-video-div position-relative">
                                            <img
                                                :src="`${baseUrl}/storage/${course.thumbnail}`"
                                                alt="Course Thumbnail"
                                                class="course-thumbnail"
                                            />
                                        </div>
                                    </div>
                                    <p class="video-title mb-0 video-title-mobile d-none">{{ getLocalizedField(course, "title") }}</p>
                                </div>

                                <div class="item-content">
                                    <div class="custom-title-overlay">
                                        <p class="video-title mb-0 video-title-web">{{ getLocalizedField(course, "title") }}</p>
                                        <p class="mb-0 instructor-name">
                                            {{ $t("cart_page.instructor") }}: {{ course.user?.first_name }} {{ course.user?.last_name || "" }}
                                        </p>
                                        <p class="mb-0 total-hours"> {{ course.details_by_instructor.find(d => d.time)?.time || '0:00' }} {{ $t("cart_page.total_hours") }}</p>

                                        <div class="rating d-flex align-items-center gap-2">
                                        <span class="rate-num">
                                            {{ course.comments_avg_rating ? Number(course.comments_avg_rating).toFixed(1) : "0.0" }}
                                        </span>
                                            <div class="d-flex align-items-center">
                                                <svg
                                                    v-for="star in 5"
                                                    :key="star"
                                                    :class="{ filled: star <= Number(course.comments_avg_rating) }"
                                                    width="20"
                                                    height="21"
                                                    viewBox="0 0 20 21"
                                                    fill="none"
                                                >
                                                    <path
                                                        d="M16.2225 19.93L10 15.3567L3.77751 19.93L6.16668 12.5442L-0.0524902 8.00002H7.62584L10 0.601685L12.3742 8.00002H20.0517L13.8333 12.5442L16.2225 19.93Z"
                                                        :fill="star <= Number(course.comments_avg_rating) ? '#F0AD4E' : '#D3D3D3'"
                                                    />
                                                </svg>
                                            </div>
                                            <span class="rate-title">
                                            {{ course.comments_count || "0" }} ({{ $t("cart_page.total_ratings") }})
                                        </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="item-action d-flex flex-column">
                                <span class="price">{{ $t("cart_page.price") }}: {{ getCoursePrice(course) }}</span>
                                <div class="btn-move-remove d-flex flex-column">
                                    <button class="remove-btn" @click="removeFromCart(course.id)">
                                        {{ $t("cart_page.remove") }}
                                    </button>
                                    <button class="move-to-btn"  @click="toggleLike(course.id)">{{ $t("cart_page.move_to_wishlist") }}</button>
                                </div>
                                <div class="my-cart-btn-div d-flex justify-content-center align-items-center">
                                    <router-link to="/learner/checkout" class="my-cart-btn text-decoration-none text-center d-flex align-items-center justify-content-center">
                                        {{ $t("cart_page.buy_now") }}
                                    </router-link>
                                </div>
                            </div>
                        </div>
                        <hr v-if="index < cartCourses.length - 1" />
                    </div>
                </div>

                <!-- Pagination -->
                <nav v-if="totalPages > 1">
                    <ul class="pagination d-flex justify-content-center mt-0">
                        <li class="page-item page-item-btn" :class="{ 'page-link-disabled': currentPage === 1 }">
                            <a class="page-link" href="#" @click.prevent="goToPage(currentPage - 1)">
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
                                    <a class="page-link" href="#" @click.prevent="goToPage(page)">
                                        {{ page }}
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li class="page-item page-item-btn" :class="{ 'page-link-active': currentPage === totalPages }">
                            <a class="page-link" href="#" @click.prevent="goToPage(currentPage + 1)">
                                <svg width="9" height="19" viewBox="0 0 9 19" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0.371131 0.394604C0.253532 0.520754 0.160191 0.670837 0.0964931 0.836199C0.0327948 1.00156 0 1.17893 0 1.35807C0 1.5372 0.0327948 1.71457 0.0964931 1.87993C0.160191 2.04529 0.253532 2.19538 0.371131 2.32153L6.11755 8.53654C6.23515 8.66269 6.32849 8.81277 6.39219 8.97813C6.45589 9.1435 6.48869 9.32086 6.48869 9.5C6.48869 9.67914 6.45589 9.85651 6.39219 10.0219C6.32849 10.1872 6.23515 10.3373 6.11755 10.4635L0.371131 16.6785C0.253532 16.8046 0.160191 16.9547 0.0964931 17.1201C0.0327948 17.2854 0 17.4628 0 17.6419C0 17.8211 0.0327948 17.9984 0.0964931 18.1638C0.160191 18.3292 0.253532 18.4792 0.371131 18.6054C0.606211 18.8581 0.924211 19 1.25568 19C1.58715 19 1.90515 18.8581 2.14023 18.6054L7.8992 12.3768C8.60408 11.6135 9 10.5788 9 9.5C9 8.42119 8.60408 7.38649 7.8992 6.62318L2.14023 0.394604C1.90515 0.141865 1.58715 0 1.25568 0C0.924211 0 0.606211 0.141865 0.371131 0.394604Z"
                                          fill="#AEAEAE"/>
                                </svg>
                            </a>
                        </li>
                    </ul>
                </nav>

                <!-- Empty Cart -->
                <div v-if="!loading && cartCourses.length === 0" class="d-flex align-items-center empty-my-cart-block gap-3">
                    <div class="not-exist-items">
                        <p class="mb-0">{{ $t("cart_page.empty_message") }}</p>
                    </div>
                    <div class="my-course-btn-div d-flex justify-content-center align-items-center">
                        <router-link to="/courses">
                            <button class="my-course-btn">{{ $t("cart_page.courses_btn") }}</button>
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.my-cart-section {
    padding: 8% 0;
}

.my-cart-section-title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-100);
}

.my-cart-main {
    display: flex;
    flex-direction: column;
    gap: 60px;

}

.my-course-btn,
.my-cart-btn {
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

.my-course-btn {
    width: 176px;
    height: 53px;
}

.my-cart-btn {
    width: 176px;
    height: 44px;
}


.my-course-btn-div,
.my-cart-btn-div {
    height: 56px;
    width: 186px;
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
    display: flex;
    align-items: center;
}

.not-exist-items p {
    color: var(--primary-90);
}

.cart-course-count {
    font-family: var(--font-montserrat);
    font-weight: 600;
    font-size: 22px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-100);
}

.course-video-div {
    width: 95%;
    height: 154px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
}

.course-video-div-main {
    min-height: 154px;
    border-radius: 16px;
    width: 100%;
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

.shopping-cart-body,
.shopping-cart-main {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.video-title,
.instructor-name,
.total-hours,
.rate-num,
.rate-title {
    font-family: var(--font-montserrat);
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-100);
}

.video-title {
    font-weight: 600;
    font-size: 20px;
}

.instructor-name,
.total-hours {
    font-weight: 400;
    font-size: 18px;
}

.rate-num,
.rate-title {
    font-weight: 400;
    font-size: 20px;
}

.price {
    font-family: var(--font-montserrat);
    font-weight: 800;
    font-size: 20px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--secondary-1-100);
}

.remove-btn,
.move-to-btn {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 20px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--secondary-1-100);
    background: transparent;
    border: none;
    text-align: start;
    padding: 0;
}

.item-action,
.btn-move-remove {
    gap: 12px;
}

.course-thumbnail{
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.video-content-block{
    width: 80%;
}

.item-content{
    width: 65%;
}


/* Extra Small Devices */
@media (max-width: 575px) {
    .my-cart-main {
        gap: 60px;
    }

    .my-cart-title-block {
        flex-direction: column;
        gap: 30px;
    }

    .my-cart-section-title {
        font-size: 22px;
        font-weight: 300;
    }

    .cart-item {
        flex-direction: column;
        align-items: unset !important;
    }

    .cart-course-count {
        font-size: 20px;
    }

    .my-course-btn-div {
        width: 190px;
        height: 50px;
    }

    .my-course-btn:hover {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .my-course-btn {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .course-video-div {
        width: 100%;
        height: 90px;
    }


    .video-title-web {
        display: none;
    }

    .video-title-mobile {
        font-size: 16px;
        display: block !important;
        width: 51%;
        word-wrap: break-word;
    }

    .price-web {
        display: none;
    }

    .price-mobile {
        display: block !important;
    }

    .instructor-name,
    .total-hours,
    .price-mobile,
    .rate-num,
    .rate-title,
    .remove-btn,
    .move-to-btn {
        font-size: 16px;
    }

    .item-action {
        width: 100%;
    }

    .btn-move-remove {
        flex-direction: row !important;
    }

    .my-cart-btn-div,
    .my-cart-btn {
        width: 100%;
    }

    .empty-my-cart-block {
        flex-direction: column;
    }

    .not-exist-items {
        justify-content: center;
    }

    .not-exist-items p {
        font-size: 18px;
        text-align: center;
    }

    .video-content-block{
        flex-direction: column;
        width: 100%;
    }

    .video-title-web{
        display: none !important;
    }

    .item-content{
        width: 100%;
    }

    .course-video-div-main {
        min-height: 90px;
        gap: 10px;
        width: 40%;
    }

}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .my-cart-main {
        gap: 60px;
    }

    .my-cart-title-block {
        flex-direction: column;
        gap: 30px;
    }

    .my-cart-section-title {
        font-size: 22px;
        font-weight: 300;
    }

    .cart-item {
        flex-direction: column;
    }

    .cart-course-count {
        font-size: 20px;
    }

    .my-course-btn-div {
        width: 190px;
        height: 50px;
    }

    .my-course-btn:hover {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .my-course-btn {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .course-video-div {
        width: 100%;
        height: 150px;
    }

    .video-title-web {
        display: none;
    }

    .video-title-mobile {
        font-size: 16px;
        display: block !important;
        width: 51%;
        word-wrap: break-word;
    }

    .price-web {
        display: none;
    }

    .price-mobile {
        display: block !important;
    }

    .instructor-name,
    .total-hours,
    .price-mobile,
    .rate-num,
    .rate-title,
    .remove-btn,
    .move-to-btn {
        font-size: 16px;
    }

    .item-action {
        width: 100%;
    }

    .btn-move-remove {
        flex-direction: row !important;
    }

    .empty-my-cart-block {
        flex-direction: column;
    }

    .not-exist-items {
        justify-content: center;
    }

    .not-exist-items p {
        font-size: 18px;
        text-align: center;
    }

    .cart-item {
        align-items: start !important;
    }

    .video-content-block{
        flex-direction: column;
        width: 100%;
    }

    .video-title-web{
        display: none !important;
    }

    .item-content{
        width: 100%;
    }

    .course-video-div-main {
        min-height: 90px;
        gap: 10px;
        width: 40%;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .my-cart-main {
        gap: 60px;
    }

    .my-cart-title-block {
        flex-direction: column;
        gap: 30px;
    }

    .my-cart-section-title {
        font-size: 22px;
        font-weight: 300;
    }

    .cart-item {
        flex-direction: column;
    }

    .cart-course-count {
        font-size: 20px;
    }

    .my-course-btn-div {
        width: 190px;
        height: 50px;
    }

    .my-course-btn:hover {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .my-course-btn {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .course-video-div {
        width: 100%;
        height:200px;
    }

    .video-title-web {
        display: none;
    }

    .video-title-mobile {
        font-size: 16px;
        display: block !important;
        width: 51%;
        word-wrap: break-word;
    }

    .price-web {
        display: none;
    }

    .price-mobile {
        display: block !important;
    }

    .instructor-name,
    .total-hours,
    .price-mobile,
    .rate-num,
    .rate-title,
    .remove-btn,
    .move-to-btn {
        font-size: 16px;
    }

    .item-action {
        width: 100%;
    }

    .btn-move-remove {
        flex-direction: row !important;
    }

    .empty-my-cart-block {
        flex-direction: column;
    }

    .not-exist-items {
        justify-content: center;
    }

    .not-exist-items p {
        font-size: 18px;
        text-align: center;
    }

    .cart-item {
        align-items: start !important;
    }

    .video-content-block{
        flex-direction: column;
        width: 100%;
    }

    .video-title-web{
        display: none !important;
    }

    .item-content{
        width: 100%;
    }

    .course-video-div-main {
        min-height: 90px;
        gap: 10px;
        width: 40%;
    }
}


/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .course-video-div-main {
        min-height: 154px;
        border-radius: 16px;
    }

    .instructor-name,
    .total-hours,
    .price-mobile,
    .rate-num,
    .rate-title,
    .remove-btn,
    .move-to-btn{
        font-size: 16px;
    }

    .custom-title-overlay{
        gap:12px;
    }
    .video-title{
        font-size: 18px;
    }

    .cart-item{
        gap:15px;
    }
}

/* Extra Large Devices */
@media (min-width: 1200px) {
    .my-course-btn:hover {
        height: 56px;
        width: 186px;
        font-size: 18px;
    }

    .my-cart-btn:hover {
        height: 46px;
        width: 186px;
        font-size: 18px;
    }
}


</style>