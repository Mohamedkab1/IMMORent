import api from './api';

export const reviewService = {
    /**
     * Get approved reviews for a property.
     */
    async getPropertyReviews(propertyId) {
        try {
            const response = await api.get(`/properties/${propertyId}/reviews`);
            return response.data;
        } catch (error) {
            console.error('Erreur reviewService.getPropertyReviews:', error);
            throw error;
        }
    },

    /**
     * Submit a new review.
     */
    async submitReview(data) {
        try {
            const response = await api.post('/reviews', data);
            return response.data;
        } catch (error) {
            console.error('Erreur reviewService.submitReview:', error);
            throw error;
        }
    },

    /**
     * Get pending reviews (Admin).
     */
    async getPendingReviews() {
        try {
            const response = await api.get('/admin/reviews/pending');
            return response.data;
        } catch (error) {
            console.error('Erreur reviewService.getPendingReviews:', error);
            throw error;
        }
    },

    /**
     * Update review status (Admin).
     */
    async updateStatus(id, status) {
        try {
            const response = await api.put(`/reviews/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Erreur reviewService.updateStatus:', error);
            throw error;
        }
    }
};
