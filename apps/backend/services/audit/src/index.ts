import express from "express";
import { createServer } from "http";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import {
  auditServicePaths,
  auditServiceSchemas,
  auditServiceComponents,
  auditServiceServers,
  auditServiceInfo,
  apiTags,
} from "./swagger/index.js";

async function startServer() {
  const app = express();
  const server = createServer(app);

  const port = process.env.PORT || 3005;

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
    res.json({ status: "Audit Service is running" });
  });

  // Setup Swagger Documentation
  const swaggerSpec = swaggerJsdoc({
    definition: {
      openapi: "3.0.0",
      info: auditServiceInfo,
      servers: auditServiceServers,
      paths: auditServicePaths,
      components: auditServiceComponents,
      tags: apiTags,
    },
    apis: [],
  });
  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

  // Routes will be added here
  // app.use("/api/audit/logs", auditLogsRoutes);
  // app.use("/api/access/logs", accessLogsRoutes);

  server.listen(port, () => {
    console.log(`✅ Audit Service running on http://localhost:${port}/`);
    console.log(`📝 API Base: http://localhost:${port}/api/audit`);
    console.log(`📚 Swagger Docs: http://localhost:${port}/api-docs`);
  });
}

startServer().catch(console.error);
