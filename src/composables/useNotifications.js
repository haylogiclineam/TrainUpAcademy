import { ref, watch, computed } from 'vue';
import api from '../services/api';
import { createEcho } from '../resources/js/echo';
import { useAuthStore } from '../stores/auth';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export function useNotificationsStore() {
    const notifications = ref([]);
    const loading = ref(false); // ← add this
    const authStore = useAuthStore();

    const fetchNotifications = async () => {
        if (!authStore.token) return;
        loading.value = true; // ← start loading
        try {
            const res = await api.get('/api/notifications', {
                headers: { Authorization: `Bearer ${authStore.token}` },
            });
            notifications.value = res.data;
        } catch (err) {
            console.error('Error fetching notifications:', err);
        } finally {
            loading.value = false; // ← stop loading
        }
    };

    const markAsRead = async (notification) => {
        if (!authStore.token) return;
        try {
            await api.post(`/api/notifications/${notification.id}/read`, null, {
                headers: { Authorization: `Bearer ${authStore.token}` },
            });
            notification.read_at = new Date().toISOString(); // mark locally
        } catch (err) {
            console.error('Failed to mark notification as read', err);
        }
    };

    const listenNotifications = () => {
        if (!authStore.token || !authStore.user) return;
        const echo = createEcho(authStore.token);

        echo.private(`user.${authStore.user.id}`)
            .notification((notification) => {
                notifications.value.unshift(notification); // newest on top
            });
    };

    watch(
        () => authStore.user,
        (user) => {
            if (user) {
                fetchNotifications();
                listenNotifications();
            }
        },
        { immediate: true }
    );

    const unreadCount = computed(() => notifications.value.filter(n => !n.read_at).length);
    const timeAgo = (time) => dayjs(time).fromNow();

    return { notifications, fetchNotifications, markAsRead, unreadCount, timeAgo, loading, listenNotifications };
}
