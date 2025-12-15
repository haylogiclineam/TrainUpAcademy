<script setup>
import {ref, watch, onMounted, onUnmounted, computed} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import SignIn from "../components/auth/SignIn.vue";
import SignUp from "../components/auth/SignUp.vue";
import VerificationCode from "../components/auth/VerificationCode.vue";
import {useI18n} from 'vue-i18n';
import ForgotPassword from "./auth/ForgotPassword.vue";
import ChangePassword from "./auth/ChangePassword.vue";
import api from '/src/services/api.js';
import {useAuthStore} from '/src/stores/auth.js';
import {createEcho} from '../resources/js/echo.js';
import {useNotificationsStore} from '../composables/useNotifications.js';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import {useWishlistCount} from '../composables/useWishlistCount.js';
import {useCartCount} from '../composables/useCartCount';

const router = useRouter();
const route = useRoute();

const auth = useAuthStore()
auth.checkAuth()

const logout = () => {
    auth.logout()
    router.push('/sign-in')
}

const {locale} = useI18n();
const blog = ref(null);
const isLoading = ref(true);

watch(
    () => route.params.id,
    async (newBlogId) => {
        if (!newBlogId) return;

        isLoading.value = true;
        try {
            const response = await api.get(`/api/blogs/${newBlogId}`);
            blog.value = response.data;
        } catch (error) {
            console.error('Failed to fetch blog:', error.response?.data || error.message);
        } finally {
            isLoading.value = false;
        }
    },
    {immediate: true}
);


const currentLanguage = ref(locale.value);

function changeLocale(lang) {
    locale.value = lang;
    localStorage.setItem('lang', lang);

    currentLanguage.value =
        lang === 'en' ? 'EN' :
            lang === 'ru' ? 'RU' : 'ARM';

    document.documentElement.setAttribute('lang', lang);
}

const dropdowns = ref({
    about: false,
    courses: false
});

const toggleDropdown = (key) => {
    for (let item in dropdowns.value) {
        dropdowns.value[item] = item === key ? !dropdowns.value[item] : false;
    }
};

const isNavbarOpen = ref(false);

const openNavbar = () => {
    isNavbarOpen.value = true;
};

const closeNavbar = () => {
    isNavbarOpen.value = false;
};

watch(isNavbarOpen, (newVal) => {
    document.body.classList.toggle('no-scroll', newVal);
});

const handleResize = () => {
    if (window.innerWidth >= 768) {
        isNavbarOpen.value = false;
    }
};

onMounted(() => {
    window.addEventListener('resize', handleResize);
    handleResize();
});

onUnmounted(() => {
    window.removeEventListener('resize', handleResize);
    document.body.classList.remove('no-scroll');
});


const isHomePage = computed(() => route.path === '/');
const isAboutPage = computed(() => route.path === '/about');
const isContactPage = computed(() => route.path === '/contact');
const isCoursesPage = computed(() => route.path === '/courses');
const isSingleCoursePage = computed(() => route.name === 'single-course');
const isBlogPage = computed(() => route.path === '/blog');
const isSingleBlogPage = computed(() => route.name === 'SingleBlog');
const isWhyChooseUsPage = computed(() => route.path === '/why-choose-us');
const isSignInPage = computed(() => route.path === '/sign-in');
const isSignUpPage = computed(() => route.path === '/sign-up');
const isVerifyPage = computed(() => route.path === '/verify');
const isForgotPasswordPage = computed(() => route.path === '/forgot-password');
const isChangePasswordPage = computed(() => route.path === '/change-password');
const isTeachOnTrainUpPage = computed(() => route.path === '/teach-on-trainUp');
const isPrivacyPolicyPage = computed(() => route.path === '/privacy-policy');
const isTermsConditionsPage = computed(() => route.path === '/terms-conditions');

const isInstructorMyCoursesPage = computed(() => route.path === '/instructor/my-courses');
const isInstructorAddCoursesPage = computed(() => route.path === '/instructor/add-courses');
const isInstructorChangeCoursesPage = computed(() => route.name === 'instructor-change-courses');
const isInstructorSettingsPage = computed(() => route.path === '/instructor/settings');
const isInstructorHowWeCanHelpPage = computed(() => route.path === '/instructor/how-we-can-help');
const isInstructorHowWeCanHelpDetailsPage = computed(() => route.name === 'instructor-help-details');
const isInstructorPurchaseHistoryPage = computed(() => route.path === '/instructor/purchase-history');
const isInstructorWalletPage = computed(() => route.path === '/instructor/wallet');

const isLearnerMyLearningPage = computed(() => route.path === '/learner/my-learning');
const isLearnerHowWeCanHelpPage = computed(() => route.path === '/learner/how-we-can-help');
const isLearnerHowWeCanHelpDetailsPage = computed(() => route.name === 'learner-help-details');
const isLearnerWishListPage = computed(() => route.path === '/learner/wishlist');
const isLearnerShoppingCartPage = computed(() => route.path === '/learner/shopping-cart');
const isLearnerProfilePage = computed(() => route.path === '/learner/shopping-cart');
const isLearnerPurchaseHistoryPage = computed(() => route.path === '/learner/purchase-history');
const isLearnerCheckoutPage = computed(() => route.path === '/learner/checkout');
const isLearnerWalletPage = computed(() => route.path === '/learner/wallet');

const headerClass = computed(() => {
    if (route.name === 'SingleBlog') {
        return 'single-blog-header';
    }
    if (route.name === 'single-course') {
        return 'single-course-header';
    }
    if (route.name === 'instructor-help-details') {
        return 'how-we-can-help-header'
    }
    if (route.name === 'learner-help-details') {
        return 'how-we-can-help-header'
    }
    if (route.name === 'instructor-change-courses') {
        return 'navbar-primary'
    }

    if (route.name === 'course-comments') {
        return 'navbar-primary'
    }

    if (route.name === 'instructor-wallet') {
        return 'navbar-primary'
    }

    if (route.name === 'learner-wallet') {
        return 'navbar-primary'
    }

    if (route.name === 'instructor-withdraw-funds') {
        return 'navbar-primary'
    }

    if (route.name === 'learner-add-funds') {
        return 'navbar-primary'
    }

    const classes = {
        '/': 'header',
        '/about': 'about-header',
        '/contact': 'contact-header',
        '/courses': 'courses-header',
        '/teach-on-trainUp': 'train-up-header',
        '/terms-conditions': 'header',
        '/privacy-policy': 'header',

        '/blog': 'blog-header',
        '/why-choose-us': 'why-choose-us-header',
        '/sign-in': 'auth-header',
        '/sign-up': 'auth-header',
        '/verify': 'auth-header',
        '/forgot-password': 'auth-header',
        '/change-password': 'auth-header',
        '/instructor/my-courses': 'navbar-primary',
        '/instructor/add-courses': 'navbar-primary',
        '/instructor/wallet': 'navbar-primary',

        '/instructor/settings': 'navbar-primary',
        '/instructor/how-we-can-help': 'how-we-can-help-header',
        '/instructor/purchase-history': 'navbar-primary',
        '/learner/my-learning': 'navbar-primary',
        '/learner/settings': 'navbar-primary',
        '/learner/how-we-can-help': 'how-we-can-help-header',
        '/learner/wishlist': 'navbar-primary',
        '/learner/shopping-cart': 'navbar-primary',
        '/learner/profile-page': 'navbar-primary',
        '/learner/purchase-history': 'navbar-primary',
        '/learner/checkout': 'navbar-primary',
        '/learner/wallet': 'navbar-primary',

    };

    return classes[route.path] || 'header';
});

const truncateDescription = (description) => {
    const maxLength = 130;
    return description.length > maxLength ? description.slice(0, maxLength) + '...' : description;
};

const fullTitle = computed(() => blog.value?.[`title_${locale.value}`] || '')
const firstWord = computed(() => fullTitle.value.split(' ')[0] || '')
const rest = computed(() => fullTitle.value.split(' ').slice(1).join(' ') || '')

const userImage = computed(() => {
    if (auth.user?.image) {
        return `${import.meta.env.VITE_API_BASE_URL}/storage/auth/${auth.user.image}`;
    }
    return '/assets/images/auth/default-avatar.png';
});

const handleImageError = (event) => {
    event.target.src = '/assets/images/auth/default-avatar.png';
};

const userName = computed(() => {
    return auth.user ? `${auth.user.first_name} ${auth.user.last_name}` : '';
});

const userEmail = computed(() => {
    return auth.user?.email || '';
});

const userRole = computed(() => {
    return auth.user?.role || auth.role || null;
});

const isInstructor = computed(() => userRole.value === 'instructor');
const isLearner = computed(() => userRole.value === 'learner');

const topViewedCourses = ref([]);

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

const fetchTopViewedCourses = async () => {
    try {
        const response = await api.get('/api/top-viewed-courses');
        topViewedCourses.value = response.data;
    } catch (error) {
        console.error("Failed to fetch top viewed courses:", error);
    }
};

onMounted(() => {
    fetchTopViewedCourses();
});

const course = ref(null);

const fetchCourseName = async (id) => {
    if (!id) {
        console.warn('No course ID provided, skipping fetch');
        return;
    }

    try {
        isLoading.value = true;
        const response = await api.get(`/api/single-course/${id}`);
        course.value = response.data;
    } catch (error) {
        console.error('Error fetching course:', error.response?.data || error.message);
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    if (isSingleCoursePage.value) {
        fetchCourseName(route.params.id);
    }
});

watch(
    () => route.params.id,
    (newId, oldId) => {
        if (newId !== oldId && isSingleCoursePage.value) {
            fetchCourseName(newId);
        }
    }
);

const changeCourse = (newCourseId) => {
    router.push({name: 'single-course', params: {id: newCourseId}});
};


const notificationsStore = useNotificationsStore();


onMounted(() => {
    auth.checkAuth();
});

watch(
    () => auth.user,
    async (newUser) => {
        if (newUser) {
            if (!notificationsStore.notifications.length) {
                await notificationsStore.fetchNotifications();
            }
            notificationsStore.listenNotifications();
        }
    },
    {immediate: true}
);


const {notifications, unreadCount, markAsRead, loading, timeAgo} = notificationsStore;

const {wishlistCount, loading: wishlistLoading} = useWishlistCount();
const {cartCount, loadCartCount} = useCartCount();
</script>

