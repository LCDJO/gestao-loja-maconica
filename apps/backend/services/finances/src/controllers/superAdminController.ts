/**
 * Controladores para endpoints Super-Admin - Finances Service (Fase 3)
 * Fornecem acesso global a dados financeiros de TODAS as lojas
 */

import { Request, Response } from 'express';

interface Transaction {
  id: string;
  lodgeId: string;
  amount: number;
  type: 'income' | 'expense';
  description: string;
  date: string;
}

interface FinancialReport {
  totalTransactions: number;
  totalLojas: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactions: Transaction[];
}

// Simulated data
const globalTransactions: Transaction[] = [
  {
    id: 'txn-1',
    lodgeId: 'lodge-1',
    amount: 500,
    type: 'income',
    description: 'Mensalidade janeiro',
    date: '2026-01-01',
  },
  {
    id: 'txn-2',
    lodgeId: 'lodge-2',
    amount: 750,
    type: 'income',
    description: 'Tronco fraternal',
    date: '2026-01-02',
  },
  {
    id: 'txn-3',
    lodgeId: 'lodge-1',
    amount: 200,
    type: 'expense',
    description: 'Ágape',
    date: '2026-01-03',
  },
];

/**
 * GET /api/finances/super-admin/all-transactions
 * Retorna TODAS as transações de TODAS as lojas
 */
export async function getAllTransactionsSuperAdmin(
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

    const totalIncome = globalTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = globalTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      success: true,
      message: "Todas as transações obtidas com sucesso",
      data: {
        totalTransactions: globalTransactions.length,
        totalLojas: new Set(globalTransactions.map(t => t.lodgeId)).size,
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        transactions: globalTransactions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao obter transações globais",
    });
  }
}

/**
 * GET /api/finances/super-admin/by-lodge/:lodgeId
 * Retorna transações de uma loja específica
 * Super-Admin pode acessar dados de qualquer loja
 */
export async function getTransactionsByLodgeSuperAdmin(
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

    const lodgeTransactions = globalTransactions.filter(t => t.lodgeId === lodgeId);

    const totalIncome = lodgeTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = lodgeTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({
      success: true,
      message: `Transações da loja ${lodgeId} obtidas com sucesso`,
      data: {
        lodgeId,
        totalTransactions: lodgeTransactions.length,
        totalIncome,
        totalExpense,
        balance: totalIncome - totalExpense,
        transactions: lodgeTransactions,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao obter transações da loja",
    });
  }
}

/**
 * GET /api/finances/super-admin/financial-report
 * Relatório financeiro consolidado de todas as lojas
 */
interface FinancialReportData {
  totalTransactions: number;
  totalLojas: number;
  totalIncome: number;
  totalExpense: number;
  balance: number;
  transactionsPerLodge: Record<string, number>;
  avgTransactionValue: number;
}

export async function getFinancialReportSuperAdmin(
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

    const totalIncome = globalTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = globalTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const transactionsPerLodge: Record<string, number> = {};
    globalTransactions.forEach(t => {
      transactionsPerLodge[t.lodgeId] = (transactionsPerLodge[t.lodgeId] || 0) + 1;
    });

    const avgTransactionValue = globalTransactions.length > 0
      ? globalTransactions.reduce((sum, t) => sum + t.amount, 0) / globalTransactions.length
      : 0;

    const data: FinancialReportData = {
      totalTransactions: globalTransactions.length,
      totalLojas: Object.keys(transactionsPerLodge).length,
      totalIncome,
      totalExpense,
      balance: totalIncome - totalExpense,
      transactionsPerLodge,
      avgTransactionValue,
    };

    res.json({
      success: true,
      message: "Relatório financeiro gerado com sucesso",
      data,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: "Erro ao gerar relatório financeiro",
    });
  }
}
