import { Request, Response, NextFunction } from "express";
import { jwtVerify } from "jose";
import type { AdminPayload, SuperAdminPayload } from "../types";

// Estender Express Request com tipos customizados
declare global {
  namespace Express {
    interface Request {
      user?: any;
      superAdminId?: string;
      adminId?: string;
      memberId?: string;
      lodgeId?: string;
    }
  }
}

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-key-change-in-production"
);

/**
 * Middleware genérico para validar JWT
 * Usado para qualquer tipo de usuário
 */
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: "Token não fornecido",
      });
      return;
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    req.user = verified.payload;

    // Mapear IDs conforme tipo
    const payload = verified.payload as any;
    if (payload.type === "SUPER_ADMIN") {
      req.superAdminId = payload.sub;
    } else if (payload.type === "ADMIN") {
      req.adminId = payload.sub;
      req.lodgeId = payload.lodgeId;
    } else if (payload.type === "MEMBER") {
      req.memberId = payload.sub;
      req.lodgeId = payload.lodgeId;
    }

    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Token inválido ou expirado",
    });
  }
}

/**
 * Middleware para proteger rotas de Super-Admin
 */
export async function authenticateSuperAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: "Não autorizado",
      });
      return;
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as any;

    // Validar tipo
    if (payload.type !== "SUPER_ADMIN" || payload.role !== "SUPER_ADMIN") {
      res.status(403).json({
        success: false,
        error: "Acesso restrito a Super-Admin",
      });
      return;
    }

    req.user = payload;
    req.superAdminId = payload.sub;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Token inválido ou expirado",
    });
  }
}

/**
 * Middleware para proteger rotas de Admin
 */
export async function authenticateAdmin(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader?.split(" ")[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: "Não autorizado",
      });
      return;
    }

    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as any;

    // Validar tipo
    if (payload.type !== "ADMIN" || payload.role !== "ADMIN") {
      res.status(403).json({
        success: false,
        error: "Acesso restrito a Admin",
      });
      return;
    }

    // Validar lodgeId obrigatório
    if (!payload.lodgeId) {
      res.status(403).json({
        success: false,
        error: "Loja não identificada no token",
      });
      return;
    }

    req.user = payload;
    req.adminId = payload.sub;
    req.lodgeId = payload.lodgeId;
    next();
  } catch (error) {
    res.status(401).json({
      success: false,
      error: "Token inválido ou expirado",
    });
  }
}
