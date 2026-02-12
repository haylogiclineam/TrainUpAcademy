<script setup>
import {ref, computed} from 'vue';
import {useRoute} from 'vue-router';

const route = useRoute();
const isWhyChooseUsPage = computed(() => route.path === '/why-choose-us');

const whyChooseContentClass = computed(() => {
    const classes = {
        '/why-choose-us': 'why-choose-us-content-d-none',
    };
    return classes[route.path] || 'why-choose-us-content';
});

const whyChooseUsItemsClass = computed(() => {
    const classes = {
        '/why-choose-us': 'why-choose-us-items-full-w',
        '/about': 'why-choose-us-items-full-w',
        '/courses': 'why-choose-us-items-full-w',
    };
    return classes[route.path] || 'why-choose-us-items';
});

</script>

<template>
    <div class="why-choose-us-section">
        <div class="container">
            <div class="why-choose-us-main">
                <div :class="whyChooseContentClass" class="d-flex justify-content-between align-items-center">
                    <h3 class="text-capitalize">{{ $t('about.why_choose_us') }}</h3>
                    <p>{{ $t('about.why_choose_us_text') }}</p>
                    <div class="learn-more-btn-div d-flex align-items-center">
                        <button class="learn-more-btn">
                            {{ $t('learn_more') }}
                        </button>
                    </div>
                </div>
                <div :class="whyChooseUsItemsClass" class="d-flex justify-content-between align-items-center">
                    <div class="item-1">
                        <div class="w-90">
                            <h5 class="text-capitalize">{{ $t('why_choose_us_text.blok_1.title') }}</h5>
                            <p>{{ $t('why_choose_us_text.blok_1.text') }}</p>
                            <a class="text-decoration-none" href="">{{ $t('learn_more') }}</a>
                        </div>
                    </div>

                    <div class="item-2">
                        <div class="w-90">
                            <h5 class="text-capitalize">{{ $t('why_choose_us_text.blok_2.title') }}</h5>
                            <p>{{ $t('why_choose_us_text.blok_2.text') }}</p>
                            <a class="text-decoration-none" href="">{{ $t('learn_more') }}</a>
                        </div>
                    </div>

                    <div class="item-1">
                        <div class="w-90">
                            <h5 class="text-capitalize">{{ $t('why_choose_us_text.blok_3.title') }}</h5>
                            <p>{{ $t('why_choose_us_text.blok_3.text') }}</p>
                            <a class="text-decoration-none" href="">{{ $t('learn_more') }}</a>
                        </div>
                    </div>

                    <div class="item-2">
                        <div class="w-90">
                            <h5 class="text-capitalize">{{ $t('why_choose_us_text.blok_4.title') }}</h5>
                            <p>{{ $t('why_choose_us_text.blok_4.text') }}</p>
                            <a class="text-decoration-none" href="">{{ $t('learn_more') }}</a>
                        </div>
                    </div>

                    <div class="item-1">
                        <div class="w-90">
                            <h5 class="text-capitalize">{{ $t('why_choose_us_text.blok_5.title') }}</h5>
                            <p>{{ $t('why_choose_us_text.blok_5.text') }}</p>
                            <a class="text-decoration-none" href="">{{ $t('learn_more') }}</a>
                        </div>
                    </div>

                    <div class="item-2">
                        <div class="w-90">
                            <h5 class="text-capitalize">{{ $t('why_choose_us_text.blok_6.title') }}</h5>
                            <p>{{ $t('why_choose_us_text.blok_6.text') }}</p>
                            <a class="text-decoration-none" href="">{{ $t('learn_more') }}</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.why-choose-us-section {
    padding: 8% 0;
}

.why-choose-us-main {
    display: flex;
    flex-direction: column;
    gap: 60px;
}

.why-choose-us-content-d-none {
    display: none !important;
}

.why-choose-us-content-d-none .learn-more-btn-div{
    display: none !important;
}

.why-choose-us-content h3 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-100);
    width: 29%;
}

.why-choose-us-content p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-60);
    width: 39%;
}

.learn-more-btn {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    padding: 13px 28px;
    gap: 10px;
    border-radius: 25px;
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 16px;
    line-height: 20px;
    color: var(--white-245);
    cursor: pointer;
    background: var(--general-btn);
    outline: none;
    border: none;
    text-transform: capitalize;
    white-space: nowrap;
    transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.learn-more-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 12px rgba(75, 187, 228, 0.3);
}

