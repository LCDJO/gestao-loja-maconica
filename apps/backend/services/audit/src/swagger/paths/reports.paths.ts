/**
 * Endpoints de Conformidade e Relatórios - Audit Service
 */

export const reportsPaths = {
  '/api/audit/compliance': {
    get: {
      summary: 'Relatório de conformidade',
      description: 'Gera relatório consolidado com métricas de auditoria e compliance',
      operationId: 'getComplianceReport',
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
          name: 'include_risk_assessment',
          in: 'query' as const,
          description: 'Incluir análise de risco',
          schema: { type: 'boolean', default: true },
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
                  data: { $ref: '#/components/schemas/ComplianceReport' },
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

  '/api/audit/stats': {
    get: {
      summary: 'Estatísticas de auditoria',
      description: 'Retorna estatísticas resumidas de logs e atividades',
      operationId: 'getAuditStats',
      tags: ['Relatórios'],
      security: [{ bearerAuth: [] }],
      responses: {
        '200': {
          description: 'Estatísticas retornadas',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  success: { type: 'boolean' },
                  data: { $ref: '#/components/schemas/AuditStats' },
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

  '/api/audit/export': {
    get: {
      summary: 'Exportar logs',
      description: 'Exporta logs de auditoria em formato CSV ou JSON',
      operationId: 'exportLogs',
      tags: ['Relatórios'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'format',
          in: 'query' as const,
          description: 'Formato de exportação',
          schema: {
            type: 'string',
            enum: ['csv', 'json', 'pdf'],
            default: 'csv',
          },
        },
        {
          name: 'type',
          in: 'query' as const,
          description: 'Tipo de log',
          schema: {
            type: 'string',
            enum: ['audit', 'access', 'all'],
            default: 'all',
          },
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
      ],
      responses: {
        '200': {
          description: 'Arquivo de exportação',
          content: {
            'text/csv': {
              schema: {
                type: 'string',
                format: 'binary',
              },
            },
            'application/json': {
              schema: {
                type: 'object',
              },
            },
            'application/pdf': {
              schema: {
                type: 'string',
                format: 'binary',
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

  '/api/audit/alerts': {
    get: {
      summary: 'Alertas de segurança',
      description: 'Retorna alertas de atividades suspeitas e anomalias',
      operationId: 'getSecurityAlerts',
      tags: ['Relatórios'],
      security: [{ bearerAuth: [] }],
      parameters: [
        {
          name: 'severity',
          in: 'query' as const,
          description: 'Filtrar por severidade',
          schema: {
            type: 'string',
            enum: ['low', 'medium', 'high'],
          },
        },
        {
          name: 'resolved',
          in: 'query' as const,
          description: 'Mostrar alertas resolvidos',
          schema: { type: 'boolean', default: false },
        },
      ],
      responses: {
        '200': {
          description: 'Alertas listados',
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
                        id: { type: 'string' },
                        title: { type: 'string' },
                        description: { type: 'string' },
                        severity: {
                          type: 'string',
                          enum: ['low', 'medium', 'high'],
                        },
                        created_at: { type: 'string', format: 'date-time' },
                        resolved: { type: 'boolean' },
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
