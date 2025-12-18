<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api.js';

const rating = ref(5);
const comments = ref([]);
const loading = ref(false);

const setRating = (star) => {
    rating.value = star;
};

const baseUrl = import.meta.env.VITE_API_BASE_URL;

const fetchComments = async () => {
    loading.value = true;
    try {
        const response = await api.get('/api/latest-learner-comments');
        comments.value = response.data;
        console.log( response.data)
    } catch (error) {
        console.error('Error fetching comments', error);
    }finally {
        loading.value = false;
    }
};

onMounted(fetchComments);
</script>

<template>
    <div class="testimonial-section">
        <div class="container">
            <div class="d-flex justify-content-between align-items-center testimonial-main">
                <div class="testimonial-content">
                    <h3 class="text-capitalize">{{ $t('testimonials.title') }}</h3>
                    <p>{{ $t('testimonials.description') }}</p>
                    <div class="arrow-section">
                        <div class="arrow d-flex align-items-center">
                            <div class="arrow-icon">
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.0001 3.99997C9.99684 3.64923 9.85552 3.3139 9.60675 3.06663L6.74675 0.199965C6.62184 0.0757982 6.45287 0.00610352 6.27675 0.00610352C6.10062 0.00610352 5.93166 0.0757982 5.80675 0.199965C5.74426 0.261941 5.69467 0.335675 5.66082 0.416914C5.62697 0.498154 5.60955 0.585291 5.60955 0.673299C5.60955 0.761307 5.62697 0.848444 5.66082 0.929683C5.69467 1.01092 5.74426 1.08466 5.80675 1.14663L8.00008 3.3333H1.33341C1.1566 3.3333 0.987035 3.40354 0.86201 3.52856C0.736986 3.65359 0.666748 3.82315 0.666748 3.99997C0.666748 4.17678 0.736986 4.34635 0.86201 4.47137C0.987035 4.59639 1.1566 4.66663 1.33341 4.66663H8.00008L5.80675 6.85997C5.68121 6.98462 5.61034 7.15403 5.60971 7.33094C5.60909 7.50785 5.67876 7.67776 5.80341 7.8033C5.92807 7.92883 6.09748 7.99971 6.27439 8.00034C6.4513 8.00096 6.62121 7.93128 6.74675 7.80663L9.60675 4.93997C9.85714 4.69107 9.99859 4.35302 10.0001 3.99997Z"
                                          fill="#F5F5F5"/>
                                </svg>
                            </div>
                            <span class="text-capitalize ms-2">{{ $t('testimonials.best_conference') }}</span>
                        </div>
                        <div class="arrow d-flex align-items-center">
                            <div class="arrow-icon">
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.0001 3.99997C9.99684 3.64923 9.85552 3.3139 9.60675 3.06663L6.74675 0.199965C6.62184 0.0757982 6.45287 0.00610352 6.27675 0.00610352C6.10062 0.00610352 5.93166 0.0757982 5.80675 0.199965C5.74426 0.261941 5.69467 0.335675 5.66082 0.416914C5.62697 0.498154 5.60955 0.585291 5.60955 0.673299C5.60955 0.761307 5.62697 0.848444 5.66082 0.929683C5.69467 1.01092 5.74426 1.08466 5.80675 1.14663L8.00008 3.3333H1.33341C1.1566 3.3333 0.987035 3.40354 0.86201 3.52856C0.736986 3.65359 0.666748 3.82315 0.666748 3.99997C0.666748 4.17678 0.736986 4.34635 0.86201 4.47137C0.987035 4.59639 1.1566 4.66663 1.33341 4.66663H8.00008L5.80675 6.85997C5.68121 6.98462 5.61034 7.15403 5.60971 7.33094C5.60909 7.50785 5.67876 7.67776 5.80341 7.8033C5.92807 7.92883 6.09748 7.99971 6.27439 8.00034C6.4513 8.00096 6.62121 7.93128 6.74675 7.80663L9.60675 4.93997C9.85714 4.69107 9.99859 4.35302 10.0001 3.99997Z"
                                          fill="#F5F5F5"/>
                                </svg>
                            </div>
                            <span class="text-capitalize ms-2">{{ $t('testimonials.certified_trusted') }}</span>
                        </div>
                        <div class="arrow d-flex  align-items-center">
                            <div class="arrow-icon">
                                <svg width="10" height="8" viewBox="0 0 10 8" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M10.0001 3.99997C9.99684 3.64923 9.85552 3.3139 9.60675 3.06663L6.74675 0.199965C6.62184 0.0757982 6.45287 0.00610352 6.27675 0.00610352C6.10062 0.00610352 5.93166 0.0757982 5.80675 0.199965C5.74426 0.261941 5.69467 0.335675 5.66082 0.416914C5.62697 0.498154 5.60955 0.585291 5.60955 0.673299C5.60955 0.761307 5.62697 0.848444 5.66082 0.929683C5.69467 1.01092 5.74426 1.08466 5.80675 1.14663L8.00008 3.3333H1.33341C1.1566 3.3333 0.987035 3.40354 0.86201 3.52856C0.736986 3.65359 0.666748 3.82315 0.666748 3.99997C0.666748 4.17678 0.736986 4.34635 0.86201 4.47137C0.987035 4.59639 1.1566 4.66663 1.33341 4.66663H8.00008L5.80675 6.85997C5.68121 6.98462 5.61034 7.15403 5.60971 7.33094C5.60909 7.50785 5.67876 7.67776 5.80341 7.8033C5.92807 7.92883 6.09748 7.99971 6.27439 8.00034C6.4513 8.00096 6.62121 7.93128 6.74675 7.80663L9.60675 4.93997C9.85714 4.69107 9.99859 4.35302 10.0001 3.99997Z"
                                          fill="#F5F5F5"/>
                                </svg>
                            </div>
                            <span class="text-capitalize ms-2">{{ $t('testimonials.world_class_support') }}</span>
                        </div>
                    </div>
                </div>
                <div v-if="loading" class="d-flex justify-content-center align-items-center my-5">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="visually-hidden">{{ $t('loading') }}...</span>
                    </div>
                </div>
                <div v-else class="testimonial-comments d-flex flex-wrap wrap justify-content-end">
                    <div
                        class="client-comment"
                        v-for="(comment, index) in comments"
                        :key="comment.id"
                    >
                        <div class="content">
                            <div class="rating">
                                <svg
                                    v-for="star in 5"
                                    :key="star"
                                    width="22"
                                    height="22"
                                    viewBox="0 0 20 21"
                                    fill="none"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <g clip-path="url(#clip0)">
                                        <path
                                            d="M16.2225 19.93L10 15.3567L3.77751 19.93L6.16668 12.5442L-0.0524902 8.00002H7.62584L10 0.601685L12.3742 8.00002H20.0517L13.8333 12.5442L16.2225 19.93Z"
                                            :fill="star <= comment.user_rating ? '#F0AD4E' : '#D3D3D3'"
                                        />
                                    </g>
                                    <defs>
                                        <clipPath id="clip0">
                                            <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
                                        </clipPath>
                                    </defs>
                                </svg>
                            </div>

                            <span class="text-capitalize course-name">{{ comment.course?.title_en ?? 'Course Title' }}</span>
                            <p class="p">{{ comment.comment_text }}</p>

                            <div class="client-info d-flex justify-content-between align-items-center">
                                <div class="d-flex align-items-center justify-content-between name-img-block">
                                    <div class="img">
                                        <img :src="`${baseUrl}/storage/auth/${comment.user.image}`"
                                             alt="userImage"/>
                                    </div>
                                    <div class="name-block">
                                        <p class="text-capitalize">{{ comment.user.first_name }}</p>
                                        <span class="text-capitalize">{{
                                                $t(`auth.roles.${comment.user.roles[0]?.name}`)
                                            }} </span>
                                    </div>
                                </div>
                                <div>
                                    <img
                                        src="/assets/icons/testimonials/client-testimonial.svg"
                                        alt="client-testimonial"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </div>
    </div>
