import { FileText } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Conciliacao() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <FileText className="h-8 w-8 text-purple-600" />
              Conciliação Bancária
            </h1>
            <p className="text-gray-600 mt-1">Concilie suas contas bancárias com os registros do sistema</p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="p-8">
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-purple-50 rounded-full">
              <FileText className="h-12 w-12 text-purple-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Conciliação em Desenvolvimento</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Este módulo está sendo desenvolvido para gerenciar conciliações bancárias.
            </p>
            <div className="pt-4">
              <p className="text-sm text-gray-500">Recursos planejados:</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>✓ Importação de extratos bancários</li>
                <li>✓ Casamento automático de transações</li>
                <li>✓ Reconciliação manual</li>
                <li>✓ Histórico de conciliações</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
