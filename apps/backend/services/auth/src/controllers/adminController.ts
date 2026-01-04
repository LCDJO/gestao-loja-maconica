import { Request, Response } from "express";
import { SignJWT } from "jose";
import type { LoginResponse, ApiResponse } from "../types";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || "dev-secret-key-change-in-production"
);
const REFRESH_SECRET = new TextEncoder().encode(
  process.env.REFRESH_TOKEN_SECRET || "refresh-secret-key-change-in-production"
);

/**
 * Login para Admin da loja
 * Gerencia uma loja específica
 */
export async function adminLogin(
  req: Request,
  res: Response<LoginResponse>
): Promise<void> {
  try {
    const { email, password, lodgeId } = req.body;

    // Validar input
    if (!email || !password || !lodgeId) {
      res.status(400).json({
        success: false,
        error: "Email, senha e lodgeId são obrigatórios",
      });
      return;
    }

    // TODO: Buscar admin no banco de dados
    // const admin = await findAdminByEmail(email);
    // if (!admin || admin.lodgeId !== lodgeId) {
    //   res.status(401).json({ success: false, error: "Admin não pertence a esta loja" });
    //   return;
    // }
    // if (!validatePassword(password, admin.passwordHash)) {
    //   res.status(401).json({ success: false, error: "Credenciais inválidas" });
    //   return;
    // }

    // Mock para desenvolvimento
    if (email !== "admin@loja.masonica.org" || password !== "senha123456") {
      res.status(401).json({
        success: false,
        error: "Credenciais inválidas",
      });
      return;
    }

    const adminId = "admin-456";
    const lodgeName = "Loja Exemplo"; // TODO: Buscar do banco

    // Gerar token COM tipo ADMIN e COM lodgeId 🔑
    const token = await new SignJWT({
      sub: adminId,
      email,
      type: "ADMIN",
      role: "ADMIN",
      lodgeId, // 🔑 ESSENCIAL
      lodgeName,
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const refreshToken = await new SignJWT({
      sub: adminId,
      type: "ADMIN",
      lodgeId, // 🔑 ESSENCIAL
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(REFRESH_SECRET);

    res.json({
      success: true,
      message: "Login Admin realizado com sucesso",
      data: {
        token,
        refreshToken,
        user: {
          id: adminId,
          email,
          role: "ADMIN",
          lodgeId,
          lodgeName,
        },
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login admin:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao processar login",
    });
  }
}

/**
 * Obter perfil do Admin
 */
export async function adminProfile(
  req: Request,
  res: Response<ApiResponse>
): Promise<void> {
  try {
    const adminId = req.adminId;
    const lodgeId = req.lodgeId;

    // TODO: Buscar admin no banco de dados
    // const admin = await findAdminById(adminId);

    res.json({
      success: true,
      data: {
        id: adminId,
        email: req.user?.email,
        role: "ADMIN",
        lodgeId,
        lodgeName: req.user?.lodgeName,
      },
    });
  } catch (error) {
    console.error("Erro ao buscar perfil:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao buscar perfil",
    });
  }
}
