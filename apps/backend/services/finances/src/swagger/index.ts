/**
 * Consolidação de Swagger - Finances Service
 * Agrupa todos os paths, schemas e componentes
 */

import { transactionsPaths } from './paths/transactions.paths';
import { billsPaths } from './paths/bills.paths';
import { accountsPaths } from './paths/accounts.paths';
import { financesServiceSchemas as schemas, financesServiceResponses } from './components';

// Consolidar todos os paths
export const financesServicePaths = {
  ...transactionsPaths,
  ...billsPaths,
  ...accountsPaths,
};

// Consolidar todos os schemas
export const financesServiceSchemas = schemas;

// Consolidar componentes (schemas + responses)
export const financesServiceComponents = {
  schemas: financesServiceSchemas,
  responses: financesServiceResponses,
  securitySchemes: {
    bearerAuth: {
      type: 'http',
      scheme: 'bearer',
      bearerFormat: 'JWT',
      description: 'JWT Bearer token para autenticação',
    },
  },
};

// Info e servers
export const financesServiceInfo = {
  title: 'Finances Service API',
  version: '1.0.0',
  description: 'API para gerenciamento de transações, faturas, contas e relatórios financeiros',
  contact: {
    name: 'Suporte API',
    email: 'api@masonica.org',
  },
};

export const financesServiceServers = [
  {
    url: 'http://localhost:3003',
    description: 'Servidor de desenvolvimento',
  },
  {
    url: 'https://api.masonica.org',
    description: 'Servidor de produção',
  },
];

// Tags para organização
export const apiTags = [
  {
    name: 'Transações',
    description: 'Operações com transações (receitas, despesas, transferências)',
  },
  {
    name: 'Faturas',
    description: 'Gerenciamento de faturas e boletos',
  },
  {
    name: 'Contas',
    description: 'Gerenciamento de contas bancárias e caixas',
  },
  {
    name: 'Relatórios',
    description: 'Relatórios e consolidações financeiras',
  },
];
