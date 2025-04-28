<script setup>
import {computed, ref} from "vue";
import {useRoute} from "vue-router";

const rating = ref(5);

const setRating = (star) => {
    rating.value = star;
};

const route = useRoute();
const isHomePage = computed(() => route.path === '/');
const isCoursesPage = computed(() => route.path === '/courses');

const onlineCoursesSectionClass = computed(() => {
    const classes = {
        '/': 'online-course-section',
        '/courses': 'online-course-section-for-courses',
    };
    return classes[route.path] || 'online-course-section';
});

const courseTextClass = computed(() => {
    return route.path === '/courses' ? 'course-text-primary' : '';
});

const courseItemClass = computed(() => {
    return route.path === '/courses' ? 'course-item-for-courses' : '';
});

const courses = ref([
    {
        title: "Intro to Python",
        price: 654,
        img: "/assets/images/home/courses/course-1.png"
    },
    {
        title: "Advanced JavaScript",
        price: 499,
        img: "/assets/images/home/courses/course-2.png"
    },
    {
        title: "Vue.js for Beginners",
        price: 399,
        img: "/assets/images/home/courses/course-1.png"
    },
    {
        title: "Fullstack Development",
        price: 799,
        img: "/assets/images/home/courses/course-2.png"
    },
]);

const visibleCourses = computed(() => {
    return isHomePage.value ? courses.value.slice(0, 2) : courses.value.slice(0, 4);
});

</script>
<template>
    <div :class="onlineCoursesSectionClass">
        <div class="container">
            <div class="online-course-content position-relative">
                <div class="d-flex justify-content-between align-items-center content-title-block">
                    <div class="course-content" :class="courseTextClass">
                        <h3 class="text-capitalize">Featured Online Course</h3>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec
                            ullamcorper
                            mattis, pulvinar</p>
                    </div>
                    <div class="learn-more-btn-div d-flex justify-content-center align-items-center">
                        <button class="learn-more-btn">
                            Learn more
                        </button>
                    </div>

                </div>
                <div class="courses flex-wrap d-flex justify-content-between align-items-center">
                    <div v-for="(course, index) in visibleCourses" :key="index" class="course-item d-flex" :class="courseItemClass">
                        <div class="item-img">
                            <img :src="course.img" :alt="course.title">
                        </div>
                        <div class="item-content">
                            <div class="d-flex justify-content-between align-items-center">
                                <h6 class="price">$ {{ course.price }}</h6>
                                <div class="rating">
                                    <svg
                                        v-for="star in 5"
                                        :key="star"
                                        :class="{ filled: star <= rating }"
                                        @click="setRating(star)"
                                        width="20"
                                        height="21"
                                        viewBox="0 0 20 21"
                                        fill="none"
                                        xmlns="http://www.w3.org/2000/svg"
                                    >
                                        <g clip-path="url(#clip0)">
                                            <path
                                                d="M16.2225 19.93L10 15.3567L3.77751 19.93L6.16668 12.5442L-0.0524902 8.00002H7.62584L10 0.601685L12.3742 8.00002H20.0517L13.8333 12.5442L16.2225 19.93Z"
                                                :fill="star <= rating ? '#F0AD4E' : '#D3D3D3'"
                                            />
                                        </g>
                                        <defs>
                                            <clipPath id="clip0">
                                                <rect width="20" height="20" fill="white" transform="translate(0 0.5)"/>
                                            </clipPath>
                                        </defs>
                                    </svg>
                                </div>
                            </div>
                            <div class="content">
                                <h1 class="text-capitalize">{{ course.title }}</h1>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit</p>
                            </div>
                            <div class="course-learn-more-btn-div d-flex justify-content-center align-items-center">
                                <RouterLink to="/single-course" custom v-slot="{ navigate }">
                                    <button @click="navigate" class="course-learn-more-btn">
                                        Learn more
                                    </button>
                                </RouterLink>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
.online-course-section,
.online-course-section-for-courses {
    background-size: cover;
    background-repeat: no-repeat;
    position: relative;
    padding: 8% 0;
}

.online-course-section {
    background-image: url("/assets/images/home/online-course.png");
}

.online-course-section::before {
    content: '';
    width: 100%;
    height: 100%;
    background: var(--online-course);
    position: absolute;
    top: 0;
    left: 0;
}

.online-course-content {
    display: flex;
    flex-direction: column;
    gap: 60px;
}

