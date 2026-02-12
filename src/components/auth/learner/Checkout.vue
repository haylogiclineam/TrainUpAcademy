<script setup>
import {ref, computed, onMounted} from 'vue'
import {useRouter, useRoute} from 'vue-router'
import { initiatePayment, redirectToPayment, payWithBalance, getUserCards, payWithSavedCard } from '../../../services/paymentService'
import api from '../../../services/api.js'
import { useI18n } from 'vue-i18n'
import { usePurchasedCourses } from '../../../composables/usePurchasedCourses.js'

const { refetchPurchasedCourses } = usePurchasedCourses()

const paymentMethods = [
    {
        name: 'Visa',
        class: 'card-visa',
        svg: `<svg width="38" height="13" viewBox="0 0 38 13" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M34.8647 1.09424H32.5597C31.8628 1.09424 31.3267 1.30623 31.0051 1.99519L26.6094 11.9056H29.7185C29.7185 11.9056 30.2546 10.5807 30.3618 10.2627C30.6834 10.2627 33.739 10.2627 34.1679 10.2627C34.2751 10.6337 34.5431 11.8526 34.5431 11.8526H37.3306L34.8647 1.09424ZM31.2195 8.03686C31.4875 7.40089 32.3988 5.01602 32.3988 5.01602C32.3988 5.06902 32.6669 4.38006 32.7741 4.00908L32.9885 4.96303C32.9885 4.96303 33.5782 7.55988 33.6854 8.08985H31.2195V8.03686Z" fill="#3362AB"/>
            <path d="M26.8203 8.35489C26.8203 10.5808 24.7832 12.0647 21.6205 12.0647C20.2803 12.0647 18.9938 11.7997 18.2969 11.4817L18.7257 9.04385L19.101 9.20285C20.0659 9.62682 20.7092 9.78581 21.8885 9.78581C22.7462 9.78581 23.6575 9.46783 23.6575 8.72587C23.6575 8.2489 23.2823 7.93092 22.1029 7.40095C20.9772 6.87098 19.4762 6.02302 19.4762 4.48611C19.4762 2.36622 21.5669 0.935303 24.5152 0.935303C25.6409 0.935303 26.6058 1.14729 27.1955 1.41228L26.7667 3.74415L26.5522 3.53216C26.0162 3.32017 25.3193 3.10818 24.3008 3.10818C23.175 3.16118 22.639 3.63815 22.639 4.06213C22.639 4.5391 23.2823 4.91008 24.3008 5.38706C26.0162 6.18201 26.8203 7.08296 26.8203 8.35489Z" fill="#3362AB"/>
            <path d="M0.664062 1.20033L0.717669 0.988342H5.32781C5.97108 0.988342 6.45354 1.20033 6.61436 1.88929L7.63287 6.65903C6.61435 4.11517 4.25568 2.04828 0.664062 1.20033Z" fill="#F9B50B"/>
            <path d="M14.1162 1.09432L9.45246 11.8527H6.28969L3.60938 2.84322C5.5392 4.06215 7.14739 5.97005 7.73706 7.29498L8.05869 8.40791L10.9534 1.04132H14.1162V1.09432Z" fill="#3362AB"/>
            <path d="M15.3528 1.04132H18.3011L16.4249 11.8527H13.4766L15.3528 1.04132Z" fill="#3362AB"/>
          </svg>`,
    },
    {
        name: 'Mastercard',
        class: 'card-master',
        svg: `<svg width="36" height="23" viewBox="0 0 36 23" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M22.5876 2.91543L13.125 2.94678L13.4176 20.0846L22.8802 20.0533L22.5876 2.91543Z" fill="#FF5F00"/>
            <path d="M13.7419 11.5512C13.6822 8.06537 15.2598 4.96826 17.7319 2.95945C15.8649 1.51059 13.5247 0.639238 10.9881 0.647606C4.97892 0.667432 0.20084 5.56357 0.304237 11.5955C0.407633 17.6274 5.35301 22.4915 11.3622 22.4716C13.8988 22.4633 16.2089 21.5766 18.026 20.1156C15.4858 18.1536 13.8017 15.0369 13.7419 11.5512Z" fill="#EB001B"/>
            <path d="M35.6914 11.4046C35.7948 17.4366 31.0168 22.3327 25.0075 22.3525C22.471 22.3609 20.1307 21.4895 18.2638 20.0407C20.766 18.0318 22.3135 14.9347 22.2537 11.449C22.194 7.96318 20.5103 4.87683 17.9697 2.88456C19.7868 1.42355 22.0969 0.53685 24.6334 0.528481C30.6427 0.508656 35.5886 5.40302 35.6914 11.4046Z" fill="#F79E1B"/>
          </svg>`,
    },
    {
        name: 'Google Pay',
        class: 'google-pay',
        svg: `<svg width="38" height="15" viewBox="0 0 38 15" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M18.0024 7.47437V11.6647H16.6484V1.31649H20.2394C20.6681 1.3077 21.0943 1.38234 21.4934 1.5361C21.8925 1.68986 22.2566 1.9197 22.5648 2.21235C22.876 2.48723 23.1238 2.82435 23.2913 3.20104C23.4588 3.57773 23.5423 3.98526 23.5361 4.39625C23.545 4.80945 23.4628 5.21964 23.2952 5.59873C23.1275 5.97782 22.8784 6.31684 22.5648 6.59255C21.9368 7.18043 21.1617 7.47409 20.2394 7.47354H18.0024V7.47437ZM18.0024 2.59051V6.20283H20.2731C20.522 6.21007 20.7697 6.16623 21.0004 6.0741C21.2311 5.98197 21.4397 5.84358 21.6128 5.66779C21.785 5.50343 21.9218 5.30684 22.0153 5.08964C22.1088 4.87245 22.1569 4.63906 22.1569 4.40327C22.1569 4.16749 22.1088 3.9341 22.0153 3.7169C21.9218 3.4997 21.785 3.30311 21.6128 3.13875C21.4418 2.95926 21.234 2.81748 21.003 2.72282C20.7721 2.62816 20.5233 2.58278 20.2731 2.58968H18.0024V2.59051Z" fill="#5F6368"/>
            <path d="M26.6577 4.35327C27.6584 4.35327 28.4484 4.61584 29.0276 5.14096C29.6067 5.66609 29.896 6.38608 29.8955 7.30093V11.6646H28.6003V10.6821H28.5415C27.9808 11.4912 27.2351 11.8958 26.3045 11.8958C25.51 11.8958 24.8453 11.6646 24.3105 11.2022C24.0538 10.99 23.8486 10.7242 23.7098 10.4243C23.571 10.1243 23.5021 9.79773 23.5082 9.46832C23.5082 8.73567 23.7902 8.15302 24.3542 7.72037C24.9182 7.28772 25.6712 7.07084 26.6131 7.06974C27.4171 7.06974 28.0792 7.21423 28.5995 7.50322V7.19937C28.601 6.9748 28.5516 6.75271 28.4549 6.54921C28.3582 6.3457 28.2165 6.16588 28.0402 6.02278C27.6822 5.70562 27.2156 5.53257 26.7334 5.53811C25.977 5.53811 25.3785 5.85132 24.9379 6.47773L23.7453 5.7404C24.4013 4.81565 25.3721 4.35327 26.6577 4.35327ZM24.9059 9.49722C24.905 9.6664 24.9453 9.83335 25.0234 9.98415C25.1015 10.135 25.2152 10.2652 25.355 10.3642C25.6544 10.5954 26.0261 10.718 26.4071 10.711C26.9784 10.71 27.5261 10.4867 27.9301 10.0901C28.3786 9.67557 28.6029 9.18924 28.6029 8.63109C28.1807 8.30082 27.592 8.13568 26.8368 8.13568C26.2868 8.13568 25.8282 8.26587 25.4609 8.52623C25.0901 8.79044 24.9059 9.11163 24.9059 9.49722Z" fill="#5F6368"/>
            <path d="M37.3312 4.58453L32.81 14.7857H31.4123L33.0901 11.2163L30.1172 4.58453H31.5889L33.7376 9.67068H33.7671L35.8569 4.58453H37.3312Z" fill="#5F6368"/>
            <path d="M12.5333 6.57109C12.5338 6.16598 12.4989 5.76156 12.429 5.3623H6.71875V7.6519H9.98934C9.92241 8.01758 9.78076 8.36617 9.57292 8.67665C9.36508 8.98714 9.09535 9.25309 8.78 9.45847V10.9447H10.7319C11.8748 9.91012 12.5333 8.38014 12.5333 6.57109Z" fill="#4285F4"/>
            <path d="M6.72255 12.3806C8.35659 12.3806 9.73244 11.8538 10.7357 10.9455L8.78381 9.45933C8.24053 9.82097 7.54083 10.0274 6.72255 10.0274C5.14318 10.0274 3.80265 8.98209 3.32329 7.57349H1.3125V9.10511C1.81647 10.0897 2.58926 10.9174 3.54459 11.4958C4.49992 12.0742 5.60019 12.3805 6.72255 12.3806Z" fill="#34A853"/>
            <path d="M3.31962 7.57348C3.0662 6.83536 3.0662 6.03604 3.31962 5.29792V3.7663H1.30882C0.884861 4.59457 0.664062 5.50872 0.664062 6.4357C0.664062 7.36269 0.884861 8.27683 1.30882 9.10511L3.31962 7.57348Z" fill="#FBBC04"/>
            <path d="M6.72255 2.84398C7.58607 2.83013 8.42045 3.15045 9.04535 3.73571L10.7736 2.03895C9.6777 1.02838 8.22591 0.473568 6.72255 0.490808C5.60019 0.490858 4.49992 0.797178 3.54459 1.37557C2.58926 1.95396 1.81647 2.78166 1.3125 3.76626L3.32329 5.29788C3.80266 3.88928 5.14318 2.84398 6.72255 2.84398Z" fill="#EA4335"/>
          </svg>`,
    },
    {
        name: 'Apple Pay',
        class: 'apple-pay',
        svg: `<svg width="38" height="16" viewBox="0 0 38 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M31.1069 15.7727C32.7969 15.7727 33.5923 15.1353 34.287 13.2029L37.3307 4.76298H35.5685L33.5274 11.2926H33.4916L31.4506 4.77182H29.6384L32.5747 12.8049L32.4175 13.2935C32.3064 13.9929 31.6713 14.4919 30.9564 14.4403C30.82 14.4403 30.5553 14.4263 30.448 14.4123V15.7388C30.6664 15.7683 30.887 15.7823 31.1069 15.7816V15.7727ZM25.2343 11.5462C24.3099 11.5462 23.7232 11.104 23.7232 10.4348C23.7232 9.74129 24.289 9.33742 25.3707 9.2733L27.2969 9.15317V9.77666C27.2544 10.804 26.3771 11.6036 25.3379 11.5616C25.3029 11.5602 25.2686 11.5572 25.2343 11.5543V11.5462ZM24.7691 12.8558C25.818 12.8838 26.799 12.3436 27.326 11.4467H27.3618V12.7732H28.966V7.27903C28.966 5.68568 27.6771 4.65906 25.6927 4.65906C23.8522 4.65906 22.491 5.69968 22.4411 7.13016H24.0028C24.1891 6.40276 24.8884 5.92299 25.6428 6.00405C26.7028 6.00405 27.2969 6.49267 27.2969 7.39179V8.00054L25.1351 8.12803C23.1224 8.24816 22.034 9.06253 22.034 10.479C22.0326 11.9154 23.1567 12.8639 24.7684 12.8639L24.7691 12.8558ZM15.4726 3.177H17.4704C18.9747 3.177 19.8342 3.96999 19.8342 5.36509C19.8342 6.7602 18.9747 7.55982 17.4637 7.55982H15.4726V3.177ZM13.7394 1.73251V12.771H15.4726V9.00799H17.8722C19.8268 9.1119 21.4958 7.62984 21.6009 5.69747C21.6069 5.58766 21.6076 5.47859 21.6032 5.36878C21.6956 3.45779 20.204 1.83495 18.271 1.74283C18.1569 1.73767 18.0436 1.73841 17.9296 1.74357L13.7394 1.73251ZM7.98674 3.79237C6.99082 3.73563 6.13877 4.35174 5.66615 4.35174C5.19353 4.35174 4.46299 3.82112 3.67504 3.83586C2.63141 3.86239 1.68021 4.43355 1.17554 5.33709C0.101345 7.16406 0.895999 9.86878 1.93441 11.3553C2.44281 12.0923 3.05259 12.8993 3.85395 12.8705C4.61283 12.8425 4.91399 12.3819 5.83089 12.3819C6.7478 12.3819 7.01989 12.8705 7.822 12.8558C8.65243 12.8418 9.17574 12.1188 9.68563 11.3818C10.0449 10.86 10.3245 10.2889 10.5161 9.68675C9.53728 9.26372 8.9029 8.31081 8.89768 7.25471C8.91259 6.32317 9.40608 5.46385 10.2082 4.97523C9.69681 4.25741 8.87607 3.81669 7.98823 3.78574L7.98674 3.79237ZM7.36503 2.81735C6.92894 3.3605 6.26176 3.67225 5.56029 3.65972C5.51557 2.98317 5.74815 2.31768 6.20511 1.81211C6.65984 1.29032 7.30093 0.963104 7.9942 0.898987C8.0434 1.5947 7.81752 2.28156 7.36354 2.81514" fill="black"/>
              </svg>`,
    },
]

