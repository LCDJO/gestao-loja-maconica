/**
 * Endpoints de Transações - Finances Service
 */

export const transactionsPaths = {
  '/api/finances/transactions': {
    get: {
      summary: 'Listar transações',
      description: 'Retorna lista paginada de transações com filtros opcionais',
      operationId: 'getTransactions',
      tags: ['Transações'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'type',
          in: 'query' as const,
          description: 'Filtrar por tipo (income, expense, transfer)',
          schema: {
            type: 'string',
            enum: ['income', 'expense', 'transfer'],
          },
        },
        {
          name: 'status',
          in: 'query' as const,
          description: 'Filtrar por status',
          schema: {
            type: 'string',
            enum: ['pending', 'confirmed', 'cancelled'],
          },
        },
        {
          name: 'start_date',
          in: 'query' as const,
          description: 'Data inicial (YYYY-MM-DD)',
          schema: { type: 'string', format: 'date' },
        },
        {
          name: 'end_date',
          in: 'query' as const,
          description: 'Data final (YYYY-MM-DD)',
          schema: { type: 'string', format: 'date' },
        },
        {
          name: 'page',
          in: 'query' as const,
          schema: { type: 'number', default: 1 },
        },
        {
          name: 'limit',
          in: 'query' as const,
          schema: { type: 'number', default: 20 },
        },
      ],
      responses: {
        '200': {
          description: 'Lista de transações retornada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TransactionList' },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },

    post: {
      summary: 'Criar transação',
      description: 'Cria uma nova transação (requer perfil treasurer/admin)',
      operationId: 'createTransaction',
      tags: ['Transações'],
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
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: { $ref: '#/components/schemas/Transaction' },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '403': { $ref: '#/components/responses/ForbiddenError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },

  '/api/finances/transactions/{id}': {
    get: {
      summary: 'Obter transação',
      description: 'Retorna detalhes de uma transação específica',
      operationId: 'getTransaction',
      tags: ['Transações'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path' as const,
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        '200': {
          description: 'Transação encontrada',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/Transaction' },
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

    put: {
      summary: 'Atualizar transação',
      description: 'Atualiza uma transação existente',
      operationId: 'updateTransaction',
      tags: ['Transações'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path' as const,
          required: true,
          schema: { type: 'string' },
        },
      ],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/UpdateTransactionRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Transação atualizada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/Transaction' },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '404': { $ref: '#/components/responses/NotFoundError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },

    delete: {
      summary: 'Deletar transação',
      description: 'Remove uma transação',
      operationId: 'deleteTransaction',
      tags: ['Transações'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'id',
          in: 'path' as const,
          required: true,
          schema: { type: 'string' },
        },
      ],
      responses: {
        '200': {
          description: 'Transação deletada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '403': { $ref: '#/components/responses/ForbiddenError' },
        '404': { $ref: '#/components/responses/NotFoundError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },
};
