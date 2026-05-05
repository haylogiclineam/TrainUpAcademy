const apiBaseUrl = import.meta.env.VITE_API_BASE_URL || 'https://api.trainup.academy'

export const getUserImageUrl = (image) => {
    if (!image || image === 'default.png') return '/assets/images/auth/default-avatar.png'
    if (image.startsWith('team-member-')) return `/assets/images/team/${image}`
    return `${apiBaseUrl}/storage/auth/${image}`
}