const selectedPayment = ref('')

function selectPayment(name) {
    selectedPayment.value = name
}

const open = ref(false)

const countries = [
    { label: 'Armenia', value: 'armenia' },
    { label: 'United States', value: 'usa' },
    { label: 'United Kingdom', value: 'uk' },
    { label: 'Germany', value: 'germany' },
    { label: 'France', value: 'france' },
    { label: 'Italy', value: 'italy' },
    { label: 'Canada', value: 'canada' },
    { label: 'Australia', value: 'australia' },
    { label: 'Japan', value: 'japan' },
    { label: 'India', value: 'india' }
]

const selected = ref(null)

const selectedLabel = computed(() => {
    return countries.find(c => c.value === selected.value)?.label || 'Select Country'
})

const selectedMethod = ref('new_card')
const balance = ref(0)
const isLoading = ref(false)
const loadingCourse = ref(true)
const errorMessage = ref('')
const cards = ref([])
const saveCard = ref(false)
const router = useRouter()
const route = useRoute()
const { locale, t } = useI18n()

// Course data from API
const course = ref(null)
const baseUrl = import.meta.env.VITE_API_BASE_URL

const currencySymbols = { AMD: '֏', EUR: '€', USD: '$' }

function getCoursePrice(c) {
    if (!c) return 0
    const loc = locale.value
    let price = c[`price_${loc}`]
    if (!price || price === '0' || price === '') {
        price = c.price_en
    }
    return parseFloat(price) || 0
}

