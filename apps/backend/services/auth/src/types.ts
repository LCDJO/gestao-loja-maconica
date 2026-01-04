// Tipos de usuário no sistema
export type UserType = "SUPER_ADMIN" | "ADMIN" | "MEMBER";

// Payload Super-Admin
export interface SuperAdminPayload {
  sub: string; // Super-admin ID
  email: string;
  type: "SUPER_ADMIN";
  role: "SUPER_ADMIN";
  iat: number;
  exp: number;
}

// Payload Admin
export interface AdminPayload {
  sub: string; // Admin ID
  email: string;
  type: "ADMIN";
  role: "ADMIN";
  lodgeId: string; // 🔑 ESSENCIAL para Admin
  lodgeName: string;
  iat: number;
  exp: number;
}

// Payload Member
export interface MemberPayload {
  sub: string; // Member ID
  email: string;
  type: "MEMBER";
  role: "MEMBER";
  lodgeId: string;
  iat: number;
  exp: number;
}

// Union type para todos os tipos de JWT
export type JWTPayload = SuperAdminPayload | AdminPayload | MemberPayload;

// Response padrão de login
export interface LoginResponse {
  success: boolean;
  message?: string;
  data?: {
    token: string;
    refreshToken: string;
    user: {
      id: string;
      email: string;
      role: UserType;
      lodgeId?: string;
      lodgeName?: string;
    };
  };
  error?: string;
}

// Response padrão de API
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
}
