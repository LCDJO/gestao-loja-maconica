/**
 * Schemas e Componentes Compartilhados - Finances Service
 * Define todos os tipos de requisição, resposta e objetos comuns
 */

export const financesServiceSchemas = {
  // ===== REQUEST SCHEMAS =====
  CreateTransactionRequest: {
    type: 'object' as const,
    required: ['type', 'amount', 'description'],
    properties: {
      type: {
        type: 'string',
        enum: ['income', 'expense', 'transfer'],
        description: 'Tipo de transação',
        example: 'expense',
      },
      amount: {
        type: 'number',
        description: 'Valor da transação em reais',
        example: 150.50,
        minimum: 0.01,
      },
      description: {
        type: 'string',
        description: 'Descrição da transação',
        example: 'Pagamento de fatura mensal',
      },
      category: {
        type: 'string',
        description: 'Categoria da transação',
        example: 'Utilidades',
      },
      payment_method: {
        type: 'string',
        enum: ['credit_card', 'debit_card', 'transfer', 'cash', 'pix'],
        description: 'Método de pagamento',
        example: 'pix',
      },
      reference_date: {
        type: 'string',
        format: 'date',
        description: 'Data de referência da transação',
        example: '2026-01-03',
      },
    },
  },

  UpdateTransactionRequest: {
    type: 'object' as const,
    properties: {
      type: {
        type: 'string',
        enum: ['income', 'expense', 'transfer'],
        description: 'Tipo de transação',
      },
      amount: {
        type: 'number',
        description: 'Valor da transação',
        minimum: 0.01,
      },
      description: {
        type: 'string',
        description: 'Descrição da transação',
      },
      category: {
        type: 'string',
        description: 'Categoria da transação',
      },
      status: {
        type: 'string',
        enum: ['pending', 'confirmed', 'cancelled'],
        description: 'Status da transação',
      },
    },
  },

  CreateBillRequest: {
    type: 'object' as const,
    required: ['title', 'amount', 'due_date'],
    properties: {
      title: {
        type: 'string',
        description: 'Título da fatura',
        example: 'Fatura de Manutenção - Janeiro 2026',
      },
      amount: {
        type: 'number',
        description: 'Valor da fatura',
        example: 500.00,
        minimum: 0.01,
      },
      due_date: {
        type: 'string',
        format: 'date',
        description: 'Data de vencimento',
        example: '2026-01-31',
      },
      description: {
        type: 'string',
        description: 'Descrição da fatura',
        example: 'Manutenção predial e reparos',
      },
      category: {
        type: 'string',
        description: 'Categoria da fatura',
        example: 'Manutenção',
      },
    },
  },

  CreateAccountRequest: {
    type: 'object' as const,
    required: ['name', 'type', 'initial_balance'],
    properties: {
      name: {
        type: 'string',
        description: 'Nome da conta',
        example: 'Caixa Principal',
      },
      type: {
        type: 'string',
        enum: ['checking', 'savings', 'cash'],
        description: 'Tipo de conta',
        example: 'checking',
      },
      initial_balance: {
        type: 'number',
        description: 'Saldo inicial',
        example: 1000.00,
      },
      bank_name: {
        type: 'string',
        description: 'Nome do banco',
        example: 'Banco do Brasil',
      },
      account_number: {
        type: 'string',
        description: 'Número da conta',
        example: '123456-7',
      },
    },
  },

  // ===== RESPONSE SCHEMAS =====
  Transaction: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'string',
        description: 'ID único da transação',
        example: '550e8400-e29b-41d4-a716-446655440000',
      },
      type: {
        type: 'string',
        enum: ['income', 'expense', 'transfer'],
        description: 'Tipo de transação',
      },
      amount: {
        type: 'number',
        description: 'Valor',
      },
      description: {
        type: 'string',
        description: 'Descrição',
      },
      category: {
        type: 'string',
        description: 'Categoria',
      },
      payment_method: {
        type: 'string',
        description: 'Método de pagamento',
      },
      status: {
        type: 'string',
        enum: ['pending', 'confirmed', 'cancelled'],
        description: 'Status',
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        description: 'Data de criação',
      },
      updated_at: {
        type: 'string',
        format: 'date-time',
        description: 'Data de atualização',
      },
    },
  },

  Bill: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'string',
        description: 'ID único da fatura',
      },
      title: {
        type: 'string',
        description: 'Título',
      },
      amount: {
        type: 'number',
        description: 'Valor',
      },
      due_date: {
        type: 'string',
        format: 'date',
        description: 'Data de vencimento',
      },
      status: {
        type: 'string',
        enum: ['pending', 'overdue', 'paid', 'cancelled'],
        description: 'Status',
      },
      category: {
        type: 'string',
        description: 'Categoria',
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        description: 'Data de criação',
      },
    },
  },

  Account: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'string',
        description: 'ID único da conta',
      },
      name: {
        type: 'string',
        description: 'Nome da conta',
      },
      type: {
        type: 'string',
        enum: ['checking', 'savings', 'cash'],
        description: 'Tipo de conta',
      },
      balance: {
        type: 'number',
        description: 'Saldo atual',
      },
      bank_name: {
        type: 'string',
        description: 'Nome do banco',
      },
      account_number: {
        type: 'string',
        description: 'Número da conta',
      },
      created_at: {
        type: 'string',
        format: 'date-time',
        description: 'Data de criação',
      },
    },
  },

  FinancialReport: {
    type: 'object' as const,
    properties: {
      period: {
        type: 'string',
        description: 'Período do relatório',
        example: '2026-01',
      },
      total_income: {
        type: 'number',
        description: 'Total de receitas',
      },
      total_expense: {
        type: 'number',
        description: 'Total de despesas',
      },
      net_balance: {
        type: 'number',
        description: 'Saldo líquido',
      },
      accounts: {
        type: 'array',
        items: { $ref: '#/components/schemas/Account' },
        description: 'Contas envolvidas',
      },
      by_category: {
        type: 'object',
        description: 'Agrupado por categoria',
        additionalProperties: {
          type: 'number',
        },
      },
    },
  },

  TransactionList: {
    type: 'object' as const,
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Transaction' },
      },
      pagination: {
        type: 'object',
        properties: {
          total: { type: 'number' },
          page: { type: 'number' },
          limit: { type: 'number' },
          pages: { type: 'number' },
        },
      },
    },
  },

  BillList: {
    type: 'object' as const,
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Bill' },
      },
      pagination: {
        type: 'object',
        properties: {
          total: { type: 'number' },
          page: { type: 'number' },
          limit: { type: 'number' },
          pages: { type: 'number' },
        },
      },
      summary: {
        type: 'object',
        properties: {
          total_pending: { type: 'number' },
          total_overdue: { type: 'number' },
          total_amount: { type: 'number' },
        },
      },
    },
  },

  AccountList: {
    type: 'object' as const,
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Account' },
      },
      total_balance: {
        type: 'number',
        description: 'Saldo total de todas as contas',
      },
    },
  },

  // ===== COMMON RESPONSES =====
  SuccessResponse: {
    type: 'object' as const,
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string' },
    },
  },

  ErrorResponse: {
    type: 'object' as const,
    properties: {
      success: { type: 'boolean', example: false },
      error: { type: 'string' },
      code: { type: 'string' },
    },
  },
};

export const financesServiceResponses = {
  UnauthorizedError: {
    description: 'Token inválido ou expirado',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Unauthorized: Token invalid or expired' },
          },
        },
      },
    },
  },

  ForbiddenError: {
    description: 'Permissão insuficiente para operação',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Forbidden: Only treasurer or admin can perform this action' },
          },
        },
      },
    },
  },

  ValidationError: {
    description: 'Erro de validação nos dados enviados',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Validation error' },
            details: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  field: { type: 'string' },
                  message: { type: 'string' },
                },
              },
            },
          },
        },
      },
    },
  },

  NotFoundError: {
    description: 'Recurso não encontrado',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Not found' },
          },
        },
      },
    },
  },

  ServerError: {
    description: 'Erro interno do servidor',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Internal server error' },
          },
        },
      },
    },
  },
};
