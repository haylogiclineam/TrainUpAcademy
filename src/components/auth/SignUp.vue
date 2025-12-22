<script setup>
import { ref, onMounted } from 'vue';
import api from "../../services/api.js";
import { useRouter, useRoute } from 'vue-router';

const router = useRouter();
const route = useRoute();

const form = ref({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
    accept_terms: false,
});

const showPassword = ref(false);
const showConfirmPassword = ref(false);

const errors = ref({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
    role: '',
    accept_terms: '',
});

const successMessage = ref('');
const hideLearner = ref(false);

onMounted(() => {
    if (route.query.hideLearner) {
        hideLearner.value = true;
        form.value.role = 'instructor';
    }
});

const handleSubmit = async () => {
    errors.value = {
        first_name: '',
        last_name: '',
        email: '',
        password: '',
        password_confirmation: '',
        role: '',
        accept_terms: '',
    };

    if (!form.value.accept_terms) {
        errors.value.accept_terms = 'auth.accept_terms_required';
        return;
    }

    successMessage.value = '';

    try {
        const response = await api.post('/api/register', form.value);

        successMessage.value = 'auth.register_success';

        await router.push({
            path: '/verify',
            query: { message: 'auth.check_email_for_verification',
                email: form.value.email},
        });
        form.value = {
            first_name: '',
            last_name: '',
            email: '',
            password: '',
            password_confirmation: '',
            role: '',
            accept_terms: false,
        };
    } catch (error) {
        if (error.response && error.response.data) {
            const backendErrors = error.response.data;

            for (const field in backendErrors) {
                if (backendErrors.hasOwnProperty(field)) {
                    errors.value[field] = backendErrors[field][0];
                }
            }
        }
    }
};
</script>

