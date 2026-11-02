import { defineStore } from 'pinia';
import api from '../services/api';
import socketService from '../services/socket';
import type { User } from '../types';

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: JSON.parse(localStorage.getItem('mozbid_user') || 'null'),
    token: localStorage.getItem('mozbid_token'),
    loading: false,
    error: null
  }),

  getters: {
    isAuthenticated: (state) => Boolean(state.token && state.user),
    isSeller: (state) => state.user?.role === 'seller' || state.user?.role === 'admin',
    isAdmin: (state) => state.user?.role === 'admin',
    userName: (state) => state.user?.name || 'Utilizador',
    userBalance: (state) => state.user?.balance || 0
  },

  actions: {
    async login(email: string, password: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/auth/login', { email, password });
        const { token, user } = response.data;

        this.token = token;
        this.user = user;

        localStorage.setItem('mozbid_token', token);
        localStorage.setItem('mozbid_user', JSON.stringify(user));

        // Connect user to their personal socket room
        socketService.joinUser(user.id);

        return user;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Erro ao iniciar sessão';
        throw new Error(this.error || 'Erro de autenticação');
      } finally {
        this.loading = false;
      }
    },

    async register(data: any) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.post('/auth/register', data);
        const { token, user } = response.data;

        this.token = token;
        this.user = user;

        localStorage.setItem('mozbid_token', token);
        localStorage.setItem('mozbid_user', JSON.stringify(user));

        socketService.joinUser(user.id);

        return user;
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Erro ao criar conta';
        throw new Error(this.error || 'Erro no registo');
      } finally {
        this.loading = false;
      }
    },

    logout() {
      this.user = null;
      this.token = null;
      localStorage.removeItem('mozbid_token');
      localStorage.removeItem('mozbid_user');
      api.post('/auth/logout').catch(() => {});
    },

    async fetchCurrentUser() {
      if (!this.token) return null;
      try {
        const res = await api.get('/auth/me');
        this.user = res.data.user;
        localStorage.setItem('mozbid_user', JSON.stringify(this.user));
        if (this.user) {
          socketService.joinUser(this.user.id);
        }
        return this.user;
      } catch {
        this.logout();
        return null;
      }
    }
  }
});
