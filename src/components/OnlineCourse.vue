<script setup>
import { computed, ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import api from "/src/services/api.js";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "../stores/auth.js";
import { useWishlistCount } from '../composables/useWishlistCount.js';
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Navigation } from 'vue3-carousel'

const carouselRef = ref(null)
const currentSlide = ref(0)
const itemsToShow = ref(2)

function updateItemsToShow() {
    const width = window.innerWidth
    if (width < 576) itemsToShow.value = 1
    else if (width < 992) itemsToShow.value = 1
    else itemsToShow.value = 2
}

const authStore = useAuthStore();
const { locale, t } = useI18n();

const route = useRoute();
const router = useRouter();

const isHomePage = computed(() => route.path === "/");
const isCoursesPage = computed(() => route.path === "/courses");

const searchQuery = ref(route.query.search || "");
const currentPage = ref(parseInt(route.query.page) || 1);
const totalPages = ref(1);
const courses = ref([]);
const loading = ref(false);

const debounceTimeout = ref(null);

const onlineCoursesSectionClass = computed(() => {
    const classes = {
        "/": "online-course-section",
        "/courses": "online-course-section-for-courses",
    };
    return classes[route.path] || "online-course-section";
});

const courseTextClass = computed(() =>
    isCoursesPage.value ? "course-text-primary" : ""
);
const courseItemClass = computed(() =>
    isCoursesPage.value ? "course-item-for-courses" : ""
);
const itemImgClass = computed(() =>
    isCoursesPage.value ? "item-img item-img-before" : "item-img"
);
const itemContentClass = computed(() =>
    isCoursesPage.value ? "item-content item-content-before" : "item-content"
);

const likedCourses = ref([]);
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const { wishlistCount, loadWishlistCount } = useWishlistCount();

const toggleLike = async (courseId) => {
    if (!authStore.isAuthenticated || authStore.userRole !== 'learner') return;

    try {
        if (likedCourses.value.includes(courseId)) {
            const res = await api.post(`/api/wishlist/remove/${courseId}`);
            likedCourses.value = likedCourses.value.filter(id => id !== courseId);

            wishlistCount.value = res.data.wishlist_count ?? wishlistCount.value - 1;

        } else {
            const res = await api.post(`/api/wishlist/add/${courseId}`);
            likedCourses.value.push(courseId);

            wishlistCount.value = res.data.wishlist_count ?? wishlistCount.value + 1;
        }
    } catch (err) {
        console.error('Wishlist API error', err);
    }
};

const isCourseLiked = (id) => likedCourses.value.includes(Number(id))

const visibleCourses = computed(() => {
    return isHomePage.value ? courses.value.slice(0, 2) : courses.value;
});

const onlineCourseContentStyle = computed(() => {
    if (isHomePage.value) return { gap: "60px" };
    if (isCoursesPage.value) return { gap: "40px" };
    return {};
});

const currencySymbols = {
    AMD: "֏",
    EUR: "€",
    USD: "$",
};

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

function getLocalizedField(obj, fieldBase) {
    const loc = locale.value;

    if (!obj) return "";

    const valArm = obj[`${fieldBase}_arm`];
    const valRu = obj[`${fieldBase}_ru`];
    const valEn = obj[`${fieldBase}_en`] || "";

    if (loc === "arm") {
        return valArm ? valArm : valEn;
    } else if (loc === "ru") {
        return valRu ? valRu : valEn;
    } else {
        return valEn;
    }
}

const fetchCourses = async (page = 1, search = "") => {
    loading.value = true;
    try {
        const url = `/api/all-courses-general?page=${page}` + (search ? `&search=${encodeURIComponent(search)}` : "");
        const response = await api.get(url);
        courses.value = response.data.data || response.data;
        currentPage.value = response.data.current_page || 1;
        totalPages.value = response.data.last_page || 1;
    } catch (error) {
        console.error("Failed to fetch courses:", error);
    }finally {
        loading.value = false;
    }
};

