/**
 * Endpoints de Notificações Push - Communications Service
 */

export const notificationsPaths = {
  '/api/communications/notifications/send': {
    post: {
      summary: 'Enviar notificação push',
      description: 'Envia notificação para dispositivos via OneSignal ou similar',
      operationId: 'sendPushNotification',
      tags: ['Notificações Push'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/SendPushNotificationRequest' },
          },
        },
      },
      responses: {
        '200': {
          description: 'Notificação enviada',
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

  '/api/communications/notifications': {
    get: {
      summary: 'Listar notificações enviadas',
      description: 'Histórico de notificações push',
      operationId: 'getNotificationHistory',
      tags: ['Notificações Push'],
      security: [{ bearerAuth: [] }],
      parameters: [
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
                    items: { $ref: '#/components/schemas/PushNotification' },
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

  '/api/communications/notifications/{id}': {
    get: {
      summary: 'Obter notificação',
      description: 'Detalhes de uma notificação específica',
      operationId: 'getNotification',
      tags: ['Notificações Push'],
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
          description: 'Notificação encontrada',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/PushNotification' },
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
