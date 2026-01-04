/**
 * Endpoints de Faturas - Finances Service
 */

export const billsPaths = {
  '/api/finances/bills': {
    get: {
      summary: 'Listar faturas',
      description: 'Retorna lista paginada de faturas com filtros opcionais',
      operationId: 'getBills',
      tags: ['Faturas'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'status',
          in: 'query' as const,
          description: 'Filtrar por status (pending, overdue, paid, cancelled)',
          schema: {
            type: 'string',
            enum: ['pending', 'overdue', 'paid', 'cancelled'],
          },
        },
        {
          name: 'category',
          in: 'query' as const,
          description: 'Filtrar por categoria',
          schema: { type: 'string' },
        },
        {
          name: 'sort_by',
          in: 'query' as const,
          description: 'Ordenar por (due_date, amount, created_at)',
          schema: {
            type: 'string',
            enum: ['due_date', 'amount', 'created_at'],
            default: 'due_date',
          },
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
          description: 'Lista de faturas retornada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/BillList' },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },

    post: {
      summary: 'Criar fatura',
      description: 'Cria uma nova fatura (requer perfil treasurer/admin)',
      operationId: 'createBill',
      tags: ['Faturas'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateBillRequest' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Fatura criada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: { $ref: '#/components/schemas/Bill' },
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

  '/api/finances/bills/{id}': {
    get: {
      summary: 'Obter fatura',
      description: 'Retorna detalhes de uma fatura específica',
      operationId: 'getBill',
      tags: ['Faturas'],
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
          description: 'Fatura encontrada',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/Bill' },
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
      summary: 'Atualizar fatura',
      description: 'Atualiza status ou detalhes de uma fatura',
      operationId: 'updateBill',
      tags: ['Faturas'],
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
            schema: {
              type: 'object',
              properties: {
                status: {
                  type: 'string',
                  enum: ['pending', 'overdue', 'paid', 'cancelled'],
                },
                amount: { type: 'number' },
                due_date: { type: 'string', format: 'date' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Fatura atualizada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/Bill' },
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
      summary: 'Deletar fatura',
      description: 'Remove uma fatura',
      operationId: 'deleteBill',
      tags: ['Faturas'],
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
          description: 'Fatura deletada com sucesso',
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