const goToPage = (page) => {
    if (page < 1 || page > totalPages.value) return;
    currentPage.value = page;

    router.replace({
        query: {
            ...route.query,
            page,
            search: searchQuery.value || undefined,
        },
    });

    fetchCourses(page, searchQuery.value);
};


const isActivePage = (page) => page === currentPage.value;

watch(
    () => searchQuery.value,
    (newSearch) => {
        currentPage.value = 1;

        router.replace({
            query: {
                ...route.query,
                search: newSearch || undefined,
                page: 1,
            },
        });

        if (debounceTimeout.value) clearTimeout(debounceTimeout.value);
        debounceTimeout.value = setTimeout(() => {
            fetchCourses(1, newSearch);
        }, 300);
    }
);

const fetchAllCoursesForSlider = async () => {
    loading.value = true
    try {
        const response = await api.get(`/api/all-courses-general?page=1`)
        const totalPages = response.data.last_page || 1
        const allCourses = [...response.data.data]

        for (let page = 2; page <= totalPages; page++) {
            const res = await api.get(`/api/all-courses-general?page=${page}`)
            allCourses.push(...res.data.data)
        }

        courses.value = allCourses
    } catch (error) {
        console.error("Failed to fetch all courses for slider:", error)
    } finally {
        loading.value = false
    }
}

const wishlistLoaded = ref(false);

onMounted(async () => {
    updateItemsToShow()
    window.addEventListener('resize', updateItemsToShow)

    if (isHomePage.value) {
        await fetchAllCoursesForSlider()
    } else {
        await fetchCourses(currentPage.value, searchQuery.value)
    }

    if (authStore.isAuthenticated && authStore.userRole === 'learner') {
        try {
            const response = await api.get('/api/wishlist')
            likedCourses.value = response.data.data.map(item => Number(item.course_id))
        } catch (error) {
            console.error("Failed to fetch wishlist:", error)
        } finally {
            wishlistLoaded.value = true
        }
    } else {
        wishlistLoaded.value = true
    }
})

</script>

