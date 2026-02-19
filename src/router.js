import { createRouter, createWebHistory } from 'vue-router';
import { useAuthStore } from './stores/auth.js';

import Home from "./views/Home.vue";
import About from "./views/About.vue";
import Contact from "./views/Contact.vue";
import Courses from "./views/Courses.vue";
import Blog from "./views/Blog.vue";
import SingleBlog from "./views/SingleBlog.vue";
import WhyChooseUs from "./views/WhyChooseUs.vue";
import SingleCourse from "./views/SingleCourse.vue";
import SignIn from "./views/auth/SignIn.vue";
import SignUp from "./views/auth/SignUp.vue";
import VerificationCode from "./views/auth/VerificationCode.vue";
import ForgotPassword from "./views/auth/ForgotPassword.vue";
import ChangePassword from "./views/auth/ForgotPassword.vue";
import Dashboard from "./views/Dashboard.vue";
import MyCourses from "./views/auth/instructor/MyCourses.vue";
import AddCourse from "./views/auth/instructor/AddCourse.vue";
import Comments from "./views/auth/instructor/Comments.vue";
import ChangeCourse from "./views/auth/instructor/ChangeCourse.vue";
import SettingsTabsInstructor from "./views/auth/instructor/SettingsTabs.vue";
import HowWeCanHelpInstructor from "./views/auth/instructor/HowWeCanHelp.vue";
import MyLearning from "./views/auth/learner/MyLearning.vue";
import SettingsTabsLearner from "./views/auth/learner/SettingsTabs.vue";
import HowWeCanHelpLearner from "./views/auth/learner/HowWeCanHelp.vue";
import WishList from "./views/auth/learner/WishList.vue";
import CourseQuiz from "./views/auth/learner/CourseQuiz.vue";
import ShoppingCart from "./views/auth/learner/ShoppingCart.vue";
import ProfilePage from "./views/auth/learner/ProfilePage.vue";
import PurchaseHistoryLearner from "./views/auth/learner/PurchaseHistory.vue";
import PurchaseHistoryInstructor from "./views/auth/instructor/PurchaseHistory.vue";
import Checkout from "./views/auth/learner/Checkout.vue";
import TeachOnTrainUp from "./views/TeachOnTrainUp.vue";
import TermsConditions from "./views/TermsConditions.vue";
import PrivacyPolicy from "./views/PrivacyPolicy.vue";
import WalletInstructor from "./views/auth/instructor/Wallet.vue";
import WithdrawFundsInstructor from "./views/auth/instructor/WithdrawFunds.vue";
import WalletLearner from "./views/auth/learner/Wallet.vue";
import AddFundsLearner from "./views/auth/learner/AddFunds.vue";
import PaymentCallback from "./views/auth/learner/PaymentCallback.vue";
import PaymentResult from "./views/auth/learner/PaymentResult.vue";


