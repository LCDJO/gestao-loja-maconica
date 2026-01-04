/**
 * Endpoints de Logs de Acesso - Audit Service
 */

export const accessLogsPaths = {
  '/api/audit/access': {
    get: {
      summary: 'Listar logs de acesso',
      description: 'Retorna histórico de logins, logouts e tentativas de acesso',
      operationId: 'getAccessLogs',
      tags: ['Logs de Acesso'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'action',
          in: 'query' as const,
          description: 'Filtrar por tipo de ação',
          schema: {
            type: 'string',
            enum: ['login', 'logout', 'access_denied', 'permission_denied'],
          },
        },
        {
          name: 'status',
          in: 'query' as const,
          description: 'Filtrar por status',
          schema: {
            type: 'string',
            enum: ['success', 'failed'],
          },
        },
        {
          name: 'user_email',
          in: 'query' as const,
          description: 'Filtrar por email do usuário',
          schema: { type: 'string' },
        },
        {
          name: 'ip_address',
          in: 'query' as const,
          description: 'Filtrar por IP',
          schema: { type: 'string' },
        },
        {
          name: 'start_date',
          in: 'query' as const,
          schema: { type: 'string', format: 'date' },
        },
        {
          name: 'end_date',
          in: 'query' as const,
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
          schema: { type: 'number', default: 50 },
        },
      ],
      responses: {
        '200': {
          description: 'Logs de acesso retornados',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AccessLogList' },
            },
          },
        },
        '400': { $ref: '#/components/responses/ValidationError' },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '403': { $ref: '#/components/responses/ForbiddenError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },

    post: {
      summary: 'Registrar acesso',
      description: 'Cria novo log de acesso ou tentativa de login',
      operationId: 'logAccess',
      tags: ['Logs de Acesso'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateAccessLogRequest' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Log de acesso registrado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/AccessLog' },
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

  '/api/audit/access/{id}': {
    get: {
      summary: 'Obter log de acesso',
      description: 'Retorna detalhes de um log de acesso',
      operationId: 'getAccessLog',
      tags: ['Logs de Acesso'],
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
          description: 'Log encontrado',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/AccessLog' },
                },
              },
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

  '/api/audit/access/suspicious': {
    get: {
      summary: 'Listar acessos suspeitos',
      description: 'Retorna tentativas de acesso falhadas e padrões suspeitos',
      operationId: 'getSuspiciousAccess',
      tags: ['Logs de Acesso'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'days_back',
          in: 'query' as const,
          schema: { type: 'number', default: 7 },
          description: 'Últimos N dias',
        },
        {
          name: 'min_failed_attempts',
          in: 'query' as const,
          schema: { type: 'number', default: 5 },
          description: 'Número mínimo de falhas',
        },
      ],
      responses: {
        '200': {
          description: 'Acessos suspeitos listados',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: {
                    type: 'array',
                    items: {
                      type: 'object',
                      properties: {
                        ip_address: { type: 'string' },
                        user_email: { type: 'string' },
                        failed_attempts: { type: 'number' },
                        last_attempt: { type: 'string', format: 'date-time' },
                        severity: {
                          type: 'string',
                          enum: ['low', 'medium', 'high'],
                        },
                      },
                    },
                  },
                },
              },
            },
          },
        },
        '401': { $ref: '#/components/responses/UnauthorizedError' },
        '403': { $ref: '#/components/responses/ForbiddenError' },
        '500': { $ref: '#/components/responses/ServerError' },
      },
    },
  },
};
