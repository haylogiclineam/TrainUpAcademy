<script setup>
import { defineProps } from 'vue';
const props = defineProps({ courseId: [String, Number] });
import { ref, onMounted, computed, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../../../services/api.js';
import { useI18n } from 'vue-i18n';

const { t, locale } = useI18n();
const route = useRoute();
const router = useRouter();

const courseId = route.params.courseId;
const loading = ref(true);
const courseData = ref(null);
const questions = ref([]);
const practiceAssignments = ref([]);
const selectedAnswers = ref({});       // { questionId: [optionId, ...] }
const practiceAnswers = ref({});       // { assignmentId: 'answer text' }
const submitting = ref(false);
const showResults = ref(false);
const quizResult = ref(null);
const errorMessage = ref('');
const cooldownUntil = ref(null);
const alreadyPassed = ref(false);
const passedResultId = ref(null);
const downloading = ref(false);

// Helper to get localized field
function getLocalizedField(obj, fieldBase) {
    if (!obj) return '';
    const loc = locale.value;
    const valArm = obj[`${fieldBase}_arm`];
    const valRu = obj[`${fieldBase}_ru`];
    const valEn = obj[`${fieldBase}_en`] || '';
    if (loc === 'arm') return valArm || valEn;
    if (loc === 'ru') return valRu || valEn;
    return valEn;
}

// Countdown timer
const cooldownRemaining = ref('');
let cooldownInterval = null;

function startCooldownTimer(until, serverTime) {
    // Calculate remaining seconds based on server time
    const serverNow = new Date(serverTime);
    const end = new Date(until);
    let remainingMs = end - serverNow;

    const update = () => {
        if (remainingMs <= 0) {
            cooldownRemaining.value = '';
            cooldownUntil.value = null;
            clearInterval(cooldownInterval);
            // Reload quiz
            window.location.reload();
            return;
        }
        const hours = Math.floor(remainingMs / 3600000);
        const minutes = Math.floor((remainingMs % 3600000) / 60000);
        const seconds = Math.floor((remainingMs % 60000) / 1000);
        cooldownRemaining.value = `${hours}h ${minutes}m ${seconds}s`;
        remainingMs -= 1000;
    };
    update();
    cooldownInterval = setInterval(update, 1000);
}

onMounted(async () => {
    try {
        const res = await api.get(`/api/courses/${courseId}/quiz`);
        courseData.value = res.data;
        questions.value = res.data.questions || [];
        practiceAssignments.value = res.data.practice_assignments || [];
        alreadyPassed.value = res.data.already_passed || false;
        passedResultId.value = res.data.passed_result_id || null;

        // Initialize selectedAnswers for each question
        questions.value.forEach(q => {
            selectedAnswers.value[q.id] = [];
        });

        // Initialize practiceAnswers
        practiceAssignments.value.forEach(pa => {
            practiceAnswers.value[pa.id] = '';
        });
    } catch (err) {
        if (err.response?.status === 403) {
            errorMessage.value = t('learner_profile.quiz.not_purchased');
        } else if (err.response?.status === 429) {
            // 24h cooldown
            cooldownUntil.value = err.response.data.cooldown_until;
            startCooldownTimer(err.response.data.cooldown_until, err.response.data.server_time);
        } else {
            errorMessage.value = t('learner_profile.quiz.load_error');
        }
        console.error('Failed to load quiz:', err);
    } finally {
        loading.value = false;
    }
});

onUnmounted(() => {
    if (cooldownInterval) {
        clearInterval(cooldownInterval);
    }
});

const selectAnswer = (questionId, optionId, questionType) => {
    if (questionType === 'radio') {
        // Radio: single selection
        selectedAnswers.value[questionId] = [optionId];
    } else {
        // Checkbox: toggle selection
        const current = selectedAnswers.value[questionId] || [];
        const idx = current.indexOf(optionId);
        if (idx === -1) {
            current.push(optionId);
        } else {
            current.splice(idx, 1);
        }
        selectedAnswers.value[questionId] = [...current];
    }
};

const isOptionSelected = (questionId, optionId) => {
    return (selectedAnswers.value[questionId] || []).includes(optionId);
};

const submitQuiz = async () => {
    // Check all questions answered
    const unanswered = questions.value.filter(q => 
        !selectedAnswers.value[q.id] || selectedAnswers.value[q.id].length === 0
    );
    if (unanswered.length > 0) {
        errorMessage.value = t('learner_profile.quiz.answer_all');
        return;
    }

    // Check all practice assignments answered
    const unansweredPractice = practiceAssignments.value.filter(pa =>
        !practiceAnswers.value[pa.id] || practiceAnswers.value[pa.id].trim() === ''
    );
    if (unansweredPractice.length > 0) {
        errorMessage.value = t('learner_profile.quiz.answer_all_practice');
        return;
    }

    errorMessage.value = '';
    submitting.value = true;

    const answers = Object.entries(selectedAnswers.value).map(([questionId, optionIds]) => ({
        question_id: parseInt(questionId),
        option_ids: optionIds.map(id => parseInt(id)),
    }));

    const practice_answers = Object.entries(practiceAnswers.value).map(([assignmentId, answer]) => ({
        assignment_id: parseInt(assignmentId),
        answer: answer,
    }));

    try {
        const res = await api.post(`/api/courses/${courseId}/quiz/submit`, {
            answers,
            practice_answers,
        });
        quizResult.value = res.data;
        showResults.value = true;
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
        if (err.response?.status === 429) {
            cooldownUntil.value = err.response.data.cooldown_until;
            startCooldownTimer(err.response.data.cooldown_until, err.response.data.server_time);
        } else {
            errorMessage.value = t('learner_profile.quiz.submit_error');
        }
        console.error('Failed to submit quiz:', err);
    } finally {
        submitting.value = false;
    }
};

const retakeQuiz = () => {
    selectedAnswers.value = {};
    practiceAnswers.value = {};
    questions.value.forEach(q => { selectedAnswers.value[q.id] = []; });
    practiceAssignments.value.forEach(pa => { practiceAnswers.value[pa.id] = ''; });
    showResults.value = false;
    quizResult.value = null;
    errorMessage.value = '';
};

const downloadCertificate = async () => {
    if (!quizResult.value?.result_id) return;
    await downloadCertificateById(quizResult.value.result_id);
};

const downloadCertificateById = async (resultId) => {
    if (!resultId || downloading.value) return;
    downloading.value = true;
    try {
        const res = await api.get(`/api/certificate/${resultId}/download`, {
            responseType: 'blob',
        });
        const url = window.URL.createObjectURL(new Blob([res.data], { type: 'application/pdf' }));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `certificate_${courseId}.pdf`);
        document.body.appendChild(link);
        link.click();
        link.remove();
        window.URL.revokeObjectURL(url);
    } catch (err) {
        console.error('Failed to download certificate:', err);
    } finally {
        downloading.value = false;
    }
};

