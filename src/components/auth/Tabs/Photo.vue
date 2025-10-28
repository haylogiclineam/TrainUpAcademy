<script setup>
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import api from '../../../services/api.js'
import {useAuthStore} from '/src/stores/auth.js';

const auth = useAuthStore()
auth.checkAuth()

const userImage = computed(() => {
    return auth.user?.image
        ? `${import.meta.env.VITE_API_BASE_URL}/storage/auth/${auth.user.image}`
        : null;
});
const { t } = useI18n()

const fileInput = ref(null)
const fileName = ref('')
const previewUrl = ref(null)

const messageKey = ref(null)
const messageType = ref(null)
const message = computed(() => (messageKey.value ? t(messageKey.value) : null))

const validationErrors = ref({})

const triggerFileSelect = () => {
    fileInput.value?.click()
}

const handleFileChange = (event) => {
    const file = event.target.files[0]
    if (file) {
        fileName.value = file.name
        previewUrl.value = URL.createObjectURL(file)
    }
}
const uploadImage = async () => {
    messageKey.value = null
    messageType.value = null
    validationErrors.value = {}

    const file = fileInput.value?.files[0]
    if (!file) {
        messageKey.value = 'auth.image_required'
        messageType.value = 'error'
        return
    }

    const formData = new FormData()
    formData.append('image', file)

    try {
        const response = await api.post('/api/user/update-profile-image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })

        messageKey.value = response.data.message_key
        messageType.value = 'success'

        await auth.fetchUserData()

        fileName.value = ''
        fileInput.value.value = ''

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
            <h3 class="settings-tab-h3 text-capitalize">{{ $t('auth.photo.title') }}</h3>
            <p class="settings-tab-p">{{ $t('auth.photo.subtitle') }}</p>
        </div>

        <form class="settings-tab-body" @submit.prevent="uploadImage">
            <div class="profile-upload-container">
                <div class="image-container">
                    <div class="image-placeholder">
                        <div class="image-block">
                            <img :src="previewUrl || userImage" alt="User image" />
                        </div>
                    </div>
                </div>

                <label class="file-label">{{ $t('auth.photo.label') }}</label>

                <div class="upload-section">
                    <div class="custom-file-display" @click="triggerFileSelect">
                        {{ fileName || $t('auth.photo.no_file') }}
                    </div>
                    <button type="button"  class="upload-button" @click="triggerFileSelect">
                        {{ $t('auth.photo.upload') }}
                    </button>
                    <input
                        type="file"
                        ref="fileInput"
                        @change="handleFileChange"
                        class="hidden-file-input"
                        accept="image/*"
                    />
                </div>

                <div v-if="validationErrors.image" class="required-field mt-2">
                    {{ $t(validationErrors.image) }}
                </div>

                <div v-if="message && messageType === 'success'" class="text-center success-message mt-2">
                    {{ message }}
                </div>

                <div v-if="message && messageType === 'error'" class="required-field mt-2">
                    {{ message }}
                </div>


                <div class="settings-btn-div d-flex justify-content-center align-items-center">
                    <button type="submit" class="settings-btn text-capitalize">
                        {{ $t('auth.photo.save') }}
                    </button>
                </div>
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


.profile-upload-container {
    max-width: 510px;
    margin: 0 auto;
}

.image-container {
    padding: 25px;
    background-color: #fff;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.05);
    border-radius: 8px;
    text-align: center;
    border-width: 0.5px;
    border-style: solid;
    border-color: var(--primary-50);
}

.image-placeholder {
    width: 100%;
    min-height: 170px;
    background-color: var(--primary-10);
    border-radius: 6px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.upload-section {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: space-between;
}

.custom-file-display {
    padding: 12px;
    border-radius: 8px;
    cursor: pointer;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-50);
    border-width: 0.5px;
    border-style: solid;
    border-color: var(--primary-50);
    width: 70%;
}

.hidden-file-input {
    display: none;
}

.upload-button {
    padding: 13px;
    border: 1px solid var(--secondary-1-100);
    background-color: transparent;
    color: var(--secondary-1-100);
    border-radius: 8px;
    cursor: pointer;
    transition: background-color 0.2s ease;
    width: 30%;
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 18px;
    line-height: 100%;
    letter-spacing: 2%;
    text-align: center;
}


.image-block {
    width: 140px;
    height: 140px;
}

.image-block img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    border-radius: 50%;
}

.file-label {
    margin-top: 15px;
}

/* Extra Small Devices */
@media (max-width: 991px) {
   .image-container{
       padding: 15px;
   }

    .image-block{
        width: 119px;
        height: 119px;
    }

    .settings-tab-body label,
    .custom-file-display,
    .upload-button{
        font-size: 14px;
    }

}

/* Extra Large Devices */
@media (min-width: 1000px) {
    .upload-button:hover {
        background-color: var(--settings-image-upload-btn-hover);
    }

    .settings-btn:hover {
        width: 283px;
        height: 53px;
        font-size: 20px;
    }
}


</style>

