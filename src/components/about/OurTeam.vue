<script setup>
import {useRoute} from "vue-router";
import {ref, computed, onMounted} from "vue";
import {useI18n} from 'vue-i18n';
import api from '/src/services/api.js';

const {locale} = useI18n();
const route = useRoute();

const teamItems = ref([])
const fetchError = ref(false)
const loading = ref(false);


onMounted(async () => {
    loading.value = true;
    try {
        const response = await api.get('/api/teams')
        teamItems.value = response.data
    } catch (error) {
        console.error('Failed to fetch Team:', error)
        fetchError.value = true
    } finally {
        loading.value = false;
    }
})

const imageUrl = (path) => `${import.meta.env.VITE_API_BASE_URL}/storage/${path}`;

</script>

<template>
    <div class="team-section">
        <div class="container">
            <div class="d-flex flex-column justify-content-center align-items-center position-relative team-main">
                <div class="team-title">
                    <h3 class="text-capitalize">{{ $t('about.our_team') }}</h3>
                    <p>{{ $t('about.our_team_text') }}</p>
                </div>
                <div v-if="loading" class="d-flex justify-content-center align-items-center" style="min-height: 300px">
                    <div class="spinner-border text-secondary" role="status">
                        <span class="visually-hidden">{{ $t('loading') }}...</span>
                    </div>
                </div>
                <div v-else class="team-block d-flex justify-content-center align-items-center flex-wrap">
                    <div v-for="(item, index) in teamItems" class="team-item" :key="index">
                        <div class="team-member">
                            <img :src="imageUrl(item.image)" :alt="item.image"/>
                        </div>
                        <div class="team-member-info">
                            <p class="text-capitalize mb-1">{{ item[`full_name_${locale}`] }}</p>
                            <span class="text-capitalize">{{ item[`profession_${locale}`] }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.team-section {
    padding: 8% 0;
    background-image: url("/assets/images/repeting-image.jpg");
    background-size: cover;
    position: relative;
}

.team-section:before {
    content: "";
    top: 0;
    left: 0;
    background: var(--about-team-bg);
    width: 100%;
    height: 100%;
    position: absolute;
}

.team-block {
    gap: 60px;
}

.team-main {
    gap: 60px;
}

.team-title {
    width: 42%;
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.team-title h3 {
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    text-align: center;
    color: var(--white-245);
    margin: 0;
}

.team-title p {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    text-align: center;
    color: var(--primary-10);
}

.team-item {
    width: 254px;
    min-height: 237px;
    gap: 30px;
    display: flex;
    flex-direction: column;
    align-items: center;
}

.team-member {
    width: 140px;
    height: 140px;
    border-radius: 50%;
    overflow: hidden;
}

.team-member img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: top;
}

.team-member-info {
    border-radius: 16px;
    background: var(--general-btn);
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 10px;
    gap: 4px;
}

.team-member-info p,
.team-member-info span {
    font-family: var(--font-montserrat);
    font-weight: 300;
    line-height: 100%;
    letter-spacing: 0%;
    color: var(--white-245);
    text-align: center;
}

.team-member-info p {
    font-size: 20px;
    margin: 0;
}

.team-member-info span {
    font-size: 16px;
}

@media (max-width: 575px) {
    .team-section {
        padding: 18% 0 13%;
        background-position: center;
    }

    .team-title {
        width: 100%;
    }

    .team-title h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .team-title p {
        font-size: 14px;
    }

    .team-block {
        gap: 30px;
    }

    .team-item {
        width: 147px;
        min-height: 146px;
    }

    .team-member {
        width: 80px;
        height: 80px;
    }

    .team-member-info {
        border-radius: 8px;
    }

    .team-member-info p {
        font-size: 14px;
        margin: 0;
    }

    .team-member-info span {
        font-size: 12px;
    }

    .team-main {
        gap: 30px;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .team-section {
        padding: 18% 0 13%;
        background-position: center;
    }

    .team-title {
        width: 100%;
    }

    .team-title h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .team-title p {
        font-size: 14px;
    }

    .team-block {
        gap: 30px;
    }

    .team-item {
        width: 147px;
        min-height: 146px;
    }

    .team-member {
        width: 80px;
        height: 80px;
    }

    .team-member-info {
        border-radius: 8px;
    }

    .team-member-info p {
        font-size: 14px;
        margin: 0;
    }

    .team-member-info span {
        font-size: 12px;
    }

    .team-main {
        gap: 30px;
    }
}


/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .team-section {
        padding: 10% 0 13%;
        background-position: center;
    }

    .team-title {
        width: 100%;
    }

    .team-title h3 {
        font-size: 38px;
        font-weight: 300;
    }

    .team-title p {
        font-size: 16px;
    }

    .team-block {
        gap: 30px;
    }

    .team-item {
        width: 147px;
        min-height: 146px;
    }

    .team-member {
        width: 80px;
        height: 80px;
    }

    .team-member-info {
        border-radius: 8px;
    }

    .team-member-info p {
        font-size: 14px;
        margin: 0;
    }

    .team-member-info span {
        font-size: 12px;
    }

    .team-main {
        gap: 30px;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .team-title {
        width: 80%;
    }
}


</style>