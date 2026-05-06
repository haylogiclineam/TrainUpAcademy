<script setup>
import {ref, onMounted, watch} from 'vue';
import {useRoute} from 'vue-router';
import api from '/src/services/api.js';
import BlogArticle from "../BlogArticle.vue";
import {useI18n} from "vue-i18n";

const route = useRoute();
const blog = ref(null);
const fetchError = ref(false);
const {locale} = useI18n();
const isLoading = ref(true);

const fetchBlog = async (id) => {
    try {
        isLoading.value = true;
        const response = await api.get(`/api/blogs/${id}`);
        blog.value = response.data;
    } catch (error) {
        console.error('Failed to fetch blog:', error);
        fetchError.value = true;
    } finally {
        isLoading.value = false;
    }
};

onMounted(() => {
    fetchBlog(route.params.id);
});

watch(() => route.params.id, (newId) => {
    fetchBlog(newId);
});

const imageUrl = (path) => `${import.meta.env.VITE_API_BASE_URL || 'https://api.trainup.academy'}/storage/${path}`;
</script>


<template>
    <div class="container">
        <div v-if="isLoading" class="d-flex justify-content-center align-items-center" style="min-height: 300px">
            <div class="spinner-border text-secondary" role="status">
                <span class="visually-hidden">{{ $t('loading') }}...</span>
            </div>
        </div>

        <div v-if="blog" class="single-blog-section">
            <div class="single-blog-img">
                <img :src="imageUrl(blog.image)" :alt="blog.image"/>
            </div>
            <div class="single-blog-description">
                <div v-html="blog[`description_${locale}`]"></div>
            </div>
            <BlogArticle></BlogArticle>
        </div>
    </div>
</template>

<style scoped>
.single-blog-section {
    padding: 8% 0;
}

.single-blog-img {
    width: 100%;
    height: 484px;
    border-radius: 8px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
    padding: 2% 0;
}

.single-blog-img img {
    width: 100%;
    height: 100%;
    max-height: 100%;
    object-fit: cover;
    object-position: center;
    border-radius: 8px;
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .single-blog-section {
        padding: 18% 0 13%;
    }

    .single-blog-img {
        height: auto;
    }

}

</style>