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
        normalizeUser(user, role = null) {
            const normalizedRole = user?.role || (Array.isArray(role) ? role[0] : role)

            return user ? {
                ...user,
                role: normalizedRole || null,
            } : null
        },

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

        async login(token, user = null, role = null) {
            localStorage.setItem('token', token)

            this.token = token
            this.isAuthenticated = true
            this.isLoading = true

            try {
                if (user) {
                    this.user = this.normalizeUser(user, role)
                } else {
                    await this.fetchUserData()
                }
                this.userLoaded = true
            } finally {
                this.isLoading = false
            }
        },

        async fetchUserData() {
            try {
                const response = await api.get('/api/user/profile')
                this.user = this.normalizeUser(response.data.user, response.data.role)
            } catch (error) {
                console.error('Failed to fetch user data:', error)

                if (error.response && error.response.status === 401) {
                    this.logout()
                }
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
