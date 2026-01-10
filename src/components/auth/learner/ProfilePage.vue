<script setup>
import {ref, onMounted} from 'vue';

const videos = ref([
    {
        src: '/assets/videos/courses/course-5.mp4',
        title: 'Video 1',
        status: 'Approved',
    },
    {
        src: '/assets/videos/courses/course-6.mp4',
        title: 'Video 2',
        status: 'In Review',
    },
    {
        src: '/assets/videos/courses/course-7.mp4',
        title: 'Video 3',
        status: 'Approved',
    }
])

const videoRefs = ref([]);
const showPlayIcons = ref([]);

onMounted(() => {
    showPlayIcons.value = videos.value.map(() => true);
});

function setVideoRef(el, index) {
    videoRefs.value[index] = el;
    if (el) {
        el.addEventListener('pause', () => {
            showPlayIcons.value[index] = true;
        });
        el.addEventListener('play', () => {
            showPlayIcons.value[index] = false;
        });
    }
}

function playVideo(index) {
    const video = videoRefs.value[index];
    if (video) {
        video.play();
    }
}

const getStatusIcon = (status) => {
    switch (status) {
        case 'In Review':
            return `<svg width="23" height="28" viewBox="0 0 23 28" fill="none"
                     xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.55 9.828V8.16665C19.55 3.65635 15.9459 0 11.5 0C7.05408 0 3.45001 3.65635 3.45001 8.16665V9.828C1.35704 10.7547 0.00301875 12.85 0 15.1666V22.1666C0.00377344 25.3867 2.57591 27.9962 5.74997 28H17.25C20.424 27.9962 22.9962 25.3867 23 22.1666V15.1666C22.997 12.85 21.643 10.7547 19.55 9.828ZM12.65 19.8334C12.65 20.4777 12.1351 21 11.5 21C10.8649 21 10.35 20.4777 10.35 19.8334V17.5C10.35 16.8557 10.8649 16.3334 11.5 16.3334C12.1351 16.3334 12.65 16.8557 12.65 17.5V19.8334ZM17.25 9.33335H5.74997V8.1667C5.74997 4.94506 8.32432 2.33335 11.5 2.33335C14.6757 2.33335 17.25 4.94501 17.25 8.1667V9.33335Z"
                          fill="#4BBBE4"/>
                    </svg>`
        case 'Approved':
            return `<svg width="28" height="28" viewBox="0 0 28 28" fill="none"
                         xmlns="http://www.w3.org/2000/svg">
                        <path d="M28.0093 5.70617C27.6523 2.4535 24.8897 0 21.5833 0C18.0448 0 15.1667 2.87933 15.1667 6.41667V9.33333H5.83333C2.61683 9.33333 0 11.9502 0 15.1667V22.1667C0 25.3832 2.61683 28 5.83333 28H15.1667C18.3832 28 21 25.3832 21 22.1667V15.1667C21 12.7797 19.558 10.7228 17.5 9.821V6.41667C17.5 4.165 19.3317 2.33333 21.5833 2.33333C23.6623 2.33333 25.466 3.92583 25.69 5.9605C25.76 6.601 26.348 7.06183 26.9768 6.993C27.6173 6.92183 28.0793 6.34667 28.0093 5.70617ZM11.6667 19.8333C11.6667 20.4785 11.144 21 10.5 21C9.856 21 9.33333 20.4785 9.33333 19.8333V17.5C9.33333 16.8548 9.856 16.3333 10.5 16.3333C11.144 16.3333 11.6667 16.8548 11.6667 17.5V19.8333Z"
                              fill="#08FFA8"/>
                    </svg>`
        case 'Declined':
            return `<svg width="20" height="24" viewBox="0 0 20 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M17 8.424V6.99998C17 3.13402 13.866 0 10 0C6.13398 0 3 3.13402 3 6.99998V8.424C1.18003 9.2183 0.002625 11.0143 0 13V19C0.00328126 21.76 2.23992 23.9967 4.99998 24H15C17.76 23.9967 19.9967 21.76 20 19V13C19.9974 11.0143 18.82 9.2183 17 8.424ZM11 17C11 17.5523 10.5523 18 10 18C9.44772 18 9.00001 17.5523 9.00001 17V15C9.00001 14.4477 9.44772 14 10 14C10.5523 14 11 14.4477 11 15V17ZM15 8.00002H4.99998V7.00003C4.99998 4.23863 7.23854 2.00002 10 2.00002C12.7615 2.00002 15 4.23858 15 7.00003V8.00002Z" fill="#4BBBE4"/>
                        </svg>
                    `
        default:
            return ''
    }
}
</script>

