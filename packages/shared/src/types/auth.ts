/**
 * TIPOS DE AUTENTICAÇÃO - Compartilhado entre Frontend e Backend
 * 
 * Define as estruturas para Admin, Super-Admin e Member
 */

// =====================================================================
// ENUM: Roles disponíveis no sistema
// =====================================================================
export enum RoleType {
  ADMIN = 'admin',           // Administra UMA loja
  SUPER_ADMIN = 'super_admin', // Administra TODO SaaS
  MEMBER = 'member',         // Dados pessoais do membro
}

// =====================================================================
// JWT PAYLOAD - O que é armazenado no token
// =====================================================================
export interface JWTPayload {
  memberId: string;
  email: string;
  role: RoleType;
  // Isolamento multitenant: presente apenas para admin
  lodgeId?: string;
  // Timestamps
  iat?: number;
  exp?: number;
}

// =====================================================================
// ADMIN AUTH CONTEXT - Estado do Admin
// =====================================================================
export interface AdminAuthContext {
  token: string;
  refreshToken: string;
  role: RoleType.ADMIN;
  lodge_id: string;         // ← OBRIGATÓRIO para isolamento
  memberId: string;
  email: string;
  isLoggedIn: true;
}

// =====================================================================
// SUPER-ADMIN AUTH CONTEXT - Estado do Super-Admin
// =====================================================================
export interface SuperAdminAuthContext {
  token: string;
  refreshToken: string;
  role: RoleType.SUPER_ADMIN;
  // lodge_id: undefined;      // ← NÃO TEM (acesso irrestrito)
  memberId: string;
  email: string;
  isLoggedIn: true;
}

// =====================================================================
// MEMBER AUTH CONTEXT - Estado do Member
// =====================================================================
export interface MemberAuthContext {
  token: string;
  refreshToken: string;
  role: RoleType.MEMBER;
  memberId: string;
  email: string;
  isLoggedIn: true;
}

// =====================================================================
// UNION TYPE - Qualquer contexto de auth
// =====================================================================
export type AnyAuthContext = 
  | AdminAuthContext 
  | SuperAdminAuthContext 
  | MemberAuthContext
  | { isLoggedIn: false };

// =====================================================================
// LOGIN REQUEST - O que é enviado no login
// =====================================================================
export interface LoginRequest {
  email: string;
  password: string;
}

// =====================================================================
// LOGIN RESPONSE - O que é retornado após login
// =====================================================================
export interface LoginResponse {
  success: true;
  data: {
    token: string;
    refreshToken: string;
    user: {
      memberId: string;
      email: string;
      role: RoleType;
      lodge_id?: string;  // Presente apenas para admin
    };
  };
}

// =====================================================================
// API RESPONSE PATTERN - Resposta padrão de todas as APIs
// =====================================================================
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// =====================================================================
// HELPERS - Type guards para narrow down o tipo
// =====================================================================

export function isAdminContext(context: AnyAuthContext): context is AdminAuthContext {
  return context !== null && 
         'isLoggedIn' in context && 
         context.isLoggedIn === true && 
         'role' in context && 
         context.role === RoleType.ADMIN &&
         'lodge_id' in context;
}

export function isSuperAdminContext(context: AnyAuthContext): context is SuperAdminAuthContext {
  return context !== null && 
         'isLoggedIn' in context && 
         context.isLoggedIn === true && 
         'role' in context && 
         context.role === RoleType.SUPER_ADMIN;
}

export function isMemberContext(context: AnyAuthContext): context is MemberAuthContext {
  return context !== null && 
         'isLoggedIn' in context && 
         context.isLoggedIn === true && 
         'role' in context && 
         context.role === RoleType.MEMBER;
}

export function isLoggedIn(context: AnyAuthContext): context is 
  | AdminAuthContext 
  | SuperAdminAuthContext 
  | MemberAuthContext {
  return context !== null && 'isLoggedIn' in context && context.isLoggedIn === true;
}
