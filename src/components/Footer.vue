<script setup>
const currentYear = new Date().getFullYear()
import {ref} from 'vue';
import api from "../services/api.js";

const email = ref('');

const errors = ref({
    email: '',
    general: ''
});

const successMessage = ref('');

const newsletter = async () => {
    errors.value = {
        email: '',
        general: ''
    };
    successMessage.value = '';

    let isValid = true;

    if (!email.value.trim()) {
        errors.value.email = 'messages.email_required';
        isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email.value)) {
        errors.value.email = 'messages.email_invalid';
        isValid = false;
    } else if (email.value.length > 255) {
        errors.value.email = 'messages.email_max';
        isValid = false;
    }

    if (!isValid) return;

    try {
        const newsletterData = {
            email: email.value,
        };

        const response = await api.post('api/newsletter/send-newsletter', newsletterData);

        if (response.status === 201) {
            successMessage.value = 'messages.newsletter_created';
            email.value = '';
        }
    } catch (error) {
        console.error('Error sending newsletter:', error);
        errors.value.general = 'messages.newsletter_creation_failed';
    }
};
</script>

<template>
    <div class="footer-section">
        <div class="container">
            <div class="position-relative d-flex justify-content-between align-items-center footer-main">
                <div class="logo-section d-flex align-items-center">
                    <router-link class="navbar-brand" to="/">
                        <div class="logo-container">
                            <img src="/assets/images/logo/logo.svg" alt="Logo" class="img-fluid">
                        </div>
                    </router-link>
                </div>
                <div class="social-icons d-flex align-items-center">
                    <img src="/assets/icons/social-media/facebook-white.svg" alt="facebook-white">
                    <img class="ms-3" src="/assets/icons/social-media/instagram-white.svg" alt="instagram-white">
                </div>
            </div>
        </div>
        <div class="line w-100"></div>
        <div class="container">
            <div class="position-relative d-flex justify-content-between footer-main-menu">
                <div class="footer-menu d-flex justify-content-between">
                    <div class="footer-menu-first">
                        <h5 class="item-title">Company</h5>
                        <ul class="p-0 list-unstyled">
                            <li class="footer-item">
                                <router-link to="/" class="footer-menu-link text-capitalize">{{$t('home')}}</router-link>
                            </li>
                            <li class="footer-item">
                                <router-link to="/about" class="footer-menu-link text-capitalize">{{$t('about_us')}}</router-link>
                            </li>
                            <li class="footer-item">
                                <router-link to="/courses" class="footer-menu-link text-capitalize">{{$t('courses')}}
                                </router-link>
                            </li>
                            <li class="footer-item">
                                <router-link to="/blog" class="footer-menu-link text-capitalize">{{$t('blog')}}</router-link>
                            </li>
                            <li class="footer-item">
                                <router-link to="/why-choose-us" class="footer-menu-link text-capitalize">{{$t('why_choose_us')}}
                                </router-link>
                            </li>
                            <li class="footer-item">
                                <router-link to="/" class="footer-menu-link text-capitalize">{{$t('contact_us')}}</router-link>
                            </li>
                        </ul>
                    </div>
                    <div class="footer-menu-second">
                        <h5 class="item-title">Information</h5>
                        <ul class="p-0 list-unstyled">
                            <li class="footer-item">
                                <a class="footer-contact-link" href="tel:+37477198238">+374 77 198238</a>
                            </li>
                            <li class="footer-item">
                                <a class="footer-contact-link"
                                   href="mailto:info@haylogic.am">info@haylogic.am</a>
                            </li>
                            <li class="footer-item">
                                <a class="footer-contact-link" href="https://haylogic.am/"
                                   target="_blank">HayLogic.am</a>
                            </li>
                        </ul>
                    </div>
                    <div class="footer-menu-third">
                        <h5 class="item-title">Location</h5>
                        <ul class="p-0 list-unstyled">
                            <li class="footer-item">
                                <a class="footer-contact-link" href="">Yerevan</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="form-newsletter">
                    <div class="form-bg-parent">
                        <div class="form-bg">
                            <p>Newsletter</p>

                            <input
                                    type="text"
                                    :placeholder="$t('email') + '*'"
                                    class="form-input input-email"
                                    v-model="email"
                                    name="email"
                            />
                            <span v-if="errors.email" class="required-field d-block mt-1">
                                {{ $t(errors.email) }}
                            </span>
                            <p v-if="errors.general" class="required-field mt-1 text-start">
                                {{ $t(errors.general) }}
                            </p>

                            <p v-if="successMessage" class="success-message mb-0 text-center">
                                {{ $t(successMessage) }}
                            </p>


                            <div class="submit-newsletter-div d-flex justify-content-center align-items-center mt-2">
                                <button class="submit-newsletter-btn text-capitalize" @click="newsletter">
                                    {{$t('submit')}}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
        <div class="line w-100"></div>
        <div class="container">
            <div class="position-relative d-flex justify-content-between align-items-center privacy-policy-web">
                <ul class="list-unstyled d-flex justify-content-between align-items-center w-100 privacy-policy-ul">
                    <li>
                        <a class="footer-a" href="">Copyright © {{ currentYear }} HayLogic Line LLC</a>
                    </li>
                    <li>
                        <a class="footer-a" href="">Privacy Policy</a>
                    </li>
                    <li>
                        <a class="footer-a" href="">Terms Of Services</a>
                    </li>
                </ul>
                <ul class="d-none list-unstyled d-flex justify-content-between align-items-center w-100 privacy-policy-ul-mobile">
                    <li>
                        <a class="footer-a" href="">Copyright © {{ currentYear }} HayLogic Academy LLC</a>
                    </li>
                    <ul class="list-unstyled">
                        <li>
                            <a class="footer-a" href="">Privacy Policy</a>
                        </li>
                        <li>
                            <a class="footer-a" href="">Terms Of Services</a>
                        </li>
                    </ul>

                </ul>
            </div>
        </div>
    </div>
