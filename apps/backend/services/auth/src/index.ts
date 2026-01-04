import express from "express";
import { createServer } from "http";
import { generateSwaggerConfig, setupSwaggerUI } from "../../../../../../packages/shared/dist/swagger/swaggerConfig.js";

async function startServer() {
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
  const swaggerSpec = generateSwaggerConfig({
    title: "Auth Service API",
    description: "API para autenticação, tokens JWT e verificação de credenciais",
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

  // Routes will be added here
  // app.use("/api/auth", authRoutes);

  server.listen(port, () => {
    console.log(`✅ Auth Service running on http://localhost:${port}/`);
    console.log(`📝 API Base: http://localhost:${port}/api/auth`);
    console.log(`📚 Swagger Docs: http://localhost:${port}/api-docs`);
  });
}

startServer().catch(console.error);
