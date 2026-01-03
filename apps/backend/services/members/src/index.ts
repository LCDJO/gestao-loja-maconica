import express from "express";
import { createServer } from "http";
import membersRoutes from "./routes";

async function startServer() {
  const app = express();
  const server = createServer(app);

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

  const port = process.env.PORT || 3002;

  server.listen(port, () => {
    console.log(`✅ Members Service running on http://localhost:${port}/`);
    console.log(`📝 API Base: http://localhost:${port}/api/members`);
  });
}

startServer().catch(console.error);
