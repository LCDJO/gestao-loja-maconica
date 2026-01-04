/**
 * Swagger Configuration Index
 * Consolidates all paths, schemas, and responses
 * Exported para uso em src/index.ts
 */

import { authPaths } from './paths/auth.paths';
import { profilePaths } from './paths/profile.paths';
import { financesPaths } from './paths/finances.paths';
import { memberSchemas, commonResponses } from './components';

export const membersServicePaths = {
  ...authPaths,
  ...profilePaths,
  ...financesPaths,
};

export const membersServiceSchemas = memberSchemas;

export const membersServiceComponents = {
  schemas: memberSchemas,
  responses: commonResponses,
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT token obtido em /api/members/login. Formato: Bearer {token}',
    },
  },
};

export const membersServiceServers = [
  {
    url: 'http://localhost:3002',
    description: 'Ambiente de Desenvolvimento',
    variables: {
      basePath: {
        default: '/api/members',
      },
    },
  },
  {
    url: 'https://api.masonica.org',
    description: 'Ambiente de Produção',
    variables: {
      basePath: {
        default: '/api/members',
      },
    },
  },
];

export const membersServiceInfo = {
  title: 'Members Service API',
  version: '1.0.0',
  description:
    'API REST para gerenciamento de membros, autenticação e dados financeiros da loja maçônica',
  termsOfService: 'https://masonica.org/termos',
  contact: {
    name: 'API Support',
    email: 'api@masonica.org',
    url: 'https://masonica.org/support',
  },
  license: {
    name: 'MIT',
    url: 'https://opensource.org/licenses/MIT',
  },
  'x-logo': {
    url: 'https://masonica.org/logo.png',
    altText: 'Loja Maçônica Logo',
  },
};

// Tags para organizar endpoints na UI
export const apiTags = [
  {
    name: 'Autenticação',
    description: 'Operações de login, logout e refresh de tokens JWT',
    'x-displayName': 'Autenticação',
  },
  {
    name: 'Perfil',
    description: 'Operações relacionadas ao perfil do membro',
    'x-displayName': 'Perfil do Membro',
  },
  {
    name: 'Finanças',
    description: 'Consulta de saldo e transações financeiras',
    'x-displayName': 'Finanças & Transações',
  },
];
