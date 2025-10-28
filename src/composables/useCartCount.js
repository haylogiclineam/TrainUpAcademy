import { ref, watch } from 'vue';
import { useAuthStore } from '../stores/auth';
import api from '../services/api';

const cartCount = ref(0); // reactive global state

export function useCartCount() {
    const authStore = useAuthStore();

    const loadCartCount = async () => {
        if (!authStore.isAuthenticated) return;
        try {
            const res = await api.get('/api/cart/count');
            cartCount.value = res.data.cart_count;
        } catch (err) {
            console.error('Failed to load cart count', err);
        }
    };

    const listenCartCount = () => {
        if (!authStore.user) return;
        // same as wishlist if you add Echo later
        // const echo = createEcho(authStore.token);
        // echo.private(`user.${authStore.user.id}`)
        //     .notification((notification) => {
        //         if (notification.cart_count !== undefined) {
        //             cartCount.value = notification.cart_count;
        //         }
        //     });
    };

    watch(
        () => authStore.user,
        (user) => {
            if (user) {
                loadCartCount();
                listenCartCount();
            } else {
                cartCount.value = 0;
            }
        },
        { immediate: true }
    );

    return { cartCount, loadCartCount };
}