<template>
    <div class="auth-form">
        <h3 class="h3 text-capitalize">{{ $t('sign_up') }}</h3>
        <div class="form d-flex flex-column">
            <form @submit.prevent="handleSubmit">
                <div class="d-flex flex-column form-input-block">
                    <div class="w-100">
                        <label for="first-name">{{ $t('first_name') }}*</label>
                    </div>
                    <input id="first-name" name="first-name" class="form-input" type="text"
                           v-model="form.first_name" :placeholder="$t('your_first_name')">
                    <p v-if="errors.first_name" class="required-field">{{ $t(errors.first_name) }}</p>
                </div>

                <div class="d-flex flex-column form-input-block">
                    <div class="w-100">
                        <label for="last-name">{{ $t('last_name') }}*</label>
                    </div>
                    <input id="last-name" name="last-name" class="form-input" type="text"
                           v-model="form.last_name" :placeholder="$t('your_last_name')">
                    <p v-if="errors.last_name" class="required-field">{{ $t(errors.last_name) }}</p>
                </div>

                <div class="d-flex flex-column form-input-block">
                    <div class="w-100">
                        <label for="email">{{ $t('email') }}*</label>
                    </div>
                    <input id="email" name="email" class="form-input" type="text"
                           v-model="form.email" :placeholder="$t('your_email')">
                    <p v-if="errors.email" class="required-field">{{ $t(errors.email) }}</p>
                </div>

                <div class="d-flex flex-column form-input-block">
                    <div class="w-100">
                        <label for="password">{{ $t('password') }}*</label>
                    </div>
                    <div class="password-input-wrapper">
                        <input id="password" name="password" class="form-input" :type="showPassword ? 'text' : 'password'"
                               v-model="form.password" :placeholder="$t('your_password')">
                        <img
                            :src="showPassword ? '/assets/icons/eye-open.svg' : '/assets/icons/eye-close.svg'"
                            class="eye-icon"
                            @click="showPassword = !showPassword"
                            alt="toggle password visibility"
                        />
                    </div>
                    <p v-if="errors.password" class="required-field">{{ $t(errors.password) }}</p>
                </div>

                <div class="d-flex flex-column form-input-block">
                    <div class="w-100">
                        <label for="repeat-password">{{ $t('repeat_password') }}*</label>
                    </div>
                    <div class="password-input-wrapper">
                        <input id="repeat-password" name="repeat-password" class="form-input" :type="showConfirmPassword ? 'text' : 'password'"
                               v-model="form.password_confirmation" :placeholder="$t('repeat_password')">
                        <img
                            :src="showConfirmPassword ? '/assets/icons/eye-open.svg' : '/assets/icons/eye-close.svg'"
                            class="eye-icon"
                            @click="showConfirmPassword = !showConfirmPassword"
                            alt="toggle password visibility"
                        />
                    </div>
                    <p v-if="errors.password_confirmation" class="required-field">{{ $t(errors.password_confirmation) }}</p>
                </div>

                <div class="terms-checkbox-wrapper d-flex align-items-center">
                    <div class="terms-checkbox" :class="{ checked: form.accept_terms }" @click="form.accept_terms = !form.accept_terms">
                        <svg v-if="form.accept_terms" width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M15 4.5L6.75 12.75L3 9" stroke="#4BBBE4" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </div>
                    <label class="terms-label">
                        {{ $t('auth.by_creating_account') }}
                        <router-link to="/terms-conditions" target="_blank" rel="noopener noreferrer">
                            {{ $t('auth.terms') }}
                        </router-link>
                        {{ $t('auth.and') }}
                        <router-link to="/privacy-policy" target="_blank" rel="noopener noreferrer">
                            {{ $t('auth.privacy_policy') }}
                        </router-link>
                    </label>
                </div>
                <p v-if="errors.accept_terms" class="required-field">{{ $t(errors.accept_terms) }}</p>

                <div class="d-flex align-items-center form-input-block form-input-radio-block align-items-center">
                    <div v-if="!hideLearner" class="form-check-custom d-flex align-items-center">
                        <input class="form-check-input-custom" type="radio" name="role" id="flexRadioDefault1"
                               value="learner" v-model="form.role">
                        <label class="form-check-label-custom" for="flexRadioDefault1">
                            {{ $t('continue_as_learner') }}
                        </label>
                    </div>
                    <div class="form-check-custom d-flex align-items-center">
                        <input class="form-check-input-custom" type="radio" name="role" id="flexRadioDefault2"
                               value="instructor" v-model="form.role">
                        <label class="form-check-label-custom" for="flexRadioDefault2">
                            {{ $t('continue_as_instructor') }}
                        </label>
                    </div>
                </div>
                <p v-if="errors.role" class="required-field">{{ $t(errors.role) }}</p>

                <div class="d-flex form-input-block align-items-center">
                    <p class="auth-already-have-account">
                        {{ $t('already_have_an_account') }}
                        <router-link to="/sign-in">{{ $t('sign_in') }}</router-link>
                    </p>
                </div>
                <div v-if="successMessage" class="text-success text-center mt-2">
                    {{ $t(successMessage) }}
                </div>
                <div class="auth-btn-div d-flex justify-content-center align-items-center">
                    <button class="auth-btn text-capitalize" type="submit">
                        {{ $t('sign_up') }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped>
.auth-form {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    width: 100%;
}

.auth-form .h3 {
    font-family: var(--font-montserrat);
    font-weight: 300;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    text-align: center;
    color: var(--primary-10);
}

.form {
    backdrop-filter: blur(104px);
    background: var(--white-217);
    width: 60%;
    border-radius: 16px;
    gap: 10px;
    padding: 4%;
}

.form-input {
    width: 100%;
    border-radius: 16px;
    background: var(--white-179);
    outline: none;
    border: none;
    color: var(--white-245);
    font-weight: 300;
    padding: 18px 50px 18px 23px;
}

.password-input-wrapper {
    position: relative;
    width: 100%;
}

.eye-icon {
    position: absolute;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    width: 24px;
    height: 24px;
    transition: opacity 0.2s ease;
}

.eye-icon:hover {
    opacity: 0.8;
}

.form-input::placeholder {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--white-245);
    text-transform: capitalize;
    resize: none;
}

