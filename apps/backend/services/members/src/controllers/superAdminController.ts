/**
 * Controladores para endpoints Super-Admin (Fase 3)
 * Fornecem acesso global a dados de TODAS as lojas
 * 
 * IMPORTANTE: SEMPRE usar authenticateSuperAdmin middleware
 */

import { Request, Response } from 'express';
import { ApiResponse } from '../types';
import { membersDatabase } from '../database';

interface MemberSummary {
  id: string;
  email: string;
  name: string;
  lodgeId: string;
  lodgeName: string;
  role: string;
  createdAt: string;
}

interface SuperAdminMembersResponse {
  totalMembers: number;
  totalLojas: number;
  members: MemberSummary[];
}

/**
 * GET /api/members/super-admin/all-members
 * Retorna TODOS os membros de TODAS as lojas
 * Apenas Super-Admin pode acessar
 */
export async function getAllMembersGlobal(
  req: Request,
  res: Response<ApiResponse<SuperAdminMembersResponse>>
): Promise<void> {
  try {
    // Dupla verificação (middleware já validou, mas é good practice)
    if (req.user?.type !== "SUPER_ADMIN") {
      res.status(403).json({
        success: false,
        error: "Acesso restrito a Super-Admin",
      });
      return;
    }

    // Simular fetch de todos os membros
    const allMembers = Array.from(membersDatabase.values()).map(member => ({
      id: member.id,
      email: member.email,
      name: member.name || "Nome não informado",
      lodgeId: member.lodgeId || "global",
      lodgeName: member.lodgeName || "Loja Desconhecida",
      role: member.role || "member",
      createdAt: member.createdAt || new Date().toISOString(),
    }));

    // Contar lojas únicas
    const uniqueLojas = new Set(allMembers.map(m => m.lodgeId));

    res.json({
      success: true,
      message: "Dados de todos os membros obtidos com sucesso",
      data: {
        totalMembers: allMembers.length,
        totalLojas: uniqueLojas.size,
        members: allMembers,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao obter membros globais",
    });
  }
}

/**
 * GET /api/members/super-admin/by-lodge/:lodgeId
 * Retorna membros de uma loja ESPECÍFICA
 * Super-Admin pode acessar dados de qualquer loja
 */
export async function getMembersByLodgeSuperAdmin(
  req: Request,
  res: Response<ApiResponse<MemberSummary[]>>
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

    const members = Array.from(membersDatabase.values())
      .filter(m => m.lodgeId === lodgeId)
      .map(m => ({
        id: m.id,
        email: m.email,
        name: m.name || "Nome não informado",
        lodgeId: m.lodgeId || lodgeId,
        lodgeName: m.lodgeName || "Loja Principal",
        role: m.role || "member",
        createdAt: m.createdAt || new Date().toISOString(),
      }));

    res.json({
      success: true,
      message: `Membros da loja ${lodgeId} obtidos com sucesso`,
      data: members,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao obter membros da loja",
    });
  }
}

/**
 * GET /api/members/super-admin/statistics
 * Estatísticas globais de todas as lojas
 */
interface GlobalStatistics {
  totalMembers: number;
  totalLojas: number;
  membersPerLodge: Record<string, number>;
  totalTransactions: number;
  lastMemberAdded: string | null;
}

export async function getGlobalStatistics(
  req: Request,
  res: Response<ApiResponse<GlobalStatistics>>
): Promise<void> {
  try {
    if (req.user?.type !== "SUPER_ADMIN") {
      res.status(403).json({
        success: false,
        error: "Acesso restrito a Super-Admin",
      });
      return;
    }

    const allMembers = Array.from(membersDatabase.values());
    const membersPerLodge: Record<string, number> = {};
    let lastMemberAdded: string | null = null;

    allMembers.forEach(member => {
      const lodgeId = member.lodgeId || "global";
      membersPerLodge[lodgeId] = (membersPerLodge[lodgeId] || 0) + 1;

      if (!lastMemberAdded || member.createdAt > lastMemberAdded) {
        lastMemberAdded = member.createdAt || new Date().toISOString();
      }
    });

    res.json({
      success: true,
      message: "Estatísticas globais obtidas com sucesso",
      data: {
        totalMembers: allMembers.length,
        totalLojas: Object.keys(membersPerLodge).length,
        membersPerLodge,
        totalTransactions: allMembers.length * 3, // Simulado
        lastMemberAdded,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao obter estatísticas",
    });
  }
}
