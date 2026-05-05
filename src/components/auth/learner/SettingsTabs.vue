<script setup>
import {ref, computed} from 'vue'
import PaymentMethods from "../learner/Tabs/PaymentMethods.vue";
import ChangePassword from "../../auth/Tabs/ChangePassword.vue";
import Profile from "../../auth/Tabs/Profile.vue";
import Photo from "../../auth/Tabs/Photo.vue";
import Notifications from "../../auth/Tabs/Notifications.vue";
import {useAuthStore} from '/src/stores/auth.js';
import {useI18n} from 'vue-i18n';
import { getUserImageUrl } from '../../../utils/userImage.js'


const {t} = useI18n()

const tabs = computed(() => [
    {name: 'profile', label: t('auth.settingsTabs.profile'), component: Profile},
    {name: 'photo', label: t('auth.settingsTabs.photo'), component: Photo},
    {name: 'payment-methods', label: t('auth.settingsTabs.paymentMethods'), component: PaymentMethods},
    {name: 'change-password', label: t('auth.settingsTabs.changePassword'), component: ChangePassword},
    {name: 'notifications', label: t('auth.settingsTabs.notifications'), component: Notifications},
])

const currentTab = ref(tabs.value[0].name)

const currentComponent = computed(() => {
    const found = tabs.value.find((tab) => tab.name === currentTab.value)
    return found ? found.component : null
})

const auth = useAuthStore()
auth.checkAuth()

const userImage = computed(() => {
    return getUserImageUrl(auth.user?.image);
});

const userName = computed(() => {
    return auth.user ? `${auth.user.first_name} ${auth.user.last_name}` : '';
});

const userEmail = computed(() => {
    return auth.user?.email || '';
});

const userRole = computed(() => {
    return auth.user?.roles?.[0]?.name || null;
});
</script>

<template>
    <div class="container">
        <div class="settings-main d-flex">
            <div class="sidebar border-end-custom">
                <div class="text-center p-3 mt-5 image-block">
                    <div class="avatar mb-2">
                        <img :src="userImage" alt="User image"/>
                    </div>
                    <h5 class="auth-user-name">{{ userName }}</h5>
                </div>
                <ul class="nav flex-column mb-5">
                    <li>
                        <router-link to="/learner/profile-page" class="nav-link">
                            {{ $t('auth.settingsTabs.view_profile') }}
                        </router-link>
                    </li>
                    <li
                            v-for="tab in tabs"
                            :key="tab.name"
                            :class="['nav-link', { active: currentTab === tab.name }]"
                            @click="currentTab = tab.name"
                            style="cursor: pointer"
                    >
                        {{ tab.label }}
                    </li>
                </ul>
            </div>
            <div class="content flex-grow-1">
                <component :is="currentComponent"/>
            </div>
        </div>
    </div>
</template>


<style scoped>
.sidebar {
    min-width: 335px;
}

.nav-link {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-90);
    padding: 13px 25px;
}

.nav-link:hover {
    color: var(--primary-90);
}

.nav-link.active {
    background-color: var(--primary-20);
    color: var(--primary-90)
}


.avatar {
    display: inline-block;
    width: 150px;
    height: 150px;
    border-radius: 50%;
}

.avatar img {
    object-fit: cover;
    width: 100%;
    height: 100%;
    border-radius: 50%;
}

.settings-main {
    border: 1px solid var(--primary-30);
    border-radius: 16px;
    margin: 8% 0;
    min-height: 644px;
}

.border-end-custom {
    border-right: 1px solid var(--primary-30);
}

.auth-user-name {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 22px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--secondary-1-100);
    margin-top: 15px;
}

/* Extra Small Devices */
@media (max-width: 991px) {
    .settings-main {
        flex-direction: column;
        margin: 13% 0;
    }

    .border-end-custom {
        border-bottom: 1px solid var(--primary-30);
        border-right: unset;
    }

    .image-block {
        margin-top: 10px !important;
    }

    .avatar {
        width: 96px;
        height: 96px;
    }

    .auth-user-name {
        font-size: 16px;
        margin-top: 5px;
    }

    .nav-link {
        padding: 10px 25px;
    }

    .nav {
        margin-bottom: 26px !important;
    }
}
</style>