.learn-more-btn-div {
    display: flex;
}

.learn-more-btn-div a {
    text-decoration: none;
}

.why-choose-us-items,
.why-choose-us-items-full-w {
    gap: 20px;
}

.why-choose-us-items-full-w {
    display: flex;
    flex-direction: column !important;
}

.why-choose-us-items .item-1,
.why-choose-us-items .item-3 {
    background: var(--why-choose-us-item);
}

.why-choose-us-items-full-w .item-1,
.why-choose-us-items-full-w .item-2,
.why-choose-us-items-full-w .item-3 {
    background: transparent;
    border: 1.5px solid #001028;
}

.why-choose-us-items .item-1,
.why-choose-us-items .item-2,
.why-choose-us-items .item-3 {
    width: 370px;
    min-height: 374px;
    border-radius: 16px;
    display: flex;
    justify-content: center;
    align-items: center;
}

.why-choose-us-items-full-w .item-1,
.why-choose-us-items-full-w .item-2,
.why-choose-us-items-full-w .item-3 {
    width: 100%;
    min-height: 196px;
    border-radius: 16px;
    display: flex;
    justify-content: flex-start;
    align-items: flex-start;
    padding: 40px;
}

.why-choose-us-items-full-w .item-1 a,
.why-choose-us-items-full-w .item-2 a,
.why-choose-us-items-full-w .item-3 a{
   display: none !important;
}

.why-choose-us-items-full-w .item-1 h5,
.why-choose-us-items-full-w .item-2 h5,
.why-choose-us-items-full-w .item-3 h5 {
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 22px;
    line-height: 27px;
    letter-spacing: 0.02em;
    color: #001028;
}

.why-choose-us-items-full-w .item-1 p,
.why-choose-us-items-full-w .item-2 p,
.why-choose-us-items-full-w .item-3 p {
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 16px;
    line-height: 19px;
    color: #001028;
}

.why-choose-us-items .item-2 {
    position: relative;
    background: var(--why-choose-us-item-rgb);
    overflow: hidden;
}


.why-choose-us-items .item-2::before {
    content: '';
    background-image: url("/assets/images/home/header-background.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    width: 100%;
    height: 100%;
    position: absolute;
    top: 0;
    left: 0;
    z-index: -1;
}

.why-choose-us-items-full-w .w-90 {
    width: 100% !important;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.item-1 h5,
.item-2 h5,
.item-3 h5 {
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 22px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--white-255);
}

.item-1 p,
.item-2 p,
.item-3 p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-10);
}

.item-1 a,
.item-2 a,
.item-3 a {
    font-family: var(--font-montserrat);
    font-weight: 300;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--secondary-1-100);
}

.item-1 a:hover,
.item-2 a:hover,
.item-3 a:hover {
    font-weight: 400;
}

.why-choose-us-items .w-90 {
    width: 90%;
    display: flex;
    flex-direction: column;
    gap: 12px;
}


