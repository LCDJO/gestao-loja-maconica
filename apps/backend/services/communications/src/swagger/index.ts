/**
 * Consolidação de Swagger - Communications Service
 * Agrupa todos os paths, schemas e componentes
 */

import { emailsPaths } from './paths/emails.paths';
import { notificationsPaths } from './paths/notifications.paths';
import { whatsappPaths } from './paths/whatsapp.paths';
import { templatesPaths } from './paths/templates.paths';
import { communicationsServiceSchemas as schemas, communicationsServiceResponses } from './components';

// Consolidar todos os paths
export const communicationsServicePaths = {
  ...emailsPaths,
  ...notificationsPaths,
  ...whatsappPaths,
  ...templatesPaths,
};

// Consolidar todos os schemas
export const communicationsServiceSchemas = schemas;

// Consolidar componentes
export const communicationsServiceComponents = {
  schemas: communicationsServiceSchemas,
  responses: communicationsServiceResponses,
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT Bearer token',
    },
  },
};

// Info e servers
export const communicationsServiceInfo = {
  title: 'Communications Service API',
  version: '1.0.0',
  description: 'API para emails, notificações push, WhatsApp, SMS e templates',
  contact: {
    name: 'Suporte API',
    email: 'api@masonica.org',
  },
};

export const communicationsServiceServers = [
  {
    url: 'http://localhost:3004',
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
    name: 'Emails',
    description: 'Envio e gerenciamento de emails',
  },
  {
    name: 'Notificações Push',
    description: 'Notificações para aplicativo mobile e web',
  },
  {
    name: 'WhatsApp',
    description: 'Mensagens via WhatsApp (Evolution API)',
  },
  {
    name: 'Templates',
    description: 'Gerenciamento de templates reutilizáveis',
  },
  {
    name: 'Logs',
    description: 'Histórico de todas as comunicações',
  },
];
