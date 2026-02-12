<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import api from "../../../services/api.js";
import { useI18n } from "vue-i18n";

const { locale, t } = useI18n();

const errors = ref({});
const successMessage = ref('');
const isAdding = ref(false);

const fileInput = ref(null);
const fileName = ref('');
const isDragging = ref(false);

const faqList = reactive({
    en: [{ question_en: '', answer_en: '' }],
    ru: [{ question_ru: '', answer_ru: '' }],
    arm: [{ question_arm: '', answer_arm: '' }],
});

const highlights = ref({
    en: [''],
    ru: [''],
    arm: [''],
});


const form = ref({
    video: '',
    title_arm: '',
    title_ru: '',
    title_en: '',
    price_arm: '',
    currency_arm: '',
    price_ru: '',
    currency_ru: '',
    price_en: '',
    currency_en: 'AMD',
    description_arm: '',
    description_ru: '',
    description_en: '',
    details_by_instructor: [],
});

const resetForm = () => {
    form.value = {
        video: '',
        title_arm: '',
        title_ru: '',
        title_en: '',
        price_arm: '',
        currency_arm: 'AMD',
        price_ru: '',
        currency_ru: 'AMD',
        price_en: '',
        currency_en: 'AMD',
        description_arm: '',
        description_ru: '',
        description_en: '',
        details_by_instructor: courseDetails.value.map(detail => ({
            course_details_data_id: detail.id,
            time: detail.time || null,
            selected: false,
        })),
    };

    faqList.en = [{ question_en: '', answer_en: '' }];
    faqList.ru = [{ question_ru: '', answer_ru: '' }];
    faqList.arm = [{ question_arm: '', answer_arm: '' }];

    highlights.value = {
        en: [''],
        ru: [''],
        arm: [''],
    };

    fileName.value = '';
    if (fileInput.value) {
        fileInput.value.value = '';
    }

    errors.value = {};
};


function onCheckboxChange(event, detail, index) {
    form.value.details_by_instructor[index].selected = event.target.checked;
}

const courseDetails = ref([]);

const getAllDetails = async () => {
    try {
        const response = await api.get('/api/course-details-data');

        courseDetails.value = response.data.map(detail => ({
            ...detail,
            editable: Number(detail.editable),
            originalTime: detail.time,
            isEditing: detail.time === null,
        }));


        form.value.details_by_instructor = courseDetails.value.map(detail => ({
            course_details_data_id: detail.id,
            time: detail.time || null,
            selected: false,
        }));
    } catch (error) {
        console.error(error.response?.data || error.message);
    }
};

onMounted(() => {
    getAllDetails();
});

const triggerFileInput = () => fileInput.value.click();

const onFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
        form.value.video = file;
        fileName.value = file.name;
    }
};

const onDragOver = () => (isDragging.value = true);
const onDragLeave = () => (isDragging.value = false);

const onDrop = (event) => {
    const file = event.dataTransfer.files[0];
    if (file) {
        form.value.video = file;
        fileName.value = file.name;
    }
    isDragging.value = false;
};

const addFAQ = (lang) => {
    faqList[lang].push({ [`question_${lang}`]: '', [`answer_${lang}`]: '' });
};

const removeFAQ = (lang, index) => {
    faqList[lang].splice(index, 1);
};

const addHighlight = (lang) => {
    highlights.value[lang].push('');
};

const removeHighlight = (lang, index) => {
    highlights.value[lang].splice(index, 1);
};

const selectCurrency = (currency, lang) => {
    if (lang === 'en') form.value.currency_en = currency;
    if (lang === 'arm') form.value.currency_arm = currency;
    if (lang === 'ru') form.value.currency_ru = currency;
};


const prepareFormData = () => {
    const formData = new FormData();

    const dataToSend = form.value.details_by_instructor
        .map((item, index) => {
            const editable = courseDetails.value[index]?.editable === 1;
            const hasTime = item.time && item.time !== '';
            const selected = item.selected;

            return {
                course_details_data_id: item.course_details_data_id,
                time: editable && hasTime
                    ? (item.time.length === 5 ? item.time + ':00' : item.time)
                    : '',
                send: selected || (editable && hasTime),
            };
        })
        .filter(item => item.send);

    if (dataToSend.length === 0) {
        errors.value['details_by_instructor'] = [t('auth.add_course.course_details_time_required')];
        throw new Error('Instructor details time required');
    } else {
        delete errors.value['details_by_instructor'];
    }

    dataToSend.forEach((item, index) => {
        formData.append(`details_by_instructor[${index}][course_details_data_id]`, item.course_details_data_id);
        formData.append(`details_by_instructor[${index}][time]`, item.time);
    });

    return formData;
};

