<script setup>
import {ref, reactive, computed, onMounted} from 'vue';
import {useRoute, useRouter} from 'vue-router';
import {useI18n} from 'vue-i18n';
import api from "../../services/api.js";

const route = useRoute();
const router = useRouter();
const {t} = useI18n();

const verifyMessage = ref(route.query.message || '');
const verifyEmail = ref(route.query.email || '');
const errorMessage = ref('');
const successMessage = ref('');
const loading = ref(false);

const codeLength = 4;
const code = reactive(Array(codeLength).fill(''));
const inputRefs = ref([]);

const onInput = (index) => {
    const val = code[index];
    if (!/^\d$/.test(val)) {
        code[index] = '';
        return;
    }

    if (val && index < codeLength - 1) {
        inputRefs.value[index + 1]?.focus();
    }
};

const onBackspace = (index, event) => {
    if (code[index] === '' && index > 0) {
        inputRefs.value[index - 1]?.focus();
    }
};

const isValid = computed(() => {
    return code.every(d => /^\d$/.test(d));
});

const submitCode = async () => {
    const fullCode = code.join('');
    if (!isValid.value) {
        errorMessage.value = t('auth.code_required');
        return;
    }

    try {
        loading.value = true;
        const res = await api.post('/api/verify-email', {
            email: verifyEmail.value,
            code: fullCode,
        });

        successMessage.value = t(res.data.message_key);
        errorMessage.value = '';

        setTimeout(() => {
            router.push('/sign-in');
        }, 2000);
    } catch (err) {
        if (err.response?.data?.message_key) {
            errorMessage.value = t(err.response.data.message_key);
        } else {
            errorMessage.value = t('auth.something_went_wrong');
        }
    } finally {
        loading.value = false;
    }
};

const resendCode = async () => {
    try {
        loading.value = true;
        const res = await api.post('/api/resend-verification-code', {
            email: verifyEmail.value,
        });

        successMessage.value = t(res.data.message_key);
        errorMessage.value = '';
    } catch (err) {
        if (err.response?.data?.message_key) {
            errorMessage.value = t(err.response.data.message_key);
        } else {
            errorMessage.value = t('auth.something_went_wrong');
        }
    } finally {
        loading.value = false;
    }
};

onMounted(() => {
    inputRefs.value[0]?.focus();
});
</script>

<template>
    <div class="verification-wrapper">
        <h2 class="text-capitalize">{{ $t('auth.verification_code') }}</h2>

        <div class="form">
            <p v-if="verifyMessage" class="p">{{ $t(verifyMessage) }}</p>
            <span class="span">{{ $t('auth.code_sent_to') }} {{ verifyEmail }}</span>

            <div class="code-container d-flex flex-wrap">
                <input
                        v-for="(digit, index) in code"
                        :key="index"
                        v-model="code[index]"
                        :ref="el => inputRefs[index] = el"
                        type="text"
                        maxlength="1"
                        inputmode="numeric"
                        :class="[
                            errorMessage ? 'code-input-error' : 'code-input',
                            { filled: code[index] !== '' }
                          ]"
                        @input="onInput(index)"
                        @keydown.backspace="onBackspace(index, $event)"
                />
            </div>

            <p v-if="errorMessage" class="required-field mb-2 text-danger">{{ errorMessage }}</p>
            <p v-if="successMessage" class="mb-2 text-success">{{ successMessage }}</p>

            <button class="submit-btn mt-3" @click="submitCode" :disabled="!isValid || loading">
                {{ $t('auth.verify') }}
            </button>

            <div class="d-flex form-input-block align-items-center mt-4">
                <p class="dont-receive">
                    {{ $t('auth.didnt_receive') }}
                    <a href="#" @click.prevent="resendCode">{{ $t('auth.resend') }}</a>
                </p>
            </div>
        </div>
    </div>
</template>

<style scoped>
.verification-wrapper {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 30px;
    width: 100%;
}

.verification-wrapper h2 {
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
    display: flex;
    flex-direction: column;
    align-items: center;
}

.p {
    font-size: 34px;
    margin: 0;
}

.span {
    font-size: 22px;
}

