import { ref, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';

const wishlistCount = ref(0);

export function useWishlistCount() {
    const authStore = useAuthStore();

    const loadWishlistCount = async () => {
        if (!authStore.isAuthenticated) return;
        try {
            const res = await api.get('/api/wishlist/count');
            wishlistCount.value = res.data.wishlist_count;
        } catch (err) {
            console.error('Failed to load wishlist count', err);
        }
    };

    const listenWishlistCount = () => {
        if (!authStore.user) return;
        // const echo = createEcho(authStore.token);
        // echo.private(`user.${authStore.user.id}`)
        //     .notification((notification) => {
        //         if (notification.wishlist_count !== undefined) {
        //             wishlistCount.value = notification.wishlist_count;
        //         }
        //     });
    };

    watch(
        () => authStore.user,
        (user) => {
            if (user) {
                loadWishlistCount();
                listenWishlistCount();
            } else {
                wishlistCount.value = 0;
            }
        },
        { immediate: true }
    );

    return { wishlistCount, loadWishlistCount };
}