function getCourseCurrency(c) {
    if (!c) return '֏'
    const loc = locale.value
    let currency = c[`currency_${loc}`]
    if (!currency) currency = c.currency_en
    return currencySymbols[currency] || currency || '֏'
}

function getLocalizedField(obj, fieldBase) {
    const loc = locale.value
    if (!obj) return ''
    const valArm = obj[`${fieldBase}_arm`]
    const valRu = obj[`${fieldBase}_ru`]
    const valEn = obj[`${fieldBase}_en`] || ''
    if (loc === 'arm') return valArm || valEn
    if (loc === 'ru') return valRu || valEn
    return valEn
}

const coursePrice = computed(() => getCoursePrice(course.value))
const courseCurrency = computed(() => getCourseCurrency(course.value))
const courseTitle = computed(() => getLocalizedField(course.value, 'title'))

function toggleDropdown() {
    open.value = !open.value
}

function selectCountry(country) {
    selected.value = country.value
    open.value = false
}

async function processPayment() {
    if (isLoading.value) return

    if (selectedMethod.value === 'balance') {
        if (balance.value < coursePrice.value) return
        isLoading.value = true
        errorMessage.value = ''

        try {
            const response = await payWithBalance({
                course_id: course.value?.id,
            })

            if (response.data.success) {
                try {
                    await api.post(`/api/cart/remove/${course.value?.id}`)
                } catch (_) {}
                await refetchPurchasedCourses()
                router.push('/learner/my-learning')
            } else {
                errorMessage.value = response.data.message || t('checkout.payment_failed')
            }
        } catch (err) {
            errorMessage.value = err.response?.data?.message || t('checkout.payment_failed')
        } finally {
            isLoading.value = false
        }
        return
    }

    if (selectedMethod.value !== 'new_card' && selectedMethod.value !== 'balance') {
        // Saved card payment
        isLoading.value = true
        errorMessage.value = ''

        try {
            const response = await payWithSavedCard({
                card_id: selectedMethod.value, // It's a card ID
                amount: coursePrice.value,
                type: 'course_purchase',
                course_id: course.value?.id,
            })

            if (response.data.success) {
                // Remove from cart and refresh
                try {
                    await api.post(`/api/cart/remove/${course.value?.id}`)
                } catch (_) {}
                await refetchPurchasedCourses()
                router.push('/learner/my-learning')
            } else {
                errorMessage.value = response.data.message || t('checkout.payment_failed')
            }
        } catch (err) {
            errorMessage.value = err.response?.data?.message || t('checkout.payment_failed')
        } finally {
            isLoading.value = false
        }
        return
    }

    // New Card payment — redirect to AmeriaBank
    isLoading.value = true
    errorMessage.value = ''

    try {
        const response = await initiatePayment({
            amount: coursePrice.value,
            description: `Course purchase - ${courseTitle.value} - ${coursePrice.value} AMD`,
            type: 'course_purchase',
            currency: '051',
            course_id: course.value?.id,
            save_card: saveCard.value
        })

        if (response.data.success && response.data.redirectUrl) {
            redirectToPayment(response.data.redirectUrl)
        } else {
            errorMessage.value = response.data.message || t('checkout.payment_init_failed')
            isLoading.value = false
        }
    } catch (err) {
        errorMessage.value = err.response?.data?.message || t('checkout.payment_init_failed')
        isLoading.value = false
    }
}

