// client/src/services/api.js
import axios from 'axios';
import { supabase } from './supabase';

// Create base Axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// --- Request interceptor: attach Supabase token ---
let cachedToken = null;  // Cache to reduce redundant getSession() calls
let tokenExpiry = 0;

api.interceptors.request.use(
  async (config) => {
    const now = Date.now();

    // Refresh cached token if expired or missing
    if (!cachedToken || now > tokenExpiry) {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.access_token) {
        cachedToken = session.access_token;
        tokenExpiry = (session.expires_at || 0) * 1000;
      } else {
        cachedToken = null;
        tokenExpiry = 0;
      }
    }

    // Attach token if available
    if (cachedToken) {
      config.headers.Authorization = `Bearer ${cachedToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// --- Response interceptor: handle 401 errors globally ---
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      console.warn('Unauthorized request to backend API.');
      // Optional: clear cache to force token refresh next request
      cachedToken = null;
      tokenExpiry = 0;

      // You could also dispatch a logout or redirect:
      // window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;