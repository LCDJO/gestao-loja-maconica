import express from "express";

const app = express();
const port = 5001;

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
  res.json({ status: "Auth Service is running" });
});

// Debug - Lista todas as rotas registradas
app.get("/debug/routes", (_req, res) => {
  res.json({
    port,
    routes: [
      "POST /api/auth/super-admin/login",
      "GET /api/auth/super-admin/profile",
      "POST /api/auth/admin/login",
      "GET /api/auth/admin/profile",
      "GET /health",
    ],
  });
});

// Super-Admin Login
app.post("/api/auth/super-admin/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const isLocalhost = req.hostname === "localhost" || req.hostname === "127.0.0.1";
    
    if (!isLocalhost && (email !== "master@masonica.org" || password !== "senha123456")) {
      res.status(401).json({ success: false, error: "Credenciais inválidas" });
      return;
    }
    
    console.log(`✅ Super-Admin login: ${email || "localhost-bypass"}`);
    
    res.json({
      success: true,
      message: "Login realizado com sucesso",
      data: {
        token: "token-test-123",
        refreshToken: "refresh-test-123",
        user: {
          id: "superadmin-123",
          email: email || "master@masonica.org",
          role: "SUPER_ADMIN",
        },
      },
    });
  } catch (error) {
    console.error("Erro no login:", error);
    res.status(500).json({ success: false, error: "Erro ao processar login" });
  }
});

// Super-Admin Profile
app.get("/api/auth/super-admin/profile", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    
    if (!token) {
      res.status(401).json({ success: false, error: "Token não fornecido" });
      return;
    }
    
    res.json({
      success: true,
      data: {
        id: "superadmin-123",
        email: "master@masonica.org",
        role: "SUPER_ADMIN",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({ success: false, error: "Erro ao buscar perfil" });
  }
});

// Admin Login
app.post("/api/auth/admin/login", async (req, res) => {
  try {
    const { email, password, lodgeId } = req.body;
    const isLocalhost = req.hostname === "localhost" || req.hostname === "127.0.0.1";
    
    if (!isLocalhost && (email !== "admin@loja.masonica.org" || password !== "senha123456")) {
      res.status(401).json({ success: false, error: "Credenciais inválidas" });
      return;
    }
    
    console.log(`✅ Admin login: ${email || "localhost-bypass"}, lodge: ${lodgeId}`);
    
    res.json({
      success: true,
      message: "Login realizado com sucesso",
      data: {
        token: "token-test-456",
        refreshToken: "refresh-test-456",
        user: {
          id: "admin-456",
          email: email || "admin@loja.masonica.org",
          role: "ADMIN",
          lodgeId: lodgeId || "lodge-1",
          lodgeName: "Loja Exemplo",
        },
      },
    });
  } catch (error) {
    console.error("Erro no login admin:", error);
    res.status(500).json({ success: false, error: "Erro ao processar login" });
  }
});

// Admin Profile
app.get("/api/auth/admin/profile", async (req, res) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];
    
    if (!token) {
      res.status(401).json({ success: false, error: "Token não fornecido" });
      return;
    }
    
    res.json({
      success: true,
      data: {
        id: "admin-456",
        email: "admin@loja.masonica.org",
        role: "ADMIN",
        lodgeId: "lodge-1",
        lodgeName: "Loja Exemplo",
      },
    });
  } catch (error) {
    console.error("Erro ao buscar perfil admin:", error);
    res.status(500).json({ success: false, error: "Erro ao buscar perfil" });
  }
});

// Start server
app.listen(port, () => {
  console.log(`✅ Auth Service running on http://localhost:${port}/`);
  console.log(`📝 Super-Admin Login: POST http://localhost:${port}/api/auth/super-admin/login`);
  console.log(`📝 Admin Login: POST http://localhost:${port}/api/auth/admin/login`);
});
