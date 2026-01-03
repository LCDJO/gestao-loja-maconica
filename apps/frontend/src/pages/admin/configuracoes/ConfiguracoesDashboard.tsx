import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import DashboardLayout from "@/components/layout/DashboardLayout";
import { Cog, Lock, Database, Eye } from "lucide-react";

export default function ConfiguracoesDashboard() {
  return (
    <DashboardLayout title="Configurações da Loja" subtitle="Sistema, segurança e backup">
      <div className="space-y-8">
        {/* Sections */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Cog className="w-5 h-5" />
                Configurações Gerais
              </CardTitle>
              <CardDescription>Parâmetros e dados da loja</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/admin/configuracoes/geral"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <span>Editar Configurações</span>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Segurança
              </CardTitle>
              <CardDescription>Políticas de acesso e proteção</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/admin/configuracoes/seguranca"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <span>Gerenciar Segurança</span>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Backup & Recuperação
              </CardTitle>
              <CardDescription>Cópias de segurança dos dados</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/admin/configuracoes/backup"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <span>Gerenciar Backups</span>
                </a>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="w-5 h-5" />
                Logs de Auditoria
              </CardTitle>
              <CardDescription>Histórico de ações do sistema</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a
                  href="/admin/configuracoes/auditoria"
                  className="flex items-center gap-2 p-3 rounded border hover:bg-gray-50 transition-colors"
                >
                  <span>Ver Logs</span>
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
