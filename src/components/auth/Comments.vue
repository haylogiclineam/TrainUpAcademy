<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import api from '../../services/api.js';
const route = useRoute();
import { useRouter } from 'vue-router';
const router = useRouter();

const courseId = route.params.id;
import {useI18n} from 'vue-i18n';

const {locale, t} = useI18n()

const comments = ref([]);
const pagination = ref({});
const currentPage = ref(1);
const isLoading = ref(false);

const fetchComments = async (page = 1) => {
    isLoading.value = true;
    try {
        const response = await api.get(`/api/course-comments/${courseId}?page=${page}`);
        comments.value = response.data.comments.data;
        pagination.value = response.data.comments;
        currentPage.value = page;
    } catch (error) {
        console.error('Error fetching comments:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    const pageFromQuery = parseInt(route.query.page) || 1;
    fetchComments(pageFromQuery);
});


const goToPage = (page) => {
    if (page && page !== currentPage.value && page >= 1 && page <= pagination.value.last_page) {
        router.push({ query: { ...route.query, page } }); // update URL
        fetchComments(page);
    }
};

const baseUrl = import.meta.env.VITE_API_BASE_URL;
</script>

<template>
    <div class="course-comments">
        <div class="container">
            <div class="course-comments-main d-flex flex-column">
                <h2 class="comment-block-title">{{$t('comments')}}</h2>
                <div v-if="isLoading" class="text-center my-4">
                    <div class="spinner-border text-secondary" role="status" style="width: 2.5rem; height: 2.5rem;">
                        <span class="visually-hidden"></span>
                    </div>
                </div>

                <div v-else class="comments d-flex flex-column gap-4">
                    <div
                        v-for="comment in comments"
                        :key="comment.id"
                        class="single-comment d-flex flex-column gap-3"
                    >
                        <div class="comment-info d-flex gap-3 align-items-center">
                            <div class="student-img">
                                <img :src="`${baseUrl}/storage/auth/${comment.user.image}`"
                                     alt="userImage"/>
                            </div>
                            <div class="student-name">
                                <p class="m-0">
                                    {{ comment.user.first_name }} {{ comment.user.last_name }}
                                </p>
                                <span class="text-capitalize">{{
                                        $t(`auth.roles.${comment.user.roles[0]?.name}`)
                                    }} </span>
                            </div>
                        </div>
                        <div class="comment-text">
                            <p>
                                {{ comment.comment_text || 'No comment text provided.' }}
                            </p>
                        </div>
                    </div>
                </div>

                <nav v-if="pagination.last_page > 1">
                    <ul class="pagination d-flex justify-content-center">

                        <!-- Prev Button -->
                        <li
                            class="page-item page-item-btn"
                            :class="{ 'page-link-disabled': !pagination.prev_page_url }"
                        >
                            <a
                                class="page-link"
                                href="#"
                                tabindex="-1"
                                aria-disabled="true"
                                @click.prevent="goToPage(currentPage - 1)"
                            >
                                <!-- Left Arrow SVG -->
                                <svg width="9" height="19" viewBox="0 0 9 19" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M8.62887 0.394604C8.74647 0.520754 8.83981 0.670837 8.90351 0.836199C8.96721 1.00156 9 1.17893 9 1.35807C9 1.5372 8.96721 1.71457 8.90351 1.87993C8.83981 2.04529 8.74647 2.19538 8.62887 2.32153L2.88245 8.53654C2.76485 8.66269 2.67151 8.81277 2.60781 8.97813C2.54411 9.1435 2.51131 9.32086 2.51131 9.5C2.51131 9.67914 2.54411 9.85651 2.60781 10.0219C2.67151 10.1872 2.76485 10.3373 2.88245 10.4635L8.62887 16.6785C8.74647 16.8046 8.83981 16.9547 8.90351 17.1201C8.96721 17.2854 9 17.4628 9 17.6419C9 17.8211 8.96721 17.9984 8.90351 18.1638C8.83981 18.3292 8.74647 18.4792 8.62887 18.6054C8.39379 18.8581 8.07579 19 7.74432 19C7.41285 19 7.09485 18.8581 6.85977 18.6054L1.1008 12.3768C0.395924 11.6135 0 10.5788 0 9.5C0 8.42119 0.395924 7.38649 1.1008 6.62318L6.85977 0.394604C7.09485 0.141865 7.41285 0 7.74432 0C8.07579 0 8.39379 0.141865 8.62887 0.394604Z"
                                          fill="#C2C2C2"/>
                                </svg>
                            </a>
                        </li>

                        <!-- Page Numbers -->
                        <li>
                            <ul class="list-unstyled d-flex pagination-numbers">
                                <li
                                    v-for="page in pagination.last_page"
                                    :key="page"
                                    class="page-item"
                                    :class="{ active: page === currentPage }"
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

                        <!-- Next Button -->
                        <li
                            class="page-item page-item-btn"
                            :class="{ 'page-link-disabled': !pagination.next_page_url }"
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
.course-comments {
    padding: 8% 0;
}

.comment-block-title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-100);
}

.course-comments-main {
    gap: 20px;
}

.single-comment {
    border-width: 0.5px;
    border-style: solid;
    border-color: var(--primary-40);
    box-sizing: border-box;
    -webkit-appearance: none;
    border-radius: 16px;
    padding: 20px;

}

.student-img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
}

.student-img img {
    height: 100%;
    width: 100%;
    object-fit: cover;
}

.student-name p,
.student-name span {
    font-family: var(--font-montserrat);
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0%;
}

.student-name p {
    font-size: 18px;
    color: var(--primary-100);
}

.student-name span,
.comment-text p {
    font-size: 16px;
    color: var(--primary-60);
}

.comment-text p {
    font-family: var(--font-inter);
    font-weight: 300;
    line-height: normal;
    letter-spacing: 0%;
    margin-bottom: 0;
}

/* Extra Small Devices */
@media (max-width: 575px) {
   .comment-block-title{
       font-size: 22px;
   }

    .comment-text p{
        font-size: 14px;
    }

    .single-comment{
        border-radius: 8px;
    }
    .course-comments-main{
        gap:40px;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .comment-block-title{
        font-size: 22px;
    }

    .comment-text p{
        font-size: 14px;
    }

    .single-comment{
        border-radius: 8px;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .comment-block-title{
        font-size: 22px;
    }

    .comment-text p{
        font-size: 14px;
    }

    .single-comment{
        border-radius: 8px;
    }
}

</style>