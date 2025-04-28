<script setup>
import {useRoute} from "vue-router";
import {computed} from "vue";

const route = useRoute();
const isHomePage = computed(() => route.path === '/');
const isBlogPage = computed(() => route.path === '/blog');
const isSingleBlogPage = computed(() => route.path === '/single-blog');

const blogArticleTitleClass = computed(() => {
    const classes = {
        '/': 'blog-article-title',
        '/blog': 'blog-article-title-d-none',
        '/single-blog': 'blog-article-title-d-none',
    };
    return classes[route.path] || 'blog-article-title';
});

const blogArticleSectionPaddingClass = computed(() => {
    const classes = {
        '/single-blog': 'blog-article-section-p',
    };
    return classes[route.path] || 'blog-article-section';
});

</script>

<template>
    <div class="blog-article-section" :class="blogArticleSectionPaddingClass">
        <div class="container">
            <div class="d-flex flex-column justify-content-center align-items-center blog-article-main w-100">
                <div :class="blogArticleTitleClass">
                    <h3 class="text-capitalize">Blog And Article</h3>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper
                        mattis, pulvinar</p>
                </div>
                <div v-if="isHomePage || isSingleBlogPage" class="blog-article-items flex-wrap d-flex align-items-center">
                    <div class="item">
                        <div class="item-img">
                            <img src="/assets/images/home/blog-article/blog-1.png" alt="blog-1">
                        </div>
                        <div class="item-date d-flex align-items-center">
                            <img src="/assets/icons/blog-article/calendar.svg" alt="calendar">
                            <span>March 13, 2025</span>
                        </div>
                        <div class="item-content d-flex flex-column">
                            <h5 class="text-capitalize">Classroom To Computer</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec </p>
                            <div class="learn-more-btn-div d-flex justify-content-center align-items-center">
                                <RouterLink to="/single-blog" custom v-slot="{ navigate }">
                                    <button @click="navigate" class="learn-more-btn">
                                        Learn more
                                    </button>
                                </RouterLink>
                            </div>
                        </div>

                    </div>
                    <div class="item">
                        <div class="item-img">
                            <img src="/assets/images/home/blog-article/blog-2.png" alt="blog-2">
                        </div>
                        <div class="item-date d-flex align-items-center">
                            <img src="/assets/icons/blog-article/calendar.svg" alt="calendar">
                            <span>March 13, 2025</span>
                        </div>
                        <div class="item-content d-flex flex-column">
                            <h5 class="text-capitalize">Classroom To Computer</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec </p>
                            <div class="learn-more-btn-div d-flex justify-content-center align-items-center">
                                <RouterLink to="/single-blog" custom v-slot="{ navigate }">
                                    <button @click="navigate" class="learn-more-btn">
                                        Learn more
                                    </button>
                                </RouterLink>
                            </div>
                        </div>

                    </div>
                    <div class="item">
                        <div class="item-img">
                            <img src="/assets/images/home/blog-article/blog-3.png" alt="blog-3">
                        </div>
                        <div class="item-date d-flex align-items-center">
                            <img src="/assets/icons/blog-article/calendar.svg" alt="calendar">
                            <span>March 13, 2025</span>
                        </div>
                        <div class="item-content d-flex flex-column">
                            <h5 class="text-capitalize">Classroom To Computer</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec </p>
                            <div class="learn-more-btn-div d-flex justify-content-center align-items-center">
                                <RouterLink to="/single-blog" custom v-slot="{ navigate }">
                                    <button @click="navigate" class="learn-more-btn">
                                        Learn more
                                    </button>
                                </RouterLink>
                            </div>
                        </div>

                    </div>
                </div>
                <div v-if="isBlogPage" class="blog-article-items d-flex flex-wrap  align-items-center">
                    <div class="item">
                        <div class="item-img">
                            <img src="/assets/images/home/blog-article/blog-1.png" alt="blog-1">
                        </div>
                        <div class="item-date d-flex align-items-center">
                            <img src="/assets/icons/blog-article/calendar.svg" alt="calendar">
                            <span>March 13, 2025</span>
                        </div>
                        <div class="item-content d-flex flex-column">
                            <h5 class="text-capitalize">Classroom To Computer</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec </p>
                            <div class="learn-more-btn-div d-flex justify-content-center align-items-center">
                                <RouterLink to="/single-blog" custom v-slot="{ navigate }">
                                    <button @click="navigate" class="learn-more-btn">
                                        Learn more
                                    </button>
                                </RouterLink>
                            </div>
                        </div>

                    </div>
                    <div class="item">
                        <div class="item-img">
                            <img src="/assets/images/home/blog-article/blog-2.png" alt="blog-2">
                        </div>
                        <div class="item-date d-flex align-items-center">
                            <img src="/assets/icons/blog-article/calendar.svg" alt="calendar">
                            <span>March 13, 2025</span>
                        </div>
                        <div class="item-content d-flex flex-column">
                            <h5 class="text-capitalize">Classroom To Computer</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec </p>
                            <div class="learn-more-btn-div d-flex justify-content-center align-items-center">
                                <RouterLink to="/single-blog" custom v-slot="{ navigate }">
                                    <button @click="navigate" class="learn-more-btn">
                                        Learn more
                                    </button>
                                </RouterLink>
                            </div>
                        </div>

                    </div>
                    <div class="item">
                        <div class="item-img">
                            <img src="/assets/images/home/blog-article/blog-3.png" alt="blog-3">
                        </div>
                        <div class="item-date d-flex align-items-center">
                            <img src="/assets/icons/blog-article/calendar.svg" alt="calendar">
                            <span>March 13, 2025</span>
                        </div>
                        <div class="item-content d-flex flex-column">
                            <h5 class="text-capitalize">Classroom To Computer</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec </p>
                            <div class="learn-more-btn-div d-flex justify-content-center align-items-center">
                                <RouterLink to="/single-blog" custom v-slot="{ navigate }">
                                    <button @click="navigate" class="learn-more-btn">
                                        Learn more
                                    </button>
                                </RouterLink>
                            </div>
                        </div>

                    </div>
                    <div class="item">
                        <div class="item-img">
                            <img src="/assets/images/home/blog-article/blog-3.png" alt="blog-3">
                        </div>
                        <div class="item-date d-flex align-items-center">
                            <img src="/assets/icons/blog-article/calendar.svg" alt="calendar">
                            <span>March 13, 2025</span>
                        </div>
                        <div class="item-content d-flex flex-column">
                            <h5 class="text-capitalize">Classroom To Computer</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec </p>
                            <div class="learn-more-btn-div d-flex justify-content-center align-items-center">
                                <RouterLink to="/single-blog" custom v-slot="{ navigate }">
                                    <button @click="navigate" class="learn-more-btn">
                                        Learn more
                                    </button>
                                </RouterLink>
                            </div>
                        </div>

                    </div>
                    <div class="item">
                        <div class="item-img">
                            <img src="/assets/images/home/blog-article/blog-3.png" alt="blog-3">
                        </div>
                        <div class="item-date d-flex align-items-center">
                            <img src="/assets/icons/blog-article/calendar.svg" alt="calendar">
                            <span>March 13, 2025</span>
                        </div>
                        <div class="item-content d-flex flex-column">
                            <h5 class="text-capitalize">Classroom To Computer</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec </p>
                            <div class="learn-more-btn-div d-flex justify-content-center align-items-center">
                                <RouterLink to="/single-blog" custom v-slot="{ navigate }">
                                    <button @click="navigate" class="learn-more-btn">
                                        Learn more
                                    </button>
                                </RouterLink>
                            </div>
                        </div>

                    </div>
                    <div class="item">
                        <div class="item-img">
                            <img src="/assets/images/home/blog-article/blog-3.png" alt="blog-3">
                        </div>
                        <div class="item-date d-flex align-items-center">
                            <img src="/assets/icons/blog-article/calendar.svg" alt="calendar">
                            <span>March 13, 2025</span>
                        </div>
                        <div class="item-content d-flex flex-column">
                            <h5 class="text-capitalize">Classroom To Computer</h5>
                            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec </p>
                            <div class="learn-more-btn-div d-flex justify-content-center align-items-center">
                                <RouterLink to="/single-blog" custom v-slot="{ navigate }">
                                    <button @click="navigate" class="learn-more-btn">
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
.blog-article-section {
    padding: 8% 0;
}

