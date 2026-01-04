/**
 * Helper para validação de acesso baseado em lodgeId
 * Padrão reutilizável para todos os serviços
 */

import { Request, Response } from "express";

/**
 * Validar que um admin está tentando acessar dados da sua própria loja
 * SEMPRE usar antes de retornar dados filtrados por loja
 * 
 * @param req Express Request (deve ter req.lodgeId do token)
 * @param requestedLodgeId O lodgeId que o admin está tentando acessar
 * @returns boolean - true se acesso permitido, false caso contrário
 * 
 * @example
 * // Em um endpoint admin
 * router.get("/admin/members/:lodgeId", authenticateAdmin, asyncHandler(async (req, res) => {
 *   const { lodgeId } = req.params;
 *   
 *   // ✅ SEMPRE validar
 *   if (!validateAdminLodgeAccess(req, lodgeId)) {
 *     res.status(403).json({
 *       success: false,
 *       error: "Você não tem permissão para acessar dados de outra loja"
 *     });
 *     return;
 *   }
 *   
 *   // Agora é seguro usar o lodgeId
 *   const members = await db.members.findMany({
 *     where: { lodgeId: req.lodgeId }  // ✅ Usar do token, não do request
 *   });
 * }));
 */
export function validateAdminLodgeAccess(req: Request, requestedLodgeId: string): boolean {
  // Verificar que o request tem lodgeId do token
  if (!req.lodgeId) {
    return false;
  }
  
  // Verificar que o admin está tentando acessar SUA loja
  if (req.lodgeId !== requestedLodgeId) {
    return false;
  }
  
  return true;
}

/**
 * Resposta padrão para erro de acesso negado
 */
export function deniedAccessResponse(res: Response): void {
  res.status(403).json({
    success: false,
    error: "Você não tem permissão para acessar dados de outra loja"
  });
}

/**
 * Resposta padrão para recurso não encontrado
 */
export function notFoundResponse(res: Response, resource: string = "Recurso"): void {
  res.status(404).json({
    success: false,
    error: `${resource} não encontrado`
  });
}

/**
 * Validar que um super-admin está acessando (req.user.type === "SUPER_ADMIN")
 * Usado como dupla verificação em endpoints super-admin
 */
export function isSuperAdmin(req: Request): boolean {
  return req.user?.type === "SUPER_ADMIN";
}

/**
 * Validar que um admin está acessando (req.user.type === "ADMIN")
 * Usado como dupla verificação em endpoints admin
 */
export function isAdmin(req: Request): boolean {
  return req.user?.type === "ADMIN" && !!req.lodgeId;
}

/**
 * Extrair lodgeId seguro do token
 * NUNCA extrair de req.params ou req.query
 */
export function getSafeLodgeId(req: Request): string | null {
  // lodgeId é setado pelo middleware authenticateAdmin
  return req.lodgeId || null;
}
