/**
 * Swagger Configuration - Auth Service Template
 * Estrutura pronta para documentar endpoints de autenticação
 * Copie e adapte este arquivo para cada novo serviço
 */

import { authServiceComponents, authServiceSchemas } from './components.js';

export const authServicePaths = {
  '/api/auth/oauth/authorize': {
    post: {
      summary: 'OAuth2 Authorize',
      description: 'Inicia fluxo de autorização OAuth2',
      operationId: 'authorizeOAuth2',
      tags: ['OAuth2'],
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: {
              type: 'object',
              required: ['client_id', 'redirect_uri', 'scope'],
              properties: {
                client_id: {
                  type: 'string',
                  description: 'ID da aplicação',
                },
                redirect_uri: {
                  type: 'string',
                  format: 'uri',
                  description: 'URL de redirecionamento',
                },
                scope: {
                  type: 'string',
                  description: 'Permissões solicitadas',
                  example: 'read write',
                },
                state: {
                  type: 'string',
                  description: 'CSRF token para validação',
                },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Autorização concedida',
        },
        '400': {
          description: 'Erro de validação',
        },
      },
    },
  },

  '/api/auth/token/validate': {
    get: {
      summary: 'Validate Token',
      description: 'Valida um token JWT',
      operationId: 'validateToken',
      tags: ['Tokens'],
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Token válido',
        },
        '401': {
          description: 'Token inválido ou expirado',
        },
      },
    },
  },
};

export { authServiceComponents, authServiceSchemas };

export const authServiceInfo = {
  title: 'Auth Service API',
  version: '1.0.0',
  description: 'API para gerenciamento de autenticação e autorização',
  contact: {
    name: 'API Support',
    email: 'api@masonica.org',
  },
};

export const authServiceServers = [
  {
    url: 'http://localhost:3001',
    description: 'Servidor de desenvolvimento',
  },
  {
    url: 'https://api.masonica.org',
    description: 'Servidor de produção',
  },
];

export const apiTags = [
  {
    name: 'OAuth2',
    description: 'Operações de autorização OAuth2',
  },
  {
    name: 'Tokens',
    description: 'Validação e gerenciamento de tokens JWT',
  },
];