.blog-article-section-p{
    padding: 2% 0 0 0;
}

.blog-article-main {
    gap: 60px;
}

.blog-article-title-d-none{
    display: none !important;
}

.blog-article-title {
    width: 60%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.blog-article-title h3 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    text-align: center;
    color: var(--primary-100);
    margin: 0;
}

.blog-article-title p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    text-align: center;
    color: var(--primary-60);
    margin: 0;
}

.blog-article-items {
    width: 100%;
    gap:20px;
}

.blog-article-items .item {
    width: 370px;
    min-height: 502px;
    border-radius: 16px;
    background: var(--blog-article-item-bg);
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.blog-article-items .item-img {
    width: 100%;
    min-height: 240px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
}

.blog-article-items .item-img img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 8px;
    position: absolute;
    top: 0;
    left: 0;
}

.item-date span {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--secondary-1-100);
}

.item-date img {
    margin-right: 10px;
}

.learn-more-btn {
    gap: 10px;
    border-radius: 70px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 1px;
    color: var(--white-229);
    cursor: pointer;
    width: 148px;
    height: 46px;
    background: var(--general-btn);
    border: none;
    outline: none;
}

.learn-more-btn:hover {
    height: 49px;
    width: 158px;
    font-size: 18px;
}

.learn-more-btn-div {
    height: 49px;
    width: 158px;
}

