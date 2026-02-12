import api from './api'

/**
 * AmeriaBank vPOS 3.1 Payment Service
 * Frontend API wrapper for payment operations
 */

/**
 * Initiate a payment — returns paymentId and redirectUrl
 * @param {Object} data - { amount, description, type: 'add_funds'|'course_purchase', currency? }
 */
export const initiatePayment = (data) => {
    return api.post('/api/payments/initiate', data)
}

/**
 * Pay for a course using account balance
 * @param {Object} data - { course_id }
 */
export const payWithBalance = (data) => {
    return api.post('/api/payments/balance', data)
}

/**
 * Get payment details
 * @param {string} paymentId
 */
export const getPaymentDetails = (paymentId) => {
    return api.get(`/api/payments/details/${paymentId}`)
}

/**
 * Confirm a two-stage payment
 * @param {Object} data - { paymentId, amount }
 */
export const confirmPayment = (data) => {
    return api.post('/api/payments/confirm', data)
}

/**
 * Cancel a payment (within 72 hours)
 * @param {Object} data - { paymentId }
 */
export const cancelPayment = (data) => {
    return api.post('/api/payments/cancel', data)
}

/**
 * Refund a payment (partial or full)
 * @param {Object} data - { paymentId, amount }
 */
export const refundPayment = (data) => {
    return api.post('/api/payments/refund', data)
}

/**
 * Get payment history for current user
 * @param {number} page
 */
export const getPaymentHistory = (page = 1) => {
    return api.get(`/api/payments/history?page=${page}`)
}

/**
 * Get saved cards for current user
 */
export const getUserCards = () => {
    return api.get('/api/payments/cards')
}

/**
 * Delete a saved card
 * @param {number} cardId
 */
export const deleteCard = (cardId) => {
    return api.delete(`/api/payments/cards/${cardId}`)
}

/**
 * Pay using a saved card (no redirect needed if successful)
 * @param {Object} data - { card_id, amount, type, course_id? }
 */
export const payWithSavedCard = (data) => {
    return api.post('/api/payments/pay-saved', data)
}

/**
 * Redirect user to AmeriaBank payment page
 * Helper function used after initiatePayment
 * @param {string} redirectUrl - URL from initiatePayment response
 */
export const redirectToPayment = (redirectUrl) => {
    window.location.href = redirectUrl
}
