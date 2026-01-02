import express from "express";
import { createServer } from "http";

async function startServer() {
  const app = express();
  const server = createServer(app);

  // Middlewares
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Health check
  app.get("/health", (_req, res) => {
    res.json({ status: "Communications Service is running" });
  });

  // Routes will be added here
  // app.use("/api/emails", emailRoutes);
  // app.use("/api/notifications", notificationsRoutes);
  // app.use("/api/templates", templatesRoutes);

  const port = process.env.PORT || 3004;

  server.listen(port, () => {
    console.log(`Communications Service running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
