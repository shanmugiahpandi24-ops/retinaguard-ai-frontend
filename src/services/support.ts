import { api } from './api';
import { SupportChatResponse } from '../types/api';

export const supportService = {
  async sendMessage(message: string): Promise<SupportChatResponse> {
    const response = await api.post('/support/chat', { message });
    return response.data;
  },
};

export const support = supportService;
