/**
 * Consolidação de Swagger - Audit Service
 * Agrupa todos os paths, schemas e componentes
 */

import { auditLogsPaths } from './paths/audit-logs.paths';
import { accessLogsPaths } from './paths/access-logs.paths';
import { reportsPaths } from './paths/reports.paths';
import { auditServiceSchemas as schemas, auditServiceResponses } from './components';

// Consolidar todos os paths
export const auditServicePaths = {
  ...auditLogsPaths,
  ...accessLogsPaths,
  ...reportsPaths,
};

// Consolidar todos os schemas
export const auditServiceSchemas = schemas;

// Consolidar componentes
export const auditServiceComponents = {
  schemas: auditServiceSchemas,
  responses: auditServiceResponses,
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT Bearer token (apenas admin)',
    },
  },
};

// Info e servers
export const auditServiceInfo = {
  title: 'Audit Service API',
  version: '1.0.0',
  description: 'API para auditoria, conformidade, logs de atividades e análise de segurança',
  contact: {
    name: 'Suporte API',
    email: 'api@masonica.org',
  },
};

export const auditServiceServers = [
  {
    url: 'http://localhost:3005',
    description: 'Servidor de desenvolvimento',
  },
  {
    url: 'https://api.masonica.org',
    description: 'Servidor de produção',
  },
];

// Tags
export const apiTags = [
  {
    name: 'Logs de Auditoria',
    description: 'Registros de todas as ações de criação, leitura, atualização e exclusão',
  },
  {
    name: 'Logs de Acesso',
    description: 'Histórico de logins, logouts e tentativas de acesso',
  },
  {
    name: 'Relatórios',
    description: 'Conformidade, estatísticas, exportações e alertas de segurança',
  },
];