.form-input:focus {
    color: var(--primary-20);
}

.form-input:focus::placeholder {
    color: var(--primary-20);
}

.auth-btn-div {
    width: 100%;
    margin-top: 3%;
}

.auth-btn {
    width: 100%;
    height: 64px;
    border-radius: 70px;
    background: var(--general-btn-light);
    border: none;
    outline: none;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 22px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
}

.auth-btn:hover {
    background: var(--book-cal-btn-hover);
}

.form-input-block {
    width: 100%;
}

.w-100 {
    width: 100%;
}

.form-input-block label {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 22px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--white-255);
    margin: 10px 0;
    text-transform: capitalize;
}

.auth-already-have-account,
.auth-already-have-account a {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-255);
}

.form-input-radio-block {
    gap: 30px;
}

.form-check-input-custom {
    min-width: 24px;
    height: 24px;
    background-color: var(--white-245);
    margin-right: 17px;
    border-radius: 50% !important; /* Optional, for rounded corners */
    position: relative;
    appearance: none; /* Remove default styling */
    display: flex;
    justify-content: center;
    align-items: center;
}

.form-check-input-custom:checked {
    background-color: transparent !important;
    border: 3px solid var(--secondary-1-100) !important;
}

.form-check-input-custom:checked::after {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: var(--secondary-1-100);
    border-radius: 50%;
}

.terms-checkbox-wrapper {
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 0px;
    gap: 10px;
    margin: 15px 0;
}

.terms-checkbox {
    box-sizing: border-box;
    width: 26px;
    height: 26px;
    min-width: 26px;
    border: 1.5px solid #4BBBE4;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s ease;
}

.terms-checkbox:hover {
    background: rgba(75, 187, 228, 0.1);
}

.terms-checkbox.checked {
    background: rgba(75, 187, 228, 0.1);
}

.terms-label {
    font-family: 'Montserrat', sans-serif;
    font-style: normal;
    font-size: 16px;
    line-height: 20px;
    color: #F5F5F5;
    text-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
    margin: 0 !important;
}

.terms-label a {
    color: #F5F5F5;
    text-decoration: underline;
}

.terms-label a:hover {
    color: #4BBBE4;
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .auth-form .h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .auth-form{
        gap:10px;
    }

    .form {
        width: 100%;
        min-height: 285px !important;
    }

    .form-input {
        width: 100%;
        border-radius: 6px;
        padding: 11px 40px 11px 13px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .aut-btn-div {
        width: 100%;
    }

    .auth-btn {
        width: 100%;
        font-size: 18px;
        height: 47px;
    }

    .form-input-block label {
        font-size: 16px !important;
    }

    .form-input-radio-block{
        display: flex;
        flex-direction: column;
        gap: 10px;
    }

    .form-check-custom{
        width: 100%;
    }

    .auth-already-have-account,
    .auth-already-have-account a {
        font-size: 14px;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .auth-form .h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .auth-form{
        gap:10px;
    }

    .form {
        width: 100%;
        min-height: 285px !important;
    }

    .form-input {
        width: 100%;
        border-radius: 6px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .auth-btn-div {
        width: 100%;
    }

    .auth-btn {
        width: 100%;
        font-size: 18px;
        height: 47px;
    }

    .auth-already-have-account,
    .auth-already-have-account a {
        font-size: 14px;
    }

    .form-input-block label {
        font-size: 16px !important;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .auth-form .h3 {
        font-size: 38px;
        font-weight: 300;
    }

    .form {
        width: 100%;
        min-height: 285px !important;
    }

    .form-input {
        width: 100%;
        border-radius: 6px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .auth-btn-div {
        width: 100%;
    }

    .auth-btn {
        width: 100%;
        font-size: 18px;
        height: 47px;
    }
    .auth-already-have-account,
    .auth-already-have-account a {
        font-size: 16px;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .form {
        width: 70%;
    }
}

</style>