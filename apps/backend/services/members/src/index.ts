import express from "express";
import { createServer } from "http";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import membersRoutes from "./routes";
import {
  membersServicePaths,
  membersServiceSchemas,
  membersServiceComponents,
  membersServiceServers,
  membersServiceInfo,
  apiTags,
} from "./swagger/index.js";

async function startServer() {
  const app = express();
  const server = createServer(app);

  const port = process.env.PORT || 3002;

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

  // Health check (antes do swagger)
  app.get("/health", (_req, res) => {
    res.json({ status: "Members Service is running" });
  });

  // Setup Swagger Documentation (antes das rotas de API)
  const swaggerSpec = swaggerJsdoc({
    definition: {
      openapi: "3.0.0",
      info: membersServiceInfo,
      servers: membersServiceServers,
      paths: membersServicePaths,
      components: membersServiceComponents,
      tags: apiTags,
    },
    apis: [],
  });
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Members API routes
  app.use("/api/members", membersRoutes);

  // Error handler (antes do 404)
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  });

  // 404 handler (SEMPRE por último!)
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: "Rota não encontrada",
    });
  });

  server.listen(port, () => {
    console.log(`✅ Members Service running on http://localhost:${port}/`);
    console.log(`📝 API Base: http://localhost:${port}/api/members`);
    console.log(`📚 Swagger Docs: http://localhost:${port}/api-docs`);
  });
}

startServer().catch(console.error);