<template>
    <div :class="onlineCoursesSectionClass">
        <div class="container">
            <div :style="onlineCourseContentStyle" class="online-course-content position-relative">
                <div class="d-flex justify-content-between align-items-center content-title-block">
                    <div class="course-content" :class="courseTextClass">
                        <h3 class="text-capitalize">Featured Online Course</h3>
                        <p class="mb-0">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus
                            nec ullamcorper mattis, pulvinar</p>
                    </div>
                    <div v-if="isHomePage" class="learn-more-btn-div d-flex justify-content-center align-items-center">
                        <router-link to="/courses" class="learn-more-btn text-capitalize text-decoration-none text-center d-flex justify-content-center align-items-center">{{$t('learn_more')}}</router-link>
                    </div>
                </div>
                <div v-if="isCoursesPage" class="position-relative search-block mb-3">
                    <input
                        v-model="searchQuery"
                        type="search"
                        class="search-form-control ps-5"
                        :placeholder="t('what_are_you_looking_for')"
                        autocomplete="off"
                    />
                    <svg
                        class="position-absolute top-50 start-0 translate-middle-y ms-3"
                        width="19"
                        height="19"
                        viewBox="0 0 19 19"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M18.6527 16.9775L14.9753 13.2985C17.7269 9.62139 16.9766 4.40985 13.2995 1.65824C9.62236 -1.09337 4.41083 -0.343099 1.65921 3.33401C-1.0924 7.01113 -0.342122 12.2227 3.33499 14.9743C6.28875 17.1846 10.3457 17.1846 13.2995 14.9743L16.9784 18.6532C17.4408 19.1156 18.1903 19.1156 18.6526 18.6532C19.1149 18.1909 19.1149 17.4413 18.6526 16.9791L18.6527 16.9775ZM8.34789 14.2642C5.07985 14.2642 2.43061 11.615 2.43061 8.34692C2.43061 5.07887 5.07985 2.42963 8.34789 2.42963C11.6159 2.42963 14.2652 5.07887 14.2652 8.34692C14.2617 11.6135 11.6145 14.2607 8.34789 14.2642Z"
                            fill="#5D5D5D"
                        />
                    </svg>
                </div>
                <div v-if="loading" class="d-flex justify-content-center align-items-center my-5">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>
                <Carousel
                        v-if="isHomePage && courses.length"
                        :key="courses.length"
                        ref="carouselRef"
                        v-model:currentSlide="currentSlide"
                        :wrapAround="true"
                        :autoplay="6000"
                        :itemsToShow="itemsToShow"
                        :transition="700"
                        :snapAlign="'start'"
                        class="slider-block w-100"
                >
                    <Slide v-for="(course, index) in courses" :key="index">
                        <div class="course-item-slider d-flex" :class="courseItemClass">
                            <div :class="itemImgClass">
                                <img :src="`${baseUrl}/storage/${course.thumbnail}`" alt="Course Thumbnail" class="course-thumbnail" />
                            </div>
                            <div :class="itemContentClass">
                                <div class="d-flex justify-content-between align-items-center">
                                    <h6 class="price">{{ getCoursePrice(course) }}</h6>
                                    <div class="rating">
                                        <svg
                                            v-for="star in 5"
                                            :key="star"
                                            :class="{ filled: star <= Number(course.average_rating) }"
                                            width="20"
                                            height="21"
                                            viewBox="0 0 20 21"
                                            fill="none"
                                        >
                                            <path
                                                d="M16.2225 19.93L10 15.3567L3.77751 19.93L6.16668 12.5442L-0.0524902 8.00002H7.62584L10 0.601685L12.3742 8.00002H20.0517L13.8333 12.5442L16.2225 19.93Z"
                                                :fill="star <= Number(course.average_rating) ? '#F0AD4E' : '#D3D3D3'"
                                            />
                                        </svg>
                                    </div>
                                </div>
                                <div class="content">
                                    <h1 class="text-capitalize">{{ getLocalizedField(course, 'title') }}</h1>
                                    <p class="clamped-description">{{ getLocalizedField(course, 'description') }}</p>
                                </div>
                                <div class="d-flex justify-content-between gap-3 all-btn-block">
                                    <div class="course-learn-more-btn-div d-flex justify-content-center align-items-center">
                                        <RouterLink :to="`/single-course/${course.id}`" custom v-slot="{ navigate }">
                                            <button @click="navigate" class="course-learn-more-btn text-capitalize">
                                                {{ $t('learn_more') }}
                                            </button>
                                        </RouterLink>
                                    </div>
                                    <div v-if="authStore.userRole === 'learner'" class="buy-btn-div d-flex justify-content-center align-items-center">
                                        <router-link to="/learner/checkout"
                                                     class="buy-btn text-capitalize text-decoration-none text-center d-flex align-items-center justify-content-center">
                                            {{ $t('single_course.buy_now_btn') }}
                                        </router-link>
                                    </div>
                                    <div v-if="!authStore.isAuthenticated" class="buy-btn-div d-flex justify-content-center align-items-center">
                                        <router-link to="/sign-in"
                                                     class="buy-btn text-capitalize text-decoration-none text-center d-flex align-items-center justify-content-center">
                                            {{ $t('single_course.buy_now_btn') }}
                                        </router-link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Slide>

                    <template #addons>
                        <Navigation />
                    </template>
                </Carousel>

                <div v-else-if="isCoursesPage"  class="courses flex-wrap d-flex justify-content-between align-items-center">
                    <div v-for="(course, index) in visibleCourses" :key="index" class="course-item d-flex"
                         :class="courseItemClass">
                        <div :class="itemImgClass">
                            <svg v-if="wishlistLoaded && authStore.isAuthenticated && authStore.userRole === 'learner'"
                                 :key="wishlistLoaded + '-' + course.id"
                                 @click="toggleLike(course.id)"
                                 class="heart-icon"
                                 width="27"
                                 height="25"
                                 viewBox="0 0 27 25"
                                 xmlns="http://www.w3.org/2000/svg"
                                 style="cursor: pointer;"
                            >
                                <path
                                        d="M18.9636 0C17.7437 0.0189745 16.5504 0.359508 15.5042 0.987211C14.4581 1.61491 13.5961 2.50756 13.0052 3.575C12.4144 2.50756 11.5524 1.61491 10.5063 0.987211C9.46008 0.359508 8.2668 0.0189745 7.04691 0C5.10226 0.0844899 3.27009 0.935192 1.95068 2.36625C0.631259 3.79731 -0.0681519 5.6924 0.00524453 7.6375C0.00524453 14.9771 11.8742 23.4542 12.3791 23.8138L13.0052 24.2569L13.6314 23.8138C14.1362 23.4563 26.0052 14.9771 26.0052 7.6375C26.0786 5.6924 25.3792 3.79731 24.0598 2.36625C22.7404 0.935192 20.9082 0.0844899 18.9636 0Z"
                                        :fill="isCourseLiked(course.id) ? 'rgba(75, 187, 228, 1)' : '#F5F5F5'"
                                />
                            </svg>
                            <img :src="`${baseUrl}/storage/${course.thumbnail}`" alt="Course Thumbnail" class="course-thumbnail" />

                        </div>
                        <div :class="itemContentClass">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="price">{{ getCoursePrice(course) }}</h6>
                                <div class="rating">
                                    <svg
                                        v-for="star in 5"
                                        :key="star"
                                        :class="{ filled: star <= Number(course.average_rating) }"
                                        width="20"
                                        height="21"
                                        viewBox="0 0 20 21"
                                        fill="none"
                                        style="pointer-events: none; cursor: default;"
                                    >
                                        <path
                                            d="M16.2225 19.93L10 15.3567L3.77751 19.93L6.16668 12.5442L-0.0524902 8.00002H7.62584L10 0.601685L12.3742 8.00002H20.0517L13.8333 12.5442L16.2225 19.93Z"
                                            :fill="star <= Number(course.average_rating) ? '#F0AD4E' : '#D3D3D3'"
                                        />
                                    </svg>
                                </div>
                            </div>
                            <div class="content">
                                <h1 class="text-capitalize">{{ getLocalizedField(course, 'title') }}</h1>
                                <p class="clamped-description">{{ getLocalizedField(course, 'description') }}</p>
                            </div>
                            <div class="d-flex justify-content-between gap-3 all-btn-block">
                                <div class="course-learn-more-btn-div d-flex justify-content-center align-items-center">
                                    <RouterLink :to="`/single-course/${course.id}`" custom v-slot="{ navigate }">
                                        <button @click="navigate" class="course-learn-more-btn text-capitalize">
                                            {{ $t('learn_more') }}
                                        </button>
                                    </RouterLink>
                                </div>
                                <div v-if="authStore.userRole === 'learner'" class="buy-btn-div d-flex justify-content-center align-items-center">
                                    <router-link to="/learner/checkout"
                                                 class="buy-btn text-capitalize text-decoration-none text-center d-flex align-items-center justify-content-center">
                                        {{ $t('single_course.buy_now_btn') }}
                                    </router-link>
                                </div>
                                <div v-if="!authStore.isAuthenticated" class="buy-btn-div d-flex justify-content-center align-items-center">
                                    <router-link to="/sign-in"
                                                 class="buy-btn text-capitalize text-decoration-none text-center d-flex align-items-center justify-content-center">
                                        {{ $t('single_course.buy_now_btn') }}
                                    </router-link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <nav v-if="isCoursesPage && totalPages > 1">
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
            </div>
        </div>
    </div>