<template>
    <div v-if="!auth.isAuthenticated" :class="['navbar-open', isNavbarOpen ? 'd-block' : 'd-none']">
        <div class="nav-section d-flex justify-content-between align-items-center">
            <div class="navbar-open-logo">
                <img src="/assets/images/logo/logo.svg" alt="logo">
            </div>
            <div class="close-navbar-icon cursor-pointer" @click="closeNavbar">
                <img src="/assets/icons/navbar/close.svg" alt="close">
            </div>
        </div>
        <div class="menu-section">
            <ul class="list-unstyled menu-nav">
                <li class="nav-item active">
                    <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">{{ $t('home') }}
                    </router-link>
                </li>
                <li class="nav-item dropdown" @click="toggleDropdown('about')">
                    <a class="nav-link" href="#" id="navbarDropdownMenuLink" aria-haspopup="true"
                       aria-expanded="false">
                        {{ $t('about_us') }}
                        <svg width="24" height="23" viewBox="0 0 24 23" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.4305 7.86792C18.3414 7.77809 18.2354 7.7068 18.1187 7.65814C18.0019 7.60949 17.8766 7.58444 17.7501 7.58444C17.6236 7.58444 17.4983 7.60949 17.3816 7.65814C17.2648 7.7068 17.1588 7.77809 17.0697 7.86792L12.6805 12.2571C12.5914 12.3469 12.4854 12.4182 12.3687 12.4669C12.2519 12.5155 12.1266 12.5406 12.0001 12.5406C11.8736 12.5406 11.7483 12.5155 11.6316 12.4669C11.5148 12.4182 11.4088 12.3469 11.3197 12.2571L6.93053 7.86792C6.84144 7.77809 6.73544 7.7068 6.61866 7.65814C6.50188 7.60949 6.37662 7.58444 6.25011 7.58444C6.1236 7.58444 5.99834 7.60949 5.88156 7.65814C5.76477 7.7068 5.65878 7.77809 5.56969 7.86792C5.3912 8.04747 5.29102 8.29036 5.29102 8.54354C5.29102 8.79672 5.3912 9.03961 5.56969 9.21917L9.96844 13.6179C10.5075 14.1563 11.2382 14.4587 12.0001 14.4587C12.762 14.4587 13.4927 14.1563 14.0318 13.6179L18.4305 9.21917C18.609 9.03961 18.7092 8.79672 18.7092 8.54354C18.7092 8.29036 18.609 8.04747 18.4305 7.86792Z"
                                  fill="#F5F5F5"/>
                        </svg>
                    </a>
                    <div class="dropdown-menu" :class="{ show: dropdowns.about }">
                        <router-link :class="{ active: $route.path === '/about' }" to="/about"
                                     class="dropdown-item text-capitalize">{{ $t('about_us') }}
                        </router-link>
                        <router-link :class="{ active: $route.path === '/why-choose-us' }" to="/why-choose-us"
                                     class="dropdown-item text-capitalize">{{ $t('why_choose_us') }}
                        </router-link>
                        <router-link :class="{ active: $route.path === '/contact' }" to="/contact"
                                     class="dropdown-item text-capitalize">{{ $t('contact_us') }}
                        </router-link>
                        <router-link :class="{ active: $route.path === '/blog' }" to="/blog"
                                     class="dropdown-item text-capitalize">{{ $t('blog') }}
                        </router-link>
                    </div>
                </li>

                <li class="nav-item dropdown" @click="toggleDropdown('courses')">
                    <a class="nav-link" href="#" id="navbarDropdownMenuLink" aria-haspopup="true"
                       aria-expanded="false">
                        {{ $t('courses') }}
                        <svg width="24" height="23" viewBox="0 0 24 23" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M18.4305 7.86792C18.3414 7.77809 18.2354 7.7068 18.1187 7.65814C18.0019 7.60949 17.8766 7.58444 17.7501 7.58444C17.6236 7.58444 17.4983 7.60949 17.3816 7.65814C17.2648 7.7068 17.1588 7.77809 17.0697 7.86792L12.6805 12.2571C12.5914 12.3469 12.4854 12.4182 12.3687 12.4669C12.2519 12.5155 12.1266 12.5406 12.0001 12.5406C11.8736 12.5406 11.7483 12.5155 11.6316 12.4669C11.5148 12.4182 11.4088 12.3469 11.3197 12.2571L6.93053 7.86792C6.84144 7.77809 6.73544 7.7068 6.61866 7.65814C6.50188 7.60949 6.37662 7.58444 6.25011 7.58444C6.1236 7.58444 5.99834 7.60949 5.88156 7.65814C5.76477 7.7068 5.65878 7.77809 5.56969 7.86792C5.3912 8.04747 5.29102 8.29036 5.29102 8.54354C5.29102 8.79672 5.3912 9.03961 5.56969 9.21917L9.96844 13.6179C10.5075 14.1563 11.2382 14.4587 12.0001 14.4587C12.762 14.4587 13.4927 14.1563 14.0318 13.6179L18.4305 9.21917C18.609 9.03961 18.7092 8.79672 18.7092 8.54354C18.7092 8.29036 18.609 8.04747 18.4305 7.86792Z"
                                  fill="#F5F5F5"/>
                        </svg>
                    </a>
                    <div class="dropdown-menu" :class="{ show: dropdowns.courses }">
                        <router-link :class="{ active: $route.path === '/courses' }" to="/courses"
                                     class="dropdown-item text-capitalize">{{ $t('courses') }}
                        </router-link>
                        <router-link
                                v-for="course in topViewedCourses"
                                :key="course.id"
                                :to="`/single-course/${course.id}`"
                                class="dropdown-item text-capitalize"
                        >
                            {{ getLocalizedField(course, 'title') }}
                        </router-link>
                    </div>
                </li>
                <li class="nav-item">
                    <router-link to="/teach-on-trainUp" class="nav-link"
                                 :class="{ active: $route.path === '/teach-on-trainUp' }">{{ $t('teach_on_trainUp') }}
                    </router-link>
                </li>
            </ul>
            <ul class="list-unstyled d-flex menu-mobile-lang align-items-center" aria-labelledby="navbarDropdown">
                <li>
                    <a :class="['dropdown-item', { active: locale === 'arm' }]" @click.prevent="changeLocale('arm')"
                       href="#">
                        <img class="me-1" src="/assets/icons/navbar/lang/arm.svg" alt="arm">
                        Հայերեն</a>
                </li>
                <li><a :class="['dropdown-item', { active: locale === 'en' }]" @click.prevent="changeLocale('en')"
                       href="#">
                    <img class="me-1" src="/assets/icons/navbar/lang/en.svg" alt="en">
                    English</a></li>
                <li><a :class="['dropdown-item', { active: locale === 'ru' }]" @click.prevent="changeLocale('ru')"
                       href="#">
                    <img class="me-1" src="/assets/icons/navbar/lang/ru.svg" alt="ru">
                    Русский</a></li>
            </ul>
            <div class="d-flex flex-column gap-4 mt-3 mb-3" v-if="!auth.isAuthenticated">
                <RouterLink to="/sign-in" custom v-slot="{ navigate }">
                    <button @click="navigate" class="auth-btn">
                        {{ $t('sign_in') }}
                    </button>
                </RouterLink>
                <RouterLink to="/sign-up" custom v-slot="{ navigate }">
                    <button @click="navigate" class="auth-btn">
                        {{ $t('sign_up') }}
                    </button>
                </RouterLink>
            </div>
            <div class="social-network-section d-flex align-items-center">
                <div class="social-icon me-4">
                    <a href="" class="text-decoration-none">
                        <img src="/assets/icons/social-media/facebook-navbar.svg" alt="facebook-navbar">
                    </a>
                </div>
                <div class="social-icon me-4">
                    <a href="" class="text-decoration-none">
                        <img src="/assets/icons/social-media/instagram-navbar.svg" alt="instagram-navbar">
                    </a>
                </div>
            </div>
        </div>
    </div>
    <div v-if="auth.isAuthenticated && isInstructor"
         :class="['navbar-open-auth-instructor', isNavbarOpen ? 'd-block' : 'd-none']">
        <div class="menu-section mt-0">
            <ul class="list-unstyled">
                <li class="d-flex w-100 gap-2 auth-user-nav-li align-items-center p-4 pe-5 open-navbar-auth-header position-relative">
                    <div class="position-absolute top-0 end-0 close-navbar-icon cursor-pointer d-flex justify-content-end p-3"
                         @click="closeNavbar">
                        <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.9315 1.80338L19.9974 -0.0533752L10.9384 8.64412L1.87943 -0.0533752L-0.0546875 1.80338L9.00521 10.5L-0.0546875 19.1966L1.87943 21.0534L10.9384 12.3559L19.9974 21.0534L21.9315 19.1966L12.8716 10.5L21.9315 1.80338Z"
                                  fill="#334053"/>
                        </svg>
                    </div>
                    <div class="auth-user-img">
                        <img :src="userImage" alt="User image" @error="handleImageError"/>
                    </div>
                    <div class="auth-user-detail d-flex flex-column justify-content-center">
                        <span class="auth-user-name">{{ userName }}</span>
                        <p class="auth-user-email mb-0">{{ userEmail }}</p>
                    </div>
                </li>
                <li class="auth-user-nav-li">
                    <p class="auth-user-nav-li-title mb-2 mt-2">Course</p>
                    <ul class="list-unstyled">
                        <li class="auth-user-nav-li ps-0">
                            <router-link to="/instructor/my-courses"
                                         :class="{ active: $route.path === '/instructor/my-courses' }"
                                         class="text-capitalize auth-user-nav-li-item">My courses
                            </router-link>
                        </li>
                        <li class="auth-user-nav-li ps-0">
                            <router-link to="/instructor/add-courses"
                                         :class="{ active: $route.path === '/instructor/add-courses' }"
                                         class="text-capitalize auth-user-nav-li-item">Add a course
                            </router-link>
                        </li>
                    </ul>
                </li>
                <li>
                    <div class="navbar-line w-100"></div>
                </li>

                <li class="auth-user-nav-li">
                    <p class="auth-user-nav-li-title mb-2 mt-2">Most popular</p>
                    <ul class="list-unstyled">
                        <li class="auth-user-nav-li ps-0">
                            <router-link to="/instructor/settings"
                                         :class="{ active: $route.path === '/instructor/settings' }"
                                         class="text-capitalize auth-user-nav-li-item">Account Settings
                            </router-link>
                        </li>
                        <li class="auth-user-nav-li  ps-0">
                            <router-link to="/instructor/wallet"
                                         :class="{ active: $route.path === '/instructor/wallet' }"
                                         class="text-capitalize auth-user-nav-li-item">Wallet
                            </router-link>
                        </li>
                        <li class="auth-user-nav-li ps-0">
                            <router-link to="/instructor/purchase-history"
                                         :class="{ active: $route.path === '/instructor/purchase-history' }"
                                         class="text-capitalize auth-user-nav-li-item">Purchase History
                            </router-link>
                        </li>
                    </ul>
                </li>
                <li>
                    <div class="navbar-line w-100"></div>
                </li>
                <li class="auth-user-nav-li">
                    <p class="auth-user-nav-li-title">More from HayLogic academy</p>

                    <ul class="list-unstyled menu-nav">
                        <li class="active">
                            <router-link to="/" class="auth-user-nav-li-item" :class="{ active: $route.path === '/' }">
                                {{ $t('home') }}
                            </router-link>
                        </li>
                        <li class="dropdown" @click="toggleDropdown('about')">
                            <a class="auth-user-nav-li-item" href="#" id="navbarDropdownMenuLink" aria-haspopup="true"
                               aria-expanded="false">
                                {{ $t('about_us') }}
                                <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.7092 0.329895C13.6163 0.225362 13.5057 0.142392 13.3839 0.0857716C13.262 0.0291509 13.1313 0 12.9993 0C12.8673 0 12.7366 0.0291509 12.6148 0.0857716C12.4929 0.142392 12.3824 0.225362 12.2894 0.329895L7.70992 5.43783C7.61697 5.54236 7.50638 5.62533 7.38453 5.68195C7.26269 5.73857 7.132 5.76772 7 5.76772C6.868 5.76772 6.73731 5.73857 6.61547 5.68195C6.49362 5.62533 6.38303 5.54236 6.29008 5.43783L1.7106 0.329895C1.61765 0.225362 1.50706 0.142392 1.38521 0.0857716C1.26337 0.0291509 1.13268 0 1.00068 0C0.868682 0 0.737991 0.0291509 0.616146 0.0857716C0.4943 0.142392 0.383712 0.225362 0.29076 0.329895C0.10453 0.538854 0 0.821521 0 1.11616C0 1.4108 0.10453 1.69346 0.29076 1.90242L4.88024 7.02151C5.44268 7.64807 6.20509 8 7 8C7.79491 8 8.55732 7.64807 9.11976 7.02151L13.7092 1.90242C13.8955 1.69346 14 1.4108 14 1.11616C14 0.821521 13.8955 0.538854 13.7092 0.329895Z"
                                          fill="#1A283E"/>
                                </svg>
                            </a>
                            <div
                                    class="dropdown-menu"
                                    :class="[
                                    { show: dropdowns.about },
                                    { 'authenticated-dropdown': auth.isAuthenticated }
                                   ]"
                                    :style="auth.isAuthenticated ? { backgroundColor: 'var(--secondary-2-10)' } : {}"
                            >
                                <router-link
                                        to="/about"
                                        class="dropdown-item text-capitalize"
                                        :class="{ active: $route.path === '/about' }"
                                        :style="auth.isAuthenticated ? { color: 'var(--primary-80)' } : {}"
                                >
                                    {{ $t('about_us') }}
                                </router-link>
                                <router-link
                                        to="/why-choose-us"
                                        class="dropdown-item text-capitalize"
                                        :class="{ active: $route.path === '/why-choose-us' }"
                                        :style="auth.isAuthenticated ? { color: 'var(--primary-80)' } : {}"
                                >
                                    {{ $t('why_choose_us') }}
                                </router-link>
                                <router-link
                                        to="/contact"
                                        class="dropdown-item text-capitalize"
                                        :class="{ active: $route.path === '/contact' }"
                                        :style="auth.isAuthenticated ? { color: 'var(--primary-80)' } : {}"
                                >
                                    {{ $t('contact_us') }}
                                </router-link>
                                <router-link
                                        to="/blog"
                                        class="dropdown-item text-capitalize"
                                        :class="{ active: $route.path === '/blog' }"
                                        :style="auth.isAuthenticated ? { color: 'var(--primary-80)' } : {}"
                                >
                                    {{ $t('blog') }}
                                </router-link>
                            </div>
                        </li>

                        <li class="dropdown" @click="toggleDropdown('courses')">
                            <a class="auth-user-nav-li-item" href="#" id="navbarDropdownMenuLink" aria-haspopup="true"
                               aria-expanded="false">
                                {{ $t('courses') }}
                                <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.7092 0.329895C13.6163 0.225362 13.5057 0.142392 13.3839 0.0857716C13.262 0.0291509 13.1313 0 12.9993 0C12.8673 0 12.7366 0.0291509 12.6148 0.0857716C12.4929 0.142392 12.3824 0.225362 12.2894 0.329895L7.70992 5.43783C7.61697 5.54236 7.50638 5.62533 7.38453 5.68195C7.26269 5.73857 7.132 5.76772 7 5.76772C6.868 5.76772 6.73731 5.73857 6.61547 5.68195C6.49362 5.62533 6.38303 5.54236 6.29008 5.43783L1.7106 0.329895C1.61765 0.225362 1.50706 0.142392 1.38521 0.0857716C1.26337 0.0291509 1.13268 0 1.00068 0C0.868682 0 0.737991 0.0291509 0.616146 0.0857716C0.4943 0.142392 0.383712 0.225362 0.29076 0.329895C0.10453 0.538854 0 0.821521 0 1.11616C0 1.4108 0.10453 1.69346 0.29076 1.90242L4.88024 7.02151C5.44268 7.64807 6.20509 8 7 8C7.79491 8 8.55732 7.64807 9.11976 7.02151L13.7092 1.90242C13.8955 1.69346 14 1.4108 14 1.11616C14 0.821521 13.8955 0.538854 13.7092 0.329895Z"
                                          fill="#1A283E"/>
                                </svg>
                            </a>
                            <div
                                    class="dropdown-menu"
                                    :class="[
                            { show: dropdowns.courses },
                            { 'authenticated-dropdown': auth.isAuthenticated }
                        ]"
                                    :style="auth.isAuthenticated ? { backgroundColor: 'var(--secondary-2-10)' } : {}"
                            >
                                <router-link
                                        to="/courses"
                                        class="dropdown-item text-capitalize"
                                        :class="{ active: $route.path === '/courses' }"
                                        :style="auth.isAuthenticated ? { color: 'var(--primary-80)' } : {}"
                                >
                                    {{ $t('courses') }}
                                </router-link>


                                <router-link
                                        v-for="course in topViewedCourses"
                                        :key="course.id"
                                        :to="`/single-course/${course.id}`"
                                        class="dropdown-item text-capitalize"
                                        :style="auth.isAuthenticated ? { color: 'var(--primary-80)' } : {}"
                                >
                                    {{ getLocalizedField(course, 'title') }}
                                </router-link>
                            </div>
                        </li>
                        <li>
                            <router-link to="/teach-on-trainUp" class="auth-user-nav-li-item"
                                         :class="{ active: $route.path === '/teach-on-trainUp' }">
                                {{ $t('teach_on_trainUp') }}
                            </router-link>
                        </li>
                    </ul>
                    <ul class="list-unstyled d-flex menu-mobile-lang align-items-center ps-0 pt-4"
                        aria-labelledby="navbarDropdown">
                        <li>
                            <a :class="['auth-user-nav-li-item', { active: locale === 'arm' }]"
                               @click.prevent="changeLocale('arm')"
                               href="#">
                                <img class="me-1" src="/assets/icons/navbar/lang/arm.svg" alt="arm">
                                Հայերեն</a>
                        </li>
                        <li><a :class="['auth-user-nav-li-item', { active: locale === 'en' }]"
                               @click.prevent="changeLocale('en')"
                               href="#">
                            <img class="me-1" src="/assets/icons/navbar/lang/en.svg" alt="en">
                            English</a></li>
                        <li><a :class="['auth-user-nav-li-item', { active: locale === 'ru' }]"
                               @click.prevent="changeLocale('ru')"
                               href="#">
                            <img class="me-1" src="/assets/icons/navbar/lang/ru.svg" alt="ru">
                            Русский</a></li>
                    </ul>
                    <div class="social-network-section d-flex align-items-center ps-0">
                        <div class="social-icon me-4">
                            <a href="" class="text-decoration-none">
                                <img src="/assets/icons/social-media/facebook-navbar.svg" alt="facebook-navbar">
                            </a>
                        </div>
                        <div class="social-icon me-4">
                            <a href="" class="text-decoration-none">
                                <img src="/assets/icons/social-media/instagram-navbar.svg" alt="instagram-navbar">
                            </a>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="navbar-line w-100"></div>
                </li>
                <li class="auth-user-nav-li">
                    <router-link to="/instructor/how-we-can-help"
                                 :class="{ active: $route.path === '/instructor/how-we-can-help' }"
                                 class="text-capitalize auth-user-nav-li-item">Help & Support
                    </router-link>
                </li>
                <li class="auth-user-nav-li">
                    <a
                            href="#"
                            class="text-capitalize auth-user-nav-li-item item-logout"
                            @click.prevent="logout"
                    >Log Out</a>
                </li>
            </ul>

        </div>
    </div>
    <div v-if="auth.isAuthenticated && isLearner"
         :class="['navbar-open-auth-instructor', isNavbarOpen ? 'd-block' : 'd-none']">
        <div class="menu-section mt-0">
            <ul class="list-unstyled">
                <li class="d-flex w-100 gap-2 auth-user-nav-li align-items-center p-4 pe-5 open-navbar-auth-header position-relative">
                    <div class="position-absolute top-0 end-0 close-navbar-icon cursor-pointer d-flex justify-content-end p-3"
                         @click="closeNavbar">
                        <svg width="22" height="21" viewBox="0 0 22 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M21.9315 1.80338L19.9974 -0.0533752L10.9384 8.64412L1.87943 -0.0533752L-0.0546875 1.80338L9.00521 10.5L-0.0546875 19.1966L1.87943 21.0534L10.9384 12.3559L19.9974 21.0534L21.9315 19.1966L12.8716 10.5L21.9315 1.80338Z"
                                  fill="#334053"/>
                        </svg>
                    </div>
                    <div class="auth-user-img">
                        <img :src="userImage" alt="User image" @error="handleImageError"/>
                    </div>
                    <div class="auth-user-detail d-flex flex-column justify-content-center">
                        <span class="auth-user-name">{{ userName }}</span>
                        <p class="auth-user-email mb-0">{{ userEmail }}</p>
                    </div>
                </li>
                <li class="auth-user-nav-li">
                    <p class="auth-user-nav-li-title mb-2 mt-2">Learn</p>
                    <ul class="list-unstyled">
                        <li class="auth-user-nav-li ps-0">
                            <router-link to="/learner/my-learning"
                                         :class="{ active: $route.path === '/learner/my-learning' }"
                                         class="text-capitalize auth-user-nav-li-item">My Learning
                            </router-link>
                        </li>
                    </ul>
                </li>
                <li>
                    <div class="navbar-line w-100"></div>
                </li>

                <li class="auth-user-nav-li">
                    <p class="auth-user-nav-li-title mb-2 mt-2">Most popular</p>
                    <ul class="list-unstyled">
                        <li class="auth-user-nav-li ps-0">
                            <router-link to="/learner/shopping-cart"
                                         :class="{ active: $route.path === '/learner/shopping-cart' }"
                                         class="text-capitalize auth-user-nav-li-item">My Cart
                            </router-link>
                        </li>
                        <li class="auth-user-nav-li ps-0">
                            <router-link to="/learner/wishlist" :class="{ active: $route.path === '/learner/wishlist' }"
                                         class="text-capitalize auth-user-nav-li-item">Wishlist
                            </router-link>
                        </li>
                        <li class="auth-user-nav-li ps-0">
                            <router-link to="/learner/settings" :class="{ active: $route.path === '/learner/settings' }"
                                         class="text-capitalize auth-user-nav-li-item">Account Settings
                            </router-link>
                        </li>
                        <li class="auth-user-nav-li ps-0">
                            <router-link to="/learner/wallet"
                                         :class="{ active: $route.path === '/learner/wallet' }"
                                         class="text-capitalize auth-user-nav-li-item">Wallet
                            </router-link>
                        </li>

                        <li class="auth-user-nav-li ps-0">
                            <router-link to="/learner/purchase-history"
                                         :class="{ active: $route.path === '/learner/purchase-history' }"
                                         class="text-capitalize auth-user-nav-li-item">Purchase History
                            </router-link>
                        </li>
                    </ul>
                </li>
                <li>
                    <div class="navbar-line w-100"></div>
                </li>
                <li class="auth-user-nav-li">
                    <p class="auth-user-nav-li-title">More from HayLogic academy</p>

                    <ul class="list-unstyled menu-nav">
                        <li class="active">
                            <router-link to="/" class="auth-user-nav-li-item" :class="{ active: $route.path === '/' }">
                                {{ $t('home') }}
                            </router-link>
                        </li>
                        <li class="dropdown" @click="toggleDropdown('about')">
                            <a class="auth-user-nav-li-item" href="#" id="navbarDropdownMenuLink" aria-haspopup="true"
                               aria-expanded="false">
                                {{ $t('about_us') }}
                                <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.7092 0.329895C13.6163 0.225362 13.5057 0.142392 13.3839 0.0857716C13.262 0.0291509 13.1313 0 12.9993 0C12.8673 0 12.7366 0.0291509 12.6148 0.0857716C12.4929 0.142392 12.3824 0.225362 12.2894 0.329895L7.70992 5.43783C7.61697 5.54236 7.50638 5.62533 7.38453 5.68195C7.26269 5.73857 7.132 5.76772 7 5.76772C6.868 5.76772 6.73731 5.73857 6.61547 5.68195C6.49362 5.62533 6.38303 5.54236 6.29008 5.43783L1.7106 0.329895C1.61765 0.225362 1.50706 0.142392 1.38521 0.0857716C1.26337 0.0291509 1.13268 0 1.00068 0C0.868682 0 0.737991 0.0291509 0.616146 0.0857716C0.4943 0.142392 0.383712 0.225362 0.29076 0.329895C0.10453 0.538854 0 0.821521 0 1.11616C0 1.4108 0.10453 1.69346 0.29076 1.90242L4.88024 7.02151C5.44268 7.64807 6.20509 8 7 8C7.79491 8 8.55732 7.64807 9.11976 7.02151L13.7092 1.90242C13.8955 1.69346 14 1.4108 14 1.11616C14 0.821521 13.8955 0.538854 13.7092 0.329895Z"
                                          fill="#1A283E"/>
                                </svg>
                            </a>
                            <div
                                    class="dropdown-menu"
                                    :class="[
                                    { show: dropdowns.about },
                                    { 'authenticated-dropdown': auth.isAuthenticated }
                                   ]"
                                    :style="auth.isAuthenticated ? { backgroundColor: 'var(--secondary-2-10)' } : {}"
                            >
                                <router-link
                                        to="/about"
                                        class="dropdown-item text-capitalize"
                                        :class="{ active: $route.path === '/about' }"
                                        :style="auth.isAuthenticated ? { color: 'var(--primary-80)' } : {}"
                                >
                                    {{ $t('about_us') }}
                                </router-link>
                                <router-link
                                        to="/why-choose-us"
                                        class="dropdown-item text-capitalize"
                                        :class="{ active: $route.path === '/why-choose-us' }"
                                        :style="auth.isAuthenticated ? { color: 'var(--primary-80)' } : {}"
                                >
                                    {{ $t('why_choose_us') }}
                                </router-link>
                                <router-link
                                        to="/contact"
                                        class="dropdown-item text-capitalize"
                                        :class="{ active: $route.path === '/contact' }"
                                        :style="auth.isAuthenticated ? { color: 'var(--primary-80)' } : {}"
                                >
                                    {{ $t('contact_us') }}
                                </router-link>
                                <router-link
                                        to="/blog"
                                        class="dropdown-item text-capitalize"
                                        :class="{ active: $route.path === '/blog' }"
                                        :style="auth.isAuthenticated ? { color: 'var(--primary-80)' } : {}"
                                >
                                    {{ $t('blog') }}
                                </router-link>
                            </div>
                        </li>

                        <li class="dropdown" @click="toggleDropdown('courses')">
                            <a class="auth-user-nav-li-item" href="#" id="navbarDropdownMenuLink" aria-haspopup="true"
                               aria-expanded="false">
                                {{ $t('courses') }}
                                <svg width="14" height="8" viewBox="0 0 14 8" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M13.7092 0.329895C13.6163 0.225362 13.5057 0.142392 13.3839 0.0857716C13.262 0.0291509 13.1313 0 12.9993 0C12.8673 0 12.7366 0.0291509 12.6148 0.0857716C12.4929 0.142392 12.3824 0.225362 12.2894 0.329895L7.70992 5.43783C7.61697 5.54236 7.50638 5.62533 7.38453 5.68195C7.26269 5.73857 7.132 5.76772 7 5.76772C6.868 5.76772 6.73731 5.73857 6.61547 5.68195C6.49362 5.62533 6.38303 5.54236 6.29008 5.43783L1.7106 0.329895C1.61765 0.225362 1.50706 0.142392 1.38521 0.0857716C1.26337 0.0291509 1.13268 0 1.00068 0C0.868682 0 0.737991 0.0291509 0.616146 0.0857716C0.4943 0.142392 0.383712 0.225362 0.29076 0.329895C0.10453 0.538854 0 0.821521 0 1.11616C0 1.4108 0.10453 1.69346 0.29076 1.90242L4.88024 7.02151C5.44268 7.64807 6.20509 8 7 8C7.79491 8 8.55732 7.64807 9.11976 7.02151L13.7092 1.90242C13.8955 1.69346 14 1.4108 14 1.11616C14 0.821521 13.8955 0.538854 13.7092 0.329895Z"
                                          fill="#1A283E"/>
                                </svg>
                            </a>
                            <div
                                    class="dropdown-menu"
                                    :class="[
                            { show: dropdowns.courses },
                            { 'authenticated-dropdown': auth.isAuthenticated }
                        ]"
                                    :style="auth.isAuthenticated ? { backgroundColor: 'var(--secondary-2-10)' } : {}"
                            >
                                <router-link
                                        to="/courses"
                                        class="dropdown-item text-capitalize"
                                        :class="{ active: $route.path === '/courses' }"
                                        :style="auth.isAuthenticated ? { color: 'var(--primary-80)' } : {}"
                                >
                                    {{ $t('courses') }}
                                </router-link>


                                <router-link
                                        v-for="course in topViewedCourses"
                                        :key="course.id"
                                        :to="`/single-course/${course.id}`"
                                        class="dropdown-item text-capitalize"
                                        :style="auth.isAuthenticated ? { color: 'var(--primary-80)' } : {}"
                                >
                                    {{ getLocalizedField(course, 'title') }}
                                </router-link>
                            </div>
                        </li>

                        <li class="auth-user-nav-li-item">
                            <router-link to="/teach-on-trainUp" class="auth-user-nav-li-item"
                                         :class="{ active: $route.path === '/teach-on-trainUp' }">
                                {{ $t('teach_on_trainUp') }}
                            </router-link>
                        </li>
                    </ul>
                    <ul class="list-unstyled d-flex menu-mobile-lang align-items-center ps-0 pt-4"
                        aria-labelledby="navbarDropdown">
                        <li>
                            <a :class="['auth-user-nav-li-item', { active: locale === 'arm' }]"
                               @click.prevent="changeLocale('arm')"
                               href="#">
                                <img class="me-1" src="/assets/icons/navbar/lang/arm.svg" alt="arm">
                                Հայերեն</a>
                        </li>
                        <li><a :class="['auth-user-nav-li-item', { active: locale === 'en' }]"
                               @click.prevent="changeLocale('en')"
                               href="#">
                            <img class="me-1" src="/assets/icons/navbar/lang/en.svg" alt="en">
                            English</a></li>
                        <li><a :class="['auth-user-nav-li-item', { active: locale === 'ru' }]"
                               @click.prevent="changeLocale('ru')"
                               href="#">
                            <img class="me-1" src="/assets/icons/navbar/lang/ru.svg" alt="ru">
                            Русский</a></li>
                    </ul>
                    <div class="social-network-section d-flex align-items-center ps-0">
                        <div class="social-icon me-4">
                            <a href="" class="text-decoration-none">
                                <img src="/assets/icons/social-media/facebook-navbar.svg" alt="facebook-navbar">
                            </a>
                        </div>
                        <div class="social-icon me-4">
                            <a href="" class="text-decoration-none">
                                <img src="/assets/icons/social-media/instagram-navbar.svg" alt="instagram-navbar">
                            </a>
                        </div>
                    </div>
                </li>
                <li>
                    <div class="navbar-line w-100"></div>
                </li>
                <li class="auth-user-nav-li">
                    <router-link to="/learner/how-we-can-help"
                                 :class="{ active: $route.path === '/learner/how-we-can-help' }"
                                 class="text-capitalize auth-user-nav-li-item">Help & Support
                    </router-link>
                </li>
                <li class="auth-user-nav-li">
                    <a
                            href="#"
                            class="text-capitalize auth-user-nav-li-item item-logout"
                            @click.prevent="logout"
                    >Log Out</a>
                </li>
            </ul>

        </div>
    </div>

    <div :class="headerClass">
        <div v-if="isHomePage || isPrivacyPolicyPage || isTermsConditionsPage" class="home-girl-img position-absolute">
            <img src="/assets/images/home/header-girl.svg" alt="girl">
        </div>
        <div class="container">
            <nav v-if="!auth.isAuthenticated" class="navbar d-flex justify-content-between">
                <div class="logo-section d-flex align-items-center">
                    <router-link class="navbar-brand" to="/">
                        <div class="logo-container">
                            <img src="/assets/images/logo/logo.svg" alt="Logo" class="img-fluid">
                        </div>
                    </router-link>
                </div>
                <div @click="openNavbar" class="open-navbar-icon cursor-pointer d-none">
                    <img src="/assets/icons/navbar/open.svg" alt="open" class="cursor-pointer">
                </div>
                <ul class="list-unstyled menu-list d-flex justify-content-between align-items-center p-0 m-0">
                    <li class="nav-item active">
                        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">{{ $t('home') }}
                        </router-link>
                    </li>
                    <li class="nav-item dropdown" @click="toggleDropdown('about')">
                        <a class="nav-link" href="#" id="navbarDropdownMenuLink" aria-haspopup="true"
                           aria-expanded="false">
                            {{ $t('about_us') }}
                            <svg width="24" height="23" viewBox="0 0 24 23" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.4305 7.86792C18.3414 7.77809 18.2354 7.7068 18.1187 7.65814C18.0019 7.60949 17.8766 7.58444 17.7501 7.58444C17.6236 7.58444 17.4983 7.60949 17.3816 7.65814C17.2648 7.7068 17.1588 7.77809 17.0697 7.86792L12.6805 12.2571C12.5914 12.3469 12.4854 12.4182 12.3687 12.4669C12.2519 12.5155 12.1266 12.5406 12.0001 12.5406C11.8736 12.5406 11.7483 12.5155 11.6316 12.4669C11.5148 12.4182 11.4088 12.3469 11.3197 12.2571L6.93053 7.86792C6.84144 7.77809 6.73544 7.7068 6.61866 7.65814C6.50188 7.60949 6.37662 7.58444 6.25011 7.58444C6.1236 7.58444 5.99834 7.60949 5.88156 7.65814C5.76477 7.7068 5.65878 7.77809 5.56969 7.86792C5.3912 8.04747 5.29102 8.29036 5.29102 8.54354C5.29102 8.79672 5.3912 9.03961 5.56969 9.21917L9.96844 13.6179C10.5075 14.1563 11.2382 14.4587 12.0001 14.4587C12.762 14.4587 13.4927 14.1563 14.0318 13.6179L18.4305 9.21917C18.609 9.03961 18.7092 8.79672 18.7092 8.54354C18.7092 8.29036 18.609 8.04747 18.4305 7.86792Z"
                                      fill="#F5F5F5"/>
                            </svg>
                        </a>
                        <div class="dropdown-menu" :class="{ show: dropdowns.about }">
                            <router-link :class="{ active: $route.path === '/about' }" to="/about"
                                         class="dropdown-item text-capitalize">{{ $t('about_us') }}
                            </router-link>
                            <router-link :class="{ active: $route.path === '/why-choose-us' }" to="/why-choose-us"
                                         class="dropdown-item text-capitalize">{{ $t('why_choose_us') }}
                            </router-link>
                            <router-link :class="{ active: $route.path === '/contact' }" to="/contact"
                                         class="dropdown-item text-capitalize">{{ $t('contact_us') }}
                            </router-link>
                            <router-link :class="{ active: $route.path === '/blog' }" to="/blog"
                                         class="dropdown-item text-capitalize">{{ $t('blog') }}
                            </router-link>
                        </div>
                    </li>

                    <li class="nav-item dropdown" @click="toggleDropdown('courses')">
                        <a class="nav-link" href="#" id="navbarDropdownMenuLink" aria-haspopup="true"
                           aria-expanded="false">
                            {{ $t('courses') }}
                            <svg width="24" height="23" viewBox="0 0 24 23" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.4305 7.86792C18.3414 7.77809 18.2354 7.7068 18.1187 7.65814C18.0019 7.60949 17.8766 7.58444 17.7501 7.58444C17.6236 7.58444 17.4983 7.60949 17.3816 7.65814C17.2648 7.7068 17.1588 7.77809 17.0697 7.86792L12.6805 12.2571C12.5914 12.3469 12.4854 12.4182 12.3687 12.4669C12.2519 12.5155 12.1266 12.5406 12.0001 12.5406C11.8736 12.5406 11.7483 12.5155 11.6316 12.4669C11.5148 12.4182 11.4088 12.3469 11.3197 12.2571L6.93053 7.86792C6.84144 7.77809 6.73544 7.7068 6.61866 7.65814C6.50188 7.60949 6.37662 7.58444 6.25011 7.58444C6.1236 7.58444 5.99834 7.60949 5.88156 7.65814C5.76477 7.7068 5.65878 7.77809 5.56969 7.86792C5.3912 8.04747 5.29102 8.29036 5.29102 8.54354C5.29102 8.79672 5.3912 9.03961 5.56969 9.21917L9.96844 13.6179C10.5075 14.1563 11.2382 14.4587 12.0001 14.4587C12.762 14.4587 13.4927 14.1563 14.0318 13.6179L18.4305 9.21917C18.609 9.03961 18.7092 8.79672 18.7092 8.54354C18.7092 8.29036 18.609 8.04747 18.4305 7.86792Z"
                                      fill="#F5F5F5"/>
                            </svg>
                        </a>
                        <div class="dropdown-menu" :class="{ show: dropdowns.courses }">
                            <router-link :class="{ active: $route.path === '/courses' }" to="/courses"
                                         class="dropdown-item text-capitalize">{{ $t('courses') }}
                            </router-link>
                            <router-link
                                    v-for="course in topViewedCourses"
                                    :key="course.id"
                                    :to="`/single-course/${course.id}`"
                                    class="dropdown-item text-capitalize"
                            >
                                {{ getLocalizedField(course, 'title') }}
                            </router-link>
                        </div>
                    </li>
                    <li class="nav-item">
                        <router-link to="/teach-on-trainUp" class="nav-link"
                                     :class="{ active: $route.path === '/teach-on-trainUp' }">{{
                            $t('teach_on_trainUp')
                            }}
                        </router-link>
                    </li>
                </ul>
                <div class="navbar-auth-btn-block d-flex align-items-center">
                    <div v-if="!auth.isAuthenticated && !isSignInPage" class="auth-btn-div">
                        <RouterLink to="/sign-in" custom v-slot="{ navigate }">
                            <button @click="navigate" class="auth-btn">
                                {{ $t('sign_in') }}
                            </button>
                        </RouterLink>
                    </div>

                    <div v-if="!auth.isAuthenticated && !isSignUpPage && !isVerifyPage" class="auth-btn-div">
                        <RouterLink to="/sign-up" custom v-slot="{ navigate }">
                            <button @click="navigate" class="auth-btn">
                                {{ $t('sign_up') }}
                            </button>
                        </RouterLink>
                    </div>

                    <ul class="m-0 p-0 list-unstyled d-flex align-items-center justify-content-center">
                        <li class="lang-change-block nav-item dropdown position-relative">
                            <!-- Display the current language dynamically -->
                            <a class="nav-link" href="#" id="navbarDropdown" role="button"
                               data-bs-toggle="dropdown" aria-expanded="false"
                            >
                                <svg class="lang-icon" width="30" height="31" viewBox="0 0 30 31" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_1743_3370)">
                                        <path d="M15 0.5C12.0333 0.5 9.13319 1.37973 6.66645 3.02796C4.19972 4.67618 2.27713 7.01886 1.14181 9.75975C0.00649929 12.5006 -0.290551 15.5166 0.288228 18.4264C0.867006 21.3361 2.29562 24.0088 4.3934 26.1066C6.49119 28.2044 9.16394 29.633 12.0737 30.2118C14.9834 30.7906 17.9994 30.4935 20.7403 29.3582C23.4811 28.2229 25.8238 26.3003 27.472 23.8336C29.1203 21.3668 30 18.4667 30 15.5C29.9957 11.5231 28.414 7.71026 25.6019 4.89815C22.7897 2.08604 18.9769 0.504301 15 0.5ZM19.0275 9.25H10.9725C12.0335 7.15534 13.3898 5.22395 15 3.515C16.6108 5.22347 17.9672 7.15495 19.0275 9.25ZM20.0275 11.75C20.4117 12.9633 20.6122 14.2273 20.6225 15.5C20.6122 16.7727 20.4117 18.0367 20.0275 19.25H9.97001C9.58582 18.0367 9.38527 16.7727 9.37501 15.5C9.38527 14.2273 9.58582 12.9633 9.97001 11.75H20.0275ZM11.75 3.445C10.3096 5.20723 9.12074 7.16087 8.21751 9.25H4.19126C5.84858 6.39554 8.56458 4.30969 11.75 3.445ZM2.50001 15.5C2.49989 14.2279 2.69422 12.9633 3.07626 11.75H7.37501C7.05095 12.9739 6.88296 14.2339 6.87501 15.5C6.88296 16.7661 7.05095 18.0261 7.37501 19.25H3.07626C2.69422 18.0367 2.49989 16.7721 2.50001 15.5ZM4.19126 21.75H8.21751C9.12074 23.8391 10.3096 25.7928 11.75 27.555C8.56458 26.6903 5.84858 24.6045 4.19126 21.75ZM10.9725 21.75H19.0275C17.9666 23.8447 16.6102 25.7761 15 27.485C13.3892 25.7765 12.0328 23.8451 10.9725 21.75ZM18.2563 27.555C19.6945 25.7924 20.8812 23.8388 21.7825 21.75H25.8088C24.1529 24.6032 21.4394 26.6888 18.2563 27.555ZM27.5 15.5C27.5001 16.7721 27.3058 18.0367 26.9238 19.25H22.625C22.9491 18.0261 23.1171 16.7661 23.125 15.5C23.1171 14.2339 22.9491 12.9739 22.625 11.75H26.9213C27.3041 12.9632 27.4993 14.2278 27.5 15.5ZM21.7825 9.25C20.8812 7.16123 19.6945 5.20761 18.2563 3.445C21.4394 4.31116 24.1529 6.39684 25.8088 9.25H21.7825Z"
                                              fill="#F5F5F5"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1743_3370">
                                            <rect width="30" height="30" fill="white"
                                                  transform="translate(0 0.5)"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </a>
                            <ul class="dropdown-menu lang-dropdown mt-3" aria-labelledby="navbarDropdown">
                                <li>
                                    <a :class="['dropdown-item', { active: locale === 'arm' }]"
                                       @click.prevent="changeLocale('arm')" class="dropdown-item" href="#">
                                        <img class="me-1" src="/assets/icons/navbar/lang/arm.svg" alt="arm">
                                        Հայերեն</a>
                                </li>
                                <li><a :class="['dropdown-item', { active: locale === 'en' }]"
                                       @click.prevent="changeLocale('en')" class="dropdown-item" href="#">
                                    <img class="me-1" src="/assets/icons/navbar/lang/en.svg" alt="en">
                                    English</a></li>
                                <li><a :class="['dropdown-item', { active: locale === 'ru' }]"
                                       @click.prevent="changeLocale('ru')" class="dropdown-item" href="#">
                                    <img class="me-1" src="/assets/icons/navbar/lang/ru.svg" alt="ru">
                                    Русский</a></li>
                            </ul>
                        </li>
                        <li v-if="auth.isAuthenticated" class="user-info-nav nav-item dropdown position-relative">
                            <a class="nav-link" href="#" id="navbarDropdownUserInfo" role="button"
                               data-bs-toggle="dropdown" aria-expanded="false"
                            >
                                <div class="auth-user-img">
                                    <img :src="userImage" alt="User image" @error="handleImageError"/>
                                </div>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end user-info-dropdown mt-3"
                                aria-labelledby="navbarDropdownUserInfo">
                                <li class="d-flex w-100 gap-2 auth-user-nav-li align-items-center">
                                    <div class="auth-user-img">
                                        <img :src="userImage" alt="User image" @error="handleImageError"/>
                                    </div>
                                    <div class="auth-user-detail d-flex flex-column justify-content-center">
                                        <span class="auth-user-name">{{ userName }}</span>
                                        <p class="auth-user-email mb-0">{{ userEmail }}</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="navbar-line w-100"></div>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/instructor/my-courses"
                                                 :class="{ active: $route.path === '/instructor/my-courses' }"
                                                 class="text-capitalize auth-user-nav-li-item">My courses
                                    </router-link>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/instructor/add-courses"
                                                 :class="{ active: $route.path === '/instructor/add-courses' }"
                                                 class="text-capitalize auth-user-nav-li-item">Add a course
                                    </router-link>
                                </li>
                                <li>
                                    <div class="navbar-line w-100"></div>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/instructor/settings"
                                                 :class="{ active: $route.path === '/instructor/settings' }"
                                                 class="text-capitalize auth-user-nav-li-item">Account Settings
                                    </router-link>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/instructor/wallet"
                                                 :class="{ active: $route.path === '/instructor/wallet' }"
                                                 class="text-capitalize auth-user-nav-li-item">Wallet
                                    </router-link>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/instructor/purchase-history"
                                                 :class="{ active: $route.path === '/instructor/purchase-history' }"
                                                 class="text-capitalize auth-user-nav-li-item">Purchase History
                                    </router-link>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/instructor/how-we-can-help"
                                                 :class="{ active: $route.path === '/instructor/how-we-can-help' }"
                                                 class="text-capitalize auth-user-nav-li-item">Help & Support
                                    </router-link>
                                </li>
                                <li class="auth-user-nav-li">
                                    <a
                                            href="#"
                                            class="text-capitalize auth-user-nav-li-item item-logout"
                                            @click.prevent="logout"
                                    >Log Out</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
            <nav v-if="auth.isAuthenticated" class="navbar d-flex justify-content-between">
                <div @click="openNavbar" class="open-navbar-icon cursor-pointer d-none">
                    <img src="/assets/icons/navbar/open.svg" alt="open" class="cursor-pointer">
                </div>
                <div class="logo-section d-flex align-items-center">
                    <router-link class="navbar-brand" to="/">
                        <div class="logo-container">
                            <img src="/assets/images/logo/logo.svg" alt="Logo" class="img-fluid">
                        </div>
                    </router-link>
                </div>
                <div v-if="auth.isAuthenticated && isInstructor"
                     class="dropdown open-notification-icon cursor-pointer d-block d-md-none mobile-notification">
                    <a
                            class="nav-link"
                            href="#"
                            id="navbarDropdownNotification"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                    >
                        <svg width="26" height="28" viewBox="0 0 26 28" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M25.1975 18.725L22.3809 8.18262C21.7794 5.92747 20.4688 3.94603 18.6578 2.55367C16.8467 1.16131 14.6392 0.438039 12.3865 0.498968C10.1339 0.559898 7.96565 1.40153 6.22682 2.88991C4.488 4.37829 3.27854 6.42789 2.79094 8.7125L0.612358 18.8937C0.506942 19.387 0.509513 19.8985 0.619882 20.3906C0.730251 20.8827 0.945602 21.3427 1.25005 21.7369C1.55449 22.131 1.94026 22.4491 2.37889 22.6677C2.81752 22.8863 3.29782 22.9999 3.78436 23H7.69194C7.94058 24.2716 8.6049 25.4148 9.57233 26.2359C10.5398 27.0571 11.7508 27.5056 13.0003 27.5056C14.2497 27.5056 15.4608 27.0571 16.4282 26.2359C17.3957 25.4148 18.06 24.2716 18.3086 23H22.0678C22.5684 22.9998 23.0622 22.8794 23.5107 22.6484C23.9591 22.4174 24.3501 22.0818 24.6532 21.6681C24.9562 21.2543 25.1631 20.7733 25.2577 20.2628C25.3523 19.7523 25.331 19.226 25.1975 18.725ZM13.0003 25.25C12.3305 25.2471 11.6779 25.0294 11.1319 24.6266C10.5858 24.2239 10.1729 23.6558 9.94961 23H16.0509C15.8277 23.6558 15.4148 24.2239 14.8687 24.6266C14.3226 25.0294 13.6701 25.2471 13.0003 25.25ZM22.929 20.3056C22.828 20.4448 22.6969 20.5574 22.5465 20.6346C22.396 20.7117 22.2302 20.7513 22.0624 20.75H3.78436C3.62214 20.75 3.462 20.7121 3.31576 20.6392C3.16952 20.5663 3.0409 20.4603 2.93942 20.3288C2.83793 20.1974 2.76615 20.044 2.72939 19.8799C2.69263 19.7159 2.69182 19.5453 2.72702 19.3809L4.90561 9.19962C5.28949 7.40661 6.23952 5.7983 7.60469 4.63038C8.96985 3.46245 10.6718 2.80194 12.4399 2.75384C14.2081 2.70574 15.941 3.27281 17.3632 4.3649C18.7854 5.457 19.8152 7.01144 20.2889 8.78112L23.1056 19.3235C23.1516 19.4902 23.1596 19.6657 23.1289 19.8362C23.0983 20.0067 23.0298 20.1674 22.929 20.3056Z"
                                  fill="#F5F5F5"/>
                        </svg>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                              v-if="loading">...</span>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                              v-else-if="unreadCount > 0">{{ unreadCount }}</span>
                    </a>

                    <ul
                            class="dropdown-menu dropdown-menu-end notification-info-dropdown mt-3 position-absolute"
                            aria-labelledby="navbarDropdownNotification"
                    >
                        <li v-if="loading" class="d-flex align-items-center justify-content-center p-3">
                            <div class="spinner-border text-secondary" role="status">
                                <span class="visually-hidden">{{ $t('loading') }}...</span>
                            </div>
                        </li>

                        <li v-else v-for="notification in notifications" :key="notification.id"
                            class="notification-nav-li d-flex align-items-center justify-content-between gap-4 cursor-pointer"
                            @click.stop="markAsRead(notification)">
                            <div>
                                <p class="mb-0 notification-text">
                                    {{ notification.data.message }}
                                    <span class="notification-hour">{{ timeAgo(notification.created_at) }}</span>
                                </p>
                            </div>
                            <div v-if="!notification.read_at" class="round-notify-icon"></div>
                        </li>
                        <li v-if="!loading && notifications.length === 0" class="p-3 text-center text-muted">
                            {{ $t('no_notification') }}
                        </li>
                    </ul>
                </div>
                <div v-if="auth.isAuthenticated && isLearner"
                     class="dropdown open-notification-icon cursor-pointer d-block d-md-none mobile-notification">

                    <a
                            class="nav-link"
                            href="#"
                            id="navbarDropdownNotification"
                            role="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                    >
                        <svg width="26" height="28" viewBox="0 0 26 28" fill="none"
                             xmlns="http://www.w3.org/2000/svg">
                            <path d="M25.1975 18.725L22.3809 8.18262C21.7794 5.92747 20.4688 3.94603 18.6578 2.55367C16.8467 1.16131 14.6392 0.438039 12.3865 0.498968C10.1339 0.559898 7.96565 1.40153 6.22682 2.88991C4.488 4.37829 3.27854 6.42789 2.79094 8.7125L0.612358 18.8937C0.506942 19.387 0.509513 19.8985 0.619882 20.3906C0.730251 20.8827 0.945602 21.3427 1.25005 21.7369C1.55449 22.131 1.94026 22.4491 2.37889 22.6677C2.81752 22.8863 3.29782 22.9999 3.78436 23H7.69194C7.94058 24.2716 8.6049 25.4148 9.57233 26.2359C10.5398 27.0571 11.7508 27.5056 13.0003 27.5056C14.2497 27.5056 15.4608 27.0571 16.4282 26.2359C17.3957 25.4148 18.06 24.2716 18.3086 23H22.0678C22.5684 22.9998 23.0622 22.8794 23.5107 22.6484C23.9591 22.4174 24.3501 22.0818 24.6532 21.6681C24.9562 21.2543 25.1631 20.7733 25.2577 20.2628C25.3523 19.7523 25.331 19.226 25.1975 18.725ZM13.0003 25.25C12.3305 25.2471 11.6779 25.0294 11.1319 24.6266C10.5858 24.2239 10.1729 23.6558 9.94961 23H16.0509C15.8277 23.6558 15.4148 24.2239 14.8687 24.6266C14.3226 25.0294 13.6701 25.2471 13.0003 25.25ZM22.929 20.3056C22.828 20.4448 22.6969 20.5574 22.5465 20.6346C22.396 20.7117 22.2302 20.7513 22.0624 20.75H3.78436C3.62214 20.75 3.462 20.7121 3.31576 20.6392C3.16952 20.5663 3.0409 20.4603 2.93942 20.3288C2.83793 20.1974 2.76615 20.044 2.72939 19.8799C2.69263 19.7159 2.69182 19.5453 2.72702 19.3809L4.90561 9.19962C5.28949 7.40661 6.23952 5.7983 7.60469 4.63038C8.96985 3.46245 10.6718 2.80194 12.4399 2.75384C14.2081 2.70574 15.941 3.27281 17.3632 4.3649C18.7854 5.457 19.8152 7.01144 20.2889 8.78112L23.1056 19.3235C23.1516 19.4902 23.1596 19.6657 23.1289 19.8362C23.0983 20.0067 23.0298 20.1674 22.929 20.3056Z"
                                  fill="#F5F5F5"/>
                        </svg>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                              v-if="loading">...</span>
                        <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                              v-else-if="unreadCount > 0">{{ unreadCount }}</span>
                    </a>

                    <ul
                            class="dropdown-menu dropdown-menu-end notification-info-dropdown mt-3 position-absolute"
                            aria-labelledby="navbarDropdownNotification"
                    >
                        <li v-if="loading" class="d-flex align-items-center justify-content-center p-3">
                            <div class="spinner-border text-secondary" role="status">
                                <span class="visually-hidden">{{ $t('loading') }}...</span>
                            </div>
                        </li>

                        <li v-else v-for="notification in notifications" :key="notification.id"
                            class="notification-nav-li d-flex align-items-center justify-content-between gap-4 cursor-pointer"
                            @click.stop="markAsRead(notification)">
                            <div>
                                <p class="mb-0 notification-text">
                                    {{ notification.data.message }}
                                    <span class="notification-hour">{{ timeAgo(notification.created_at) }}</span>
                                </p>
                            </div>
                            <div v-if="!notification.read_at" class="round-notify-icon"></div>
                        </li>
                        <li v-if="!loading && notifications.length === 0" class="p-3 text-center text-muted">
                            {{ $t('no_notification') }}
                        </li>

                        <!--                        <li class="notification-nav-li d-flex align-items-center justify-content-between gap-4">-->
                        <!--                            <div class="auth-user-img">-->
                        <!--                                <img src="/assets/images/team/team-member-2.png" alt="Sam Li">-->
                        <!--                            </div>-->
                        <!--                            <div>-->
                        <!--                                <p class="mb-0 notification-text">-->
                        <!--                                    Sam Li sent you a message. <span class="notification-hour">1h</span>-->
                        <!--                                </p>-->
                        <!--                            </div>-->
                        <!--                            <div class="round-notify-icon"></div>-->
                        <!--                        </li>-->
                        <!--                        <li class="notification-nav-li d-flex align-items-center justify-content-between gap-4">-->
                        <!--                            <div class="auth-user-img">-->
                        <!--                                <img src="/assets/images/team/team-member-2.png" alt="Sam Li">-->
                        <!--                            </div>-->
                        <!--                            <div>-->
                        <!--                                <p class="mb-0 notification-text">-->
                        <!--                                    Sam Li sent you a message. <span class="notification-hour">1h</span>-->
                        <!--                                </p>-->
                        <!--                            </div>-->
                        <!--                            <div class="round-notify-icon"></div>-->
                        <!--                        </li>-->
                        <!--                        <li class="notification-nav-li d-flex align-items-center justify-content-between gap-4">-->
                        <!--                            <div class="auth-user-img">-->
                        <!--                                <img src="/assets/images/team/team-member-2.png" alt="Sam Li">-->
                        <!--                            </div>-->
                        <!--                            <div>-->
                        <!--                                <p class="mb-0 notification-text">-->
                        <!--                                    Sam Li sent you a message. <span class="notification-hour">1h</span>-->
                        <!--                                </p>-->
                        <!--                            </div>-->
                        <!--                            <div class="round-notify-icon"></div>-->
                        <!--                        </li>-->
                        <!--                        <li class="notification-nav-li d-flex align-items-center justify-content-between gap-4">-->
                        <!--                            <div class="auth-user-img">-->
                        <!--                                <img src="/assets/images/team/team-member-2.png" alt="Sam Li">-->
                        <!--                            </div>-->
                        <!--                            <div>-->
                        <!--                                <p class="mb-0 notification-text">-->
                        <!--                                    Sam Li sent you a message. <span class="notification-hour">1h</span>-->
                        <!--                                </p>-->
                        <!--                            </div>-->
                        <!--                            <div class="round-notify-icon"></div>-->
                        <!--                        </li>-->
                        <!--                        <li class="notification-nav-li d-flex align-items-center justify-content-between gap-4">-->
                        <!--                            <div class="auth-user-img">-->
                        <!--                                <img src="/assets/images/team/team-member-2.png" alt="Sam Li">-->
                        <!--                            </div>-->
                        <!--                            <div>-->
                        <!--                                <p class="mb-0 notification-text">-->
                        <!--                                    Sam Li sent you a message. <span class="notification-hour">1h</span>-->
                        <!--                                </p>-->
                        <!--                            </div>-->
                        <!--                            <div class="round-notify-icon"></div>-->
                        <!--                        </li>-->
                        <!--                        <li class="notification-nav-li d-flex align-items-center justify-content-between gap-4">-->
                        <!--                            <div class="auth-user-img">-->
                        <!--                                <img src="/assets/images/team/team-member-2.png" alt="Sam Li">-->
                        <!--                            </div>-->
                        <!--                            <div>-->
                        <!--                                <p class="mb-0 notification-text">-->
                        <!--                                    Sam Li sent you a message. <span class="notification-hour">1h</span>-->
                        <!--                                </p>-->
                        <!--                            </div>-->
                        <!--                            <div class="round-notify-icon"></div>-->
                        <!--                        </li>-->
                        <!--                        <li class="notification-nav-li d-flex align-items-center justify-content-between gap-4">-->
                        <!--                            <div class="auth-user-img">-->
                        <!--                                <img src="/assets/images/team/team-member-2.png" alt="Sam Li">-->
                        <!--                            </div>-->
                        <!--                            <div>-->
                        <!--                                <p class="mb-0 notification-text">-->
                        <!--                                    Sam Li sent you a message. <span class="notification-hour">1h</span>-->
                        <!--                                </p>-->
                        <!--                            </div>-->
                        <!--                            <div class="round-notify-icon"></div>-->
                        <!--                        </li>-->
                    </ul>
                </div>
                <ul class="list-unstyled menu-list d-flex justify-content-between align-items-center p-0 m-0">
                    <li class="nav-item">
                        <router-link to="/" class="nav-link" :class="{ active: $route.path === '/' }">{{ $t('home') }}
                        </router-link>
                    </li>
                    <li class="nav-item dropdown" @click="toggleDropdown('about')">
                        <a class="nav-link" href="#" id="navbarDropdownMenuLink" aria-haspopup="true"
                           aria-expanded="false">
                            {{ $t('about_us') }}
                            <svg width="24" height="23" viewBox="0 0 24 23" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.4305 7.86792C18.3414 7.77809 18.2354 7.7068 18.1187 7.65814C18.0019 7.60949 17.8766 7.58444 17.7501 7.58444C17.6236 7.58444 17.4983 7.60949 17.3816 7.65814C17.2648 7.7068 17.1588 7.77809 17.0697 7.86792L12.6805 12.2571C12.5914 12.3469 12.4854 12.4182 12.3687 12.4669C12.2519 12.5155 12.1266 12.5406 12.0001 12.5406C11.8736 12.5406 11.7483 12.5155 11.6316 12.4669C11.5148 12.4182 11.4088 12.3469 11.3197 12.2571L6.93053 7.86792C6.84144 7.77809 6.73544 7.7068 6.61866 7.65814C6.50188 7.60949 6.37662 7.58444 6.25011 7.58444C6.1236 7.58444 5.99834 7.60949 5.88156 7.65814C5.76477 7.7068 5.65878 7.77809 5.56969 7.86792C5.3912 8.04747 5.29102 8.29036 5.29102 8.54354C5.29102 8.79672 5.3912 9.03961 5.56969 9.21917L9.96844 13.6179C10.5075 14.1563 11.2382 14.4587 12.0001 14.4587C12.762 14.4587 13.4927 14.1563 14.0318 13.6179L18.4305 9.21917C18.609 9.03961 18.7092 8.79672 18.7092 8.54354C18.7092 8.29036 18.609 8.04747 18.4305 7.86792Z"
                                      fill="#F5F5F5"/>
                            </svg>
                        </a>
                        <div class="dropdown-menu" :class="{ show: dropdowns.about }">
                            <router-link :class="{ active: $route.path === '/about' }" to="/about"
                                         class="dropdown-item text-capitalize">{{ $t('about_us') }}
                            </router-link>
                            <router-link :class="{ active: $route.path === '/why-choose-us' }" to="/why-choose-us"
                                         class="dropdown-item text-capitalize">{{ $t('why_choose_us') }}
                            </router-link>
                            <router-link :class="{ active: $route.path === '/contact' }" to="/contact"
                                         class="dropdown-item text-capitalize">{{ $t('contact_us') }}
                            </router-link>
                            <router-link :class="{ active: $route.path === '/blog' }" to="/blog"
                                         class="dropdown-item text-capitalize">{{ $t('blog') }}
                            </router-link>
                        </div>
                    </li>

                    <li class="nav-item dropdown" @click="toggleDropdown('courses')">
                        <a class="nav-link" href="#" id="navbarDropdownMenuLink" aria-haspopup="true"
                           aria-expanded="false">
                            {{ $t('courses') }}
                            <svg width="24" height="23" viewBox="0 0 24 23" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M18.4305 7.86792C18.3414 7.77809 18.2354 7.7068 18.1187 7.65814C18.0019 7.60949 17.8766 7.58444 17.7501 7.58444C17.6236 7.58444 17.4983 7.60949 17.3816 7.65814C17.2648 7.7068 17.1588 7.77809 17.0697 7.86792L12.6805 12.2571C12.5914 12.3469 12.4854 12.4182 12.3687 12.4669C12.2519 12.5155 12.1266 12.5406 12.0001 12.5406C11.8736 12.5406 11.7483 12.5155 11.6316 12.4669C11.5148 12.4182 11.4088 12.3469 11.3197 12.2571L6.93053 7.86792C6.84144 7.77809 6.73544 7.7068 6.61866 7.65814C6.50188 7.60949 6.37662 7.58444 6.25011 7.58444C6.1236 7.58444 5.99834 7.60949 5.88156 7.65814C5.76477 7.7068 5.65878 7.77809 5.56969 7.86792C5.3912 8.04747 5.29102 8.29036 5.29102 8.54354C5.29102 8.79672 5.3912 9.03961 5.56969 9.21917L9.96844 13.6179C10.5075 14.1563 11.2382 14.4587 12.0001 14.4587C12.762 14.4587 13.4927 14.1563 14.0318 13.6179L18.4305 9.21917C18.609 9.03961 18.7092 8.79672 18.7092 8.54354C18.7092 8.29036 18.609 8.04747 18.4305 7.86792Z"
                                      fill="#F5F5F5"/>
                            </svg>
                        </a>
                        <div class="dropdown-menu" :class="{ show: dropdowns.courses }">
                            <router-link :class="{ active: $route.path === '/courses' }" to="/courses"
                                         class="dropdown-item text-capitalize">{{ $t('courses') }}
                            </router-link>

                            <router-link
                                    v-for="course in topViewedCourses"
                                    :key="course.id"
                                    :to="`/single-course/${course.id}`"
                                    class="dropdown-item text-capitalize"
                            >
                                {{ getLocalizedField(course, 'title') }}
                            </router-link>
                        </div>
                    </li>
                    <li class="nav-item">
                        <router-link to="/teach-on-trainUp" class="nav-link"
                                     :class="{ active: $route.path === '/teach-on-trainUp' }">{{
                            $t('teach_on_trainUp')
                            }}
                        </router-link>
                    </li>
                </ul>
                <div class="navbar-auth-btn-block d-flex align-items-center">
                    <div v-if="!auth.isAuthenticated && !isSignInPage" class="auth-btn-div">
                        <RouterLink to="/sign-in" custom v-slot="{ navigate }">
                            <button @click="navigate" class="auth-btn">
                                {{ $t('sign_in') }}
                            </button>
                        </RouterLink>
                    </div>

                    <div v-if="!auth.isAuthenticated && !isSignUpPage && !isVerifyPage" class="auth-btn-div">
                        <RouterLink to="/sign-up" custom v-slot="{ navigate }">
                            <button @click="navigate" class="auth-btn">
                                {{ $t('sign_up') }}
                            </button>
                        </RouterLink>
                    </div>

                    <ul class="m-0 p-0 list-unstyled d-flex align-items-center justify-content-center">
                        <li v-if="auth.isAuthenticated && isLearner"
                            class="nav-item dropdown position-relative notification-block-nav">
                            <router-link to="/learner/shopping-cart"
                                         :class="{ active: $route.path === '/learner/shopping-cart' }" class="nav-link"
                                         href="#" id="navbarDropdownNotification" role="button">
                                <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_986_6224)">
                                        <path d="M24.6057 4.41675C24.301 4.05106 23.9195 3.75695 23.4883 3.5553C23.0571 3.35365 22.5868 3.24942 22.1108 3.25H4.5955L4.55 2.86975C4.45689 2.07937 4.077 1.35063 3.48236 0.821684C2.88773 0.292742 2.11968 0.000370276 1.32383 0L1.08333 0C0.796015 0 0.520465 0.114137 0.317301 0.317301C0.114137 0.520465 0 0.796016 0 1.08333C0 1.37065 0.114137 1.6462 0.317301 1.84937C0.520465 2.05253 0.796015 2.16667 1.08333 2.16667H1.32383C1.58918 2.1667 1.84528 2.26412 2.04357 2.44044C2.24186 2.61676 2.36854 2.85973 2.39958 3.12325L3.89025 15.7983C4.04501 17.1164 4.67835 18.3319 5.67007 19.214C6.66178 20.0961 7.94284 20.5834 9.27008 20.5833H20.5833C20.8706 20.5833 21.1462 20.4692 21.3494 20.266C21.5525 20.0629 21.6667 19.7873 21.6667 19.5C21.6667 19.2127 21.5525 18.9371 21.3494 18.734C21.1462 18.5308 20.8706 18.4167 20.5833 18.4167H9.27008C8.59956 18.4148 7.94603 18.2056 7.3991 17.8177C6.85216 17.4298 6.43859 16.8822 6.21508 16.25H19.1284C20.3984 16.2501 21.628 15.8039 22.6025 14.9895C23.5769 14.175 24.2342 13.0441 24.4595 11.7943L25.3099 7.07742C25.3948 6.60943 25.3757 6.12849 25.254 5.66869C25.1323 5.20889 24.911 4.78148 24.6057 4.41675ZM23.1833 6.69283L22.3318 11.4097C22.1966 12.1604 21.8015 12.8397 21.2158 13.3285C20.6302 13.8173 19.8913 14.0845 19.1284 14.0833H5.87058L4.85117 5.41667H22.1108C22.27 5.41572 22.4274 5.44984 22.5718 5.51661C22.7163 5.58338 22.8443 5.68116 22.9466 5.80299C23.049 5.92482 23.1233 6.06772 23.1642 6.22152C23.2051 6.37531 23.2117 6.53623 23.1833 6.69283Z"
                                              fill="#F5F5F5"/>
                                        <path d="M7.58073 26C8.77735 26 9.7474 25.0299 9.7474 23.8333C9.7474 22.6367 8.77735 21.6667 7.58073 21.6667C6.38411 21.6667 5.41406 22.6367 5.41406 23.8333C5.41406 25.0299 6.38411 26 7.58073 26Z"
                                              fill="#F5F5F5"/>
                                        <path d="M18.4167 26C19.6133 26 20.5833 25.0299 20.5833 23.8333C20.5833 22.6367 19.6133 21.6667 18.4167 21.6667C17.22 21.6667 16.25 22.6367 16.25 23.8333C16.25 25.0299 17.22 26 18.4167 26Z"
                                              fill="#F5F5F5"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_986_6224">
                                            <rect width="26" height="26" fill="white"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                      v-if="cartCount > 0">
                                      {{ cartCount }}
                                </span>
                            </router-link>
                        </li>
                        <li v-if="auth.isAuthenticated && isLearner"
                            class="nav-item dropdown position-relative notification-block-nav">
                            <router-link to="/learner/wishlist" :class="{ active: $route.path === '/learner/wishlist' }"
                                         class="nav-link" href="#" id="navbarDropdownNotification" role="button">
                                <svg width="26" height="26" viewBox="0 0 26 26" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_986_6228)">
                                        <path d="M18.9558 0.993416C17.7359 1.01239 16.5426 1.35292 15.4964 1.98063C14.4503 2.60833 13.5882 3.50097 12.9974 4.56842C12.4066 3.50097 11.5446 2.60833 10.4984 1.98063C9.45227 1.35292 8.25899 1.01239 7.0391 0.993416C5.09445 1.07791 3.26228 1.92861 1.94286 3.35967C0.623447 4.79073 -0.0759644 6.68582 -0.00256797 8.63092C-0.00256797 15.9705 11.8664 24.4476 12.3713 24.8073L12.9974 25.2503L13.6236 24.8073C14.1284 24.4498 25.9974 15.9705 25.9974 8.63092C26.0708 6.68582 25.3714 4.79073 24.052 3.35967C22.7326 1.92861 20.9004 1.07791 18.9558 0.993416ZM12.9974 22.5832C9.47335 19.9507 2.1641 13.4832 2.1641 8.63092C2.09004 7.26019 2.561 5.91579 3.47424 4.89092C4.38749 3.86606 5.66894 3.24388 7.0391 3.16008C8.40926 3.24388 9.69071 3.86606 10.604 4.89092C11.5172 5.91579 11.9882 7.26019 11.9141 8.63092H14.0808C14.0067 7.26019 14.4777 5.91579 15.3909 4.89092C16.3042 3.86606 17.5856 3.24388 18.9558 3.16008C20.3259 3.24388 21.6074 3.86606 22.5206 4.89092C23.4339 5.91579 23.9048 7.26019 23.8308 8.63092C23.8308 13.4853 16.5215 19.9507 12.9974 22.5832Z"
                                              fill="#F5F5F5"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_986_6228">
                                            <rect width="26" height="26" fill="white"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                      v-if="wishlistLoading">
                                    ...
                                </span>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                      v-else-if="wishlistCount > 0">
                                  {{ wishlistCount }}
                                 </span>
                            </router-link>
                        </li>
                        <li v-if="auth.isAuthenticated && isInstructor"
                            class="notification-block-nav nav-item dropdown position-relative">
                            <a class="nav-link" href="#" id="navbarDropdownNotification" role="button"
                               data-bs-toggle="dropdown" aria-expanded="false"
                            >
                                <svg width="26" height="28" viewBox="0 0 26 28" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M25.1975 18.725L22.3809 8.18262C21.7794 5.92747 20.4688 3.94603 18.6578 2.55367C16.8467 1.16131 14.6392 0.438039 12.3865 0.498968C10.1339 0.559898 7.96565 1.40153 6.22682 2.88991C4.488 4.37829 3.27854 6.42789 2.79094 8.7125L0.612358 18.8937C0.506942 19.387 0.509513 19.8985 0.619882 20.3906C0.730251 20.8827 0.945602 21.3427 1.25005 21.7369C1.55449 22.131 1.94026 22.4491 2.37889 22.6677C2.81752 22.8863 3.29782 22.9999 3.78436 23H7.69194C7.94058 24.2716 8.6049 25.4148 9.57233 26.2359C10.5398 27.0571 11.7508 27.5056 13.0003 27.5056C14.2497 27.5056 15.4608 27.0571 16.4282 26.2359C17.3957 25.4148 18.06 24.2716 18.3086 23H22.0678C22.5684 22.9998 23.0622 22.8794 23.5107 22.6484C23.9591 22.4174 24.3501 22.0818 24.6532 21.6681C24.9562 21.2543 25.1631 20.7733 25.2577 20.2628C25.3523 19.7523 25.331 19.226 25.1975 18.725ZM13.0003 25.25C12.3305 25.2471 11.6779 25.0294 11.1319 24.6266C10.5858 24.2239 10.1729 23.6558 9.94961 23H16.0509C15.8277 23.6558 15.4148 24.2239 14.8687 24.6266C14.3226 25.0294 13.6701 25.2471 13.0003 25.25ZM22.929 20.3056C22.828 20.4448 22.6969 20.5574 22.5465 20.6346C22.396 20.7117 22.2302 20.7513 22.0624 20.75H3.78436C3.62214 20.75 3.462 20.7121 3.31576 20.6392C3.16952 20.5663 3.0409 20.4603 2.93942 20.3288C2.83793 20.1974 2.76615 20.044 2.72939 19.8799C2.69263 19.7159 2.69182 19.5453 2.72702 19.3809L4.90561 9.19962C5.28949 7.40661 6.23952 5.7983 7.60469 4.63038C8.96985 3.46245 10.6718 2.80194 12.4399 2.75384C14.2081 2.70574 15.941 3.27281 17.3632 4.3649C18.7854 5.457 19.8152 7.01144 20.2889 8.78112L23.1056 19.3235C23.1516 19.4902 23.1596 19.6657 23.1289 19.8362C23.0983 20.0067 23.0298 20.1674 22.929 20.3056Z"
                                          fill="#F5F5F5"/>
                                </svg>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                      v-if="loading">...</span>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                      v-else-if="unreadCount > 0">{{ unreadCount }}</span>
                            </a>

                            <ul class="dropdown-menu dropdown-menu-end notification-info-dropdown mt-3 notification-web"
                                aria-labelledby="navbarDropdownNotification">

                                <li v-if="loading" class="d-flex align-items-center justify-content-center p-3">
                                    <div class="spinner-border text-secondary" role="status">
                                        <span class="visually-hidden">{{ $t('loading') }}...</span>
                                    </div>
                                </li>

                                <li v-else v-for="notification in notifications" :key="notification.id"
                                    class="notification-nav-li d-flex align-items-center justify-content-between gap-4 cursor-pointer"
                                    @click.stop="markAsRead(notification)">
                                    <div>
                                        <p class="mb-0 notification-text">
                                            {{ notification.data.message }}
                                            <span class="notification-hour">{{
                                                timeAgo(notification.created_at)
                                                }}</span>
                                        </p>
                                    </div>
                                    <div v-if="!notification.read_at" class="round-notify-icon"></div>
                                </li>
                                <li v-if="!loading && notifications.length === 0" class="p-3 text-center text-muted">
                                    {{ $t('no_notification') }}
                                </li>
                            </ul>
                        </li>
                        <li v-if="auth.isAuthenticated && isLearner"
                            class="notification-block-nav nav-item dropdown position-relative">
                            <a class="nav-link" href="#" id="navbarDropdownNotification" role="button"
                               data-bs-toggle="dropdown" aria-expanded="false"
                            >
                                <svg width="26" height="28" viewBox="0 0 26 28" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <path d="M25.1975 18.725L22.3809 8.18262C21.7794 5.92747 20.4688 3.94603 18.6578 2.55367C16.8467 1.16131 14.6392 0.438039 12.3865 0.498968C10.1339 0.559898 7.96565 1.40153 6.22682 2.88991C4.488 4.37829 3.27854 6.42789 2.79094 8.7125L0.612358 18.8937C0.506942 19.387 0.509513 19.8985 0.619882 20.3906C0.730251 20.8827 0.945602 21.3427 1.25005 21.7369C1.55449 22.131 1.94026 22.4491 2.37889 22.6677C2.81752 22.8863 3.29782 22.9999 3.78436 23H7.69194C7.94058 24.2716 8.6049 25.4148 9.57233 26.2359C10.5398 27.0571 11.7508 27.5056 13.0003 27.5056C14.2497 27.5056 15.4608 27.0571 16.4282 26.2359C17.3957 25.4148 18.06 24.2716 18.3086 23H22.0678C22.5684 22.9998 23.0622 22.8794 23.5107 22.6484C23.9591 22.4174 24.3501 22.0818 24.6532 21.6681C24.9562 21.2543 25.1631 20.7733 25.2577 20.2628C25.3523 19.7523 25.331 19.226 25.1975 18.725ZM13.0003 25.25C12.3305 25.2471 11.6779 25.0294 11.1319 24.6266C10.5858 24.2239 10.1729 23.6558 9.94961 23H16.0509C15.8277 23.6558 15.4148 24.2239 14.8687 24.6266C14.3226 25.0294 13.6701 25.2471 13.0003 25.25ZM22.929 20.3056C22.828 20.4448 22.6969 20.5574 22.5465 20.6346C22.396 20.7117 22.2302 20.7513 22.0624 20.75H3.78436C3.62214 20.75 3.462 20.7121 3.31576 20.6392C3.16952 20.5663 3.0409 20.4603 2.93942 20.3288C2.83793 20.1974 2.76615 20.044 2.72939 19.8799C2.69263 19.7159 2.69182 19.5453 2.72702 19.3809L4.90561 9.19962C5.28949 7.40661 6.23952 5.7983 7.60469 4.63038C8.96985 3.46245 10.6718 2.80194 12.4399 2.75384C14.2081 2.70574 15.941 3.27281 17.3632 4.3649C18.7854 5.457 19.8152 7.01144 20.2889 8.78112L23.1056 19.3235C23.1516 19.4902 23.1596 19.6657 23.1289 19.8362C23.0983 20.0067 23.0298 20.1674 22.929 20.3056Z"
                                          fill="#F5F5F5"/>
                                </svg>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                      v-if="loading">...</span>
                                <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
                                      v-else-if="unreadCount > 0">{{ unreadCount }}</span>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end notification-info-dropdown mt-3 notification-web"
                                aria-labelledby="navbarDropdownNotification">

                                <li v-if="loading" class="d-flex align-items-center justify-content-center p-3">
                                    <div class="spinner-border text-secondary" role="status">
                                        <span class="visually-hidden">{{ $t('loading') }}...</span>
                                    </div>
                                </li>

                                <li v-else v-for="notification in notifications" :key="notification.id"
                                    class="notification-nav-li d-flex align-items-center justify-content-between gap-4 cursor-pointer"
                                    @click.stop="markAsRead(notification)">
                                    <div>
                                        <p class="mb-0 notification-text">
                                            {{ notification.data.message }}
                                            <span class="notification-hour">{{
                                                timeAgo(notification.created_at)
                                                }}</span>
                                        </p>
                                    </div>
                                    <div v-if="!notification.read_at" class="round-notify-icon"></div>
                                </li>
                                <li v-if="!loading && notifications.length === 0" class="p-3 text-center text-muted">
                                    {{ $t('no_notification') }}
                                </li>
                            </ul>
                        </li>
                        <li class="lang-change-block nav-item dropdown position-relative">
                            <a class="nav-link" href="#" id="navbarDropdown" role="button"
                               data-bs-toggle="dropdown" aria-expanded="false"
                            >
                                <svg class="lang-icon" width="30" height="31" viewBox="0 0 30 31" fill="none"
                                     xmlns="http://www.w3.org/2000/svg">
                                    <g clip-path="url(#clip0_1743_3370)">
                                        <path d="M15 0.5C12.0333 0.5 9.13319 1.37973 6.66645 3.02796C4.19972 4.67618 2.27713 7.01886 1.14181 9.75975C0.00649929 12.5006 -0.290551 15.5166 0.288228 18.4264C0.867006 21.3361 2.29562 24.0088 4.3934 26.1066C6.49119 28.2044 9.16394 29.633 12.0737 30.2118C14.9834 30.7906 17.9994 30.4935 20.7403 29.3582C23.4811 28.2229 25.8238 26.3003 27.472 23.8336C29.1203 21.3668 30 18.4667 30 15.5C29.9957 11.5231 28.414 7.71026 25.6019 4.89815C22.7897 2.08604 18.9769 0.504301 15 0.5ZM19.0275 9.25H10.9725C12.0335 7.15534 13.3898 5.22395 15 3.515C16.6108 5.22347 17.9672 7.15495 19.0275 9.25ZM20.0275 11.75C20.4117 12.9633 20.6122 14.2273 20.6225 15.5C20.6122 16.7727 20.4117 18.0367 20.0275 19.25H9.97001C9.58582 18.0367 9.38527 16.7727 9.37501 15.5C9.38527 14.2273 9.58582 12.9633 9.97001 11.75H20.0275ZM11.75 3.445C10.3096 5.20723 9.12074 7.16087 8.21751 9.25H4.19126C5.84858 6.39554 8.56458 4.30969 11.75 3.445ZM2.50001 15.5C2.49989 14.2279 2.69422 12.9633 3.07626 11.75H7.37501C7.05095 12.9739 6.88296 14.2339 6.87501 15.5C6.88296 16.7661 7.05095 18.0261 7.37501 19.25H3.07626C2.69422 18.0367 2.49989 16.7721 2.50001 15.5ZM4.19126 21.75H8.21751C9.12074 23.8391 10.3096 25.7928 11.75 27.555C8.56458 26.6903 5.84858 24.6045 4.19126 21.75ZM10.9725 21.75H19.0275C17.9666 23.8447 16.6102 25.7761 15 27.485C13.3892 25.7765 12.0328 23.8451 10.9725 21.75ZM18.2563 27.555C19.6945 25.7924 20.8812 23.8388 21.7825 21.75H25.8088C24.1529 24.6032 21.4394 26.6888 18.2563 27.555ZM27.5 15.5C27.5001 16.7721 27.3058 18.0367 26.9238 19.25H22.625C22.9491 18.0261 23.1171 16.7661 23.125 15.5C23.1171 14.2339 22.9491 12.9739 22.625 11.75H26.9213C27.3041 12.9632 27.4993 14.2278 27.5 15.5ZM21.7825 9.25C20.8812 7.16123 19.6945 5.20761 18.2563 3.445C21.4394 4.31116 24.1529 6.39684 25.8088 9.25H21.7825Z"
                                              fill="#F5F5F5"/>
                                    </g>
                                    <defs>
                                        <clipPath id="clip0_1743_3370">
                                            <rect width="30" height="30" fill="white"
                                                  transform="translate(0 0.5)"/>
                                        </clipPath>
                                    </defs>
                                </svg>
                            </a>
                            <ul class="dropdown-menu lang-dropdown mt-3" aria-labelledby="navbarDropdown">
                                <li>
                                    <a :class="['dropdown-item', { active: locale === 'arm' }]"
                                       @click.prevent="changeLocale('arm')" class="dropdown-item" href="#">
                                        <img class="me-1" src="/assets/icons/navbar/lang/arm.svg" alt="arm">
                                        Հայերեն</a>
                                </li>
                                <li><a :class="['dropdown-item', { active: locale === 'en' }]"
                                       @click.prevent="changeLocale('en')" class="dropdown-item" href="#">
                                    <img class="me-1" src="/assets/icons/navbar/lang/en.svg" alt="en">
                                    English</a></li>
                                <li><a :class="['dropdown-item', { active: locale === 'ru' }]"
                                       @click.prevent="changeLocale('ru')" class="dropdown-item" href="#">
                                    <img class="me-1" src="/assets/icons/navbar/lang/ru.svg" alt="ru">
                                    Русский</a></li>
                            </ul>
                        </li>
                        <li v-if="auth.isAuthenticated && isInstructor"
                            class="user-info-nav nav-item dropdown position-relative">
                            <a class="nav-link" href="#" id="navbarDropdownUserInfo" role="button"
                               data-bs-toggle="dropdown" aria-expanded="false"
                            >
                                <div class="auth-user-img">
                                    <img :src="userImage" alt="User image" @error="handleImageError"/>
                                </div>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end user-info-dropdown mt-3"
                                aria-labelledby="navbarDropdownUserInfo">
                                <li class="d-flex w-100 gap-2 auth-user-nav-li align-items-center">
                                    <div class="auth-user-img">
                                        <img :src="userImage" alt="User image" @error="handleImageError"/>
                                    </div>
                                    <div class="auth-user-detail d-flex flex-column justify-content-center">
                                        <span class="auth-user-name">{{ userName }}</span>
                                        <p class="auth-user-email mb-0">{{ userEmail }}</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="navbar-line w-100"></div>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/instructor/my-courses"
                                                 :class="{ active: $route.path === '/instructor/my-courses' }"
                                                 class="text-capitalize auth-user-nav-li-item">My courses
                                    </router-link>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/instructor/add-courses"
                                                 :class="{ active: $route.path === '/instructor/add-courses' }"
                                                 class="text-capitalize auth-user-nav-li-item">Add a course
                                    </router-link>
                                </li>
                                <li>
                                    <div class="navbar-line w-100"></div>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/instructor/settings"
                                                 :class="{ active: $route.path === '/instructor/settings' }"
                                                 class="text-capitalize auth-user-nav-li-item">Account Settings
                                    </router-link>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/instructor/wallet"
                                                 :class="{ active: $route.path === '/instructor/wallet' }"
                                                 class="text-capitalize auth-user-nav-li-item">Wallet
                                    </router-link>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/instructor/purchase-history"
                                                 :class="{ active: $route.path === '/instructor/purchase-history' }"
                                                 class="text-capitalize auth-user-nav-li-item">Purchase History
                                    </router-link>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/instructor/how-we-can-help"
                                                 :class="{ active: $route.path === '/instructor/how-we-can-help' }"
                                                 class="text-capitalize auth-user-nav-li-item">Help & Support
                                    </router-link>
                                </li>
                                <li class="auth-user-nav-li">
                                    <a
                                            href="#"
                                            class="text-capitalize auth-user-nav-li-item item-logout"
                                            @click.prevent="logout"
                                    >Log Out</a>
                                </li>
                            </ul>
                        </li>
                        <li v-if="auth.isAuthenticated && isLearner"
                            class="user-info-nav nav-item dropdown position-relative">
                            <a class="nav-link" href="#" id="navbarDropdownUserInfo" role="button"
                               data-bs-toggle="dropdown" aria-expanded="false"
                            >
                                <div class="auth-user-img">
                                    <img :src="userImage" alt="User image" @error="handleImageError"/>
                                </div>
                            </a>
                            <ul class="dropdown-menu dropdown-menu-end user-info-dropdown mt-3"
                                aria-labelledby="navbarDropdownUserInfo">
                                <li class="d-flex w-100 gap-2 auth-user-nav-li align-items-center">
                                    <div class="auth-user-img">
                                        <img :src="userImage" alt="User image" @error="handleImageError"/>
                                    </div>
                                    <div class="auth-user-detail d-flex flex-column justify-content-center">
                                        <span class="auth-user-name">{{ userName }}</span>
                                        <p class="auth-user-email mb-0">{{ userEmail }}</p>
                                    </div>
                                </li>
                                <li>
                                    <div class="navbar-line w-100"></div>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/learner/my-learning"
                                                 :class="{ active: $route.path === '/learner/my-learning' }"
                                                 class="text-capitalize auth-user-nav-li-item">My Learning
                                    </router-link>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/learner/shopping-cart"
                                                 :class="{ active: $route.path === '/learner/shopping-cart' }"
                                                 class="text-capitalize auth-user-nav-li-item">My Cart
                                    </router-link>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/learner/wishlist"
                                                 :class="{ active: $route.path === '/learner/wishlist' }"
                                                 class="text-capitalize auth-user-nav-li-item">Wishlist
                                    </router-link>
                                </li>
                                <li>
                                    <div class="navbar-line w-100"></div>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/learner/settings"
                                                 :class="{ active: $route.path === '/learner/settings' }"
                                                 class="text-capitalize auth-user-nav-li-item">Account Settings
                                    </router-link>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/learner/wallet"
                                                 :class="{ active: $route.path === '/learner/wallet' }"
                                                 class="text-capitalize auth-user-nav-li-item">Wallet
                                    </router-link>
                                </li>

                                <li class="auth-user-nav-li">
                                    <router-link to="/learner/purchase-history"
                                                 :class="{ active: $route.path === '/learner/purchase-history' }"
                                                 class="text-capitalize auth-user-nav-li-item">Purchase History
                                    </router-link>
                                </li>
                                <li>
                                    <div class="navbar-line w-100"></div>
                                </li>
                                <li class="auth-user-nav-li">
                                    <router-link to="/learner/how-we-can-help"
                                                 :class="{ active: $route.path === '/learner/how-we-can-help' }"
                                                 class="text-capitalize auth-user-nav-li-item">Help & Support
                                    </router-link>
                                </li>
                                <li class="auth-user-nav-li">
                                    <a
                                            href="#"
                                            class="text-capitalize auth-user-nav-li-item item-logout"
                                            @click.prevent="logout"
                                    >Log Out</a>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
            <div v-if="isHomePage || isPrivacyPolicyPage || isTermsConditionsPage" class="header-home-content-section d-flex position-relative">
                <div class="home-content">
                    <div class="content">
                        <h1 class="text-capitalize"><span class="text-capitalize">{{ $t('header.title') }}</span> {{ $t('header.subtitle') }}</h1>
                        <p>{{ $t('hero.learn_anywhere_anytime') }} {{ $t('hero.choose_course_fits_level') }}</p>
                    </div>
                    <div class="learn-more-btn-div d-flex justify-content-center align-items-center">
                        <button class="learn-more-btn">
                            {{ $t('hero.free_registration') }}
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="isAboutPage" class="header-about-content-section d-flex position-relative">
                <div class="about-content">
                    <div class="content">
                        <h1 class="text-capitalize"><span class="text-capitalize">{{ $t('about.about') }}</span> {{ $t('about.us') }}</h1>
                        <p>{{ $t('about.description') }}</p>
                    </div>
                </div>
            </div>
            <div v-if="isContactPage" class="header-contact-content-section d-flex flex-column position-relative">
                <div class="contact-content">
                    <div class="content">
                        <h1 class="text-capitalize"><span class="text-capitalize">{{ $t('contact.contact') }}</span>{{ $t('contact.us') }}</h1>
                        <p>{{ $t('contact.description') }}</p>
                    </div>
                </div>
                <div class="contact-info d-flex flex-wrap justify-content-center">
                    <div class="info-detail d-flex flex-column align-items-center justify-content-center">
                        <a href="tel:+37477198238">
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M16.25 1.24998C16.25 0.918462 16.3817 0.600519 16.6161 0.366099C16.8505 0.131678 17.1685 -1.79501e-05 17.5 -1.79501e-05C20.8141 0.00362155 23.9914 1.32175 26.3348 3.66517C28.6782 6.00858 29.9963 9.18589 30 12.5C30 12.8315 29.8683 13.1494 29.6339 13.3839C29.3994 13.6183 29.0815 13.75 28.75 13.75C28.4185 13.75 28.1005 13.6183 27.8661 13.3839C27.6317 13.1494 27.5 12.8315 27.5 12.5C27.497 9.84873 26.4425 7.30692 24.5678 5.4322C22.693 3.55748 20.1512 2.50296 17.5 2.49998C17.1685 2.49998 16.8505 2.36829 16.6161 2.13387C16.3817 1.89945 16.25 1.5815 16.25 1.24998ZM17.5 7.49998C18.8261 7.49998 20.0978 8.02677 21.0355 8.96445C21.9732 9.90213 22.5 11.1739 22.5 12.5C22.5 12.8315 22.6317 13.1494 22.8661 13.3839C23.1005 13.6183 23.4185 13.75 23.75 13.75C24.0815 13.75 24.3994 13.6183 24.6339 13.3839C24.8683 13.1494 25 12.8315 25 12.5C24.998 10.5115 24.2072 8.60497 22.8011 7.19888C21.395 5.79278 19.4885 5.00197 17.5 4.99998C17.1685 4.99998 16.8505 5.13168 16.6161 5.3661C16.3817 5.60052 16.25 5.91846 16.25 6.24998C16.25 6.5815 16.3817 6.89945 16.6161 7.13387C16.8505 7.36829 17.1685 7.49998 17.5 7.49998ZM28.8662 20.9237C29.5906 21.6501 29.9974 22.6341 29.9974 23.66C29.9974 24.6858 29.5906 25.6698 28.8662 26.3962L27.7287 27.7075C17.4912 37.5087 -7.42127 12.6025 2.22873 2.33248L3.66623 1.08248C4.39344 0.378329 5.36864 -0.0112066 6.38086 -0.0018494C7.39308 0.00750781 8.36091 0.415005 9.07498 1.13248C9.11373 1.17123 11.43 4.17998 11.43 4.17998C12.1173 4.90202 12.4999 5.86114 12.4982 6.85799C12.4966 7.85483 12.1109 8.8127 11.4212 9.53248L9.97373 11.3525C10.7748 13.2989 11.9526 15.0678 13.4394 16.5576C14.9262 18.0474 16.6927 19.2288 18.6375 20.0337L20.4687 18.5775C21.1886 17.8884 22.1463 17.5031 23.1428 17.5017C24.1394 17.5003 25.0982 17.8829 25.82 18.57C25.82 18.57 28.8275 20.885 28.8662 20.9237ZM27.1462 22.7412C27.1462 22.7412 24.155 20.44 24.1162 20.4012C23.8587 20.1459 23.5107 20.0026 23.1481 20.0026C22.7855 20.0026 22.4375 20.1459 22.18 20.4012C22.1462 20.4362 19.625 22.445 19.625 22.445C19.4551 22.5802 19.2529 22.6689 19.0383 22.7022C18.8237 22.7355 18.6041 22.7123 18.4012 22.635C15.8818 21.6969 13.5934 20.2284 11.691 18.3288C9.78865 16.4293 8.31673 14.143 7.37498 11.625C7.29148 11.4193 7.26425 11.1951 7.29611 10.9754C7.32796 10.7557 7.41775 10.5485 7.55623 10.375C7.55623 10.375 9.56498 7.85248 9.59873 7.81998C9.85406 7.56247 9.99733 7.2145 9.99733 6.85186C9.99733 6.48921 9.85406 6.14125 9.59873 5.88373C9.55998 5.84623 7.25873 2.85248 7.25873 2.85248C6.99735 2.61812 6.65623 2.4926 6.30529 2.50167C5.95435 2.51073 5.62016 2.65369 5.37123 2.90123L3.93373 4.15123C-3.11877 12.6312 18.47 33.0225 25.9012 26L27.04 24.6875C27.3068 24.4403 27.4671 24.0991 27.4869 23.7359C27.5068 23.3727 27.3846 23.016 27.1462 22.7412Z"
                                      fill="#ffff"/>
                            </svg>
                        </a>
                        <span class="mt-3 web-phone-span d-block">{{ $t('contact.phone') }}</span>
                        <span class="mt-3 mobile-span mobile-phone-span d-none">{{ $t('contact.phone') }}</span>
                        <a class="mt-2 d-block a-web" href="tel:+37477198238"> +374 77 198238 </a>
                    </div>
                    <div class="info-detail  d-flex flex-column align-items-center justify-content-center">
                        <a href="https://wa.me/37477198238" target="_blank">
                            <svg width="30" height="30" viewBox="0 0 30 30" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path fill-rule="evenodd" clip-rule="evenodd"
                                      d="M25.6303 4.36C22.8093 1.55 19.0588 0.00125 15.0634 0C6.83023 0 0.12937 6.6675 0.125602 14.865C0.124346 17.485 0.812644 20.0425 2.12016 22.2975L0 30L7.91794 27.9325C10.0996 29.1175 12.5564 29.7413 15.0559 29.7425H15.0622C23.2941 29.7425 29.9962 23.0737 30 14.8763C30.0025 10.905 28.4501 7.16875 25.6303 4.36ZM15.0634 27.2313H15.0584C12.8302 27.2313 10.646 26.635 8.73938 25.5087L8.28595 25.2413L3.58719 26.4675L4.84195 21.9075L4.54679 21.44C3.30333 19.4725 2.64769 17.1987 2.64894 14.865C2.65145 8.0525 8.2219 2.51 15.0697 2.51C18.3856 2.51 21.503 3.7975 23.8468 6.1325C26.1905 8.46875 27.4804 11.5725 27.4792 14.8738C27.4754 21.6888 21.9062 27.2313 15.0634 27.2313ZM21.8736 17.9775C21.5005 17.7913 19.6655 16.8925 19.3226 16.7687C18.9809 16.645 18.7323 16.5825 18.4823 16.9538C18.2324 17.325 17.5189 18.1625 17.3004 18.4113C17.0831 18.6588 16.8646 18.69 16.4915 18.5037C16.1185 18.3175 14.9152 17.9263 13.4896 16.66C12.3806 15.675 11.6307 14.4587 11.4134 14.0863C11.1961 13.7137 11.3908 13.5138 11.5767 13.3288C11.745 13.1625 11.9498 12.895 12.1369 12.6775C12.3253 12.4625 12.3869 12.3075 12.5125 12.0588C12.6368 11.8113 12.5753 11.5938 12.4811 11.4075C12.3869 11.2225 11.6408 9.39375 11.3305 8.65C11.0278 7.925 10.7201 8.02375 10.4903 8.0125C10.273 8.00125 10.0243 8 9.77433 8C9.52564 8 9.1212 8.0925 8.77957 8.465C8.43793 8.8375 7.47331 9.73625 7.47331 11.5638C7.47331 13.3925 8.81097 15.1587 8.99686 15.4062C9.18275 15.6537 11.6282 19.4062 15.3724 21.015C16.2629 21.3975 16.9588 21.6262 17.5001 21.7975C18.3944 22.08 19.2083 22.04 19.8514 21.945C20.5686 21.8387 22.0595 21.0462 22.3709 20.1787C22.6824 19.3112 22.6824 18.5662 22.5882 18.4125C22.4953 18.2562 22.2466 18.1637 21.8736 17.9775Z"
                                      fill="#ffff"/>
                            </svg>
                        </a>
                        <span class="mt-3 mobile-span">WhatsApp</span>
                        <a class="mt-2 d-block a-web" href="https://wa.me/37477198238" target="_blank"> +374 77
                            198238 </a>
                    </div>

                    <div class="info-detail d-flex flex-column align-items-center justify-content-center">
                        <a href="mailto:info@trainup.academy">
                            <svg width="30" height="28" viewBox="0 0 30 28" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.75 0.25H6.25C4.59301 0.251985 3.00445 0.911103 1.83277 2.08277C0.661102 3.25445 0.00198482 4.84301 0 6.5L0 21.5C0.00198482 23.157 0.661102 24.7456 1.83277 25.9172C3.00445 27.0889 4.59301 27.748 6.25 27.75H23.75C25.407 27.748 26.9956 27.0889 28.1672 25.9172C29.3389 24.7456 29.998 23.157 30 21.5V6.5C29.998 4.84301 29.3389 3.25445 28.1672 2.08277C26.9956 0.911103 25.407 0.251985 23.75 0.25ZM6.25 2.75H23.75C24.4985 2.75147 25.2294 2.97689 25.8487 3.39726C26.468 3.81762 26.9473 4.41368 27.225 5.10875L17.6525 14.6825C16.948 15.3841 15.9943 15.7781 15 15.7781C14.0057 15.7781 13.052 15.3841 12.3475 14.6825L2.775 5.10875C3.05269 4.41368 3.53202 3.81762 4.15131 3.39726C4.7706 2.97689 5.50152 2.75147 6.25 2.75ZM23.75 25.25H6.25C5.25544 25.25 4.30161 24.8549 3.59835 24.1517C2.89509 23.4484 2.5 22.4946 2.5 21.5V8.375L10.58 16.45C11.7533 17.6203 13.3428 18.2775 15 18.2775C16.6572 18.2775 18.2467 17.6203 19.42 16.45L27.5 8.375V21.5C27.5 22.4946 27.1049 23.4484 26.4017 24.1517C25.6984 24.8549 24.7446 25.25 23.75 25.25Z"
                                      fill="#ffff"/>
                            </svg>
                        </a>
                        <span class="mt-3 mobile-span">{{ $t('contact.email') }}</span>
                        <a class="mt-2 d-block a-web" href="mailto:info@trainup.academy">info@trainup.academy</a>
                    </div>
                </div>
            </div>
            <div v-if="isCoursesPage" class="header-courses-content-section d-flex position-relative">
                <div class="courses-content">
                    <div class="content">
                        <h1 class="text-capitalize"><span class="text-capitalize">{{ $t('courses_page.header_title') }}</span> {{ $t('courses_page.header_title_2') }}</h1>
                        <p>{{ $t('courses_page.header_description') }}</p>
                    </div>
                </div>
            </div>
            <div v-if="isSingleCoursePage" class="header-single-course-content-section d-flex position-relative">
                <div v-if="isLoading" class="d-flex justify-content-center align-items-center w-100"
                     style="min-height: 300px">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="visually-hidden">{{ $t('loading') }}...</span>
                    </div>
                </div>
                <div v-else class="single-course-content">
                    <div class="content">
                        <h1 v-if="course" class="text-capitalize">
                            <span class="text-capitalize">{{ getLocalizedField(course, 'title') }}</span>
                        </h1>
                        <p class="description-3-lines">{{ getLocalizedField(course, 'description') }}</p>
                    </div>
                </div>
            </div>
            <div v-if="isBlogPage" class="header-blog-content-section d-flex position-relative">
                <div class="blog-content">
                    <div class="content">
                        <h1 class="text-capitalize"><span class="text-capitalize">Blog &  </span> Article </h1>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the</p>
                    </div>
                </div>
            </div>
            <div v-if="isSingleBlogPage" class="header-single-blog-content-section d-flex position-relative">
                <div v-if="isLoading" class="d-flex justify-content-center align-items-center w-100"
                     style="min-height: 300px">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="visually-hidden">{{ $t('loading') }}...</span>
                    </div>
                </div>
                <div v-else class="single-blog-content">
                    <div class="content">
                        <h1 class="text-capitalize">
                            <span class="text-capitalize">{{ firstWord }}</span> {{ rest }}
                        </h1>
                        <p v-if="blog">{{ truncateDescription(blog[`description_${locale}`]) }}</p>
                    </div>
                </div>
            </div>
            <div v-if="isWhyChooseUsPage" class="header-why-choose-content-section d-flex position-relative">
                <div class="why-choose-content">
                    <div class="content">
                        <h1 class="text-capitalize"><span class="text-capitalize">{{ $t('why_choose_us_text.title_1') }}</span> {{ $t('why_choose_us_text.title_2') }}</h1>
                        <p>{{ $t('about.why_choose_us_text') }}</p>
                    </div>
                </div>
            </div>

            <div v-if="isTeachOnTrainUpPage" class="header-train-up-content-section d-flex position-relative">
                <div class="train-up-content">
                    <div class="content">
                        <h1 class="text-capitalize"><span class="text-capitalize">{{ $t('teach_whit_us.come') }} </span> {{ $t('teach_whit_us.title') }} </h1>
                        <p>{{ $t('teach_whit_us.text') }}</p>
                    </div>
                    <div v-if="!auth.isAuthenticated" class="learn-more-btn-div d-flex justify-content-center align-items-center">
                        <router-link
                                :to="{ path: '/sign-up', query: { hideLearner: true } }"
                                class="learn-more-btn text-decoration-none align-items-center justify-content-center d-flex">
                            {{ $t('teach_whit_us.register') }}
                        </router-link>
                    </div>
                </div>
            </div>

            <div v-if="isSignInPage" class="header-auth-section d-flex position-relative">
                <SignIn></SignIn>
            </div>
            <div v-if="isSignUpPage" class="header-auth-section d-flex position-relative">
                <SignUp></SignUp>
            </div>
            <div v-if="isVerifyPage" class="header-auth-section d-flex position-relative">
                <VerificationCode></VerificationCode>
            </div>
            <div v-if="isForgotPasswordPage" class="header-auth-section d-flex position-relative">
                <ForgotPassword></ForgotPassword>
            </div>
            <div v-if="isChangePasswordPage" class="header-auth-section d-flex position-relative">
                <ChangePassword></ChangePassword>
            </div>
            <div v-if="isInstructorHowWeCanHelpPage || isInstructorHowWeCanHelpDetailsPage"
                 class="header-how-we-can-help-content-section d-flex position-relative">
                <div class="how-we-can-help-content">
                    <div class="content">
                        <h1 class="text-capitalize"><span class="text-capitalize">How We  </span> Can Help You </h1>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the</p>
                    </div>
                </div>
            </div>
            <div v-if="isLearnerHowWeCanHelpPage || isLearnerHowWeCanHelpDetailsPage"
                 class="header-how-we-can-help-content-section d-flex position-relative">
                <div class="how-we-can-help-content">
                    <div class="content">
                        <h1 class="text-capitalize"><span class="text-capitalize">How We  </span> Can Help You </h1>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.header {
    background-image: url("/assets/images/home/header-background.jpg");
}

