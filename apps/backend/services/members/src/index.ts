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
    res.json({ status: "Members Service is running" });
  });

  // Routes will be added here
  // app.use("/api/members", membersRoutes);

  const port = process.env.PORT || 3002;

  server.listen(port, () => {
    console.log(`Members Service running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