</template>

<style scoped>
.online-course-section,
.online-course-section-for-courses {
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    padding: 8% 0;
}

.online-course-section{
    margin: 8% 0;
}

.online-course-section {
    background-image: url("/assets/images/repeting-image.jpg");
}

.online-course-section::before {
    content: '';
    width: 100%;
    height: 100%;
    background: var(--online-course);
    position: absolute;
    top: 0;
    left: 0;
}

.online-course-content {
    display: flex;
    flex-direction: column;
}

.courses {
    gap: 20px;
}

.course-content {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.course-content h3 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--white-245);
    text-transform: capitalize;
}

.course-content p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
    width: 55%;
}

.course-text-primary h3,
.course-text-primary p {
    color: var(--primary-100) !important;
}


.learn-more-btn,
.course-learn-more-btn,
.buy-btn{
    gap: 10px;
    border-radius: 70px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 1px;
    color: var(--white-229);
    cursor: pointer;
    outline: none;
    border: none;
}

.learn-more-btn {
    background: var(--general-btn);
    width: 176px;
    height: 53px;
}

.learn-more-btn:hover {
    height: 56px;
    width: 186px;
    font-size: 18px;
}

.learn-more-btn-div {
    height: 56px;
    width: 186px;
}

.course-learn-more-btn,
.buy-btn{
    width: 160px;
    height: 48px;
    background: var(--general-btn-light);
}

