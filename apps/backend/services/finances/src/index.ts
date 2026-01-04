import express from "express";
import { createServer } from "http";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import financesRoutes from "./routes";
import {
  financesServicePaths,
  financesServiceSchemas,
  financesServiceComponents,
  financesServiceServers,
  financesServiceInfo,
  apiTags,
} from "./swagger/index.js";

async function startServer() {
  const app = express();
  const server = createServer(app);

  const port = process.env.PORT || 3003;

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

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "Finances Service is running" });
  });

  // Setup Swagger Documentation
  const swaggerSpec = swaggerJsdoc({
    definition: {
      openapi: "3.0.0",
      info: financesServiceInfo,
      servers: financesServiceServers,
      paths: financesServicePaths,
      components: financesServiceComponents,
      tags: apiTags,
    },
    apis: [],
  });
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Finances API routes
  app.use("/api/finances", financesRoutes);

  // Error handler
  app.use((err: any, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Erro interno do servidor",
    });
  });

  // 404 handler
  app.use((_req, res) => {
    res.status(404).json({
      success: false,
      error: "Rota não encontrada",
    });
  });

  server.listen(port, () => {
    console.log(`✅ Finances Service running on http://localhost:${port}/`);
    console.log(`📝 API Base: http://localhost:${port}/api/finances`);
    console.log(`📚 Swagger Docs: http://localhost:${port}/api-docs`);
  });
}

startServer().catch(console.error);
