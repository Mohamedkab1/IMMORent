import api from './api';

export const userService = {
    async getAll(params = {}, options = {}) {
        try {
            const response = await api.get('/users', { params, ...options });
            return response.data;
        } catch (error) {
            if (error.name !== 'CanceledError' && error.name !== 'AbortError') {
                console.error('Erreur userService.getAll:', error);
            }
            throw error;
        }
    },

    async getById(id) {
        try {
            const response = await api.get(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur userService.getById:', error);
            throw error;
        }
    },

    async update(id, data) {
        try {
            const response = await api.put(`/users/${id}`, data);
            return response.data;
        } catch (error) {
            console.error('Erreur userService.update:', error);
            throw error;
        }
    },

    async toggleStatus(id) {
        try {
            const response = await api.put(`/users/${id}/status`);
            return response.data;
        } catch (error) {
            console.error('Erreur userService.toggleStatus:', error);
            throw error;
        }
    },

    async delete(id) {
        try {
            const response = await api.delete(`/users/${id}`);
            return response.data;
        } catch (error) {
            console.error('Erreur userService.delete:', error);
            throw error;
        }
    },

    async create(data) {
        try {
            const response = await api.post('/users', data);
            return response.data;
        } catch (error) {
            console.error('Erreur userService.create:', error);
            throw error;
        }
    },

    async becomeAgent() {
        try {
            const response = await api.post('/me/become-agent');
            return response.data;
        } catch (error) {
            console.error('Erreur userService.becomeAgent:', error);
            throw error;
        }
    },

    async getAgentRequests() {
        try {
            const response = await api.get('/admin/agent-requests');
            return response.data;
        } catch (error) {
            console.error('Erreur userService.getAgentRequests:', error);
            throw error;
        }
    },

    async processAgentRequest(id, status) {
        try {
            const response = await api.put(`/admin/agent-requests/${id}/process`, { status });
            return response.data;
        } catch (error) {
            console.error('Erreur userService.processAgentRequest:', error);
            throw error;
        }
    }
};