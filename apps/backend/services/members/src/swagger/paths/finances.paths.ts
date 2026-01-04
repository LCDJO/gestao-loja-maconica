/**
 * Swagger Paths - Finanças do Membro
 * GET /api/members/finances/balance
 * GET /api/members/finances/transactions
 * POST /api/members/finances/transactions
 */

export const financesPaths = {
  '/api/members/finances/balance': {
    get: {
      summary: 'Get Balance - Obter saldo do membro',
      description:
        'Retorna saldo total, contas pendentes e crédito disponível do membro autenticado.',
      operationId: 'getBalance',
      tags: ['Finanças'],
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Saldo do membro',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  data: { $ref: '#/components/schemas/BalanceResponse' },
                },
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '404': { $ref: '#/components/responses/NotFoundError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },

  '/api/members/finances/transactions': {
    get: {
      summary: 'Get Transactions - Listar transações',
      description:
        'Retorna lista paginada de transações do membro com filtros opcionais.',
      operationId: 'getTransactions',
      tags: ['Finanças'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'tipo',
          in: 'query',
          description: 'Filtrar por tipo de transação',
          schema: { type: 'string', enum: ['crédito', 'débito', 'taxa'] },
          example: 'crédito',
        },
        {
          name: 'status',
          in: 'query',
          description: 'Filtrar por status',
          schema: {
            type: 'string',
            enum: ['pendente', 'processando', 'concluída', 'cancelada'],
          },
          example: 'concluída',
        },
        {
          name: 'dataInicio',
          in: 'query',
          description: 'Data inicial (formato: YYYY-MM-DD)',
          schema: { type: 'string', format: 'date' },
          example: '2024-01-01',
        },
        {
          name: 'dataFim',
          in: 'query',
          description: 'Data final (formato: YYYY-MM-DD)',
          schema: { type: 'string', format: 'date' },
          example: '2024-01-31',
        },
        {
          name: 'page',
          in: 'query',
          description: 'Número da página (padrão: 1)',
          schema: { type: 'integer', minimum: 1 },
          example: 1,
        },
        {
          name: 'limit',
          in: 'query',
          description: 'Itens por página (padrão: 10, máximo: 100)',
          schema: { type: 'integer', minimum: 1, maximum: 100 },
          example: 10,
        },
      ],
      responses: {
        '200': {
          description: 'Lista de transações',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TransactionList' },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '400': { $ref: '#/components/responses/ValidationError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },

    post: {
      summary: 'Create Transaction - Criar transação',
      description:
        'Cria uma nova transação (requer permissão de tesoureiro ou admin).',
      operationId: 'createTransaction',
      tags: ['Finanças'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateTransactionRequest' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Transação criada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean', example: true },
                  message: {
                    type: 'string',
                    example: 'Transação criada com sucesso',
                  },
                  data: { $ref: '#/components/schemas/Transaction' },
                },
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '400': { $ref: '#/components/responses/ValidationError' },
        '403': {
          description: 'Permissão insuficiente (requer tesoureiro/admin)',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/ErrorResponse' },
            },
          },
        },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },
};
