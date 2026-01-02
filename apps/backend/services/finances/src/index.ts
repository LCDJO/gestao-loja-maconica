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
    res.json({ status: "Finances Service is running" });
  });

  // Routes will be added here
  // app.use("/api/finances", financesRoutes);
  // app.use("/api/transactions", transactionsRoutes);
  // app.use("/api/bills", billsRoutes);

  const port = process.env.PORT || 3003;

  server.listen(port, () => {
    console.log(`Finances Service running on http://localhost:${port}/`);
  });
}

startServer().catch(console.error);
