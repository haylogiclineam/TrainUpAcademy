<script setup>
import Header from "../components/Header.vue";
import Footer from "../components/Footer.vue";
import api from "../services/api.js";
import {useRouter} from 'vue-router';

const router = useRouter();

const logout = async () => {
    try {
        // Send token as Bearer token
        await api.post('/api/logout', {}, {
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('token')}`,
            }
        });
        localStorage.removeItem('token'); // Clear token from localStorage
        await router.push('/sign-in'); // Redirect to sign-in page
    } catch (error) {
        console.error('Logout failed:', error);
    }
};


</script>

<template>
    <Header></Header>
    <h1>Hello user</h1>
    <button @click="logout" class="btn btn-danger mt-3">Logout</button>

    <Footer></Footer>
</template>