onMounted(async () => {
    const courseId = route.query.courseId
    if (!courseId) {
        loadingCourse.value = false
        errorMessage.value = t('checkout.error_no_course')
        return
    }

    try {
        const courseRes = await api.get(`/api/single-course/${courseId}`)
        course.value = courseRes.data.course || courseRes.data

        const profileRes = await api.get('/api/user/profile')
        balance.value = parseFloat(profileRes.data.user?.balance) || 0

        const cardsRes = await getUserCards()
        if (cardsRes.data.success) {
            cards.value = cardsRes.data.cards
        }
    } catch (err) {
        console.error('Failed to load checkout data:', err)
        errorMessage.value = t('checkout.error_load_failed')
    } finally {
        loadingCourse.value = false
    }
})

</script>

<template>
    <div class="checkout-section">
        <div class="checkout-main">
            <div class="checkout-block">
                <div class="checkout-block-body">
                    <h3 class="checkout-title">{{ $t('checkout.title') }}</h3>
                    <div class="d-flex flex-column gap-5">
                        <div class="form-section d-flex flex-column gap-5">
                            <!-- <div class="d-flex flex-column gap-3 billing-block">
                                <p class="billing-title">Billing Address</p>

                                <div class="form-group d-flex flex-column">
                                    <p class="input-label">Country*</p>

                                    <div class="select-icon-wrapper"  role="combobox" aria-haspopup="listbox" :aria-expanded="open">
                                        <svg class="select-icon-left" width="20" height="20" viewBox="0 0 26 26" fill="none" aria-hidden="true">
                                            <path d="M13 0C10.4288 0 7.91543 0.762437 5.77759 2.19089C3.63975 3.61935 1.97351 5.64967 0.989572 8.02511C0.00563272 10.4006 -0.251811 13.0144 0.249797 15.5362C0.751405 18.0579 1.98953 20.3743 3.80762 22.1924C5.6257 24.0105 7.94208 25.2486 10.4638 25.7502C12.9856 26.2518 15.5994 25.9944 17.9749 25.0104C20.3503 24.0265 22.3806 22.3602 23.8091 20.2224C25.2376 18.0846 26 15.5712 26 13C25.9963 9.55333 24.6254 6.24889 22.1883 3.81173C19.7511 1.37456 16.4467 0.00372784 13 0ZM16.4905 7.58333H9.5095C10.429 5.76796 11.6045 4.09409 13 2.613C14.396 4.09367 15.5716 5.76762 16.4905 7.58333ZM17.3572 9.75C17.6901 10.8016 17.8639 11.897 17.8728 13C17.8639 14.103 17.6901 15.1984 17.3572 16.25H8.64067C8.30771 15.1984 8.1339 14.103 8.125 13C8.1339 11.897 8.30771 10.8016 8.64067 9.75H17.3572ZM10.1833 2.55233C8.93497 4.0796 7.90464 5.77275 7.12184 7.58333H3.63242C5.06876 5.10947 7.42263 3.30173 10.1833 2.55233ZM2.16667 13C2.16657 11.8975 2.33499 10.8016 2.66609 9.75H6.39167C6.11083 10.8107 5.96523 11.9027 5.95834 13C5.96523 14.0973 6.11083 15.1893 6.39167 16.25H2.66609C2.33499 15.1984 2.16657 14.1024 2.16667 13ZM3.63242 18.4167H7.12184C7.90464 20.2272 8.93497 21.9204 10.1833 23.4477C7.42263 22.6983 5.06876 20.8905 3.63242 18.4167ZM9.5095 18.4167H16.4905C15.571 20.232 14.3955 21.9059 13 23.387C11.604 21.9063 10.4284 20.2324 9.5095 18.4167ZM15.8221 23.4477C17.0686 21.9201 18.097 20.2269 18.8782 18.4167H22.3676C20.9325 20.8894 18.5808 22.697 15.8221 23.4477ZM23.8333 13C23.8334 14.1024 23.665 15.1984 23.3339 16.25H19.6083C19.8892 15.1893 20.0348 14.0973 20.0417 13C20.0348 11.9027 19.8892 10.8107 19.6083 9.75H23.3318C23.6636 10.8014 23.8327 11.8974 23.8333 13ZM18.8782 7.58333C18.097 5.77307 17.0686 4.07993 15.8221 2.55233C18.5808 3.303 20.9325 5.11059 22.3676 7.58333H18.8782Z" fill="#B3B7BF"/>
                                        </svg>

                                        <div class="custom-select select-with-icons" @click="toggleDropdown" tabindex="0">
                                            <div class="selected">{{ selectedLabel }}</div>
                                            <div class="options" v-if="open" role="listbox">
                                                <div
                                                    v-for="country in countries"
                                                    :key="country.value"
                                                    class="option"
                                                    role="option"
                                                    @click.stop="selectCountry(country)"
                                                >
                                                    {{ country.label }}
                                                </div>
                                            </div>
                                        </div>

                                        <svg class="select-icon-right" width="22" height="12" viewBox="0 0 22 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                            <path d="M21.0584 1.315C20.9189 1.17441 20.753 1.06282 20.5702 0.986667C20.3874 0.910514 20.1914 0.871307 19.9934 0.871307C19.7954 0.871307 19.5993 0.910514 19.4165 0.986667C19.2337 1.06282 19.0678 1.17441 18.9284 1.315L12.0584 8.185C11.9189 8.3256 11.753 8.43719 11.5702 8.51334C11.3875 8.58949 11.1914 8.6287 10.9934 8.6287C10.7954 8.6287 10.5993 8.58949 10.4165 8.51334C10.2337 8.43719 10.0678 8.3256 9.92837 8.185L3.05838 1.315C2.91893 1.17441 2.75303 1.06282 2.57024 0.986667C2.38745 0.910514 2.19139 0.871307 1.99338 0.871307C1.79536 0.871307 1.5993 0.910514 1.41651 0.986667C1.23372 1.06282 1.06782 1.17441 0.928376 1.315C0.649 1.59605 0.492188 1.97623 0.492188 2.3725C0.492188 2.76878 0.649 3.14896 0.928376 3.43L7.81337 10.315C8.65713 11.1577 9.80087 11.631 10.9934 11.631C12.1859 11.631 13.3296 11.1577 14.1734 10.315L21.0584 3.43C21.3377 3.14896 21.4946 2.76878 21.4946 2.3725C21.4946 1.97623 21.3377 1.59605 21.0584 1.315Z" fill="#808793"/>
                                        </svg>
                                    </div>
                                </div>

                            </div> -->
                            <div>
                                <h5 class="h5">{{ $t('checkout.payment_method') }}</h5>
                                <div class="payment-options d-flex flex-column gap-3">
                                    <!-- My Balance -->
                                    <div class="payment-option-card" :class="{ active: selectedMethod === 'balance', 'error-border': selectedMethod === 'balance' && balance < coursePrice }" @click="selectedMethod = 'balance'">
                                        <div class="d-flex flex-column w-100">
                                            <div class="card-header-row d-flex align-items-center gap-3">
                                                <input
                                                    class="form-check-input-custom"
                                                    type="radio"
                                                    id="payment-balance"
                                                    value="balance"
                                                    :checked="selectedMethod === 'balance'"
                                                    readonly
                                                />
                                                <label class="form-check-label-custom" for="payment-balance">{{ $t('checkout.my_balance') }}</label>
                                            </div>
                                            <div v-if="selectedMethod === 'balance'" class="balance-details ps-5 mt-2">
                                                <p class="balance-text mb-0">{{ $t('checkout.balance_label') }} <span class="balance-amount">{{ balance }} ֏</span></p>
                                                <p v-if="balance < coursePrice" class="balance-error mb-0 mt-1">{{ $t('checkout.not_enough_balance') }}</p>
                                            </div>
                                        </div>
                                    </div>

                                     <!-- My Saved Cards -->
                                     <div v-for="card in cards" :key="card.id" class="payment-option-card" :class="{ active: selectedMethod === card.id }" @click="selectedMethod = card.id">
                                         <div class="card-header-row d-flex align-items-center gap-3">
                                             <input
                                                 class="form-check-input-custom"
                                                 type="radio"
                                                 :id="'payment-saved-' + card.id"
                                                 :value="card.id"
                                                 :checked="selectedMethod === card.id"
                                                 readonly
                                             />
                                             <label class="form-check-label-custom" :for="'payment-saved-' + card.id">{{ card.card_pan }}</label>
                                         </div>
                                     </div>

                                    <!-- Cards (Original Style) -->
                                    <div class="payment-card" :class="{ active: selectedMethod === 'new_card' }" @click="selectedMethod = 'new_card'">
                                        <div class="payment-icons flex-wrap">
                                            <div class="form-check-custom d-flex align-items-center">
                                                <input
                                                        class="form-check-input-custom"
                                                        type="radio"
                                                        :id="`payment-radio-${selectedPayment}`"
                                                        :value="selectedPayment"
                                                        :checked="selectedMethod === 'new_card'"
                                                        readonly
                                                />
                                                <label class="form-check-label-custom" :for="`payment-radio-${selectedPayment}`">
                                                    {{ selectedPayment || $t('checkout.cards') }}
                                                </label>
                                            </div>

                                            <div class="d-flex align-items-center gap-3 card-block">
                                                <div
                                                        v-for="method in paymentMethods"
                                                        :key="method.name"
                                                        class="card-bg"
                                                        :class="method.class"
                                                        @click.stop="selectPayment(method.name)"
                                                        style="cursor: pointer;"
                                                        v-html="method.svg"
                                                ></div>
                                            </div>
                                        </div>
                                         <template v-if="selectedMethod === 'new_card'">
                                             <hr>
                                             <div class="payment-redirect-info">
                                                 <p class="redirect-notice">{{ $t('checkout.redirect_info') }}</p>
                                                 
                                                 <div class="mt-3">
                                                     <label class="checkbox-container">
                                                         <input type="checkbox" v-model="saveCard">
                                                         <span class="checkmark"></span>
                                                         <span class="checkbox-label">{{ $t('checkout.save_card') }}</span>
                                                     </label>
                                                 </div>
                                             </div>
                                         </template>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="order-details">
                            <h5 class="h5">{{ $t('checkout.order_details') }} <span class="course-count">{{ $t('checkout.course_count') }}</span></h5>
                            <div v-if="loadingCourse" class="d-flex justify-content-center my-3">
                                <div class="spinner-border spinner-border-sm text-secondary" role="status"></div>
                            </div>
                            <div v-else-if="course" class="course-summary">
                                <div class="course-video-div-main d-flex">
                                    <div class="course-video-div position-relative">
                                        <img
                                                :src="`${baseUrl}/storage/${course.thumbnail}`"
                                                alt="Course Thumbnail"
                                                class="course-video"
                                                style="object-fit: cover;"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <p class="course-title">{{ courseTitle }}</p>
                                    <span class="course-price">{{ $t('checkout.price_label') }} {{ coursePrice }} {{ courseCurrency }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div class="order-summary-block">
                <div class="order-summary-block-body">
                    <h3 class="order-summary-title">{{ $t('checkout.order_summary') }}</h3>
                    <div>
                        <div class="summary-pricing">
                            <div class="d-flex align-items-center justify-content-between">
                                <p class="total">{{ $t('checkout.total_label') }} <span class="course-count">{{ $t('checkout.course_count') }}:</span></p>
                                <p class="total text-break">{{ coursePrice }} {{ courseCurrency }}</p>
                            </div>
                        </div>
                        <p class="terms-text">
                            {{ $t('checkout.terms_info') }}
                            <a href="#" class="terms-of-use">{{ $t('checkout.terms_link') }}</a>
                        </p>
                        <div v-if="errorMessage" class="checkout-error-message">
                            {{ errorMessage }}
                        </div>
                        <div class="mt-5 btn-block">
                            <div class="pay-btn-div d-flex justify-content-center align-items-center">
                                <button class="pay-btn text-capitalize" @click="processPayment" :disabled="isLoading || loadingCourse || (selectedMethod === 'balance' && balance < coursePrice)">
                                    <span v-if="isLoading" class="checkout-btn-spinner"></span>
                                    <span v-else>{{ $t('checkout.pay_button') }} {{ coursePrice }} {{ courseCurrency }}</span>
                                </button>
                            </div>
                            <div class="cancel-btn-div d-flex justify-content-center align-items-center">
                                <button class="cancel-btn text-capitalize" @click="router.push('/learner/my-learning')" :disabled="isLoading">
                                    {{ $t('checkout.cancel_button') }}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.checkout-section {
    width: 100%;
    box-sizing: border-box;
}

.checkout-main {
    display: flex;
    flex-wrap: wrap;
}

.checkout-block,
.order-summary-block {
    display: flex;
    justify-content: center;
    padding: 8% 0;
    width: 50%;
}

.checkout-block-body,
.order-summary-block-body {
    display: flex;
    flex-direction: column;
    gap: 60px;
    width: 70%;
}


.order-summary-block {
    background: var(--primary-10);
}

.order-summary-title,
.checkout-title,
.billing-title,
.input-label,
.original-price,
.total,
.discount {
    font-family: var(--font-montserrat);
    line-height: normal;
    letter-spacing: 2%;
}

.order-summary-title,
.checkout-title {
    font-weight: 300;
    font-size: 32px;
    color: var(--primary-100);
}

.billing-title,
.original-price,
.total,
.discount {
    font-weight: 400;
    font-size: 24px;
    color: var(--primary-90);
    gap: 15px !important;
}


.input-label {
    font-weight: 300;
    font-size: 20px;
    margin-bottom: 15px;
}

.select-icon-wrapper {
    position: relative;
    width: 80%;
}

.select-with-icons {
    width: 100%;
    padding: 15px 36px 15px 40px;
    border-width: 0.5px;
    border-color: var(--primary-50);
    border-style: solid;
    border-radius: 8px;
    appearance: none;
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-50);
    -webkit-appearance: none;
    box-sizing: border-box;
    transform: scale(1);
    outline: none;
}

