import { Calendar } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Cronograma() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Calendar className="h-8 w-8 text-blue-600" />
              Cronograma de Eventos
            </h1>
            <p className="text-gray-600 mt-1">Gerencie e acompanhe o cronograma de eventos e atividades da loja maçônica</p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="p-8">
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-blue-50 rounded-full">
              <Calendar className="h-12 w-12 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Cronograma em Desenvolvimento</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Este módulo está sendo desenvolvido para gerenciar e visualizar o cronograma de eventos, 
              atividades e datas importantes da loja maçônica.
            </p>
            <div className="pt-4">
              <p className="text-sm text-gray-500">Recursos planejados:</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>✓ Calendário interativo com visualização mensal</li>
                <li>✓ Gerenciamento de eventos e atividades</li>
                <li>✓ Notificações de eventos próximos</li>
                <li>✓ Exportação de cronograma</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
