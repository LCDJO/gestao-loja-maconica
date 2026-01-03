import { Users } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function ComissoesList() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Users className="h-8 w-8 text-green-600" />
              Comissões
            </h1>
            <p className="text-gray-600 mt-1">Gerencie as comissões e órgãos da loja maçônica</p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="p-8">
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-green-50 rounded-full">
              <Users className="h-12 w-12 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Comissões em Desenvolvimento</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Este módulo está sendo desenvolvido para gerenciar comissões e órgãos.
            </p>
            <div className="pt-4">
              <p className="text-sm text-gray-500">Recursos planejados:</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>✓ Lista de comissões ativas</li>
                <li>✓ Membros das comissões</li>
                <li>✓ Estrutura hierárquica</li>
                <li>✓ Gestão de cargos</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
