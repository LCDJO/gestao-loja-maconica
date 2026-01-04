/**
 * Endpoints de Emails - Communications Service
 */

export const emailsPaths = {
  '/api/communications/emails/send': {
    post: {
      summary: 'Enviar email',
      description: 'Envia um email para um ou mais destinatários',
      operationId: 'sendEmail',
      tags: ['Emails'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/SendEmailRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Email enviado com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/SendResult' },
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

  '/api/communications/emails': {
    get: {
      summary: 'Listar emails enviados',
      description: 'Retorna histórico de emails enviados',
      operationId: 'getEmailHistory',
      tags: ['Emails'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'status',
          in: 'query' as const,
          schema: {
            type: 'string',
            enum: ['sent', 'delivered', 'failed', 'bounce', 'spam'],
          },
        },
        {
          name: 'days_back',
          in: 'query' as const,
          schema: { type: 'number', default: 30 },
          description: 'Últimos N dias',
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
          description: 'Histórico retornado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'array',
                    items: { $ref: '#/components/schemas/Email' },
                  },
                  pagination: { type: 'object' },
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

  '/api/communications/emails/{id}': {
    get: {
      summary: 'Obter status do email',
      description: 'Retorna status e detalhes de um email específico',
      operationId: 'getEmailStatus',
      tags: ['Emails'],
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
          description: 'Email encontrado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/Email' },
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
};