.select-icon-left {
    position: absolute;
    top: 50%;
    left: 12px;
    transform: translateY(-50%);
    pointer-events: none;
    fill: var(--primary-30);
}

.select-icon-right {
    position: absolute;
    top: 50%;
    right: 12px;
    transform: translateY(-50%);
    pointer-events: none;
    fill: var(--primary-50);
}


select:focus {
    outline: none;
}

.h5 {
    font-family: var(--font-montserrat);
    font-weight: 500;
    font-size: 24px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-90);
    margin-bottom: 15px;
}

.payment-input-group {
    padding: 0 16px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px
}

.payment-card {
    border-radius: 16px;
    margin-top: 8px;
    border-width: 0.5px;
    border-color: var(--primary-50);
    border-style: solid;
    -webkit-appearance: none;
    box-sizing: border-box;
    transform: scale(1);
    outline: none;
}

.payment-icons {
    display: flex;
    align-items: center;
    gap: 20px;
    margin-bottom: 16px;
    padding: 16px 16px 0;
}

.payment-card .input-card-details {
    width: 100%;
    margin-bottom: 10px;
    border-width: 0.5px;
    border-color: var(--primary-50);
    border-style: solid;
    border-radius: 8px;
    padding: 15px 15px;
    color: var(--primary-50);
    font-family: var(--font-inter);
    font-weight: 300;
    -webkit-appearance: none;
    box-sizing: border-box;
    transform: scale(1);
    outline: none;
}