</template>

<style scoped>
.footer-section {
    background-size: cover;
    background-image: url("/assets/images/repeting-image.jpg");
    background-position: center;
    width: 100%;
    position: relative;
    padding-top: 15px !important;
}

.footer-section:before {
    content: "";
    background: var(--footer-bg);
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
}

.line {
    border: 1px solid var(--primary-80);
    position: relative;
    margin: 3% 0;
}

.footer-a {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
    text-decoration: none;
    text-transform: capitalize;
}

.footer-menu {
    width: 51%;
}

.footer-menu h5 {
    font-family: var(--font-montserrat);
    font-weight: 300;
    font-size: 24px;
    line-height: normal;
    color: var(--white-245);
    letter-spacing: 0%;
}

.footer-menu a {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
    text-decoration: none;

}

.footer-menu ul {
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin-top: 14% !important;
}

.form-bg {
    width: 450px;
    padding: 6%;
    border-radius: 16px;
    backdrop-filter: blur(10px);
    background: var(--white-217);
    display: flex;
    flex-direction: column;
    gap: 20px;
}

.form-input {
    width: 100%;
    height: 53px;
    border-radius: 50px;
    border: 0.5px solid var(--primary-30) !important;
    background: var(--white-217) !important;
    outline: none;
    padding-left: 22px;
    box-sizing: border-box;
    position: relative;
    color: var(--white-245);
}

.form-input::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255, 255, 255, 0.1); /* Add a semi-transparent background for blur effect */
    border-radius: 50px;
    backdrop-filter: blur(50px);
    pointer-events: none;
}

.form-input::placeholder {
    font-family: var(--font-inter);
    color: var(--white-245) !important;
    font-weight: 300;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 0%;
    text-transform: capitalize;
}

.form-input:focus,
.form-input:focus::placeholder {
    color: var(--primary-20) !important;
}

.form-input:focus::-webkit-input-placeholder {
    color: var(--primary-20) !important;
}


.submit-newsletter-div {
    width: 100%;
    margin-top: 3%;
}

.submit-newsletter-btn {
    width: 100%;
    height: 53px;
    border-radius: 70px;
    background: var(--general-btn-light);
    border: none;
    outline: none;
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
}

.submit-newsletter-btn:hover {
    background: var(--submit-newsletter-btn-hover);
}

.form-bg p {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 20px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
    margin: 0;
}

.footer-menu-first {
    width: 27%;
}

.footer-menu-first ul li:hover a {
    font-weight: 400;
}

