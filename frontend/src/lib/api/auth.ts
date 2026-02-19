import apiClient from '@/lib/axios';
import type { User } from '@/types';
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: number;
    name: string;
    email: string;
    type: string;
  };
}


export const authApi = {
  /**
   * Login with email and password
   */
  login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
    const response = await apiClient.post<LoginResponse>('/login', credentials);
    return response.data;
  },

  /**
   * Get current authenticated user
   */
  getUser: async (): Promise<User> => {
    const response = await apiClient.get<User>('/user');
    return response.data;
  },

  /**
   * Logout and clear auth token
   */
  logout: async (): Promise<void> => {
    await apiClient.post('/logout', { _method: 'DELETE' });
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
  },

  /**
   * Store auth token
   */
  setAuthToken: (token: string) => {
    console.log('Storing auth token:', token);
    localStorage.setItem('authToken', token);
  },

  /**
   * Get stored auth token
   */
  getAuthToken: (): string | null => {
    return localStorage.getItem('authToken');
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('authToken');
  },
};