.courses {
    gap: 20px;
}

.course-content {
    display: flex;
    flex-direction: column;
    gap: 14px;
}

.course-content h3 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--white-245);
    text-transform: capitalize;
}

.course-content p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
    width: 55%;
}

.course-text-primary h3,
.course-text-primary p {
    color: var(--primary-100) !important;
}


.learn-more-btn,
.course-learn-more-btn {
    gap: 10px;
    border-radius: 70px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 1px;
    color: var(--white-229);
    cursor: pointer;
    outline: none;
    border: none;
}

.learn-more-btn {
    background: var(--general-btn);
    width: 176px;
    height: 53px;
}

.learn-more-btn:hover {
    height: 56px;
    width: 186px;
    font-size: 18px;
}

.learn-more-btn-div {
    height: 56px;
    width: 186px;
}

.course-learn-more-btn {
    width: 150px;
    height: 48px;
    background: var(--general-btn-light);
}

.course-learn-more-btn-div {
    height: 51px;
    width: 159px;
}

.course-learn-more-btn:hover {
    width: 159px;
    height: 51px;
    font-size: 18px;
}

.course-item {
    min-height: 304px;
    border-radius: 16px;
    border-width: 2px;
    border-color: var(--secondary-2-90);
    border-style: solid;
    backdrop-filter: blur(10px);
    background-color: var(--white-217);
    width: 100%;
}

.course-item-for-courses {
    border: none;
    border-radius: 16px;
    max-width: 587px;
    min-height: 304px;
    background-image: url("/assets/images/courses/courses-items.png");
    background-repeat: no-repeat;
    background-position: 62% 31%;
    background-size: cover;
    position: relative;
    overflow: hidden;
    width: 100%;

}

.course-item {
    flex: 1 1 calc(50% - 20px); /* full width on small screens */
    max-width: 50%;
}

.course-item-for-courses  > * {
    position: relative;
    z-index: 1;
}

.item-img {
    width: 217px;
    min-height: 100%;
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
}

.item-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-top-left-radius: 14px;
    border-bottom-left-radius: 14px;
}

.rating {
    display: flex;
    gap: 5px;
    cursor: pointer;
}

svg {
    fill: var(--white-245);
    transition: fill 0.2s;
}

.filled {
    fill: var(--star-rating);
}

polygon {
    stroke: none;
    stroke-width: 0;
}

.item-content {
    width: 75%;
    display: flex;
    flex-direction: column;
    gap: 28px;
    padding: 4%;
}

.item-content .price {
    font-family: var(--font-montserrat);
    font-weight: 300;
    font-size: 22px;
    line-height: 100%;
    letter-spacing: 0%;
    color: var(--secondary-1-100);
}

.item-content .content {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.item-content .content h1 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 22px;
    line-height: 100%;
    letter-spacing: 2%;
    color: var(--white-245);
}