.header:before {
    background: var(--home-header);
}

.header:before,
.about-header:before,
.contact-header:before,
.courses-header:before,
.blog-header:before,
.single-blog-header:before,
.why-choose-us-header:before,
.single-course-header:before,
.how-we-can-help-header:before,
.auth-header:before,
.train-up-header:before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.header {
    min-height: 938px !important;
}

.contact-header {
    min-height: 658px !important;
}

.header,
.contact-header {
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    background-position: center;
}

.train-up-header,
.about-header,
.courses-header,
.blog-header,
.why-choose-us-header,
.single-blog-header,
.single-course-header,
.how-we-can-help-header {
    min-height: 500px !important;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    background-position: center;
}

.auth-header {
    min-height: 600px !important;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
}

.about-header {
    background-image: url("/assets/images/about/about-header.jpg");
}

.about-header:before {
    background: var(--about-header);
}

.courses-header {
    background-image: url("/assets/images/courses/courses-header.jpg");
}

.single-course-header {
    background-image: url("/assets/images/courses/single-course-header.jpg");
}

.how-we-can-help-header {
    background-image: url("/assets/images/howWeCanHelp/how-we-can-help-header.png");
}

.courses-header:before,
.single-course-header:before,
.how-we-can-help-header:before {
    background: var(--courses-header);
}

