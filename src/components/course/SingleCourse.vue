<script setup>
import {ref, onMounted, computed, watch} from 'vue'
import api from "../../services/api.js";
import {useRoute, useRouter} from "vue-router";
import {useI18n} from 'vue-i18n';
import {useAuthStore} from '/src/stores/auth.js';
import {useCartCount} from "../../composables/useCartCount.js";
import {usePurchasedCourses} from '../../composables/usePurchasedCourses.js';
import {echo} from '../../services/echo.js';
import { mandatoryDetails } from "../../constants/courseDetails.js";

const auth = useAuthStore()
auth.checkAuth()
const { isPurchased } = usePurchasedCourses();

const isLoading = ref(true);

const {t, locale} = useI18n();
const router = useRouter();
const route = useRoute();
const successMessage = ref('');

const openIndex = ref(0)

const toggle = (index) => {
    openIndex.value = openIndex.value === index ? null : index
}

const showPlayIcon = ref(true);
const courseVideo = ref(null);

const playVideo = () => {
    if (courseVideo.value) {
        courseVideo.value.play();
    }
};

const onPause = () => {
    showPlayIcon.value = true;
};

const onPlay = () => {
    showPlayIcon.value = false;
};

onMounted(() => {
    if (courseVideo.value) {
        courseVideo.value.addEventListener('pause', onPause);
        courseVideo.value.addEventListener('play', onPlay);
    }
});


const rating = ref(0);
const errors = ref({});

const setRating = async (star) => {
    rating.value = star;
    if (!auth.isAuthenticated) return;

    try {
        const res = await api.post('/api/course-reviews', {
            course_id: course.value.id,
            rating: rating.value,
        });

        errors.value = {};
        successMessage.value = t('rating_success');

        course.value.user_rating = res.data;

        setTimeout(() => {
            successMessage.value = '';
        }, 3000);

    } catch (err) {
        if (err.response?.data?.errors) {
            errors.value = err.response.data.errors;
        } else {
            console.error("Failed to update rating", err);
        }
    }
};

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

const incrementCourseView = async (id) => {
    try {
        await api.post(`/api/courses/${id}/view`);
    } catch (error) {
        console.error("Failed to increment view:", error);
    }
};

const course = ref(null);

const fetchCourseName = async (id) => {
    try {
        isLoading.value = true;
        const response = await api.get(`/api/single-course/${id}`);
        course.value = response.data;
        if (auth.isAuthenticated && course.value.user_rating) {
            rating.value = course.value.user_rating.rating ?? 0;
        } else {
            rating.value = 0;
        }
    } catch (error) {
        console.error('Error fetching course:', error);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    const courseId = route.params.id;
    incrementCourseView(courseId);
    fetchCourseName(courseId);
});

watch(
    () => route.params.id,
    (newId, oldId) => {
        if (newId !== oldId) {
            incrementCourseView(newId);
            fetchCourseName(newId);
        }
    }
);

const userRole = computed(() => {
    return auth.user?.role || auth.role || null;
});

const isInstructor = computed(() => userRole.value === 'instructor');
const isLearner = computed(() => userRole.value === 'learner');
const baseUrl = import.meta.env.VITE_API_BASE_URL;

const formatRelativeTime = (dateStr) => {
    const now = new Date();
    const date = new Date(dateStr);
    const diffInSeconds = Math.floor((date - now) / 1000);

    const rtf = new Intl.RelativeTimeFormat(undefined, {numeric: 'auto'});

    const divisions = [
        {amount: 60, name: 'second'},
        {amount: 60, name: 'minute'},
        {amount: 24, name: 'hour'},
        {amount: 7, name: 'day'},
        {amount: 4.34524, name: 'week'},
        {amount: 12, name: 'month'},
        {amount: Number.POSITIVE_INFINITY, name: 'year'},
    ];

    let duration = diffInSeconds;
    for (let i = 0; i < divisions.length; i++) {
        if (Math.abs(duration) < divisions[i].amount) {
            return rtf.format(Math.round(duration), divisions[i].name);
        }
        duration /= divisions[i].amount;
    }
};


const currencySymbols = {
    AMD: "֏",
    EUR: "€",
    USD: "$",
};

function getCoursePrice(course) {
    const loc = locale.value;

    let price = course[`price_${loc}`];
    let currency = course[`currency_${loc}`];

    if (!price || price === "0" || price === "") {
        const fallbackLocales = ['en', 'ru', 'arm'];

        for (const fallback of fallbackLocales) {
            price = course[`price_${fallback}`];
            currency = course[`currency_${fallback}`];

            if (price && price !== "0" && price !== "") break;
        }
    }

    const symbol = currencySymbols[currency] || currency;

    return price ? `${price} ${symbol}` : "";
}


