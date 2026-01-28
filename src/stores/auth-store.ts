import { defineStore, acceptHMRUpdate } from 'pinia';
import { LocalStorage, SessionStorage } from 'quasar';
import { api } from 'boot/axios';
import { Notify } from 'quasar';
import { useStorage } from 'src/composables/storage';
import type { AuthResponse } from './auth-response';
import type { LoginRequest } from 'src/types/login-request';
import type { AuthState } from '../types/auth-state';

const USER_TYPE = ['ADMIN'];
const AUTH_TYPE = 'Bearer';

const { setStorage, getStorage } = useStorage();

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    role: null,
    authenticated: false,
  }),
  getters: {
    getUser: (state) => state.user,
    getRole: (state) => state.role,
    isAuthenticated: (state) => state.authenticated,
  },
  actions: {
    async login(payload: LoginRequest) {
      const response = await api.post<AuthResponse>(`/api/login`, payload);
      const data = response.data;
      this.initUser(data);
      return data;
    },

    initUser(payload: AuthResponse) {
      const profile = {
        token: payload.token,
        user: payload.user,
      };

      if (USER_TYPE.includes(profile.user.role)) {
        api.defaults.headers.common.Authorization = `${AUTH_TYPE} ${profile.token}`;

        this.role = profile.user.role;
        this.authenticated = true;
        setStorage('token', profile.token);
        setStorage('user', profile.user);
        this.setUser(payload);
      } else {
        this.clear();
        Notify.create({
          message: 'Hola, no cuentas con privilegios para acceder a la aplicación.',
          color: 'negative',
          icon: 'error',
          position: 'top',
        });
      }
    },

    async verify() {
      const token = getStorage('token');

      if (token && typeof token === 'string') {
        setStorage('token', token);
        api.defaults.headers.common.Authorization = `${AUTH_TYPE} ${token}`;

        try {
          const response = await api.post<AuthResponse>('/api/verify');

          const data = response.data;

          this.initUser(data);
        } catch (error) {
          this.clear();
          throw error;
        }
      }
    },

    logout() {
      delete api.defaults.headers.common['Authorization'];
      this.clear();
    },

    setUser(data: AuthResponse) {
      this.user = { ...data.user };
    },

    clear() {
      this.token = null;
      this.user = null;
      this.authenticated = false;
      this.role = null;
      LocalStorage.clear();
      SessionStorage.clear();
    },
  },
});

if (import.meta.hot) {
  import.meta.hot.accept(acceptHMRUpdate(useAuthStore, import.meta.hot));
}