<template>
    <div class="my-courses-section">
        <div class="container">
            <div class="my-courses-main">
                <div class="my-learning">
                    <div class="d-flex justify-content-between align-items-center courses-title-block">
                        <h3 class="text-capitalize my-course-section-title">{{ $t('learner_profile.my_learning') }}</h3>
                        <div class="my-course-btn-div d-flex justify-content-center align-items-center">
                            <router-link to="">
                                <button class="my-course-btn">
                                    {{ $t('learner_profile.view_more') }}
                                </button>
                            </router-link>
                        </div>
                    </div>

                    <div class="not-exist-items">
                        <p class="mb-0">
                            {{ $t('learner_profile.no_purchases') }}
                        </p>
                    </div>
                </div>
                <div class="my-wishlist">
                    <div class="d-flex justify-content-between align-items-center courses-title-block">
                        <h3 class="text-capitalize my-course-section-title">{{ $t('learner_profile.wishlist') }}</h3>
                        <div class="my-course-btn-div d-flex justify-content-center align-items-center">
                            <router-link to="">
                                <button class="my-course-btn">
                                    {{ $t('learner_profile.view_more') }}
                                </button>
                            </router-link>
                        </div>
                    </div>
                    <div class="d-flex align-items-center flex-wrap wrap justify-content-between gap-5 course-list">
                        <div class="d-flex align-items-center flex-wrap wrap justify-content-between gap-5 course-list">
                            <div
                                    class="course-video-div-main"
                                    v-for="(video, index) in videos"
                                    :key="index"
                            >
                                <div class="course-video-div position-relative">
                                    <div
                                            class="locked-div position-absolute d-flex align-items-center gap-3">
                                        <span v-html="getStatusIcon(video.status)"></span>

                                    </div>

                                    <div
                                            class="position-absolute play-icon-div"
                                            v-if="showPlayIcons[index]"
                                            @click.stop="playVideo(index)"
                                    >
                                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M55.1667 34.7833L35.6733 24.1067C33.8 23.0533 31.58 23.0767 29.73 24.1533C27.8767 25.2367 26.77 27.1667 26.77 29.3133V50.6833C26.77 52.83 27.8767 54.76 29.73 55.8433C30.6733 56.3933 31.7133 56.67 32.7467 56.67C33.75 56.67 34.7467 56.4133 35.6567 55.9033L55.18 45.21C57.0867 44.1367 58.2267 42.19 58.2267 40.0033C58.2267 37.8167 57.0867 35.8667 55.1633 34.7867L55.1667 34.7833ZM53.5667 42.2933L34.0433 52.9867C33.2133 53.45 32.2333 53.4433 31.4167 52.9667C30.5967 52.4867 30.1067 51.6333 30.1067 50.6833V29.3133C30.1067 28.3633 30.5933 27.51 31.4167 27.03C31.83 26.79 32.2867 26.6667 32.7433 26.6667C33.19 26.6667 33.6433 26.7833 34.06 27.0167L53.5533 37.6933C54.3967 38.1667 54.9 39.0267 54.9 39.9933C54.9 40.96 54.3967 41.82 53.57 42.2867L53.5667 42.2933ZM40 0C17.9433 0 0 17.9433 0 40C0 62.0567 17.9433 80 40 80C62.0567 80 80 62.0567 80 40C80 17.9433 62.0567 0 40 0ZM40 76.6667C19.7833 76.6667 3.33333 60.2167 3.33333 40C3.33333 19.7833 19.7833 3.33333 40 3.33333C60.2167 3.33333 76.6667 19.7833 76.6667 40C76.6667 60.2167 60.2167 76.6667 40 76.6667Z"
                                                  fill="#E5EAED"/>
                                        </svg>
                                    </div>

                                    <video
                                            class="course-video"
                                            :src="video.src"
                                            controls
                                            preload="metadata"
                                            @click="showPlayIcons[index] = false"
                                            :ref="el => setVideoRef(el, index)"
                                    ></video>
                                </div>

                                <div class="custom-title-overlay">
                                    <p class="video-title">{{ video.title }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
<!--                    <div class="not-exist-items">-->
<!--                        <p class="mb-0">-->
<!--                            Your wishlist is empty. Keep shopping to find a course!-->
<!--                        </p>-->
<!--                    </div>-->
                </div>
                <div class="my-cart">
                    <div class="d-flex justify-content-between align-items-center courses-title-block">
                        <h3 class="text-capitalize my-course-section-title">{{ $t('learner_profile.my_cart') }}</h3>
                        <div class="my-course-btn-div d-flex justify-content-center align-items-center">
                            <router-link to="">
                                <button class="my-course-btn">
                                    {{ $t('learner_profile.view_more') }}
                                </button>
                            </router-link>
                        </div>
                    </div>
                    <div class="d-flex align-items-center flex-wrap wrap justify-content-between gap-5 course-list">
                        <div class="d-flex align-items-center flex-wrap wrap justify-content-between gap-5 course-list">
                            <div
                                    class="course-video-div-main"
                                    v-for="(video, index) in videos"
                                    :key="index"
                            >
                                <div class="course-video-div position-relative">
                                    <div
                                            class="locked-div position-absolute d-flex align-items-center gap-3">
                                        <span v-html="getStatusIcon(video.status)"></span>

                                    </div>

                                    <div
                                            class="position-absolute play-icon-div"
                                            v-if="showPlayIcons[index]"
                                            @click.stop="playVideo(index)"
                                    >
                                        <svg width="80" height="80" viewBox="0 0 80 80" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M55.1667 34.7833L35.6733 24.1067C33.8 23.0533 31.58 23.0767 29.73 24.1533C27.8767 25.2367 26.77 27.1667 26.77 29.3133V50.6833C26.77 52.83 27.8767 54.76 29.73 55.8433C30.6733 56.3933 31.7133 56.67 32.7467 56.67C33.75 56.67 34.7467 56.4133 35.6567 55.9033L55.18 45.21C57.0867 44.1367 58.2267 42.19 58.2267 40.0033C58.2267 37.8167 57.0867 35.8667 55.1633 34.7867L55.1667 34.7833ZM53.5667 42.2933L34.0433 52.9867C33.2133 53.45 32.2333 53.4433 31.4167 52.9667C30.5967 52.4867 30.1067 51.6333 30.1067 50.6833V29.3133C30.1067 28.3633 30.5933 27.51 31.4167 27.03C31.83 26.79 32.2867 26.6667 32.7433 26.6667C33.19 26.6667 33.6433 26.7833 34.06 27.0167L53.5533 37.6933C54.3967 38.1667 54.9 39.0267 54.9 39.9933C54.9 40.96 54.3967 41.82 53.57 42.2867L53.5667 42.2933ZM40 0C17.9433 0 0 17.9433 0 40C0 62.0567 17.9433 80 40 80C62.0567 80 80 62.0567 80 40C80 17.9433 62.0567 0 40 0ZM40 76.6667C19.7833 76.6667 3.33333 60.2167 3.33333 40C3.33333 19.7833 19.7833 3.33333 40 3.33333C60.2167 3.33333 76.6667 19.7833 76.6667 40C76.6667 60.2167 60.2167 76.6667 40 76.6667Z"
                                                  fill="#E5EAED"/>
                                        </svg>
                                    </div>

                                    <video
                                            class="course-video"
                                            :src="video.src"
                                            controls
                                            preload="metadata"
                                            @click="showPlayIcons[index] = false"
                                            :ref="el => setVideoRef(el, index)"
                                    ></video>
                                </div>

                                <div class="custom-title-overlay">
                                    <p class="video-title">{{ video.title }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
<!--                    <div class="not-exist-items">-->
<!--                        <p class="mb-0">-->
<!--                            Your cart is empty. Keep shopping to find a course!-->
<!--                        </p>-->
<!--                    </div>-->
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