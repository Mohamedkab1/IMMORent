import api from './api';

export const messageService = {
    getConversations: async (page = 1) => {
        try {
            const response = await api.get(`/conversations?page=${page}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getMessages: async (conversationId, page = 1) => {
        try {
            const response = await api.get(`/conversations/${conversationId}?page=${page}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    sendMessage: async (data) => {
        try {
            const response = await api.post('/messages', data);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    deleteConversation: async (id) => {
        try {
            const response = await api.delete(`/conversations/${id}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    }
};