const goBack = () => {
    router.push(`/single-course/${courseId}`);
};
</script>

<template>
    <div class="quiz-page-section">
        <div class="container">
            <div class="quiz-page-main">

                <div class="d-flex justify-content-between align-items-center quiz-title-block">
                    <h3 class="text-capitalize quiz-section-title">{{ $t('learner_profile.quiz.page_title') }}</h3>
                    <button class="quiz-back-btn" @click="goBack">
                        {{ $t('learner_profile.quiz.back_to_learning') }}
                    </button>
                </div>

                <!-- Loading -->
                <div v-if="loading" class="d-flex justify-content-center my-5">
                    <div class="spinner-border text-secondary" role="status"></div>
                </div>

                <!-- 24h Cooldown -->
                <div v-else-if="cooldownUntil" class="quiz-cooldown-box">
                    <div class="quiz-cooldown-icon"><i class="fas fa-hourglass-half"></i></div>
                    <h4>{{ $t('learner_profile.quiz.cooldown_title') }}</h4>
                    <p>{{ $t('learner_profile.quiz.cooldown_message') }}</p>
                    <div class="quiz-cooldown-timer">{{ cooldownRemaining }}</div>
                </div>

                <!-- Error -->
                <div v-else-if="errorMessage && !showResults && questions.length === 0" class="quiz-error-box">
                    <p class="mb-0">{{ errorMessage }}</p>
                </div>

                <!-- Already Passed -->
                <div v-else-if="alreadyPassed && !showResults" class="quiz-passed-box">
                    <div class="quiz-passed-icon"><i class="fas fa-trophy"></i></div>
                    <h4>{{ $t('learner_profile.quiz.already_passed_title') }}</h4>
                    <p>{{ $t('learner_profile.quiz.already_passed_message') }}</p>
                    <button class="quiz-download-btn" :disabled="downloading" @click="downloadCertificateById(passedResultId)">
                        <span v-if="downloading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                        <i v-else class="fas fa-download"></i> {{ $t('learner_profile.quiz.download_certificate') }}
                    </button>
                </div>

                <!-- Results -->
                <div v-else-if="showResults && quizResult" class="quiz-results">
                    <div class="quiz-score-card" :class="{ 'passed': quizResult.passed, 'failed': !quizResult.passed }">
                        <h4 class="quiz-score-title">{{ $t('learner_profile.quiz.your_score') }}</h4>
                        <div class="quiz-score-value">{{ quizResult.total_percent }}%</div>
                        <div class="quiz-score-breakdown">
                            <span>{{ $t('learner_profile.quiz.test_score') }}: {{ quizResult.quiz_score }}/{{ quizResult.quiz_total }} ({{ quizResult.quiz_percent }}%)</span>
                            <span>{{ $t('learner_profile.quiz.practice_score') }}: {{ quizResult.practice_score }}/{{ quizResult.practice_total }} ({{ quizResult.practice_percent }}%)</span>
                        </div>
                        <div v-if="quizResult.passed" class="quiz-passed-badge">
                            <i class="fas fa-graduation-cap"></i> {{ $t('learner_profile.quiz.passed') }}
                        </div>
                        <div v-else class="quiz-failed-badge">
                            {{ $t('learner_profile.quiz.failed') }}
                        </div>
                        <button v-if="quizResult.passed" class="quiz-download-btn mt-3" :disabled="downloading" @click="downloadCertificate">
                        <span v-if="downloading" class="spinner-border spinner-border-sm me-2" role="status"></span>
                        <i v-else class="fas fa-download"></i> {{ $t('learner_profile.quiz.download_certificate') }}
                        </button>
                    </div>

                    <!-- Question results -->
                    <h5 class="mt-4 mb-3">{{ $t('learner_profile.quiz.test_results') }}</h5>
                    <div v-for="(result, index) in quizResult.question_results" :key="result.question_id" class="quiz-result-item">
                        <div class="quiz-result-header">
                            <span class="quiz-result-number">{{ index + 1 }}.</span>
                            <span class="quiz-result-question">{{ result.question_text }}</span>
                            <span class="quiz-result-type-badge">{{ result.type === 'checkbox' ? $t('learner_profile.quiz.multiple') : $t('learner_profile.quiz.single') }}</span>
                            <span v-if="result.is_correct" class="quiz-result-badge correct"><i class="fas fa-check-circle"></i></span>
                            <span v-else class="quiz-result-badge incorrect"><i class="fas fa-times-circle"></i></span>
                        </div>
                        <div class="quiz-result-options">
                            <div
                                v-for="question in questions"
                                :key="question.id"
                            >
                                <div
                                    v-if="question.id === result.question_id"
                                    v-for="option in question.options"
                                    :key="option.id"
                                    class="quiz-result-option"
                                    :class="{
                                        'selected-correct': result.selected_option_ids.includes(option.id) && result.correct_option_ids.includes(option.id),
                                        'selected-wrong': result.selected_option_ids.includes(option.id) && !result.correct_option_ids.includes(option.id),
                                        'was-correct': result.correct_option_ids.includes(option.id) && !result.selected_option_ids.includes(option.id),
                                    }"
                                >
                                    {{ option.option_text }}
                                    <span v-if="result.correct_option_ids.includes(option.id) && !result.selected_option_ids.includes(option.id)" class="correct-label">
                                        ({{ $t('learner_profile.quiz.correct_answer') }})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Practice results -->
                    <h5 class="mt-4 mb-3">{{ $t('learner_profile.quiz.practice_results') }}</h5>
                    <div v-for="(result, index) in quizResult.practice_results" :key="result.assignment_id" class="quiz-result-item">
                        <div class="quiz-result-header">
                            <span class="quiz-result-number">{{ index + 1 }}.</span>
                            <span class="quiz-result-question">{{ result.assignment_text }}</span>
                            <span v-if="result.is_correct" class="quiz-result-badge correct"><i class="fas fa-check-circle"></i></span>
                            <span v-else class="quiz-result-badge incorrect"><i class="fas fa-times-circle"></i></span>
                        </div>
                        <div class="quiz-practice-result-answer">
                            <p><strong>{{ $t('learner_profile.quiz.your_answer') }}:</strong> {{ result.student_answer }}</p>
                            <p v-if="!result.is_correct" class="correct-label">
                                {{ $t('learner_profile.quiz.answer_was_incorrect') }}
                            </p>
                        </div>
                    </div>

                    <div class="quiz-actions mt-4">
                        <button class="quiz-back-btn" @click="goBack">
                            {{ $t('learner_profile.quiz.back_to_learning') }}
                        </button>
                    </div>
                </div>

                <!-- Quiz Form -->
                <div v-else-if="questions.length > 0" class="quiz-form">
                    <div v-if="errorMessage" class="quiz-inline-error mb-3">
                        {{ errorMessage }}
                    </div>

                    <!-- Test Questions -->
                    <h5 class="quiz-form-section-title">{{ $t('learner_profile.quiz.test_questions_title') }} ({{ questions.length }})</h5>
                    <div v-for="(question, qIndex) in questions" :key="question.id" class="quiz-question-card">
                        <p class="quiz-question-text">
                            <span class="quiz-q-number">{{ qIndex + 1 }}.</span>
                            {{ question.question_text }}
                            <span class="quiz-type-badge">{{ question.type === 'checkbox' ? $t('learner_profile.quiz.multiple') : $t('learner_profile.quiz.single') }}</span>
                        </p>
                        <div class="quiz-options-list">
                            <label
                                v-for="option in question.options"
                                :key="option.id"
                                class="quiz-option-label"
                                :class="{ 'selected': isOptionSelected(question.id, option.id) }"
                            >
                                <input
                                    :type="question.type === 'radio' ? 'radio' : 'checkbox'"
                                    :name="'q_' + question.id"
                                    :value="option.id"
                                    :checked="isOptionSelected(question.id, option.id)"
                                    @change="selectAnswer(question.id, option.id, question.type)"
                                    class="quiz-option-radio"
                                />
                                {{ option.option_text }}
                            </label>
                        </div>
                    </div>

                    <!-- Practice Assignments -->
                    <h5 v-if="practiceAssignments.length > 0" class="quiz-form-section-title mt-4">{{ $t('learner_profile.quiz.practice_title') }} ({{ practiceAssignments.length }})</h5>
                    <div v-for="(pa, paIndex) in practiceAssignments" :key="pa.id" class="quiz-question-card">
                        <p class="quiz-question-text">
                            <span class="quiz-q-number">{{ paIndex + 1 }}.</span>
                            {{ pa.assignment_text }}
                        </p>
                        <textarea
                            v-model="practiceAnswers[pa.id]"
                            class="form-control quiz-practice-textarea"
                            rows="3"
                            :placeholder="$t('learner_profile.quiz.practice_placeholder')"
                        ></textarea>
                    </div>

                    <div class="quiz-submit-area mt-4">
                        <button class="quiz-submit-btn" @click="submitQuiz" :disabled="submitting">
                            <template v-if="submitting">
                                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                            </template>
                            <template v-else>
                                {{ $t('learner_profile.quiz.submit') }}
                            </template>
                        </button>
                    </div>
                </div>

                <!-- No quiz available -->
                <div v-else class="quiz-empty-box">
                    <p class="mb-0">{{ $t('learner_profile.quiz.no_quiz') }}</p>
                </div>

            </div>
        </div>
    </div>