.course-learn-more-btn-div,
.buy-btn-div{
    height: 51px;
    width: 162px;
}

.course-learn-more-btn:hover,
.buy-btn:hover {
    width: 162px;
    height: 51px;
    font-size: 18px;
}

.course-item,
.course-item-slider{
    min-height: 304px;
    border-radius: 16px;
    border-width: 2px;
    border-color: var(--secondary-2-90);
    border-style: solid;
    backdrop-filter: blur(10px);
    background-color: var(--white-217);
    width: 100%;
}

.course-item-for-courses {
    border: none;
    border-radius: 16px;
    max-width: 587px;
    min-height: 304px;
    background-image: url("/assets/images/courses/courses-items.png");
    background-repeat: no-repeat;
    background-position: 62% 31%;
    background-size: cover;
    position: relative;
    overflow: hidden;
    width: 100%;
}

.course-item-slider{
    flex: 1 1 calc(50% - 20px);
    max-width: 93%;
}

.course-item {
    flex: 1 1 calc(50% - 20px);
    max-width: 50%;
}

.course-item-for-courses > * {
    position: relative;
    z-index: 1;
}

.item-img {
    width: 217px;
    min-height: 300px;
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
}


.item-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
}

.rating {
    display: flex;
    gap: 5px;
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

.item-content {
    width: 75%;
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding: 4%;
}

.item-content .price {
    font-family: var(--font-montserrat);
    font-weight: 300;
    font-size: 22px;
    line-height: 100%;
    letter-spacing: 0%;
    color: var(--secondary-1-100);
}

.item-content .content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.item-content .content h1 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 22px;
    line-height: 100%;
    letter-spacing: 2%;
    color: var(--white-245);
}


.item-content .content p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
}

.search-block {
    width: 100%;
}

.search-block input:focus {
    border: 1px solid var(--neutral-90);
    outline: none;
}

.search-block input::placeholder {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--neutral-80);
}

.search-form-control {
    min-height: 53px;
    border-radius: 52px;
    border: 1px solid var(--neutral-90);
    width: 40%;
    background-color: var(--white-255) !important;
}

.search-block input[type="search"]::-webkit-search-cancel-button {
    -webkit-appearance: none;
    appearance: none;
    display: none;
}

.search-block input[type="search"]::-moz-search-clear-button {
    display: none;
}

.item-img-before::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.2);
    z-index: 0;
}

.item-content-before::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    background: var(--courses-items-content-bg);
    z-index: -1;
}

.item-img,
.item-content {
    position: relative;
}

.heart-icon {
    position: absolute;
    top: 12px;
    left: 10px;
    cursor:pointer;
    z-index: 2;
}