const priceToShow = computed(() => {
    if (!course.value) return "";
    return getCoursePrice(course.value);
});


const {cartCount, loadCartCount} = useCartCount();

const addToCart = async (courseId) => {
    try {
        const res = await api.post(`/api/cart/add/${courseId}`);
        if (res.data.cart_count !== undefined) {
            cartCount.value = res.data.cart_count;
        } else {
            await loadCartCount();
        }
    } catch (err) {
        console.error("Error adding to cart", err);
    }
};

const newCommentText = ref('');
const comments = ref(course.value?.comments || []);

const fetchAllComments = async () => {
    if (!course.value) return;

    try {
        const res = await api.get(`/api/single-course-all-comments/${course.value.id}`);
        if (res.data && Array.isArray(res.data.comments)) {
            course.value.comments = res.data.comments;
        } else {
            console.warn('No comments found in response');
            course.value.comments = [];
        }
        showAllComments.value = true;
    } catch (err) {
        console.error("Failed to fetch all comments", err);
    }
};

const showAllComments = ref(false);

const visibleComments = computed(() => {
    const comments = course.value?.comments;
    if (!Array.isArray(comments)) return [];
    return showAllComments.value ? comments : comments.slice(0, 1);
});

const submitComment = async () => {
    const commentTextToSend = newCommentText.value.trim();

    try {
        const res = await api.post('/api/course-reviews', {
            course_id: course.value.id,
            comment_text: commentTextToSend || null,
            rating: rating.value || null,
        });

        errors.value = {};

        const serverComment = {
            id: res.data.id,
            comment_text: commentTextToSend,
            user: {
                first_name: res.data.user?.first_name || auth.user.first_name,
                last_name: res.data.user?.last_name || auth.user.last_name,
                image: res.data.user?.image || auth.user.image || 'default.png',
            },
            created_at: res.data.created_at || new Date().toISOString(),
        };

        if (!course.value.comments) course.value.comments = [];
        course.value.comments.unshift(serverComment);

        newCommentText.value = '';


    } catch (err) {
        if (err.response?.data?.errors) {
            const serverErrors = err.response.data.errors;
            errors.value = {};

            for (const key in serverErrors) {
                if (serverErrors.hasOwnProperty(key)) {
                    errors.value[key] = serverErrors[key];
                }
            }
        } else {
            console.error("Failed to submit comment", err);
        }
    }
};

let courseChannel = null;

watch(() => course.value?.id, (newId, oldId) => {
    if (!echo) return;

    if (courseChannel && oldId) {
        echo.leaveChannel(`course.${oldId}`);
    }

    if (newId) {
        courseChannel = echo.channel(`course.${newId}`);
        courseChannel.listen('CourseReviewCreated', (e) => {
            if (!course.value.comments) course.value.comments = [];

            if (e.comment_text && e.comment_text.trim() !== '') {
                const exists = course.value.comments.find(c => c.id === e.id);
                if (!exists) {
                    const userImage = e.user.image || auth.user.image || 'default.png';

                    course.value.comments.unshift({
                        id: e.id,
                        user: {
                            first_name: e.user.first_name,
                            last_name: e.user.last_name,
                            image: userImage,
                        },
                        comment_text: e.comment_text,
                        created_at: e.created_at,
                    });
                }
            }
        });
    }
}, {immediate: true});
</script>