</template>

<style scoped>
.quiz-page-section {
    padding: 8% 0;
}

.quiz-page-main {
    display: flex;
    flex-direction: column;
    gap: 30px;
}

.quiz-section-title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 32px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-100);
}

.quiz-back-btn {
    gap: 10px;
    border-radius: 70px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 1px;
    color: var(--primary-100);
    cursor: pointer;
    background: transparent;
    outline: none;
    border: 1px solid var(--primary-100);
    text-transform: capitalize;
    white-space: nowrap;
    padding: 0 35px;
    height: 53px;
    transition: all 0.2s;
}

.quiz-back-btn:hover {
    background: var(--primary-10);
}

.quiz-form-section-title {
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 22px;
    color: var(--primary-100);
    margin-bottom: 16px;
}

.quiz-question-card {
    background: var(--primary-10);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 16px;
}

.quiz-question-text {
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 18px;
    color: var(--primary-100);
    margin-bottom: 16px;
}

.quiz-q-number {
    font-weight: 600;
    color: #4BBBE4;
    margin-right: 8px;
}

.quiz-type-badge {
    font-size: 12px;
    padding: 2px 10px;
    border-radius: 20px;
    background: rgba(75, 187, 228, 0.15);
    color: #4BBBE4;
    font-weight: 500;
    margin-left: 10px;
    vertical-align: middle;
}

