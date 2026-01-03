import { Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import DashboardLayout from '@/components/layout/DashboardLayout';

export default function VidaMaconica() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy className="h-8 w-8 text-yellow-600" />
              Vida Maçônica
            </h1>
            <p className="text-gray-600 mt-1">Acompanhe a vida maçônica e registros dos irmãos</p>
          </div>
        </div>

        {/* Main Card */}
        <Card className="p-8">
          <div className="text-center space-y-4">
            <div className="inline-block p-4 bg-yellow-50 rounded-full">
              <Trophy className="h-12 w-12 text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Vida Maçônica em Desenvolvimento</h2>
            <p className="text-gray-600 max-w-md mx-auto">
              Este módulo está sendo desenvolvido para registrar e acompanhar a vida maçônica.
            </p>
            <div className="pt-4">
              <p className="text-sm text-gray-500">Recursos planejados:</p>
              <ul className="mt-3 space-y-2 text-sm text-gray-600">
                <li>✓ Histórico de atividades maçônicas</li>
                <li>✓ Registros de iniciações e graus</li>
                <li>✓ Timeline visual</li>
                <li>✓ Certificados e documentação</li>
              </ul>
            </div>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
