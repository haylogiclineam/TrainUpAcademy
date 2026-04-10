<script setup>
import { ref, computed, nextTick } from 'vue';
import { useI18n } from 'vue-i18n';

const { t, tm } = useI18n();

// ========================================
// FAQ list — dynamically loaded from i18n array
// ========================================
const faqList = computed(() => {
    const questions = tm('chatbot.questions') || [];
    return questions.map(item => ({
        question: item.q,
        answer: item.a
    }));
});

const isOpen = ref(false);
const messages = ref([]);
const chatBody = ref(null);
const showQuestions = ref(true);

// Toggle chat window
const toggleChat = () => {
    isOpen.value = !isOpen.value;
    if (isOpen.value && messages.value.length === 0) {
        // Initial greeting from bot
        messages.value.push({
            type: 'bot',
            text: t('chatbot.greeting')
        });
    }
};

// Close chat window
const closeChat = () => {
    isOpen.value = false;
};

const messageRefs = ref([]);

// Scroll to a specific message element by index
const scrollToMessage = (index) => {
    nextTick(() => {
        const el = messageRefs.value[index];
        if (el && chatBody.value) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
};

// Scroll chat to bottom
const scrollToBottom = () => {
    nextTick(() => {
        if (chatBody.value) {
            chatBody.value.scrollTop = chatBody.value.scrollHeight;
        }
    });
};

// Handle question click
const askQuestion = (faq) => {
    showQuestions.value = false;

    // Add user message
    messages.value.push({
        type: 'user',
        text: faq.question
    });
    scrollToBottom();

    // Simulate bot typing delay
    setTimeout(() => {
        messages.value.push({
            type: 'bot',
            text: faq.answer
        });
        showQuestions.value = true;
        // Scroll to the user question so both question and answer are visible
        scrollToMessage(messages.value.length - 2);
    }, 600);
};
</script>

<template>
    <!-- Floating bot icon button -->
    <div class="chatbot-toggle" @click="toggleChat" :class="{ 'chatbot-toggle--open': isOpen }">
        <img v-if="!isOpen" src="/assets/icons/bot.svg" alt="Chat Bot" class="chatbot-toggle__icon" />
        <svg v-else class="chatbot-toggle__close" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    </div>

    <!-- Chat window -->
    <transition name="chatbot-slide">
        <div v-if="isOpen" class="chatbot-window">
            <!-- Header -->
            <div class="chatbot-header">
                <div class="chatbot-header__info">
                    <img src="/assets/icons/bot.svg" alt="Bot" class="chatbot-header__avatar" />
                    <div>
                        <div class="chatbot-header__name">TrainUp Bot</div>
                        <div class="chatbot-header__status">
                            <span class="chatbot-header__dot"></span>
                            {{ t('chatbot.status_online') }}
                        </div>
                    </div>
                </div>
                <button class="chatbot-header__close" @click="closeChat">
                    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </button>
            </div>

            <!-- Chat body -->
            <div class="chatbot-body" ref="chatBody">
                <div
                    v-for="(msg, index) in messages"
                    :key="index"
                    :ref="el => { if (el) messageRefs[index] = el }"
                    :class="['chatbot-message', msg.type === 'user' ? 'chatbot-message--user' : 'chatbot-message--bot']"
                >
                    <div v-if="msg.type === 'bot'" class="chatbot-message__avatar-wrap">
                        <img src="/assets/icons/bot.svg" alt="Bot" class="chatbot-message__avatar" />
                    </div>
                    <div class="chatbot-message__bubble">
                        {{ msg.text }}
                    </div>
                </div>

                <!-- Quick question buttons -->
                <div v-if="showQuestions" class="chatbot-questions">
                    <button
                        v-for="(faq, index) in faqList"
                        :key="index"
                        class="chatbot-questions__btn"
                        @click="askQuestion(faq)"
                    >
                        {{ faq.question }}
                    </button>
                </div>
            </div>
        </div>
    </transition>
</template>

<style scoped>
/* ==========================================
   Floating toggle button
   ========================================== */
.chatbot-toggle {
    position: fixed;
    bottom: 28px;
    right: 28px;
    width: 60px;
    height: 60px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1a283e 0%, #2c4066 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 10000;
    box-shadow: 0 6px 24px rgba(26, 40, 62, 0.45);
    transition: transform 0.3s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.3s ease;
}

.chatbot-toggle:hover {
    transform: scale(1.1);
    box-shadow: 0 8px 30px rgba(26, 40, 62, 0.55);
}

.chatbot-toggle--open {
    background: linear-gradient(135deg, #c0392b 0%, #e74c3c 100%);
}

.chatbot-toggle__icon {
    width: 32px;
    height: 32px;
    filter: brightness(0) invert(1);
}

.chatbot-toggle__close {
    width: 26px;
    height: 26px;
    color: #fff;
}

/* ==========================================
   Chat window
   ========================================== */
.chatbot-window {
    position: fixed;
    bottom: 100px;
    right: 28px;
    width: 380px;
    max-height: 520px;
    background: #ffffff;
    border-radius: 20px;
    box-shadow: 0 12px 48px rgba(0, 0, 0, 0.18);
    z-index: 9999;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    font-family: 'Inter', sans-serif;
}

/* ==========================================
   Header
   ========================================== */
.chatbot-header {
    background: linear-gradient(135deg, #1a283e 0%, #2c4066 100%);
    padding: 16px 20px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.chatbot-header__info {
    display: flex;
    align-items: center;
    gap: 12px;
}

.chatbot-header__avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.15);
    padding: 6px;
    filter: brightness(0) invert(1);
}

.chatbot-header__name {
    font-weight: 600;
    font-size: 15px;
    color: #f5f5f5;
    letter-spacing: 0.3px;
}

.chatbot-header__status {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12px;
    color: rgba(245, 245, 245, 0.75);
    margin-top: 2px;
}

.chatbot-header__dot {
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: #2ecc71;
    display: inline-block;
    animation: chatbot-pulse 2s ease-in-out infinite;
}

@keyframes chatbot-pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.4; }
}

.chatbot-header__close {
    background: none;
    border: none;
    cursor: pointer;
    padding: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
}

.chatbot-header__close svg {
    width: 20px;
    height: 20px;
    color: rgba(245, 245, 245, 0.75);
    transition: color 0.2s;
}

.chatbot-header__close:hover svg {
    color: #fff;
}

/* ==========================================
   Chat body
   ========================================== */
.chatbot-body {
    flex: 1;
    overflow-y: auto;
    padding: 20px 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    max-height: 400px;
    background: #f8f9fb;
}

.chatbot-body::-webkit-scrollbar {
    width: 5px;
}

.chatbot-body::-webkit-scrollbar-track {
    background: transparent;
}

.chatbot-body::-webkit-scrollbar-thumb {
    background: #c5ccd6;
    border-radius: 10px;
}

/* ==========================================
   Messages
   ========================================== */
.chatbot-message {
    display: flex;
    align-items: flex-end;
    gap: 8px;
    animation: chatbot-fadeIn 0.35s ease-out;
}

@keyframes chatbot-fadeIn {
    from {
        opacity: 0;
        transform: translateY(10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.chatbot-message--bot {
    justify-content: flex-start;
}

.chatbot-message--user {
    justify-content: flex-end;
}

.chatbot-message__avatar-wrap {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #1a283e 0%, #2c4066 100%);
    display: flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
}

.chatbot-message__avatar {
    width: 18px;
    height: 18px;
    filter: brightness(0) invert(1);
}

.chatbot-message--bot .chatbot-message__bubble {
    background: #ffffff;
    color: #1a283e;
    border-radius: 16px 16px 16px 4px;
    border: 1px solid #e8ecf1;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.04);
}

.chatbot-message--user .chatbot-message__bubble {
    background: linear-gradient(135deg, #1a283e 0%, #2c4066 100%);
    color: #f5f5f5;
    border-radius: 16px 16px 4px 16px;
}

.chatbot-message__bubble {
    max-width: 75%;
    padding: 10px 14px;
    font-size: 13.5px;
    line-height: 1.55;
    word-wrap: break-word;
}

/* ==========================================
   Quick question buttons
   ========================================== */
.chatbot-questions {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-top: 4px;
    animation: chatbot-fadeIn 0.35s ease-out;
}

.chatbot-questions__btn {
    background: #ffffff;
    border: 1px solid #d5dbe3;
    border-radius: 12px;
    padding: 9px 14px;
    font-size: 13px;
    color: #1a283e;
    cursor: pointer;
    text-align: left;
    transition: all 0.2s ease;
    font-family: 'Inter', sans-serif;
    line-height: 1.4;
}

.chatbot-questions__btn:hover {
    background: linear-gradient(135deg, #1a283e 0%, #2c4066 100%);
    color: #f5f5f5;
    border-color: #1a283e;
    transform: translateX(4px);
}

/* ==========================================
   Slide transition
   ========================================== */
.chatbot-slide-enter-active {
    animation: chatbot-slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1);
}

.chatbot-slide-leave-active {
    animation: chatbot-slideDown 0.25s ease-in;
}

@keyframes chatbot-slideUp {
    from {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }
    to {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
}

@keyframes chatbot-slideDown {
    from {
        opacity: 1;
        transform: translateY(0) scale(1);
    }
    to {
        opacity: 0;
        transform: translateY(20px) scale(0.95);
    }
}

/* ==========================================
   Mobile responsive
   ========================================== */
@media (max-width: 480px) {
    .chatbot-window {
        right: 10px;
        left: 10px;
        bottom: 90px;
        width: auto;
        max-height: 70vh;
    }

    .chatbot-toggle {
        bottom: 18px;
        right: 18px;
        width: 52px;
        height: 52px;
    }

    .chatbot-toggle__icon {
        width: 28px;
        height: 28px;
    }
}
</style>
