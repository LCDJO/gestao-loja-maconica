/**
 * Schemas e Componentes Compartilhados - Audit Service
 * Define tipos para logs de auditoria, atividades e acesso
 */

export const auditServiceSchemas = {
  // ===== REQUEST SCHEMAS =====
  CreateAuditLogRequest: {
    type: 'object' as const,
    required: ['action', 'resource_type', 'resource_id'],
    properties: {
      action: {
        type: 'string',
        enum: ['create', 'read', 'update', 'delete', 'export', 'login', 'logout'],
        description: 'Tipo de ação realizada',
        example: 'update',
      },
      resource_type: {
        type: 'string',
        description: 'Tipo de recurso',
        example: 'member',
        enum: ['member', 'transaction', 'bill', 'account', 'email', 'document', 'settings'],
      },
      resource_id: {
        type: 'string',
        description: 'ID do recurso afetado',
        example: '550e8400-e29b-41d4-a716-446655440000',
      },
      description: {
        type: 'string',
        description: 'Descrição detalhada',
        example: 'Atualizou dados de filiação',
      },
      changes: {
        type: 'object',
        description: 'O que foi alterado (antes/depois)',
        additionalProperties: {
          type: 'object',
          properties: {
            before: { type: 'string' },
            after: { type: 'string' },
          },
        },
        example: {
          email: { before: 'joao@old.com', after: 'joao@new.com' },
          status: { before: 'inactive', after: 'active' },
        },
      },
      ip_address: {
        type: 'string',
        description: 'IP de origem',
        example: '192.168.1.100',
      },
      user_agent: {
        type: 'string',
        description: 'Browser/client info',
      },
    },
  },

  CreateAccessLogRequest: {
    type: 'object' as const,
    required: ['action', 'resource'],
    properties: {
      action: {
        type: 'string',
        enum: ['login', 'logout', 'access_denied', 'permission_denied'],
        description: 'Tipo de acesso',
      },
      resource: {
        type: 'string',
        description: 'Recurso acessado',
        example: '/admin/members',
      },
      status: {
        type: 'string',
        enum: ['success', 'failed'],
        description: 'Resultado da tentativa',
      },
      ip_address: {
        type: 'string',
        description: 'IP de origem',
      },
      user_agent: {
        type: 'string',
        description: 'User agent',
      },
      error_message: {
        type: 'string',
        description: 'Mensagem de erro (se falhou)',
      },
    },
  },

  // ===== RESPONSE SCHEMAS =====
  AuditLog: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'string',
        description: 'ID único do log',
      },
      action: {
        type: 'string',
        enum: ['create', 'read', 'update', 'delete', 'export', 'login', 'logout'],
      },
      resource_type: {
        type: 'string',
      },
      resource_id: {
        type: 'string',
      },
      user_id: {
        type: 'string',
        description: 'ID do usuário que fez a ação',
      },
      user_email: {
        type: 'string',
      },
      user_role: {
        type: 'string',
        enum: ['admin', 'treasurer', 'secretary', 'member'],
      },
      description: {
        type: 'string',
      },
      changes: {
        type: 'object',
        additionalProperties: {
          type: 'object',
          properties: {
            before: { type: 'string' },
            after: { type: 'string' },
          },
        },
      },
      ip_address: {
        type: 'string',
      },
      user_agent: {
        type: 'string',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
      },
      created_at: {
        type: 'string',
        format: 'date-time',
      },
    },
  },

  AccessLog: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'string',
      },
      user_id: {
        type: 'string',
      },
      user_email: {
        type: 'string',
      },
      action: {
        type: 'string',
        enum: ['login', 'logout', 'access_denied', 'permission_denied'],
      },
      resource: {
        type: 'string',
      },
      status: {
        type: 'string',
        enum: ['success', 'failed'],
      },
      ip_address: {
        type: 'string',
      },
      user_agent: {
        type: 'string',
      },
      error_message: {
        type: 'string',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
      },
    },
  },

  AuditLogList: {
    type: 'object' as const,
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/AuditLog' },
      },
      pagination: {
        type: 'object',
        properties: {
          total: { type: 'number' },
          page: { type: 'number' },
          limit: { type: 'number' },
          pages: { type: 'number' },
        },
      },
      summary: {
        type: 'object',
        properties: {
          total_records: { type: 'number' },
          period: { type: 'string' },
          actions_by_type: { type: 'object' },
        },
      },
    },
  },

  AccessLogList: {
    type: 'object' as const,
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/AccessLog' },
      },
      pagination: {
        type: 'object',
        properties: {
          total: { type: 'number' },
          page: { type: 'number' },
          limit: { type: 'number' },
        },
      },
      summary: {
        type: 'object',
        properties: {
          successful_logins: { type: 'number' },
          failed_attempts: { type: 'number' },
          unique_users: { type: 'number' },
        },
      },
    },
  },

  ComplianceReport: {
    type: 'object' as const,
    properties: {
      period: {
        type: 'string',
        description: 'Período do relatório',
        example: '2026-01',
      },
      total_actions: {
        type: 'number',
      },
      total_access_attempts: {
        type: 'number',
      },
      failed_attempts: {
        type: 'number',
      },
      risk_events: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            event: { type: 'string' },
            count: { type: 'number' },
            severity: {
              type: 'string',
              enum: ['low', 'medium', 'high'],
            },
          },
        },
      },
      active_users: {
        type: 'number',
      },
      actions_by_type: {
        type: 'object',
        additionalProperties: { type: 'number' },
      },
    },
  },

  AuditStats: {
    type: 'object' as const,
    properties: {
      total_logs: { type: 'number' },
      logs_last_7_days: { type: 'number' },
      logs_last_30_days: { type: 'number' },
      unique_users: { type: 'number' },
      total_resources_modified: { type: 'number' },
      recent_critical_actions: {
        type: 'array',
        items: { $ref: '#/components/schemas/AuditLog' },
      },
    },
  },

  // ===== COMMON RESPONSES =====
  SuccessResponse: {
    type: 'object' as const,
    properties: {
      success: { type: 'boolean', example: true },
      message: { type: 'string' },
    },
  },

  ErrorResponse: {
    type: 'object' as const,
    properties: {
      success: { type: 'boolean', example: false },
      error: { type: 'string' },
      code: { type: 'string' },
    },
  },
};

export const auditServiceResponses = {
  UnauthorizedError: {
    description: 'Token inválido ou expirado',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Unauthorized: Token invalid or expired' },
          },
        },
      },
    },
  },

  ForbiddenError: {
    description: 'Apenas admin pode acessar logs de auditoria',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Forbidden: Only admin can access audit logs' },
          },
        },
      },
    },
  },

  ValidationError: {
    description: 'Erro de validação',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
            details: { type: 'array' },
          },
        },
      },
    },
  },

  NotFoundError: {
    description: 'Log não encontrado',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Not found' },
          },
        },
      },
    },
  },

  ServerError: {
    description: 'Erro interno',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string' },
          },
        },
      },
    },
  },
};
