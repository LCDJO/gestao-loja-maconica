import { Request, Response } from 'express';
import {
  MemberLoginRequest,
  MemberAuthResponse,
  RefreshTokenRequest,
  ApiResponse,
} from '../types';
import {
  findMemberByEmail,
  findMemberById,
  getProfileWithoutPassword,
} from '../database';
import {
  generateToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../middleware/auth';
import { loginSchema, refreshTokenSchema } from '../schemas';

// Armazenar tokens revogados (em produção, usar Redis)
const revokedTokens: Set<string> = new Set();

export async function login(
  req: Request,
  res: Response<ApiResponse<MemberAuthResponse>>
): Promise<void> {
  try {
    const validation = loginSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: validation.error.errors[0].message,
      });
      return;
    }

    const { email, password } = validation.data as MemberLoginRequest;

    // Buscar membro por email
    const member = findMemberByEmail(email);

    if (!member) {
      res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos',
      });
      return;
    }

    // Comparar senha (em produção, usar bcrypt)
    if (member.password !== password) {
      res.status(401).json({
        success: false,
        error: 'Email ou senha incorretos',
      });
      return;
    }

    // Gerar tokens
    const token = generateToken(member.id, member.email);
    const refreshToken = generateRefreshToken(member.id);
    const profile = getProfileWithoutPassword(member);

    res.json({
      success: true,
      message: 'Login realizado com sucesso',
      data: {
        token,
        refreshToken,
        user: profile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao realizar login',
    });
  }
}

export async function logout(
  req: Request,
  res: Response<ApiResponse<null>>
): Promise<void> {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      revokedTokens.add(token);
    }

    res.json({
      success: true,
      message: 'Logout realizado com sucesso',
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao realizar logout',
    });
  }
}

export async function refresh(
  req: Request,
  res: Response<ApiResponse<MemberAuthResponse>>
): Promise<void> {
  try {
    const validation = refreshTokenSchema.safeParse(req.body);

    if (!validation.success) {
      res.status(400).json({
        success: false,
        error: 'Refresh token inválido',
      });
      return;
    }

    const { refreshToken } = validation.data as RefreshTokenRequest;

    // Verificar refresh token
    const decoded = verifyRefreshToken(refreshToken);

    if (!decoded) {
      res.status(403).json({
        success: false,
        error: 'Refresh token expirado ou inválido',
      });
      return;
    }

    // Buscar membro
    const member = findMemberById(decoded.memberId);

    if (!member) {
      res.status(401).json({
        success: false,
        error: 'Membro não encontrado',
      });
      return;
    }

    // Gerar novo token
    const newToken = generateToken(member.id, member.email);
    const newRefreshToken = generateRefreshToken(member.id);
    const profile = getProfileWithoutPassword(member);

    res.json({
      success: true,
      message: 'Token renovado com sucesso',
      data: {
        token: newToken,
        refreshToken: newRefreshToken,
        user: profile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao renovar token',
    });
  }
}

export async function verify(
  req: Request,
  res: Response<ApiResponse<{ valid: boolean; user?: any }>>
): Promise<void> {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      res.status(401).json({
        success: false,
        error: 'Token não fornecido',
      });
      return;
    }

    // Verificar se token foi revogado
    if (revokedTokens.has(token)) {
      res.status(403).json({
        success: false,
        error: 'Token foi revogado',
      });
      return;
    }

    // Verificar se memberId está disponível (middleware já validou)
    if (!req.memberId) {
      res.status(401).json({
        success: false,
        error: 'Dados de autenticação inválidos',
      });
      return;
    }

    const member = findMemberById(req.memberId);

    if (!member) {
      res.status(401).json({
        success: false,
        error: 'Membro não encontrado',
      });
      return;
    }

    const profile = getProfileWithoutPassword(member);

    res.json({
      success: true,
      message: 'Token válido',
      data: {
        valid: true,
        user: profile,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao verificar token',
    });
  }
}