.blog-header:before,
.single-blog-header:before {
    background: var(--blog-header);
}

.blog-header,
.single-blog-header {
    background-image: url("/assets/images/blog/blog-header.jpg");
}

.contact-header {
    background-image: url("/assets/images/contact/contact-header.jpg");
    border-bottom: 1px solid var(--secondary-1-100);
}

.contact-header:before {
    background: var(--contact-header);
}

.why-choose-us-header {
    background-image: url("/assets/images/whyChooseUs/why-choose-header.jpg");
}

.why-choose-us-header:before {
    background: var(--why-choose-us-header);
}

.train-up-header:before {
    background: var(--train-up-header);
}

.train-up-header {
    background-image: url("/assets/images/trainUp/trainUp.jpg");
}

.header-train-up-content-section,
.header-about-content-section,
.header-blog-content-section,
.header-why-choose-content-section,
.header-courses-content-section,
.header-single-blog-content-section,
.header-single-course-content-section,
.header-how-we-can-help-content-section {
    padding: 118px 0;
}

.header-contact-content-section {
    padding: 118px 0 10px 0;
}


.train-up-content {
    width: 60%;
}

.auth-header {
    background-image: url("/assets/images/repeting-image.jpg");
    border-bottom: 1px solid var(--secondary-1-100);
}

