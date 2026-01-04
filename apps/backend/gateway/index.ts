/**
 * API Gateway de Desenvolvimento
 * Servidor único que roteia tudo em dev
 * 
 * Porta 3000: Vite + Proxy de APIs
 */

import express from "express";
import proxy from "express-http-proxy";

const app = express();
const port = 3000;

// Middlewares básicos
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS, PATCH");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Health check
app.get("/health", (_req, res) => {
  res.json({ status: "Gateway is running", timestamp: new Date().toISOString() });
});

// Rotas de proxy para cada serviço
app.use("/api/auth", proxy("http://localhost:5001", {
  proxyReqPathResolver: (req) => `/api/auth${req.url}`,
  userResDecorator: (proxyRes, proxyResData, userReq) => {
    console.log(`→ [AUTH] ${userReq.method} ${userReq.path}`);
    return proxyResData;
  },
}));

app.use("/api/members", proxy("http://localhost:5002", {
  proxyReqPathResolver: (req) => `/api/members${req.url}`,
  userResDecorator: (proxyRes, proxyResData, userReq) => {
    console.log(`→ [MEMBERS] ${userReq.method} ${userReq.path}`);
    return proxyResData;
  },
}));

app.use("/api/finances", proxy("http://localhost:5003", {
  proxyReqPathResolver: (req) => `/api/finances${req.url}`,
  userResDecorator: (proxyRes, proxyResData, userReq) => {
    console.log(`→ [FINANCES] ${userReq.method} ${userReq.path}`);
    return proxyResData;
  },
}));

app.use("/api/communications", proxy("http://localhost:5004", {
  proxyReqPathResolver: (req) => `/api/communications${req.url}`,
  userResDecorator: (proxyRes, proxyResData, userReq) => {
    console.log(`→ [COMMUNICATIONS] ${userReq.method} ${userReq.path}`);
    return proxyResData;
  },
}));

app.use("/api/audit", proxy("http://localhost:5005", {
  proxyReqPathResolver: (req) => `/api/audit${req.url}`,
  userResDecorator: (proxyRes, proxyResData, userReq) => {
    console.log(`→ [AUDIT] ${userReq.method} ${userReq.path}`);
    return proxyResData;
  },
}));

// 404
app.use((req, res) => {
  res.status(404).json({ success: false, error: `Route not found: ${req.path}` });
});

app.listen(port, () => {
  console.log(`\n╔════════════════════════════════════════╗`);
  console.log(`║  🚀 API GATEWAY - Development Mode     ║`);
  console.log(`╠════════════════════════════════════════╣`);
  console.log(`║  🌐 Gateway:       http://localhost:${port}   ║`);
  console.log(`║  📡 Vite Frontend: http://localhost:3001  ║`);
  console.log(`║                                            ║`);
  console.log(`║  🔷 Auth Service:      http://localhost:5001`);
  console.log(`║  🟢 Members Service:    http://localhost:5002`);
  console.log(`║  🟡 Finances Service:   http://localhost:5003`);
  console.log(`║  🟣 Communications:     http://localhost:5004`);
  console.log(`║  🔴 Audit Service:      http://localhost:5005`);
  console.log(`║                                            ║`);
  console.log(`║  💡 Acesse: http://localhost:3001 no      ║`);
  console.log(`║     navegador (Frontend)                   ║`);
  console.log(`╚════════════════════════════════════════╝\n`);
});
