import { ref, onMounted } from 'vue'
import api from '../services/api.js'
import { useAuthStore } from '../stores/auth.js'

const purchasedCourseIds = ref([])
const loaded = ref(false)

export function usePurchasedCourses() {
    async function fetchPurchasedCourses() {
        if (loaded.value) return
        const auth = useAuthStore()
        if (!auth.isAuthenticated) return
        try {
            const res = await api.get('/api/purchased-courses')
            const courses = res.data.courses || []
            purchasedCourseIds.value = courses.map(c => c.id)
            loaded.value = true
        } catch (err) {
            console.error('Failed to fetch purchased courses:', err)
        }
    }

    async function refetchPurchasedCourses() {
        loaded.value = false
        await fetchPurchasedCourses()
    }

    function isPurchased(courseId) {
        return purchasedCourseIds.value.includes(courseId)
    }

    onMounted(() => {
        fetchPurchasedCourses()
    })

    return { isPurchased, purchasedCourseIds, refetchPurchasedCourses }
}