.p,
.span {
    font-family: var(--font-montserrat);
    font-weight: 300;
    line-height: normal;
    letter-spacing: 2%;
    text-align: center;
    color: var(--primary-10);
}

.code-container {
    display: flex;
    gap: 30px;
    margin: 20px 0 10px 0;
}

.code-input.filled {
    border-color: var(--secondary-1-100);
}

.code-input-error.filled {
    border-color: var(--required);
}

.code-input-error {
    width: 56px;
    height: 56px;
    text-align: center;
    border: 1px solid var(--required);
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s ease;
    background: transparent;
    font-family: var(--font-montserrat);
    font-weight: 300;
    font-size: 24px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--required);
}

.code-input {
    width: 56px;
    height: 56px;
    text-align: center;
    border: 1px solid var(--primary-40);
    border-radius: 8px;
    outline: none;
    transition: border-color 0.3s ease;
    background: transparent;
    font-family: var(--font-montserrat);
    font-weight: 300;
    font-size: 24px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--secondary-1-100);
}

.code-input:focus {
    border-color: var(--secondary-1-100);
}

.code-input-error:focus {
    border-color: var(--required);
}

.submit-btn {
    border: none;
    color: var(--white-245);
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 22px;
    line-height: normal;
    letter-spacing: 0%;
    cursor: pointer;
    transition: background-color 0.2s;
    width: 70%;
    height: 64px;
    border-radius: 70px;
    background: var(--general-btn-light);
}

.submit-btn:disabled {
    background: var(--primary-30);
    cursor: not-allowed;
    color: var(--primary-60);
}

.submit-btn:hover:enabled {
    background: var(--general-btn-light);
}

.submit-btn:enabled:hover {
    background: var(--general-btn);
}

.dont-receive {
    color: var(--white-255);
}

.dont-receive,
.dont-receive a {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
}

.dont-receive a {
    color: var(--secondary-1-100);
    text-decoration: none;
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .verification-wrapper h2 {
        font-size: 22px;
        font-weight: 300;
    }

    .verification-wrapper {
        gap: 10px;
    }

    .form {
        width: 100%;
        min-height: 285px !important;
        padding: 8%;
    }

    .p {
        font-size: 18px;
    }

    .span {
        font-size: 14px;
    }

    .code-input {
        width: 50px;
        height: 50px;
        border-radius: 8px;
    }

    .code-container {
        gap: 20px;
    }

    .submit-btn {
        width: 80%;
        height: 47px;
        font-size: 18px;
    }

    .dont-receive,
    .dont-receive a {
        font-size: 16px;
    }

}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .verification-wrapper h2 {
        font-size: 22px;
        font-weight: 300;
    }

    .verification-wrapper {
        gap: 10px;
    }

    .form {
        width: 90%;
        min-height: 285px !important;
        padding: 8%;
    }

    .p {
        font-size: 18px;
    }

    .span {
        font-size: 14px;
    }

    .code-input {
        width: 50px;
        height: 50px;
        border-radius: 8px;
    }

    .code-container {
        gap: 20px;
    }

    .submit-btn {
        width: 60%;
        height: 47px;
        font-size: 18px;
    }

    .dont-receive,
    .dont-receive a {
        font-size: 16px;
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .verification-wrapper h2 {
        font-size: 38px;
        font-weight: 300;
    }

    .verification-wrapper {
        gap: 20px;
    }

    .form {
        width: 70%;
        min-height: 285px !important;
    }

    .p {
        font-size: 20px;
    }

    .span {
        font-size: 18px;
    }

    .code-input {
        width: 50px;
        height: 50px;
        border-radius: 8px;
    }

    .code-container {
        gap: 20px;
    }

    .submit-btn {
        width: 70%;
        height: 47px;
        font-size: 18px;
    }

    .dont-receive,
    .dont-receive a {
        font-size: 16px;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .form,
    .submit-btn {
        width: 70%;
    }

    .p {
        font-size: 30px;
        margin: 0;
    }

    .span {
        font-size: 20px;
    }
}

@media (min-width: 1600px) {
    .form,
    .submit-btn {
        width: 50%;
    }

    .submit-btn {
        width: 60%;
    }
}

</style>