const addCourse = async () => {
    errors.value = {};
    isAdding.value = true;

    try {

        const langs = ['en', 'ru', 'arm'];

        const maxFaqCount = Math.max(
            faqList.en.length,
            faqList.ru.length,
            faqList.arm.length
        );

        const allFaqs = [];
        for (let i = 0; i < maxFaqCount; i++) {
            const faqItem = {};
            langs.forEach((lang) => {
                faqItem[`question_${lang}`] = faqList[lang][i]?.[`question_${lang}`] ?? '';
                faqItem[`answer_${lang}`] = faqList[lang][i]?.[`answer_${lang}`] ?? '';
            });
            allFaqs.push(faqItem);
        }

        const maxHighlightCount = Math.max(
            highlights.value.en.length,
            highlights.value.ru.length,
            highlights.value.arm.length
        );

        const allHighlights = [];
        for (let i = 0; i < maxHighlightCount; i++) {
            const highlightItem = {};
            langs.forEach((lang) => {
                const nameKey = `name_${lang}`;
                highlightItem[nameKey] = highlights.value[lang][i] || '';
            });
            allHighlights.push(highlightItem);
        }

        let formData;
        try {
            formData = prepareFormData();
        } catch (e) {
            isAdding.value = false;
            return;
        }

        const simpleFields = [
            'title_arm', 'title_ru', 'title_en',
            'price_arm', 'currency_arm',
            'price_ru', 'currency_ru',
            'price_en', 'currency_en',
            'description_arm', 'description_ru', 'description_en',
        ];
        simpleFields.forEach(field => {
            if (form.value[field] !== undefined && form.value[field] !== null) {
                formData.append(field, form.value[field]);
            }
        });

        if (form.value.video) {
            formData.append('video', form.value.video);
        }

        allFaqs.forEach((faq, index) => {
            for (const key in faq) {
                formData.append(`faqs[${index}][${key}]`, faq[key]);
            }
        });

        allHighlights.forEach((highlight, index) => {
            for (const key in highlight) {
                formData.append(`highlights[${index}][${key}]`, highlight[key]);
            }
        });

        const response = await api.post('/api/courses', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        if (response.data.message_key) {
            successMessage.value = t(response.data.message_key);
            resetForm();
        }

    } catch (error) {
        const responseErrors = error.response?.data?.errors;
        if (responseErrors) {
            errors.value = responseErrors;
        } else {
            console.error('❌ Error creating course:', error.response?.data || error.message);
        }
    }finally {
        isAdding.value = false;
    }
};

const showRu = ref(false);
const showArm = ref(false);

const imageUrl = (path) => `${import.meta.env.VITE_API_BASE_URL}/storage/${path}`;
</script>

<template>
    <div class="add-course-section">
        <div class="container">
            <div class="add-course-main">
                <div class="d-flex justify-content-between align-items-center course-title-block">
                    <h3 class="text-capitalize add-course-section-title">{{ $t('auth.add_course.general_title') }}</h3>
                </div>
                <div class="add-course-block d-flex">
                    <div class="upload-block">
                        <div class="upload-area"
                             @dragover.prevent="onDragOver"
                             @dragleave.prevent="onDragLeave"
                             @drop.prevent="onDrop"
                             :class="{ 'dragging': isDragging }"
                        >
                            <svg class="flex-shrink-0" width="60" height="60" viewBox="0 0 60 60" fill="none"
                                 xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
                                <rect width="60" height="60" fill="url(#pattern0_1230_7058)"/>
                                <defs>
                                    <pattern id="pattern0_1230_7058" patternContentUnits="objectBoundingBox" width="1"
                                             height="1">
                                        <use xlink:href="#image0_1230_7058" transform="scale(0.00195312)"/>
                                    </pattern>
                                    <image id="image0_1230_7058" width="512" height="512" preserveAspectRatio="none"
                                           xlink:href="data:image/png;base64,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"/>
                                </defs>
                            </svg>

                            <p class="mt-3 file-upload-title">{{ $t('auth.add_course.drag_text') }}</p>
                            <div class="browse-btn-div d-flex justify-content-center align-items-center">
                                <button type="button" class="browse-btn" @click="triggerFileInput">
                                    {{ $t('auth.add_course.browse') }}
                                </button>
                            </div>
                            <input
                                    ref="fileInput"
                                    type="file"
                                    accept="video/*"
                                    @change="onFileChange"
                                    style="display: none"
                            />

                            <p v-if="fileName" class="mt-2 selected-file-name"> {{
                                $t('auth.add_course.selected_file')
                                }} {{ fileName }}</p>
                        </div>
                        <span v-if="errors.video" class="required-field">{{
                            t('auth.add_course.' + errors.video[0])
                            }}</span>
                        <div class="course-detail-block mt-4">
                            <p class="text-capitalize course-detail-title">{{
                                $t('auth.add_course.course_details')
                                }}</p>
                            <div class="course-detail-items-list">
                                <template v-for="(detail, index) in courseDetails" :key="detail.id">
                                    <div class="d-flex align-items-center gap-2">

                                        <!-- Checkbox toggles 'selected' -->
                                        <template v-if="detail.editable !== 1">
                                            <input
                                                    class="checkbox-custom flex-shrink-0"
                                                    type="checkbox"
                                                    :id="'checkbox-' + detail.id"
                                                    v-model="form.details_by_instructor[index].selected"
                                            />
                                            <label class="form-check-label" :for="'checkbox-' + detail.id"></label>
                                        </template>

                                        <img :src="imageUrl(detail.icon)" :alt="detail.icon"/>

                                        <template v-if="detail.editable === 1">
                                            <template v-if="detail.time === null || detail.isEditing">
                                                <input
                                                        type="number" min="0"
                                                        class="time-input"
                                                        v-model="form.details_by_instructor[index].time"
                                                />
                                            </template>
                                            <template v-else>
                                                <span class="span">{{ detail.time }}</span>
                                            </template>
                                        </template>

                                        <template v-else>
                                            <span class="span">{{ detail.time }}</span>
                                        </template>

                                        <span class="span ms-2">{{ detail[`text_${locale}`] }}</span>
                                    </div>
                                </template>
                            </div>
                            <span v-if="errors.details_by_instructor" class="required-field">
                              {{ errors.details_by_instructor[0] }}
                            </span>

                        </div>
                    </div>
                    <div class="form-input-block w-100">
                        <div class="mb-3">
                            <label class="form-label">{{ $t('auth.add_course.add_translations') }}</label><br/>
                            <div class="d-flex gap-3">
                                <div class="d-flex gap-2">
                                    <input class="checkbox-custom" type="checkbox" id="addRu" v-model="showRu"/>
                                    <label for="addRu" class="check-ru">{{ $t('auth.add_course.russian') }}</label>
                                </div>

                                <div class="d-flex gap-2">
                                    <input class="checkbox-custom" type="checkbox" id="addArm" v-model="showArm"/>
                                    <label for="addArm" class="check-arm">{{ $t('auth.add_course.armenian') }}</label>
                                </div>
                            </div>
                        </div>

                        <form class="form">
                            <!-- ENGLISH -->
                            <div>
                                <h5 class="title-translation">{{ $t('auth.add_course.title_en') }} *</h5>
                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">{{ $t('auth.add_course.course_title') }}*</label>
                                        <input v-model="form.title_en" type="text" class="form-control"
                                               :placeholder="$t('auth.add_course.course_title_placeholder')">
                                        <span v-if="errors.title_en" class="required-field">{{
                                            t('auth.add_course.' + errors.title_en)
                                            }}</span>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">{{ $t('auth.add_course.course_price') }}*</label>
                                        <div class="input-group">
                                            <input v-model="form.price_en" type="number" class="form-control"
                                                   :placeholder="$t('auth.add_course.course_price_placeholder')">

                                            <div class="dropdown">
                                                <button
                                                    class="btn currency-btn"
                                                    type="button"
                                                    disabled
                                                >
                                                    {{ form.currency_en || 'AMD' }}
                                                </button>
                                                <ul class="dropdown-menu dropdown-menu-end">
                                                    <li>
                                                        <a class="dropdown-item" href="#" @click.prevent="selectCurrency('USD', 'en')">USD</a>
                                                    </li>
                                                    <li>
                                                        <a class="dropdown-item" href="#" @click.prevent="selectCurrency('EUR', 'en')">EUR</a>
                                                    </li>
                                                    <li>
                                                        <a class="dropdown-item" href="#" @click.prevent="selectCurrency('AMD', 'en')">AMD</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <span v-if="errors.price_en" class="required-field">
                                          {{ t('auth.add_course.' + errors.price_en) }}
                                        </span>
                                        <span v-if="errors.price_en && errors.currency_en"><br></span>
                                        <span v-if="errors.currency_en" class="required-field">
                                          {{ t('auth.add_course.' + errors.currency_en) }}
                                        </span>
                                    </div>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">{{ $t('auth.add_course.faq_label') }}*</label>

                                    <div class="mb-3">
                                        <input v-model="faqList.en[0].question_en" type="text" class="form-control mb-2"
                                               :placeholder="$t('auth.add_course.question_placeholder')"/>

                                        <input v-model="faqList.en[0].answer_en" type="text" class="form-control"
                                               :placeholder="$t('auth.add_course.answer_placeholder')"/>
                                        <p v-if="errors['faqs.0.question_en']" class="required-field">
                                            {{ t('auth.add_course.' + errors['faqs.0.question_en'][0])}}
                                          </p>
                                        <p v-if="errors['faqs.0.answer_en']" class="required-field">
                                            {{ t('auth.add_course.' + errors['faqs.0.answer_en'][0] )}}
                                          </p>

                                    </div>
                                    <div v-for="(faq, index) in faqList.en.slice(1)" :key="index + 1" >
                                        <div class="position-relative mb-2 mt-2">
                                            <input
                                                    v-model="faq.question_en"
                                                    type="text"
                                                    class="form-control pe-5"
                                                    :placeholder="$t('auth.add_course.question_placeholder')"
                                            />

                                            <svg
                                                    class="position-absolute top-50 end-0 translate-middle-y me-3"
                                                    role="button"
                                                    @click="removeFAQ('en',index + 1)"
                                                    width="14"
                                                    height="14"
                                                    viewBox="0 0 14 14"
                                                    fill="none"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    style="cursor: pointer;"
                                            >
                                                <path
                                                        d="M12.9998 0.99994C12.8123 0.812469 12.558 0.707153 12.2928 0.707153C12.0277 0.707153 11.7733 0.812469 11.5858 0.99994L6.99982 5.58594L2.41382 0.99994C2.22629 0.812469 1.97198 0.707153 1.70682 0.707153C1.44165 0.707153 1.18735 0.812469 0.999818 0.99994C0.812347 1.18747 0.707031 1.44178 0.707031 1.70694C0.707031 1.9721 0.812347 2.22641 0.999818 2.41394L5.58582 6.99994L0.999818 11.5859C0.812347 11.7735 0.707031 12.0278 0.707031 12.2929C0.707031 12.5581 0.812347 12.8124 0.999818 12.9999C1.18735 13.1874 1.44165 13.2927 1.70682 13.2927C1.97198 13.2927 2.22629 13.1874 2.41382 12.9999L6.99982 8.41394L11.5858 12.9999C11.7733 13.1874 12.0277 13.2927 12.2928 13.2927C12.558 13.2927 12.8123 13.1874 12.9998 12.9999C13.1873 12.8124 13.2926 12.5581 13.2926 12.2929C13.2926 12.0278 13.1873 11.7735 12.9998 11.5859L8.41382 6.99994L12.9998 2.41394C13.1873 2.22641 13.2926 1.9721 13.2926 1.70694C13.2926 1.44178 13.1873 1.18747 12.9998 0.99994Z"
                                                        fill="#808793"
                                                />
                                            </svg>
                                        </div>

                                        <input
                                                v-model="faq.answer_en"
                                                type="text"
                                                class="form-control"
                                                :placeholder="$t('auth.add_course.answer_placeholder')"
                                        />
                                    </div>
                                    <p v-if="errors['faqs']" class="required-field">
                                        {{  t('auth.add_course.'  + errors['faqs'][0]) }}
                                    </p>
                                    <button type="button" class="add-btn mt-3" @click="addFAQ('en')">
                                        {{ $t('auth.add_course.add_new') }}
                                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                    d="M14 0C6.28017 0 0 6.28017 0 14C0 21.7198 6.28017 28 14 28C21.7198 28 28 21.7198 28 14C28 6.28017 21.7198 0 14 0ZM14 26.8333C6.92417 26.8333 1.16667 21.0758 1.16667 14C1.16667 6.92417 6.92417 1.16667 14 1.16667C21.0758 1.16667 26.8333 6.92417 26.8333 14C26.8333 21.0758 21.0758 26.8333 14 26.8333ZM19.8333 14C19.8333 14.322 19.572 14.5833 19.25 14.5833H14.5833V19.25C14.5833 19.572 14.322 19.8333 14 19.8333C13.678 19.8333 13.4167 19.572 13.4167 19.25V14.5833H8.75C8.428 14.5833 8.16667 14.322 8.16667 14C8.16667 13.678 8.428 13.4167 8.75 13.4167H13.4167V8.75C13.4167 8.428 13.678 8.16667 14 8.16667C14.322 8.16667 14.5833 8.428 14.5833 8.75V13.4167H19.25C19.572 13.4167 19.8333 13.678 19.8333 14Z"
                                                    fill="#4BBBE4"
                                            />
                                        </svg>
                                    </button>
                                </div>


                                <div class="mb-3">
                                    <label class="form-label">{{ $t('auth.add_course.highlights_label') }}*</label>

                                    <div class="input-with-icon">
                                        <svg class="input-icon" width="22" height="22" viewBox="0 0 22 22" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.10342 18.9408C6.47893 18.9411 5.88002 18.6928 5.43881 18.2509L0.406139 13.2201C-0.13538 12.6784 -0.13538 11.8003 0.406139 11.2586C0.947831 10.7171 1.82591 10.7171 2.36761 11.2586L7.10342 15.9944L19.6324 3.46547C20.1741 2.92395 21.0522 2.92395 21.5939 3.46547C22.1354 4.00716 22.1354 4.88524 21.5939 5.42693L8.76803 18.2509C8.32683 18.6928 7.72791 18.9411 7.10342 18.9408Z"
                                                  fill="#4BBBE4"/>
                                        </svg>
                                        <input
                                                v-model="highlights.en[0]"
                                                type="text"
                                                class="form-control check-input ps-5"
                                                :placeholder="$t('auth.add_course.highlight_placeholder')"
                                        />
                                    </div>
                                    <p v-if="errors['highlights.0.name_en']" class="required-field">
                                        {{ t('auth.add_course.' + errors['highlights.0.name_en'][0])}}
                                    </p>

                                    <div
                                            v-for="(highlight, index) in highlights.en.slice(1)"
                                            :key="index + 1"
                                            class="input-with-icon mt-3 position-relative"
                                    >
                                        <svg class="input-icon" width="22" height="22" viewBox="0 0 22 22" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7.10342 18.9408C6.47893 18.9411 5.88002 18.6928 5.43881 18.2509L0.406139 13.2201C-0.13538 12.6784 -0.13538 11.8003 0.406139 11.2586C0.947831 10.7171 1.82591 10.7171 2.36761 11.2586L7.10342 15.9944L19.6324 3.46547C20.1741 2.92395 21.0522 2.92395 21.5939 3.46547C22.1354 4.00716 22.1354 4.88524 21.5939 5.42693L8.76803 18.2509C8.32683 18.6928 7.72791 18.9411 7.10342 18.9408Z"
                                                  fill="#4BBBE4"/>
                                        </svg>
                                        <input
                                                v-model="highlights.en[index + 1]"
                                                type="text"
                                                class="form-control check-input ps-5"
                                                :placeholder="$t('auth.add_course.highlight_placeholder')"
                                        />
                                        <svg
                                                class="position-absolute top-50 translate-middle-y end-0 me-3 remove-icon"
                                                role="button"
                                                @click="removeHighlight('en', index)"
                                                width="14" height="14" viewBox="0 0 14 14" fill="none"
                                                xmlns="http://www.w3.org/2000/svg"
                                        >
                                            <path d="M12.9998 0.99994C12.8123 0.812469 12.558 0.707153 12.2928 0.707153C12.0277 0.707153 11.7733 0.812469 11.5858 0.99994L6.99982 5.58594L2.41382 0.99994C2.22629 0.812469 1.97198 0.707153 1.70682 0.707153C1.44165 0.707153 1.18735 0.812469 0.999818 0.99994C0.812347 1.18747 0.707031 1.44178 0.707031 1.70694C0.707031 1.9721 0.812347 2.22641 0.999818 2.41394L5.58582 6.99994L0.999818 11.5859C0.812347 11.7735 0.707031 12.0278 0.707031 12.2929C0.707031 12.5581 0.812347 12.8124 0.999818 12.9999C1.18735 13.1874 1.44165 13.2927 1.70682 13.2927C1.97198 13.2927 2.22629 13.1874 2.41382 12.9999L6.99982 8.41394L11.5858 12.9999C11.7733 13.1874 12.0277 13.2927 12.2928 13.2927C12.558 13.2927 12.8123 13.1874 12.9998 12.9999C13.1873 12.8124 13.2926 12.5581 13.2926 12.2929C13.2926 12.0278 13.1873 11.7735 12.9998 11.5859L8.41382 6.99994L12.9998 2.41394C13.1873 2.22641 13.2926 1.9721 13.2926 1.70694C13.2926 1.44178 13.1873 1.18747 12.9998 0.99994Z"
                                                  fill="#808793"/>
                                        </svg>
                                    </div>
                                    <p v-if="errors['highlights']" class="required-field">
                                        {{  t('auth.add_course.'  + errors['highlights'][0]) }}
                                    </p>
                                    <button type="button" class="add-btn mt-3" @click="addHighlight('en')">
                                        {{ $t('auth.add_course.add_new') }}
                                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <svg width="28" height="28" viewBox="0 0 28 28" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg">
                                                <path d="M14 0C6.28017 0 0 6.28017 0 14C0 21.7198 6.28017 28 14 28C21.7198 28 28 21.7198 28 14C28 6.28017 21.7198 0 14 0ZM14 26.8333C6.92417 26.8333 1.16667 21.0758 1.16667 14C1.16667 6.92417 6.92417 1.16667 14 1.16667C21.0758 1.16667 26.8333 6.92417 26.8333 14C26.8333 21.0758 21.0758 26.8333 14 26.8333ZM19.8333 14C19.8333 14.322 19.572 14.5833 19.25 14.5833H14.5833V19.25C14.5833 19.572 14.322 19.8333 14 19.8333C13.678 19.8333 13.4167 19.572 13.4167 19.25V14.5833H8.75C8.428 14.5833 8.16667 14.322 8.16667 14C8.16667 13.678 8.428 13.4167 8.75 13.4167H13.4167V8.75C13.4167 8.428 13.678 8.16667 14 8.16667C14.322 8.16667 14.5833 8.428 14.5833 8.75V13.4167H19.25C19.572 13.4167 19.8333 13.678 19.8333 14Z"
                                                      fill="#4BBBE4"/>
                                            </svg>
                                        </svg>
                                    </button>
                                </div>

                                <div class="mb-3">
                                    <label class="form-label">{{ $t('auth.add_course.description_label') }}*</label>
                                    <textarea v-model="form.description_en" class="form-control custom-textarea"
                                              rows="4"
                                              :placeholder="$t('auth.add_course.description_placeholder')"></textarea>
                                    <span v-if="errors.description_en" class="required-field">{{
                                            t('auth.add_course.' + errors.description_en)}}</span>
                                </div>

                            </div>

                            <!-- RUSSIAN -->
                            <div v-if="showRu">
                                <h5 class="mt-4 title-translation">{{ $t('auth.add_course.title_ru') }} </h5>

                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">{{ $t('auth.add_course.course_title') }}</label>
                                        <input v-model="form.title_ru" type="text" class="form-control"
                                               :placeholder="$t('auth.add_course.course_title_placeholder')">
                                        <span v-if="errors.title_ru" class="required-field">{{ t('auth.add_course.' + errors.title_ru) }}</span>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">{{ $t('auth.add_course.course_price') }}</label>
                                        <div class="input-group">
                                            <input v-model="form.price_ru" type="number" class="form-control"
                                                   :placeholder="$t('auth.add_course.course_price_placeholder')">
                                            <div class="dropdown">
                                                <button
                                                    class="btn currency-btn"
                                                    type="button"
                                                    disabled
                                                >
                                                    {{ form.currency_ru || 'AMD' }}
                                                </button>
                                                <ul class="dropdown-menu dropdown-menu-end">
                                                    <li>
                                                        <a class="dropdown-item" href="#" @click.prevent="selectCurrency('USD', 'ru')">USD</a>
                                                    </li>
                                                    <li>
                                                        <a class="dropdown-item" href="#" @click.prevent="selectCurrency('EUR', 'ru')">EUR</a>
                                                    </li>
                                                    <li>
                                                        <a class="dropdown-item" href="#" @click.prevent="selectCurrency('AMD', 'ru')">AMD</a>
                                                    </li>
                                                </ul>

                                            </div>
                                        </div>

                                        <span v-if="errors.price_ru" class="required-field">
                                          {{ t('auth.add_course.' + errors.price_ru) }}
                                        </span>
                                        <span v-if="errors.price_ru && errors.currency_ru"><br></span>
                                        <span v-if="errors.currency_ru" class="required-field">
                                          {{ t('auth.add_course.' + errors.currency_ru) }}
                                        </span>
                                    </div>
                                </div>

                                <!-- FAQ Section -->
                                <div class="mb-3">
                                    <label class="form-label d-flex align-items-center gap-2">
                                        {{ $t('auth.add_course.faq_label') }}
                                    </label>

                                    <div class="mb-3">
                                        <input v-model="faqList.ru[0].question_ru" type="text" class="form-control mb-2"
                                               :placeholder="$t('auth.add_course.question_placeholder')"/>
                                        <input v-model="faqList.ru[0].answer_ru" type="text" class="form-control"
                                               :placeholder="$t('auth.add_course.answer_placeholder')"/>

                                        <p v-if="errors['faqs.0.question_ru']" class="required-field">
                                            {{ t('auth.add_course.' + errors['faqs.0.question_ru'][0])}}
                                        </p>
                                        <p v-if="errors['faqs.0.answer_ru']" class="required-field">
                                            {{ t('auth.add_course.' + errors['faqs.0.answer_ru'][0] )}}
                                        </p>
                                    </div>

                                    <div v-for="(faq, index) in faqList.ru.slice(1)" :key="index + 1" class="mb-3">
                                        <div class="position-relative mb-2">
                                            <input v-model="faq.question_ru" type="text" class="form-control pe-5"
                                                   :placeholder="$t('auth.add_course.question_placeholder')"/>
                                            <svg class="position-absolute top-50 end-0 translate-middle-y me-3"
                                                 role="button"
                                                 @click="removeFAQ('ru', index + 1)" width="14" height="14"
                                                 viewBox="0 0 14 14" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg" style="cursor: pointer;">
                                                <path d="M12.9998 0.99994C12.8123 0.812469 12.558 0.707153 12.2928 0.707153C12.0277 0.707153 11.7733 0.812469 11.5858 0.99994L6.99982 5.58594L2.41382 0.99994C2.22629 0.812469 1.97198 0.707153 1.70682 0.707153C1.44165 0.707153 1.18735 0.812469 0.999818 0.99994C0.812347 1.18747 0.707031 1.44178 0.707031 1.70694C0.707031 1.9721 0.812347 2.22641 0.999818 2.41394L5.58582 6.99994L0.999818 11.5859C0.812347 11.7735 0.707031 12.0278 0.707031 12.2929C0.707031 12.5581 0.812347 12.8124 0.999818 12.9999C1.18735 13.1874 1.44165 13.2927 1.70682 13.2927C1.97198 13.2927 2.22629 13.1874 2.41382 12.9999L6.99982 8.41394L11.5858 12.9999C11.7733 13.1874 12.0277 13.2927 12.2928 13.2927C12.558 13.2927 12.8123 13.1874 12.9998 12.9999C13.1873 12.8124 13.2926 12.5581 13.2926 12.2929C13.2926 12.0278 13.1873 11.7735 12.9998 11.5859L8.41382 6.99994L12.9998 2.41394C13.1873 2.22641 13.2926 1.9721 13.2926 1.70694C13.2926 1.44178 13.1873 1.18747 12.9998 0.99994Z"
                                                      fill="#808793"
                                                />
                                            </svg>
                                        </div>
                                        <input v-model="faq.answer_ru" type="text" class="form-control"
                                               :placeholder="$t('auth.add_course.answer_placeholder')"/>

                                    </div>

                                    <button type="button" class="add-btn" @click="addFAQ('ru')">
                                        {{ $t('auth.add_course.add_new') }}
                                        <svg class="flex-shrink-0" width="28" height="28" viewBox="0 0 28 28"
                                             fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M14 0C6.28017 0 0 6.28017 0 14C0 21.7198 6.28017 28 14 28C21.7198 28 28 21.7198 28 14C28 6.28017 21.7198 0 14 0ZM14 26.8333C6.92417 26.8333 1.16667 21.0758 1.16667 14C1.16667 6.92417 6.92417 1.16667 14 1.16667C21.0758 1.16667 26.8333 6.92417 26.8333 14C26.8333 21.0758 21.0758 26.8333 14 26.8333ZM19.8333 14C19.8333 14.322 19.572 14.5833 19.25 14.5833H14.5833V19.25C14.5833 19.572 14.322 19.8333 14 19.8333C13.678 19.8333 13.4167 19.572 13.4167 19.25V14.5833H8.75C8.428 14.5833 8.16667 14.322 8.16667 14C8.16667 13.678 8.428 13.4167 8.75 13.4167H13.4167V8.75C13.4167 8.428 13.678 8.16667 14 8.16667C14.322 8.16667 14.5833 8.428 14.5833 8.75V13.4167H19.25C19.572 13.4167 19.8333 13.678 19.8333 14Z"
                                                fill="#4BBBE4"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                <!-- Highlights Section -->
                                <div class="mb-3">
                                    <label class="form-label d-flex align-items-center gap-2">
                                        {{ $t('auth.add_course.highlights_label') }}
                                    </label>

                                    <div class="input-with-icon">
                                        <svg class="input-icon" width="22" height="22" fill="#4BBBE4"
                                             viewBox="0 0 22 22">
                                            <path d="M7.103 18.94c-.625.001-1.224-.247-1.665-.69L.406 13.22c-.542-.542-.542-1.42 0-1.961s1.42-.542 1.962 0L7.103 15.994 19.632 3.465c.541-.542 1.42-.542 1.961 0s.542 1.42 0 1.961L8.768 18.251a2.351 2.351 0 0 1-1.665.69Z"/>
                                        </svg>
                                        <input v-model="highlights.ru[0]" type="text"
                                               class="form-control check-input ps-5"
                                               :placeholder="$t('auth.add_course.highlight_placeholder')"/>
                                    </div>
                                    <p v-if="errors['highlights.0.name_ru']" class="required-field">
                                        {{ t('auth.add_course.' + errors['highlights.0.name_ru'][0]) }}
                                    </p>

                                    <div v-for="(highlight, index) in highlights.ru.slice(1)" :key="index + 1"
                                         class="input-with-icon position-relative mb-3 mt-3">
                                        <svg class="input-icon" width="22" height="22" fill="#4BBBE4"
                                             viewBox="0 0 22 22">
                                            <path d="M7.103 18.94c-.625.001-1.224-.247-1.665-.69L.406 13.22c-.542-.542-.542-1.42 0-1.961s1.42-.542 1.962 0L7.103 15.994 19.632 3.465c.541-.542 1.42-.542 1.961 0s.542 1.42 0 1.961L8.768 18.251a2.351 2.351 0 0 1-1.665.69Z"/>
                                        </svg>
                                        <input v-model="highlights.ru[index + 1]" type="text"
                                               class="form-control check-input ps-5"
                                               :placeholder="$t('auth.add_course.highlight_placeholder')"/>
                                        <svg class="position-absolute top-50 translate-middle-y end-0 me-3 remove-icon"
                                             role="button"
                                             @click="removeHighlight('ru', index)" width="14" height="14"
                                             viewBox="0 0 14 14" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12.9998 0.99994C12.8123 0.812469 12.558 0.707153 12.2928 0.707153C12.0277 0.707153 11.7733 0.812469 11.5858 0.99994L6.99982 5.58594L2.41382 0.99994C2.22629 0.812469 1.97198 0.707153 1.70682 0.707153C1.44165 0.707153 1.18735 0.812469 0.999818 0.99994C0.812347 1.18747 0.707031 1.44178 0.707031 1.70694C0.707031 1.9721 0.812347 2.22641 0.999818 2.41394L5.58582 6.99994L0.999818 11.5859C0.812347 11.7735 0.707031 12.0278 0.707031 12.2929C0.707031 12.5581 0.812347 12.8124 0.999818 12.9999C1.18735 13.1874 1.44165 13.2927 1.70682 13.2927C1.97198 13.2927 2.22629 13.1874 2.41382 12.9999L6.99982 8.41394L11.5858 12.9999C11.7733 13.1874 12.0277 13.2927 12.2928 13.2927C12.558 13.2927 12.8123 13.1874 12.9998 12.9999C13.1873 12.8124 13.2926 12.5581 13.2926 12.2929C13.2926 12.0278 13.1873 11.7735 12.9998 11.5859L8.41382 6.99994L12.9998 2.41394C13.1873 2.22641 13.2926 1.9721 13.2926 1.70694C13.2926 1.44178 13.1873 1.18747 12.9998 0.99994Z"
                                                fill="#808793"
                                            />
                                        </svg>
                                        <span v-if="errors['highlights.' + (index + 1)]" class="required-field">
                                            {{ t('auth.add_course.' + errors['highlights.' + (index + 1)][0]) }}
                                        </span>
                                                                </div>
                                                                <span v-if="errors.highlights" class="required-field">
                                        {{ t('auth.add_course.' + errors.highlights[0]) }}
                                    </span>

                                    <button type="button" class="add-btn mt-3" @click="addHighlight('ru')">
                                        {{ $t('auth.add_course.add_new') }}
                                        <svg class="flex-shrink-0" width="28" height="28" viewBox="0 0 28 28"
                                             fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14 0C6.28017 0 0 6.28017 0 14C0 21.7198 6.28017 28 14 28C21.7198 28 28 21.7198 28 14C28 6.28017 21.7198 0 14 0ZM14 26.8333C6.92417 26.8333 1.16667 21.0758 1.16667 14C1.16667 6.92417 6.92417 1.16667 14 1.16667C21.0758 1.16667 26.8333 6.92417 26.8333 14C26.8333 21.0758 21.0758 26.8333 14 26.8333ZM19.8333 14C19.8333 14.322 19.572 14.5833 19.25 14.5833H14.5833V19.25C14.5833 19.572 14.322 19.8333 14 19.8333C13.678 19.8333 13.4167 19.572 13.4167 19.25V14.5833H8.75C8.428 14.5833 8.16667 14.322 8.16667 14C8.16667 13.678 8.428 13.4167 8.75 13.4167H13.4167V8.75C13.4167 8.428 13.678 8.16667 14 8.16667C14.322 8.16667 14.5833 8.428 14.5833 8.75V13.4167H19.25C19.572 13.4167 19.8333 13.678 19.8333 14Z"
                                                  fill="#4BBBE4"/>
                                        </svg>
                                    </button>
                                </div>

                                <!-- Description -->
                                <div class="mb-3">
                                    <label class="form-label">{{ $t('auth.add_course.description_label') }}</label>
                                    <textarea v-model="form.description_ru" class="form-control" rows="4"
                                              :placeholder="$t('auth.add_course.description_placeholder')"></textarea>
                                    <span v-if="errors.description_ru" class="required-field">{{ t('auth.add_course.' + errors.description_ru) }}</span>
                                </div>
                            </div>

                            <!-- ARMENIAN -->
                            <div v-if="showArm">
                                <h5 class="mt-4 title-translation">{{ $t('auth.add_course.title_arm') }} </h5>

                                <div class="row mb-3">
                                    <div class="col-md-6">
                                        <label class="form-label">{{ $t('auth.add_course.course_title') }}</label>
                                        <input v-model="form.title_arm" type="text" class="form-control"
                                               :placeholder="$t('auth.add_course.course_title_placeholder')">
                                        <span v-if="errors.title_arm" class="required-field">{{ t('auth.add_course.' + errors.title_arm) }}</span>
                                    </div>
                                    <div class="col-md-6">
                                        <label class="form-label">{{ $t('auth.add_course.course_price') }}</label>
                                        <div class="input-group">
                                            <input v-model="form.price_arm" type="number" class="form-control"
                                                   :placeholder="$t('auth.add_course.course_price_placeholder')">
                                            <div class="dropdown">
                                                <button
                                                    class="btn currency-btn"
                                                    type="button"
                                                    disabled
                                                >
                                                    {{ form.currency_arm || 'AMD' }}
                                                </button>
                                                <ul class="dropdown-menu dropdown-menu-end">
                                                    <li>
                                                        <a class="dropdown-item" href="#" @click.prevent="selectCurrency('USD', 'arm')">USD</a>
                                                    </li>
                                                    <li>
                                                        <a class="dropdown-item" href="#" @click.prevent="selectCurrency('EUR', 'arm')">EUR</a>
                                                    </li>
                                                    <li>
                                                        <a class="dropdown-item" href="#" @click.prevent="selectCurrency('AMD', 'arm')">AMD</a>
                                                    </li>
                                                </ul>
                                            </div>
                                        </div>
                                        <span v-if="errors.price_arm" class="required-field">
                                          {{ t('auth.add_course.' + errors.price_arm) }}
                                        </span>
                                        <span v-if="errors.price_arm && errors.currency_arm"><br></span>
                                        <span v-if="errors.currency_arm" class="required-field">
                                          {{ t('auth.add_course.' + errors.currency_arm) }}
                                        </span>
                                    </div>
                                </div>

                                <!-- FAQ Section -->
                                <div class="mb-3">
                                    <label class="form-label d-flex align-items-center gap-2">
                                        {{ $t('auth.add_course.faq_label') }}
                                    </label>

                                    <div class="mb-3">
                                        <input v-model="faqList.arm[0].question_arm" type="text" class="form-control mb-2"
                                               :placeholder="$t('auth.add_course.question_placeholder')"/>
                                        <input v-model="faqList.arm[0].answer_arm" type="text" class="form-control"
                                               :placeholder="$t('auth.add_course.answer_placeholder')"/>

                                        <p v-if="errors['faqs.0.question_arm']" class="required-field">
                                            {{ t('auth.add_course.' + errors['faqs.0.question_arm'][0]) }}
                                        </p>
                                        <p v-if="errors['faqs.0.answer_arm']" class="required-field">
                                            {{ t('auth.add_course.' + errors['faqs.0.answer_arm'][0]) }}
                                        </p>
                                    </div>

                                    <div v-for="(faq, index) in faqList.arm.slice(1)" :key="index + 1" class="mb-3">
                                        <div class="position-relative mb-2">
                                            <input v-model="faq.question_arm" type="text" class="form-control pe-5"
                                                   :placeholder="$t('auth.add_course.question_placeholder')"/>
                                            <svg class="position-absolute top-50 end-0 translate-middle-y me-3"
                                                 role="button"
                                                 @click="removeFAQ('arm', index + 1)" width="14" height="14"
                                                 viewBox="0 0 14 14" fill="none"
                                                 xmlns="http://www.w3.org/2000/svg" style="cursor: pointer;">
                                                <path d="M12.9998 0.99994C12.8123 0.812469 12.558 0.707153 12.2928 0.707153C12.0277 0.707153 11.7733 0.812469 11.5858 0.99994L6.99982 5.58594L2.41382 0.99994C2.22629 0.812469 1.97198 0.707153 1.70682 0.707153C1.44165 0.707153 1.18735 0.812469 0.999818 0.99994C0.812347 1.18747 0.707031 1.44178 0.707031 1.70694C0.707031 1.9721 0.812347 2.22641 0.999818 2.41394L5.58582 6.99994L0.999818 11.5859C0.812347 11.7735 0.707031 12.0278 0.707031 12.2929C0.707031 12.5581 0.812347 12.8124 0.999818 12.9999C1.18735 13.1874 1.44165 13.2927 1.70682 13.2927C1.97198 13.2927 2.22629 13.1874 2.41382 12.9999L6.99982 8.41394L11.5858 12.9999C11.7733 13.1874 12.0277 13.2927 12.2928 13.2927C12.558 13.2927 12.8123 13.1874 12.9998 12.9999C13.1873 12.8124 13.2926 12.5581 13.2926 12.2929C13.2926 12.0278 13.1873 11.7735 12.9998 11.5859L8.41382 6.99994L12.9998 2.41394C13.1873 2.22641 13.2926 1.9721 13.2926 1.70694C13.2926 1.44178 13.1873 1.18747 12.9998 0.99994Z"
                                                      fill="#808793"
                                                />
                                            </svg>
                                        </div>
                                        <input v-model="faq.answer_arm" type="text" class="form-control"
                                               :placeholder="$t('auth.add_course.answer_placeholder')"/>
                                    </div>

                                    <button type="button" class="add-btn" @click="addFAQ('arm')">
                                        {{ $t('auth.add_course.add_new') }}
                                        <svg class="flex-shrink-0" width="28" height="28" viewBox="0 0 28 28"
                                             fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M14 0C6.28017 0 0 6.28017 0 14C0 21.7198 6.28017 28 14 28C21.7198 28 28 21.7198 28 14C28 6.28017 21.7198 0 14 0ZM14 26.8333C6.92417 26.8333 1.16667 21.0758 1.16667 14C1.16667 6.92417 6.92417 1.16667 14 1.16667C21.0758 1.16667 26.8333 6.92417 26.8333 14C26.8333 21.0758 21.0758 26.8333 14 26.8333ZM19.8333 14C19.8333 14.322 19.572 14.5833 19.25 14.5833H14.5833V19.25C14.5833 19.572 14.322 19.8333 14 19.8333C13.678 19.8333 13.4167 19.572 13.4167 19.25V14.5833H8.75C8.428 14.5833 8.16667 14.322 8.16667 14C8.16667 13.678 8.428 13.4167 8.75 13.4167H13.4167V8.75C13.4167 8.428 13.678 8.16667 14 8.16667C14.322 8.16667 14.5833 8.428 14.5833 8.75V13.4167H19.25C19.572 13.4167 19.8333 13.678 19.8333 14Z"
                                                fill="#4BBBE4"
                                            />
                                        </svg>
                                    </button>
                                </div>

                                <!-- Highlights Section -->
                                <div class="mb-3">
                                    <label class="form-label d-flex align-items-center gap-2">
                                        {{ $t('auth.add_course.highlights_label') }}
                                    </label>

                                    <div class="input-with-icon">
                                        <svg class="input-icon" width="22" height="22" fill="#4BBBE4"
                                             viewBox="0 0 22 22">
                                            <path d="M7.103 18.94c-.625.001-1.224-.247-1.665-.69L.406 13.22c-.542-.542-.542-1.42 0-1.961s1.42-.542 1.962 0L7.103 15.994 19.632 3.465c.541-.542 1.42-.542 1.961 0s.542 1.42 0 1.961L8.768 18.251a2.351 2.351 0 0 1-1.665.69Z"/>
                                        </svg>
                                        <input v-model="highlights.arm[0]" type="text"
                                               class="form-control check-input ps-5"
                                               :placeholder="$t('auth.add_course.highlight_placeholder')"/>
                                    </div>
                                    <p v-if="errors['highlights.0.name_arm']" class="required-field">
                                        {{ t('auth.add_course.' + errors['highlights.0.name_arm'][0]) }}
                                    </p>

                                    <div v-for="(highlight, index) in highlights.arm.slice(1)" :key="index + 1"
                                         class="input-with-icon position-relative mb-3 mt-3">
                                        <svg class="input-icon" width="22" height="22" fill="#4BBBE4"
                                             viewBox="0 0 22 22">
                                            <path d="M7.103 18.94c-.625.001-1.224-.247-1.665-.69L.406 13.22c-.542-.542-.542-1.42 0-1.961s1.42-.542 1.962 0L7.103 15.994 19.632 3.465c.541-.542 1.42-.542 1.961 0s.542 1.42 0 1.961L8.768 18.251a2.351 2.351 0 0 1-1.665.69Z"/>
                                        </svg>
                                        <input v-model="highlights.arm[index + 1]" type="text"
                                               class="form-control check-input ps-5"
                                               :placeholder="$t('auth.add_course.highlight_placeholder')"/>
                                        <svg class="position-absolute top-50 translate-middle-y end-0 me-3 remove-icon"
                                             role="button"
                                             @click="removeHighlight('arm', index)" width="14" height="14"
                                             viewBox="0 0 14 14" fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12.9998 0.99994C12.8123 0.812469 12.558 0.707153 12.2928 0.707153C12.0277 0.707153 11.7733 0.812469 11.5858 0.99994L6.99982 5.58594L2.41382 0.99994C2.22629 0.812469 1.97198 0.707153 1.70682 0.707153C1.44165 0.707153 1.18735 0.812469 0.999818 0.99994C0.812347 1.18747 0.707031 1.44178 0.707031 1.70694C0.707031 1.9721 0.812347 2.22641 0.999818 2.41394L5.58582 6.99994L0.999818 11.5859C0.812347 11.7735 0.707031 12.0278 0.707031 12.2929C0.707031 12.5581 0.812347 12.8124 0.999818 12.9999C1.18735 13.1874 1.44165 13.2927 1.70682 13.2927C1.97198 13.2927 2.22629 13.1874 2.41382 12.9999L6.99982 8.41394L11.5858 12.9999C11.7733 13.1874 12.0277 13.2927 12.2928 13.2927C12.558 13.2927 12.8123 13.1874 12.9998 12.9999C13.1873 12.8124 13.2926 12.5581 13.2926 12.2929C13.2926 12.0278 13.1873 11.7735 12.9998 11.5859L8.41382 6.99994L12.9998 2.41394C13.1873 2.22641 13.2926 1.9721 13.2926 1.70694C13.2926 1.44178 13.1873 1.18747 12.9998 0.99994Z"
                                                fill="#808793"
                                            />
                                        </svg>
                                        <span v-if="errors['highlights.' + (index + 1)]" class="required-field">
                                            {{ t('auth.add_course.' + errors['highlights.' + (index + 1)][0]) }}
                                        </span>
                                    </div>
                                    <span v-if="errors.highlights" class="required-field">
                                        {{ t('auth.add_course.' + errors.highlights[0]) }}
                                    </span>

                                    <button type="button" class="add-btn mt-3" @click="addHighlight('arm')">
                                        {{ $t('auth.add_course.add_new') }}
                                        <svg class="flex-shrink-0" width="28" height="28" viewBox="0 0 28 28"
                                             fill="none"
                                             xmlns="http://www.w3.org/2000/svg">
                                            <path d="M14 0C6.28017 0 0 6.28017 0 14C0 21.7198 6.28017 28 14 28C21.7198 28 28 21.7198 28 14C28 6.28017 21.7198 0 14 0ZM14 26.8333C6.92417 26.8333 1.16667 21.0758 1.16667 14C1.16667 6.92417 6.92417 1.16667 14 1.16667C21.0758 1.16667 26.8333 6.92417 26.8333 14C26.8333 21.0758 21.0758 26.8333 14 26.8333ZM19.8333 14C19.8333 14.322 19.572 14.5833 19.25 14.5833H14.5833V19.25C14.5833 19.572 14.322 19.8333 14 19.8333C13.678 19.8333 13.4167 19.572 13.4167 19.25V14.5833H8.75C8.428 14.5833 8.16667 14.322 8.16667 14C8.16667 13.678 8.428 13.4167 8.75 13.4167H13.4167V8.75C13.4167 8.428 13.678 8.16667 14 8.16667C14.322 8.16667 14.5833 8.428 14.5833 8.75V13.4167H19.25C19.572 13.4167 19.8333 13.678 19.8333 14Z"
                                                  fill="#4BBBE4"/>
                                        </svg>
                                    </button>
                                </div>

                                <!-- Description -->
                                <div class="mb-3">
                                    <label class="form-label">{{ $t('auth.add_course.description_label') }}</label>
                                    <textarea v-model="form.description_arm" class="form-control" rows="4"
                                              :placeholder="$t('auth.add_course.description_placeholder')"></textarea>
                                    <span v-if="errors.description_arm" class="required-field">{{ t('auth.add_course.' + errors.description_arm) }}</span>
                                </div>
                            </div>

                            <div v-if="successMessage" class="success-message mb-3">
                                {{ successMessage }}
                            </div>
                            <div class="add-course-btn-div d-flex justify-content-center align-items-center">
                                <button
                                    type="button"
                                    class="add-course-btn"
                                    @click="addCourse"
                                    :disabled="isAdding"
                                >
                                    <template v-if="isAdding">
                                        <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                                    </template>
                                    <template v-else>
                                        {{ $t('auth.add_course.button_add') }}
                                    </template>
                                </button>
                            </div>

                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.add-course-section {
    padding: 8% 0;
}

.add-course-main {
    display: flex;
    flex-direction: column;
    gap: 60px;
}

.add-course-section-title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 42px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-100);
}