</template>

<style scoped>
.testimonial-section {
    background: var(--secondary-2-10);
    padding: 8% 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.testimonial-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 38%;
}

.testimonial-content h3 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-100);
    margin: 0;
}

.testimonial-content p,
.testimonial-content span {
    font-family: var(--font-inter);
    font-weight: 300;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-60)
}

.testimonial-content p {
    font-size: 18px;
    margin: 0;
}

.testimonial-content span {
    font-size: 16px;
}

.arrow-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.arrow-icon {
    width: 20px;
    height: 20px;
    background: var(--primary-100);
    border-radius: 50%;
    display: flex;
    justify-content: center;
    align-items: center;
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



.testimonial-comments {
    flex-wrap: wrap !important;
    width: 59%;
    justify-content: space-between;
    gap: 16px;
}

.view-more-testimonials,
.client-comment {
    width: 346px;
    min-height: 271px;
    border-radius: 16px;
}

.client-comment {
    box-sizing: border-box !important;
    border-width: 0.5px;
    border-style: solid;
    border-color: var(--primary-40) !important;;
    background-color: var(--secondary-2-10);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 2% 0;
    -webkit-appearance: none !important;
    outline: none;
    transform: scale(1) !important;
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
    fill: var(--secondary-1-100) !important;
}

polygon {
    stroke: none;
    stroke-width: 0;
}

.client-comment .p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-60);
    margin: 0;

}

.client-comment .content {
    width: 90% !important;
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.client-info .img {
    width: 70px;
    height: 70px;
    border-radius: 50%;
    overflow: hidden;
}

.client-info .img img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

.name-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding-left: 10%;
    min-width: 64%;
}

.name-block p {
    color: var(--primary-100);
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    margin: 0;
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;

}

.name-block span {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-60);
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.course-name{
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-90);
    white-space: normal;
    word-wrap: break-word;
    overflow-wrap: break-word;
}

.name-img-block {
    width: 60% !important;
}

