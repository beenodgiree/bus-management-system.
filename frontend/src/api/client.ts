import axios from 'axios';

const TOKEN_KEY = 'busms_token';

export const tokenStore = {
  get: () => localStorage.getItem(TOKEN_KEY),
  set: (token: string) => localStorage.setItem(TOKEN_KEY, token),
  clear: () => localStorage.removeItem(TOKEN_KEY),
};

// Vite proxies "/api" to the Spring Boot backend (see vite.config.ts).
const client = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach the JWT to every outgoing request when present.
client.interceptors.request.use((config) => {
  const token = tokenStore.get();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// On 401, the session is dead — clear the token and bounce to login.
client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      tokenStore.clear();
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Normalises the backend ApiError shape into a plain message for the UI.
export function extractError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const data = error.response?.data as
      | { message?: string; fieldErrors?: Record<string, string> }
      | undefined;
    if (data?.fieldErrors) {
      const first = Object.values(data.fieldErrors)[0];
      if (first) return first;
    }
    if (data?.message) return data.message;
    return error.message;
  }
  return 'Unexpected error. Please try again.';
}

export default client;
