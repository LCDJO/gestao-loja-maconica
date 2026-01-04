/**
 * Endpoints de WhatsApp - Communications Service
 */

export const whatsappPaths = {
  '/api/communications/whatsapp/send': {
    post: {
      summary: 'Enviar mensagem WhatsApp',
      description: 'Envia mensagem via WhatsApp usando Evolution API',
      operationId: 'sendWhatsAppMessage',
      tags: ['WhatsApp'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/SendWhatsAppRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Mensagem enviada',
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

  '/api/communications/whatsapp/status': {
    get: {
      summary: 'Verificar status WhatsApp',
      description: 'Verifica se a conexão WhatsApp está ativa',
      operationId: 'checkWhatsAppStatus',
      tags: ['WhatsApp'],
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Status retornado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  connected: { type: 'boolean' },
                  phone_number: { type: 'string' },
                  last_sync: { type: 'string', format: 'date-time' },
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
