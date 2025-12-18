<script setup>
import { ref, onMounted, computed } from "vue";
import { useI18n } from "vue-i18n";
import api from '/src/services/api.js';

const { locale } = useI18n();
const loading = ref(false);

const bootcamp = ref({
    title_en: "",
    title_ru: "",
    title_arm: "",
    description_en: "",
    description_ru: "",
    description_arm: "",
    lists: [],
});

const localizedTitle = computed(() => {
    if (locale.value === 'ru') return bootcamp.value.title_ru;
    if (locale.value === 'arm') return bootcamp.value.title_arm;
    return bootcamp.value.title_en;
});

const localizedDescription = computed(() => {
    if (locale.value === 'ru') return bootcamp.value.description_ru;
    if (locale.value === 'arm') return bootcamp.value.description_arm;
    return bootcamp.value.description_en;
});

const localizedItemText = (item) => {
    if (locale.value === 'ru') return item.list_ru;
    if (locale.value === 'arm') return item.list_arm;
    return item.list_en;
};

const fetchBootcamp = async () => {
    loading.value = true;
    try {
        const response = await api.get('/api/bootcamps');
        if (response.data.length > 0) {
            const data = response.data[0];
            bootcamp.value = data;
        }
    } catch (error) {
        console.error("Error fetching bootcamp data:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    fetchBootcamp();
});
</script>

<template>
    <div class="bootcamp-section d-flex justify-content-between align-items-center">
        <div class="img-section"></div>
        <div class="container">
            <div v-if="loading" class="loading-state d-flex justify-content-center align-items-center">
                <div class="spinner-border text-secondary" role="status">
                    <span class="visually-hidden">{{ $t('loading') }}...</span>
                </div>
            </div>

            <div class="bootcamp-content" v-else>
                <h3 class="text-capitalize h3">{{ localizedTitle }}</h3>
                <p class="p">{{ localizedDescription }}</p>

                <div class="checkmark-section">
                    <div v-for="(item, index) in bootcamp.lists" :key="index" class="checkmark d-flex align-items-center">
                        <div class="checkmark-icon">
                            <img src="/assets/icons/bootcamp/checkmark.svg" alt="checkmark">
                        </div>
                        <span class="text-capitalize ms-4 span">{{ localizedItemText(item) }}</span>
                    </div>
                </div>

                <div class="learn-more-btn-div d-flex align-items-center">
                    <a href="/assets/files/Our%20Bootcamp.pdf" download class="learn-more-btn text-center text-decoration-none d-flex align-items-center justify-content-center">
                        Learn more
                    </a>
                </div>
            </div>

            <div class="d-flex">
                <div class="img-items">
                    <div class="d-flex justify-content-end">
                        <div class="item d-flex justify-content-center align-items-center">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="item-img d-flex justify-content-center align-items-center">
                                    <img src="/assets/icons/bootcamp/bootcamp-item-1.svg" alt="bootcamp-item-1">
                                </div>
                                <div class="item-content">
                                    <h6 class="text-capitalize">Trusted Bootcamp Since</h6>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus
                                        nec
                                        ullamcorper mattis, pulvinar</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-start">
                        <div class="item d-flex justify-content-center align-items-center">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="item-img d-flex justify-content-center align-items-center">
                                    <img src="/assets/icons/bootcamp/bootcamp-item-2.svg" alt="bootcamp-item-2">
                                </div>
                                <div class="item-content">
                                    <h6 class="text-capitalize">Trusted Bootcamp Since</h6>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus
                                        nec
                                        ullamcorper mattis, pulvinar</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-end">
                        <div class="item d-flex justify-content-center align-items-center">
                            <div class="d-flex align-items-center justify-content-between">
                                <div class="item-img d-flex justify-content-center align-items-center">
                                    <img src="/assets/icons/bootcamp/bootcamp-item-3.svg" alt="bootcamp-item-3">
                                </div>
                                <div class="item-content">
                                    <h6 class="text-capitalize">Trusted Bootcamp Since</h6>
                                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus
                                        nec
                                        ullamcorper mattis, pulvinar</p>
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
.container {
    width: 33% !important;
}

.bootcamp-section {
    width: 100%;
    position: relative;
    padding-bottom: 8%;
}

.img-section {
    width: 760px;
    height: 830px;
    border-radius: 16px;
    background-image: url("/assets/images/home/bootcamp/bg-img.png");
    background-size: cover;
    overflow: hidden;
    position: relative;
    z-index: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}

.img-section:before {
    content: "";
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    background: var(--bootcamp-bg);
    position: absolute;
    z-index: 1;
}


.img-items {
    width: 700px;
    min-height: 572px;
    position: absolute;
    z-index: 3;
    top: 14% !important;
    left: 9% !important;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    gap: 20px;
}

.img-items .item {
    width: 81%;
    min-height: 150px;
    /* max-height: 150px; */
    border-radius: 16px;
    border-width: 1px;
    padding: 20px;
    border-color: var(--secondary-1-100);
    border-style: solid;
    background: var(--bootcamp-item-bg);
    /* overflow: scroll; */
}

.item-img {
    width: 60px;
    height: 60px;
    background: var(--secondary-2-80);
    border-radius: 50%;
}

.item-content {
    width: 83%;
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.item-content h6 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
    margin: 0;
}

.item-content p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
    margin: 0;
}

