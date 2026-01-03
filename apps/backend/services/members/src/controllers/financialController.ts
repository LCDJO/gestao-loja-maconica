import { Request, Response } from 'express';
import { findMemberById } from '../database';
import { ApiResponse } from '../types';

interface FinancialSummary {
  balance: number;
  totalIncome: number;
  totalExpense: number;
  lastUpdated: string;
}

interface Transaction {
  id: string;
  date: string;
  type: 'receita' | 'despesa';
  category: string;
  description: string;
  amount: number;
}

// Simulated financial data
const financialData: Map<string, FinancialSummary> = new Map();
const transactions: Map<string, Transaction[]> = new Map();

// Seed financial data
function seedFinancialData() {
  // Usar um ID padrão para testes - será atualizado quando conectar com banco de dados real
  const defaultMemberId = 'test-member-id';
  
  financialData.set(defaultMemberId, {
    balance: 1250.75,
    totalIncome: 5000.00,
    totalExpense: 3749.25,
    lastUpdated: new Date().toISOString(),
  });

  transactions.set(defaultMemberId, [
    {
      id: '1',
      date: '2026-01-01',
      type: 'despesa',
      category: 'mensalidade',
      description: 'Mensalidade janeiro',
      amount: 100.00,
    },
    {
      id: '2',
      date: '2025-12-20',
      type: 'receita',
      category: 'tronco',
      description: 'Doação tronco',
      amount: 500.00,
    },
    {
      id: '3',
      date: '2025-12-15',
      type: 'despesa',
      category: 'agape',
      description: 'Ágape fraternal',
      amount: 150.00,
    },
  ]);
}

seedFinancialData();

export async function getBalance(
  req: Request,
  res: Response<ApiResponse<FinancialSummary>>
): Promise<void> {
  try {
    if (!req.memberId) {
      res.status(401).json({
        success: false,
        error: 'Membro não autenticado',
      });
      return;
    }

    const member = findMemberById(req.memberId);
    if (!member) {
      res.status(404).json({
        success: false,
        error: 'Membro não encontrado',
      });
      return;
    }

    const balance = financialData.get(req.memberId) || {
      balance: 0,
      totalIncome: 0,
      totalExpense: 0,
      lastUpdated: new Date().toISOString(),
    };

    res.json({
      success: true,
      message: 'Saldo carregado com sucesso',
      data: balance,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao obter saldo',
    });
  }
}

export async function getTransactions(
  req: Request,
  res: Response<ApiResponse<{ transactions: Transaction[]; total: number }>>
): Promise<void> {
  try {
    if (!req.memberId) {
      res.status(401).json({
        success: false,
        error: 'Membro não autenticado',
      });
      return;
    }

    const member = findMemberById(req.memberId);
    if (!member) {
      res.status(404).json({
        success: false,
        error: 'Membro não encontrado',
      });
      return;
    }

    const memberTransactions = transactions.get(req.memberId) || [];
    const limit = parseInt(req.query.limit as string) || 10;
    const offset = parseInt(req.query.offset as string) || 0;

    const paginated = memberTransactions.slice(offset, offset + limit);

    res.json({
      success: true,
      message: 'Transações carregadas com sucesso',
      data: {
        transactions: paginated,
        total: memberTransactions.length,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao obter transações',
    });
  }
}

export async function addTransaction(
  req: Request,
  res: Response<ApiResponse<Transaction>>
): Promise<void> {
  try {
    if (!req.memberId) {
      res.status(401).json({
        success: false,
        error: 'Membro não autenticado',
      });
      return;
    }

    const { type, category, description, amount, date } = req.body;

    if (!type || !category || !description || !amount) {
      res.status(400).json({
        success: false,
        error: 'Dados incompletos',
      });
      return;
    }

    const transaction: Transaction = {
      id: Date.now().toString(),
      date: date || new Date().toISOString().split('T')[0],
      type,
      category,
      description,
      amount,
    };

    if (!transactions.has(req.memberId)) {
      transactions.set(req.memberId, []);
    }

    transactions.get(req.memberId)!.unshift(transaction);

    // Atualizar saldo
    const currentBalance = financialData.get(req.memberId);
    if (currentBalance) {
      if (type === 'receita') {
        currentBalance.balance += amount;
        currentBalance.totalIncome += amount;
      } else {
        currentBalance.balance -= amount;
        currentBalance.totalExpense += amount;
      }
      currentBalance.lastUpdated = new Date().toISOString();
    }

    res.status(201).json({
      success: true,
      message: 'Transação criada com sucesso',
      data: transaction,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Erro ao criar transação',
    });
  }
}
