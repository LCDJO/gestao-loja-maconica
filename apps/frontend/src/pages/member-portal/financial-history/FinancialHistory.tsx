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
      <div className="space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Histórico Financeiro
            </h1>
            <p className="text-gray-600 mt-1">
              Acompanhe suas transações e saldo
            </p>
          </div>
          <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Download className="w-4 h-4" />
            Exportar
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Saldo Atual */}
          <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <p className="text-blue-100">Saldo Atual</p>
            <p className="text-3xl font-bold mt-2">R$ --,--</p>
            <p className="text-sm text-blue-200 mt-1">Atualizado hoje</p>
          </Card>

          {/* Entradas */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Entradas</p>
                <p className="text-2xl font-bold text-green-600 mt-2">
                  R$ {totalIncome.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <ArrowDownLeft className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Saídas */}
          <Card className="p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-sm font-medium">Saídas</p>
                <p className="text-2xl font-bold text-red-600 mt-2">
                  R$ {totalExpense.toFixed(2)}
                </p>
              </div>
              <div className="p-3 bg-red-100 rounded-lg">
                <ArrowUpRight className="w-6 h-6 text-red-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Filter & List */}
        <Card className="p-6">
          {/* Filter Bar */}
          <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-200">
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="w-4 h-4" />
              Filtros
            </Button>
            <input
              type="search"
              placeholder="Buscar transação..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Transaction List */}
          <div className="space-y-3">
            {transactions.length > 0 ? (
              transactions.map((transaction) => (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div
                      className={`p-3 rounded-lg ${
                        transaction.type === "income"
                          ? "bg-green-100"
                          : "bg-red-100"
                      }`}
                    >
                      {transaction.type === "income" ? (
                        <ArrowDownLeft
                          className={`w-5 h-5 ${
                            transaction.type === "income"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        />
                      ) : (
                        <ArrowUpRight className="w-5 h-5 text-red-600" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-gray-900">
                        {transaction.description}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(transaction.date).toLocaleDateString(
                          "pt-BR"
                        )}{" "}
                        • {transaction.category}
                      </p>
                    </div>
                  </div>
                  <p
                    className={`text-lg font-bold ${
                      transaction.type === "income"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {transaction.type === "income" ? "+" : "-"}R${" "}
                    {transaction.amount.toFixed(2)}
                  </p>
                </div>
              ))
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500">
                  Nenhuma transação encontrada
                </p>
              </div>
            )}
          </div>
        </Card>
      </div>
    </MemberPortalLayout>
  );
}