.quiz-options-list {
    display: flex;
    flex-direction: column;
    gap: 10px;
}

.quiz-option-label {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 16px;
    border-radius: 10px;
    border: 1px solid #e0e0e0;
    cursor: pointer;
    font-family: var(--font-montserrat);
    font-size: 16px;
    color: var(--primary-100);
    transition: all 0.2s;
    background: #fff;
}

.quiz-option-label:hover {
    border-color: #4BBBE4;
    background: rgba(75, 187, 228, 0.05);
}

.quiz-option-label.selected {
    border-color: #4BBBE4;
    background: rgba(75, 187, 228, 0.1);
}

.quiz-option-radio {
    width: 20px;
    height: 20px;
    accent-color: #4BBBE4;
    cursor: pointer;
    flex-shrink: 0;
}

.quiz-practice-textarea {
    border: 1px solid #e0e0e0;
    border-radius: 10px;
    font-family: var(--font-montserrat);
    font-size: 15px;
    padding: 12px 16px;
    resize: vertical;
}

.quiz-practice-textarea:focus {
    border-color: #4BBBE4;
    box-shadow: 0 0 0 2px rgba(75, 187, 228, 0.15);
}

.quiz-submit-btn {
    gap: 10px;
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
    white-space: nowrap;
    padding: 0 45px;
    height: 53px;
}

