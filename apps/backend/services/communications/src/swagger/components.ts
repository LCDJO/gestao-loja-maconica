/**
 * Schemas e Componentes Compartilhados - Communications Service
 * Define todos os tipos para emails, notificações e mensagens
 */

export const communicationsServiceSchemas = {
  // ===== REQUEST SCHEMAS =====
  SendEmailRequest: {
    type: 'object' as const,
    required: ['to', 'subject', 'body'],
    properties: {
      to: {
        type: 'array',
        items: { type: 'string', format: 'email' },
        description: 'Destinatários do email',
        example: ['joao@masonica.org'],
      },
      cc: {
        type: 'array',
        items: { type: 'string', format: 'email' },
        description: 'Cópia do email',
      },
      bcc: {
        type: 'array',
        items: { type: 'string', format: 'email' },
        description: 'Cópia oculta',
      },
      subject: {
        type: 'string',
        description: 'Assunto do email',
        example: 'Confirmação de Filiação',
      },
      body: {
        type: 'string',
        description: 'Corpo do email (pode ser HTML)',
        example: '<h1>Bem-vindo à Loja!</h1><p>Sua filiação foi confirmada.</p>',
      },
      template_id: {
        type: 'string',
        description: 'ID de template pré-configurado',
        example: 'welcome_email',
      },
      variables: {
        type: 'object',
        description: 'Variáveis para substituir no template',
        additionalProperties: { type: 'string' },
        example: { name: 'João Silva', lodge_name: 'Loja Minas Gerais' },
      },
      attachments: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            filename: { type: 'string' },
            content: { type: 'string', format: 'byte' },
            mimetype: { type: 'string' },
          },
        },
        description: 'Arquivos anexados',
      },
    },
  },

  SendPushNotificationRequest: {
    type: 'object' as const,
    required: ['title', 'message'],
    properties: {
      title: {
        type: 'string',
        description: 'Título da notificação',
        example: 'Novo Aviso',
      },
      message: {
        type: 'string',
        description: 'Corpo da notificação',
        example: 'Sua reunião começa em 1 hora',
      },
      target_type: {
        type: 'string',
        enum: ['all', 'segment', 'user_id', 'user_ids'],
        description: 'Tipo de alvo',
        example: 'segment',
      },
      target_value: {
        type: 'string',
        description: 'Valor do alvo (segment name, user_id, etc)',
        example: 'members',
      },
      data: {
        type: 'object',
        description: 'Dados adicionais',
        additionalProperties: { type: 'string' },
        example: { event_id: '123', action: 'open_event' },
      },
      image_url: {
        type: 'string',
        format: 'uri',
        description: 'URL da imagem',
      },
      deep_link: {
        type: 'string',
        description: 'Deep link para abrir dentro do app',
        example: '/events/123',
      },
      schedule_time: {
        type: 'string',
        format: 'date-time',
        description: 'Hora de agendamento (vazio = enviar agora)',
      },
    },
  },

  SendWhatsAppRequest: {
    type: 'object' as const,
    required: ['phone_number', 'message'],
    properties: {
      phone_number: {
        type: 'string',
        description: 'Número WhatsApp (com DDD)',
        example: '+5531987654321',
      },
      message: {
        type: 'string',
        description: 'Mensagem de texto',
        example: 'Olá João, você tem uma reunião em 1 hora',
      },
      media_url: {
        type: 'string',
        format: 'uri',
        description: 'URL de imagem/vídeo para enviar',
      },
      template_id: {
        type: 'string',
        description: 'ID de template pré-aprovado',
        example: 'meeting_reminder',
      },
      variables: {
        type: 'array',
        items: { type: 'string' },
        description: 'Variáveis para o template',
        example: ['João Silva', '14:00'],
      },
    },
  },

  CreateTemplateRequest: {
    type: 'object' as const,
    required: ['name', 'type', 'content'],
    properties: {
      name: {
        type: 'string',
        description: 'Nome único do template',
        example: 'welcome_email',
      },
      type: {
        type: 'string',
        enum: ['email', 'push', 'whatsapp', 'sms'],
        description: 'Tipo de template',
      },
      description: {
        type: 'string',
        description: 'Descrição do template',
      },
      content: {
        type: 'string',
        description: 'Conteúdo do template (pode usar {{variavel}})',
        example: 'Olá {{name}}, bem-vindo à {{lodge_name}}!',
      },
      variables: {
        type: 'array',
        items: { type: 'string' },
        description: 'Variáveis disponíveis',
        example: ['name', 'lodge_name'],
      },
      subject: {
        type: 'string',
        description: 'Assunto (apenas para email)',
      },
    },
  },

  // ===== RESPONSE SCHEMAS =====
  Email: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'string',
        description: 'ID único do email',
      },
      to: {
        type: 'array',
        items: { type: 'string' },
      },
      subject: { type: 'string' },
      status: {
        type: 'string',
        enum: ['sent', 'delivered', 'failed', 'bounce', 'spam'],
      },
      created_at: {
        type: 'string',
        format: 'date-time',
      },
      delivered_at: {
        type: 'string',
        format: 'date-time',
      },
    },
  },

  PushNotification: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'string',
        description: 'ID único da notificação',
      },
      title: { type: 'string' },
      message: { type: 'string' },
      status: {
        type: 'string',
        enum: ['pending', 'sent', 'delivered', 'failed'],
      },
      sent_count: {
        type: 'number',
        description: 'Quantidade de envios bem-sucedidos',
      },
      failed_count: {
        type: 'number',
        description: 'Quantidade de falhas',
      },
      created_at: {
        type: 'string',
        format: 'date-time',
      },
      sent_at: {
        type: 'string',
        format: 'date-time',
      },
    },
  },

  Template: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'string',
        description: 'ID único',
      },
      name: {
        type: 'string',
        description: 'Nome do template',
      },
      type: {
        type: 'string',
        enum: ['email', 'push', 'whatsapp', 'sms'],
      },
      content: {
        type: 'string',
      },
      variables: {
        type: 'array',
        items: { type: 'string' },
      },
      usage_count: {
        type: 'number',
        description: 'Quantidade de usos',
      },
      created_at: {
        type: 'string',
        format: 'date-time',
      },
    },
  },

  SendResult: {
    type: 'object' as const,
    properties: {
      success: {
        type: 'boolean',
      },
      id: {
        type: 'string',
        description: 'ID da mensagem enviada',
      },
      message: {
        type: 'string',
      },
      timestamp: {
        type: 'string',
        format: 'date-time',
      },
    },
  },

  TemplateList: {
    type: 'object' as const,
    properties: {
      data: {
        type: 'array',
        items: { $ref: '#/components/schemas/Template' },
      },
      pagination: {
        type: 'object',
        properties: {
          total: { type: 'number' },
          page: { type: 'number' },
          limit: { type: 'number' },
        },
      },
    },
  },

  CommunicationLog: {
    type: 'object' as const,
    properties: {
      id: {
        type: 'string',
      },
      type: {
        type: 'string',
        enum: ['email', 'push', 'whatsapp', 'sms'],
      },
      recipient: {
        type: 'string',
      },
      status: {
        type: 'string',
        enum: ['pending', 'sent', 'delivered', 'failed'],
      },
      error_message: {
        type: 'string',
      },
      created_at: {
        type: 'string',
        format: 'date-time',
      },
      delivered_at: {
        type: 'string',
        format: 'date-time',
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

export const communicationsServiceResponses = {
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
    description: 'Permissão insuficiente',
    content: {
      'application/json': {
        schema: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: { type: 'string', example: 'Forbidden: You do not have permission to perform this action' },
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
    description: 'Recurso não encontrado',
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
    description: 'Erro interno do servidor',
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
