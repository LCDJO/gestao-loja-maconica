// Tipos específicos do serviço de membros

export interface MemberLoginRequest {
  email: string;
  password: string;
}

export interface MemberAuthResponse {
  token: string;
  refreshToken: string;
  user: MemberProfile;
}

export interface MemberProfile {
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
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  birthDate?: string;
  address?: string;
  city?: string;
  state?: string;
  zipCode?: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface AuthTokenPayload {
  memberId: string;
  email: string;
  iat: number;
  exp: number;
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