.clamped-description {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
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
    .online-course-section,
    .online-course-section-for-courses {
        padding: 18% 0 13%;
    }

    .online-course-section{
        margin: 18% 0 0 0;
    }

    .content-title-block {
        flex-direction: column;
        gap:20px
    }

    .course-content h3 {
        font-size: 22px;
        text-align: center;
        font-weight: 300;
    }

    .course-content p {
        width: 100%;
        text-align: center;
        font-size: 14px;
        padding: 0 10px;
    }

    .learn-more-btn-div {
        width: 190px;
        height: 50px;
    }

    .learn-more-btn:hover {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .learn-more-btn {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .courses {
        flex-direction: column;
        gap: 20px;
    }

    .course-item,
    .course-item-slider{
        width: 100%;
        flex-direction: column;
        max-width: 100%;
    }

    .course-item,
    .item-img img,
    .course-item-slider{
        border-radius: 8px !important;
    }

    .item-img {
        width: 100% !important;
        height: 200px;
    }

    .item-img img {
        width: 100% !important;
        height: 100%;
        object-position: 12% 12%;
    }

    .item-content {
        width: 100%;
        gap: 18px;
    }

    .item-content .price {
        font-size: 18px;
    }

    .rating svg {
        width: 18px;
        height: 18px;
    }

    .item-content .content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .item-content .content h1 {
        font-size: 14px;
        text-align: center;
    }

    .item-content .content p {
        font-size: 12px;
        text-align: center;
        width: 80%;
        margin: 0;
    }

    .course-learn-more-btn-div,
    .buy-btn-div{
        display: flex;
        align-items: center;
        width: 100% !important;
        height: 44px;
    }

    .course-learn-more-btn:hover,
    .buy-btn:hover{
        width: 131px;
        height: 41px;
        font-size: 14px;
    }

    .course-learn-more-btn,
    .buy-btn{
        width: 131px;
        height: 41px;
        font-size: 14px;
    }

    .course-item {
        flex: 1 1 calc(100% - 20px);
        max-width: 100%;
    }

    .course-item-slider{
        flex: 1 1 calc(100% - 20px);
        max-width: 93%;
    }

    .search-form-control {
        width: 100%;
    }

    .search-block svg {
        width: 17px !important;
        height: 17px !important;
    }

    .search-block input::placeholder {
        font-size: 14px;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .online-course-section,
    .online-course-section-for-courses {
        padding: 10% 0 8%;
    }

    .online-course-section{
        margin: 10% 0 0 0;
    }

    .content-title-block {
        flex-direction: column;
        gap:20px
    }

    .course-content h3 {
        font-size: 22px;
        text-align: center;
        font-weight: 300;
    }

    .course-content p {
        width: 100%;
        text-align: center;
        font-size: 14px;
        padding: 0 10px;
    }

    .learn-more-btn-div {
        width: 190px;
        height: 50px;
    }

    .learn-more-btn:hover {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .learn-more-btn {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .courses {
        flex-direction: column;
        gap: 20px;
    }

    .course-item,
    .course-item-slider{
        width: 100%;
        flex-direction: column;
        max-width: 100%;
    }

    .course-item,
    .item-img img {
        border-radius: 8px !important;
    }

    .item-img {
        width: 100% !important;
        height: 300px;
    }

    .item-img img {
        width: 100% !important;
        height: 100%;
        object-position: 12% 12%;
    }

    .item-content {
        width: 100%;
        gap: 18px;
    }

    .item-content .price {
        font-size: 18px;
    }

    .rating svg {
        width: 18px;
        height: 18px;
    }

    .item-content .content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .item-content .content h1 {
        font-size: 14px;
        text-align: center;
    }

    .item-content .content p {
        font-size: 12px;
        text-align: center;
        width: 80%;
        margin: 0;
    }

    .course-learn-more-btn-div,
    .buy-btn-div{
        display: flex;
        align-items: center;
        width: 100% !important;
        height: 44px;
    }

    .course-learn-more-btn:hover,
    .buy-btn:hover{
        height: 41px;
        width: 141px;
        font-size: 14px;
    }

    .course-learn-more-btn,
    .buy-btn{
        width: 141px;
        height: 41px;
        font-size: 14px;
    }

    .course-item {
        flex: 1 1 calc(100% - 20px);
        max-width: 100%;
    }

    .course-item-slider{
        flex: 1 1 calc(100% - 20px);
        max-width: 93%;
    }

    .search-form-control {
        width: 100%;
    }

    .search-block svg {
        width: 17px !important;
        height: 17px !important;
    }

    .search-block input::placeholder {
        font-size: 14px;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .online-course-section,
    .online-course-section-for-courses {
        padding: 10% 0 8%;
    }

    .online-course-section{
        margin: 10% 0 0 0;
    }

    .content-title-block {
        flex-direction: column;
        gap: 20px;
    }

    .course-content h3 {
        font-size: 38px;
        text-align: center;
        font-weight: 300;
    }

    .course-content p {
        width: 100%;
        text-align: center;
        font-size: 16px;
        padding: 0 10px;
    }

    .learn-more-btn-div {
        width: 190px;
        height: 50px;
    }

    .learn-more-btn:hover {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .learn-more-btn {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .courses {
        flex-direction: column;
        gap: 20px;
    }

    .course-item,
    .course-item-slider{
        width: 100%;
        flex-direction: column;
        max-width: 100%;
    }

    .course-item,
    .item-img img {
        border-radius: 8px !important;
    }

    .item-img {
        width: 100% !important;
        height: 300px;
    }

    .item-img img {
        width: 100% !important;
        height: 100%;
        object-position: 12% 12%;
    }

    .item-content {
        width: 100%;
        gap: 18px;
    }

    .item-content .price {
        font-size: 20px;
    }

    .rating svg {
        width: 24px;
        height: 24px;
    }

    .item-content .content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .item-content .content h1 {
        font-size: 20px;
        text-align: center;
    }

    .item-content .content p {
        font-size: 16px;
        text-align: center;
        width: 80%;
        margin: 0;
    }

    .course-learn-more-btn-div,
    .buy-btn-div{
        display: flex;
        align-items: center;
        width: 100% !important;
        height: 44px;
    }

    .course-learn-more-btn:hover,
    .buy-btn:hover{
        height: 41px;
        width: 200px;
        font-size: 16px;
    }

    .course-learn-more-btn,
    .buy-btn{
        width: 200px;
        height: 41px;
        font-size: 16px;
    }

    .course-item {
        flex: 1 1 calc(100% - 20px);
    }

    .course-item-slider{
        flex: 1 1 calc(100% - 20px);
        max-width: 93%;
    }

    .search-form-control {
        width: 100%;
    }


    .search-block input::placeholder {
        font-size: 14px;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .item-content .content h1 {
        font-size: 18px !important;
    }

    .course-item {
        flex: 1 1 calc(50% - 20px);
    }

    .search-form-control {
        width: 50%;
    }

    .rating{
        gap:1px;
    }

    .rating svg{
        width: 18px;
        height: 18px;
    }

    .item-content .price {
        font-size: 18px;
    }

    .all-btn-block{
        flex-direction: column !important;
    }
}

/* Extra Large Devices */
@media (min-width: 1200px) {
    :deep(.carousel__next) {
        right: -2%;
    }

    :deep(.carousel__prev ) {
        left: -2%;
    }
}

@media (min-width: 1300px) {
    .course-learn-more-btn,
    .buy-btn{
        width: 100%

    }

    .course-learn-more-btn-div,
    .buy-btn-div{
        height: 51px;
        width: 55%;
    }

    .course-learn-more-btn:hover,
    .buy-btn:hover {
        width: 100%;
        height: 51px;
        font-size: 18px;
    }
}

</style>