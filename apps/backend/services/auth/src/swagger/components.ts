/**
 * Swagger Components - Auth Service
 * Define schemas, security schemes e componentes reutilizáveis
 */

export const authServiceSchemas = {
  User: {
    type: 'object',
    required: ['id', 'email'],
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'ID único do usuário',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do usuário',
      },
      name: {
        type: 'string',
        description: 'Nome completo do usuário',
      },
      role: {
        type: 'string',
        enum: ['admin', 'member', 'guest'],
        description: 'Papel do usuário',
      },
      createdAt: {
        type: 'string',
        format: 'date-time',
        description: 'Data de criação',
      },
    },
  },

  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do usuário',
        example: 'usuario@masonica.org',
      },
      password: {
        type: 'string',
        format: 'password',
        description: 'Senha da conta',
        minLength: 6,
      },
    },
  },

  TokenResponse: {
    type: 'object',
    required: ['accessToken', 'refreshToken'],
    properties: {
      accessToken: {
        type: 'string',
        description: 'JWT token de acesso (válido por 24h)',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      refreshToken: {
        type: 'string',
        description: 'Token para renovar acesso (válido por 7d)',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
      expiresIn: {
        type: 'number',
        description: 'Tempo de expiração em segundos',
        example: 86400,
      },
    },
  },

  AuthResponse: {
    type: 'object',
    required: ['success', 'data'],
    properties: {
      success: {
        type: 'boolean',
        description: 'Indica sucesso da operação',
      },
      data: {
        $ref: '#/components/schemas/User',
      },
      error: {
        type: 'string',
        description: 'Mensagem de erro (se houver)',
      },
    },
  },

  ErrorResponse: {
    type: 'object',
    required: ['success', 'error'],
    properties: {
      success: {
        type: 'boolean',
        example: false,
      },
      error: {
        type: 'string',
        description: 'Descrição do erro',
        example: 'Credenciais inválidas',
      },
      statusCode: {
        type: 'number',
        description: 'Código HTTP',
        example: 401,
      },
    },
  },

  RefreshTokenRequest: {
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: {
        type: 'string',
        description: 'Token de renovação',
      },
    },
  },
};

export const authServiceComponents = {
  schemas: authServiceSchemas,
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT token obtido após login',
    },
  },
};
