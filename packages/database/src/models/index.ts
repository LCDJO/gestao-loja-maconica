// Modelos de dados para ORM (se usar Prisma, TypeORM, etc)
// Este arquivo servirá como documentação dos modelos

export const models = {
  User: {
    id: 'UUID',
    email: 'string',
    passwordHash: 'string',
    name: 'string',
    role: 'string',
    isActive: 'boolean',
    createdAt: 'DateTime',
    updatedAt: 'DateTime',
  },

  Member: {
    id: 'UUID',
    userId: 'UUID',
    cim: 'string',
    degree: 'string',
    status: 'string',
    birthDate: 'Date',
    initiationDate: 'Date',
    photoUrl: 'string',
    createdAt: 'DateTime',
    updatedAt: 'DateTime',
  },

  Transaction: {
    id: 'UUID',
    date: 'DateTime',
    type: 'string',
    category: 'string',
    description: 'string',
    amount: 'decimal',
    memberId: 'UUID',
    createdAt: 'DateTime',
    updatedAt: 'DateTime',
  },

  Notification: {
    id: 'UUID',
    userId: 'UUID',
    type: 'string',
    title: 'string',
    message: 'string',
    isRead: 'boolean',
    createdAt: 'DateTime',
    updatedAt: 'DateTime',
  },

  AuditLog: {
    id: 'UUID',
    userId: 'UUID',
    action: 'string',
    entityType: 'string',
    entityId: 'string',
    changes: 'JSON',
    createdAt: 'DateTime',
  },
};
