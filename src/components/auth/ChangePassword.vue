<script setup>
import {ref, onMounted} from 'vue'
import {useRoute, useRouter} from 'vue-router'
import api from "../../services/api.js";

const route = useRoute()
const router = useRouter()

const password = ref('')
const password_confirmation = ref('')
const token = ref('')
const email = ref('')
const errors = ref({})
const successMessage = ref('')

const showPassword = ref(false);
const showConfirmPassword = ref(false);

onMounted(() => {
    token.value = route.query.token || ''
    email.value = route.query.email || ''
})

const submitResetPassword = async () => {
    errors.value = {}
    successMessage.value = ''

    try {
        const response = await api.post('/api/reset-password', {
            token: token.value,
            email: email.value,
            password: password.value,
            password_confirmation: password_confirmation.value
        })

        successMessage.value = response.message_key

        setTimeout(() => {
            router.push('/sign-in')
        }, 2000)
    } catch (error) {
        if (error.response?.status === 422) {
            const responseErrors = error.response.data.errors;
            if (error.response.data.message_key === 'auth.token_invalid_or_expired') {
                // You can show a custom message or redirect
                errors.value.token = ['auth.token_invalid_or_expired'];
            } else {
                errors.value = responseErrors;
            }
        }
    }
}
</script>

<template>
    <div class="auth-form">
        <h3 class="h3 text-capitalize">{{ $t('change_password') }}</h3>
        <div class="form d-flex flex-column">
            <div class="d-flex flex-column form-input-block">
                <div class="w-100">
                    <label for="password">{{ $t('create_new_password') }}*</label>
                </div>
                <div class="password-input-wrapper">
                    <input
                            id="password"
                            name="password"
                            class="form-input"
                            :type="showPassword ? 'text' : 'password'"
                            :placeholder="$t('new_password')"
                            v-model="password"
                    />
                    <img
                        :src="showPassword ? '/assets/icons/eye-open.svg' : '/assets/icons/eye-close.svg'"
                        class="eye-icon"
                        @click="showPassword = !showPassword"
                        alt="toggle password visibility"
                    />
                </div>
                <p class="required-field" v-if="errors.password">{{ $t(errors.password[0]) }}</p>
            </div>

            <div class="d-flex flex-column form-input-block">
                <div class="w-100">
                    <label for="password_confirmation">{{ $t('confirm_your_password') }}*</label>
                </div>
                <div class="password-input-wrapper">
                    <input
                            id="password_confirmation"
                            name="password_confirmation"
                            class="form-input"
                            :type="showConfirmPassword ? 'text' : 'password'"
                            :placeholder="$t('your_password')"
                            v-model="password_confirmation"
                    />
                    <img
                        :src="showConfirmPassword ? '/assets/icons/eye-open.svg' : '/assets/icons/eye-close.svg'"
                        class="eye-icon"
                        @click="showConfirmPassword = !showConfirmPassword"
                        alt="toggle password visibility"
                    />
                </div>
                <p class="required-field mt-2" v-if="errors.password_confirmation">{{
                    $t(errors.password_confirmation[0])
                    }}</p>
                <p class="required-field mt-2 text-center" v-if="errors.token">{{ $t(errors.token[0]) }}</p>
            </div>
            <p class="success-message text-center" v-if="successMessage">{{ $t(successMessage) }}</p>

            <div class="auth-btn-div d-flex justify-content-center align-items-center">
                <button class="auth-btn text-capitalize" @click.prevent="submitResetPassword">
                    {{ $t('change') }}
                </button>
            </div>

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

.auth-dont-have-account,
.auth-dont-have-account a {
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
    width: 24px;
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


/* Extra Small Devices */
@media (max-width: 575px) {
    .auth-form .h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .auth-form {
        gap: 10px;
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

    .auth-btn-div {
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

    .auth-dont-have-account,
    .auth-dont-have-account a {
        font-size: 14px;
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .auth-form .h3 {
        font-size: 22px;
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

    .auth-dont-have-account,
    .auth-dont-have-account a {
        font-size: 14px;
    }

    .auth-form {
        gap: 10px;
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

    .auth-dont-have-account,
    .auth-dont-have-account a {
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