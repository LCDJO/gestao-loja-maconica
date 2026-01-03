import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Member } from '@/lib/types';
import * as membersApi from '@/lib/membersApi';

interface MemberAuthContextType {
  currentMember: Member | null;
  isLoggedIn: boolean;
  isLoading: boolean;
  token: string | null;
  loginError: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<Member>) => Promise<boolean>;
  changePassword: (currentPassword: string, newPassword: string, confirmPassword: string) => Promise<boolean>;
  refreshAuth: () => Promise<boolean>;
}

const MemberAuthContext = createContext<MemberAuthContextType | undefined>(undefined);

export function MemberAuthProvider({ children }: { children: ReactNode }) {
  const [currentMember, setCurrentMember] = useState<Member | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  // Carregar sessão ao montar
  useEffect(() => {
    const storedToken = membersApi.getStoredToken();
    const storedProfile = membersApi.getStoredProfile();

    if (storedToken && storedProfile) {
      setToken(storedToken);
      setCurrentMember(storedProfile as Member);
      setIsLoggedIn(true);
      
      // Verificar se token ainda é válido
      verifyTokenValidity(storedToken);
    }

    setIsLoading(false);
  }, []);

  /**
   * Verificar validade do token
   */
  const verifyTokenValidity = async (authToken: string) => {
    try {
      const response = await membersApi.verifyToken(authToken);
      if (!response.data.valid) {
        // Token inválido, tentar renovar
        await refreshAuthToken();
      }
    } catch (error) {
      console.warn('Token inválido, tentando renovar...', error);
      // Tentar renovar com refresh token
      await refreshAuthToken();
    }
  };

  /**
   * Renovar token com refresh token
   */
  const refreshAuthToken = async (): Promise<boolean> => {
    try {
      const refreshToken = membersApi.getStoredRefreshToken();
      if (!refreshToken) {
        logout();
        return false;
      }

      const response = await membersApi.refreshToken(refreshToken);
      const newToken = response.data.token;
      const newRefreshToken = response.data.refreshToken;
      const profile = response.data.user;

      membersApi.storeTokens(newToken, newRefreshToken);
      membersApi.storeProfile(profile);

      setToken(newToken);
      setCurrentMember(profile as Member);

      return true;
    } catch (error) {
      console.error('Erro ao renovar token:', error);
      logout();
      return false;
    }
  };

  /**
   * Fazer login
   */
  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      setLoginError(null);

      // Em localhost, fazer bypass de credenciais
      const isLocalhost = typeof window !== 'undefined' && 
        (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1');
      
      if (isLocalhost) {
        // Criar usuário de teste para localhost
        const testUser: Member = {
          id: 'dev-test-user',
          name: 'Usuário Teste',
          email: email || 'joao@masonica.org',
          phone: '(11) 98765-4321',
          birthDate: '1980-01-01',
          cpf: '123.456.789-00',
          address: 'Rua de Teste, 123',
          city: 'São Paulo',
          state: 'SP',
          zipCode: '01234-567',
          cim: '0001',
          degree: 'mestre',
          status: 'ativo',
          initiationDate: '2020-01-01',
          photoUrl: undefined,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        const testToken = 'dev-test-token-' + Date.now();
        const testRefreshToken = 'dev-test-refresh-' + Date.now();

        membersApi.storeTokens(testToken, testRefreshToken);
        membersApi.storeProfile(testUser);

        setToken(testToken);
        setCurrentMember(testUser);
        setIsLoggedIn(true);
        setLoginError(null);

        console.log('✅ Login de desenvolvimento (localhost)');
        return true;
      }

      // Em produção, fazer login real com API
      const response = await membersApi.loginMember(email, password);

      if (response.success) {
        const newToken = response.data.token;
        const refreshToken = response.data.refreshToken;
        const profile = response.data.user;

        membersApi.storeTokens(newToken, refreshToken);
        membersApi.storeProfile(profile);

        setToken(newToken);
        setCurrentMember(profile as Member);
        setIsLoggedIn(true);
        setLoginError(null);

        return true;
      }

      // Caso falhe no login
      setLoginError(response.message || 'Email ou senha incorretos');
      return false;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Erro ao fazer login';
      console.error('Erro ao fazer login:', error);
      setLoginError(errorMessage);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fazer logout
   */
  const logout = async () => {
    try {
      if (token) {
        await membersApi.logoutMember(token);
      }
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    } finally {
      // Limpar completamente o estado local e storage
      membersApi.clearAllStorage();
      setCurrentMember(null);
      setIsLoggedIn(false);
      setToken(null);
      setLoginError(null);
    }
  };

  /**
   * Atualizar perfil
   */
  const updateProfile = async (updates: Partial<Member>): Promise<boolean> => {
    try {
      if (!token) {
        throw new Error('Token não disponível');
      }

      const response = await membersApi.updateProfile(token, updates);

      if (response.success) {
        const updatedProfile = response.data;
        membersApi.storeProfile(updatedProfile);
        setCurrentMember(updatedProfile as Member);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error);
      return false;
    }
  };

  /**
   * Alterar senha
   */
  const changePassword = async (
    currentPassword: string,
    newPassword: string,
    confirmPassword: string
  ): Promise<boolean> => {
    try {
      if (!token) {
        throw new Error('Token não disponível');
      }

      const response = await membersApi.changePassword(
        token,
        currentPassword,
        newPassword,
        confirmPassword
      );

      return response.success;
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      return false;
    }
  };

  /**
   * Atualizar autenticação (renovar token se necessário)
   */
  const refreshAuth = async (): Promise<boolean> => {
    return refreshAuthToken();
  };

  return (
    <MemberAuthContext.Provider
      value={{
        currentMember,
        isLoggedIn,
        isLoading,
        token,
        loginError,
        login,
        logout,
        updateProfile,
        changePassword,
        refreshAuth,
      }}
    >
      {children}
    </MemberAuthContext.Provider>
  );
}

export function useMemberAuth() {
  const context = useContext(MemberAuthContext);
  if (!context) {
    throw new Error('useMemberAuth deve ser usado dentro de MemberAuthProvider');
  }
  return context;
}