.privacy-policy-ul {
    margin-top: -13px;
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .footer-section {
        background-position: center;
        height: auto;
    }

    .footer-main {
        flex-direction: column;
    }

    .social-icons {
        width: 100%;
        justify-content: end;
        margin-top: 5%;
    }

    .footer-menu {
        width: 100%;
        flex-direction: column;
        align-items: center;
    }

    .footer-main-menu {
        flex-direction: column;
    }

    .footer-menu ul {
        align-items: center;
        margin-top: unset !important;
        gap: unset !important;
    }

    .footer-menu-first,
    .footer-menu-second,
    .footer-menu-third {
        width: 100%;
    }

    .footer-menu h5 {
        text-align: center;
        font-size: 18px;
    }

    .footer-menu a,
    .form-bg p,
    .submit-newsletter-btn {
        font-size: 16px;
    }

    .form-bg {
        width: 100%;
        gap: 13px;
    }

    .line {
        margin: 7% 0;
        width: 100%;
    }

    .form-input,
    .submit-newsletter-btn {
        height: 44px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .privacy-policy-ul {
        display: none !important;
    }

    .privacy-policy-ul-mobile {
        display: block !important;
    }

    .privacy-policy-ul-mobile ul {
        display: flex;
        justify-content: space-around;
        padding: 7% 0;
    }

    .privacy-policy-ul-mobile li {
        text-align: center;
    }

    .privacy-policy-ul-mobile li .footer-a {
        font-size: 14px !important;
    }

    .submit-newsletter-btn:hover {
        background: var(--general-btn-light);
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .footer-section {
        background-position: center;
        height: auto;
    }

    .footer-main {
        flex-direction: column;
    }

    .social-icons {
        width: 100%;
        justify-content: end;
        margin-top: 5%;
    }

    .footer-menu {
        width: 100%;
        flex-direction: column;
        align-items: center;
    }

    .footer-main-menu {
        flex-direction: column;
    }

    .footer-menu ul {
        align-items: center;
        margin-top: unset !important;
        gap: unset !important;
    }

    .footer-menu-first,
    .footer-menu-second,
    .footer-menu-third {
        width: 100%;
    }

    .footer-menu h5 {
        text-align: center;
        font-size: 18px;
    }

    .footer-menu a,
    .form-bg p,
    .submit-newsletter-btn {
        font-size: 16px;
    }

    .form-bg {
        width: 100%;
        gap: 13px;
    }

    .line {
        margin: 5% 0;
        width: 100%;
    }

    .form-input,
    .submit-newsletter-btn {
        height: 44px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .privacy-policy-ul {
        display: none !important;
    }

    .privacy-policy-ul-mobile {
        display: block !important;
    }

    .privacy-policy-ul-mobile ul {
        display: flex;
        justify-content: space-around;
        padding: 4% 0;
    }

    .privacy-policy-ul-mobile li {
        text-align: center;
    }

    .privacy-policy-ul-mobile li .footer-a {
        font-size: 14px !important;
    }

    .submit-newsletter-btn:hover {
        background: var(--general-btn-light);
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .footer-section {
        background-position: center;
        height: auto;
    }

    .social-icons {
        width: 100%;
        justify-content: end;
    }

    .footer-menu {
        width: 100%;
    }

    .footer-main-menu {
        flex-direction: column;
        gap: 35px;
    }

    .footer-menu ul {
        align-items: center;
        margin-top: unset !important;
        gap: unset !important;
    }

    .footer-menu-first,
    .footer-menu-second,
    .footer-menu-third {
        width: 100%;
    }

    .footer-menu h5 {
        text-align: center;
        font-size: 18px;
    }

    .form-bg p,
    .submit-newsletter-btn {
        font-size: 18px;
    }

    .footer-menu a {
        font-size: 16px;
    }

    .form-bg {
        width: 80%;
        gap: 13px;
    }

    .line {
        margin: 2% 0;
        width: 100%;
    }

    .form-input,
    .submit-newsletter-btn {
        height: 44px;
    }

    .form-input::placeholder {
        font-size: 16px;
    }

    .privacy-policy-ul {
        display: none !important;
    }

    .privacy-policy-ul-mobile {
        display: block !important;
    }

    .privacy-policy-ul-mobile ul {
        display: flex;
        justify-content: space-around;
        padding: 1% 0;
    }

    .privacy-policy-ul-mobile li {
        text-align: center;
    }

    .privacy-policy-ul-mobile li .footer-a {
        font-size: 16px !important;
    }

    .form-bg-parent {
        display: flex;
        justify-content: center;
    }

    .submit-newsletter-btn:hover {
        background: var(--general-btn-light);
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .form-bg {
        width: 369px;
    }

    .privacy-policy-web {
        padding: 10px;
    }

    .privacy-policy-ul {
        margin-top: 0 !important;
    }

}

</style>