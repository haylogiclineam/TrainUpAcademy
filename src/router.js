import { createRouter, createWebHistory } from 'vue-router';

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

const routes = [
    { path: '/', component: Home },
    { path: '/about', component: About },
    { path: '/contact', component: Contact },
    { path: '/courses', component: Courses },
    { path: '/single-course', component: SingleCourse },
    { path: '/blog', component: Blog },
    { path: '/single-blog', component: SingleBlog },
    { path: '/why-choose-us', component: WhyChooseUs },
    { path: '/sign-in', component: SignIn },
    { path: '/sign-up', component: SignUp },
    { path: '/verify', component: VerificationCode },
    { path: '/forgot-password', component: ForgotPassword },
    { path: '/change-password', component: ChangePassword },
];

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return { top: 0 };
    },
});

export default router;
