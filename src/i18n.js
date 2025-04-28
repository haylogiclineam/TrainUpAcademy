import { createI18n } from 'vue-i18n'
import en from './locales/en'
import ru from './locales/ru'
import arm from './locales/arm'

const messages = {
    en,
    ru,
    arm
}

const savedLang = localStorage.getItem('lang') || 'en';
document.documentElement.setAttribute('lang', savedLang);

const i18n = createI18n({
    legacy: false,
    locale: savedLang,
    messages,
    missing: (locale, key) => {
        console.warn(`Translation key '${key}' is missing in locale '${locale}'`);
    },
});
export default i18n