.auth-header:before {
    background: var(--auth-header);
}

.navbar {
    padding-top: 15px !important;
}

.nav-item {
    margin: 0 15px;
}

.nav-link {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 20px;
    line-height: normal;
    letter-spacing: 1px;
    color: var(--white-245) !important;
    text-transform: capitalize;
}

html[lang="arm"] .nav-link {
    font-size: 15px;
}

.dropdown-item {
    color: var(--white-245);
    font-weight: 300;
}

.dropdown-item.active {
    background-color: transparent !important;
}

.dropdown-item:hover {
    color: var(--secondary-1-100) !important;
    font-weight: 300;
    background-color: transparent;
}

.active {
    color: var(--secondary-1-100) !important;
}

.dropdown-menu {
    background-color: var(--secondary-2-80) !important;
    border: transparent;
    outline: none;
    margin-top: 10px;
}

.header-home-content-section {
    width: 100% !important;
    padding: 11% 0;
}

.header-blog-content-section,
.header-why-choose-content-section,
.header-courses-content-section {
    width: 100% !important;
}


.header-single-blog-content-section,
.header-single-course-content-section,
.header-how-we-can-help-content-section {
    width: 100% !important;
}

.header-auth-section {
    width: 100% !important;
    padding: 80px 0;
}

.header-contact-content-section {
    width: 100% !important;
    gap: 60px;
}