.input-card-details::placeholder {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-50);

}

.input-card-details:focus {
    border-width: 0.5px;
    border-color: var(--primary-80);
    border-style: solid;
    color: var(--primary-60);
    -webkit-appearance: none;
    box-sizing: border-box;
    transform: scale(1);
    outline: none;
}

.input-card-details:focus::placeholder {
    color: var(--primary-30);
}

.flex-row {
    display: flex;
    gap: 10px;
}

.course-summary {
    display: flex;
    align-items: start;
    margin-top: 10px;
    gap: 10px;
}

.terms-text {
    margin-top: 20px;
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
    line-height: normal;
    letter-spacing: 2%;
    color: var(--primary-90);
    width: 80%;
}

.terms-text .terms-of-use {
    color: rgba(75, 187, 228, 1);
    text-decoration: none;
    text-transform: capitalize;
}

.pay-btn {
    background: var(--general-btn);
    padding: 12px;
    border: none;
    width: 80%;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
    color: var(--white-245);
    border-radius: 30%;
}

.cancel-btn {
    background: #f0f0f0;
    padding: 12px;
    border-radius: 8px;
    border: none;
    margin-top: 10px;
    width: 100%;
    color: #666;
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
    border: 1px solid var(--secondary-1-100);
}

.checkbox-custom:checked {
    background-color: transparent;
}