.upload-area {
    border: 1px solid var(--primary-100);
    text-align: center;
    border-radius: 16px;
    transition: background-color 0.3s ease;
    cursor: pointer;
    width: 356px;
    min-height: 264px;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
}

.upload-area.dragging {
    background-color: var(--primary-10);
}

.file-upload-title {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-90);
}

.browse-btn {
    gap: 10px;
    border-radius: 70px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 1px;
    color: var(--white-229);
    cursor: pointer;
    width: 204px;
    height: 50px;
    background: var(--general-btn);
    outline: none;
    border: none;
    text-transform: capitalize;
}

.browse-btn:hover {
    height: 52px;
    width: 212px;
    font-size: 18px;
}

.browse-btn-div {
    height: 52px;
    width: 212px;
}

.selected-file-name {
    word-break: break-all;
}

.course-detail-title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 30px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-100);
}

.course-detail-items-list {
    display: flex;
    flex-direction: column;
    gap: 15px;
}

/* Custom Checkbox Styles */
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

.span {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-90);
}

.add-course-block {
    gap: 60px;
}

.form-label {
    font-family: var(--font-montserrat);
    font-weight: 300;
    font-size: 20px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--primary-100);
    padding: 10px 0;
}

.form-control {
    border-width: 0.5px;
    border-style: solid;
    -webkit-appearance: none;
    border-color: var(--primary-50);
    box-sizing: border-box;
    padding: 15px;
    color: var(--primary-100);
    transform: scale(1);
    outline: none;
}

