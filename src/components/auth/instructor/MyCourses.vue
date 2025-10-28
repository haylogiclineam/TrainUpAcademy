<script setup>
import {ref, onMounted, watch, computed} from 'vue'
import api from "../../../services/api.js";
import {useI18n} from 'vue-i18n';
import {useAuthStore} from '/src/stores/auth.js';

const isLoading = ref(true)
const auth = useAuthStore()
auth.checkAuth()

const authUser = auth.user;

const {locale, t} = useI18n()

const openIndex = ref(0)
const toggle = (index) => {
    openIndex.value = openIndex.value === index ? null : index
}

const currentPage = ref(1)
const totalPages = ref(1)

const videos = ref(null)

const videoRefs = ref([])
const showPlayIcons = ref([])
const baseUrl = import.meta.env.VITE_API_BASE_URL;

onMounted(() => {
    const queryPage = parseInt(new URLSearchParams(window.location.search).get('page')) || 1;
    currentPage.value = queryPage;
    loadCourses(currentPage.value);
})

async function loadCourses(page = 1) {
    isLoading.value = true
    try {
        const response = await api.get(`/api/courses?page=${page}`, {
            headers: {Accept: 'application/json'}
        })

        const data = response.data
        console.log(data)
        const isAuthenticated = !!authUser.token
        videos.value = data.data.map(course => ({
            ...course,
            src: '',
            statusKey: course.status,
        }))

        applyLocalizedTitles()
        currentPage.value = data.current_page
        totalPages.value = data.last_page
        showPlayIcons.value = videos.value.map(() => true)

        window.history.pushState({}, '', `?page=${page}`)

        if (isAuthenticated) {
            data.data.forEach(async (course, index) => {
                try {
                    const videoUrl = `${baseUrl}/api/stream-video/${course.id}`
                    const blob = await fetchVideoBlob(videoUrl)
                    const blobUrl = URL.createObjectURL(blob)

                    videos.value[index].src = blobUrl
                } catch (error) {
                    console.error(`Failed to load video blob for course ID ${course.id}:`, error)
                }
            })
        }

    } catch (error) {
        console.error('Error loading courses:', error.response?.data || error.message)
    }finally {
        isLoading.value = false
    }
}

async function fetchVideoBlob(url) {
    const token = authUser.token
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })

    if (!response.ok) {
        throw new Error('Failed to fetch video')
    }

    return await response.blob()
}

function formatStatus(statusKey) {
    const mapping = {
        in_review: t('auth.courses.in_review'),
        approved: t('auth.courses.approved'),
        declined: t('auth.courses.declined'),
    }
    return mapping[statusKey] || statusKey
}

const goToPage = (page) => {
    if (page >= 1 && page <= totalPages.value && page !== currentPage.value) {
        currentPage.value = page
        loadCourses(page)
    }
}

const isActivePage = (page) => currentPage.value === page

function setVideoRef(el, index) {
    videoRefs.value[index] = el
    if (el) {
        el.addEventListener('pause', () => {
            showPlayIcons.value[index] = true
        })
        el.addEventListener('play', () => {
            showPlayIcons.value[index] = false
        })
    }
}

function playVideo(index) {
    const video = videoRefs.value[index]
    if (video) video.play()
}

