<script setup>
import { computed, ref, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { useAuthStore } from "/src/stores/auth.js";
import api from "../../../services/api.js";

const auth = useAuthStore();
const { t } = useI18n();

const successMessageKey = ref(null);
const errorMessageKey = ref(null);
const isReady = ref(false);

const emailNotifications = computed({
    get() {
        if (!auth.user) return false;
        return Number(auth.user.notification_state) === 1;
    },
    set(value) {
        if (auth.user) {
            auth.user.notification_state = value ? 1 : 0;
        }
    }
});

const fetchProfile = async () => {
    await auth.checkAuth();
    const { data } = await api.get("/api/user/profile");
    if (auth.user) {
        auth.user.notification_state = Number(data.user.notification_state);
    }
};

onMounted(async () => {
    await fetchProfile();
    isReady.value = true;
});

const saveNotificationSettings = async () => {
    if (!auth.user) return;

    successMessageKey.value = null;
    errorMessageKey.value = null;

    try {
        const { data } = await api.post("/api/user/update-notification-preference", {
            notification_state: emailNotifications.value ? 1 : 0,
        });

        auth.user.notification_state = Number(data.notification_state);
        successMessageKey.value = data.message_key;
    } catch (err) {
        errorMessageKey.value =
            err.response?.data?.error || "auth.notification_state_update_failed";
    }
};
</script>

<template>
    <div>
        <div class="settings-tab-header">
            <h3 class="settings-tab-h3 text-capitalize">{{ t("auth.notifications.title") }}</h3>
            <p class="settings-tab-p">{{ t("auth.notifications.subtitle") }}</p>
        </div>

        <form class="settings-tab-body" @submit.prevent="saveNotificationSettings">
            <div class="d-flex flex-column settings-detail-item">
                <p class="settings-tab-p mb-0">{{ t("auth.notifications.notification_settings") }}</p>
                <div class="d-flex align-items-center gap-2">
                    <div class="d-flex gap-2">
                        <input
                            class="checkbox-custom"
                            type="checkbox"
                            v-model="emailNotifications"
                            id="flexCheckChecked"
                        />
                        <label class="form-check-label" for="flexCheckChecked"></label>
                        <span class="span">{{ t("auth.notifications.email") }}</span>
                    </div>
                </div>
            </div>

            <p v-if="successMessageKey" class="text-success mt-2 text-center">{{ t(successMessageKey) }}</p>
            <p v-if="errorMessageKey" class="text-danger mt-2 text-center">{{ t(errorMessageKey) }}</p>

            <div class="settings-btn-div d-flex justify-content-center align-items-center">
                <button class="settings-btn text-capitalize">{{ t("auth.notifications.save") }}</button>
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

.settings-btn-div {
    width:100%;
    height: 53px;
    margin-top: 8%;
}

.settings-btn {
    width:  273px;
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

.checkbox-custom {
    width: 24px;
    height: 24px;
    position: relative;
    appearance: none;
    display: flex;
    justify-content: center;
    align-items: center;
    border-radius: 2px;
    border: 1px solid var(--primary-40);
}

.checkbox-custom:checked {
    background-color: transparent;
}

.checkbox-custom:checked::before {
    content: "\2713";
    font-size: 20px;
    position: absolute;
    display: block;
    color: var(--primary-40);
}

.settings-detail-item{
    gap:20px;
}

.span{
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-90);
}


/* Extra Small Devices */
@media (max-width: 991px) {
    .span{
        font-size: 16px;
    }
}

/* Extra Large Devices */
@media (min-width: 1000px) {
    .settings-btn:hover {
        width:283px;
        height: 53px;
        font-size: 20px;
    }
}

</style>