const routes = [
    { path: '/', name: 'home', component: Home },
    { path: '/about', component: About },
    { path: '/contact', component: Contact },
    { path: '/courses', component: Courses },
    {
        path: '/single-course/:id', component: SingleCourse,
        name: 'single-course'
    },
    { path: '/blog', component: Blog },
    {
        path: '/single-blog/:id',
        name: 'SingleBlog',
        component: SingleBlog,
        props: true,
    },
    { path: '/why-choose-us', component: WhyChooseUs },
    { path: '/sign-in', component: SignIn, meta: { guestOnly: true } },
    { path: '/sign-up', component: SignUp, meta: { guestOnly: true } },
    { path: '/dashboard', name: 'dashboard', component: Dashboard, meta: { requiresAuth: true }, props: true },
    { path: '/verify', component: VerificationCode },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/change-password', component: ChangePassword },
    { path: '/teach-on-trainUp', component: TeachOnTrainUp },
    { path: '/terms-conditions', component: TermsConditions },
    { path: '/privacy-policy', component: PrivacyPolicy },
    {
        path: '/course-comments/:id',
        name: 'course-comments',
        component: Comments,
        meta: { requiresAuth: true },
        props: true
    },

    {
        path: '/instructor',
        meta: { requiresAuth: true, role: 'instructor' },
        children: [
            {
                path: 'my-courses',
                name: 'instructor-my-courses',
                component: MyCourses,
                props: true
            },
            {
                path: 'add-courses',
                name: 'instructor-add-courses',
                component: AddCourse,
                props: true
            },
            {
                path: 'change-courses/:id',
                name: 'instructor-change-courses',
                component: ChangeCourse,
                props: true
            },
            // {
            //     path: 'comments',
            //     name: 'instructor-comments',
            //     component: Comments,
            //     props: true
            // },
            {
                path: 'purchase-history',
                name: 'instructor-purchase-history',
                component: PurchaseHistoryInstructor,
                props: true
            },
            {
                path: 'settings',
                name: 'instructor-settings',
                component: SettingsTabsInstructor,
                props: true
            },
            {
                path: 'how-we-can-help',
                name: 'instructor-how-we-can-help',
                component: HowWeCanHelpInstructor,
                props: true
            },
            {
                path: 'wallet',
                name: 'instructor-wallet',
                component: WalletInstructor,
                props: true
            },
            {
                path: 'withdraw-funds',
                name: 'instructor-withdraw-funds',
                component: WithdrawFundsInstructor,
                props: true
            },
        ]
    },

    {
        path: '/learner',
        meta: { requiresAuth: true, role: 'learner' },
        children: [
            {
                path: 'my-learning',
                name: 'learner-my-learning',
                component: MyLearning,
                props: true
            },
            {
                path: 'settings',
                name: 'learner-settings',
                component: SettingsTabsLearner,
                props: true
            },
            {
                path: 'how-we-can-help',
                name: 'learner-how-we-can-help',
                component: HowWeCanHelpLearner,
                props: true
            },
            {
                path: 'wishlist',
                name: 'learner-wishlist',
                component: WishList,
                props: true
            },
            {
                path: 'shopping-cart',
                name: 'shopping-cart',
                component: ShoppingCart,
                props: true
            },
            {
                path: 'profile-page',
                name: 'profile-page',
                component: ProfilePage,
                props: true
            },
            {
                path: 'purchase-history',
                name: 'learner-purchase-history',
                component: PurchaseHistoryLearner,
                props: true
            },
            {
                path: 'checkout',
                name: 'checkout',
                component: Checkout,
                props: true
            },
            {
                path: 'wallet',
                name: 'learner-wallet',
                component: WalletLearner,
                props: true
            },
            {
                path: 'add-funds',
                name: 'learner-add-funds',
                component: AddFundsLearner,
                props: true
            },
        ]
    },

    {
        path: '/learner/quiz/:courseId',
        name: 'learner-quiz',
        component: CourseQuiz,
        props: true,
        meta: { requiresAuth: true, role: 'learner' },
    },

    // Payment flow routes
    {
        path: '/payment/callback',
        name: 'payment-callback',
        component: PaymentCallback,
    },
    {
        path: '/payment/result',
        name: 'payment-result',
        component: PaymentResult,
        meta: { requiresAuth: true },
    },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition;
        }

        if (to.path === from.path && JSON.stringify(to.query) !== JSON.stringify(from.query)) {
            return false;  // prevent scroll to top
        }

        return { top: 0 };
    }
    // scrollBehavior(to, from, savedPosition) {
    //     if (to.path === from.path && to.query.page !== from.query.page) {
    //         return false;
    //     }
    //
    //     return { top: 0 };
    // }
});

// router.beforeEach((to, from, next) => {
//     const isAuthenticated = !!localStorage.getItem('token');
//     const user = JSON.parse(localStorage.getItem('user'));
//     const userRole = user?.roles?.[0]?.name;
//     if (to.meta.requiresAuth && !isAuthenticated) {
//         return next('/sign-in');
//     }
//
//     if (to.meta.guestOnly && isAuthenticated) {
//         return next('/');
//     }
//
//     if (to.meta.role && to.meta.role !== userRole) {
//         return next('/not-authorized');
//     }
//
//     next();
// });

router.beforeEach(async (to, from, next) => {
    const auth = useAuthStore()

    // Always await checkAuth to ensure user data is loaded before routing decisions
    await auth.checkAuth()

    const isAuthenticated = auth.isAuthenticated
    const userRole = auth.user?.role

    if (to.meta.requiresAuth && !isAuthenticated) {
        return next('/sign-in')
    }

    if (to.meta.guestOnly && isAuthenticated) {
        return next('/')
    }

    if (to.meta.role && to.meta.role !== userRole) {
        return next('/not-authorized')
    }

    next()
})


export default router;