.why-choose-us-items-full-w .w-90 {
    width: 100% !important;
    display: flex;
    flex-direction: column;
    gap: 12px;
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .why-choose-us-section {
        padding: 18% 0 13%;
    }

    .why-choose-us-main {
        gap: 40px;
    }

    .why-choose-us-content {
        flex-direction: column;
    }

    .why-choose-us-content h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .why-choose-us-content p {
        font-size: 14px;
    }

    .why-choose-us-content p,
    .why-choose-us-content h3 {
        width: 100%;
        text-align: center;
    }

    .learn-more-btn {
        padding: 10px 22px;
        font-size: 14px;
    }

    .learn-more-btn:hover {
        transform: scale(1.03);
    }

    .why-choose-us-items {
        flex-direction: column;
        gap: 20px;
    }

    .why-choose-us-items .w-90 {
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .item-1 p,
    .item-2 p,
    .item-3 p {
        font-size: 14px;
    }

    .why-choose-us-items .item-1 p,
    .why-choose-us-items .item-2 p,
    .why-choose-us-items .item-3 p {
        text-align: center;
    }

     .item-1 h5,
    .item-2 h5,
     .item-3 h5 {
        font-size: 18px;
        font-weight: 300;
    }

    .item-1 a,
    .item-2 a,
     .item-3 a {
        font-size: 14px;
    }


    .why-choose-us-items .item-1,
    .why-choose-us-items .item-2,
    .why-choose-us-items .item-3 {
        min-height: 255px;
        padding: 34px 12px;
        width: 100%;
        border-radius: 8px;
    }

    .item-1 a:hover,
    .item-2 a:hover,
    .item-3 a:hover {
        font-weight: 300;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .why-choose-us-section {
        padding: 10% 0 8%;
    }

    .why-choose-us-main {
        gap: 40px;
    }

    .why-choose-us-content {
        flex-direction: column;
    }

    .why-choose-us-content h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .why-choose-us-content p {
        font-size: 14px;
    }

    .why-choose-us-content p,
    .why-choose-us-content h3 {
        width: 100%;
        text-align: center;
    }

    .learn-more-btn {
        padding: 10px 22px;
        font-size: 14px;
    }

    .learn-more-btn:hover {
        transform: scale(1.03);
    }

    .why-choose-us-items {
        flex-direction: column;
        gap: 20px;
    }

    .why-choose-us-items .w-90 {
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

     .item-1 p,
    .item-2 p,
     .item-3 p {
        font-size: 14px;
    }

    .why-choose-us-items .item-1 p,
    .why-choose-us-items .item-2 p,
    .why-choose-us-items .item-3 p {
        text-align: center;
    }

     .item-1 h5,
     .item-2 h5,
   .item-3 h5 {
        font-size: 18px;
        font-weight: 300;
    }

    .item-1 a,
     .item-2 a,
     .item-3 a {
        font-size: 14px;
    }


    .why-choose-us-items .item-1,
    .why-choose-us-items .item-2,
    .why-choose-us-items .item-3 {
        min-height: 255px;
        padding: 34px 12px;
        width: 100%;
        border-radius: 8px;
    }

    .item-1 a:hover,
    .item-2 a:hover,
    .item-3 a:hover {
        font-weight: 300;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .why-choose-us-section {
        padding: 10% 0 8%;
    }

    .why-choose-us-main {
        gap: 40px;
    }

    .why-choose-us-content {
        flex-direction: column;
    }

    .why-choose-us-content h3 {
        font-size: 38px;
        font-weight: 300;
    }

    .why-choose-us-content p {
        font-size: 16px;
    }

    .why-choose-us-content p,
    .why-choose-us-content h3 {
        width: 100%;
        text-align: center;
    }

    .learn-more-btn {
        padding: 11px 24px;
        font-size: 15px;
    }

    .learn-more-btn:hover {
        transform: scale(1.04);
    }

    .why-choose-us-items {
        flex-direction: column;
        gap: 20px;
    }

    .why-choose-us-items .w-90 {
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .why-choose-us-items .item-1 p,
    .why-choose-us-items .item-2 p,
    .why-choose-us-items .item-3 p {
        text-align: center;
    }

     .item-1 p,
     .item-2 p,
   .item-3 p {
        font-size: 16px;
    }

    .item-1 h5,
     .item-2 h5,
    .item-3 h5 {
        font-size: 20px;
        font-weight: 300;
    }

     .item-1 a,
     .item-2 a,
     .item-3 a {
        font-size: 16px;
    }


    .why-choose-us-items .item-1,
    .why-choose-us-items .item-2,
    .why-choose-us-items .item-3 {
        min-height: 255px;
        padding: 34px 12px;
        width: 100%;
        border-radius: 8px;
    }

    .item-1 a:hover,
    .item-2 a:hover,
    .item-3 a:hover {
        font-weight: 300;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .why-choose-us-items {
        gap: 20px;
    }

    .why-choose-us-items .item-1,
    .why-choose-us-items .item-2,
    .why-choose-us-items .item-3 {
        min-height: 400px;
        padding: 34px 12px;
        width: 100%;
        border-radius: 8px;
    }
}

/* Extra Large Devices */
@media (min-width: 1600px) {
    .why-choose-us-items .item-1,
    .why-choose-us-items .item-2,
    .why-choose-us-items .item-3 {
        width: 100%;
        min-height: 300px;
    }
}


</style>