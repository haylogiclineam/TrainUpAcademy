<script setup>
import {ref} from 'vue';
import api from "../../services/api.js";

const name = ref('');
const email = ref('');
const message = ref('');

const errors = ref({
    name: '',
    email: '',
    message: '',
    general: ''
});

const successMessage = ref('');

const contact = async () => {
    errors.value = {
        name: '',
        email: '',
        message: '',
        general: ''
    };
    successMessage.value = '';

    let isValid = true;

    if (!name.value.trim()) {
        errors.value.name = 'messages.name_required';
        isValid = false;
    } else if (name.value.length > 100) {
        errors.value.name = 'messages.name_max';
        isValid = false;
    } else if (!/^[\p{L}\s]+$/u.test(name.value)) {
        errors.value.name = 'messages.name_string';
        isValid = false;
    }

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

    if (!message.value.trim()) {
        errors.value.message = 'messages.message_required';
        isValid = false;
    } else if (message.value.length > 1000) {
        errors.value.message = 'messages.message_max';
        isValid = false;
    } else if (!/^[\p{L}\s]+$/u.test(message.value)) {
        errors.value.message = 'messages.message_string';
        isValid = false;
    }

    if (!isValid) return;

    try {
        const contactData = {
            name: name.value,
            email: email.value,
            message: message.value,
        };

        const response = await api.post('/api/contact/send-contact', contactData);

        if (response.status === 201) {
            successMessage.value = 'messages.contact_created';
            name.value = '';
            email.value = '';
            message.value = '';
        }
    } catch (error) {
        console.error('Error sending the contact:', error);
        errors.value.general = 'messages.contact_creation_failed';
    }
};
</script>

<template>
    <div class="send-us-message-section">
        <div class="container">
            <div class="msg-form">
                <h3 class="h3 text-capitalize">Send Us a Message</h3>
                <div class="form d-flex flex-column">

                    <div class="d-flex flex-column form-input-block">
                        <div class="w-100">
                            <label for="email">{{ $t('email') }}*</label>
                        </div>
                        <input
                                id="email"
                                name="email"
                                class="form-input"
                                type="text"
                                :placeholder="$t('your_email')"
                                v-model="email"
                        />
                        <p v-if="errors.email" class="required-field mt-1">{{ $t(errors.email) }}</p>
                    </div>

                    <div class="d-flex flex-column form-input-block">
                        <div class="w-100">
                            <label for="name">{{ $t('name') }}*</label>
                        </div>
                        <input
                                id="name"
                                name="name"
                                class="form-input"
                                type="text"
                                :placeholder="$t('your_name')"
                                v-model="name"
                        />
                        <p v-if="errors.name" class="required-field mt-1">{{ $t(errors.name) }}</p>
                    </div>

                    <div class="d-flex flex-column form-input-block">
                        <div class="w-100">
                            <label for="message">{{ $t('message') }}*</label>
                        </div>
                        <textarea
                                id="message"
                                name="message"
                                rows="4"
                                cols="50"
                                class="form-input"
                                type="text"
                                :placeholder="$t('your_message')"
                                v-model="message"
                        ></textarea>
                        <p v-if="errors.message" class="required-field mt-1">{{ $t(errors.message) }}</p>
                    </div>

                    <p v-if="errors.general" class="required-field mt-1 text-start">
                        {{ $t(errors.general) }}
                    </p>

                    <p v-if="successMessage" class="success-message mb-0 text-center">
                        {{ $t(successMessage) }}
                    </p>

                    <div class="send-msg-btn-div d-flex justify-content-center align-items-center">
                        <button @click="contact" class="send-msg-btn text-capitalize">
                            {{ $t('submit') }}
                        </button>
                    </div>

                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.send-us-message-section {
    position: relative;
    background-image: url("/assets/images/repeting-image.jpg");
    background-size: cover;
    background-position: center;
    background-repeat: no-repeat;
    padding: 4% 0;
    width: 100%;
    z-index: 0;
    display: flex;
    align-items: center;
}

.send-us-message-section::before {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--send-us-mgs-bg);
    z-index: 1;
    display: block;
    pointer-events: none;
}

.msg-form {
    position: relative;
    z-index: 2;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: 60px;
}

.msg-form .h3 {
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
    border-radius: 16px;
    gap: 10px;
    padding: 4%;
}

.form-input,
textarea {
    width: 100%;
    border-radius: 16px;
    background: var(--white-179);
    outline: none;
    border: none;
    color: var(--white-245);
    font-weight: 300;
    padding: 18px 23px;
}

.form-input::placeholder,
textarea {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--white-245);
    text-transform: capitalize;
    resize: none;
}

.form-input:focus,
textarea:focus {
    color: var(--primary-20);
}

.form-input:focus::placeholder,
textarea:focus::placeholder {
    color: var(--primary-20);
}

.send-msg-btn-div {
    width: 100%;
    margin-top: 3%;
}

.send-msg-btn {
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

.send-msg-btn:hover {
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

/* Extra Small Devices */
@media (max-width: 575px) {
    .send-us-message-section {
        padding: 18% 0 13%;
    }

    .msg-form .h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .form {
        width: 100%;
        min-height: 285px !important;
    }

    .msg-form {
        gap: 40px;
    }

    .form-input {
        width: 100%;
        border-radius: 6px;
        padding: 11px 13px;
    }

    .form-input::placeholder,
    textarea::placeholder {
        font-size: 14px;
    }

    .send-msg-btn-div {
        width: 100%;
    }

    .send-msg-btn {
        width: 100%;
        font-size: 18px;
        height: 47px;
    }


    .form-input-block label {
        font-size: 16px !important;
    }

    .send-msg-btn:hover {
        background: var(--general-btn-light);
    }
}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .send-us-message-section {
        padding: 10% 0 8%;
    }

    .msg-form .h3 {
        font-size: 22px;
        font-weight: 300;
    }

    .form {
        width: 100%;
        min-height: 285px !important;
    }

    .msg-form {
        gap: 40px;
    }

    .form-input {
        width: 100%;
        border-radius: 6px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .send-msg-btn-div {
        width: 100%;
    }

    .send-msg-btn {
        width: 100%;
        font-size: 18px;
        height: 47px;
    }

    .send-msg-btn:hover {
        background: var(--general-btn-light);
    }
}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .send-us-message-section {
        padding: 10% 0 8%;
    }

    .msg-form .h3 {
        font-size: 38px;
        font-weight: 300;
    }

    .form {
        width: 100%;
        min-height: 285px !important;
    }

    .msg-form {
        gap: 40px;
    }

    .form-input {
        width: 100%;
        border-radius: 6px;
    }

    .form-input::placeholder {
        font-size: 14px;
    }

    .send-msg-btn-div {
        width: 100%;
    }

    .send-msg-btn {
        width: 100%;
        font-size: 18px;
        height: 47px;
    }

    .send-msg-btn:hover {
        background: var(--general-btn-light);
    }
}

/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    .form {
        width: 70%;
    }
}

</style>