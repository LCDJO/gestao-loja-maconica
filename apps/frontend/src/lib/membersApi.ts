/**
 * API Client para Members Service
 * Consumir endpoints do microsserviço em localhost:3002
 */

const API_BASE_URL = import.meta.env.VITE_MEMBERS_API_URL || 'http://localhost:3002/api/members';

export interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    token: string;
    refreshToken: string;
    user: {
      id: string;
      name: string;
      email: string;
      phone: string;
      birthDate: string;
      cpf: string;
      address: string;
      city: string;
      state: string;
      zipCode: string;
      cim: string;
      degree: 'aprendiz' | 'companheiro' | 'mestre';
      status: 'ativo' | 'inativo' | 'irregular';
      initiationDate: string;
      photoUrl?: string;
      createdAt: string;
      updatedAt: string;
    };
  };
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: LoginResponse['data']['user'];
}

export interface BalanceResponse {
  success: boolean;
  message: string;
  data: {
    balance: number;
    totalIncome: number;
    totalExpense: number;
    lastUpdated: string;
  };
}

export interface TransactionsResponse {
  success: boolean;
  message: string;
  data: {
    transactions: Array<{
      id: string;
      date: string;
      type: 'receita' | 'despesa';
      category: string;
      description: string;
      amount: number;
    }>;
    total: number;
  };
}

/**
 * Fazer login
 */
export async function loginMember(email: string, password: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });

  const data = await response.json();

  // Retornar a resposta mesmo se não foi ok, permitindo que o contexto trate o erro
  if (!response.ok) {
    // Se não conseguiu fazer parse, lançar erro genérico
    if (!data.error) {
      throw new Error('Erro ao fazer login');
    }
    // Retornar resposta com success: false para o contexto processar
    return {
      success: false,
      message: data.error || 'Erro ao fazer login',
      data: {
        token: '',
        refreshToken: '',
        user: {} as any,
      },
    };
  }

  return data;
}

/**
 * Fazer logout
 */
export async function logoutMember(token: string): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/logout`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  // Mesmo em caso de erro, considerar logout bem-sucedido
  // pois queremos limpar o estado local de qualquer forma
  return {
    success: true,
    message: 'Logout realizado com sucesso',
  };
}

/**
 * Renovar token usando refresh token
 */
export async function refreshToken(refreshToken: string): Promise<LoginResponse> {
  const response = await fetch(`${API_BASE_URL}/refresh`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  });

  const data = await response.json();

  // Retornar a resposta mesmo se não foi ok
  if (!response.ok) {
    return {
      success: false,
      message: data.error || 'Erro ao renovar token',
      data: {
        token: '',
        refreshToken: '',
        user: {} as any,
      },
    };
  }

  return data;
}

/**
 * Verificar validade do token
 */
export async function verifyToken(token: string): Promise<{ success: boolean; data: { valid: boolean; user?: any } }> {
  const response = await fetch(`${API_BASE_URL}/verify`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      data: {
        valid: false,
      },
    };
  }

  return data;
}

/**
 * Obter perfil do membro
 */
export async function getProfile(token: string): Promise<ProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/profile`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao obter perfil');
  }

  return response.json();
}

/**
 * Atualizar perfil do membro
 */
export async function updateProfile(
  token: string,
  updates: {
    name?: string;
    email?: string;
    phone?: string;
    birthDate?: string;
    address?: string;
    city?: string;
    state?: string;
    zipCode?: string;
  }
): Promise<ProfileResponse> {
  const response = await fetch(`${API_BASE_URL}/profile/update`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updates),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao atualizar perfil');
  }

  return response.json();
}

/**
 * Alterar senha do membro
 */
export async function changePassword(
  token: string,
  currentPassword: string,
  newPassword: string,
  confirmPassword: string
): Promise<{ success: boolean; message: string }> {
  const response = await fetch(`${API_BASE_URL}/password`, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ currentPassword, newPassword, confirmPassword }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao alterar senha');
  }

  return response.json();
}

/**
 * Obter saldo financeiro
 */
export async function getBalance(token: string): Promise<BalanceResponse> {
  const response = await fetch(`${API_BASE_URL}/finances/balance`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  if (!response.ok) {
    throw new Error('Erro ao obter saldo');
  }

  return response.json();
}

/**
 * Obter transações financeiras
 */
export async function getTransactions(
  token: string,
  limit: number = 10,
  offset: number = 0
): Promise<TransactionsResponse> {
  const response = await fetch(
    `${API_BASE_URL}/finances/transactions?limit=${limit}&offset=${offset}`,
    {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Erro ao obter transações');
  }

  return response.json();
}

/**
 * Criar nova transação
 */
export async function createTransaction(
  token: string,
  data: {
    type: 'receita' | 'despesa';
    category: string;
    description: string;
    amount: number;
    date?: string;
  }
): Promise<{ success: boolean; message: string; data: any }> {
  const response = await fetch(`${API_BASE_URL}/finances/transactions`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Erro ao criar transação');
  }

  return response.json();
}

/**
 * Obter token armazenado
 */
export function getStoredToken(): string | null {
  return localStorage.getItem('memberToken');
}

/**
 * Obter refresh token armazenado
 */
export function getStoredRefreshToken(): string | null {
  return localStorage.getItem('memberRefreshToken');
}

/**
 * Armazenar tokens
 */
export function storeTokens(token: string, refreshToken: string): void {
  localStorage.setItem('memberToken', token);
  localStorage.setItem('memberRefreshToken', refreshToken);
}

/**
 * Limpar tokens
 */
export function clearTokens(): void {
  localStorage.removeItem('memberToken');
  localStorage.removeItem('memberRefreshToken');
  localStorage.removeItem('memberProfile');
}

/**
 * Armazenar perfil
 */
export function storeProfile(profile: any): void {
  localStorage.setItem('memberProfile', JSON.stringify(profile));
}

/**
 * Obter perfil armazenado
 */
export function getStoredProfile(): any | null {
  const stored = localStorage.getItem('memberProfile');
  return stored ? JSON.parse(stored) : null;
}

/**
 * Limpar completamente o localStorage
 */
export function clearAllStorage(): void {
  localStorage.removeItem('memberToken');
  localStorage.removeItem('memberRefreshToken');
  localStorage.removeItem('memberProfile');
  sessionStorage.clear();
}