.bootcamp-content {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.bootcamp-content .h3 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-100);
    margin: 0;
}

.bootcamp-content .p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-60);
    margin: 0;
}

.checkmark-section {
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.checkmark .span {
    font-family: var(--font-montserrat);
    font-weight: 300;
    font-size: 14px;
    line-height: normal;
    letter-spacing: 0%;
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
    border: none;
    outline: none;
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

/* Extra Small Devices */
@media (max-width: 575px) {
    .bootcamp-section {
        flex-direction: column;
        padding: 18% 0 18% 0;
    }

    .img-section,
    .img-items {
        display: none;
    }

    .container {
        width: 90% !important;
    }

    .bootcamp-content {
        align-items: center;
    }

    .bootcamp-content .h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .bootcamp-content .p {
        font-size: 14px;
        text-align: center;
    }

    .learn-more-btn {
        padding: 10px 22px;
        font-size: 15px;
    }

    .learn-more-btn:hover {
        transform: scale(1.03);
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .bootcamp-section {
        flex-direction: column;
        padding: 10% 0 10% 0;
    }

    .img-section,
    .img-items {
        display: none;
    }

    .container {
        width: 90% !important;
    }

    .bootcamp-content {
        align-items: center;
    }

    .bootcamp-content .h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .bootcamp-content .p {
        font-size: 14px;
        text-align: center;
    }

    .learn-more-btn {
        padding: 10px 22px;
        font-size: 15px;
    }

    .learn-more-btn:hover {
        transform: scale(1.03);
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .bootcamp-section {
        flex-direction: column;
        padding: 10% 0 10% 0;
    }

    .img-section,
    .img-items {
        display: none;
    }

    .container {
        width: 90% !important;
    }

    .bootcamp-content {
        align-items: center;
    }

    .bootcamp-content .h3 {
        font-size: 38px;
        font-weight: 300;
    }

    .bootcamp-content .p {
        font-size: 16px;
        text-align: center;
    }

    .learn-more-btn {
        padding: 11px 24px;
        font-size: 15px;
    }

    .learn-more-btn:hover {
        transform: scale(1.04);
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
   .img-section{
       width: 532px;
       height: 700px;
   }

    .img-items{
        top:8% !important;
        left: 6% !important;
        width: 530px;
    }


    .img-items .item{
        width: 85%;
        min-height: 140px;
    }
}

/* Extra Large Devices */
@media (min-width: 1200px) {
    .img-section{
        width: 600px;
        height: 700px;
    }

    .img-items{
        top:8% !important;
        left: 6% !important;
        width: 580px;
    }


    .img-items .item{
        width: 85%;
        min-height: 140px;
    }
}

/* Extra Large Devices */
@media (min-width: 1600px) {
    .bootcamp-section{
        gap:60px;
    }
   .img-section{
       min-width: 760px;
       min-height: 830px;
   }

    .img-items {
        min-width: 658px;
        gap: 20px;
        top: 14% !important;
        left: 9% !important;

    }

    .container {
        width:50% !important;
    }
}




</style>