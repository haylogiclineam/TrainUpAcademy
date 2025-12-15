<script setup>
import { ref, onMounted } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();
const messagesLoaded = ref(false);

onMounted(() => {
    messagesLoaded.value = true;
});

function makeLinksClickable(text) {
    if (!text) return '';

    text = text.replace(/(https?:\/\/[^\s]+)|(www\.[^\s]+)/g, match => {
        let url = match;
        if (match.startsWith('www.trainup.academy')) {
            url = 'https://trainup.academy';
        } else if (!match.startsWith('http')) {
            url = `https://${match}`;
        }
        return `<a href="${url}" target="_blank" rel="noopener">${match}</a>`;
    });

    text = text.replace(
        /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/g,
        '<a href="mailto:$1">$1</a>'
    );

    return text;
}

function formatBody(text) {
    if (!text) return '';

    const lines = text.split('\n').map(line => line.trim());
    let ulOpen = false;
    const result = [];

    for (const line of lines) {
        if (line.startsWith('•')) {
            if (!ulOpen) {
                result.push('<ul>');
                ulOpen = true;
            }
            result.push(`<li>${makeLinksClickable(line.slice(1).trim())}</li>`);
        } else {
            if (ulOpen) {
                result.push('</ul>');
                ulOpen = false;
            }
            if (line) result.push(`<p>${makeLinksClickable(line)}</p>`);
        }
    }

    if (ulOpen) result.push('</ul>');

    return result.join('');
}
</script>

<template>
    <div class="container" v-if="messagesLoaded">
        <div class="terms-container">
            <h1>{{ t('privacy_policy.title') }}</h1>
            <!-- Show Last Updated, Website, Email, Jurisdiction -->
            <p class="last-updated">{{ t('privacy_policy.lastUpdated') }}</p>
            <div class="contact-item">
                <span class="icon">{{ t('privacy_policy.website_title') }}</span>
                <a :href="'https://' + t('privacy_policy.website')" target="_blank" rel="noopener">{{ t('privacy_policy.website') }}</a>
            </div>
            <div class="contact-item">
                <span class="icon">{{ t('privacy_policy.email_title') }}</span>
                <a href="mailto:support@trainup.academy">support@trainup.academy</a>
            </div>
            <div class="contact-item">
                <span class="icon">{{ t('privacy_policy.jurisdiction') }}</span>
            </div>

            <hr />

            <h2>{{ t('privacy_policy.sections.0.heading') }}</h2>
            <p v-html="formatBody(t('privacy_policy.sections.0.body'))"></p>
            <hr />

            <h2>{{ t('privacy_policy.sections.1.heading') }}</h2>
            <p v-html="formatBody(t('privacy_policy.sections.1.body'))"></p>
            <hr />

            <h2>{{ t('privacy_policy.sections.2.heading') }}</h2>
            <p v-html="formatBody(t('privacy_policy.sections.2.body'))"></p>
            <hr />

            <h2>{{ t('privacy_policy.sections.3.heading') }}</h2>
            <p v-html="formatBody(t('privacy_policy.sections.3.body'))"></p>
            <hr />

            <h2>{{ t('privacy_policy.sections.4.heading') }}</h2>
            <p v-html="formatBody(t('privacy_policy.sections.4.body'))"></p>
            <hr />

            <h2>{{ t('privacy_policy.sections.5.heading') }}</h2>
            <p v-html="formatBody(t('privacy_policy.sections.5.body'))"></p>
            <hr />

            <h2>{{ t('privacy_policy.sections.6.heading') }}</h2>
            <p v-html="formatBody(t('privacy_policy.sections.6.body'))"></p>
            <hr />

            <h2>{{ t('privacy_policy.sections.7.heading') }}</h2>
            <p v-html="formatBody(t('privacy_policy.sections.7.body'))"></p>
            <hr />

            <h2>{{ t('privacy_policy.sections.8.heading') }}</h2>
            <p v-html="formatBody(t('privacy_policy.sections.8.body'))"></p>
            <hr />

            <h2>{{ t('privacy_policy.sections.9.heading') }}</h2>
            <p v-html="formatBody(t('privacy_policy.sections.9.body'))"></p>
            <hr />

            <h2>{{ t('privacy_policy.sections.10.heading') }}</h2>
            <div class="contact-item">
                <span class="icon">📧</span>
                <a href="mailto:support@trainup.academy">support@trainup.academy</a>
            </div>
            <div class="contact-item">
                <span class="icon">🌐</span>
                <a href="https://trainup.academy" target="_blank" rel="noopener">www.trainup.academy</a>
            </div>
            <div class="contact-item">
                <span class="icon">📍</span>
                <span>{{ t('privacy_policy.sections.10.body') }}</span>
            </div>
        </div>
    </div>
    <div v-else>{{ $t('loading') }}...</div>
</template>

<style scoped>
.terms-container {
    padding: 8% 0;
    font-family: var(--font-montserrat);
    line-height: 1.6;
}

h1 {
    font-size: 36px;
    color: var(--primary-100);
}

.last-updated {
    color: var(--neutral-30);
    font-size: 0.9rem;
    margin-bottom: 10px;
}

.welcome {
    margin-bottom: 20px;
}

h2 {
    font-size: 22px;
    color: var(--primary-100);
    margin-bottom: 8px;
    margin-top: 20px;
}

p {
    font-size: 18px;
    font-weight: 300;
    margin-bottom: 15px;
}

ul {
    margin: 10px 0 15px 20px;
}

li {
    margin-bottom: 8px;
}

hr {
    border: none;
    border-top: 1px solid #ccc;
    margin: 20px 0;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 8px;
    font-size: 18px;
}

.contact-item .icon {
    font-size: 20px;
}

.link {
    color: var(--primary-100);
    text-decoration: underline;
}

/* Responsive */
@media (max-width: 576px) {
    h1 {
        font-size: 28px;
    }
    h2 {
        font-size: 18px;
    }
    p,
    .contact-item {
        font-size: 14px;
    }
}
</style>
