/**
 * Endpoints de Contas - Finances Service
 */

export const accountsPaths = {
  '/api/finances/accounts': {
    get: {
      summary: 'Listar contas',
      description: 'Retorna lista de todas as contas com saldos atualizados',
      operationId: 'getAccounts',
      tags: ['Contas'],
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Lista de contas retornada com sucesso',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AccountList' },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },

    post: {
      summary: 'Criar conta',
      description: 'Cria uma nova conta (requer perfil treasurer/admin)',
      operationId: 'createAccount',
      tags: ['Contas'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateAccountRequest' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Conta criada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  message: { type: 'string' },
                  data: { $ref: '#/components/schemas/Account' },
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

  '/api/finances/accounts/{id}': {
    get: {
      summary: 'Obter conta',
      description: 'Retorna detalhes de uma conta específica',
      operationId: 'getAccount',
      tags: ['Contas'],
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
          description: 'Conta encontrada',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/Account' },
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
      summary: 'Atualizar conta',
      description: 'Atualiza informações de uma conta',
      operationId: 'updateAccount',
      tags: ['Contas'],
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
                name: { type: 'string' },
                bank_name: { type: 'string' },
                account_number: { type: 'string' },
              },
            },
          },
        },
      },
      responses: {
        '200': {
          description: 'Conta atualizada com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/Account' },
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
      summary: 'Deletar conta',
      description: 'Remove uma conta',
      operationId: 'deleteAccount',
      tags: ['Contas'],
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
          description: 'Conta deletada com sucesso',
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

  '/api/finances/reports': {
    get: {
      summary: 'Gerar relatório financeiro',
      description: 'Retorna relatório consolidado com receitas, despesas e saldos',
      operationId: 'getFinancialReport',
      tags: ['Relatórios'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'month',
          in: 'query' as const,
          description: 'Mês do relatório (YYYY-MM)',
          schema: { type: 'string', format: 'date' },
        },
        {
          name: 'include_details',
          in: 'query' as const,
          description: 'Incluir transações detalhadas',
          schema: { type: 'boolean', default: false },
        },
      ],
      responses: {
        '200': {
          description: 'Relatório gerado com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/FinancialReport' },
                },
              },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },
};
