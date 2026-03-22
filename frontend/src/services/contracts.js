import api from './api';

export const contractService = {
    async getAll() {
        try {
            const response = await api.get('/contracts');
            return response.data;
        } catch (error) {
            console.error('Erreur contractService.getAll:', error);
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await api.get(`/contracts/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur contractService.getById:', error);
            throw error;
        }
    },

    async create(data) {
        try {
            const response = await api.post('/contracts', data);
            return response.data;
        } catch (error) {
            console.error('Erreur contractService.create:', error);
            throw error;
        }
    },

    async updateStatus(id, status) {
        try {
            const response = await api.put(`/contracts/${id}/status`, { status });
            return response.data;
        } catch (error) {
            console.error('Erreur contractService.updateStatus:', error);
            throw error;
        }
    },

    async getMyContracts() {
        try {
            const response = await api.get('/my/contracts');
            return response.data;
        } catch (error) {
            console.error('Erreur contractService.getMyContracts:', error);
            throw error;
        }
    },

    // Alternative - utiliser la route index avec filtrage
    async getAgentContracts() {
        try {
            // Utiliser la route index qui filtre déjà pour les agents
            const response = await api.get('/contracts');
            return response.data;
        } catch (error) {
            console.error('Erreur contractService.getAgentContracts:', error);
            throw error;
        }
    }
};