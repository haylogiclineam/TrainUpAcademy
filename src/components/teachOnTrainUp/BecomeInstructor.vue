<script setup>
import {useAuthStore} from "../../stores/auth.js";

const auth = useAuthStore()
auth.checkAuth()
</script>

<template>
    <div class="become-instructor-section">
        <div class="container">
            <div class="become-instructor-main d-flex flex-column justify-content-center align-items-center position-relative">
                <div class="become-instructor-title d-flex flex-column align-items-center justify-content-center">
                    <h3>Become an instructor today</h3>
                    <p>Join one of the world’s largest online learning marketplaces.
                    </p>
                    <div v-if="!auth.isAuthenticated" class="get-started-btn-div">
                        <router-link
                                :to="{ path: '/sign-up', query: { hideLearner: true } }"
                                class="get-started-btn text-decoration-none align-items-center justify-content-center d-flex"
                        >
                            Get started
                        </router-link>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.become-instructor-section {
    min-height: 268px;
    background-image: url("/assets/images/repeting-image.jpg");
    background-size: cover;
    position: relative;
    margin-bottom: 100px;
    background-position: center;
    z-index: 0;
    display: flex;
    align-items: center;
}

.become-instructor-section:before {
    content: "";
    top: 0;
    left: 0;
    background: var(--about-team-bg);
    width: 100%;
    height: 100%;
    position: absolute;
    z-index: 0;
}

.become-instructor-main {
    position: relative;
    z-index: 1;
    padding: 30px 0;
}

.get-started-btn {
    gap: 10px;
    border-radius: 70px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 1px;
    color: var(--white-229);
    cursor: pointer;
    width: 254px;
    height: 53px;
    background: var(--general-btn);
    outline: none;
    border: none;
    text-transform: capitalize;
}

.become-instructor-title {
    width: 50%;
}

.become-instructor-title h3,
.become-instructor-title p {
    font-family: var(--font-montserrat);
    font-weight: 500;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--white-255);
    text-align: center;
}

.become-instructor-title h3 {
    font-size: 42px;
}

.become-instructor-title p {
    font-size: 22px;
    margin-top: 20px;
}

@media (max-width: 992px) {
    .become-instructor-title {
        width: 100%;
    }

    .become-instructor-title h3 {
        font-size: 25px;
    }

    .become-instructor-title p {
        font-size: 18px;
        margin-top: 10px;
    }

    .get-started-btn {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .become-instructor-section {
        margin-bottom: 50px;
    }
}

/* Extra Large Devices */
@media (min-width: 1200px) {
    .get-started-btn:hover {
        height: 56px;
        width: 264px;
        font-size: 18px;
    }

    .get-started-btn-div {
        height: 56px;
        width: 264px;
    }
}

</style>