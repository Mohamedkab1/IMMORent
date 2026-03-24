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

    async getAgentContracts() {
        try {
            const response = await api.get('/agent/contracts');
            return response.data;
        } catch (error) {
            console.error('Erreur contractService.getAgentContracts:', error);
            throw error;
        }
    },

    // Nouvelle méthode pour télécharger le PDF
    async download(id) {
        try {
            // Pour télécharger un fichier, on utilise une approche différente
            const token = localStorage.getItem('token');
            const response = await fetch(`${api.defaults.baseURL}/contracts/${id}/download`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/pdf',
                },
            });
            
            if (!response.ok) {
                throw new Error('Erreur lors du téléchargement');
            }
            
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `contrat_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
            document.body.removeChild(a);
            
            return { success: true };
        } catch (error) {
            console.error('Erreur contractService.download:', error);
            throw error;
        }
    }
};