.checkbox-custom:checked::before {
    content: "\2713";
    font-size: 20px;
    position: absolute;
    display: block;
    color: var(--secondary-1-100);
}

.form-check-label-custom {
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 18px;
    color: var(--primary-90);
}

.form-check-label,
.course-title,
.course-price,
.form-check-label-custom {
    line-height: normal;
    letter-spacing: 2%;
}

.course-title,
.course-price {
    font-family: var(--font-montserrat);
}

.form-check-label,
.course-price {
    color: var(--secondary-1-100);
}

.form-check-label {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 16px;
}

.course-title {
    font-weight: 500;
    font-size: 14px;
    color: var(--primary-100);
    margin-bottom: 5px;
}

.course-price {
    font-weight: 500;
    font-size: 16px;
}

.checkbox-container {
    display: flex;
    align-items: center;
    position: relative;
    padding-left: 35px;
    cursor: pointer;
    user-select: none;
}

.checkbox-container input {
    position: absolute;
    opacity: 0;
    cursor: pointer;
    height: 0;
    width: 0;
}

.checkmark {
    position: absolute;
    top: 50%;
    left: 0;
    transform: translateY(-50%);
    height: 24px;
    width: 24px;
    background-color: transparent;
    border: 1px solid var(--secondary-1-100);
    border-radius: 4px;
}

.checkbox-container:hover input ~ .checkmark {
    background-color: rgba(75, 187, 228, 0.1);
}

.checkbox-container input:checked ~ .checkmark {
    background-color: var(--secondary-1-100);
}

.checkmark:after {
    content: "";
    position: absolute;
    display: none;
}

.checkbox-container input:checked ~ .checkmark:after {
    display: block;
}

.checkbox-container .checkmark:after {
    left: 9px;
    top: 5px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
}

.checkbox-label {
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 16px;
    color: var(--primary-90);
}

.course-count {
    font-weight: 300;
}

.form-check-input-custom {
    min-width: 24px;
    height: 24px;
    background-color: var(--white-245);
    margin-right: 17px;
    border-radius: 50% !important;
    position: relative;
    appearance: none;
    display: flex;
    justify-content: center;
    align-items: center;
}

.form-check-input-custom:checked {
    background-color: transparent !important;
    border: 3px solid var(--secondary-1-100) !important;
}

.form-check-input-custom:checked::after {
    content: "";
    position: absolute;
    width: 12px;
    height: 12px;
    background-color: var(--secondary-1-100);
    border-radius: 50%;
}

.card-bg {
    width: 44px;
    height: 29px;
    border-radius: 6px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
}

.card-bg svg {
    object-fit: cover;
    width: 80%;
    height: 100%;
}

.card-visa {
    background-color: var(--card-visa-bg);
}

.card-master {
    background-color: var(--card-master-bg);
}

.google-pay {
    background-color: var(--google-pay-bg);
}

.apple-pay {
    background-color: var(--apple-pay-bg);
}


.course-video-div {
    width: 100%;
    height: 90px;
    border-radius: 8px;
    overflow: hidden;
    position: relative;
}

.course-video-div-main {
    min-height: 90px;
    border-radius: 16px;
    flex: 1 1 calc(50% - 10px);
    max-width: calc(50% - 10px);
    width: 100%;
}


.course-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
}

.pay-btn-div,
.cancel-btn {
    width: 100%;
    height: 53px;
    margin-top: 4%;
}

.pay-btn,
.cancel-btn {
    width: 273px;
    height: 50px;
    border-radius: 25px;
    font-family: var(--font-montserrat);
    font-weight: 400;
    font-size: 18px;
    line-height: normal;
    letter-spacing: 0%;
}

.pay-btn {
    background: var(--general-btn);
    border: none;
    outline: none;
    color: var(--white-245);
}

.cancel-btn {
    color: var(--primary-50);
    border-width: 0.5px;
    border-color: var(--primary-50);
    border-style: solid;
    background-color: transparent;
    -webkit-appearance: none;
    box-sizing: border-box;
    transform: scale(1);
    outline: none;
}

.custom-select {
    position: relative;
    user-select: none;
    cursor: pointer;
    z-index: 1;
}

.options {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background:var(--primary-10);
    z-index: 10;
    max-height: 250px;
    overflow-y: auto;
    border-radius: 6px;
}