.quiz-submit-btn:disabled {
    opacity: 0.6;
    cursor: not-allowed;
}

.quiz-inline-error {
    color: #e74c3c;
    font-family: var(--font-montserrat);
    font-size: 15px;
    padding: 12px 16px;
    background: rgba(231, 76, 60, 0.1);
    border-radius: 10px;
}

.quiz-error-box,
.quiz-empty-box {
    width: 100%;
    padding: 30px;
    border-radius: 16px;
    background: var(--primary-10);
    display: flex;
    align-items: center;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 20px;
    color: var(--primary-90);
}

/* Cooldown styles */
.quiz-cooldown-box {
    text-align: center;
    padding: 48px 32px;
    background: var(--primary-10);
    border-radius: 16px;
}

.quiz-cooldown-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.quiz-cooldown-box h4 {
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 24px;
    color: var(--primary-100);
    margin-bottom: 8px;
}

.quiz-cooldown-box p {
    font-family: var(--font-montserrat);
    font-size: 16px;
    color: var(--primary-60);
    margin-bottom: 24px;
}

.quiz-cooldown-timer {
    font-family: var(--font-montserrat);
    font-weight: 700;
    font-size: 36px;
    color: #e74c3c;
}

/* Already Passed */
.quiz-passed-box {
    text-align: center;
    padding: 48px 32px;
    background: rgba(46, 204, 113, 0.08);
    border-radius: 16px;
}

.quiz-passed-icon {
    font-size: 48px;
    margin-bottom: 16px;
}

.quiz-passed-box h4 {
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 24px;
    color: #2ecc71;
    margin-bottom: 8px;
}