const getStatusIcon = (status) => {
    switch (status) {
        case 'in_review':
            return `<svg width="23" height="28" viewBox="0 0 23 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M19.55 9.828V8.16665C19.55 3.65635 15.9459 0 11.5 0C7.05408 0 3.45001 3.65635 3.45001 8.16665V9.828C1.35704 10.7547 0.00301875 12.85 0 15.1666V22.1666C0.00377344 25.3867 2.57591 27.9962 5.74997 28H17.25C20.424 27.9962 22.9962 25.3867 23 22.1666V15.1666C22.997 12.85 21.643 10.7547 19.55 9.828ZM12.65 19.8334C12.65 20.4777 12.1351 21 11.5 21C10.8649 21 10.35 20.4777 10.35 19.8334V17.5C10.35 16.8557 10.8649 16.3334 11.5 16.3334C12.1351 16.3334 12.65 16.8557 12.65 17.5V19.8334ZM17.25 9.33335H5.74997V8.1667C5.74997 4.94506 8.32432 2.33335 11.5 2.33335C14.6757 2.33335 17.25 4.94501 17.25 8.1667V9.33335Z" fill="#4BBBE4"/>
                    </svg>`
        case 'approved':
            return `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M28.0093 5.70617C27.6523 2.4535 24.8897 0 21.5833 0C18.0448 0 15.1667 2.87933 15.1667 6.41667V9.33333H5.83333C2.61683 9.33333 0 11.9502 0 15.1667V22.1667C0 25.3832 2.61683 28 5.83333 28H15.1667C18.3832 28 21 25.3832 21 22.1667V15.1667C21 12.7797 19.558 10.7228 17.5 9.821V6.41667C17.5 4.165 19.3317 2.33333 21.5833 2.33333C23.6623 2.33333 25.466 3.92583 25.69 5.9605C25.76 6.601 26.348 7.06183 26.9768 6.993C27.6173 6.92183 28.0793 6.34667 28.0093 5.70617ZM11.6667 19.8333C11.6667 20.4785 11.144 21 10.5 21C9.856 21 9.33333 20.4785 9.33333 19.8333V17.5C9.33333 16.8548 9.856 16.3333 10.5 16.3333C11.144 16.3333 11.6667 16.8548 11.6667 17.5V19.8333Z" fill="#08FFA8"/>
                    </svg>`
        case 'declined':
            return `<svg width="28" height="28" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M22.1653 9.828V8.16665C22.1653 3.65635 18.509 0 13.9987 0C9.48833 0 5.83203 3.65635 5.83203 8.16665V9.828C3.70873 10.7547 2.33509 12.85 2.33203 15.1666V22.1666C2.33586 25.3867 4.94527 27.9962 8.16533 28H19.832C23.052 27.9962 25.6614 25.3867 25.6653 22.1666V15.1666C25.6623 12.85 24.2886 10.7547 22.1653 9.828ZM15.1653 19.8334C15.1653 20.4777 14.643 21 13.9987 21C13.3544 21 12.832 20.4777 12.832 19.8334V17.5C12.832 16.8557 13.3544 16.3334 13.9987 16.3334C14.643 16.3334 15.1653 16.8557 15.1653 17.5V19.8334ZM19.832 9.33335H8.16533V8.1667C8.16533 4.94506 10.777 2.33335 13.9987 2.33335C17.2204 2.33335 19.832 4.94501 19.832 8.1667V9.33335Z" fill="#ED4337"/>
                    </svg>`
        default:
            return ''
    }
}

const statusClass = (statusKey) => {
    return {
        approved: '',
        declined: 'required-field',
        in_review: ''
    }[statusKey] || ''
}

const showStatusModal = ref(false)
const selectedStatus = ref(null)
const selectedVideo = ref(null)

function openStatusModal(video) {
    selectedStatus.value = video.status
    selectedVideo.value = video
    showStatusModal.value = true
    showPlayIcons.value[video.src] = true;
}

function closeStatusModal() {
    showStatusModal.value = false
}

function applyLocalizedTitles() {
    if (videos.value) {
        videos.value = videos.value.map(video => {
            let title = video.title_en || ''

            if (locale.value === 'arm') {
                title = video.title_arm || video.title_en || ''
            } else if (locale.value === 'ru') {
                title = video.title_ru || video.title_en || ''
            }

            return {...video, title}
        })
    }
}

watch(locale, () => {
    applyLocalizedTitles()
})

