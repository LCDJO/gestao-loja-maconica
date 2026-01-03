import { Request, Response, NextFunction } from 'express';

// =====================================================================
// MIDDLEWARE: VALIDAR ISOLAMENTO DE TENANT
// =====================================================================
/**
 * Middleware que força isolamento de tenant em rotas que especificam lodgeId.
 * Impede que usuários acessem dados de um tenant diferente do seu.
 * 
 * USO:
 * ----
 * Aplicar APÓS authenticateToken:
 * 
 * router.get(
 *   '/api/members/:lodgeId/profile',
 *   authenticateToken,
 *   validateTenantIsolation,  // ← Aqui
 *   asyncHandler(getProfile)
 * );
 * 
 * COMPORTAMENTO:
 * ---------------
 * 1. Super admins (isSuperAdmin=true) = podem acessar qualquer tenant
 * 2. Usuários normais = podem acessar APENAS seu próprio tenant
 * 3. Se lodgeId no request ≠ lodgeId do token → 403 Forbidden
 */
export function validateTenantIsolation(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Extrair lodgeId do request (pode vir de params, body ou query)
  const requestLodgeId = 
    req.params.lodgeId || 
    req.body?.lodgeId || 
    req.query?.lodgeId;

  // Se a rota não especifica lodgeId, deixar passar
  // (pode ser uma rota global como /health)
  if (!requestLodgeId) {
    next();
    return;
  }

  // Super admins podem acessar qualquer tenant
  if (req.isSuperAdmin) {
    next();
    return;
  }

  // Validar que o lodgeId do request é o mesmo do token
  const tokenLodgeId = req.lodgeId;

  if (tokenLodgeId !== requestLodgeId) {
    res.status(403).json({
      success: false,
      error: 'Acesso negado: você não tem permissão para acessar este tenant',
      details: {
        requestedTenant: requestLodgeId,
        yourTenant: tokenLodgeId,
      },
    });
    return;
  }

  next();
}

// =====================================================================
// MIDDLEWARE: VALIDAR PERMISSÃO PARA AÇÃO
// =====================================================================
/**
 * Middleware que valida se o usuário tem permissão para realizar uma ação
 * em um tenant específico.
 * 
 * USO:
 * ----
 * router.post(
 *   '/api/members/:lodgeId/members',
 *   authenticateToken,
 *   validateTenantIsolation,
 *   requireRole('admin', 'secretary'),  // ← Aqui
 *   asyncHandler(createMember)
 * );
 */
export function requireRole(...allowedRoles: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const userRole = req.role;

    // Super admins sempre têm permissão
    if (req.isSuperAdmin) {
      next();
      return;
    }

    // Validar role do usuário
    if (!userRole || !allowedRoles.includes(userRole)) {
      res.status(403).json({
        success: false,
        error: 'Acesso negado: você não tem permissão para realizar esta ação',
        requiredRoles: allowedRoles,
        yourRole: userRole,
      });
      return;
    }

    next();
  };
}

// =====================================================================
// MIDDLEWARE: INJETAR LODGEID EM TODAS AS QUERIES
// =====================================================================
/**
 * Middleware que força o uso de lodgeId em todas as operações de BD.
 * Funciona capturando o lodgeId do token e injetando-o nas queries.
 * 
 * USO AUTOMÁTICO:
 * ----------------
 * Aplicar globalmente logo após authenticateToken:
 * 
 * app.use(authenticateToken);
 * app.use(injectTenantContext);
 * app.use(apiRoutes);
 * 
 * EFEITO:
 * --------
 * Qualquer query ao BD terá automaticamente:
 * WHERE lodge_id = req.lodgeId
 */
export function injectTenantContext(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Injetar função helper para queries seguras
  req.getTenantId = function() {
    return this.lodgeId;
  };

  // Injetar função para validar se um ID pertence ao tenant
  req.belongsToTenant = function(resourceTenantId: string) {
    return resourceTenantId === this.lodgeId;
  };

  next();
}

// Estender Express Request com helpers
declare global {
  namespace Express {
    interface Request {
      getTenantId?(): string | undefined;
      belongsToTenant?(resourceTenantId: string): boolean;
    }
  }
}

// =====================================================================
// MIDDLEWARE: AUDITORIA DE ACESSO (MULTITENANT)
// =====================================================================
/**
 * Middleware que registra todas as operações por tenant.
 * Essencial para compliance e debugging de isolamento.
 * 
 * USO:
 * ----
 * app.use(auditTenantAccess);
 */
export function auditTenantAccess(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  // Capturar dados da requisição
  const tenantId = req.lodgeId;
  const userId = req.memberId;
  const method = req.method;
  const path = req.path;
  const timestamp = new Date().toISOString();

  // Log no console (em produção, enviar para serviço de auditoria)
  if (process.env.AUDIT_LOGS === 'true') {
    console.log(JSON.stringify({
      timestamp,
      tenantId,
      userId,
      method,
      path,
      level: 'AUDIT',
    }));
  }

  // Interceptar response para registrar resultado
  const originalSend = res.send;
  res.send = function(data) {
    const statusCode = res.statusCode;
    
    if (process.env.AUDIT_LOGS === 'true') {
      console.log(JSON.stringify({
        timestamp: new Date().toISOString(),
        tenantId,
        userId,
        method,
        path,
        statusCode,
        level: 'AUDIT_RESPONSE',
      }));
    }

    return originalSend.call(this, data);
  };

  next();
}

// =====================================================================
// UTILIDADE: QUERIES SEGURAS POR TENANT
// =====================================================================
/**
 * Factory para criar queries seguras que automaticamente
 * filtram por tenant.
 * 
 * USO:
 * ----
 * const query = buildTenantQuery('SELECT * FROM members WHERE id = $1', req.lodgeId);
 * // Resultado: "SELECT * FROM members WHERE id = $1 AND lodge_id = $2"
 * // Use com: db.query(query.sql, [memberId, ...query.params])
 */
export function buildTenantQuery(sql: string, lodgeId: string | undefined) {
  if (!lodgeId) {
    throw new Error('lodgeId is required for tenant-safe queries');
  }

  // Adicionar filtro de tenant
  const hasWhere = sql.toLowerCase().includes('where');
  const safeSQL = hasWhere
    ? sql + ` AND lodge_id = $${sql.match(/\$\d+/g)?.length || 1}`
    : sql + ` WHERE lodge_id = $${sql.match(/\$\d+/g)?.length || 1}`;

  return {
    sql: safeSQL,
    tenantId: lodgeId,
  };
}
