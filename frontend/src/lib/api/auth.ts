import apiClient, { initializeTokenRefresh, clearTokenRefresh } from '@/lib/axios';
import type { User } from '@/types';
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  token_type: string;
  expires_in: number; // Token expiration time in seconds
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
    localStorage.removeItem('tokenExpiration');
    localStorage.removeItem('user');
    clearTokenRefresh(); // Clear the automatic refresh timer
  },

  /**
   * Store auth token and initialize automatic refresh
   */
  setAuthToken: (token: string, expiresIn?: number) => {
    console.log('Storing auth token:', token);
    localStorage.setItem('authToken', token);
    
    // Store expiration time if provided
    if (expiresIn) {
      const expirationTime = Date.now() + (expiresIn * 1000);
      localStorage.setItem('tokenExpiration', expirationTime.toString());
    }
    
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
