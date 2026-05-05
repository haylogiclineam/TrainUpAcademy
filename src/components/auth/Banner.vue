<script setup>
import {computed} from "vue";
import {useAuthStore} from '/src/stores/auth.js';
import { getUserImageUrl } from '../../utils/userImage.js'

const auth = useAuthStore()
auth.checkAuth()

const userImage = computed(() => {
    return getUserImageUrl(auth.user?.image);
});

const userName = computed(() => {
    return auth.user ? `${auth.user.first_name} ${auth.user.last_name}` : '';
});


const userRole = computed(() => {
    return auth.user?.role || auth.role || null;
});


const isInstructor = computed(() => userRole.value === 'instructor');
const isLearner = computed(() => userRole.value === 'learner');
const settingsPath = computed(() => {
    return userRole.value === 'instructor'
        ? '/instructor/settings'
        : '/learner/settings';
});
</script>

<template>
    <div class="main-banner d-flex flex-column justify-content-center">
        <div class="container">
            <div class="user-info d-flex">
                <div class="position-relative">
                    <div class="auth-user-img">
                        <img :src="userImage" alt="User image"/>
                    </div>
                    <router-link :to="settingsPath"
                                 :class="{ active: $route.path === settingsPath }">
                        <div class="edit-user-detail position-absolute">
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none"
                                 xmlns="http://www.w3.org/2000/svg">
                                <g clip-path="url(#clip0_1115_7590)">
                                    <path d="M0.976667 15.9325C0.351502 16.5575 0.000188791 17.4052 0 18.2892L0 20H1.71083C2.59482 19.9998 3.44253 19.6485 4.0675 19.0233L15.1867 7.90416L12.0958 4.81332L0.976667 15.9325Z"
                                          fill="#4BBBE4"/>
                                    <path d="M19.2868 0.712493C19.0838 0.509356 18.8429 0.348206 18.5776 0.238257C18.3124 0.128308 18.0281 0.0717163 17.7409 0.0717163C17.4538 0.0717163 17.1695 0.128308 16.9042 0.238257C16.639 0.348206 16.398 0.509356 16.1951 0.712493L13.2734 3.63499L16.3643 6.72583L19.2868 3.80416C19.4899 3.60123 19.6511 3.36026 19.761 3.09502C19.871 2.82977 19.9275 2.54546 19.9275 2.25833C19.9275 1.9712 19.871 1.68688 19.761 1.42164C19.6511 1.15639 19.4899 0.915419 19.2868 0.712493Z"
                                          fill="#4BBBE4"/>
                                </g>
                                <defs>
                                    <clipPath id="clip0_1115_7590">
                                        <rect width="20" height="20" fill="white"/>
                                    </clipPath>
                                </defs>
                            </svg>
                        </div>
                    </router-link>
                </div>

                <div class="auth-user-detail d-flex flex-column justify-content-center gap-3 ms-4">
                    <span class="auth-user-name text-capitalize">{{ userName }}</span>
                    <p class="auth-user-role mb-0 text-capitalize">{{ $t(`auth.roles.${userRole}`) }}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.main-banner {
    background: var(--secondary-2-10);
    width: 100%;
    min-height: 296px;
}

.auth-user-img {
    width: 156px;
    height: 156px;
    border-radius: 50%;
    overflow: hidden;
}

.auth-user-img img {
    object-fit: cover;
    width: 100%;
    height: 100%;
}

.auth-user-name {
    font-size: 24px;
}

.auth-user-role {
    font-size: 22px;
}

.auth-user-name,
.auth-user-role {
    font-family: var(--font-montserrat);
    font-weight: 400;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--secondary-1-100);
}

.edit-user-detail {
    min-width: 50px;
    height: 50px;
    box-shadow: 0px 4px 4px 0px rgba(0, 0, 0, 0.15);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--white-245);
    position: absolute;
    bottom: 15%;
    left: 80%;
    transform: translateX(-50%) translateY(50%);
    z-index: 2;
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .main-banner{
        min-height: 156px;
    }
    .auth-user-img{
        width: 96px;
        height: 96px;
    }

    .edit-user-detail{
        min-width: 34px;
        height: 34px;
    }

    .edit-user-detail svg{
        width:18px;
        height: 18px;
    }

    .auth-user-name{
        font-size: 18px;
    }
    .auth-user-role{
        font-size: 16px;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .main-banner{
        min-height: 156px;
    }
    .auth-user-img{
        width: 96px;
        height: 96px;
    }

    .edit-user-detail{
        min-width: 34px;
        height: 34px;
    }

    .edit-user-detail svg{
        width:18px;
        height: 18px;
    }

    .auth-user-name{
        font-size: 18px;
    }
    .auth-user-role{
        font-size: 16px;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .main-banner{
        min-height: 156px;
    }
    .auth-user-img{
        width: 96px;
        height: 96px;
    }

    .edit-user-detail{
        min-width: 34px;
        height: 34px;
    }

    .edit-user-detail svg{
        width:18px;
        height: 18px;
    }

    .auth-user-name{
        font-size: 18px;
    }
    .auth-user-role{
        font-size: 16px;
    }
}
</style>