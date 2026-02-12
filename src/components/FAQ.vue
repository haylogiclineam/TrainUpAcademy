<script setup>
import {computed, ref, onMounted} from 'vue'
import {useRoute} from "vue-router";
import api from '/src/services/api.js';
import {useI18n} from "vue-i18n";
const openIndex = ref(0);

const { locale } = useI18n();

const toggle = (index) => {
    openIndex.value = openIndex.value === index ? null : index
}

const route = useRoute();
const isHomePage = computed(() => route.path === '/');
const isAboutPage = computed(() => route.path === '/about');
const isContactPage = computed(() => route.path === '/contact');
const loading = ref(false);

const faqSectionClass = computed(() => {
    const classes = {
        '/': 'faq-section',
        '/about': 'faq-section-transparent',
        '/contact': 'faq-section-transparent',
    };
    return classes[route.path] || 'faq-section';
});

const faqQuestionsClass = computed(() => {
    const classes = {
        '/': 'faq-questions',
        '/about': 'about-faq-questions',
        '/contact': 'about-faq-questions',
    };
    return classes[route.path] || 'faq-questions';
});

const faqAnswerClass = computed(() => {
    const classes = {
        '/': 'faq-answer',
        '/about': 'about-faq-answer',
        '/contact': 'about-faq-answer',
    };
    return classes[route.path] || 'faq-answer';
});


const questionClass = (index) => {
    if ((isAboutPage.value || isContactPage.value) && openIndex.value === index) {
        return 'question question-bg-active';
    }
    return 'question';
};


const faqItems = ref([])
const fetchError = ref(false)

onMounted(async () => {
    loading.value = true;
    try {
        const response = await api.get('/api/faqs')
        faqItems.value = response.data
    } catch (error) {
        console.error('Failed to fetch FAQs:', error)
        fetchError.value = true
    }finally {
        loading.value = false;
    }
})
</script>

<template>
    <div :class="faqSectionClass">
        <div class="container">
            <div class="d-flex justify-content-between faq-section-main">
                <div v-if="isHomePage" class="faq-content">
                    <h3 class="text-capitalize h3">{{ $t('faq_section.title') }}</h3>
                    <p class="p">{{ $t('faq_section.description') }}</p>

                </div>

                <div v-if="isAboutPage || isContactPage" class="about-faq-content">
                    <h3 class="text-capitalize h3">{{ $t('about.faq') }}</h3>
                </div>
                <div v-if="loading" class="d-flex justify-content-center align-items-center my-5">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="visually-hidden">{{ $t('loading') }}...</span>
                    </div>
                </div>
                <div v-else :class="faqQuestionsClass">
                    <div v-for="(item, index) in faqItems" :key="index">
                        <div :class="questionClass(index)" @click="toggle(index)">
                            <div class="question-content d-flex align-items-center"
                                 :class="{'question-icon-active': (isAboutPage || isContactPage) && openIndex === index}">
                                <span v-if="openIndex === index">
                                    <svg width="12" height="2" viewBox="0 0 12 2" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 0H1C0.447715 0 0 0.447715 0 1C0 1.55228 0.447715 2 1 2H11C11.5523 2 12 1.55228 12 1C12 0.447715 11.5523 0 11 0Z"
                                              fill="#F5F5F5"/>
                                    </svg>
                                </span>
                                                <span v-else>
                                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path d="M11 5H7V1C7 0.734784 6.89464 0.48043 6.70711 0.292893C6.51957 0.105357 6.26522 0 6 0C5.73478 0 5.48043 0.105357 5.29289 0.292893C5.10536 0.48043 5 0.734784 5 1V5H1C0.734784 5 0.48043 5.10536 0.292893 5.29289C0.105357 5.48043 0 5.73478 0 6C0 6.26522 0.105357 6.51957 0.292893 6.70711C0.48043 6.89464 0.734784 7 1 7H5V11C5 11.2652 5.10536 11.5196 5.29289 11.7071C5.48043 11.8946 5.73478 12 6 12C6.26522 12 6.51957 11.8946 6.70711 11.7071C6.89464 11.5196 7 11.2652 7 11V7H11C11.2652 7 11.5196 6.89464 11.7071 6.70711C11.8946 6.51957 12 6.26522 12 6C12 5.73478 11.8946 5.48043 11.7071 5.29289C11.5196 5.10536 11.2652 5 11 5Z"
                                              fill="#F5F5F5"/>
                                    </svg>
                                </span>
                                <span class="span">{{ item[`question_${locale}`] }}</span>
                            </div>
                        </div>
                        <div :class="faqAnswerClass" v-show="openIndex === index">
                            <div v-for="(answer, aIndex) in item.answers" :key="aIndex" class="mb-2 answer">
                                <p class="answer-p">{{ answer[`answer_${locale}`] }}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.faq-section {
    background: var(--faq-bg);
    padding: 8% 0 8%;
}

.faq-section-transparent {
    background: transparent;
    padding: 8% 0 8%;
}

.faq-content {
    width: 41%;
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.faq-content .h3,
.about-faq-content .h3 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    margin: 0;
}

.faq-content .h3 {
    color: var(--white-245);
}

.faq-content .p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-10);
}

.about-faq-content .h3 {
    color: var(--primary-100);
}

.about-faq-content {
    width: 34%;
}

.question {
    display: flex;
    align-items: center;
    cursor: pointer !important;
}

