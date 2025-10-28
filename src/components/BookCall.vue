<script setup>
import {computed, ref} from 'vue';
import api from "../services/api.js";
import { useRoute } from 'vue-router';

const route = useRoute();

const fullName = ref('');
const phoneNumber = ref('');
// const email = ref('');

const errors = ref({
    fullName: '',
    phoneNumber: '',
    // email: '',
    general: ''
});

const successMessage = ref('');

const bookCall = async () => {
    errors.value = {
        fullName: '',
        phoneNumber: '',
        // email: '',
        general: ''
    };
    successMessage.value = '';

    let isValid = true;

    if (!fullName.value.trim()) {
        errors.value.fullName = 'messages.full_name_required';
        isValid = false;
    } else if (fullName.value.length > 100) {
        errors.value.fullName = 'messages.full_name_max';
        isValid = false;
    } else if (!/^[\p{L}\s]+$/u.test(fullName.value)) {
        errors.value.fullName = 'messages.full_name_string';
        isValid = false;
    }

    if (!phoneNumber.value.trim()) {
        errors.value.phoneNumber = 'messages.phone_number_required';
        isValid = false;
    } else if (!/^\+?[0-9\s\-]{7,20}$/.test(phoneNumber.value)) {
        errors.value.phoneNumber = 'messages.phone_number_invalid';
        isValid = false;
    }

    // if (!email.value.trim()) {
    //     errors.value.email = 'messages.email_required';
    //     isValid = false;
    // } else if (!/\S+@\S+\.\S+/.test(email.value)) {
    //     errors.value.email = 'messages.email_invalid';
    //     isValid = false;
    // } else if (email.value.length > 255) {
    //     errors.value.email = 'messages.email_max';
    //     isValid = false;
    // }

    if (!isValid) return;

    try {
        const bookCallData = {
            full_name: fullName.value,
            phone_number: phoneNumber.value,
            // email: email.value,
        };

        const response = await api.post('/api/calls/book-call', bookCallData);

        if (response.status === 201) {
            successMessage.value = 'messages.book_call_created';
            fullName.value = '';
            phoneNumber.value = '';
            // email.value = '';
        }
    } catch (error) {
        console.error('Error booking the call:', error);
        errors.value.general = 'messages.book_call_creation_failed';
    }
};

const isHomePage = computed(() => route.path === '/');
</script>

<template>
    <div :class="['book-call-section', { 'home-page-margin': isHomePage }]">>
        <div class="container">
            <div class="call-form">
                <h3 class="h3 text-capitalize">Book a Call & Join the Experience!</h3>
                <div class="form d-flex flex-column justify-content-center align-items-center">
                    <div class="w-100 d-flex flex-column align-items-center">
                        <input
                            class="form-input"
                            v-model="fullName"
                            name="fullName"
                            type="text"
                            :placeholder="$t('full_name') + '*'"
                        />
                        <p v-if="errors.fullName" class="required-field mt-1">{{ $t(errors.fullName) }}</p>
                    </div>

                    <div class="w-100 d-flex flex-column align-items-center">
                        <input
                            class="form-input"
                            v-model="phoneNumber"
                            type="text"
                            :placeholder="$t('phone') + '*'"
                            name="phone"
                        />
                        <p v-if="errors.phoneNumber" class="required-field mt-1">{{ $t(errors.phoneNumber) }}</p>
                    </div>

<!--                    <div class="w-100 d-flex flex-column align-items-center">-->
<!--                        <input-->
<!--                            class="form-input"-->
<!--                            v-model="email"-->
<!--                            type="text"-->
<!--                            name="email"-->
<!--                            :placeholder="$t('email') + '*'"-->
<!--                        />-->
<!--                        <p v-if="errors.email" class="required-field mt-1">{{ $t(errors.email) }}</p>-->
<!--                    </div>-->

                    <p v-if="errors.general" class="required-field mt-1 text-start">
                        {{ $t(errors.general) }}
                    </p>

                    <p v-if="successMessage" class="success-message mb-0 text-start">
                        {{ $t(successMessage) }}
                    </p>

                    <div class="book-call-btn-div d-flex justify-content-center align-items-center">
                        <button @click="bookCall" class="book-call-btn text-capitalize">
                           {{$t('book_call')}}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
.book-call-section {
    position: relative;
    background-image: url("/assets/images/home/header-background.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 4% 0;
    width: 100%;
    z-index: 0;
    display: flex;
    align-items: center;
}

.book-call-section::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--book-call-bg); /* Your overlay color */
    z-index: 1;
    display: block;
    pointer-events: none;
}

.call-form {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 60px;
}

.call-form .h3 {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    text-align: center;
    color: var(--white-245);
}

.form {
    backdrop-filter: blur(104px);
    background: var(--white-217);
    width: 60%;
    min-height: 344px;
    border-radius: 16px;
    gap: 15px;
}

.form-input {
    width: 62%;
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
}

.form-input:focus {
    color: var(--primary-20);
}

.form-input:focus::placeholder {
    color: var(--primary-20);
}

.required-field{
    width: 62%;
}

.book-call-btn-div {
    width: 100%;
    margin-top: 3%;
}

.book-call-btn {
    width: 62%;
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

.book-call-btn:hover {
    background: var(--book-cal-btn-hover);
}

.home-page-margin {
    margin-bottom: 8%;
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .book-call-section {
        padding: 18% 0 13%;
    }

    .home-page-margin {
        margin-bottom: 18%;
    }

    .call-form .h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .form {
        width: 100%;
        min-height: 286px !important;
    }

    .call-form {
        gap: 40px;
    }

    .form-input {
        width: 90%;
        border-radius: 6px;
        padding: 14px 23px;
    }

    .required-field{
        width: 90%;
        font-size: 14px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .book-call-btn-div {
        width: 100%;
    }

    .book-call-btn {
        width: 90%;
        font-size: 18px;
        height: 47px;
    }

    .book-call-btn:hover {
        background: var(--general-btn-light);
    }
}


/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .book-call-section {
        padding: 10% 0 8%;
    }

    .home-page-margin {
        margin-bottom: 10%;
    }

    .call-form .h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .form {
        width: 100%;
        min-height: 286px !important;
    }

    .call-form {
        gap: 40px;
    }

    .form-input {
        width: 90%;
        border-radius: 6px;
        padding: 14px 23px;
    }

    .required-field{
        width: 90%;
        font-size: 14px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .book-call-btn-div {
        width: 100%;
    }

    .book-call-btn {
        width: 90%;
        font-size: 18px;
        height: 47px;
    }
    .book-call-btn:hover {
        background: var(--general-btn-light);
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .book-call-section {
        padding: 10% 0 8%;
    }

    .call-form .h3 {
        font-size: 38px;
        font-weight: 300;
    }

    .form {
        width: 100%;
        min-height: 286px !important;
    }

    .call-form {
        gap: 40px;
    }

    .form-input {
        width: 90%;
        border-radius: 6px;
        padding: 14px 23px;
    }

    .required-field{
        width: 90%;
        font-size: 14px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .book-call-btn-div {
        width: 100%;
    }

    .book-call-btn {
        width: 90%;
        font-size: 18px;
        height: 47px;
    }
    .book-call-btn:hover {
        background: var(--general-btn-light);
    }

    .home-page-margin {
        margin-bottom: 10%;
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .form {
        width: 70%;
    }
}

</style>