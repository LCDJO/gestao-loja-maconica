import { create } from 'zustand';
import { membersApi } from '@services/api';

interface Member {
  id: string;
  cim: string;
  degree: string;
  status: string;
  initiation_date: string;
  birth_date?: string;
  photo_url?: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  lodgeId: string;
  lodgeName: string;
  role: string;
  member: Member;
}

interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  token: string | null;
  error: string | null;

  // Actions
  login: (email: string, password: string, lodgeId?: string) => Promise<boolean>;
  logout: () => Promise<void>;
  restoreSession: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string) => Promise<boolean>;
  clearError: () => void;
}

/**
 * Store Zustand para autenticação
 * Gerencia estado de login, tokens e dados do usuário
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  isLoading: true,
  token: null,
  error: null,

  /**
   * Login com email e senha
   */
  login: async (email: string, password: string, lodgeId?: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await membersApi.login(email, password, lodgeId);

      if (response.success) {
        const { user, token } = response.data;
        set({
          user,
          isLoggedIn: true,
          token,
          error: null,
        });
        return true;
      } else {
        set({ error: response.error || 'Erro ao fazer login' });
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Erro na autenticação';
      set({ error: errorMessage });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Logout
   */
  logout: async () => {
    try {
      set({ isLoading: true });
      await membersApi.logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      set({
        user: null,
        isLoggedIn: false,
        token: null,
        error: null,
        isLoading: false,
      });
    }
  },

  /**
   * Restaurar sessão ao abrir o app
   */
  restoreSession: async () => {
    try {
      set({ isLoading: true });

      const storedToken = await membersApi.getStoredToken();
      const storedProfile = await membersApi.getStoredProfile();

      if (storedToken && storedProfile) {
        // Verificar se token ainda é válido
        try {
          const verifyResponse = await membersApi.verifyToken();
          if (verifyResponse.data.valid) {
            set({
              user: storedProfile,
              isLoggedIn: true,
              token: storedToken,
              error: null,
            });
            return;
          }
        } catch (error) {
          // Token inválido, tentar fazer logout
          await membersApi.logout();
        }
      }

      set({
        user: null,
        isLoggedIn: false,
        token: null,
        error: null,
      });
    } catch (error) {
      console.error('Erro ao restaurar sessão:', error);
      set({
        user: null,
        isLoggedIn: false,
        token: null,
        error: null,
      });
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Atualizar perfil
   */
  updateProfile: async (updates: Partial<User>) => {
    try {
      set({ isLoading: true, error: null });

      const response = await membersApi.updateProfile(updates);

      if (response.success) {
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
          error: null,
        }));
        return true;
      } else {
        set({ error: response.error || 'Erro ao atualizar perfil' });
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao atualizar perfil';
      set({ error: errorMessage });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Alterar senha
   */
  changePassword: async (currentPassword: string, newPassword: string) => {
    try {
      set({ isLoading: true, error: null });

      const response = await membersApi.changePassword(currentPassword, newPassword);

      if (response.success) {
        set({ error: null });
        return true;
      } else {
        set({ error: response.error || 'Erro ao alterar senha' });
        return false;
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || error.message || 'Erro ao alterar senha';
      set({ error: errorMessage });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },

  /**
   * Limpar erro
   */
  clearError: () => {
    set({ error: null });
  },
}));
