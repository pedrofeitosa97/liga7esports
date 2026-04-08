import axios from 'axios';

/**
 * Produção: `/api/proxy` → rewrite em vercel.json para a API na Railway (edge Vercel).
 * Local: `http://localhost:3001/api`.
 */
const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.trim() ||
  (process.env.NODE_ENV === 'production' ? '/api/proxy' : 'http://localhost:3001/api');

export const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Request interceptor to attach JWT
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('liga7_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

// Response interceptor for error handling
api.interceptors.response.use(
  (res) => res,
  (error) => {
    const isAuthEndpoint = error.config?.url?.includes('/auth/');
    const isUnauthorized = error.response?.status === 401;

    // Only force logout on 401s from protected endpoints (not login/register)
    if (isUnauthorized && !isAuthEndpoint) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('liga7_token');
        const currentPath = window.location.pathname;
        if (currentPath !== '/login' && currentPath !== '/register') {
          window.location.href = '/login';
        }
      }
    }

    return Promise.reject(error);
  },
);

// ─── Auth ─────────────────────────────────────────────────────────────────────

export const authApi = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (username: string, email: string, password: string) =>
    api.post('/auth/register', { username, email, password }),
};

// ─── Users ────────────────────────────────────────────────────────────────────

export const usersApi = {
  getMe: () => api.get('/users/me'),
  getById: (id: string) => api.get(`/users/${id}`),
  getByUsername: (username: string) => api.get(`/users/username/${username}`),
  update: (data: { username?: string; avatarUrl?: string }) => api.put('/users/me', data),
  uploadAvatar: (file: File) => {
    const formData = new FormData();
    formData.append('avatar', file);
    return api.post('/users/me/avatar', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
  getRanking: (page = 1, limit = 20) =>
    api.get('/users/ranking', { params: { page, limit } }),
  getMyRegistrations: () => api.get('/users/me/registrations'),
};

// ─── Tournaments ──────────────────────────────────────────────────────────────

export const tournamentsApi = {
  getAll: (params?: {
    game?: string;
    status?: string;
    free?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) => api.get('/tournaments', { params }),
  getById: (id: string) => api.get(`/tournaments/${id}`),
  create: (data: Record<string, unknown>) => api.post('/tournaments', data),
  update: (id: string, data: Record<string, unknown>) => api.put(`/tournaments/${id}`, data),
  delete: (id: string) => api.delete(`/tournaments/${id}`),
  join: (id: string) => api.post(`/tournaments/${id}/join`),
  leave: (id: string) => api.delete(`/tournaments/${id}/leave`),
  generateBracket: (id: string) => api.post(`/tournaments/${id}/generate-bracket`),
  checkRegistration: (id: string) => api.get(`/tournaments/${id}/registration-status`),
};

// ─── Matches ──────────────────────────────────────────────────────────────────

export const matchesApi = {
  getByTournament: (id: string) => api.get(`/tournaments/${id}/matches`),
  submitResult: (data: { matchId: string; score1: number; score2: number; winnerId?: string }) =>
    api.post('/matches/result', data),
};

// ─── Badges ───────────────────────────────────────────────────────────────────

export const badgesApi = {
  getAll: () => api.get('/badges'),
  getMyBadges: () => api.get('/badges/me'),
  getUserBadges: (userId: string) => api.get(`/badges/user/${userId}`),
};