.faq-questions {
    width: 49%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: 347px;
}

.faq-questions .question {
    width: 100%;
    padding: 26px;
    border-radius: 16px;
    background: var(--primary-90);
}

.faq-questions .span {
    color: var(--white-245);
}

.about-faq-questions span {
    color: var(--primary-100);
}

.about-faq-questions img {
    fill: var(--primary-100);
}


.faq-questions .span,
.about-faq-questions span {
    font-family: var(--font-montserrat);
    font-weight: 300;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
}

.about-faq-questions {
    width: 70%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    min-height: 347px;
}

.about-faq-questions .question {
    width: 100%;
    padding: 26px;
    border-radius: 16px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    position: relative;
    overflow: hidden;
    border-width: 0.5px;
    border-style: solid;
    border-color: var(--primary-50);
    -webkit-appearance: none !important;
    box-sizing: border-box !important;
    outline: none !important;
    transform: scale(1) !important;
}

.question-bg-active .span {
    color: var(--white-245);
}

.about-faq-questions .question-content svg path {
    fill: var(--primary-100);
    transition: fill 0.3s ease;
}

.about-faq-questions .question-icon-active svg path {
    fill: var(--white-245);
}

.question-bg-active {
    background-image: url("/assets/images/repeting-image.jpg");
}

.about-faq-questions .question-bg-active:before {
    content: "";
    width: 100%;
    height: 100%;
    background: var(--about-faq-item);
    position: absolute;
    top: 0;
    left: 0;
}

.about-faq-questions .question-content {
    position: relative;
}

.question svg {
    margin-right: 20px;
    cursor: pointer;
}

.question-content {
    width: 100%;
}

.faq-answer .answer .answer-p {
    color: var(--white-245);
}

.faq-answer .answer .answer-p,
.about-faq-answer .answer .answer-p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    padding: 28px 138px 10px 61px;
    margin: 0;
}

.about-faq-answer .answer .answer-p {
    color: var(--primary-60);
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .faq-section,
    .faq-section-transparent {
        padding: 18% 0 8%;
    }

    .faq-section-main {
        flex-direction: column;
    }

    .faq-content,
    .about-faq-content {
        width: 100%;
    }

    .faq-content .h3,
    .faq-content .p,
    .about-faq-content .h3,
    .about-faq-content .p {
        text-align: center;
    }

    .faq-content .h3,
    .about-faq-content .h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .faq-content .p,
    .about-faq-content .p {
        font-size: 14px;
    }

    .faq-questions,
    .about-faq-questions {
        width: 100%;
        margin-top: 7%;
    }

    .faq-questions .question,
    .about-faq-questions .question {
        border-radius: 8px;
        padding: 17px;
    }

    .faq-answer .answer .answer-p,
    .about-faq-answer .answer .answer-p {
        padding: 17px;
        font-size: 14px;
    }

    .faq-questions .span,
    .about-faq-questions .span {
        font-size: 14px;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .faq-section,
    .faq-section-transparent {
        padding: 10% 0;
    }

    .faq-section-main {
        flex-direction: column;
    }

    .faq-content,
    .about-faq-content {
        width: 100%;
    }

    .faq-content .h3,
    .faq-content .p,
    .about-faq-content .h3,
    .about-faq-content .p {
        text-align: center;
    }

    .faq-content .h3,
    .about-faq-content .h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .faq-content .p,
    .about-faq-content .p {
        font-size: 14px;
    }

    .faq-questions,
    .about-faq-questions {
        width: 100%;
        margin-top: 7%;
        min-height: 318px;
    }

    .faq-questions .question,
    .about-faq-questions .question {
        border-radius: 8px;
    }

    .faq-answer .answer .answer-p,
    .about-faq-answer .answer .answer-p {
        font-size: 14px;
        margin: 0;
        padding: 17px 3px 0 10px;
    }

    .faq-questions .span,
    .about-faq-questions .span {
        font-size: 14px;
    }

    .question {
        margin-bottom: 10px;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .faq-section,
    .faq-section-transparent {
        padding: 10% 0 10%;
    }

    .faq-section-main {
        flex-direction: column;
    }

    .faq-content,
    .about-faq-content {
        width: 100%;
    }

    .faq-content .h3,
    .faq-content .p,
    .about-faq-content .h3,
    .about-faq-content .p {
        text-align: center;
    }

    .faq-content .h3,
    .about-faq-content .h3 {
        font-size: 38px;
        font-weight: 300;
    }

    .faq-content .p,
    .about-faq-content .p {
        font-size: 16px;
    }

    .faq-questions,
    .about-faq-questions {
        width: 100%;
        margin-top: 7%;
        min-height: 318px;
    }

    .faq-questions .question,
    .about-faq-questions .question {
        border-radius: 8px;
    }

    .faq-answer .answer .answer-p,
    .about-faq-answer .answer .answer-p {
        font-size: 16px;
        margin-bottom: 20px;
        padding: 17px 3px 0px 10px;
    }

    .faq-questions .span,
    .about-faq-questions .span {
        font-size: 16px;
    }

    .question {
        margin-bottom: 10px;
    }

    .question svg {
        width: 14px;
        height: 14px;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .faq-answer .answer .answer-p,
    .about-faq-answer .answer .answer-p {
        padding: 28px 70px 12px 61px !important;
    }
}

</style>