.item-content {
    gap: 20px;
}

.item-content h5,
.item-content p {
    line-height: normal;
    letter-spacing: 2%;
    color: var(--white-245);
    margin: 0;
}

.item-content h5 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 20px;
}

.item-content p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .blog-article-section {
        padding: 18% 0 13%;
    }

    .blog-article-title {
        width: 100%;
    }

    .blog-article-title h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .blog-article-title p {
        font-size: 14px;
    }

    .blog-article-main {
        gap: 40px;
    }

    .blog-article-items {
        flex-direction: column;
        gap: 20px;
    }

    .blog-article-items .item {
        display: flex;
        align-items: center;
        border-radius: 8px;
        width: 100%;
        height: auto;
        min-height: auto;
    }

    .item-content {
        align-items: center;
    }

    .item-content p {
        text-align: center;
        font-size: 14px;
    }

    .item-date img {
        width: 18px;
        height: 18px;
    }

    .item-date span {
        font-size: 14px;
    }

    .item-content h5 {
        font-size: 16px;
    }

    .learn-more-btn {
        width: 131px;
        height: 41px;
        font-size: 14px;
    }

    .learn-more-btn:hover {
        width: 140px;
        height: 44px;
        font-size: 16px;
    }

    .learn-more-btn-div{
        width: 140px;
        height: 44px;
    }

    .blog-article-items .item-img{
        width: 100%;
        height: auto;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .blog-article-section {
        padding: 10% 0 8%;
    }

    .blog-article-title {
        width: 100%;
    }

    .blog-article-title h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .blog-article-title p {
        font-size: 14px;
    }

    .blog-article-main {
        gap: 40px;
    }

    .blog-article-items {
        flex-direction: column;
        gap: 20px;
    }

    .blog-article-items .item {
        display: flex;
        align-items: center;
        border-radius: 8px;
        width: 100%;
        height: auto;
        min-height: auto;
    }

    .item-content {
        align-items: center;
    }

    .item-content p {
        text-align: center;
        font-size: 14px;
    }

    .item-date img {
        width: 18px;
        height: 18px;
    }

    .item-date span {
        font-size: 14px;
    }

    .item-content h5 {
        font-size: 16px;
    }

    .learn-more-btn {
        width: 131px;
        height: 41px;
        font-size: 14px;
    }

    .learn-more-btn:hover {
        width: 140px;
        height: 44px;
        font-size: 16px;
    }

    .learn-more-btn-div{
        width: 140px;
        height: 44px;
    }

    .blog-article-items .item-img{
        width: 100%;
        height: auto;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .blog-article-section {
        padding: 10% 0 8%;
    }

    .blog-article-title {
        width: 100%;
    }

    .blog-article-title h3 {
        font-size: 38px;
        font-weight: 300;
    }

    .blog-article-title p {
        font-size: 16px;
    }

    .blog-article-main {
        gap: 35px;
    }

    .blog-article-items {
        flex-direction: column;
        gap: 20px;
    }

    .blog-article-items .item {
        display: flex;
        align-items: center;
        border-radius: 8px;
        width: 100%;
        height: auto;
        min-height: auto;
    }

    .item-content {
        align-items: center;
    }

    .item-content p {
        text-align: center;
        font-size: 16px;
    }

    .item-date img {
        width: 20px;
        height: 20px;
    }

    .item-date span {
        font-size: 16px;
    }

    .item-content h5 {
        font-size: 20px;
    }

    .learn-more-btn {
        width: 141px;
        height: 41px;
        font-size: 16px;
    }

    .learn-more-btn:hover {
        width: 160px;
        height: 48px;
        font-size: 18px;
    }

    .learn-more-btn-div{
        width: 160px;
        height: 48px;
    }

    .blog-article-items .item-img{
        width: 100%;
        height: auto;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .blog-article-items{
        flex-wrap: wrap;
        gap:20px;
        justify-content: center !important;
    }

    .blog-article-items .item{
        width: 48%;
    }
}

@media (min-width: 1200px) {
    .blog-article-items .item{
        width: 32%;
    }
}


/* Extra Large Devices */
@media (min-width: 1600px) {
    .blog-article-items .item{
       width: 32%;
   }
}


</style>