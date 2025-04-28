<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import SignIn from "../components/auth/SignIn.vue";
import SignUp from "../components/auth/SignUp.vue";
import VerificationCode from "../components/auth/VerificationCode.vue";
import { useI18n } from 'vue-i18n';
import ForgotPassword from "./auth/ForgotPassword.vue";
import ChangePassword from "./auth/ChangePassword.vue";

const { locale } = useI18n();
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

const route = useRoute();

const isHomePage = computed(() => route.path === '/');
const isAboutPage = computed(() => route.path === '/about');
const isContactPage = computed(() => route.path === '/contact');
const isCoursesPage = computed(() => route.path === '/courses');
const isSingleCoursePage = computed(() => route.path === '/single-course');
const isBlogPage = computed(() => route.path === '/blog');
const isSingleBlogPage = computed(() => route.path === '/single-blog');
const isWhyChooseUsPage = computed(() => route.path === '/why-choose-us');
const isSignInPage = computed(() => route.path === '/sign-in');
const isSignUpPage = computed(() => route.path === '/sign-up');
const isVerifyPage = computed(() => route.path === '/verify');
const isForgotPasswordPage = computed(() => route.path === '/forgot-password');
const isChangePasswordPage = computed(() => route.path === '/change-password');

const headerClass = computed(() => {
    const classes = {
        '/': 'header',
        '/about': 'about-header',
        '/contact': 'contact-header',
        '/courses': 'courses-header',
        '/single-course': 'single-course-header',
        '/blog': 'blog-header',
        '/single-blog': 'single-blog-header',
        '/why-choose-us': 'why-choose-us-header',
        '/sign-in': 'auth-header',
        '/sign-up': 'auth-header',
        '/verify': 'auth-header',
        '/forgot-password': 'auth-header',
        '/change-password': 'auth-header',
    };
    return classes[route.path] || 'header';
});
</script>