.form-control::placeholder {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-50);
}

.form-control:focus {
    outline: none;
    box-shadow: none;
    border-width: 0.5px;
    border-style: solid;
    border-color: var(--primary-50);
    -webkit-appearance: none;
    color: var(--primary-100);
    box-sizing: border-box;
    transform: scale(1);
}

.form-control:focus::placeholder {
    color: var(--primary-40);
}

.form {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.add-btn {
    border-width: 0.5px;
    border-style: solid;
    border-color: var(--secondary-1-100);
    background: transparent;
    padding: 0 30px;
    height: 50px;
    border-radius: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    white-space: nowrap;
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--secondary-1-100);
    -webkit-appearance: none;
    box-sizing: border-box;
    transform: scale(1);
    outline: none;
}

.add-btn:hover {
    font-weight: 400;
    border-width: 1px;
}

.input-with-icon {
    position: relative;
}

.input-with-icon .input-icon {
    position: absolute;
    left: 15px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    z-index: 1;
}

.check-input {
    padding-left: 2.5rem;
}

.add-course-btn {
    padding: 0 30px;
    height: 53px;
    border-radius: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    white-space: nowrap;
    border-radius: 70px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 1px;
    color: var(--white-229);
    cursor: pointer;
    background: var(--general-btn);
    outline: none;
    border: none;
    text-transform: capitalize;
}

