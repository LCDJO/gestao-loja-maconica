/**
 * Endpoints de Logs de Auditoria - Audit Service
 */

export const auditLogsPaths = {
  '/api/audit/logs': {
    get: {
      summary: 'Listar logs de auditoria',
      description: 'Retorna lista paginada de todos os logs de auditoria com filtros',
      operationId: 'getAuditLogs',
      tags: ['Logs de Auditoria'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'action',
          in: 'query' as const,
          description: 'Filtrar por tipo de ação',
          schema: {
            type: 'string',
            enum: ['create', 'read', 'update', 'delete', 'export', 'login', 'logout'],
          },
        },
        {
          name: 'resource_type',
          in: 'query' as const,
          description: 'Filtrar por tipo de recurso',
          schema: {
            type: 'string',
            enum: ['member', 'transaction', 'bill', 'account', 'email', 'document', 'settings'],
          },
        },
        {
          name: 'user_id',
          in: 'query' as const,
          description: 'Filtrar por ID do usuário',
          schema: { type: 'string' },
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
          schema: { type: 'number', default: 50 },
        },
        {
          name: 'sort_by',
          in: 'query' as const,
          description: 'Ordenar por (timestamp, action, user_email)',
          schema: { type: 'string', default: 'timestamp' },
        },
      ],
      responses: {
        '200': {
          description: 'Lista de logs retornada',
          content: {
            'application/json': {
              schema: { $ref: '#/components/schemas/AuditLogList' },
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
      summary: 'Registrar novo log',
      description: 'Cria novo registro de auditoria',
      operationId: 'createAuditLog',
      tags: ['Logs de Auditoria'],
      security: [{ bearerAuth: [] }],
      requestBody: {
        required: true,
        content: {
          'application/json': {
            schema: { $ref: '#/components/schemas/CreateAuditLogRequest' },
          },
        },
      },
      responses: {
        '201': {
          description: 'Log criado com sucesso',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/AuditLog' },
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

  '/api/audit/logs/{id}': {
    get: {
      summary: 'Obter log específico',
      description: 'Retorna detalhes de um log de auditoria',
      operationId: 'getAuditLog',
      tags: ['Logs de Auditoria'],
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
                  data: { $ref: '#/components/schemas/AuditLog' },
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
};
