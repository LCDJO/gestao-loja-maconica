/**
 * Endpoints de Templates - Communications Service
 */

export const templatesPaths = {
  '/api/communications/templates': {
    get: {
      summary: 'Listar templates',
      description: 'Retorna lista de templates disponíveis',
      operationId: 'getTemplates',
      tags: ['Templates'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'type',
          in: 'query' as const,
          schema: {
            type: 'string',
            enum: ['email', 'push', 'whatsapp', 'sms'],
          },
        },
        {
          name: 'page',
          in: 'query' as const,
          schema: { type: 'number', default: 1 },
        },
      ],
      responses: {
        '200': {
          description: 'Lista de templates',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/TemplateList' },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },

    post: {
      summary: 'Criar template',
      description: 'Cria novo template de comunicação',
      operationId: 'createTemplate',
      tags: ['Templates'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateTemplateRequest' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Template criado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/Template' },
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

  '/api/communications/templates/{id}': {
    get: {
      summary: 'Obter template',
      description: 'Retorna detalhes de um template',
      operationId: 'getTemplate',
      tags: ['Templates'],
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
          description: 'Template encontrado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/Template' },
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
      summary: 'Atualizar template',
      description: 'Atualiza um template existente',
      operationId: 'updateTemplate',
      tags: ['Templates'],
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
            schema: { $ref: '#/components/schemas/CreateTemplateRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Template atualizado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/Template' },
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
      summary: 'Deletar template',
      description: 'Remove um template',
      operationId: 'deleteTemplate',
      tags: ['Templates'],
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
          description: 'Template deletado',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/SuccessResponse' },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '404': { $ref: '#/components/responses/NotFoundError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },

  '/api/communications/logs': {
    get: {
      summary: 'Histórico de comunicações',
      description: 'Log de todos os envios (emails, push, WhatsApp, SMS)',
      operationId: 'getCommunicationLogs',
      tags: ['Logs'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'type',
          in: 'query' as const,
          schema: {
            type: 'string',
            enum: ['email', 'push', 'whatsapp', 'sms'],
          },
        },
        {
          name: 'status',
          in: 'query' as const,
          schema: {
            type: 'string',
            enum: ['pending', 'sent', 'delivered', 'failed'],
          },
        },
        {
          name: 'days_back',
          in: 'query' as const,
          schema: { type: 'number', default: 7 },
        },
        {
          name: 'page',
          in: 'query' as const,
          schema: { type: 'number', default: 1 },
        },
      ],
      responses: {
        '200': {
          description: 'Histórico retornado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/CommunicationLog' },
                  },
                },
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },
};