const currencySymbols = {
    AMD: '֏',
    EUR: '€',
    USD: '$'
}
const priceToShow = computed(() => {
    if (!selectedVideo.value) return ''

    const loc = locale.value

    const priceKey = `price_${loc}`
    const currencyKey = `currency_${loc}`

    const localePrice = selectedVideo.value[priceKey]
    const localeCurrency = selectedVideo.value[currencyKey]

    if (localePrice && localeCurrency && localePrice !== '0') {
        const symbol = currencySymbols[localeCurrency] || localeCurrency
        return `${localePrice} ${symbol}`
    }

    const usdPrice = selectedVideo.value.price_en
    const usdCurrency = selectedVideo.value.currency_en

    if (usdPrice && usdCurrency && usdPrice !== '0') {
        const symbol = currencySymbols[usdCurrency] || usdCurrency
        return `${usdPrice} ${symbol}`
    }

    return ''
})

function getLocalizedField(obj, fieldBase) {
    const loc = locale.value;

    if (!obj) return '';

    const valArm = obj[`${fieldBase}_arm`];
    const valRu = obj[`${fieldBase}_ru`];
    const valEn = obj[`${fieldBase}_en`] || '';

    if (loc === 'arm') {
        return valArm ? valArm : valEn;
    } else if (loc === 'ru') {
        return valRu ? valRu : valEn;
    } else {
        return valEn;
    }
}

</script>

