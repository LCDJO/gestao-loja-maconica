import { Request, Response, NextFunction } from 'express';
import { SignJWT, jwtVerify, errors } from 'jose';
import { AuthTokenPayload } from '../types';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'dev-secret-key');
const REFRESH_TOKEN_SECRET = new TextEncoder().encode(process.env.REFRESH_TOKEN_SECRET || 'dev-refresh-secret');

// =====================================================================
// EXTENSÃO DO EXPRESS REQUEST PARA MULTITENANT
// =====================================================================
declare global {
  namespace Express {
    interface Request {
      memberId?: string;
      email?: string;
      lodgeId?: string;        // ← NOVO: ID do tenant (lodge)
      role?: string;           // ← NOVO: Role do usuário
      isSuperAdmin?: boolean;  // ← NOVO: Flag para super admin
    }
  }
}

// =====================================================================
// INTERFACE DE PAYLOAD DO JWT (COM LODGEID)
// =====================================================================
export interface JWTPayload {
  memberId: string;
  email: string;
  lodgeId: string;        // ← NOVO: Tenant isolation
  role: string;
  isSuperAdmin: boolean;
  iat?: number;
  exp?: number;
}

// =====================================================================
// MIDDLEWARE: AUTENTICAR TOKEN COM VALIDAÇÃO DE TENANT
// =====================================================================
export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({
      success: false,
      error: 'Token não fornecido',
    });
    return;
  }

  try {
    const verified = await jwtVerify(token, JWT_SECRET);
    const payload = verified.payload as JWTPayload;
    
    // Validar que o token possui os campos obrigatórios
    if (!payload.memberId || !payload.lodgeId) {
      res.status(401).json({
        success: false,
        error: 'Token inválido: dados de autenticação incompletos',
      });
      return;
    }

    // Populater dados no request para uso nas rotas
    req.memberId = payload.memberId;
    req.email = payload.email;
    req.lodgeId = payload.lodgeId;     // ← NOVO
    req.role = payload.role;           // ← NOVO
    req.isSuperAdmin = payload.isSuperAdmin; // ← NOVO

    next();
  } catch (error) {
    if (error instanceof errors.JWTExpired) {
      res.status(401).json({
        success: false,
        error: 'Token expirado',
      });
    } else {
      res.status(403).json({
        success: false,
        error: 'Token inválido ou expirado',
      });
    }
  }
}

// =====================================================================
// MIDDLEWARE: VALIDAR ACESSO AO TENANT (ISOLAMENTO)
// =====================================================================
/**
 * Middleware que valida se o usuário está tentando acessar um tenant
 * diferente do qual ele pertence.
 * 
 * Uso em rotas:
 * router.get('/api/members/:lodgeId/...',
 *   authenticateToken,
 *   validateTenantAccess,
 *   asyncHandler(controller)
 * );
 */
export function validateTenantAccess(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  const tokenLodgeId = req.lodgeId;
  const requestLodgeId = req.params.lodgeId || req.body.lodgeId;

  // Super admins podem acessar qualquer tenant
  if (req.isSuperAdmin) {
    next();
    return;
  }

  // Validar que o lodgeId do request é o mesmo do token
  if (requestLodgeId && tokenLodgeId !== requestLodgeId) {
    res.status(403).json({
      success: false,
      error: 'Acesso negado: você não pode acessar dados de outro tenant',
    });
    return;
  }

  next();
}

// =====================================================================
// GERAR TOKEN DE ACESSO (COM LODGEID)
// =====================================================================
/**
 * Gera um token JWT com isolamento de tenant.
 * 
 * @param memberId ID do membro
 * @param email Email do membro
 * @param lodgeId ID da loja (tenant) - CRÍTICO para isolamento
 * @param role Papel do usuário (admin, member, etc)
 * @param isSuperAdmin Se é super admin (acessa todas as lojas)
 * @returns Token JWT assinado
 */
export async function generateToken(
  memberId: string,
  email: string,
  lodgeId: string,      // ← NOVO: Obrigatório
  role: string = 'member',
  isSuperAdmin: boolean = false
): Promise<string> {
  const payload: JWTPayload = {
    memberId,
    email,
    lodgeId,             // ← NOVO: Isolamento no token
    role,
    isSuperAdmin,
  };

  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('24h')
    .sign(JWT_SECRET);

  return token;
}

// =====================================================================
// GERAR TOKEN DE RENOVAÇÃO
// =====================================================================
export async function generateRefreshToken(
  memberId: string,
  lodgeId: string  // ← NOVO: Manter isolamento no refresh token
): Promise<string> {
  const token = await new SignJWT({ 
    memberId,
    lodgeId,   // ← NOVO: Necessário para renovação segura
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime('7d')
    .sign(REFRESH_TOKEN_SECRET);

  return token;
}

// =====================================================================
// VERIFICAR TOKEN DE RENOVAÇÃO
// =====================================================================
export async function verifyRefreshToken(
  token: string
): Promise<{ memberId: string; lodgeId: string } | null> {
  try {
    const verified = await jwtVerify(token, REFRESH_TOKEN_SECRET);
    const payload = verified.payload as any;

    // Validar que possui campos obrigatórios
    if (!payload.memberId || !payload.lodgeId) {
      return null;
    }

    return {
      memberId: payload.memberId as string,
      lodgeId: payload.lodgeId as string,  // ← NOVO
    };
  } catch {
    return null;
  }
}
