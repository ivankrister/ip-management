import { authApi, type LoginCredentials, type LoginResponse } from '@/lib/api/auth';

export class AuthService {
  /**
   * Handle login process including API call, token storage, and error handling
   */
  static async handleLogin(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await authApi.login(credentials);
      
      // Store token and user data
      authApi.setAuthToken(response.token);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      return response;
    } catch (error) {
      // Re-throw error to be handled by the caller

      throw error;
    }
  }

  /**
   * Handle logout process
   */
  static logout(): void {
    authApi.logout();
  }

  /**
   * Get current user from local storage
   */
  static getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return authApi.isAuthenticated();
  }
}