<template>
    <div class="my-courses-section">
        <div class="container">
            <div class="my-courses-main">
                <div class="d-flex justify-content-between align-items-center courses-title-block">
                    <h3 class="text-capitalize my-course-section-title"> {{ $t('auth.courses.my_courses_title') }}</h3>
                    <div class="add-course-btn-div d-flex justify-content-center align-items-center">
                        <router-link to="/instructor/add-courses"
                                     :class="{ active: $route.path === '/instructor/add-courses' }">
                            <button class="add-course-btn">
                                {{ $t('auth.courses.add_course') }}
                            </button>
                        </router-link>
                    </div>
                </div>
                <div v-if="isLoading" class="loading-spinner d-flex justify-content-center">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                </div>

                <template v-else-if="videos && videos.length > 0"">
                    <div class="d-flex align-items-center flex-wrap wrap course-list">
                        <div
                                class="course-video-div-main"
                                v-for="(video, index) in videos"
                                :key="index"
                        >
                            <div class="course-video-div position-relative">
                                <div @click.stop="openStatusModal(video)"
                                     class="locked-div position-absolute d-flex align-items-center gap-3">
                                    <span v-html="getStatusIcon(video.statusKey)"></span>
                                    <span class="locked-text" :class="statusClass(video.statusKey)">
                                  {{ t(`auth.courses.${video.statusKey}`) }}
                                </span>
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
                                        v-if="video.src"
                                        class="course-video"
                                        :src="video.src"
                                        controls
                                        controlsList="nodownload"
                                        preload="metadata"
                                        @click="showPlayIcons[index] = false"
                                        @contextmenu.prevent
                                        :ref="el => setVideoRef(el, index)"
                                ></video>


                            </div>

                            <div class="custom-title-overlay">
                                <p class="video-title">{{ video.title }}</p>
                            </div>
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
                </template>
                <div  v-else class="not-exist-items">
                    <p class="mb-0">
                        {{ $t('auth.courses.you_have_not_add_course') }}
                        <router-link to="/instructor/add-courses"
                                     class="text-capitalize"
                                     :class="{ active: $route.path === '/instructor/add-courses' }">
                            {{ $t('auth.courses.add_course') }}
                        </router-link>
                        {{ $t('auth.courses.to_begin') }}
                    </p>
                </div>

            </div>
            <div v-if="showStatusModal" class="modal-overlay">
                <div class="modal-close-btn">
                    <svg @click="closeStatusModal" width="25" height="24"
                         viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <g clip-path="url(#clip0_1178_7483)">
                            <path d="M25.0646 2.061L22.8542 -0.0610046L12.501 9.87899L2.14792 -0.0610046L-0.0625 2.061L10.2917 12L-0.0625 21.939L2.14792 24.061L12.501 14.121L22.8542 24.061L25.0646 21.939L14.7104 12L25.0646 2.061Z"
                                  fill="white"/>
                        </g>
                        <defs>
                            <clipPath id="clip0_1178_7483">
                                <rect width="25" height="24" fill="white"/>
                            </clipPath>
                        </defs>
                    </svg>
                </div>

                <div class="modal-content">
                    <div class="modal-video position-relative">
                        <div class="modal-status-block">
                            <span v-html="getStatusIcon(selectedVideo.statusKey)"></span>
                            <span class="locked-text"
                                  :class="statusClass(selectedVideo.statusKey)">  {{
                                t(`auth.courses.${selectedVideo.statusKey}`)
                                }}</span>
                        </div>
                        <div class="position-absolute play-icon-div"
                             v-if="showPlayIcons[selectedVideo.src]"
                             @click.stop="playVideo(selectedVideo.src)">
                            <svg width="80" height="80" viewBox="0 0 80 80" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M55.1667 34.7833L35.6733 24.1067C33.8 23.0533 31.58 23.0767 29.73 24.1533C27.8767 25.2367 26.77 27.1667 26.77 29.3133V50.6833C26.77 52.83 27.8767 54.76 29.73 55.8433C30.6733 56.3933 31.7133 56.67 32.7467 56.67C33.75 56.67 34.7467 56.4133 35.6567 55.9033L55.18 45.21C57.0867 44.1367 58.2267 42.19 58.2267 40.0033C58.2267 37.8167 57.0867 35.8667 55.1633 34.7867L55.1667 34.7833ZM53.5667 42.2933L34.0433 52.9867C33.2133 53.45 32.2333 53.4433 31.4167 52.9667C30.5967 52.4867 30.1067 51.6333 30.1067 50.6833V29.3133C30.1067 28.3633 30.5933 27.51 31.4167 27.03C31.83 26.79 32.2867 26.6667 32.7433 26.6667C33.19 26.6667 33.6433 26.7833 34.06 27.0167L53.5533 37.6933C54.3967 38.1667 54.9 39.0267 54.9 39.9933C54.9 40.96 54.3967 41.82 53.57 42.2867L53.5667 42.2933ZM40 0C17.9433 0 0 17.9433 0 40C0 62.0567 17.9433 80 40 80C62.0567 80 80 62.0567 80 40C80 17.9433 62.0567 0 40 0ZM40 76.6667C19.7833 76.6667 3.33333 60.2167 3.33333 40C3.33333 19.7833 19.7833 3.33333 40 3.33333C60.2167 3.33333 76.6667 19.7833 76.6667 40C76.6667 60.2167 60.2167 76.6667 40 76.6667Z"
                                      fill="#E5EAED"/>
                            </svg>
                        </div>

                        <video
                                class="course-video"
                                :src="selectedVideo.src"
                                controls
                                preload="metadata"
                                @click="showPlayIcons[selectedVideo.src] = false"
                                controlsList="nodownload"
                                :ref="el => setVideoRef(el, selectedVideo.src)"
                        ></video>
                    </div>
                    <div class="modal-details">
                        <div class="details-title d-flex align-items-center justify-content-between">
                            <p class="modal-course-title mb-0">{{ selectedVideo?.title }}</p>
                            <div v-if="selectedVideo?.statusKey === 'declined'"
                                 class="change-course-btn-div d-flex justify-content-center align-items-center">
                                <router-link :to="`/instructor/change-courses/${selectedVideo?.id}`"
                                             :class="{ active: $route.path === `/instructor/change-courses/${selectedVideo?.id}` }">
                                    <button class="change-course-btn">
                                        {{ $t('auth.courses.change_course') }}
                                    </button>
                                </router-link>
                            </div>
                        </div>
                        <div class="details-content">
                            <div class="course-review-declined-section"
                                 v-if="selectedVideo?.statusKey === 'declined' || selectedVideo?.statusKey === 'in_review'">
                                <div v-if="selectedVideo.status === 'declined'" class="checkmark d-flex flex-column">
                                    <ul class="list-unstyled">
                                        <li
                                                v-for="field in selectedVideo.rejected_fields"
                                                :key="field.id"
                                                class="text-danger"
                                        >
                                            <strong>{{ field.field_name }}:</strong>
                                            {{ getLocalizedField(field, 'error_message') }}
                                        </li>
                                    </ul>
                                </div>

                                <h3 class="course-price">
                                    {{ $t('auth.courses.course_price') }}: {{ priceToShow }}
                                </h3>

                                <div class="course-title">
                                    <h2 class="h2"> {{ $t('auth.courses.course_description') }}:</h2>
                                    <p class="course-title-desc">
                                        {{ getLocalizedField(selectedVideo, 'description') }}
                                    </p>
                                </div>
                                <div class="course-detail" v-if="selectedVideo">
                                    <h2 class="h2">{{ $t('auth.courses.course_highlight') }}:</h2>
                                    <div class="checkmark-section">
                                        <div
                                                v-for="(highlight, index) in selectedVideo.highlights"
                                                :key="index"
                                                class="checkmark d-flex align-items-center"
                                        >
                                            <div class="checkmark-icon">
                                                <svg width="18" height="18" viewBox="0 0 18 18" fill="none"
                                                     xmlns="http://www.w3.org/2000/svg">
                                                    <g clip-path="url(#clip0_141_129)">
                                                        <path d="M16.7392 3.32326L6.37497 13.6868C6.30529 13.7567 6.22248 13.8122 6.13129 13.8501C6.0401 13.888 5.94233 13.9075 5.84359 13.9075C5.74485 13.9075 5.64708 13.888 5.5559 13.8501C5.46471 13.8122 5.3819 13.7567 5.31222 13.6868L1.30422 9.67501C1.23454 9.60505 1.15173 9.54954 1.06054 9.51166C0.969353 9.47379 0.871584 9.45429 0.772844 9.45429C0.674104 9.45429 0.576335 9.47379 0.485148 9.51166C0.393961 9.54954 0.311151 9.60505 0.241469 9.67501C0.171511 9.74469 0.116002 9.8275 0.0781257 9.91869C0.0402494 10.0099 0.020752 10.1076 0.020752 10.2064C0.020752 10.3051 0.0402494 10.4029 0.0781257 10.4941C0.116002 10.5853 0.171511 10.6681 0.241469 10.7378L4.25097 14.7465C4.67393 15.1687 5.24712 15.4058 5.84472 15.4058C6.44232 15.4058 7.01551 15.1687 7.43847 14.7465L17.802 4.38526C17.8718 4.31559 17.9272 4.23282 17.965 4.14171C18.0028 4.05059 18.0223 3.95291 18.0223 3.85426C18.0223 3.75561 18.0028 3.65792 17.965 3.56681C17.9272 3.47569 17.8718 3.39292 17.802 3.32326C17.7323 3.2533 17.6495 3.19779 17.5583 3.15991C17.4671 3.12204 17.3693 3.10254 17.2706 3.10254C17.1719 3.10254 17.0741 3.12204 16.9829 3.15991C16.8917 3.19779 16.8089 3.2533 16.7392 3.32326Z"
                                                              fill="#66707E"/>
                                                    </g>
                                                    <defs>
                                                        <clipPath id="clip0_141_129">
                                                            <rect width="18" height="18" fill="white"/>
                                                        </clipPath>
                                                    </defs>
                                                </svg>
                                            </div>
                                            <span class="ms-4 span"><span>{{
                                                getLocalizedField(highlight, 'name')
                                                }}</span></span>
                                        </div>
                                    </div>
                                </div>

                                <div class="course-questions mt-4">
                                    <h2 class="h2">{{ $t('auth.courses.course_faq') }} :</h2>
                                    <div class="d-flex flex-column gap-3">
                                        <div v-for="(item, index) in selectedVideo?.faqs" :key="index"
                                             class="faq-block">
                                            <div class="question"
                                                 :class="{'question-bg-active': openIndex === index, 'question-active': openIndex === index}"
                                                 @click="toggle(index)">
                                                <div class="question-content d-flex align-items-center">
                                        <span v-if="openIndex === index">
                                            <svg class="close-icon" width="12" height="2" viewBox="0 0 12 2" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11 0H1C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2H11C11.5523 2 12 1.55228 12 1C12 0.447715 11.5523 0 11 0Z"
                                                      fill="#F5F5F5"/>
                                            </svg>
                                         </span>
                                                    <span v-else>
                                            <svg class="open-icon" width="12" height="12" viewBox="0 0 12 12"
                                                 fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path d="M11 5H7V1C7 0.734784 6.89464 0.48043 6.70711 0.292893C6.51957 0.105357 6.26522 0 6 0C5.73478 0 5.48043 0.105357 5.29289 0.292893C5.10536 0.48043 5 0.734784 5 1V5H1C0.734784 5 0.48043 5.10536 0.292893 5.29289C0.105357 5.48043 0 5.73478 0 6C0 6.26522 0.105357 6.51957 0.292893 6.70711C0.48043 6.89464 0.734784 7 1 7H5V11C5 11.2652 5.10536 11.5196 5.29289 11.7071C5.48043 11.8946 5.73478 12 6 12C6.26522 12 6.51957 11.8946 6.70711 11.7071C6.89464 11.5196 7 11.2652 7 11V7H11C11.2652 7 11.5196 6.89464 11.7071 6.70711C11.8946 6.51957 12 6.26522 12 6C12 5.73478 11.8946 5.48043 11.7071 5.29289C11.5196 5.10536 11.2652 5 11 5Z"
                                                      fill="#F5F5F5"/>
                                            </svg>
                                         </span>
                                                    <span class="span">{{ getLocalizedField(item, 'question') }}</span>
                                                </div>
                                            </div>
                                            <div class="answer" v-show="openIndex === index">
                                                <div>
                                                    <p class="answer-p">{{ getLocalizedField(item, 'answer') }}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div class="course-include">
                                    <div class="mt-4">
                                        <p class="course-include-title h2">{{ $t('auth.courses.course_include') }}</p>
                                        <div class="include-items-list">
                                            <div v-for="(item, index) in selectedVideo?.details_by_instructor"
                                                 :key="index" class="d-flex flex-column">
                                                <div class="d-flex align-items-center include-item">
                                                    <img :src="`${baseUrl}/storage/${item.detail.icon}`" alt=""/>
                                                    <span class="span">{{ item.time }} {{
                                                        getLocalizedField(item.detail, 'text')
                                                        }}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="selectedVideo?.statusKey === 'approved'" class="course-approved-section">
                                <div class="views">
                                    <h2 class="h2"> {{ $t('auth.courses.course_views') }}</h2>
                                    <p class="views-number">
                                        {{ selectedVideo?.views ?? 0 }}
                                        <span class="views-text">{{ $t('auth.courses.course_views_text') }}</span></p>
                                </div>
                                <div v-if="selectedVideo?.comments?.some(c => c.comment_text && c.comment_text.trim() !== '')"
                                     class="course-comments-main d-flex flex-column">
                                    <h2 class="comment-block-title h2">{{ $t('auth.courses.course_comments') }}</h2>
                                    <div class="comments d-flex flex-column gap-4">
                                        <div v-for="(item, index) in selectedVideo?.comments
                                            .filter(c => c.comment_text)
                                            .slice(0, 3)" class="single-comment d-flex flex-column gap-3">
                                            <div class="comment-info d-flex gap-3 align-items-center">
                                                <div class="student-img">
                                                    <img :src="`${baseUrl}/storage/auth/${item.user.image}`"
                                                         alt="userImage"/>
                                                </div>
                                                <div class="student-name">
                                                    <p class="m-0">{{ item.user.first_name }}</p>
                                                    <span class="text-capitalize">{{
                                                        $t(`auth.roles.${item.user.roles[0]?.name}`)
                                                        }} </span>
                                                </div>
                                            </div>
                                            <div class="comment-text">
                                                <p>{{ item.comment_text }}</p>
                                            </div>
                                        </div>
                                        <div class="view-more-btn-div d-flex justify-content-center align-items-center">
                                            <router-link :to="`/course-comments/${selectedVideo.id}`">
                                                <button class="view-more-btn">
                                                    {{ $t('auth.courses.course_comments_view_more') }}
                                                </button>
                                            </router-link>
                                        </div>
                                    </div>
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