.home-content,
.content {
    display: flex;
    flex-direction: column;
}

.home-content,
.about-content,
.contact-content,
.blog-content {
    width: 70%;

}

.home-content,
.about-content,
.contact-content,
.courses-content,
.blog-content,
.single-course-content,
.how-we-can-help-content {
    gap: 60px;
    width: 70%;
}

.courses-content,
.single-blog-content,
.why-choose-content,
.single-course-content,
.how-we-can-help-content {
    width: 80%;
}

.courses-content .content p,
.why-choose-content .content p,
.single-course-content .content p,
.how-we-can-help-content .content p {
    width: 84% !important;
}

.single-blog-content .content p {
    width: 80% !important;
}

.content {
    gap: 30px;
}

.content h1,
.content span,
.content p {
    font-family: var(--font-montserrat);
    font-weight: 400;
    line-height: normal;
    letter-spacing: 1px;
}

.content h1 {
    color: var(--white-245);
    font-size: 60px;
}

.content span {
    color: var(--secondary-1-100);
    font-size: 60px;
}

.content p {
    font-size: 22px;
    color: var(--white-245);
}

.learn-more-btn {
    gap: 10px;
    border-radius: 70px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 24px;
    line-height: normal;
    letter-spacing: 1px;
    color: var(--white-229);
    cursor: pointer;
    width: 272px;
    height: 69px;
    background: var(--general-btn-light);
    outline: none;
    border: none;
    text-transform: capitalize;
}


