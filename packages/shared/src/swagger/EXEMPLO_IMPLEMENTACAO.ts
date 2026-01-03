/**
 * Exemplo de implementação de Swagger em um serviço
 * Este arquivo mostra como configurar Swagger em qualquer serviço backend
 * 
 * Passos para implementar em cada serviço:
 * 1. Adicionar dependências: swagger-ui-express e swagger-jsdoc (já feito em package.json)
 * 2. Importar setupSwaggerUI e generateSwaggerConfig
 * 3. Adicionar linhas no index.ts (ver abaixo)
 * 4. Adicionar comentários JSDoc nos arquivos de routes
 */

import express from "express";
import { createServer } from "http";
import { generateSwaggerConfig, setupSwaggerUI } from "shared/swagger/swaggerConfig";
// import authRoutes from "./routes"; // Quando routes estiverem prontas

async function startServerExample() {
  const app = express();
  const server = createServer(app);

  const port = process.env.PORT || 3001;

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // CORS
  app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
    if (req.method === "OPTIONS") {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Setup Swagger Documentation
  // ✨ ADICIONAR ISTO AO index.ts DE CADA SERVIÇO
  const swaggerSpec = generateSwaggerConfig({
    title: "Auth Service API",
    description: "API para autenticação e gerenciamento de tokens JWT",
    version: "1.0.0",
    port: port as number,
    basePath: "/api/auth",
    serviceName: "Auth Service",
  });
  setupSwaggerUI(app, swaggerSpec, "/api-docs");

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "Auth Service is running" });
  });

  // Routes (quando implementadas)
  // app.use("/api/auth", authRoutes);

  server.listen(port, () => {
    console.log(`✅ Auth Service running on http://localhost:${port}/`);
    console.log(`📝 API Base: http://localhost:${port}/api/auth`);
    console.log(`📚 Swagger Docs: http://localhost:${port}/api-docs`);
  });
}

// Exportar exemplo
export const swaggerImplementationExample = `
// Em cada serviço, adicionar ao index.ts:

import { generateSwaggerConfig, setupSwaggerUI } from "shared/swagger/swaggerConfig";

const swaggerSpec = generateSwaggerConfig({
  title: "Service Name API",
  description: "API description",
  version: "1.0.0",
  port: port as number,
  basePath: "/api/service",
  serviceName: "Service Name",
});
setupSwaggerUI(app, swaggerSpec, "/api-docs");
`;
