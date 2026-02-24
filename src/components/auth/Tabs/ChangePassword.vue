<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '../../../services/api.js'

const { t } = useI18n()

const oldPassword = ref('')
const newPassword = ref('')
const confirmPassword = ref('')

const messageKey = ref(null)
const messageType = ref(null)
const message = computed(() => (messageKey.value ? t(messageKey.value) : null))

const validationErrors = ref({})

const changePassword = async () => {
    messageKey.value = null
    messageType.value = null
    validationErrors.value = {}

    try {
        const response = await api.post('/api/user/change-password', {
            old_password: oldPassword.value,
            new_password: newPassword.value,
            new_password_confirmation: confirmPassword.value
        })

        messageKey.value = response.data.message_key
        messageType.value = 'success'

        oldPassword.value = ''
        newPassword.value = ''
        confirmPassword.value = ''

    } catch (error) {
        if (error.response?.status === 422) {
            const errors = error.response.data
            for (const key in errors) {
                validationErrors.value[key] = errors[key][0]
            }
            messageType.value = 'error'
        } else if (error.response?.data?.error) {
            messageKey.value = error.response.data.error
            messageType.value = 'error'
        } else {
            messageKey.value = 'auth.something_went_wrong'
            messageType.value = 'error'
        }
    }
}
</script>


<template>
    <div>
        <div class="settings-tab-header">
            <h3 class="settings-tab-h3 text-capitalize">{{ $t('auth.changePassword.title') }}</h3>
            <p class="settings-tab-p">{{ $t('auth.changePassword.subtitle') }}</p>
        </div>

        <form class="settings-tab-body" @submit.prevent="changePassword">
            <!-- Hidden username field to fix accessibility warnings for password managers -->
            <input type="text" autocomplete="username" style="display: none;" aria-hidden="true" tabindex="-1">
            <div class="mb-3 w-48">
                <label for="oldPassword">{{ $t('auth.changePassword.old_password') }}*</label>
                <input
                    type="password"
                    id="oldPassword"
                    class="form-control"
                    autocomplete="current-password"
                    v-model="oldPassword"
                    :placeholder="$t('auth.changePassword.placeholders.old_password')"
                />
                <small v-if="validationErrors.old_password" class="text-danger">
                    {{ $t(validationErrors.old_password) }}
                </small>
            </div>

            <div class="row d-flex justify-content-between align-items-baseline">
                <div class="w-48 mb-3 pe-0 row-item">
                    <label for="newPassword">{{ $t('auth.changePassword.new_password') }}*</label>
                    <input
                        type="password"
                        id="newPassword"
                        class="form-control"
                        autocomplete="new-password"
                        v-model="newPassword"
                        :placeholder="$t('auth.changePassword.placeholders.new_password')"
                    />
                    <small v-if="validationErrors.new_password" class="text-danger">
                        {{ $t(validationErrors.new_password) }}
                    </small>
                </div>
                <div class="w-48 mb-3 pe-0 row-item">
                    <label for="confirmPassword">{{ $t('auth.changePassword.confirm_password') }}*</label>
                    <input
                        type="password"
                        id="confirmPassword"
                        class="form-control"
                        autocomplete="new-password"
                        v-model="confirmPassword"
                        :placeholder="$t('auth.changePassword.placeholders.confirm_password')"
                    />
                </div>
            </div>
            <div v-if="message" :class="['text-center', messageType === 'success' ? 'success-message' : 'required-field']">
                {{ message }}
            </div>
            <div class="settings-btn-div d-flex justify-content-center align-items-center">
                <button type="submit" class="settings-btn text-capitalize">
                    {{ $t('auth.changePassword.button') }}
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

.form-control{
    border-width: 0.5px;
    border-style: solid;
    border-color:  var(--primary-50);
    box-sizing: border-box;
    -webkit-appearance: none;
    appearance: none;
    border-radius: 8px;
    padding: 15px;
    color:var(--primary-50) !important;
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
}

.form-control:focus::placeholder{
    color:var(--primary-30) !important;
}

.form-control::placeholder{
    color:var(--primary-50) !important;
}

.form-control:focus{
    box-shadow: none;
    outline: none;
    border-width: 0.5px;
    border-style: solid;
    border-color:  var(--primary-50);
    color:var(--primary-50) !important;
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

.w-48{
    width: 48%;
}

/* Extra Small Devices */
@media (max-width: 991px) {
    .row{
        flex-direction: column;
    }
    .w-48 {
        width: 100%;
    }

    .settings-tab-body label{
        font-size: 16px;
    }

    .form-control{
        font-size: 14px;
    }

    .row-item{
        padding-right: 10px;
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