.learn-more-btn-div {
    width: 283px;
    height: 72px;
}

.learn-more-btn:hover {
    width: 283px;
    height: 72px;
    font-size: 26px;
}

.home-girl-img {
    right: 0;
    bottom: 0;
}

.contact-info {
    gap: 60px;
    margin-bottom: 40px;
}

.info-detail {
    width: 222px;
    height: 190px;
    top: 582px;
    left: 272px;
    border-radius: 6px;
    background: var(--contact-info-detail-bg);
    backdrop-filter: blur(20px)
}

.info-detail:hover {
    background: var(--primary-100);
    backdrop-filter: blur(20px)
}

.contact-info span,
.info-detail a {
    font-family: var(--font-montserrat);
    font-weight: 400;
    line-height: 150%;
    letter-spacing: 0%;
    vertical-align: middle;
    color: var(--white-255);
}

.contact-info span {
    font-size: 18px;
}

.info-detail a {
    font-size: 16px;
    text-decoration: none;
}

.auth-btn {
    min-width: 140px;
    height: 48px;
    border-radius: 52px;
    border: 1px solid var(--white-245);
    background: transparent;
    color: var(--white-245);
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 17px;
    line-height: normal;
    letter-spacing: 0%;
}


.navbar-auth-btn-block {
    display: flex;
    /* gap: 10px; */
}

