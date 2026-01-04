/**
 * Rotas do Communications Service
 * Inclui endpoints de campanhas e log de mensagens
 */

import { Router } from 'express';
import { authenticateSuperAdmin, authenticateAdmin } from '../../auth/src/middleware/auth';
import {
  getAllCampaignsSuperAdmin,
  getAllMessageLogsSuperAdmin,
  getCommunicationsByLodgeSuperAdmin,
} from './controllers/superAdminController';

// Helper para envolver funções async
const asyncHandler = (fn: any) => (req: any, res: any, next: any) =>
  Promise.resolve(fn(req, res, next)).catch(next);

const router = Router();

// ============= SUPER-ADMIN ENDPOINTS =============
// Apenas Super-Admin pode acessar estes endpoints
// Fornecem visibilidade global de todas as lojas

/**
 * GET /api/communications/super-admin/all-campaigns
 * Retorna TODAS as campanhas de TODAS as lojas
 */
router.get(
  '/super-admin/all-campaigns',
  authenticateSuperAdmin,
  asyncHandler(getAllCampaignsSuperAdmin)
);

/**
 * GET /api/communications/super-admin/message-logs
 * Retorna log de TODAS as mensagens enviadas
 */
router.get(
  '/super-admin/message-logs',
  authenticateSuperAdmin,
  asyncHandler(getAllMessageLogsSuperAdmin)
);

/**
 * GET /api/communications/super-admin/by-lodge/:lodgeId
 * Retorna campanhas e mensagens de uma loja específica
 * Super-Admin pode acessar dados de qualquer loja
 */
router.get(
  '/super-admin/by-lodge/:lodgeId',
  authenticateSuperAdmin,
  asyncHandler(getCommunicationsByLodgeSuperAdmin)
);

// ============= ADMIN ENDPOINTS =============
// Apenas Admin pode acessar dados de SUA loja

/**
 * GET /api/communications/admin/campaigns
 * Retorna campanhas da loja do admin
 * Admin só pode acessar dados de SUA loja
 */
router.get('/admin/campaigns', authenticateAdmin, asyncHandler(async (req, res) => {
  // TODO: Implementar com validação de lodgeId
  // Usar req.lodgeId do token, não do request params
  res.json({
    success: true,
    message: "Endpoint admin/campaigns - em implementação",
    data: [],
  });
}));

/**
 * GET /api/communications/admin/message-logs
 * Retorna log de mensagens da loja do admin
 */
router.get('/admin/message-logs', authenticateAdmin, asyncHandler(async (req, res) => {
  // TODO: Implementar com validação de lodgeId
  res.json({
    success: true,
    message: "Endpoint admin/message-logs - em implementação",
    data: [],
  });
}));

export default router;
