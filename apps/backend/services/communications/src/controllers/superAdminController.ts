/**
 * Controladores para endpoints Super-Admin - Communications Service (Fase 3)
 * Fornecem acesso global a campanhas e logs de mensagens de TODAS as lojas
 */

import { Request, Response } from 'express';

interface Campaign {
  id: string;
  lodgeId: string;
  name: string;
  type: 'email' | 'push' | 'whatsapp';
  status: 'active' | 'completed' | 'draft';
  createdAt: string;
}

interface MessageLog {
  id: string;
  lodgeId: string;
  type: 'email' | 'push' | 'whatsapp';
  recipient: string;
  status: 'sent' | 'failed' | 'pending';
  timestamp: string;
}

// Simulated data
const globalCampaigns: Campaign[] = [
  {
    id: 'camp-1',
    lodgeId: 'lodge-1',
    name: 'Convocação janeiro',
    type: 'email',
    status: 'active',
    createdAt: '2026-01-01',
  },
  {
    id: 'camp-2',
    lodgeId: 'lodge-2',
    name: 'Aviso ágape',
    type: 'whatsapp',
    status: 'active',
    createdAt: '2026-01-02',
  },
];

const globalMessageLogs: MessageLog[] = [
  {
    id: 'msg-1',
    lodgeId: 'lodge-1',
    type: 'email',
    recipient: 'member@masonica.org',
    status: 'sent',
    timestamp: '2026-01-03T10:00:00Z',
  },
  {
    id: 'msg-2',
    lodgeId: 'lodge-2',
    type: 'whatsapp',
    recipient: '+5585988776655',
    status: 'sent',
    timestamp: '2026-01-03T11:30:00Z',
  },
];

/**
 * GET /api/communications/super-admin/all-campaigns
 * Retorna TODAS as campanhas de TODAS as lojas
 */
export async function getAllCampaignsSuperAdmin(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (req.user?.type !== "SUPER_ADMIN") {
      res.status(403).json({
        success: false,
        error: "Acesso restrito a Super-Admin",
      });
      return;
    }

    const activeCampaigns = globalCampaigns.filter(c => c.status === 'active').length;
    const completedCampaigns = globalCampaigns.filter(c => c.status === 'completed').length;

    res.json({
      success: true,
      message: "Todas as campanhas obtidas com sucesso",
      data: {
        totalCampaigns: globalCampaigns.length,
        activeCampaigns,
        completedCampaigns,
        totalLojas: new Set(globalCampaigns.map(c => c.lodgeId)).size,
        campaigns: globalCampaigns,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao obter campanhas globais",
    });
  }
}

/**
 * GET /api/communications/super-admin/message-logs
 * Retorna log de TODAS as mensagens enviadas
 */
export async function getAllMessageLogsSuperAdmin(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (req.user?.type !== "SUPER_ADMIN") {
      res.status(403).json({
        success: false,
        error: "Acesso restrito a Super-Admin",
      });
      return;
    }

    const sentMessages = globalMessageLogs.filter(m => m.status === 'sent').length;
    const failedMessages = globalMessageLogs.filter(m => m.status === 'failed').length;
    const pendingMessages = globalMessageLogs.filter(m => m.status === 'pending').length;

    res.json({
      success: true,
      message: "Log de mensagens obtido com sucesso",
      data: {
        totalMessages: globalMessageLogs.length,
        sentMessages,
        failedMessages,
        pendingMessages,
        successRate: globalMessageLogs.length > 0
          ? ((sentMessages / globalMessageLogs.length) * 100).toFixed(2)
          : 0,
        logs: globalMessageLogs,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao obter log de mensagens",
    });
  }
}

/**
 * GET /api/communications/super-admin/by-lodge/:lodgeId
 * Retorna campanhas e mensagens de uma loja específica
 */
export async function getCommunicationsByLodgeSuperAdmin(
  req: Request,
  res: Response
): Promise<void> {
  try {
    if (req.user?.type !== "SUPER_ADMIN") {
      res.status(403).json({
        success: false,
        error: "Acesso restrito a Super-Admin",
      });
      return;
    }

    const { lodgeId } = req.params;

    if (!lodgeId) {
      res.status(400).json({
        success: false,
        error: "lodgeId é obrigatório",
      });
      return;
    }

    const lodgeCampaigns = globalCampaigns.filter(c => c.lodgeId === lodgeId);
    const lodgeMessages = globalMessageLogs.filter(m => m.lodgeId === lodgeId);

    res.json({
      success: true,
      message: `Comunicações da loja ${lodgeId} obtidas com sucesso`,
      data: {
        lodgeId,
        totalCampaigns: lodgeCampaigns.length,
        totalMessages: lodgeMessages.length,
        successRate: lodgeMessages.length > 0
          ? ((lodgeMessages.filter(m => m.status === 'sent').length / lodgeMessages.length) * 100).toFixed(2)
          : 0,
        campaigns: lodgeCampaigns,
        messages: lodgeMessages,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao obter comunicações da loja",
    });
  }
}
