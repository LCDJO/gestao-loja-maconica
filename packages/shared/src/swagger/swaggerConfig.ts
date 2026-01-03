/**
 * Configuração centralizada de Swagger para todos os micro serviços
 * Uso: importar e usar em cada serviço no index.ts
 */

import swaggerJsdoc from 'swagger-jsdoc';

export interface SwaggerServiceConfig {
  title: string;
  description: string;
  version: string;
  port: number;
  basePath: string;
  serviceName: string;
}

/**
 * Gera configuração Swagger baseado nos parâmetros do serviço
 */
export function generateSwaggerConfig(config: SwaggerServiceConfig) {
  const baseUrl = `http://localhost:${config.port}`;

  const options = {
    definition: {
      openapi: '3.0.0',
      info: {
        title: config.title,
        description: config.description,
        version: config.version,
        contact: {
          name: 'Gestão Loja Maçônica',
          url: 'https://github.com/seu-repo/gestao-loja-maconica',
          email: 'seu-email@example.com',
        },
        license: {
          name: 'MIT',
          url: 'https://opensource.org/licenses/MIT',
        },
      },
      servers: [
        {
          url: baseUrl,
          description: `${config.serviceName} Development Server`,
          variables: {
            protocol: {
              default: 'http',
              enum: ['http', 'https'],
            },
            host: {
              default: `localhost:${config.port}`,
            },
          },
        },
      ],
      components: {
        securitySchemes: {
          bearerAuth: {
            type: 'http',
            scheme: 'bearer',
            bearerFormat: 'JWT',
            description: 'JWT token para autenticação',
          },
        },
        schemas: {
          ApiResponse: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                description: 'Status da requisição',
              },
              message: {
                type: 'string',
                description: 'Mensagem informativa',
              },
              data: {
                type: 'object',
                description: 'Dados da resposta',
              },
              error: {
                type: 'string',
                description: 'Mensagem de erro (se houver)',
              },
            },
            required: ['success'],
          },
          ValidationError: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                enum: [false],
              },
              error: {
                type: 'string',
                example: 'Invalid email',
              },
            },
          },
          UnauthorizedError: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                enum: [false],
              },
              error: {
                type: 'string',
                example: 'Unauthorized: Token invalid or expired',
              },
            },
          },
          NotFoundError: {
            type: 'object',
            properties: {
              success: {
                type: 'boolean',
                enum: [false],
              },
              error: {
                type: 'string',
                example: 'Resource not found',
              },
            },
          },
        },
      },
      tags: [
        {
          name: 'Health',
          description: 'Health check endpoints',
        },
      ],
    },
    apis: ['./src/routes.ts', './src/index.ts', './src/**/*.ts'],
  };

  return swaggerJsdoc(options);
}

/**
 * Middleware para servir Swagger UI
 * Uso: app.use('/api-docs', swaggerUiExpress.serve, swaggerUiExpress.setup(swaggerSpec))
 */
export function setupSwaggerUI(
  app: any,
  swaggerSpec: any,
  basePath: string = '/api-docs'
) {
  const swaggerUiExpress = require('swagger-ui-express');
  
  app.use(basePath, swaggerUiExpress.serve);
  app.get(basePath, swaggerUiExpress.setup(swaggerSpec, {
    swaggerOptions: {
      persistAuthorization: true,
      displayOperationId: true,
      defaultModelsExpandDepth: 1,
      defaultModelExpandDepth: 1,
    },
    customCss: '.swagger-ui .topbar { display: none }',
    customSiteTitle: 'API Documentation',
  }));

  // Servir JSON da especificação Swagger
  app.get(`${basePath}/spec.json`, (_req: any, res: any) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerSpec);
  });
}

export default { generateSwaggerConfig, setupSwaggerUI };
