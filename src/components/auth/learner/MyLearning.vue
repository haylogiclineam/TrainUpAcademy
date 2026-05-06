<script setup>
import {ref, onMounted} from 'vue';
import api from '../../../services/api.js';
import { useI18n } from 'vue-i18n';

const { locale } = useI18n();
const courses = ref([]);
const loading = ref(true);
const baseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.trainup.academy';

function getLocalizedTitle(course) {
    const loc = locale.value;
    if (loc === 'arm') return course.title_arm || course.title_en || '';
    if (loc === 'ru') return course.title_ru || course.title_en || '';
    return course.title_en || '';
}

onMounted(async () => {
    try {
        const res = await api.get('/api/purchased-courses');
        courses.value = res.data.courses || [];
    } catch (err) {
        console.error('Failed to load purchased courses:', err);
    } finally {
        loading.value = false;
    }
});
</script>

<template>
    <div class="my-courses-section">
        <div class="container">
            <div class="my-courses-main">
                <div class="d-flex justify-content-between align-items-center courses-title-block">
                    <h3 class="text-capitalize my-course-section-title">{{ $t('learner_profile.my_learning') }}</h3>
                    <div class="my-course-btn-div d-flex justify-content-center align-items-center">
                        <router-link to="/courses">
                            <button class="my-course-btn">
                               {{ $t('courses') }}
                            </button>
                        </router-link>
                    </div>
                </div>

                <!-- Loading state -->
                <div v-if="loading" class="d-flex justify-content-center my-5">
                    <div class="spinner-border text-secondary" role="status"></div>
                </div>

                <!-- Courses list -->
                <div v-else-if="courses.length > 0" class="d-flex align-items-center flex-wrap wrap justify-content-between gap-5 course-list">
                    <div v-for="course in courses" :key="course.id" class="course-video-div-main">
                        <router-link :to="`/single-course/${course.id}`" class="text-decoration-none">
                            <div class="course-video-div position-relative">
                                <img
                                    :src="`${baseUrl}/storage/${course.thumbnail}`"
                                    :alt="getLocalizedTitle(course)"
                                    class="course-video"
                                />
                            </div>
                            <div class="custom-title-overlay">
                                <p class="video-title">{{ getLocalizedTitle(course) }}</p>
                            </div>
                        </router-link>
                    </div>
                </div>

                <!-- No purchases -->
                <div v-else class="not-exist-items">
                    <p class="mb-0">
                        {{ $t('learner_profile.no_purchases') }}
                    </p>
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

.take-quiz-btn {
    width: 100%;
    margin-top: 8px;
    padding: 10px 20px;
    border-radius: 10px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 14px;
    color: var(--white-229);
    background: var(--general-btn);
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    letter-spacing: 0.5px;
}

.take-quiz-btn:hover {
    opacity: 0.85;
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