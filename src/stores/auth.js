import { defineStore } from 'pinia'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
    state: () => ({
        isAuthenticated: false,
        token: null,
        user: null,
        userLoaded: false,
        isLoading: false,
    }),
    getters: {
        userImage: (state) => state.user?.image || 'default.png',
        userFullName: (state) => state.user ? `${state.user.first_name} ${state.user.last_name}` : '',
        userRole: (state) => state.user?.role || null,
    },
    actions: {
        async checkAuth() {
            const token = localStorage.getItem('token')

            this.token = token
            this.isAuthenticated = !!token

            if (this.isAuthenticated && !this.userLoaded) {
                this.isLoading = true
                try {
                    await this.fetchUserData()
                    this.userLoaded = true
                } finally {
                    this.isLoading = false
                }
            }
        },

        async login(token) {
            localStorage.setItem('token', token)

            this.token = token
            this.isAuthenticated = true
            this.isLoading = true

            try {
                await this.fetchUserData()
                this.userLoaded = true
            } finally {
                this.isLoading = false
            }
        },

        async fetchUserData() {
            try {
                const response = await api.get('/api/user/profile')
                this.user = response.data.user
            } catch (error) {
                console.error('Failed to fetch user data:', error)
                this.logout()
            }
        },

        logout() {
            localStorage.removeItem('token')

            this.token = null
            this.user = null
            this.isAuthenticated = false
            this.userLoaded = false
            this.isLoading = false
        },
    }
})