.add-course-btn,
.change-course-btn,
.view-more-btn {
    gap: 10px;
    border-radius: 70px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 1px;
    color: var(--white-229);
    cursor: pointer;
    width: 176px;
    height: 53px;
    background: var(--general-btn);
    outline: none;
    border: none;
    text-transform: capitalize;
}


.add-course-btn:hover,
.change-course-btn:hover,
.view-more-btn:hover {
    height: 56px;
    width: 186px;
    font-size: 18px;
}

.add-course-btn-div,
.change-course-btn-div,
.view-more-btn-div {
    height: 56px;
    width: 186px;
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

.course-list {
    gap: 5%;
}

.locked-div {
    padding: 25px;
    z-index: 3;
    cursor: pointer;
}

.locked-text {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
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
    padding-bottom: 5%;
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

.modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--modal-overlay);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.modal-content {
    background: var(--white-255);
    border-radius: 16px;
    width: 85%;
    overflow-y: scroll;
}

.modal-video {
    width: 100%;
    height: 458px;
}

.modal-video video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.modal-video:before {
    content: "";
    background: var(--single-course-item);
    width: 100%;
    height: 100%;
    position: absolute;
}

.modal-status-block {
    position: absolute;
    padding: 14px;
    display: flex;
    align-items: center;
    gap: 10px;
}

.modal-close-btn {
    width: 85%;
    display: flex;
    justify-content: flex-end;
    padding: 10px 0;
    cursor: pointer;
}

.modal-details {
    padding: 30px;
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.modal-course-title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 30px;
    line-height: 100%;
    letter-spacing: 0%;
    color: var(--primary-100)
}

.details-content {
    border-radius: 18px;
    background: var(--primary-10);
    width: 100%;
    min-height: 100px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.course-price {
    font-family: var(--font-montserrat);
    line-height: normal;
    letter-spacing: 2%;
    font-size: 22px;
    color: var(--secondary-1-100);
    font-weight: 600;
}

.h2 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 22px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-100);
    margin-bottom: 15px;
}

