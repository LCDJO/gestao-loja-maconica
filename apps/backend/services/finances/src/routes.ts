/**
 * Rotas do Finances Service
 * Inclui endpoints de transações e relatórios financeiros
 */

import { Router } from 'express';
import { authenticateSuperAdmin, authenticateAdmin } from '../../auth/src/middleware/auth';
import {
  getAllTransactionsSuperAdmin,
  getTransactionsByLodgeSuperAdmin,
  getFinancialReportSuperAdmin,
} from './controllers/superAdminController';

// Helper para envolver funções async
const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const router = Router();

// ============= SUPER-ADMIN ENDPOINTS =============
// Apenas Super-Admin pode acessar estes endpoints
// Fornecem visibilidade global de todas as lojas

/**
 * GET /api/finances/super-admin/all-transactions
 * Retorna TODAS as transações de TODAS as lojas
 */
router.get(
  '/super-admin/all-transactions',
  authenticateSuperAdmin,
  asyncHandler(getAllTransactionsSuperAdmin)
);

/**
 * GET /api/finances/super-admin/by-lodge/:lodgeId
 * Retorna transações de uma loja específica
 * Super-Admin pode acessar qualquer loja
 */
router.get(
  '/super-admin/by-lodge/:lodgeId',
  authenticateSuperAdmin,
  asyncHandler(getTransactionsByLodgeSuperAdmin)
);

/**
 * GET /api/finances/super-admin/financial-report
 * Relatório financeiro consolidado de todas as lojas
 */
router.get(
  '/super-admin/financial-report',
  authenticateSuperAdmin,
  asyncHandler(getFinancialReportSuperAdmin)
);

// ============= ADMIN ENDPOINTS =============
// Apenas Admin pode acessar dados de SUA loja

// Placeholders para implementação futura
// Estes devem ser implementados com validação de lodgeId

/**
 * GET /api/finances/admin/transactions
 * Retorna transações da loja do admin
 * Admin só pode acessar dados de SUA loja
 */
router.get('/admin/transactions', authenticateAdmin, asyncHandler(async (req, res) => {
  // TODO: Implementar com validação de lodgeId
  // Usar req.lodgeId do token, não do request params
  res.json({
    success: true,
    message: "Endpoint admin/transactions - em implementação",
    data: [],
  });
}));

export default router;