<template>
    <div class="section-single-course">
        <div class="container">
            <div v-if="isLoading" class="d-flex justify-content-center align-items-center" style="min-height: 300px">
                <div class="spinner-border text-secondary" role="status">
                    <span class="visually-hidden">{{ $t('loading') }}...</span>
                </div>
            </div>
            <div v-else class="single-course-block flex-wrap d-flex justify-content-between">
                <div class="course-content">
                    <div class="course-title">
                        <p class="category-badge">{{ getLocalizedField(course.category, 'name') }}</p>
                        <h2 class="text-capitalize">{{ $t('single_course.description') }}</h2>
                        <div v-html="getLocalizedField(course, 'description')"></div>
                    </div>
                    <div class="course-video-div position-relative">
                        <div v-if="!isPurchased(course?.id) && !isInstructor"
                             class="locked-div position-absolute d-flex align-items-center gap-3">
                            <svg width="23" height="28" viewBox="0 0 23 28" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M19.55 9.828V8.16665C19.55 3.65635 15.9459 0 11.5 0C7.05408 0 3.45001 3.65635 3.45001 8.16665V9.828C1.35704 10.7547 0.00301875 12.85 0 15.1666V22.1666C0.00377344 25.3867 2.57591 27.9962 5.74997 28H17.25C20.424 27.9962 22.9962 25.3867 23 22.1666V15.1666C22.997 12.85 21.643 10.7547 19.55 9.828ZM12.65 19.8334C12.65 20.4777 12.1351 21 11.5 21C10.8649 21 10.35 20.4777 10.35 19.8334V17.5C10.35 16.8557 10.8649 16.3334 11.5 16.3334C12.1351 16.3334 12.65 16.8557 12.65 17.5V19.8334ZM17.25 9.33335H5.74997V8.1667C5.74997 4.94506 8.32432 2.33335 11.5 2.33335C14.6757 2.33335 17.25 4.94501 17.25 8.1667V9.33335Z"
                                      fill="#4BBBE4"/>
                            </svg>
                        </div>
                        <div v-if="(isPurchased(course?.id) || isInstructor) && showPlayIcon"
                             class="play-icon-div position-absolute" @click="playVideo">
                            <svg class="play-icon" width="80" height="80" viewBox="0 0 80 80" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M55.1667 34.7833L35.6733 24.1067C33.8 23.0533 31.58 23.0767 29.73 24.1533C27.8767 25.2367 26.77 27.1667 26.77 29.3133V50.6833C26.77 52.83 27.8767 54.76 29.73 55.8433C30.6733 56.3933 31.7133 56.67 32.7467 56.67C33.75 56.67 34.7467 56.4133 35.6567 55.9033L55.18 45.21C57.0867 44.1367 58.2267 42.19 58.2267 40.0033C58.2267 37.8167 57.0867 35.8667 55.1633 34.7867L55.1667 34.7833ZM53.5667 42.2933L34.0433 52.9867C33.2133 53.45 32.2333 53.4433 31.4167 52.9667C30.5967 52.4867 30.1067 51.6333 30.1067 50.6833V29.3133C30.1067 28.3633 30.5933 27.51 31.4167 27.03C31.83 26.79 32.2867 26.6667 32.7433 26.6667C33.19 26.6667 33.6433 26.7833 34.06 27.0167L53.5533 37.6933C54.3967 38.1667 54.9 39.0267 54.9 39.9933C54.9 40.96 54.3967 41.82 53.57 42.2867L53.5667 42.2933ZM40 0C17.9433 0 0 17.9433 0 40C0 62.0567 17.9433 80 40 80C62.0567 80 80 62.0567 80 40C80 17.9433 62.0567 0 40 0ZM40 76.6667C19.7833 76.6667 3.33333 60.2167 3.33333 40C3.33333 19.7833 19.7833 3.33333 40 3.33333C60.2167 3.33333 76.6667 19.7833 76.6667 40C76.6667 60.2167 60.2167 76.6667 40 76.6667Z"
                                      fill="#E5EAED"/>
                            </svg>
                        </div>
                        <video
                                v-if="isPurchased(course?.id) || isInstructor"
                                ref="courseVideo"
                                :src="course ? `${baseUrl}/api/stream-video/${course.id}?token=${auth.token}` : ''"
                                class="course-video w-100 h-100"
                                controls
                                controlsList="nodownload"
                                @pause="onPause"
                                @play="onPlay"
                                @contextmenu.prevent
                        ></video>
                        <img v-if="!isPurchased(course?.id) && !isInstructor || showPlayIcon"
                                :src="course ? `${baseUrl}/storage/${course.thumbnail}` : ''"
                                alt="Course Thumbnail"
                                class="course-thumbnail course-img"
                        />
                    </div>
                    <div class="course-detail">
                        <h2 class="text-capitalize">{{ $t('single_course.course_highlight') }}</h2>
                        <div class="checkmark-section" v-if="course && course.highlights">
                            <div
                                    class="checkmark d-flex align-items-center"
                                    v-for="(highlight, index) in course.highlights"
                                    :key="index"
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
                                <span class="text-capitalize ms-4 span"> {{
                                    getLocalizedField(highlight, 'name')
                                    }} </span>
                            </div>
                        </div>
                    </div>
                    <div class="course-questions">
                        <h2 class="text-capitalize">{{ $t('single_course.course_questions') }}</h2>
                        <div class="d-flex flex-column gap-4" v-if="course && course.faqs">
                            <div v-for="(faq, index) in course.faqs" :key="index">
                                <div
                                        class="question"
                                        :class="{'question-bg-active': openIndex === index, 'question-active': openIndex === index}"
                                        @click="toggle(index)"
                                >
                                    <div class="question-content d-flex align-items-center">
                                    <span v-if="openIndex === index">
                                      <svg class="close-icon" width="12" height="2" viewBox="0 0 12 2" fill="none"
                                           xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 0H1C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2H11C11.5523 2 12 1.55228 12 1C12 0.447715 11.5523 0 11 0Z"
                                              fill="#F5F5F5"/>
                                      </svg>
                                    </span>
                                        <span v-else>
                                      <svg class="open-icon" width="12" height="12" viewBox="0 0 12 12" fill="none"
                                           xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 5H7V1C7 0.734784 6.89464 0.48043 6.70711 0.292893C6.51957 0.105357 6.26522 0 6 0C5.73478 0 5.48043 0.105357 5.29289 0.292893C5.10536 0.48043 5 0.734784 5 1V5H1C0.734784 5 0.48043 5.10536 0.292893 5.29289C0.105357 5.48043 0 5.73478 0 6C0 6.26522 0.105357 6.51957 0.292893 6.70711C0.48043 6.89464 0.734784 7 1 7H5V11C5 11.2652 5.10536 11.5196 5.29289 11.7071C5.48043 11.8946 5.73478 12 6 12C6.26522 12 6.51957 11.8946 6.70711 11.7071C6.89464 11.5196 7 11.2652 7 11V7H11C11.2652 7 11.5196 6.89464 11.7071 6.70711C11.8946 6.51957 12 6.26522 12 6C12 5.73478 11.8946 5.48043 11.7071 5.29289C11.5196 5.10536 11.2652 5 11 5Z"
                                              fill="#F5F5F5"/>
                                      </svg>
                                    </span>
                                        <span class="span">{{ getLocalizedField(faq, 'question') }}</span>
                                    </div>
                                </div>
                                <div class="answer" v-show="openIndex === index">
                                    <div class="answer">
                                        <p class="answer-p">{{ getLocalizedField(faq, 'answer') }}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="course-comments">
                        <h2 v-if="course && Array.isArray(course.comments) && course.comments.length > 0 || (isLearner && isPurchased(course?.id))" class="mb-0">{{
                            $t('single_course.comments')
                            }}</h2>
                        <div v-if="!auth.isAuthenticated || isInstructor" class="comments d-flex flex-column gap-3">
                            <div
                                    class="single-comment d-flex flex-column gap-3"
                                    v-for="(comment, index) in course.comments"
                                    :key="index"
                            >
                                <div class="comment-info d-flex gap-3 align-items-center">
                                    <div class="student-img">
                                        <img :src="`${baseUrl}${comment.user.image}`"
                                             alt="userImage"/>
                                    </div>
                                    <div class="student-name">
                                        <p class="m-0">{{ comment.user?.first_name }} {{ comment.user?.last_name }}</p>
                                        <span>{{ formatRelativeTime(comment.created_at) }}</span>
                                    </div>
                                </div>
                                <div class="comment-text">
                                    <p>{{ comment.comment_text }}</p>
                                </div>
                            </div>
                        </div>
                        <div v-if="auth.isAuthenticated && isLearner && isPurchased(course?.id)"
                             class="write-comment mt-2 d-flex flex-column gap-3">
                            <div class="rating mb-3">
                                <svg
                                        v-for="starNum in 5"
                                        :key="starNum"
                                        :fill="starNum <= rating ? '#F0AD4E' : '#D3D3D3'"
                                        @click="setRating(starNum)"
                                        width="30"
                                        height="30"
                                        viewBox="0 0 20 21"
                                        xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path
                                            d="M16.2225 19.93L10 15.3567L3.77751 19.93L6.16668 12.5442L-0.0524902 8.00002H7.62584L10 0.601685L12.3742 8.00002H20.0517L13.8333 12.5442L16.2225 19.93Z"
                                    />
                                </svg>
                            </div>
                            <div v-if="errors.rating" class="text-danger small">
                                <div v-for="(msg, i) in errors.rating" :key="i">{{ $t(`validation.${msg}`) }}</div>
                            </div>
                            <div v-if="successMessage" class="text-success small mb-2">
                                {{ successMessage }}
                            </div>
                            <div
                                    class="single-comment d-flex flex-column gap-3"
                                    v-for="(comment, index) in visibleComments"
                                    :key="index"
                            >
                                <div class="comment-info d-flex gap-3 align-items-center">
                                    <div class="student-img">
                                        <img :src="`${baseUrl}${comment.user.image}`" alt="userImage"/>
                                    </div>
                                    <div class="student-name">
                                        <p class="m-0">{{ comment.user?.first_name }} {{ comment.user?.last_name }}</p>
                                        <span>{{ formatRelativeTime(comment.created_at) }}</span>
                                    </div>
                                </div>
                                <div class="comment-text">
                                    <p>{{ comment.comment_text }}</p>
                                </div>
                            </div>
                            <a
                                    v-if="course?.comments?.length > 1"
                                    class="view-more text-decoration-none text-capitalize"
                                    href="#"
                                    @click.prevent="showAllComments ? showAllComments = false : fetchAllComments()"
                            >
                                {{ showAllComments ? $t('single_course.view_less') : $t('single_course.view_more') }}
                            </a>


                            <div class="write-comment-textarea">
                                <textarea v-model="newCommentText" rows="4" class="form-input w-100 mt-2" type="text"
                                          :placeholder="$t('single_course.write_comment_placeholder')"></textarea>
                                <div class="write-comment-btn-div">
                                    <button @click="submitComment" class="write-comment-btn text-capitalize">
                                        {{ $t('single_course.submit') }}
                                    </button>
                                </div>
                            </div>
                            <div v-if="errors.comment_text" class="text-danger small">
                                <div v-for="(msg, i) in errors.comment_text" :key="i">{{
                                    $t(`validation.${msg}`)
                                    }}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="course-card-detail">
                    <div class="card">
                        <div class="card-content position-relative">
                            <h3>{{ $t('single_course.course_price') }} {{ priceToShow }}</h3>
                            <div class="course-include">
                                <p class="course-include-title text-capitalize">
                                    {{ $t('single_course.course_include') }}</p>
                                <div class="include-items-list mt-4">
                                    <template v-for="(detail, index) in mandatoryDetails" :key="detail.id">
                                        <div class="d-flex flex-column include-item" v-if="course">
                                            <div class="d-flex align-items-center">
                                                <div class="detail-icon-wrapper" v-html="detail.icon">
                                                </div>
                                                <span class="span">
                                                    <template v-if="detail.editable === 1">
                                                        {{ course.details_by_instructor?.find(d => String(d.course_details_data_id) === String(detail.id))?.time }}
                                                    </template>
                                                    {{ detail[`text_${locale}`] }}
                                                </span>
                                            </div>
                                            <div class="line"></div>
                                        </div>
                                    </template>
                                </div>
                            </div>
                            <div class="card-footer-custom">
                                <div class="tutor-info d-flex" v-if="course && course.user">
                                    <div class="tutor-img">
                                        <img :src="`${baseUrl}${course.user.image}`"
                                             alt="userImage"/>
                                    </div>
                                    <div class="tutor-name">
                                        <p>{{ course.user.first_name }} {{ course.user.last_name }}</p>
                                        <span class="text-capitalize">{{
                                            $t(`auth.roles.${course.user.roles[0]?.name}`)
                                            }} </span>
                                    </div>
                                </div>

                                <div v-if="!isPurchased(course.id)" class="d-flex justify-content-between card-buttons-block">
                                    <div v-if="!auth.isAuthenticated" class="buy-btn-div d-flex justify-content-center align-items-center">
                                        <router-link to="/sign-in"
                                                     class="buy-btn text-capitalize text-decoration-none text-center d-flex align-items-center justify-content-center">
                                            {{ $t('single_course.buy_now_btn') }}
                                        </router-link>
                                    </div>
                                    <div v-if="isLearner" class="buy-btn-div d-flex justify-content-center align-items-center">
                                        <router-link :to="{ path: '/learner/checkout', query: { courseId: course.id } }"
                                                     class="buy-btn text-capitalize text-decoration-none text-center d-flex align-items-center justify-content-center">
                                            {{ $t('single_course.buy_now_btn') }}
                                        </router-link>
                                    </div>
                                    <div v-if="isLearner" class="add-to-card-btn-div d-flex justify-content-center align-items-center">
                                        <button class="add-to-card-btn text-capitalize" @click="addToCart(course.id)">
                                            {{ $t('single_course.add_to_card_btn') }}
                                        </button>
                                    </div>
                                </div>
                                <div v-if="isPurchased(course.id) && isLearner" class="d-flex justify-content-center mt-3">
                                    <router-link :to="`/learner/quiz/${course.id}`" class="text-decoration-none w-100">
                                        <button class="take-quiz-btn w-100 text-capitalize">
                                            {{ $t('learner_profile.take_quiz') }}
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
</template>

