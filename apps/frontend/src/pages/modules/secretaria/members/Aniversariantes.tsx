import { Gift } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function Aniversariantes() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Gift className="h-8 w-8 text-pink-600" />
              Aniversariantes
            </h1>
            <p className="text-gray-600 mt-1">Visualize os aniversariantes da loja maçônica</p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="p-8">
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-pink-50 rounded-full">
              <Gift className="h-12 w-12 text-pink-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Aniversariantes em Desenvolvimento</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Este módulo está sendo desenvolvido para listar e gerenciar os aniversariantes da loja.
            </p>
            <div className="pt-4">
              <p className="text-sm text-gray-500">Recursos planejados:</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>✓ Lista de aniversariantes por mês</li>
                <li>✓ Envio automático de felicitações</li>
                <li>✓ Histórico de celebrações</li>
                <li>✓ Integração com calendário</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