.option {
    padding: 10px;
    transition: background-color 0.2s;
}

.option:hover {
    background-color: var(--secondary-1-100);
    color: white;
}

@media (max-width: 991px) {
    .checkout-main {
        flex-direction: column;
    }

    .checkout-block,
    .order-summary-block {
        width: 100%;
    }

    .checkout-block-body,
    .order-summary-block-body {
        width: 90%;
    }

    .payment-icons {
        flex-wrap: wrap;
    }

    .order-summary-title,
    .checkout-title {
        font-size: 22px;
        text-align: center;
    }

    .billing-title,
    .original-price,
    .total,
    .discount {
        font-size: 20px;
    }

    .billing-block {
        gap: unset !important;
    }

    .input-label {
        font-size: 16px;
    }

    .select-icon-wrapper {
        width: 100%;
    }

    .select-icon-right {
        width: 16px;
        height: 8px;
    }

    .select-with-icons {
        font-size: 14px;
    }

    .h5 {
        font-size: 20px;
    }

    .card-block {
        gap: 10px !important;
    }

    .payment-icons {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 16px;
        padding: 16px 10px 0;
    }

    .form-check-input-custom {
        margin-right: 10px;
    }

    .input-card-details::placeholder,
    .form-check-label,
    .terms-text {
        font-size: 14px;
    }

    .payment-card .input-card-details {
        padding: 13px 13px;
    }

    .course-video-div-main {
        flex: 1 1 calc(83% - 10px);
        max-width: calc(83% - 10px);
        width: 100%;
    }

    .terms-text {
        margin-top: 5px;
    }
}

@media (min-width: 576px) and (max-width: 767px) {
    .course-video-div {
        width: 100%;
        height: 120px;
    }

    .course-video-div-main {
        min-height: 120px;
        flex: 1 1 50%;
        max-width: 50%;
    }
}

@media (min-width: 768px) and (max-width: 991px) {
    .course-video-div {
        width: 100%;
        height: 120px;
    }

    .course-video-div-main {
        min-height: 120px;
        flex: 1 1 30%;
        max-width: 30%;
    }
}

@media (min-width: 1000px) {
    .pay-btn:hover,
    .cancel-btn:hover {
        width: 283px;
        height: 53px;
        font-size: 20px;
    }
}

@media (min-width: 1200px) {
    .checkout-block-body,
    .order-summary-block-body{
        width: 79%

    }


}

@media (min-width: 1300px) {
    .checkout-block-body,
    .order-summary-block-body{
        width: 70%

    }
}


@media (min-width: 1400px) {
    .checkout-block-body,
    .order-summary-block-body{
        width: 64%

    }

}

@media (min-width: 1500px) {
    .checkout-block-body,
    .order-summary-block-body{
        width: 50%
    }

}

@media (min-width: 1600px) {
    .checkout-block-body,
    .order-summary-block-body{
        width: 75%
    }
    .course-video-div {
        width: 100%;
        height: 120px;
    }

    .course-video-div-main {
        min-height: 120px;
        flex: 1 1 30%;
        max-width: 30%;
    }
}

.payment-option-card {
    border: 1px solid var(--primary-30);
    border-radius: 16px;
    padding: 20px;
    cursor: pointer;
    transition: all 0.2s ease;
    background: transparent;
}

.payment-option-card.active {
    border: 1.5px solid var(--primary-50);
}

.payment-option-card.error-border {
    border-color: #EB001B !important;
}

.custom-radio {
    width: 31px;
    height: 31px;
    border-radius: 50%;
    border: 1px solid var(--primary-30);
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    flex-shrink: 0;
}

.payment-option-card.active .custom-radio {
    border-color: var(--secondary-1-100);
}

.radio-inner {
    width: 20px;
    height: 20px;
    background-color: var(--secondary-1-100);
    border-radius: 50%;
}

.option-title {
    font-family: var(--font-inter);
    font-weight: 500;
    font-size: 18px;
    color: var(--primary-90);
}

.option-subtitle {
    font-family: var(--font-inter);
    font-weight: 500;
    font-size: 18px;
    color: var(--primary-90);
    letter-spacing: 0.02em;
}

.balance-text {
    font-family: var(--font-inter); 
    font-weight: 500;
    font-size: 18px;
    color: var(--secondary-1-100);
}

.balance-error {
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 14px;
    color: #EB001B;
}

.brand-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    display: inline-block;
}

.payment-logos {
    display: flex;
    gap: 10px;
    align-items: center;
}

.mini-card-logo {
    width: 44px;
    height: 29px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: transparent;
}

.mini-card-logo svg {
    width: 100%;
    height: 100%;
}

.new-card-form .card-bg.ring-active {
    border: 2px solid var(--secondary-1-100);
}

.new-card-form .payment-input-group {
    padding: 0;
}

.payment-redirect-info {
    padding: 10px;
}

.redirect-notice {
    font-family: var(--font-inter);
    font-weight: 300;
    font-size: 15px;
    line-height: 1.5;
    color: var(--primary-60);
    margin: 0;
}

.checkout-error-message {
    background: #fdf2f2;
    border: 1px solid #e74c3c;
    border-radius: 8px;
    padding: 12px 16px;
    font-family: var(--font-inter);
    font-weight: 400;
    font-size: 14px;
    color: #c0392b;
    margin-bottom: 10px;
}

.checkout-btn-spinner {
    display: inline-block;
    width: 20px;
    height: 20px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-top-color: #fff;
    border-radius: 50%;
    animation: checkout-spin 0.6s linear infinite;
}

@keyframes checkout-spin {
    to { transform: rotate(360deg); }
}

</style>
