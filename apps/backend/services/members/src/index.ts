import express from "express";
import { createServer } from "http";
import { generateSwaggerConfig, setupSwaggerUI } from "../../../../../../packages/shared/dist/swagger/swaggerConfig.js";
import membersRoutes from "./routes";

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

  // Setup Swagger Documentation
  const swaggerSpec = generateSwaggerConfig({
    title: "Members Service API",
    description: "API para gerenciamento de membros da loja maçônica",
    version: "1.0.0",
    port: port as number,
    basePath: "/api/members",
    serviceName: "Members Service",
  });
  setupSwaggerUI(app, swaggerSpec, "/api-docs");

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "Members Service is running" });
  });

  // Members API routes
  app.use("/api/members", membersRoutes);

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: "Rota não encontrada",
    });
  });

  // Error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  });

  server.listen(port, () => {
    console.log(`✅ Members Service running on http://localhost:${port}/`);
    console.log(`📝 API Base: http://localhost:${port}/api/members`);
    console.log(`📚 Swagger Docs: http://localhost:${port}/api-docs`);
  });
}

startServer().catch(console.error);
