import api from './api';

export const settingService = {
    async getAll() {
        try {
            const response = await api.get('/admin/settings');
            return response.data;
        } catch (error) {
            console.error('Erreur settingService.getAll:', error);
            throw error;
        }
    },

    async updateBulk(settings) {
        try {
            const response = await api.put('/admin/settings/bulk', { settings });
            return response.data;
        } catch (error) {
            console.error('Erreur settingService.updateBulk:', error);
            throw error;
        }
    }
};
