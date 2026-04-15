import api from './api';

export const dashboardService = {
    getStats: async () => {
        try {
            const response = await api.get('/dashboard/stats');
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAdminStats: async () => {
        try {
            const response = await api.get('/admin/stats');
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
