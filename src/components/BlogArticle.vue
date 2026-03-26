<script setup>
import {useRoute, useRouter} from "vue-router";
import {ref, computed, onMounted, watch} from "vue";
import {useI18n} from 'vue-i18n';
import api from '/src/services/api.js';

const {locale} = useI18n();
const route = useRoute();
const router = useRouter();

const isHomePage = computed(() => route.path === '/');
const isBlogPage = computed(() => route.path === '/blog');
const isSingleBlogPage = computed(() => route.name === 'SingleBlog');
const loading = ref(false);

const blogArticleTitleClass = computed(() => {
    const classes = {
        '/': 'blog-article-title',
        '/blog': 'blog-article-title-d-none',
        '/single-blog/:id': 'blog-article-title-d-none',
    };
    return classes[route.path] || 'blog-article-title';
});

const blogArticleSectionPaddingClass = computed(() =>
    isSingleBlogPage.value ? 'blog-article-section-p' : 'blog-article-section'
);

const blogItems = ref([]);
const currentPage = ref(1);
const lastPage = ref(1);

const fetchBlogs = async (page = 1) => {
    loading.value = true;
    try {
        const response = await api.get(`/api/blogs?page=${page}`);
        blogItems.value = response.data.data;
        currentPage.value = response.data.current_page;
        lastPage.value = response.data.last_page;

        sessionStorage.setItem('currentPage', currentPage.value);
    } catch (error) {
        console.error("Error fetching blogs", error);
    } finally {
        loading.value = false;
    }
};

const firstThreeBlogs = ref([]);