<template>
    <div :class="['navbar-open', isNavbarOpen ? 'd-block' : 'd-none']">
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
                        <a class="dropdown-item text-capitalize" href="#">Course name</a>
                        <a class="dropdown-item text-capitalize" href="#">Course name</a>
                    </div>
                </li>

                <!--                <li class="d-flex align-items-center">-->
                <!--                    <a-->
                <!--                            class="text-decoration-none menu-item-lang me-3"-->
                <!--                            :class="{ '': currentLanguage === 'en' }"-->
                <!--                            @click="changeLanguage('en')">EN-->
                <!--                    </a>-->
                <!--                    <a-->
                <!--                            class="text-decoration-none menu-item-lang me-3"-->
                <!--                            :class="{ 'active': currentLanguage === 'ru' }"-->
                <!--                            @click="changeLanguage('ru')">RU-->
                <!--                    </a>-->
                <!--                    <a-->
                <!--                            class="text-decoration-none menu-item-lang"-->
                <!--                            :class="{ 'active': currentLanguage === 'arm' }"-->
                <!--                            @click="changeLanguage('arm')">ARM-->
                <!--                    </a>-->
                <!--                </li>-->
            </ul>
            <ul class="list-unstyled d-flex menu-mobile-lang align-items-center" aria-labelledby="navbarDropdown">
                <li>
                    <a :class="['dropdown-item', { active: locale === 'arm' }]" @click.prevent="changeLocale('arm')" href="#">
                        <img class="me-1" src="/assets/icons/navbar/lang/arm.svg" alt="arm">
                        Հայերեն</a>
                </li>
                <li><a :class="['dropdown-item', { active: locale === 'en' }]" @click.prevent="changeLocale('en')" href="#">
                    <img class="me-1" src="/assets/icons/navbar/lang/en.svg" alt="en">
                    English</a></li>
                <li><a :class="['dropdown-item', { active: locale === 'ru' }]" @click.prevent="changeLocale('ru')"  href="#">
                    <img class="me-1" src="/assets/icons/navbar/lang/ru.svg" alt="ru">
                    Русский</a></li>
            </ul>
            <div class="d-flex flex-column gap-4 mt-3 mb-3">
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

    <div :class="headerClass">
        <div v-if="isHomePage" class="home-girl-img position-absolute">
            <img src="/assets/images/home/header-girl.svg" alt="girl">
        </div>
        <div class="container">
            <nav class="navbar d-flex justify-content-between">
                <div class="logo-section d-flex align-items-center">
                    <router-link class="navbar-brand" to="/">
                        <div class="logo-container">
                            <img src="/assets/images/logo/logo.svg" alt="Logo" class="img-fluid">
                        </div>
                    </router-link>
                </div>
                <div @click="openNavbar" class="open-navbar-icon cursor-pointer d-none">
                    <img src="/assets/icons/navbar/open.svg" alt="open">
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
                            <a class="dropdown-item text-capitalize" href="#">Course name</a>
                            <a class="dropdown-item text-capitalize" href="#">Course name</a>
                        </div>
                    </li>
                </ul>
                <div class="navbar-auth-btn-block d-flex align-items-center">
                    <div v-if="!isSignInPage"  class="auth-btn-div">
                        <RouterLink to="/sign-in" custom v-slot="{ navigate }">
                            <button @click="navigate" class="auth-btn">
                                {{ $t('sign_in') }}
                            </button>
                        </RouterLink>
                    </div>
                    <div v-if="!isSignUpPage && !isVerifyPage"  class="auth-btn-div">
                        <RouterLink  to="/sign-up" custom v-slot="{ navigate }">
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
                            <ul  class="dropdown-menu lang-dropdown mt-3" aria-labelledby="navbarDropdown">
                                <li>
                                    <a :class="['dropdown-item', { active: locale === 'arm' }]" @click.prevent="changeLocale('arm')" class="dropdown-item" href="#">
                                        <img class="me-1" src="/assets/icons/navbar/lang/arm.svg" alt="arm">
                                        Հայերեն</a>
                                </li>
                                <li><a :class="['dropdown-item', { active: locale === 'en' }]" @click.prevent="changeLocale('en')" class="dropdown-item" href="#">
                                    <img class="me-1" src="/assets/icons/navbar/lang/en.svg" alt="en">
                                    English</a></li>
                                <li><a :class="['dropdown-item', { active: locale === 'ru' }]" @click.prevent="changeLocale('ru')" class="dropdown-item" href="#">
                                    <img class="me-1" src="/assets/icons/navbar/lang/ru.svg" alt="ru">
                                    Русский</a></li>
                            </ul>
                        </li>
                    </ul>
                </div>

            </nav>
            <div v-if="isHomePage" class="header-home-content-section d-flex position-relative">
                <div class="home-content">
                    <div class="content">
                        <h1 class="text-capitalize"><span class="text-capitalize">empowering</span> the Future with IT
                            Knowledge</h1>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the</p>
                    </div>
                    <div class="learn-more-btn-div d-flex justify-content-center align-items-center">
                        <button class="learn-more-btn">
                            Learn more
                        </button>
                    </div>
                </div>
            </div>
            <div v-if="isAboutPage" class="header-about-content-section d-flex position-relative">
                <div class="about-content">
                    <div class="content">
                        <h1 class="text-capitalize"><span class="text-capitalize">about</span> us</h1>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the</p>
                    </div>
                </div>
            </div>
            <div v-if="isContactPage" class="header-contact-content-section d-flex flex-column position-relative">
                <div class="contact-content">
                    <div class="content">
                        <h1 class="text-capitalize"><span class="text-capitalize">contact</span> us</h1>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the</p>
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
                        <span class="mt-3 web-phone-span d-block">Phone Number</span>
                        <span class="mt-3 mobile-span mobile-phone-span d-none">Phone</span>
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
                        <a href="mailto:info@haylogic.am">
                            <svg width="30" height="28" viewBox="0 0 30 28" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.75 0.25H6.25C4.59301 0.251985 3.00445 0.911103 1.83277 2.08277C0.661102 3.25445 0.00198482 4.84301 0 6.5L0 21.5C0.00198482 23.157 0.661102 24.7456 1.83277 25.9172C3.00445 27.0889 4.59301 27.748 6.25 27.75H23.75C25.407 27.748 26.9956 27.0889 28.1672 25.9172C29.3389 24.7456 29.998 23.157 30 21.5V6.5C29.998 4.84301 29.3389 3.25445 28.1672 2.08277C26.9956 0.911103 25.407 0.251985 23.75 0.25ZM6.25 2.75H23.75C24.4985 2.75147 25.2294 2.97689 25.8487 3.39726C26.468 3.81762 26.9473 4.41368 27.225 5.10875L17.6525 14.6825C16.948 15.3841 15.9943 15.7781 15 15.7781C14.0057 15.7781 13.052 15.3841 12.3475 14.6825L2.775 5.10875C3.05269 4.41368 3.53202 3.81762 4.15131 3.39726C4.7706 2.97689 5.50152 2.75147 6.25 2.75ZM23.75 25.25H6.25C5.25544 25.25 4.30161 24.8549 3.59835 24.1517C2.89509 23.4484 2.5 22.4946 2.5 21.5V8.375L10.58 16.45C11.7533 17.6203 13.3428 18.2775 15 18.2775C16.6572 18.2775 18.2467 17.6203 19.42 16.45L27.5 8.375V21.5C27.5 22.4946 27.1049 23.4484 26.4017 24.1517C25.6984 24.8549 24.7446 25.25 23.75 25.25Z"
                                      fill="#ffff"/>
                            </svg>
                        </a>
                        <span class="mt-3 mobile-span">Email</span>
                        <a class="mt-2 d-block a-web" href="mailto:info@haylogic.am">info@haylogic.am</a>
                    </div>
                </div>
            </div>
            <div v-if="isCoursesPage" class="header-courses-content-section d-flex position-relative">
                <div class="courses-content">
                    <div class="content">
                        <h1 class="text-capitalize"><span class="text-capitalize">HayLogic Academy</span> Courses </h1>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the</p>
                    </div>
                </div>
            </div>
            <div v-if="isSingleCoursePage" class="header-single-course-content-section d-flex position-relative">
                <div class="single-course-content">
                    <div class="content">
                        <h1 class="text-capitalize"><span class="text-capitalize">Course </span> name </h1>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the</p>
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
                <div class="single-blog-content">
                    <div class="content">
                        <h1 class="text-capitalize"><span class="text-capitalize">Classroom  </span> To Computer </h1>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the</p>
                    </div>
                </div>
            </div>
            <div v-if="isWhyChooseUsPage" class="header-why-choose-content-section d-flex position-relative">
                <div class="why-choose-content">
                    <div class="content">
                        <h1 class="text-capitalize"><span class="text-capitalize">Why You </span> Should Choose Us </h1>
                        <p>Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has
                            been the industry's standard dummy text ever since the</p>
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
        </div>
    </div>