<style scoped>
.section-single-course {
    padding: 8% 0;
}

.single-course-block {
    gap: 60px;
}

.detail-icon-wrapper {
    width: 20px;
    height: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 15px;
}

.detail-icon-wrapper img {
    width: 100%;
    height: 100%;
}

.course-title,
.course-detail,
.course-questions,
.course-comments {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.course-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
    width: 55%;
}

.course-title h2,
.course-detail h2,
.course-questions h2,
.course-comments h2 {
    font-family: var(--font-montserrat);
    font-weight: 300;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-100);
}

.course-title h2 {
    font-size: 42px;
}

.course-detail h2,
.course-questions h2 {
    font-size: 32px;
}

.course-title p,
.course-detail span {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-60);
    width: 100%;
}

.course-detail h2 {
    font-size: 32px;
}

.course-video-div {
    width: 100%;
    height: 423px;
    border-radius: 16px;
    overflow: hidden;
    position: relative;
}

.course-video-div:before {
    content: "";
    background: var(--single-course-item);
    width: 100%;
    height: 100%;
    position: absolute;
}

.course-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.course-detail svg path {
    fill: var(--secondary-1-100);
}

.checkmark-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.course-questions {
    width: 100%;
}

.question-content svg {
    margin-right: 20px;
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
    appearance: none !important;
    box-sizing: border-box !important;
    outline: none !important;
    transform: scale(1) !important;
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
}

