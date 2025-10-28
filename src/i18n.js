// import { createI18n } from 'vue-i18n'
// import arm from './locales/arm.json'
// import en from './locales/en.json'
// import ru from './locales/ru.json'
//
// const messages = {
//     en,
//     ru,
//     arm
// }
//
// const savedLang = localStorage.getItem('lang') || 'arm';
// document.documentElement.setAttribute('lang', savedLang);
//
// const i18n = createI18n({
//     legacy: false,
//     locale: savedLang,
//     messages,
//     missing: (locale, key) => {
//         console.warn(`Translation key '${key}' is missing in locale '${locale}'`);
//     },
// });
// export default i18n
// i18n.js
import { createI18n } from 'vue-i18n'
import arm from './locales/arm.json'
import en from './locales/en.json'
import ru from './locales/ru.json'

// Inline the JSON into JS to avoid runtime loading issues
const messages = {
    en: { ...en },
    ru: { ...ru },
    arm: { ...arm }
}

// Get saved language from localStorage, fallback to 'arm'
const savedLang = localStorage.getItem('lang') || 'arm'

// Set HTML lang attribute for accessibility / SEO
document.documentElement.setAttribute('lang', savedLang)

// Create Vue I18n instance
const i18n = createI18n({
    legacy: false,
    locale: savedLang,
    messages,
    missing: (locale, key) => {
        console.warn(`Translation key '${key}' is missing in locale '${locale}'`)
    }
})

export default i18n