.menu-list {
/* gap: 5px; */
}

.lang-change-block {
    position: relative;
}


.lang-dropdown {
    left: 50% !important;
    transform: translateX(-50%);
    min-width: max-content;
    z-index: 9999;
}

.auth-user-img {
    width: 50px;
    height: 50px;
    border-radius: 50%;
    overflow: hidden;
}

.auth-user-img img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

.user-info-dropdown {
    width: 300px;
    min-height: 350px;
    background: var(--white-245) !important;
}

.notification-info-dropdown {
    width: 350px;
    height: 440px;
    background: var(--white-245) !important;
    overflow: scroll;
}

.auth-user-nav-li {
    padding: 10px 0 10px 20px;
}

.notification-nav-li {
    padding: 10px 20px;
}

.auth-user-name,
.auth-user-email {
    font-family: var(--font-montserrat);
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0%;
}

.auth-user-name {
    font-size: 18px;
    color: var(--secondary-1-100);
    word-break: break-all;
}

.auth-user-email {
    font-size: 14px;
    color: var(--primary-90);
    word-break: break-all;
    text-decoration: none !important;
}

.navbar-line {
    border-width: 0.5px;
    border-style: solid;
    border-color: var(--primary-90);
    margin: 10px 0;
}

.auth-user-nav-li-item {
    color: var(--primary-90);
}

.item-logout {
    color: var(--required);
}

.auth-user-nav-li-item {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    text-decoration: none;
}

.round-notify-icon {
    min-width: 16px;
    height: 16px;
    background-color: var(--secondary-1-100);
    border-radius: 50%;
}

.notification-text,
.notification-hour {
    font-family: var(--font-inter);
    font-size: 14px;
    line-height: normal;
    letter-spacing: 0%;
}

.notification-text {
    font-weight: 300;
    color: var(--primary-60);
}

.notification-hour {
    font-weight: 600;
    color: var(--secondary-1-100);
}

.navbar-primary {
    background-color: var(--primary-100);
}

.description-3-lines {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: normal;
}


/* Medium Devices */
@media (min-width: 576px) and (max-width: 991px) {
    .auth-btn {
        width: 50%;
    }
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .header {
        min-height: 778px !important;
    }

    .contact-header {
        min-height: 500px !important;
    }

    .header,
    .about-header,
    .contact-header,
    .courses-header,
    .blog-header,
    .single-blog-header,
    .why-choose-us-header,
    .auth-header {
        background-position: center;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .auth-header {
        min-height: 400px !important;
    }

    .single-blog-header {
        min-height: 500px !important;
    }

    .logo-container {
        width: 73px;
        height: 62px;
    }

    .navbar .notification-web,
    .menu-list,
    .navbar-auth-btn-block {
        display: none !important;
    }

    .navbar-open {
        background: var(--navbar-open) !important;
        padding: 15px;
    }

    .navbar-open,
    .navbar-open-auth-instructor {
        position: fixed;
        z-index: 9999;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
    }

    .navbar-open-auth-instructor {
        background: var(--white-245) !important;
    }

    .navbar-open-logo {
        width: 73px;
        height: 62px;
    }

    .navbar-open-logo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .open-navbar-icon,
    .open-notification-icon {
        display: block !important;
    }

    .social-network-section {
        padding: 15px;
    }

    .menu-section {
        margin-top: 60px;
    }

    .menu-section .menu-nav {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .nav-item.dropdown {
        position: relative;
    }

    .dropdown-menu {
        position: static;
    }

    .home-girl-img {
        height: 306px;
    }

    .home-girl-img img {
        width: 100%;
        height: 100%;
    }

    .header-home-content-section {
        padding: 21% 0;
    }

    .header-home-content-section,
    .header-about-content-section,
    .header-contact-content-section,
    .header-courses-content-section,
    .header-blog-content-section,
    .header-single-blog-content-section,
    .header-why-choose-content-section,
    .header-single-course-content-section,
    .header-how-we-can-help-content-section {
        width: 100% !important;
        position: relative ! IMPORTANT;
    }

    .home-content,
    .about-content,
    .contact-content,
    .courses-content,
    .blog-content,
    .single-blog-content,
    .why-choose-content,
    .single-course-content,
    .how-we-can-help-content,
    .train-up-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        width: 100%;
    }

    .content {
        gap: 10px !important;
    }

    .content h1,
    .content span {
        font-size: 30px !important;
        text-align: center;
    }

    .content p {
        font-size: 14px !important;
        text-align: center;
    }

    .learn-more-btn-div {
        width: 201px !important;
        height: 53px !important;
    }

    .learn-more-btn:hover {
        width: 190px !important;
        height: 50px !important;
    }

    .learn-more-btn {
        font-size: 18px !important;
        width: 190px !important;
        height: 50px !important;
    }

    .info-detail {
        width: 95px;
        height: 86px;
    }

    .contact-info {
        gap: 10px;
    }

    .info-detail .a-web {
        display: none !important;
    }

    .contact-info span {
        font-size: 14px;
    }

    .info-detail svg {
        width: 20px;
        height: 20px;
    }

    .web-phone-span {
        display: none !important;
    }

    .mobile-phone-span {
        display: block !important;
    }

    .mobile-span {
        margin-top: 6px !important;
    }

    .info-detail:hover {
        background: var(--contact-info-detail-bg);
    }

    .courses-content .content p,
    .single-blog-content .content p,
    .why-choose-content .content p,
    .single-course-content .content p,
    .how-we-can-help-content .content p {
        width: 100% !important;
    }

    .menu-mobile-lang {
        margin: 0;
        padding: 10px;
        flex-wrap: wrap;
        gap: 20px;
    }

    .auth-btn {
        width: 100%;
        height: 50px;
        font-size: 18px;
    }

    .auth-btn-div {
        width: 100%;
        height: 50px;
    }

    .open-navbar-auth-header {
        border-bottom: 1px solid var(--primary-90);
        background: var(--primary-10);
    }

    .auth-user-nav-li-title {
        font-family: var(--font-montserrat);
        font-weight: 400;
        font-size: 16px;
        line-height: normal;
        letter-spacing: 0%;
        color: var(--secondary-1-100);
        text-transform: capitalize;
    }

    .authenticated-dropdown {
        background-color: var(--secondary-2-10) !important;
    }

    .authenticated-item {
        color: var(--primary-80) !important;
    }

    .train-up-content {
        width: 100% !important;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 991px) {
    .header,
    .about-header,
    .contact-header,
    .courses-header,
    .blog-header,
    .single-blog-header,
    .why-choose-us-header,
    .auth-header,
    .single-course-header,
    .how-we-can-help-header,
    .train-up-content {
        background-position: center;
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .contact-header {
        min-height: 500px !important;
    }

    .logo-container {
        width: 73px;
        height: 62px;
    }

    .navbar .notification-web,
    .menu-list,
    .navbar-auth-btn-block {
        display: none !important;
    }

    .navbar-open {
        background: var(--navbar-open) !important;
        padding: 20px 40px;
    }

    .navbar-open-auth-instructor {
        background: var(--white-245) !important;
    }

    .navbar-open,
    .navbar-open-auth-instructor {
        position: fixed;
        z-index: 9999;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow-y: auto;
        overflow-x: hidden;
        -webkit-overflow-scrolling: touch;
    }

    .navbar-open-logo {
        width: 73px;
        height: 62px;
    }

    .navbar-open-logo img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }

    .open-navbar-icon,
    .open-notification-icon {
        display: block !important;
    }

    .social-network-section {
        padding: 15px;
    }

    .menu-section {
        margin-top: 60px;
    }

    .menu-section .menu-nav {
        display: flex;
        flex-direction: column;
        gap: 20px;
    }

    .nav-item.dropdown {
        position: relative;
    }

    .dropdown-menu {
        position: static;
    }

    .home-girl-img {
        height: 443px;
    }

    .home-girl-img img {
        width: 100%;
        height: 100%;
    }

    .header-home-content-section,
    .header-about-content-section,
    .header-courses-content-section,
    .header-blog-content-section,
    .header-single-blog-content-section,
    .header-why-choose-content-section,
    .header-single-course-content-section,
    .header-how-we-can-help-content-section {
        width: 100% !important;
        position: relative !important;
    }

    .header-home-content-section {
        padding: 21% 0;
    }

    .home-content,
    .about-content,
    .contact-content,
    .courses-content,
    .blog-content,
    .single-blog-content,
    .why-choose-content,
    .single-course-content,
    .how-we-can-help-content {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: 10px;
        width: 100%;
    }

    .content {
        gap: 10px !important;
    }

    .content h1,
    .content span {
        font-size: 30px !important;
        text-align: center;
    }

    .content p {
        font-size: 14px !important;
        text-align: center;
    }

    .learn-more-btn-div {
        width: 201px !important;
        height: 53px !important;
    }

    .learn-more-btn:hover {
        width: 190px !important;
        height: 50px !important;
    }

    .learn-more-btn {
        font-size: 18px !important;
        width: 190px !important;
        height: 50px !important;
    }

    .info-detail {
        width: 152px;
        height: 147px;
    }

    .contact-info {
        gap: 10px;
    }

    .info-detail:hover {
        background: var(--contact-info-detail-bg);
    }

    .courses-content .content p,
    .single-blog-content .content p,
    .why-choose-content .content p,
    .single-course-content .content p,
    .how-we-can-help-content .content p {
        width: 100% !important;
    }

    .info-detail a,
    .info-detail span {
        font-size: 14px;
        text-decoration: none;
    }

    .auth-header {
        min-height: 400px !important;
    }

    .menu-mobile-lang {
        margin: 0;
        padding: 10px;
        flex-wrap: wrap;
        gap: 20px;
    }

    .auth-btn {
        height: 50px;
        font-size: 18px;
    }

    .auth-btn-div {
        width: 100%;
        height: 50px;
    }

    .open-navbar-auth-header {
        border-bottom: 1px solid var(--primary-90);
        background: var(--primary-10);
    }

    .authenticated-dropdown {
        background-color: var(--secondary-2-10) !important;
    }

    .authenticated-item {
        color: var(--primary-80) !important;
    }

    .auth-user-nav-li-title {
        font-family: var(--font-montserrat);
        font-weight: 400;
        font-size: 16px;
        line-height: normal;
        letter-spacing: 0%;
        color: var(--secondary-1-100);
        text-transform: capitalize;
    }

    .train-up-content {
        width: 100% !important;
    }
}


/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .logo-container {
        width: 80px;
        height: 80px;
    }

    .nav-link,
    .dropdown-item {
        font-size: 11px;
    }

    html[lang="arm"] .nav-link {
        font-size: 11px;
    }

    .nav-link svg {
        width: 18px;
        height: 18px;
    }

    html[lang="arm"] .nav-item {
        margin: 0 10px;
    }

    .content h1 {
        font-size: 56px;
    }

    .home-girl-img img {
        width: 500px;
    }

    .home-content {
        width: 60%;
    }

    .about-content,
    .contact-content,
    .blog-content,
    .why-choose-content,
    .courses-content {
        width: 100%;
    }

    .auth-header {
        min-height: 600px !important;
    }

    .auth-btn-div {
        min-width: 104px;
        height: 33px;
    }

    .auth-btn {
        min-width: 90px;
        height: 30px;
        border-radius: 52px;
        font-size: 11px;
    }

    .lang-change-block svg,
    .notification-block-nav svg {
        width: 24px;
        height: 24px;
    }

    .auth-user-img {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
    }

    .auth-user-img img {
        object-fit: cover;
        width: 100%;
        height: 100%;
    }

    .train-up-content {
        width: 80% !important;
    }
}

@media (min-width: 1200px) {
    .logo-container {
        width: 100px;
    }

    .nav-link {
        font-size: 16px;
    }

    html[lang="arm"] .nav-link {
        font-size: 14px;
    }

    html[lang="arm"] .nav-item {
        margin: 0 10px;
    }

    .auth-btn:hover {
        min-width: 155px;
        height: 50px;
        font-size: 18px;
    }

    .auth-btn-div {
        min-width: 155px;
        height: 50px;
        display: flex;
        justify-content: center;
    }
}

@media (min-width: 1300px) {
    .nav-link {
        font-size: 17px;
    }

    html[lang="arm"] .nav-link {
        font-size: 16px;
    }

    .auth-btn:hover {
        min-width: 155px;
        height: 50px;
        font-size: 18px;
    }

    .auth-btn-div {
        min-width: 155px;
        height: 50px;
        display: flex;
        justify-content: center;
    }
}


@media (min-width: 1600px) {
    .home-content,
    .about-content,
    .contact-content,
    .blog-content {
        width: 50%;
    }

    .courses-content .content p,
    .why-choose-content .content p {
        width: 60% !important;
    }

    .single-blog-content .content p,
    .single-course-content .content p,
    .how-we-can-help-content .content p {
        width: 56% !important;
    }

    .auth-header {
        min-height: 600px !important;
    }

    .auth-btn:hover {
        min-width: 155px;
        height: 50px;
        font-size: 18px;
    }

    .auth-btn-div {
        min-width: 155px;
        height: 50px;
        display: flex;
        justify-content: center;
    }
}

</style>

