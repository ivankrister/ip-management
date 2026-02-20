import axios, { AxiosError } from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002/api/v1',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false,
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;
let refreshTimer: ReturnType<typeof setTimeout> | null = null;

const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    return null;
  }
};

const isTokenExpired = (token: string, bufferSeconds: number = 60): boolean => {
  const decoded = decodeToken(token);
  if (!decoded?.exp) return true;

  const expirationTime = decoded.exp * 1000;
  const timeUntilExpiry = expirationTime - Date.now();

  return timeUntilExpiry <= bufferSeconds * 1000;
};

const getTimeUntilExpiry = (token: string): number => {
  const storedExpiration = localStorage.getItem('tokenExpiration');
  if (storedExpiration) {
    const expirationTime = parseInt(storedExpiration, 10);
    return Math.max(0, expirationTime - Date.now());
  }

  const decoded = decodeToken(token);
  if (!decoded?.exp) return 0;

  return Math.max(0, decoded.exp * 1000 - Date.now());
};

const clearAuthData = () => {
  localStorage.removeItem('authToken');
  localStorage.removeItem('tokenExpiration');
  localStorage.removeItem('user');
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

const refreshAuthToken = async (): Promise<string> => {
  const currentToken = localStorage.getItem('authToken');
  if (!currentToken) throw new Error('No auth token available');

  try {
    const response = await axios.post(
      `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:8002/api/v1'}/refresh`,
      {},
      {
        headers: {
          'Authorization': `Bearer ${currentToken}`,
        },
      }
    );

    const { access_token, expires_in } = response.data;
    localStorage.setItem('authToken', access_token);
    
    if (expires_in) {
      const expirationTime = Date.now() + (expires_in * 1000);
      localStorage.setItem('tokenExpiration', expirationTime.toString());
    }
    
    scheduleTokenRefresh(access_token);

    return access_token;
  } catch (error) {
    clearAuthData();
    throw error;
  }
};

const scheduleTokenRefresh = (token: string) => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }

  const timeUntilExpiry = getTimeUntilExpiry(token);
  if (timeUntilExpiry <= 0) return;

  // Refresh 2 minutes before expiry or at 80% of token lifetime
  const refreshBuffer = Math.min(2 * 60 * 1000, timeUntilExpiry * 0.2);
  const refreshTime = timeUntilExpiry - refreshBuffer;

  refreshTimer = setTimeout(async () => {
    try {
      if (!isRefreshing) {
        isRefreshing = true;
        await refreshAuthToken();
      }
    } catch (error) {
      window.location.href = '/auth/login';
    } finally {
      isRefreshing = false;
    }
  }, refreshTime);
};

export const initializeTokenRefresh = () => {
  const token = localStorage.getItem('authToken');
  if (!token) return;

  if (isTokenExpired(token, 60)) {
    refreshAuthToken().catch(() => {
      window.location.href = '/auth/login';
    });
  } else {
    scheduleTokenRefresh(token);
  }
};

export const clearTokenRefresh = () => {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
};

apiClient.interceptors.request.use(
  async (config) => {
    const token = localStorage.getItem('authToken');
    if (!token) return config;

    if (isTokenExpired(token, 60)) {
      try {
        if (refreshPromise) {
          config.headers.Authorization = `Bearer ${await refreshPromise}`;
        } else if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshAuthToken();
          config.headers.Authorization = `Bearer ${await refreshPromise}`;
        } else {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch (error) {
        config.headers.Authorization = `Bearer ${token}`;
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    } else {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as any;

    if (error.response?.status === 401) {
      const currentPath = window.location.pathname;
      
      if (currentPath.includes('/login') || currentPath.includes('/auth') || originalRequest?._retry) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        if (!isRefreshing) {
          isRefreshing = true;
          refreshPromise = refreshAuthToken();
        }
        
        const newToken = await refreshPromise;
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
        }
        return apiClient(originalRequest);
      } catch (refreshError) {
        window.location.href = '/auth/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
        refreshPromise = null;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;