const fetchFirstThreeBlogs = async () => {
    loading.value = true;
    try {
        const response = await api.get('/api/blogs?page=1');
        firstThreeBlogs.value = response.data.data.slice(0, 3);
    } catch (error) {
        console.error("Error fetching first three blogs", error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    if (isBlogPage.value) {
        const pageFromUrl = parseInt(route.query.page) || parseInt(sessionStorage.getItem('currentPage')) || 1;
        currentPage.value = pageFromUrl;
        fetchBlogs(pageFromUrl);
    } else {
        fetchFirstThreeBlogs();
    }
});

watch(currentPage, (newPage) => {
    if (isBlogPage.value) {
        router.replace({query: {...route.query, page: newPage}});
    }
});

const localeMap = {
    en: 'en-US',
    ru: 'ru-RU',
    arm: 'hy-AM'
};

function formatDate(dateStr) {
    const date = new Date(dateStr);
    const currentLocale = locale?.value || 'en';
    const lang = localeMap[currentLocale] || 'en-US';

    if (lang === 'hy-AM') {
        const months = [
            'Հունվար', 'Փետրվար', 'Մարտ', 'Ապրիլ', 'Մայիս', 'Հունիս',
            'Հուլիս', 'Օգոստոս', 'Սեպտեմբեր', 'Հոկտեմբեր', 'Նոյեմբեր', 'Դեկտեմբեր'
        ];
        const month = months[date.getMonth()];
        const day = date.getDate();
        const year = date.getFullYear();

        return `${month} ${day}, ${year}`;
    }

    if (lang === 'ru-RU') {
        const months = [
            'Января', 'Февраля', 'Марта', 'Апреля', 'Мая', 'Июня',
            'Июля', 'Августа', 'Сентября', 'Октября', 'Ноября', 'Декабря'
        ];
        const day = date.getDate();
        const month = months[date.getMonth()];
        const year = date.getFullYear();

        return `${day} ${month} ${year}`;
    }

    return date.toLocaleDateString(lang, {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });
}

const imageUrl = (path) => `${import.meta.env.VITE_API_BASE_URL}/storage/${path}`;

const truncateDescription = (description) => {
    if (!description) return '';
    const plainText = description.replace(/<[^>]*>?/gm, '');
    const maxLength = 130;
    return plainText.length > maxLength ? plainText.slice(0, maxLength) + '...' : plainText;
};

const visibleBlogItems = computed(() => {
    if (isBlogPage.value) {
        return blogItems.value;
    } else if (isHomePage.value || isSingleBlogPage.value) {
        return firstThreeBlogs.value;
    }
    return [];
});
</script>


<template>
    <div :class="blogArticleSectionPaddingClass">
        <div class="container">
            <div class="d-flex flex-column justify-content-center align-items-center blog-article-main w-100">
                <div v-if="isBlogPage || isHomePage" :class="blogArticleTitleClass">
                    <h3 class="text-capitalize">{{ $t('blog') }}</h3>
                    <p>{{ $t('blog_description') }}</p>
                </div>
                <div v-if="loading" class="d-flex justify-content-center align-items-center my-5">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="visually-hidden">{{ $t('loading') }}...</span>
                    </div>
                </div>
                <div v-else class="blog-article-items flex-wrap d-flex">
                    <div v-for="(item, index) in visibleBlogItems"
                         :key="index" class="item">
                        <div class="item-img">
                            <img :src="imageUrl(item.image)" :alt="item.image"/>
                        </div>
                        <div class="item-date d-flex align-items-center">
                            <img src="/assets/icons/blog-article/calendar.svg" alt="calendar">
                            <span class="text-capitalize">{{ formatDate(item.created_at) }}</span>
                        </div>
                        <div class="item-content d-flex flex-column">
                            <h5 class="text-capitalize">{{ item[`title_${locale}`] }}</h5>
                            <p>{{ truncateDescription(item[`description_${locale}`]) }}</p>
                            <div class="learn-more-btn-div d-flex align-items-center">
                                <RouterLink :to="`/single-blog/${item.id}`">
                                    <button class="learn-more-btn text-capitalize">
                                        {{ $t('learn_more') }}
                                    </button>
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <nav v-if="isBlogPage && lastPage > 1">
                <ul class="pagination d-flex justify-content-center">
                    <li class="page-item prev-pagination-btn page-item-btn"
                        :class="{ 'page-link-disabled': currentPage === 1 }">
                        <a class="page-link" href="#" tabindex="-1" :aria-disabled="currentPage === 1"
                           @click.prevent="currentPage !== 1 && fetchBlogs(currentPage - 1)"
                           :style="{ borderColor: currentPage === 1 ? '#C2C2C2' : '#AEAEAE' }">
                            <svg width="9" height="19" viewBox="0 0 9 19" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path :fill="currentPage === 1 ? '#C2C2C2' : '#AEAEAE'"
                                      d="M8.62887 0.394604C8.74647 0.520754 8.83981 0.670837 8.90351 0.836199C8.96721 1.00156 9 1.17893 9 1.35807C9 1.5372 8.96721 1.71457 8.90351 1.87993C8.83981 2.04529 8.74647 2.19538 8.62887 2.32153L2.88245 8.53654C2.76485 8.66269 2.67151 8.81277 2.60781 8.97813C2.54411 9.1435 2.51131 9.32086 2.51131 9.5C2.51131 9.67914 2.54411 9.85651 2.60781 10.0219C2.67151 10.1872 2.76485 10.3373 2.88245 10.4635L8.62887 16.6785C8.74647 16.8046 8.83981 16.9547 8.90351 17.1201C8.96721 17.2854 9 17.4628 9 17.6419C9 17.8211 8.96721 17.9984 8.90351 18.1638C8.83981 18.3292 8.74647 18.4792 8.62887 18.6054C8.39379 18.8581 8.07579 19 7.74432 19C7.41285 19 7.09485 18.8581 6.85977 18.6054L1.1008 12.3768C0.395924 11.6135 0 10.5788 0 9.5C0 8.42119 0.395924 7.38649 1.1008 6.62318L6.85977 0.394604C7.09485 0.141865 7.41285 0 7.74432 0C8.07579 0 8.39379 0.141865 8.62887 0.394604Z"/>
                            </svg>
                        </a>
                    </li>

                    <li>
                        <ul class="list-unstyled d-flex pagination-numbers">
                            <li v-for="page in lastPage" :key="page" class="page-item"
                                :class="{ active: page === currentPage, 'page-link-active': page === currentPage }">
                                <a class="page-link" href="#" @click.prevent="fetchBlogs(page)">
                                    {{ page }}
                                </a>
                            </li>
                        </ul>
                    </li>

                    <li class="page-item next-pagination-btn page-item-btn"
                        :class="{ 'page-link-disabled': currentPage === lastPage }">
                        <a class="page-link" href="#" :aria-disabled="currentPage === lastPage"
                           @click.prevent="currentPage !== lastPage && fetchBlogs(currentPage + 1)"
                           :style="{ borderColor: currentPage === lastPage ? '#C2C2C2' : '#AEAEAE' }">
                            <svg width="9" height="19" viewBox="0 0 9 19" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path :fill="currentPage === lastPage ? '#C2C2C2' : '#AEAEAE'"
                                      d="M0.371131 0.394604C0.253532 0.520754 0.160191 0.670837 0.0964931 0.836199C0.0327948 1.00156 0 1.17893 0 1.35807C0 1.5372 0.0327948 1.71457 0.0964931 1.87993C0.160191 2.04529 0.253532 2.19538 0.371131 2.32153L6.11755 8.53654C6.23515 8.66269 6.32849 8.81277 6.39219 8.97813C6.45589 9.1435 6.48869 9.32086 6.48869 9.5C6.48869 9.67914 6.45589 9.85651 6.39219 10.0219C6.32849 10.1872 6.23515 10.3373 6.11755 10.4635L0.371131 16.6785C0.253532 16.8046 0.160191 16.9547 0.0964931 17.1201C0.0327948 17.2854 0 17.4628 0 17.6419C0 17.8211 0.0327948 17.9984 0.0964931 18.1638C0.160191 18.3292 0.253532 18.4792 0.371131 18.6054C0.606211 18.8581 0.924211 19 1.25568 19C1.58715 19 1.90515 18.8581 2.14023 18.6054L7.8992 12.3768C8.60408 11.6135 9 10.5788 9 9.5C9 8.42119 8.60408 7.38649 7.8992 6.62318L2.14023 0.394604C1.90515 0.141865 1.58715 0 1.25568 0C0.924211 0 0.606211 0.141865 0.371131 0.394604Z"/>
                            </svg>
                        </a>
                    </li>
                </ul>
            </nav>
        </div>
    </div>
</template>

<style scoped>
.blog-article-section {
    padding: 8% 0;
}

.blog-article-section-p {
    padding: 2% 0 0 0;
}

.blog-article-main {
    gap: 60px;
}

.blog-article-title-d-none {
    display: none !important;
}

.blog-article-title {
    width: 60%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.blog-article-title h3 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    text-align: center;
    color: var(--primary-100);
    margin: 0;
}

.blog-article-title p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    text-align: center;
    color: var(--primary-60);
    margin: 0;
}

