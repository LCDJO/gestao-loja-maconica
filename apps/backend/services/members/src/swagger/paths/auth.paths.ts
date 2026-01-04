/**
 * Swagger Paths - Autenticação
 * POST /api/members/login
 * POST /api/members/logout
 * POST /api/members/refresh
 * GET /api/members/verify
 */

export const authPaths = {
  '/api/members/login': {
    post: {
      summary: 'Login - Autenticar membro',
      description:
        'Realiza autenticação com email e senha. Retorna tokens JWT (access e refresh).',
      operationId: 'loginMember',
      tags: ['Autenticação'],
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/LoginRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Login bem-sucedido',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginResponse' },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '400': { $ref: '#/components/responses/ValidationError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },

  '/api/members/logout': {
    post: {
      summary: 'Logout - Encerrar sessão',
      description: 'Revoga o access token e encerra a sessão do membro.',
      operationId: 'logoutMember',
      tags: ['Autenticação'],
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Logout realizado com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },

  '/api/members/refresh': {
    post: {
      summary: 'Refresh Token - Renovar tokens',
      description:
        'Renova o access token usando o refresh token. O refresh token também é renovado.',
      operationId: 'refreshTokens',
      tags: ['Autenticação'],
      security: [],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/RefreshTokenRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Tokens renovados com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/LoginResponse' },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '400': { $ref: '#/components/responses/ValidationError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },

  '/api/members/verify': {
    get: {
      summary: 'Verify Token - Validar token JWT',
      description: 'Valida se o token JWT enviado é válido e não está expirado.',
      operationId: 'verifyToken',
      tags: ['Autenticação'],
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Token válido',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },
};