.course-title-desc,
.span {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-60);
}

.checkmark-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.checkmark-icon svg path {
    fill: var(--secondary-1-100);
}

.checkmark-error-icon svg path {
    fill: var(--required);
}

.include-items-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.include-item {
    gap: 10px;
}

.question,
.question-bg-active {
    width: 100%;
    padding: 18px;
    border-radius: 16px;
    border-width: 0.5px;
    border-style: solid;
    border-color: var(--primary-50);
    -webkit-appearance: none !important;
    box-sizing: border-box !important;
    outline: none !important;
    transform: scale(1) !important;
    cursor: pointer;
}

.question-bg-active {
    background-image: url("/assets/images/repeting-image.jpg");
    outline: none !important;
    border: none;
    background-position: center;
    background-size: cover;
    position: relative;
    overflow: hidden;
}

.question-bg-active:before {
    content: "";
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    background: var(--single-course-question);
}

.question-bg-active .span {
    color: var(--white-245);
}

.question-bg-active svg path {
    fill: var(--white-245);
}

.question .span {
    color: var(--primary-100);
    font-weight: 300;
}

.question svg path {
    fill: var(--primary-100);
}

.question-active .span {
    color: var(--white-245);
}

.question-active svg path {
    fill: var(--white-245);
}

.question-content {
    position: relative;
    gap: 10px;
}