.blog-article-items {
    width: 100%;
    max-width: 1224px;
    gap: 57px;
    justify-content: center;
    align-items: center;
}

.blog-article-items .item {
    width: 370px;
    max-width: 370px;
    min-height: 502px;
    border-radius: 16px;
    background: var(--blog-article-item-bg);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    flex-shrink: 0;
}

.blog-article-items .item-img {
    width: 100%;
    min-height: 240px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
}

.blog-article-items .item-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    position: absolute;
    top: 0;
    left: 0;
}

.item-date span {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--secondary-1-100);
}

.item-date img {
    margin-right: 10px;
}

.learn-more-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 13px 28px;
    gap: 10px;
    border-radius: 25px;
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: var(--white-245);
    cursor: pointer;
    background: var(--general-btn);
    border: none;
    outline: none;
    white-space: nowrap;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.learn-more-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(75, 187, 228, 0.3);
}

.learn-more-btn-div {
    display: flex;
}

.learn-more-btn-div a {
    text-decoration: none;
}

.item-content {
    gap: 20px;
}

.item-content h5,
.item-content p {
    line-height: normal;
    letter-spacing: 2%;
    color: var(--white-245);
    margin: 0;
}

.item-content h5 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 20px;
}

.item-content p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .blog-article-section {
        padding: 18% 0 13%;
    }

    .blog-article-title {
        width: 100%;
    }

    .blog-article-title h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .blog-article-title p {
        font-size: 14px;
    }

    .blog-article-main {
        gap: 40px;
    }

    .blog-article-items {
        flex-direction: column;
        gap: 20px;
    }

    .blog-article-items .item {
        display: flex;
        align-items: center;
        border-radius: 8px;
        width: 100%;
        height: auto;
        min-height: auto;
    }

    .item-content {
        align-items: center;
    }

    .item-content p {
        text-align: center;
        font-size: 14px;
    }

    .item-date img {
        width: 18px;
        height: 18px;
    }

    .item-date span {
        font-size: 14px;
    }

    .item-content h5 {
        font-size: 16px;
    }

    .learn-more-btn {
        padding: 10px 22px;
        font-size: 14px;
    }

    .learn-more-btn:hover {
        transform: scale(1.03);
    }



    .blog-article-items .item-img {
        width: 100%;
        height: auto;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .blog-article-section {
        padding: 10% 0 8%;
    }

    .blog-article-title {
        width: 100%;
    }

    .blog-article-title h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .blog-article-title p {
        font-size: 14px;
    }

    .blog-article-main {
        gap: 40px;
    }

    .blog-article-items {
        flex-direction: column;
        gap: 20px;
    }

    .blog-article-items .item {
        display: flex;
        align-items: center;
        border-radius: 8px;
        width: 100%;
        height: auto;
        min-height: auto;
    }

    .item-content {
        align-items: center;
    }

    .item-content p {
        text-align: center;
        font-size: 14px;
    }

    .item-date img {
        width: 18px;
        height: 18px;
    }

    .item-date span {
        font-size: 14px;
    }

    .item-content h5 {
        font-size: 16px;
    }

    .learn-more-btn {
        padding: 10px 22px;
        font-size: 14px;
    }

    .learn-more-btn:hover {
        transform: scale(1.03);
    }



    .blog-article-items .item-img {
        width: 100%;
        height: auto;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .blog-article-section {
        padding: 10% 0 8%;
    }

    .blog-article-title {
        width: 100%;
    }

    .blog-article-title h3 {
        font-size: 38px;
        font-weight: 300;
    }

    .blog-article-title p {
        font-size: 16px;
    }

    .blog-article-main {
        gap: 35px;
    }

    .blog-article-items {
        flex-direction: column;
        gap: 20px;
    }

    .blog-article-items .item {
        display: flex;
        align-items: center;
        border-radius: 8px;
        width: 100%;
        height: auto;
        min-height: auto;
    }

    .item-content {
        align-items: center;
    }

    .item-content p {
        text-align: center;
        font-size: 16px;
    }

    .item-date img {
        width: 20px;
        height: 20px;
    }

    .item-date span {
        font-size: 16px;
    }

    .item-content h5 {
        font-size: 20px;
    }

    .learn-more-btn {
        padding: 11px 24px;
        font-size: 15px;
    }

    .learn-more-btn:hover {
        transform: scale(1.04);
    }



    .blog-article-items .item-img {
        width: 100%;
        height: auto;
    }
}

/* Large Devices (Laptops) */
@media (min-width: 992px) {
    .blog-article-items {
        flex-wrap: wrap;
        gap: 30px;
        justify-content: center !important;
    }

    .blog-article-items .item {
        width: calc(33.33% - 20px);
        max-width: 370px;
        min-width: 300px;
    }
}

@media (min-width: 1200px) {
    .blog-article-items {
        gap: 57px;
    }
    
    .blog-article-items .item {
        width: calc(33.33% - 38px);
        max-width: 370px;
        min-width: 340px;
    }
}


/* Extra Large Devices */
@media (min-width: 1600px) {
    .blog-article-items {
        gap: 57px;
    }
    
    .blog-article-items .item {
        width: 370px;
        max-width: 370px;
    }
}


</style>