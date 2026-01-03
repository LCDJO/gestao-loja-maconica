import * as SecureStore from 'expo-secure-store';
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3002';

const TOKEN_KEY = 'member_token';
const REFRESH_TOKEN_KEY = 'member_refresh_token';
const PROFILE_KEY = 'member_profile';

/**
 * Cliente HTTP com autenticação JWT
 * Gerencia tokens, refresh automático e interceptadores
 */
class MembersApiClient {
  private api: AxiosInstance;
  private isRefreshing = false;
  private refreshSubscribers: ((token: string) => void)[] = [];

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 10000,
    });

    this.setupInterceptors();
  }

  /**
   * Configurar interceptadores
   */
  private setupInterceptors() {
    // Request interceptor: adicionar token
    this.api.interceptors.request.use(
      async (config) => {
        const token = await this.getStoredToken();

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }

        // Adicionar headers de telemetria mobile
        config.headers['X-App-Version'] = '1.0.0';
        config.headers['X-Platform'] = 'ios'; // Será dinâmico em produção
        config.headers['X-Device-Id'] = await this.getDeviceId();

        return config;
      },
      (error) => Promise.reject(error)
    );

    // Response interceptor: refresh automático em 401
    this.api.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;

          if (!this.isRefreshing) {
            this.isRefreshing = true;

            try {
              const refreshToken = await this.getStoredRefreshToken();
              if (!refreshToken) {
                throw new Error('No refresh token available');
              }

              const response = await this.api.post('/refresh', { refreshToken });
              const { token, refreshToken: newRefreshToken } = response.data.data;

              await this.storeTokens(token, newRefreshToken);

              // Notificar todos os subscribers
              this.refreshSubscribers.forEach((callback) => callback(token));
              this.refreshSubscribers = [];

              return this.api(originalRequest);
            } catch (refreshError) {
              // Refresh falhou - logout
              await this.logout();
              return Promise.reject(refreshError);
            } finally {
              this.isRefreshing = false;
            }
          }

          // Esperar refresh completar
          return new Promise((resolve) => {
            this.onRefreshed((token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(this.api(originalRequest));
            });
          });
        }

        return Promise.reject(error);
      }
    );
  }

  /**
   * Subscrever a atualização de token
   */
  private onRefreshed(callback: (token: string) => void) {
    this.refreshSubscribers.push(callback);
  }

  /**
   * ============= ARMAZENAMENTO SEGURO =============
   */

  async storeTokens(token: string, refreshToken: string) {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
    } catch (error) {
      console.error('Erro ao armazenar tokens:', error);
      throw error;
    }
  }

  async getStoredToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEY);
    } catch (error) {
      console.error('Erro ao recuperar token:', error);
      return null;
    }
  }

  async getStoredRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
    } catch (error) {
      console.error('Erro ao recuperar refresh token:', error);
      return null;
    }
  }

  async storeProfile(profile: any) {
    try {
      const serialized = JSON.stringify(profile);
      // Em produção, seria melhor usar SecureStore para dados sensíveis
      // Por enquanto, armazenar em plain (ajustar conforme necessário)
      await SecureStore.setItemAsync(PROFILE_KEY, serialized);
    } catch (error) {
      console.error('Erro ao armazenar perfil:', error);
    }
  }

  async getStoredProfile(): Promise<any | null> {
    try {
      const serialized = await SecureStore.getItemAsync(PROFILE_KEY);
      return serialized ? JSON.parse(serialized) : null;
    } catch (error) {
      console.error('Erro ao recuperar perfil:', error);
      return null;
    }
  }

  async getDeviceId(): Promise<string> {
    // Implementar com expo-device ou gerado na primeira instalação
    return 'device-id-placeholder';
  }

  async clearAll() {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      await SecureStore.deleteItemAsync(PROFILE_KEY);
    } catch (error) {
      console.error('Erro ao limpar armazenamento:', error);
    }
  }

  /**
   * ============= AUTENTICAÇÃO =============
   */

  async login(email: string, password: string, lodgeId?: string) {
    const response = await this.api.post('/login', {
      email,
      password,
      lodgeId,
    });

    if (response.data.success) {
      const { token, refreshToken, user } = response.data.data;
      await this.storeTokens(token, refreshToken);
      await this.storeProfile(user);
    }

    return response.data;
  }

  async logout() {
    try {
      await this.api.post('/logout');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      await this.clearAll();
    }
  }

  async verifyToken() {
    const response = await this.api.get('/verify');
    return response.data;
  }

  /**
   * ============= PERFIL =============
   */

  async getProfile() {
    const response = await this.api.get('/profile');
    return response.data;
  }

  async updateProfile(updates: any) {
    const response = await this.api.put('/profile/update', updates);
    if (response.data.success) {
      await this.storeProfile(response.data.data.user);
    }
    return response.data;
  }

  async changePassword(currentPassword: string, newPassword: string) {
    const response = await this.api.put('/password', {
      currentPassword,
      newPassword,
      confirmPassword: newPassword,
    });
    return response.data;
  }

  /**
   * ============= FINANCEIRO =============
   */

  async getBalance() {
    const response = await this.api.get('/finances/balance');
    return response.data;
  }

  async getTransactions(page = 1, limit = 20, filters?: any) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...filters,
    });

    const response = await this.api.get(`/finances/transactions?${params}`);
    return response.data;
  }

  async getInvoices(status = 'pending') {
    const response = await this.api.get('/finances/invoices', {
      params: { status },
    });
    return response.data;
  }

  /**
   * ============= SECRETARIA =============
   */

  async getMembers(page = 1, limit = 50, search?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...(search && { search }),
    });

    const response = await this.api.get(`/list?${params}`);
    return response.data;
  }

  async getMemberDetails(memberId: string) {
    const response = await this.api.get(`/${memberId}/public`);
    return response.data;
  }

  /**
   * ============= DOCUMENTOS =============
   */

  async getDocuments(type?: string) {
    const params = new URLSearchParams(
      type ? { type } : {}
    );

    const response = await this.api.get(`/documents?${params}`);
    return response.data;
  }

  async uploadDocument(formData: FormData) {
    const response = await this.api.post('/documents/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  /**
   * ============= PRESENÇA & EVENTOS =============
   */

  async getAttendance(month?: string) {
    const params = new URLSearchParams(
      month ? { month } : {}
    );

    const response = await this.api.get(`/attendance?${params}`);
    return response.data;
  }

  async getUpcomingEvents(limit = 10) {
    const response = await this.api.get('/events/upcoming', {
      params: { limit },
    });
    return response.data;
  }

  /**
   * ============= SAÚDE =============
   */

  async getHealthStatus() {
    const response = await this.api.get('/health');
    return response.data;
  }

  async updateHealthStatus(status: string, notes: string) {
    const response = await this.api.put('/health', {
      status,
      notes,
      visibility: 'members',
    });
    return response.data;
  }
}

// Exportar instância singleton
export const membersApi = new MembersApiClient();

// Tipos úteis
export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    user: MemberUser;
  };
}

export interface MemberUser {
  id: string;
  email: string;
  name: string;
  lodgeId: string;
  lodgeName: string;
  role: string;
  member: {
    cim: string;
    degree: string;
    status: string;
    initiation_date: string;
  };
}

export interface TransactionItem {
  id: string;
  date: string;
  type: 'receita' | 'despesa';
  category: string;
  description: string;
  amount: number;
  status: string;
}

export interface InvoiceItem {
  id: string;
  month: string;
  description: string;
  amount: number;
  dueDate: string;
  status: 'pending' | 'overdue' | 'paid';
  barcode?: string;
  pdfUrl?: string;
}
