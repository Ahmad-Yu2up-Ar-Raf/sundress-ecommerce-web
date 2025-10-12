// lib/axios.ts
import axios, { AxiosInstance, InternalAxiosRequestConfig } from 'axios';

const createAxios = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: "http://localhost:8000",
    headers: { 'X-Requested-With': 'XMLHttpRequest' },
    withCredentials: true, // penting untuk Sanctum cookie-based auth
    xsrfCookieName: 'XSRF-TOKEN',
    xsrfHeaderName: 'X-XSRF-TOKEN',
  });

  // ✅ Inject Authorization header otomatis
  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token');
        if (token && config.headers) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  // ✅ Handle expired token / unauthorized user
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      const status = error?.response?.status;
      if (status === 401) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token');
          localStorage.removeItem('auth-storage');
          window.location.href = '/login';
        }
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

export default createAxios();
