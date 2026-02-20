import { authApi, type LoginCredentials, type LoginResponse } from '@/lib/api/auth';

export class AuthService {
  /**
   * Handle login process including API call, token storage, and error handling
   */
  static async handleLogin(credentials: LoginCredentials): Promise<LoginResponse> {
    try {
      const response = await authApi.login(credentials);

      console.log('response', response.access_token);
      
      // Store token and user data with expiration time
      authApi.setAuthToken(response.access_token, response.expires_in);
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
   * Get user (alias for getCurrentUser)
   */
  static getUser() {
    return this.getCurrentUser();
  }

  /**
   * Check if user is authenticated
   */
  static isAuthenticated(): boolean {
    return authApi.isAuthenticated();
  }
}
