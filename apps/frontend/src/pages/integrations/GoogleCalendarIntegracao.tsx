import DashboardLayout from "@/components/layout/DashboardLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Calendar, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { realtimeNotificationStore } from "@/lib/store";

export default function GoogleCalendarIntegracao() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [calendarEmail, setCalendarEmail] = useState('');
  const [autoSync, setAutoSync] = useState(true);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const handleConnect = async () => {
    setIsLoading(true);
    // Simular conexao com Google Calendar
    setTimeout(() => {
      setIsConnected(true);
      setLastSync(new Date().toLocaleString('pt-BR'));
      // Enviar notificacao em tempo real
      realtimeNotificationStore.add({
        type: 'sistema',
        title: 'Google Calendar Conectado',
        message: 'Sua conta do Google Calendar foi conectada com sucesso',
        actionUrl: '/google-calendar'
      });
      toast.success("Conectado ao Google Calendar com sucesso!");
      setIsLoading(false);
    }, 2000);
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setCalendarEmail('');
    setLastSync(null);
    toast.success("Desconectado do Google Calendar");
  };

  const handleSync = async () => {
    setIsLoading(true);
    // Simular sincronizacao
    setTimeout(() => {
      setLastSync(new Date().toLocaleString('pt-BR'));
      // Enviar notificacao em tempo real
      realtimeNotificationStore.add({
        type: 'reuniao',
        title: 'Reunioes Sincronizadas',
        message: '3 reunioes foram sincronizadas com sucesso ao Google Calendar',
        actionUrl: '/google-calendar'
      });
      toast.success("Sincronizacao concluida! 3 reunioes foram adicionadas ao seu calendario.");
      setIsLoading(false);
    }, 2000);
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">Google Calendar</h1>
          <p className="text-muted-foreground font-serif italic">Sincronize suas reuniões com o Google Calendar.</p>
        </div>

        {/* Status de Conexão */}
        <Card className={isConnected ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {isConnected ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-600" /> Conectado
                </>
              ) : (
                <>
                  <AlertCircle className="h-5 w-5 text-yellow-600" /> Não Conectado
                </>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isConnected ? (
              <div className="space-y-2">
                <p className="text-sm">Email: <strong>{calendarEmail}</strong></p>
                {lastSync && <p className="text-sm">Última sincronização: {lastSync}</p>}
              </div>
            ) : (
              <p className="text-sm">Conecte sua conta do Google para sincronizar automaticamente as reuniões.</p>
            )}
          </CardContent>
        </Card>

        {/* Configurações */}
        <Card>
          <CardHeader>
            <CardTitle>Configurações de Sincronização</CardTitle>
            <CardDescription>Personalize como suas reuniões serão sincronizadas.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {!isConnected ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Email da Conta Google</Label>
                  <Input
                    type="email"
                    placeholder="seu.email@gmail.com"
                    value={calendarEmail}
                    onChange={e => setCalendarEmail(e.target.value)}
                  />
                </div>
                <Button
                  onClick={handleConnect}
                  disabled={!calendarEmail || isLoading}
                  className="w-full"
                >
                  {isLoading ? (
                    <>
                      <Loader className="h-4 w-4 mr-2 animate-spin" />
                      Conectando...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Conectar ao Google Calendar
                    </>
                  )}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Sincronização Automática</Label>
                    <p className="text-sm text-muted-foreground">Sincronizar reuniões automaticamente a cada 6 horas</p>
                  </div>
                  <Switch checked={autoSync} onCheckedChange={setAutoSync} />
                </div>

                <div className="border-t pt-4 space-y-3">
                  <Button
                    onClick={handleSync}
                    disabled={isLoading}
                    className="w-full"
                    variant="outline"
                  >
                    {isLoading ? (
                      <>
                        <Loader className="h-4 w-4 mr-2 animate-spin" />
                        Sincronizando...
                      </>
                    ) : (
                      <>
                        <Calendar className="h-4 w-4 mr-2" />
                        Sincronizar Agora
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleDisconnect}
                    variant="destructive"
                    className="w-full"
                  >
                    Desconectar
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Informações */}
        <Card>
          <CardHeader>
            <CardTitle>Como Funciona</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
            <p>Ao conectar sua conta do Google Calendar, todas as reuniões cadastradas no sistema serão sincronizadas automaticamente.</p>
            <p>Você pode:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Receber notificações de reuniões próximas</li>
              <li>Visualizar reuniões em seu calendário pessoal</li>
              <li>Compartilhar reuniões com outros membros</li>
              <li>Sincronizar manualmente a qualquer momento</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