.view-more-testimonials {
    background-image: url("/assets/images/home/testimonials/view-more.png");
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
}

.view-more-testimonials:hover:before {
    background: var(--view-more-testimonial-hover);
}

.view-more-testimonials:hover .view-more-a {
    color: var(--white-245);
}

.view-more-testimonials:before {
    content: "";
    background: var(--view-more-testimonial);
    position: absolute;
    width: 100%;
    height: 100%;
}

.view-more-a {
    font-family: var(--font-montserrat);
    font-weight: 300;
    font-size: 24px;
    line-height: normal;
    letter-spacing: 2%;
    text-align: center;
    color: var(--primary-20);
    text-decoration: none;
    position: absolute;
    width: 50%;
}

.testimonial-main{
    gap:20px;
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .testimonial-section {
        padding: 18% 0 13%;
    }

    .testimonial-main {
        flex-direction: column;
    }

    .testimonial-content {
        width: 100%;
        align-items: center;
    }

    .testimonial-content h3,
    .testimonial-content p {
        text-align: center;
    }

    .testimonial-content p {
        text-align: center;
    }

    .testimonial-content h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .arrow-section {
        width: 100%;
        align-items: center;
    }

    .learn-more-btn {
        padding: 10px 22px;
        font-size: 15px;
    }

    .learn-more-btn:hover {
        transform: scale(1.03);
    }

    .testimonial-comments {
        width: 100%;
        margin-top: 6%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .client-comment .p {
        font-size: 14px;
    }

    .view-more-a {
        width: 100%;
        font-size: 18px;
    }

    .view-more-testimonials {
        min-height: 140px;
        width: 100%;
        background-position: center;
        background-size: cover;
    }

    .client-comment,
    .view-more-testimonials {
        border-radius: 8px;
    }

    .client-comment {
        width: 100%;
        padding: 5% 0;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .testimonial-section {
        padding: 10% 0 8%;
    }

    .testimonial-main {
        flex-direction: column;
    }

    .testimonial-content {
        width: 100%;
        align-items: center;
    }

    .testimonial-content h3,
    .testimonial-content p {
        text-align: center;
    }

    .testimonial-content p {
        text-align: center;
    }

    .testimonial-content h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .arrow-section {
        width: 100%;
        align-items: center;
    }

    .learn-more-btn {
        padding: 10px 22px;
        font-size: 15px;
    }

    .learn-more-btn:hover {
        transform: scale(1.03);
    }

    .testimonial-comments {
        width: 100%;
        margin-top: 6%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .client-comment .p {
        font-size: 14px;
    }

    .view-more-a {
        width: 100%;
        font-size: 18px;
    }

    .view-more-testimonials {
        min-height: 140px;
        width: 100%;
        background-position: center;
        background-size: cover;
    }

    .client-comment,
    .view-more-testimonials {
        border-radius: 8px;
    }

    .client-comment {
        width: 100%;
        padding: 5% 0;
    }

    .name-img-block {
        width: 40% !important;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .testimonial-section {
        padding: 10% 0 8%;
    }

    .testimonial-main {
        flex-direction: column;
    }

    .testimonial-content {
        width: 100%;
        align-items: center;
    }

    .testimonial-content h3,
    .testimonial-content p {
        text-align: center;
    }

    .testimonial-content p {
        text-align: center;
        font-size: 16px;
    }

    .testimonial-content h3 {
        font-size: 38px;
        font-weight: 300;
    }

    .arrow-section {
        width: 100%;
        align-items: center;
    }

    .learn-more-btn {
        padding: 11px 24px;
        font-size: 15px;
    }

    .learn-more-btn:hover {
        transform: scale(1.04);
    }

    .testimonial-comments {
        width: 100%;
        margin-top: 6%;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .client-comment .p {
        font-size: 16px;
    }

    .view-more-a {
        width: 100%;
        font-size: 20px;
    }

    .view-more-testimonials {
        min-height: 140px;
        width: 100%;
        background-position: center;
        background-size: cover;
    }

    .client-comment,
    .view-more-testimonials {
        border-radius: 8px;
    }

    .client-comment {
        width: 100%;
        padding: 5% 0;
    }

    .name-img-block {
        width: 40% !important;
    }

    .client-info .img {
        width: 90px;
        height: 90px;
        border-radius: 50%;
        overflow: hidden;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .client-comment,
    .view-more-testimonials {
        width: 48%;
    }

    .name-img-block {
        width: 90% !important;
    }

    .client-info .img {
        width: 60px;
        height: 60px;
    }

    .name-block{
        padding-left: 2%;
    }
}

/* Extra Large Devices */
@media (min-width: 1200px) {
    .client-comment,
    .view-more-testimonials {
        width: 48%;
    }

    .name-img-block {
        width: 90% !important;
    }

    .client-info .img {
        width: 60px;
        height: 60px;
    }

    .name-block{
        padding-left: 2%;
    }
}

/* Extra Large Devices */
@media (min-width: 1300px) {
    .testimonial-comments{
        width: 67%;
    }
}


</style>