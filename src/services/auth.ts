import { api } from './api';
import { AuthResponse, User } from '../types/api';

export const authService = {
  async register(email: string, password: string): Promise<User> {
    const response = await api.post('/auth/register', { email, password });
    return response.data;
  },

  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await api.post('/auth/login', { email, password });
    return response.data;
  },

  async getMe(): Promise<User> {
    const response = await api.get('/auth/me');
    return response.data;
  },

  logout(): void {
    localStorage.removeItem('retinaguard_token');
  },

  getToken(): string | null {
    return localStorage.getItem('retinaguard_token');
  },

  isAuthenticated(): boolean {
    return !!localStorage.getItem('retinaguard_token');
  }
};

export const auth = authService;
