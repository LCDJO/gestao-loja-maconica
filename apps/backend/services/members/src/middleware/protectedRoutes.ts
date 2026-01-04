import { Request, Response, NextFunction } from 'express';

/**
 * MIDDLEWARE DE PROTEÇÃO POR ROLE
 * 
 * Implementação clara de Admin vs Super-Admin com isolamento de dados
 * 
 * Admin:       role="admin" + lodge_id presente (acesso a 1 loja)
 * Super-Admin: role="super_admin" sem lodge_id (acesso a todas as lojas)
 * Member:      role="member" (acesso apenas aos dados pessoais)
 */

// =====================================================================
// MIDDLEWARE: ADMIN ONLY (administra UMA loja)
// =====================================================================
export async function adminOnly(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Validar que o token foi autenticado
  if (!req.memberId || !req.email) {
    res.status(401).json({
      success: false,
      error: 'Token não autenticado. Use authenticateToken() antes de adminOnly()',
    });
    return;
  }

  // Validar que é um admin (não super-admin)
  if (req.role !== 'admin') {
    res.status(403).json({
      success: false,
      error: `Acesso negado. Requer role='admin', recebeu role='${req.role}'`,
    });
    return;
  }

  // Validar que tem lodge_id (isolamento por loja)
  if (!req.lodgeId) {
    res.status(403).json({
      success: false,
      error: 'Admin sem lodge_id. Isolamento multitenant falhou.',
    });
    return;
  }

  // ✅ Tudo certo, prosseguir
  // req.lodgeId agora está garantido para filtrar queries no banco
  next();
}

// =====================================================================
// MIDDLEWARE: SUPER-ADMIN ONLY (administra TODO o SaaS)
// =====================================================================
export async function superAdminOnly(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Validar que o token foi autenticado
  if (!req.memberId || !req.email) {
    res.status(401).json({
      success: false,
      error: 'Token não autenticado. Use authenticateToken() antes de superAdminOnly()',
    });
    return;
  }

  // Validar que é super-admin (strictamente)
  if (req.role !== 'super_admin') {
    res.status(403).json({
      success: false,
      error: `Acesso negado. Requer role='super_admin', recebeu role='${req.role}'`,
    });
    return;
  }

  // ✅ Super-admin pode acessar sem lodge_id (acesso irrestrito)
  // Queries no banco NÃO devem ter WHERE lodge_id = X
  next();
}

// =====================================================================
// MIDDLEWARE: MEMBER ONLY (dados pessoais do membro)
// =====================================================================
export async function memberOnly(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  // Validar que o token foi autenticado
  if (!req.memberId || !req.email) {
    res.status(401).json({
      success: false,
      error: 'Token não autenticado. Use authenticateToken() antes de memberOnly()',
    });
    return;
  }

  // Validar que é um member (não admin/super-admin)
  if (req.role !== 'member') {
    res.status(403).json({
      success: false,
      error: `Acesso negado. Requer role='member', recebeu role='${req.role}'`,
    });
    return;
  }

  // ✅ Tudo certo, prosseguir
  // req.memberId está garantido para filtrar dados pessoais
  next();
}

// =====================================================================
// HELPER: Validar que admin está acessando sua própria loja
// =====================================================================
export function validateAdminLodgeAccess(lodgeIdFromRoute: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Se não passou por adminOnly, pular
    if (req.role !== 'admin' || !req.lodgeId) {
      next();
      return;
    }

    // Validar que o lodgeId da rota corresponde ao lodgeId do token
    if (lodgeIdFromRoute !== req.lodgeId) {
      res.status(403).json({
        success: false,
        error: `Admin tentando acessar loja diferente. Autorizado: ${req.lodgeId}, Tentando: ${lodgeIdFromRoute}`,
      });
      return;
    }

    next();
  };
}

// =====================================================================
// HELPER: Validar que member está acessando seus próprios dados
// =====================================================================
export function validateMemberDataAccess(memberIdFromRoute: string) {
  return (req: Request, res: Response, next: NextFunction): void => {
    // Se não passou por memberOnly, pular
    if (req.role !== 'member' || !req.memberId) {
      next();
      return;
    }

    // Validar que o memberId da rota corresponde ao memberId do token
    if (memberIdFromRoute !== req.memberId) {
      res.status(403).json({
        success: false,
        error: `Membro tentando acessar dados de outro membro. Autorizado: ${req.memberId}, Tentando: ${memberIdFromRoute}`,
      });
      return;
    }

    next();
  };
}

// =====================================================================
// TIPOS DE RESPOSTA PADRONIZADA
// =====================================================================
export interface AdminAccessError {
  success: false;
  error: string;
  requiredRole: 'admin' | 'super_admin' | 'member';
  receivedRole?: string;
}

export interface AdminAccessSuccess {
  success: true;
  memberId: string;
  lodge_id: string;
  role: string;
}