.item-content .content p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .online-course-section,
    .online-course-section-for-courses{
        padding: 18% 0 13%;
    }

    .content-title-block {
        flex-direction: column;
    }

    .course-content h3 {
        font-size: 22px;
        text-align: center;
        font-weight: 300;
    }

    .course-content p {
        width: 100%;
        text-align: center;
        font-size: 14px;
        padding: 0 10px;
    }

    .learn-more-btn-div {
        width: 190px;
        height: 50px;
    }

    .learn-more-btn:hover {
        width: 190px;
        height: 50px;
        font-size: 20px;
    }

    .learn-more-btn {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .courses {
        flex-direction: column;
        gap: 20px;
    }

    .course-item {
        width: 100%;
        height: fit-content;
        flex-direction: column;
    }

    .course-item,
    .item-img img {
        border-radius: 8px !important;
    }

    .item-img {
        width: 100% !important;
        height: 200px;
    }

    .item-img img {
        width: 100% !important;
        height: 100%;
        object-position: 12% 12%;
    }

    .item-content {
        width: 100%;
        gap: 18px;
    }

    .item-content .price {
        font-size: 18px;
    }

    .rating svg {
        width: 18px;
        height: 18px;
    }

    .item-content .content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .item-content .content h1 {
        font-size: 14px;
        text-align: center;
    }

    .item-content .content p {
        font-size: 12px;
        text-align: center;
        width: 80%;
        margin: 0;
    }

    .course-learn-more-btn-div {
        display: flex;
        align-items: center;
        width: 100% !important;
        height: 44px;
    }

    .course-learn-more-btn:hover {
        height: 44px;
        width: 140px;
        font-size: 16px;
    }

    .course-learn-more-btn {
        width: 131px;
        height: 41px;
        font-size: 14px;
    }

    .course-item {
        flex: 1 1 calc(100% - 20px); /* full width on small screens */
        max-width: 100%;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .online-course-section,
    .online-course-section-for-courses{
        padding: 10% 0 8%;
    }

    .content-title-block {
        flex-direction: column;
    }

    .course-content h3 {
        font-size: 22px;
        text-align: center;
        font-weight: 300;
    }

    .course-content p {
        width: 100%;
        text-align: center;
        font-size: 14px;
        padding: 0 10px;
    }

    .learn-more-btn-div {
        width: 190px;
        height: 50px;
    }

    .learn-more-btn:hover {
        width: 190px;
        height: 50px;
        font-size: 20px;
    }

    .learn-more-btn {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .courses {
        flex-direction: column;
        gap: 20px;
    }

    .course-item {
        width: 100%;
        height: fit-content;
        flex-direction: column;
    }

    .course-item,
    .item-img img {
        border-radius: 8px !important;
    }

    .item-img {
        width: 100% !important;
        height: 300px;
    }

    .item-img img {
        width: 100% !important;
        height: 100%;
        object-position: 12% 12%;
    }

    .item-content {
        width: 100%;
        gap: 18px;
    }

    .item-content .price {
        font-size: 18px;
    }

    .rating svg {
        width: 18px;
        height: 18px;
    }

    .item-content .content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .item-content .content h1 {
        font-size: 14px;
        text-align: center;
    }

    .item-content .content p {
        font-size: 12px;
        text-align: center;
        width: 80%;
        margin: 0;
    }

    .course-learn-more-btn-div {
        display: flex;
        align-items: center;
        width: 100% !important;
        height: 44px;
    }

    .course-learn-more-btn:hover {
        height: 44px;
        width: 150px;
        font-size: 16px;
    }

    .course-learn-more-btn {
        width: 141px;
        height: 41px;
        font-size: 14px;
    }

    .course-item {
        flex: 1 1 calc(100% - 20px); /* full width on small screens */
        max-width: 100%;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .online-course-section,
    .online-course-section-for-courses{
        padding: 10% 0 8%;
    }

    .content-title-block {
        flex-direction: column;
    }

    .course-content h3 {
        font-size: 38px;
        text-align: center;
        font-weight: 300;
    }

    .course-content p {
        width: 100%;
        text-align: center;
        font-size: 16px;
        padding: 0 10px;
    }

    .learn-more-btn-div {
        width: 190px;
        height: 50px;
    }

    .learn-more-btn:hover {
        width: 190px;
        height: 50px;
        font-size: 20px;
    }

    .learn-more-btn {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .courses {
        flex-direction: column;
        gap: 20px;
    }

    .course-item{
        width: 100%;
        height: fit-content;
        flex-direction: column;
    }

    .course-item,
    .item-img img {
        border-radius: 8px !important;
    }

    .item-img {
        width: 100% !important;
        height: 300px;
    }

    .item-img img {
        width: 100% !important;
        height: 100%;
        object-position: 12% 12%;
    }

    .item-content {
        width: 100%;
        gap: 18px;
    }

    .item-content .price {
        font-size: 20px;
    }

    .rating svg {
        width: 24px;
        height: 24px;
    }

    .item-content .content {
        display: flex;
        flex-direction: column;
        align-items: center;
    }

    .item-content .content h1 {
        font-size: 20px;
        text-align: center;
    }

    .item-content .content p {
        font-size: 16px;
        text-align: center;
        width: 80%;
        margin: 0;
    }

    .course-learn-more-btn-div {
        display: flex;
        align-items: center;
        width: 100% !important;
        height: 44px;
    }

    .course-learn-more-btn:hover {
        height: 44px;
        width: 160px;
        font-size: 18px;
    }

    .course-learn-more-btn {
        width: 150px;
        height: 41px;
        font-size: 16px;
    }

    .course-item {
        flex: 1 1 calc(100% - 20px); /* full width on small screens */
        max-width: 100%;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .item-content .content h1 {
        font-size: 18px !important;
    }

    .course-item {
        flex: 1 1 calc(50% - 20px); /* full width on small screens */
        max-width: 50%;
    }
}



</style>