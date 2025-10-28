<script setup>
import { ref, computed, onMounted } from "vue";
import { useAuthStore } from "../../../stores/auth.js";
import api from "../../../services/api.js";
import { useI18n } from "vue-i18n";

const auth = useAuthStore();
const phone = ref(auth.user?.phone_number || '');

const { t } = useI18n();

const fetchProfile = async () => {
    await auth.checkAuth();
    const { data } = await api.get('/api/user/profile');
    phone.value = data.user.phone_number || '';
};

onMounted(() => {
    fetchProfile();
});

const messageKey = ref(null);
const messageType = ref(null);

const message = computed(() => (messageKey.value ? t(messageKey.value) : null));

const updatePhoneNumber = async () => {
    messageKey.value = null;
    messageType.value = null;

    try {
        const response = await api.post('/api/user/phone-number', {
            phone_number: phone.value
        });

        messageKey.value = response.data.message_key;
        messageType.value = 'success';

        await fetchProfile();

    } catch (error) {
        if (error.response?.status === 422) {
            const validationErrors = error.response.data;
            const firstKey = Object.keys(validationErrors)[0];
            const errorKey = validationErrors[firstKey][0];
            messageKey.value = errorKey;
            messageType.value = 'error';
        } else if (error.response?.data?.error) {
            messageKey.value = error.response.data.error;
            messageType.value = 'error';
        } else {
            messageKey.value = 'auth.phone_number_update_failed';
            messageType.value = 'error';
        }
    }
};

const userEmail = computed(() => auth.user?.email || "");
const userFirstName = computed(() => auth.user?.first_name || "");
const userLastName = computed(() => auth.user?.last_name || "");
</script>

<template>
    <div>
        <div class="settings-tab-header">
            <h3 class="settings-tab-h3 text-capitalize">{{ $t("auth.profile.title") }}</h3>
            <p class="settings-tab-p">{{ $t("auth.profile.subtitle") }}</p>
        </div>

        <form class="settings-tab-body" @submit.prevent="updatePhoneNumber">
            <div class="row d-flex justify-content-between">
                <div class="w-48 mb-3 pe-0">
                    <label for="firstName">{{ $t("auth.profile.first_name") }}</label>
                    <input
                        type="text"
                        id="firstName"
                        class="form-control"
                        :placeholder="$t('auth.profile.placeholders.first_name')"
                        :value="userFirstName"
                        readonly
                    />
                </div>
                <div class="w-48 mb-3 pe-0">
                    <label for="lastName">{{ $t("auth.profile.last_name") }}</label>
                    <input
                        type="text"
                        id="lastName"
                        class="form-control"
                        :placeholder="$t('auth.profile.placeholders.last_name')"
                        :value="userLastName"
                        readonly
                    />
                </div>
            </div>

            <div class="row d-flex justify-content-between">
                <div class="w-48 mb-3 pe-0">
                    <label for="email">{{ $t("auth.profile.email") }}</label>
                    <input
                        type="email"
                        id="email"
                        class="form-control"
                        :placeholder="$t('auth.profile.placeholders.email')"
                        :value="userEmail"
                        readonly
                    />
                </div>
                <div class="w-48 mb-3 pe-0">
                    <label for="phone">{{ $t("auth.profile.phone") }}</label>
                    <input
                        type="tel"
                        id="phone"
                        class="form-control"
                        v-model="phone"
                        :placeholder="$t('auth.profile.placeholders.phone')"
                    />
                    <div v-if="message && messageType === 'error'" class="required-field mt-2">
                        {{ message }}
                    </div>
                </div>
            </div>

            <div v-if="message && messageType === 'success'" class="text-center success-message mt-2">
                {{ message }}
            </div>

            <div class="settings-btn-div d-flex justify-content-center align-items-center">
                <button class="settings-btn text-capitalize">
                    {{ $t("auth.profile.save") }}
                </button>
            </div>
        </form>
    </div>
</template>

<style scoped>
.settings-tab-body label {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 20px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-100);
    margin-bottom: 15px;
}

.form-control {
    border-width: 0.5px;
    border-style: solid;
    border-color: var(--primary-50);
    box-sizing: border-box;
    -webkit-appearance: none;
    border-radius: 8px;
    padding: 15px;
    color: var(--primary-50) !important;
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
}

.form-control:focus::placeholder {
    color: var(--primary-30) !important;
}

.form-control::placeholder {
    color: var(--primary-50) !important;
}

.form-control:focus {
    box-shadow: none;
    outline: none;
    border-width: 0.5px;
    border-style: solid;
    border-color: var(--primary-50);
    color: var(--primary-50) !important;
}

.settings-btn-div {
    width: 100%;
    height: 53px;
    margin-top: 8%;
}

.settings-btn {
    width: 273px;
    height: 50px;
    border-radius: 25px;
    background: var(--general-btn-light);
    border: none;
    outline: none;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
}


.w-48 {
    width: 48%;
}

/* Extra Small Devices */
@media (max-width: 991px) {
    .row {
        flex-direction: column;
    }

    .w-48 {
        width: 97%;
    }

    .settings-tab-body label {
        font-size: 16px;
    }

    .form-control {
        font-size: 14px;
    }
}


/* Large Devices */
@media (min-width: 992px) and (max-width: 1199px) {
    /* Styles for large devices */
}

/* Extra Large Devices */
@media (min-width: 1000px) {
    .settings-btn:hover {
        width: 283px;
        height: 53px;
        font-size: 20px;
    }
}


</style>

