<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../../stores/auth.js';
import api from '../../services/api.js';

const router = useRouter();
const auth = useAuthStore();

const form = ref({
    email: '',
    password: '',
});

const errors = ref({
    email: '',
    password: '',
});

const successMessage = ref('');
const generalErrorMessage = ref('');

const handleSubmit = async () => {
    errors.value = {
        email: '',
        password: '',
    };

    successMessage.value = '';
    generalErrorMessage.value = '';

    try {
        const response = await api.post('/api/login', form.value);

        const { token, user } = response.data;

        // auth.login(token, user);
        await auth.login(token, user);

        successMessage.value = 'auth.login_success';

        form.value = {
            email: '',
            password: '',
        };

        // await router.push({ name: 'home' });
        if (auth.user.role === 'instructor') {
            await router.replace('/instructor/my-courses');
        } else if (auth.user.role === 'learner') {
            await router.replace('/learner/my-learning');
        } else {
            await router.replace('/');
        }

    } catch (error) {
        if (error.response && error.response.data) {
            const backendErrors = error.response.data.errors;
            const backendMessageKey = error.response.data.message_key;

            for (const field in backendErrors) {
                if (backendErrors.hasOwnProperty(field)) {
                    errors.value[field] = backendErrors[field][0];
                }
            }

            if (backendMessageKey === 'auth.email_not_verified') {
                await router.push({
                    path: '/verify',
                    query: {
                        message: 'auth.email_not_verified',
                        email: form.value.email
                    }
                });
                return;
            }

            if (backendMessageKey) {
                if (backendMessageKey === 'auth.invalid_credentials') {
                    errors.value.email = backendMessageKey;
                    errors.value.password = backendMessageKey;
                } else if (backendMessageKey.includes('email')) {
                    errors.value.email = backendMessageKey;
                } else if (backendMessageKey.includes('password')) {
                    errors.value.password = backendMessageKey;
                }
            }
        }
    }
};
</script>
<template>
    <div class="auth-form">
        <h3 class="h3 text-capitalize">{{ $t('sign_in') }}</h3>
        <div class="form d-flex flex-column">
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
                <input id="password" name="password" class="form-input" type="password"
                       v-model="form.password" :placeholder="$t('your_password')">
                <p v-if="errors.password" class="required-field">{{ $t(errors.password) }}</p>
            </div>

            <div class="d-flex form-input-block">
                <p class="auth-dont-have-account">
                    {{ $t('dont_have_an_account') }}
                    <router-link to="/sign-up">{{ $t('sign_up') }}</router-link>
                </p>
            </div>
            <div v-if="successMessage" class="text-success text-center mt-2">
                {{ $t(successMessage) }}
            </div>
            <div class="auth-btn-div d-flex justify-content-center">
                <button class="auth-btn text-capitalize" @click="handleSubmit">
                    {{ $t('sign_in') }}
                </button>
            </div>

            <div class="d-flex form-input-block align-items-center">
                <p class="auth-dont-have-account">
                    <router-link to="/forgot-password" class="text-decoration-none">{{ $t('forgot_password') }}</router-link>
                </p>
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
    padding: 18px 23px;
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
        padding: 11px 13px;
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

    .auth-form{
        gap:10px;
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