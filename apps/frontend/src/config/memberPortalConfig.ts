/**
 * Portal do Irmão - Estrutura de Configuração
 * Define itens de menu, metadados e endpoints da API
 */

export interface MemberPortalMenuItem {
  id: string;
  label: string;
  href: string;
  icon: string;
  description: string;
}

export interface MemberPortalConfig {
  name: string;
  version: string;
  description: string;
  apiBaseUrl: string;
  menuItems: MemberPortalMenuItem[];
  features: {
    personalData: boolean;
    financialHistory: boolean;
    documents: boolean;
    attendance: boolean;
  };
}

/**
 * Configuração principal do Portal do Irmão
 */
export const memberPortalConfig: MemberPortalConfig = {
  name: "Portal do Irmão",
  version: "1.0.0",
  description: "Portal de auto-atendimento para membros da Loja Maçônica",
  apiBaseUrl: process.env.REACT_APP_API_URL || "http://localhost:3002/api",

  menuItems: [
    {
      id: "dashboard",
      label: "Dashboard",
      href: "/member-portal/dashboard",
      icon: "📊",
      description: "Visão geral e informações principais",
    },
    {
      id: "personal-data",
      label: "Meus Dados",
      href: "/member-portal/personal-data",
      icon: "👤",
      description: "Informações pessoais e contato",
    },
    {
      id: "financial",
      label: "Histórico Financeiro",
      href: "/member-portal/financial-history",
      icon: "💰",
      description: "Transações e saldo financeiro",
    },
    {
      id: "documents",
      label: "Documentos",
      href: "/member-portal/documents",
      icon: "📄",
      description: "Atas e documentos da Loja",
    },
    {
      id: "attendance",
      label: "Histórico de Presença",
      href: "/member-portal/attendance",
      icon: "✓",
      description: "Registro de presença em sessões",
    },
  ],

  features: {
    personalData: true,
    financialHistory: true,
    documents: true,
    attendance: true,
  },
};

/**
 * Endpoints da API do Portal
 */
export const memberPortalApiEndpoints = {
  auth: {
    login: "/members/login",
    logout: "/members/logout",
    refresh: "/members/refresh",
    verify: "/members/verify",
  },
  members: {
    profile: "/members/profile",
    updateProfile: "/members/profile/update",
    passwordChange: "/members/password",
  },
  finances: {
    balance: "/members/finances/balance",
    transactions: "/members/finances/transactions",
    statements: "/members/finances/statements",
  },
  documents: {
    list: "/members/documents",
    download: "/members/documents/:id/download",
    view: "/members/documents/:id",
  },
  attendance: {
    history: "/members/attendance",
    details: "/members/attendance/:sessionId",
  },
  sessions: {
    upcoming: "/members/sessions/upcoming",
    list: "/members/sessions",
  },
} as const;

/**
 * Utilitários para Portal do Irmão
 */
export const memberPortalUtils = {
  getMenuItemById: (id: string) => {
    return memberPortalConfig.menuItems.find((item) => item.id === id);
  },

  getMenuItemByHref: (href: string) => {
    return memberPortalConfig.menuItems.find((item) => item.href === href);
  },

  isPortalRoute: (pathname: string) => {
    return pathname.startsWith("/member-portal") || pathname.startsWith("/member/login");
  },

  getApiUrl: (endpoint: string) => {
    return `${memberPortalConfig.apiBaseUrl}${endpoint}`;
  },
};