</template>

<style scoped>
.header {
    background-image: url("/assets/images/home/header-background.jpeg");
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
.auth-header:before {
    content: '';
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
}

.header,
.about-header,
.contact-header,
.courses-header,
.blog-header,
.why-choose-us-header {
    min-height: 938px !important;
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

.single-blog-header,
.single-course-header {
    min-height: 600px !important;
    background-repeat: no-repeat;
    background-size: cover;
    position: relative;
    background-position: center;
}

.about-header {
    background-image: url("/assets/images/about/about-header.png");
}

.about-header:before {
    background: var(--about-header);
}

.courses-header {
    background-image: url("/assets/images/courses/courses-header.png");
}

.single-course-header {
    background-image: url("/assets/images/courses/single-course-header.png");
}

.courses-header:before,
.single-course-header:before {
    background: var(--courses-header);
}

.blog-header:before,
.single-blog-header:before {
    background: var(--blog-header);
}

.blog-header,
.single-blog-header {
    background-image: url("/assets/images/blog/blog-header.png");
}

.contact-header {
    background-image: url("/assets/images/contact/contact-header.png");
    border-bottom: 1px solid var(--secondary-1-100);
}

.contact-header:before {
    background: var(--contact-header);
}

.why-choose-us-header {
    background-image: url("/assets/images/whyChooseUs/why-choose-header.png");
}

.why-choose-us-header:before {
    background: var(--why-choose-us-header);
}

.auth-header {
    background-image: url("/assets/images/home/online-course.png");
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
    font-size: 17px;
}

.dropdown-item {
    color: var(--white-245) !important;
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
    margin-top: 11%;
}

.header-about-content-section,
.header-courses-content-section,
.header-blog-content-section,
.header-why-choose-content-section,
.header-courses-content-section {
    width: 100% !important;
    padding: 266px 0;
}

.header-single-blog-content-section,
.header-single-course-content-section {
    width: 100% !important;
    padding: 150px 0;
}

.header-auth-section {
    width: 100% !important;
    padding: 80px 0;
}

.header-contact-content-section {
    padding-top: 266px;
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
.single-course-content {
    gap: 60px;
    width: 70%;
}

.courses-content,
.single-blog-content,
.why-choose-content,
.single-course-content {
    width: 80%;
}

.courses-content .content p,
.why-choose-content .content p,
.single-course-content .content p {
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
    min-width: 186px;
    height: 53px;
    border-radius: 52px;
    border: 1px solid var(--white-245);
    background: transparent;
    color: var(--white-245);
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 20px;
    line-height: normal;
    letter-spacing: 0%;
}

.auth-btn:hover{
    min-width: 196px;
    height: 56px;
    font-size: 22px;
}

.auth-btn-div{
    min-width: 196px;
    height: 56px;
    display:flex;
    justify-content: center;
}

.navbar-auth-btn-block {
    display: flex;
    gap: 10px;
}

.menu-list{
    gap:40px;
}

.lang-change-block{
    position: relative;
}


.lang-dropdown {
    left: 50% !important;
    transform: translateX(-50%);
    min-width: max-content; /* optional: makes sure items aren't squished */
    z-index: 9999;
}

/* Extra Small Devices */
@media (max-width: 575px) {
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

    .about-header,
    .contact-header,
    .courses-header,
    .blog-header,
    .why-choose-us-header {
        min-height: 707px !important;
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

    .navbar ul,
    .navbar-auth-btn-block {
        display: none !important;
    }

    .navbar-open {
        position: fixed;
        z-index: 9999;
        background: var(--navbar-open) !important;
        width: 100%;
        height: 100vh;
        padding: 15px;
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

    .open-navbar-icon {
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
        width: 62%;
    }

    .home-girl-img {
        width: 100%;
        height: 434px;
    }

    .home-girl-img img {
        width: 100%;
        height: 100%;
    }

    .header-home-content-section {
        margin-top: 21%;
    }

    .header-home-content-section,
    .header-about-content-section,
    .header-contact-content-section,
    .header-courses-content-section,
    .header-blog-content-section,
    .header-single-blog-content-section,
    .header-why-choose-content-section.
    .header-single-course-content-section{
        width: 100% !important;
        position: relative ! IMPORTANT;
    }

    .header-about-content-section,
    .header-courses-content-section,
    .header-blog-content-section,
    .header-why-choose-content-section {
        padding: 196px 0;
    }

    .header-contact-content-section {
        padding-top: 196px;
        gap: 150px;
    }

    .header-single-blog-content-section,
    .header-single-course-content-section{
        padding: 120px 0;
    }

    .home-content,
    .about-content,
    .contact-content,
    .courses-content,
    .blog-content,
    .single-blog-content,
    .why-choose-content,
    .single-course-content{
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
        width: 201px !important;
        height: 53px !important;
        font-size: 20px !important;
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
        background: var(--white-255);
    }

    .courses-content .content p,
    .single-blog-content .content p,
    .why-choose-content .content p,
    .single-course-content .content p{
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

    .auth-btn:hover{
        width: 100%;
        height: 50px;
        font-size: 18px;
    }

    .auth-btn-div{
        width: 100%;
        height: 50px;
    }

}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .header,
    .about-header,
    .contact-header,
    .courses-header,
    .blog-header,
    .single-blog-header,
    .why-choose-us-header,
    .auth-header,
    .single-course-header{
        background-position: center;
        display: flex;
        flex-direction: column;
        align-items: center;
    }


    .logo-container {
        width: 73px;
        height: 62px;
    }

    .navbar ul,
    .navbar-auth-btn-block {
        display: none !important;
    }

    .navbar-open {
        position: fixed;
        z-index: 9999;
        background: var(--navbar-open) !important;
        width: 100%;
        height: 100vh;
        padding: 20px 40px;
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

    .open-navbar-icon {
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
        width: 62%;
    }

    .home-girl-img {
        width: 100%;
        height: 434px;
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
    .header-single-course-content-section{
        width: 100% !important;
        position: relative !important;
    }

    .header-home-content-section {
        margin-top: 21%;
    }

    .home-content,
    .about-content,
    .contact-content,
    .courses-content,
    .blog-content,
    .single-blog-content,
    .why-choose-content,
    .single-course-content{
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
        width: 201px !important;
        height: 53px !important;
        font-size: 20px !important;
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

    .header-contact-content-section {
        gap: 200px;
    }

    .contact-info {
        gap: 10px;
    }

    .info-detail:hover {
        background: var(--white-255);
    }

    .courses-content .content p,
    .single-blog-content .content p,
    .why-choose-content .content p,
    .single-course-content .content p{
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

    .auth-btn{
        font-size: 18px;
        width: 186px;
        height: 53px;
    }

    .auth-btn:hover{
        width: 186px;
        height: 53px;
        font-size: 18px;
    }

    .auth-btn-div{
        width: 186px;
        height: 53px;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .logo-container {
        width: 80px;
        height: 80px;
    }

    .nav-link,
    .dropdown-item {
        font-size: 11px;
    }

    html[lang="arm"] .nav-link{
        font-size: 10px;
    }

    .nav-link svg{
       width: 18px;
        height: 18px;
    }
    html[lang="arm"] .menu-list{
        gap:2px;
    }
    html[lang="arm"] .nav-item{
        margin: 0 10px;
    }

    .content h1 {
        font-size: 56px;
    }

    .content p {
        font-size: 18px;
    }

    .learn-more-btn {
        font-size: 20px;
        width: 246px;
        height: 58px;
    }

    .learn-more-btn-div {
        width: 256px;
        height: 60px;
    }

    .learn-more-btn:hover {
        font-size: 22px;
        width: 256px;
        height: 60px;
    }

    .home-girl-img img {
        width: 400px;
    }

    .header-home-content-section {
        width: 63% !important;
    }

    .home-content {
        gap: 35px;
    }

    .about-content,
    .contact-content,
    .home-content,
    .courses-content,
    .blog-content,
    .single-blog-content,
    .why-choose-content,
    .single-course-content{
        width: 100%;
    }

    .info-detail {
        width: 162px;
        height: 147px;
    }

    .info-detail a,
    .info-detail span {
        font-size: 14px;
        text-decoration: none;
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

    .auth-btn:hover{
        min-width: 104px;
        height: 33px;
        font-size: 13px;
    }

    .menu-list{
        gap:5px;
    }

    .lang-change-block svg{
        width: 24px;
        height: 24px;
    }

    .lang-change-block {
      margin: 0 2px;
    }

    .navbar-auth-btn-block{
        gap:2px;
    }

    .lang-dropdown img{
        width: 18px;
        height: 18px;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .logo-container {
        width: 100px;
    }

    .nav-link {
        font-size: 16px;
    }

    html[lang="arm"] .nav-link{
        font-size: 14px;
    }

    html[lang="arm"] .nav-item{
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
    .courses-content{
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

    .auth-btn:hover{
        min-width: 104px;
        height: 33px;
        font-size: 13px;
    }

    .lang-change-block svg{
        width: 24px;
        height: 24px;
    }

    .menu-list{
        gap:20px;
    }


    .navbar-auth-btn-block{
        gap:10px;
    }
}

@media (min-width: 1200px){
    html[lang="arm"] .menu-list{
       gap:10px;
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
    .why-choose-content .content p
    {
        width: 60% !important;
    }

    .single-blog-content .content p,
    .single-course-content .content p{
        width: 56% !important;
    }

    .auth-header {
        min-height: 600px !important;
    }


}


</style>