.answer .answer-p {
    color: var(--primary-60);
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    padding: 28px 138px 10px 51px;
    margin: 0;
}

.course-card-detail {
    width: 38%;
    height: 806px;
}

.card {
    width: 100%;
    height: auto;
    border-radius: 16px;
    background-image: url("/assets/images/repeting-image.jpg");
    overflow: hidden;
    position: relative;
    background-position: center;
    background-size: cover;
}

.card::before {
    content: "";
    width: 100%;
    height: 100%;
    background: var(--single-course-question);
    position: absolute;
    top: 0;
    left: 0;
}

.card-content {
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 40px;
}

.card-content h3,
.course-include-title {
    font-family: var(--font-montserrat);
    line-height: normal;
    letter-spacing: 2%;
}

.card-content h3 {
    font-size: 28px;
    color: var(--secondary-1-100);
    font-weight: 700;
}

.course-include-title {
    font-size: 22px;
    color: var(--white-255);
    font-weight: 300;
}

.line {
    border-width: 0.5px;
    border-style: solid;
    box-sizing: border-box;
    border-color: var(--secondary-1-100) !important;
    margin: 20px 0;
}

.include-item:last-child .line {
    display: none;
}


.include-item .span {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
    line-height: 150%;
    letter-spacing: 2%;
    color: var(--white-255);
    margin-left: 10px;
}

