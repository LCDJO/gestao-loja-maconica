/**
 * Swagger Components - Schemas reutilizáveis
 * Organizados por entidade/feature
 */

export const memberSchemas = {
  // ===== REQUEST SCHEMAS =====
  LoginRequest: {
    type: 'object',
    required: ['email', 'password'],
    properties: {
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do membro',
        example: 'joao@masonica.org',
      },
      password: {
        type: 'string',
        minLength: 6,
        description: 'Senha (mínimo 6 caracteres)',
        example: 'senha123456',
      },
    },
  },

  RefreshTokenRequest: {
    type: 'object',
    required: ['refreshToken'],
    properties: {
      refreshToken: {
        type: 'string',
        description: 'Refresh token recebido no login',
        example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
      },
    },
  },

  UpdateProfileRequest: {
    type: 'object',
    properties: {
      nome: {
        type: 'string',
        description: 'Nome completo',
        example: 'João da Silva Santos',
      },
      telefone: {
        type: 'string',
        description: 'Telefone com DDD',
        example: '(11) 98765-4321',
      },
      endereco: {
        type: 'string',
        description: 'Endereço completo',
        example: 'Rua das Flores, 123',
      },
      cidade: {
        type: 'string',
        description: 'Cidade',
        example: 'São Paulo',
      },
    },
  },

  ChangePasswordRequest: {
    type: 'object',
    required: ['senhaAtual', 'novaSenha'],
    properties: {
      senhaAtual: {
        type: 'string',
        minLength: 6,
        description: 'Senha atual para validação',
        example: 'senha123456',
      },
      novaSenha: {
        type: 'string',
        minLength: 6,
        description: 'Nova senha (mínimo 6 caracteres)',
        example: 'novaSenha789',
      },
    },
  },

  CreateTransactionRequest: {
    type: 'object',
    required: ['tipo', 'valor', 'descricao'],
    properties: {
      tipo: {
        type: 'string',
        enum: ['crédito', 'débito', 'taxa'],
        description: 'Tipo de transação',
        example: 'crédito',
      },
      valor: {
        type: 'number',
        format: 'float',
        minimum: 0.01,
        description: 'Valor da transação',
        example: 150.50,
      },
      descricao: {
        type: 'string',
        description: 'Descrição da transação',
        example: 'Pagamento de mensalidade',
      },
      referencia: {
        type: 'string',
        description: 'Referência interna/externa',
        example: 'DOC-2024-001',
      },
    },
  },

  // ===== RESPONSE SCHEMAS =====
  LoginResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Login realizado com sucesso' },
      data: {
        type: 'object',
        properties: {
          accessToken: {
            type: 'string',
            description: 'JWT token para requisições (expira em 24h)',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          refreshToken: {
            type: 'string',
            description: 'Token para renovação (expira em 7d)',
            example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
          },
          user: { $ref: '#/components/schemas/UserProfile' },
        },
      },
    },
  },

  UserProfile: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'ID do membro',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      },
      email: {
        type: 'string',
        format: 'email',
        description: 'Email do membro',
        example: 'joao@masonica.org',
      },
      nome: {
        type: 'string',
        description: 'Nome completo',
        example: 'João da Silva Santos',
      },
      telefone: {
        type: 'string',
        description: 'Telefone com DDD',
        example: '(11) 98765-4321',
      },
      endereco: {
        type: 'string',
        description: 'Endereço completo',
        example: 'Rua das Flores, 123',
      },
      cidade: {
        type: 'string',
        description: 'Cidade',
        example: 'São Paulo',
      },
      dataCadastro: {
        type: 'string',
        format: 'date-time',
        description: 'Data de cadastro',
        example: '2024-01-03T10:30:00Z',
      },
    },
  },

  Transaction: {
    type: 'object',
    properties: {
      id: {
        type: 'string',
        format: 'uuid',
        description: 'ID da transação',
        example: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
      },
      tipo: {
        type: 'string',
        enum: ['crédito', 'débito', 'taxa'],
        description: 'Tipo de transação',
        example: 'crédito',
      },
      valor: {
        type: 'number',
        format: 'float',
        description: 'Valor da transação',
        example: 150.50,
      },
      descricao: {
        type: 'string',
        description: 'Descrição',
        example: 'Pagamento de mensalidade',
      },
      status: {
        type: 'string',
        enum: ['pendente', 'processando', 'concluída', 'cancelada'],
        description: 'Status da transação',
        example: 'concluída',
      },
      data: {
        type: 'string',
        format: 'date-time',
        description: 'Data da transação',
        example: '2024-01-03T10:30:00Z',
      },
    },
  },

  BalanceResponse: {
    type: 'object',
    properties: {
      saldoTotal: {
        type: 'number',
        format: 'float',
        description: 'Saldo total atual',
        example: 1500.50,
      },
      contasPendentes: {
        type: 'number',
        format: 'float',
        description: 'Valor de contas pendentes',
        example: 300.00,
      },
      creditoDisponivel: {
        type: 'number',
        format: 'float',
        description: 'Crédito disponível',
        example: 2000.00,
      },
    },
  },

  TransactionList: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      data: {
        type: 'object',
        properties: {
          items: {
            type: 'array',
            items: { $ref: '#/components/schemas/Transaction' },
          },
          total: { type: 'integer', example: 42 },
          page: { type: 'integer', example: 1 },
          limit: { type: 'integer', example: 10 },
        },
      },
    },
  },

  SuccessResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string', example: 'Operação realizada com sucesso' },
      data: { type: 'object' },
    },
  },

  ErrorResponse: {
    type: 'object',
    properties: {
      success: { type: 'boolean', example: false },
      error: { type: 'string', example: 'Email ou senha inválidos' },
      code: {
        type: 'string',
        description: 'Código do erro para tratamento no cliente',
        example: 'INVALID_CREDENTIALS',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
        example: '2024-01-03T10:30:00Z',
      },
    },
  },
};

export const commonResponses = {
  UnauthorizedError: {
    description: 'Token ausente, inválido ou expirado',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          error: 'Token ausente ou inválido',
          code: 'INVALID_TOKEN',
          timestamp: '2024-01-03T10:30:00Z',
        },
      },
    },
  },

  ValidationError: {
    description: 'Erro de validação nos parâmetros enviados',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          error: 'Email inválido',
          code: 'VALIDATION_ERROR',
          timestamp: '2024-01-03T10:30:00Z',
        },
      },
    },
  },

  NotFoundError: {
    description: 'Recurso não encontrado',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          error: 'Membro não encontrado',
          code: 'NOT_FOUND',
          timestamp: '2024-01-03T10:30:00Z',
        },
      },
    },
  },

  ServerError: {
    description: 'Erro interno do servidor',
    content: {
      'application/json': {
        schema: { $ref: '#/components/schemas/ErrorResponse' },
        example: {
          success: false,
          error: 'Erro ao processar requisição',
          code: 'INTERNAL_ERROR',
          timestamp: '2024-01-03T10:30:00Z',
        },
      },
    },
  },
};
