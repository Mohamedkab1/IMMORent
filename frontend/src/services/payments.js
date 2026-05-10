import api from './api';

export const paymentService = {
    async getAll(params = {}) {
        try {
            const response = await api.get('/payments', { params });
            return response.data;
        } catch (error) {
            console.error('Erreur paymentService.getAll:', error);
            throw error;
        }
    },

    async updateStatus(id, status) {
        try {
            const response = await api.put(`/payments/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Erreur paymentService.updateStatus:', error);
            throw error;
        }
    },

    async create(data) {
        try {
            const response = await api.post('/payments', data);
            return response.data;
        } catch (error) {
            console.error('Erreur paymentService.create:', error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await api.delete(`/payments/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur paymentService.delete:', error);
            throw error;
        }
    },

    async createIntent(data) {
        try {
            const response = await api.post('/payments/create-intent', data);
            return response.data;
        } catch (error) {
            console.error('Erreur paymentService.createIntent:', error);
            throw error;
        }
    },

    async confirm(data) {
        try {
            const response = await api.post('/payments/confirm', data);
            return response.data;
        } catch (error) {
            console.error('Erreur paymentService.confirm:', error);
            throw error;
        }
    }
};