.add-course-btn:hover {
    height: 55px;
    font-size: 18px;
    text-decoration: none;
}

.add-course-btn-div {
    height: 55px;
}

.add-course-btn-div a {
    text-decoration: none !important;
}

textarea {
    resize: none;
}

.custom-textarea {
    height: auto;
}

.remove-icon:hover path {
    fill: var(--primary-70);
}

.time-input {
    width: 52px;
    padding: 0;
    margin: 0;
    text-align: center;
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-100);
    border-bottom: 1px solid #000;
    border-top:none;
    border-left: none;
    border-right: none;
}

.time-input:focus {
    outline: none;
}

.check-ru,
.check-arm,
.title-translation {
    font-family: var(--font-montserrat);
    color: var(--primary-100);
}

.check-ru,
.check-arm {
    font-weight: 300;
}

.title-translation {
    font-weight: 400;
}

.currency-btn,
.currency-btn:hover {
    border-width: 0.5px;
    border-style: solid;
    -webkit-appearance: none;
    border-color: var(--primary-50);
    color: var(--primary-100);
    box-sizing: border-box;
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;
    font-family: var(--font-montserrat);
    font-weight: 300;
    height: 100%;
    transform: scale(1);
    outline: none;
}

/* Extra Small Devices */
@media (max-width: 575px) {
    .add-course-block {
        flex-direction: column;
    }

    .add-course-main {
        gap: 30px
    }

    .add-course-section-title {
        font-size: 22px;
    }

    .course-title-block {
        justify-content: center !important;
    }

    .upload-area {
        width: 100%;
    }

    .browse-btn-div {
        width: 190px;
        height: 50px;
    }

    .browse-btn:hover {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .browse-btn {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .course-detail-title {
        font-size: 22px;
        text-align: center;
    }

    .add-course-block {
        gap: 30px;
    }

    .form-label {
        font-size: 18px;
    }

    .form-control {
        padding: 11px;
    }

    .form-control::placeholder {
        font-size: 14px;
    }

    .form {
        gap: unset;
    }

    .add-course-btn-div {
        width: 100%;
        height: 50px;
    }

    .add-course-btn:hover {
        width: 247px;
        height: 47px;
        font-size: 18px;
    }

    .add-course-btn {
        width: 247px;
        height: 47px;
        font-size: 18px;
    }

    .add-btn:hover {
        font-weight: 300;
        border-width: 0.5px;
        -webkit-appearance: none;
        box-sizing: border-box;
        transform: scale(1);
        outline: none;
    }

    .add-btn {
        height: 47px;
        width: 179px;
        font-size: 18px;
    }

    .custom-textarea {
        height: 80px;
    }

    .input-icon {
        width: 20px;
        height: 20px;
    }

    .remove-icon:hover path {
        fill: var(--primary-50);
    }

}

/* Small Devices */
@media (min-width: 576px) and (max-width: 767px) {
    .add-course-block {
        flex-direction: column;
    }

    .add-course-main {
        gap: 30px
    }

    .add-course-section-title {
        font-size: 22px;
    }

    .course-title-block {
        justify-content: center !important;
    }

    .upload-area {
        width: 100%;
    }

    .browse-btn-div {
        width: 190px;
        height: 50px;
    }

    .browse-btn:hover {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .browse-btn {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .course-detail-title {
        font-size: 22px;
        text-align: center;
    }

    .add-course-block {
        gap: 30px;
    }

    .form-label {
        font-size: 18px;
    }

    .form-control {
        padding: 11px;
    }

    .form-control::placeholder {
        font-size: 14px;
    }

    .form {
        gap: unset;
    }

    .add-course-btn-div {
        width: 100%;
        height: 50px;
    }

    .add-course-btn:hover {
        width: 247px;
        height: 47px;
        font-size: 18px;
    }

    .add-course-btn {
        width: 247px;
        height: 47px;
        font-size: 18px;
    }

    .add-btn:hover {
        font-weight: 300;
        border-width: 0.5px;
        -webkit-appearance: none;
        box-sizing: border-box;
        transform: scale(1);
        outline: none;
    }

    .add-btn {
        height: 47px;
        width: 179px;
        font-size: 18px;
    }

    .custom-textarea {
        height: 80px;
    }

    .input-icon {
        width: 20px;
        height: 20px;
    }

    .remove-icon:hover path {
        fill: var(--primary-50);
    }

}

/* Medium Devices */
@media (min-width: 768px) and (max-width: 991px) {
    .add-course-block {
        flex-direction: column;
    }

    .add-course-main {
        gap: 30px
    }

    .add-course-section-title {
        font-size: 22px;
    }

    .course-title-block {
        justify-content: center !important;
    }

    .upload-area {
        width: 100%;
    }

    .browse-btn-div {
        width: 190px;
        height: 50px;
    }

    .browse-btn:hover {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .browse-btn {
        width: 179px;
        height: 47px;
        font-size: 18px;
    }

    .course-detail-title {
        font-size: 22px;
        text-align: center;
    }

    .add-course-block {
        gap: 30px;
    }

    .form-label {
        font-size: 18px;
    }

    .form-control {
        padding: 11px;
    }

    .form-control::placeholder {
        font-size: 14px;
    }

    .form {
        gap: unset;
    }

    .add-course-btn-div {
        width: 100%;
        height: 50px;
    }

    .add-course-btn:hover {
        width: 247px;
        height: 47px;
        font-size: 18px;
    }

    .add-course-btn {
        width: 247px;
        height: 47px;
        font-size: 18px;
    }

    .add-btn:hover {
        font-weight: 300;
        border-width: 0.5px;
    }

    .add-btn {
        height: 47px;
        width: 179px;
        font-size: 18px;
    }

    .custom-textarea {
        height: 80px;
    }

    .input-icon {
        width: 20px;
        height: 20px;
    }
}

</style>