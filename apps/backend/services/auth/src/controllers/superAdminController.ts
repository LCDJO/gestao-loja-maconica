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
 * Login para Super-Admin
 * Gerencia a plataforma SaaS
 */
export async function superAdminLogin(
  req: Request,
  res: Response<LoginResponse>
): Promise<void> {
  try {
    const { email, password } = req.body;

    // Validar input
    if (!email || !password) {
      res.status(400).json({
        success: false,
        error: "Email e senha são obrigatórios",
      });
      return;
    }

    // TODO: Buscar super-admin no banco de dados
    // const superAdmin = await findSuperAdminByEmail(email);
    // if (!superAdmin || !validatePassword(password, superAdmin.passwordHash)) {
    //   res.status(401).json({ success: false, error: "Credenciais inválidas" });
    //   return;
    // }

    // Mock para desenvolvimento
    if (email !== "master@masonica.org" || password !== "senha123456") {
      res.status(401).json({
        success: false,
        error: "Credenciais inválidas",
      });
      return;
    }

    const superAdminId = "superadmin-123";

    // Gerar token COM tipo SUPER_ADMIN, SEM lodgeId
    const token = await new SignJWT({
      sub: superAdminId,
      email,
      type: "SUPER_ADMIN",
      role: "SUPER_ADMIN",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("24h")
      .sign(JWT_SECRET);

    const refreshToken = await new SignJWT({
      sub: superAdminId,
      type: "SUPER_ADMIN",
    })
      .setProtectedHeader({ alg: "HS256" })
      .setExpirationTime("7d")
      .sign(REFRESH_SECRET);

    res.json({
      success: true,
      message: "Login Super-Admin realizado com sucesso",
      data: {
        token,
        refreshToken,
        user: {
          id: superAdminId,
          email,
          role: "SUPER_ADMIN",
        },
      },
    });
  } catch (error) {
    console.error("Erro ao fazer login super-admin:", error);
    res.status(500).json({
      success: false,
      error: "Erro ao processar login",
    });
  }
}

/**
 * Obter perfil do Super-Admin
 */
export async function superAdminProfile(
  req: Request,
  res: Response<ApiResponse>
): Promise<void> {
  try {
    const superAdminId = req.superAdminId;

    // TODO: Buscar super-admin no banco de dados
    // const superAdmin = await findSuperAdminById(superAdminId);

    res.json({
      success: true,
      data: {
        id: superAdminId,
        email: req.user?.email,
        role: "SUPER_ADMIN",
        createdAt: new Date(),
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