.quiz-passed-box p {
    font-family: var(--font-montserrat);
    font-size: 16px;
    color: var(--primary-60);
    margin-bottom: 24px;
}

.quiz-passed-box .quiz-download-btn {
    background: linear-gradient(135deg, #2ecc71, #27ae60);
    color: #fff;
    border: none;
    padding: 14px 36px;
    border-radius: 70px;
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;
}

.quiz-passed-box .quiz-download-btn:hover {
    background: linear-gradient(135deg, #27ae60, #219a52);
}

/* Results styles */
.quiz-score-card {
    border-radius: 16px;
    padding: 32px;
    text-align: center;
    color: #fff;
}

.quiz-score-card.passed {
    background: linear-gradient(135deg, #2ecc71, #27ae60);
}

.quiz-score-card.failed {
    background: linear-gradient(135deg, #e74c3c, #c0392b);
}

.quiz-score-title {
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 20px;
    margin-bottom: 8px;
}

.quiz-score-value {
    font-family: var(--font-montserrat);
    font-weight: 700;
    font-size: 48px;
}

.quiz-score-breakdown {
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-family: var(--font-montserrat);
    font-size: 15px;
    opacity: 0.9;
    margin-top: 12px;
}

.quiz-passed-badge,
.quiz-failed-badge {
    font-family: var(--font-montserrat);
    font-weight: 600;
    font-size: 20px;
    margin-top: 16px;
}

.quiz-download-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 32px;
    border-radius: 70px;
    border: 2px solid #fff;
    background: rgba(255, 255, 255, 0.2);
    color: #fff;
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 16px;
    cursor: pointer;
    transition: all 0.2s;
}

.quiz-download-btn:hover {
    background: rgba(255, 255, 255, 0.35);
}

.quiz-result-item {
    background: var(--primary-10);
    border-radius: 16px;
    padding: 20px 24px;
    margin-bottom: 16px;
}

.quiz-result-header {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 12px;
}

.quiz-result-number {
    font-weight: 600;
    color: #4BBBE4;
    font-size: 18px;
}

.quiz-result-question {
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 17px;
    color: var(--primary-100);
    flex: 1;
}

.quiz-result-type-badge {
    font-size: 11px;
    padding: 2px 8px;
    border-radius: 20px;
    background: rgba(75, 187, 228, 0.15);
    color: #4BBBE4;
    font-weight: 500;
}

.quiz-result-badge {
    font-size: 20px;
}

.quiz-result-option {
    padding: 8px 14px;
    border-radius: 8px;
    margin-bottom: 4px;
    font-family: var(--font-montserrat);
    font-size: 15px;
    color: var(--primary-100);
}

.quiz-result-option.selected-correct {
    background: rgba(46, 204, 113, 0.15);
    border: 1px solid #2ecc71;
}

.quiz-result-option.selected-wrong {
    background: rgba(231, 76, 60, 0.15);
    border: 1px solid #e74c3c;
}

.quiz-result-option.was-correct {
    background: rgba(46, 204, 113, 0.1);
    border: 1px solid #2ecc71;
}

.correct-label {
    font-weight: 500;
    color: #2ecc71;
    margin-left: 8px;
    font-size: 13px;
}

.quiz-practice-result-answer {
    padding: 8px 14px;
    font-family: var(--font-montserrat);
    font-size: 15px;
}

/* Responsive */
@media (max-width: 767px) {
    .quiz-section-title {
        font-size: 22px;
        font-weight: 300;
    }

    .quiz-title-block {
        flex-direction: column;
        gap: 20px;
    }

    .quiz-question-card {
        padding: 16px;
        border-radius: 10px;
        margin-bottom: 10px;
    }

    .quiz-question-text {
        font-size: 16px;
    }

    .quiz-option-label {
        font-size: 14px;
        padding: 10px 14px;
    }

    .quiz-score-value {
        font-size: 36px;
    }

    .quiz-score-card {
        padding: 24px;
    }

    .quiz-result-item {
        padding: 14px 16px;
        margin-bottom: 10px;
    }

    .quiz-cooldown-timer {
        font-size: 28px;
    }
}
</style>
