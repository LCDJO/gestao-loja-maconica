import { ArrowUpRight, ArrowDownLeft, Download, Filter } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import MemberPortalLayout from "@/components/member-portal/MemberPortalLayout";

interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  type: "income" | "expense";
}

export default function FinancialHistory() {
  const transactions: Transaction[] = [
    {
      id: "1",
      date: "2025-12-15",
      description: "Contribuição mensal",
      category: "Mensalidade",
      amount: 100.0,
      type: "expense",
    },
    {
      id: "2",
      date: "2025-11-10",
      description: "Devolução",
      category: "Reembolso",
      amount: 50.0,
      type: "income",
    },
  ];

  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpense = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <MemberPortalLayout currentPage="financial">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
              Histórico Financeiro
            </h1>
            <p className="text-gray-600 text-sm sm:text-base mt-1">
              Acompanhe suas transações e saldo
            </p>
          </div>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 w-full sm:w-auto justify-center">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Saldo Atual */}
          <Card className="p-4 sm:p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <p className="text-blue-100 text-xs sm:text-sm">Saldo Atual</p>
            <p className="text-2xl sm:text-3xl font-bold mt-2">R$ --,--</p>
            <p className="text-xs sm:text-sm text-blue-200 mt-1">Atualizado hoje</p>
          </Card>

          {/* Entradas */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Entradas</p>
                <p className="text-xl sm:text-2xl font-bold text-green-600 mt-2">
                  R$ {totalIncome.toFixed(2)}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
                <ArrowDownLeft className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Saídas */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Saídas</p>
                <p className="text-xl sm:text-2xl font-bold text-red-600 mt-2">
                  R$ {totalExpense.toFixed(2)}
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-red-100 rounded-lg flex-shrink-0">
                <ArrowUpRight className="w-5 sm:w-6 h-5 sm:h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filter & List */}
        <Card className="p-4 sm:p-6">
          {/* Filter Bar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 mb-4 sm:mb-6 pb-4 sm:pb-6 border-b border-gray-200">
            <Button variant="outline" className="flex items-center gap-2 whitespace-nowrap">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
            <input
              type="search"
              placeholder="Buscar transação..."
              className="flex-1 px-3 sm:px-4 py-2 text-sm border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Transaction List */}
          <div className="space-y-2 sm:space-y-3 overflow-x-auto">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-3 sm:p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition gap-3 sm:gap-4"
                >
                  <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                    <div
                      className={`p-2 sm:p-3 rounded-lg flex-shrink-0 ${
                        transaction.type === "income"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowDownLeft
                          className={`w-4 sm:w-5 h-4 sm:h-5 ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        />
                      ) : (
                        <ArrowUpRight className="w-4 sm:w-5 h-4 sm:h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-gray-900 text-sm sm:text-base truncate">
                        {transaction.description}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString(
                          "pt-BR"
                        )}
                      </p>
                    </div>
                  </div>
                  <p className="font-bold text-gray-900 text-sm sm:text-base text-right sm:text-left">
                    R$ {transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 py-4 text-sm">
                Nenhuma transação encontrada
              </p>
            )}
          </div>
        </Card>
      </div>
    </MemberPortalLayout>
  );
}