.answer {
    width: 95%;
    padding: 32px;
}

.answer .answer-p {
    color: var(--primary-60);
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    margin: 0;
}

.faq-block {
    width: 80%;
}

.views-number,
.views-text,
.purchase-number,
.purchase-text,
.required-field-modal {
    font-family: var(--font-inter);
    line-height: normal;
    letter-spacing: 0%;
    font-size: 18px;
}

.required-field-modal {
    font-weight: 300;
    color: var(--required);
}

.views-number,
.purchase-number {
    font-weight: 600;
    color: var(--secondary-1-100);
}

.views-text,
.purchase-text {
    font-weight: 300;
    color: var(--primary-60);
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

.course-approved-section {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

.course-review-declined-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
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

    .add-course-btn-div,
    .change-course-btn-div,
    .view-more-btn-div {
        width: 190px;
        height: 50px;
    }

    .add-course-btn:hover,
    .change-course-btn:hover,
    .view-more-btn:hover {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .add-course-btn,
    .view-more-btn,
    .change-course-btn {
        width: 179px;
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


    .play-icon-div svg {
        width: 60px;
        height: 60px;
    }

    .modal-details {
        padding: 25px 17px;
    }

    .modal-course-title {
        font-size: 22px;
    }

    .course-price {
        font-size: 20px;
    }

    .details-title {
        flex-direction: column;
        gap: 22px;
    }

    .h2 {
        font-size: 18px;
    }

    .course-title-desc,
    .span,
    .required-field-modal {
        font-size: 16px;
    }

    .details-content {
        padding: 9px;
    }

    .faq-block {
        width: 100%;
    }

    .answer {
        width: 100%;
        padding: 16px 5px;
    }

    .course-review-declined-section {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .comment-text p {
        font-size: 14px;
    }

    .views-number, .views-text, .purchase-number, .purchase-text, .required-field-modal {
        font-size: 16px;
    }

    .view-more-btn-div {
        width: 100%;
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

    .add-course-btn-div,
    .change-course-btn-div,
    .view-more-btn-div {
        width: 190px;
        height: 50px;
    }

    .add-course-btn:hover,
    .change-course-btn:hover,
    .view-more-btn:hover {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .add-course-btn,
    .change-course-btn,
    .view-more-btn {
        width: 179px;
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

    .play-icon-div svg {
        width: 60px;
        height: 60px;
    }

    .modal-details {
        padding: 35px 17px;
    }

    .modal-course-title {
        font-size: 22px;
    }

    .course-price {
        font-size: 20px;
    }

    .details-title {
        flex-direction: column;
        gap: 22px;
    }

    .h2 {
        font-size: 18px;
    }

    .course-title-desc,
    .span,
    .required-field-modal {
        font-size: 16px;
    }

    .details-content {
        padding: 9px;
    }

    .faq-block {
        width: 100%;
    }

    .answer {
        width: 100%;
        padding: 16px 5px;
    }

    .course-review-declined-section {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .comment-text p {
        font-size: 14px;
    }

    .views-number, .views-text, .purchase-number, .purchase-text, .required-field-modal {
        font-size: 16px;
    }

    .view-more-btn-div {
        width: 100%;
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

    .add-course-btn-div,
    .change-course-btn-div,
    .view-more-btn-div {
        width: 190px;
        height: 50px;
    }

    .add-course-btn:hover,
    .change-course-btn:hover,
    .view-more-btn:hover {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .add-course-btn,
    .change-course-btn,
    .view-more-btn {
        width: 179px;
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


    .modal-details {
        padding: 40px 17px;
    }

    .modal-course-title {
        font-size: 22px;
    }

    .course-price {
        font-size: 20px;
    }

    .h2 {
        font-size: 18px;
    }

    .course-title-desc,
    .span,
    .required-field-modal {
        font-size: 16px;
    }

    .details-content {
        padding: 9px;
    }

    .faq-block {
        width: 100%;
    }

    .answer {
        width: 100%;
        padding: 16px 5px;
    }

    .course-review-declined-section {
        display: flex;
        flex-direction: column;
        gap: 15px;
    }

    .comment-text p {
        font-size: 14px;
    }

    .views-number, .views-text, .purchase-number, .purchase-text, .required-field-modal {
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
        gap: 9%;
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