.include-items-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 70%;
}

.card-footer-custom {
    width: 100%;
    border-top: 1px solid var(--secondary-1-100);
    gap: 10px;
    padding-top: 23px;
    display: flex;
    flex-direction: column;
}

.tutor-info {
    gap: 20px;
    align-items: center;
}

.tutor-img {
    width: 90px;
    height: 90px;
    border-radius: 50%;
    overflow: hidden;
}

.tutor-img img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

.tutor-info p,
.tutor-info span {
    font-family: var(--font-montserrat);
    font-weight: 300;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-255);
}

.tutor-info p {
    font-size: 18px;
    margin-bottom: 5px;
}

.tutor-info span {
    font-size: 16px;
}

.take-quiz-btn {
    padding: 14px 20px;
    border-radius: 70px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
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

.buy-btn-div,
.add-to-card-btn-div {
    min-width: 200px;
    width: 100%;
    height: 56px;
    margin-top: 3%;
}

.write-comment-btn-div {
    min-width: 186px;
    width: 100%;
    height: 56px;
    margin-top: 3%;
}

.buy-btn,
.add-to-card-btn {
    min-width: 190px;
    width: 90%;
    height: 53px;
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
}

.write-comment-btn {
    min-width: 176px;
    width: 10%;
    height: 53px;
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
}

.buy-btn:hover,
.add-to-card-btn:hover {
    min-width: 200px;
    height: 56px;
    font-size: 18px;
    width: 100%;
}

.write-comment-btn:hover {
    min-width: 186px;
    height: 56px;
    font-size: 18px;
    width: 10%;
}

.locked-div {
    padding: 25px;
    z-index: 1;
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

.view-more {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 20px;
    line-height: normal;
    letter-spacing: 0%;
    text-decoration: none;
    color: var(--secondary-1-100);
}

.write-comment-textarea textarea {
    padding: 15px;
    resize: none;
    border-width: 0.5px;
    border-style: solid;
    border-color: var(--primary-50) !important;
    box-sizing: border-box !important;
    transform: scale(1) !important;
    -webkit-appearance: none !important;
    appearance: none !important;
    outline: none !important;
    border-radius: 8px;
    color: var(--primary-30);
}

.write-comment-textarea textarea:focus::placeholder {
    color: var(--primary-30);
}

.write-comment-textarea textarea::placeholder {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-50);
}

.close-icon,
.open-icon {
    cursor: pointer;
}


/* Extra Small Devices */
@media (max-width: 575px) {
    .section-single-course {
        padding: 18% 0;
    }

    .course-title,
    .course-detail,
    .course-questions,
    .course-comments {
        gap: 10px;
    }

    .course-content {
        width: 100%;
        gap: 40px;
    }

    .course-title p {
        font-size: 16px;
        margin: 0;
    }

    .course-title h2,
    .course-detail h2,
    .course-questions h2,
    .course-comments h2 {
        font-size: 22px;
        text-align: center;
    }

    .course-video-div {
        height: 221px;
        border-radius: 8px;
    }

    .course-detail span {
        font-size: 14px;
    }

    .question-active .span,
    .question .span,
    .answer .answer-p {
        font-size: 14px;
    }

    .answer .answer-p,
    .question, .question-bg-active {
        padding: 17px;
        border-radius: 8px;
    }

    .question-content {
        margin-left: 10px;
    }

    .single-course-block {
        gap: 40px
    }

    .course-card-detail {
        width: 100%;
    }

    .card-content h3 {
        font-size: 24px;
        margin: 0;
    }

    .card-content {
        gap: 20px;
        padding: 30px 20px;
    }

    .card {
        border-radius: 8px;
    }

    .course-include-title {
        font-size: 18px;
    }

    .include-item .span {
        font-size: 14px;
    }

    .include-items-list {
        width: 90%;
        gap: unset;
    }

    .card-footer-custom {
        margin-top: 20px;
    }

    .tutor-img {
        width: 70px;
        height: 70px;
    }

    .course-card-detail {
        height: fit-content;
    }

    .locked-div svg {
        width: 19px;
        height: 24px;
    }

    .locked-div {
        padding: 15px;
    }

    .play-icon-div svg {
        width: 61px;
        height: 61px;
    }

    .comment-text p {
        font-size: 14px;
    }

    .buy-btn-div,
    .add-to-card-btn-div {
        min-width: 140px;
        width: 100%;
        height: 50px;
    }

    .buy-btn,
    .add-to-card-btn {
        min-width: 140px;
        width: 90%;
        height: 47px;
    }

    .buy-btn:hover,
    .add-to-card-btn:hover {
        min-width: 140px;
        width: 90%;
        height: 47px;
        font-size: 16px;
    }

    .write-comment-btn-div {
        min-width: 179px;
        width: 100%;
        height: 47px;
    }

    .write-comment-btn {
        min-width: 179px;
        width: 10%;
        height: 47px;
        font-size: 18px;
    }

    .write-comment-btn:hover {
        min-width: 179px;
        width: 10%;
        height: 47px;
        font-size: 18px;
    }

    .rating {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .view-more {
        font-size: 18px;
    }

    .write-comment-textarea textarea::placeholder {
        font-size: 14px;
    }

    .write-comment-textarea textarea {
        height: 5em;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .section-single-course {
        padding: 10% 0 8%;
    }

    .course-title,
    .course-detail,
    .course-questions,
    .course-comments {
        gap: 10px;
    }

    .course-content {
        width: 100%;
        gap: 40px;
    }

    .course-title p {
        font-size: 16px;
        margin: 0;
    }

    .course-title h2,
    .course-detail h2,
    .course-questions h2,
    .course-comments h2 {
        font-size: 22px;
        text-align: center;
    }

    .course-video-div {
        height: 221px;
        border-radius: 8px;
    }

    .course-detail span {
        font-size: 14px;
    }

    .question-active .span,
    .question .span,
    .answer .answer-p {
        font-size: 14px;
    }

    .answer .answer-p,
    .question, .question-bg-active {
        padding: 17px;
        border-radius: 8px;
    }

    .question-content {
        margin-left: 10px;
    }

    .single-course-block {
        gap: 40px
    }

    .course-card-detail {
        width: 100%;
    }

    .card-content h3 {
        font-size: 24px;
        margin: 0;
    }

    .card-content {
        gap: 20px;
        padding: 30px 20px;
    }

    .card {
        border-radius: 8px;
    }

    .course-include-title {
        font-size: 18px;
    }

    .include-item .span {
        font-size: 14px;
    }

    .include-items-list {
        width: 90%;
        gap: unset;
    }

    .card-footer-custom {
        margin-top: 20px;
    }

    .tutor-img {
        width: 70px;
        height: 70px;
    }

    .locked-div svg {
        width: 19px;
        height: 24px;
    }

    .locked-div {
        padding: 15px;
    }

    .play-icon-div svg {
        width: 61px;
        height: 61px;
    }

    .comment-text p {
        font-size: 14px;
    }

    .buy-btn-div,
    .add-to-card-btn-div {
        min-width: 140px;
        width: 100%;
        height: 50px;
    }

    .buy-btn,
    .add-to-card-btn {
        min-width: 140px;
        width: 90%;
        height: 47px;
    }

    .buy-btn:hover,
    .add-to-card-btn:hover {
        min-width: 140px;
        width: 90%;
        height: 47px;
        font-size: 16px;
    }

    .course-card-detail {
        height: fit-content;
    }

    .write-comment-btn-div {
        min-width: 179px;
        width: 100%;
        height: 47px;
    }

    .write-comment-btn {
        min-width: 179px;
        width: 10%;
        height: 47px;
        font-size: 18px;
    }

    .write-comment-btn:hover {
        min-width: 179px;
        width: 10%;
        height: 47px;
        font-size: 18px;
    }

    .rating {
        display: flex;
        justify-content: center;
        align-items: center;
    }

    .view-more {
        font-size: 18px;
    }

    .write-comment-textarea textarea::placeholder {
        font-size: 14px;
    }

    .write-comment-textarea textarea {
        height: 5em;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .single-course-block {
        gap: unset;
    }

    .course-title h2 {
        font-size: 38px;
    }

    .course-title p {
        font-size: 16px;
    }

    .card-content h3 {
        font-size: 22px;
    }

    .course-include-title {
        font-size: 20px;
    }

    .card-content {
        gap: 20px;
        padding: 20px;
    }

    .include-items-list {
        width: 90%;
    }

    .include-item svg {
        width: 18px;
        height: 18px;
    }

    .include-item .span {
        font-size: 12px;
    }

    .course-video-div {
        height: 221px;
    }

    .tutor-img {
        width: 60px;
        height: 60px;
    }

    .tutor-info p,
    .buy-btn,
    .add-to-card-btn {
        font-size: 14px;
    }

    .locked-div svg {
        width: 19px;
        height: 24px;
    }

    .locked-div {
        padding: 15px;
    }

    .play-icon-div svg {
        width: 61px;
        height: 61px;
    }

    .comment-text p {
        font-size: 14px;
    }

    .tutor-info span {
        font-size: 12px;
    }

    .course-detail span {
        font-size: 16px;
    }

    .answer .answer-p {
        padding: 18px 30px 10px 51px;
    }

    .card-buttons-block {
        flex-direction: column;
    }

    .locked-div svg {
        width: 19px;
        height: 24px;
    }

    .locked-div {
        padding: 15px;
    }

    .play-icon-div svg {
        width: 61px;
        height: 61px;
    }

    .comment-text p {
        font-size: 14px;
    }

    .buy-btn-div,
    .add-to-card-btn-div {
        min-width: 140px;
        width: 100%;
        height: 40px;
    }

    .buy-btn,
    .add-to-card-btn {
        min-width: 140px;
        width: 90%;
        height: 40px;
        font-size: 16px;
    }

    .buy-btn:hover,
    .add-to-card-btn:hover {
        min-width: 140px;
        width: 90%;
        height: 40px;
        font-size: 16px;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .buy-btn-div,
    .add-to-card-btn-div {
        min-width: 140px;
        width: 100%;
        height: 45px;
    }

    .buy-btn,
    .add-to-card-btn {
        min-width: 140px;
        width: 90%;
        height: 40px;
    }

    .buy-btn:hover,
    .add-to-card-btn:hover {
        min-width: 140px;
        width: 100%;
        height: 45px;
        font-size: 18px;
    }
}


</style>