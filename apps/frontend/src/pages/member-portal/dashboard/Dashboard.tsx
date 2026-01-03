import { TrendingUp, Banknote, Calendar, FileText } from "lucide-react";
import { Card } from "@/components/ui/card";
import MemberPortalLayout from "@/components/member-portal/MemberPortalLayout";

export default function MemberDashboard() {
  return (
    <MemberPortalLayout currentPage="dashboard">
      <div className="space-y-6 sm:space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            Bem-vindo ao seu Portal
          </h1>
          <p className="text-gray-600 text-sm sm:text-base mt-1">
            Acompanhe seus dados e informações da loja
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {/* Saldo */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Saldo</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">
                  R$ --,--
                </p>
                <p className="text-xs text-gray-500 mt-1">Atualizado hoje</p>
              </div>
              <div className="p-2 sm:p-3 bg-blue-100 rounded-lg flex-shrink-0">
                <Banknote className="w-5 sm:w-6 h-5 sm:h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          {/* Próxima Sessão */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">
                  Próxima Sessão
                </p>
                <p className="text-lg sm:text-xl font-bold text-gray-900 mt-2">--</p>
                <p className="text-xs text-gray-500 mt-1">
                  Não agendada no momento
                </p>
              </div>
              <div className="p-2 sm:p-3 bg-green-100 rounded-lg flex-shrink-0">
                <Calendar className="w-5 sm:w-6 h-5 sm:h-6 text-green-600" />
              </div>
            </div>
          </Card>

          {/* Documentos Pendentes */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Documentos</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">0</p>
                <p className="text-xs text-gray-500 mt-1">Pendentes de leitura</p>
              </div>
              <div className="p-2 sm:p-3 bg-orange-100 rounded-lg flex-shrink-0">
                <FileText className="w-5 sm:w-6 h-5 sm:h-6 text-orange-600" />
              </div>
            </div>
          </Card>

          {/* Presença */}
          <Card className="p-4 sm:p-6">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-gray-600 text-xs sm:text-sm font-medium">Presença</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-900 mt-2">--</p>
                <p className="text-xs text-gray-500 mt-1">Este ano</p>
              </div>
              <div className="p-2 sm:p-3 bg-purple-100 rounded-lg flex-shrink-0">
                <TrendingUp className="w-5 sm:w-6 h-5 sm:h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Movimentação Financeira Recente */}
          <Card className="lg:col-span-2 p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Movimentação Recente
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-2 sm:py-3 border-b border-gray-100 last:border-0 gap-2"
                >
                  <div>
                    <p className="font-medium text-gray-900 text-sm sm:text-base">--</p>
                    <p className="text-xs text-gray-500">--</p>
                  </div>
                  <p className="font-bold text-gray-900 text-sm sm:text-base">R$ --,--</p>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-blue-600 hover:text-blue-700 font-medium text-sm">
              Ver histórico completo →
            </button>
          </Card>

          {/* Próximos Eventos */}
          <Card className="p-4 sm:p-6">
            <h2 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
              Próximos Eventos
            </h2>
            <div className="space-y-2 sm:space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-2 sm:p-3 bg-blue-50 rounded-lg">
                  <p className="text-xs sm:text-sm font-medium text-blue-900">--</p>
                  <p className="text-xs text-blue-700 mt-0.5 sm:mt-1">--</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </MemberPortalLayout>
  );
}
