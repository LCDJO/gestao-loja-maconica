import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, Settings, ExternalLink, CheckCircle2 } from "lucide-react";

export default function OneSignalIntegracao() {
  const [enabled, setEnabled] = useState(false);
  const [apiKey, setApiKey] = useState("");
  const [appId, setAppId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      // TODO: Implementar chamada para API de conectar OneSignal
      console.log("Conectando OneSignal...", { apiKey, appId });
      setEnabled(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">OneSignal</h1>
        <p className="text-muted-foreground">Gerencie notificações push com OneSignal</p>
      </div>

      <div className="grid gap-6">
        {/* Status */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Status da Conexão</CardTitle>
                <CardDescription>Verifique o status da integração</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                {enabled ? (
                  <Badge variant="default" className="bg-green-500">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Ativo
                  </Badge>
                ) : (
                  <Badge variant="secondary">Desconectado</Badge>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5" />
                <div>
                  <p className="font-medium">OneSignal</p>
                  <p className="text-sm text-muted-foreground">Serviço de notificações push</p>
                </div>
              </div>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </CardContent>
        </Card>

        {/* Credenciais */}
        <Card>
          <CardHeader>
            <CardTitle>Credenciais</CardTitle>
            <CardDescription>Configure suas credenciais do OneSignal</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">App ID</label>
              <input
                type="text"
                value={appId}
                onChange={(e) => setAppId(e.target.value)}
                placeholder="Seu App ID do OneSignal"
                className="w-full px-3 py-2 border rounded-md mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">API Key</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="Sua API Key do OneSignal"
                className="w-full px-3 py-2 border rounded-md mt-1"
              />
            </div>
            <Button onClick={handleConnect} disabled={loading} className="w-full">
              {loading ? "Conectando..." : "Conectar"}
            </Button>
          </CardContent>
        </Card>

        {/* Recursos */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5" />
              Recursos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Notificações Push</span>
              <Badge variant="outline">Disponível</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Segmentação</span>
              <Badge variant="outline">Disponível</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Analytics</span>
              <Badge variant="outline">Disponível</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Automação</span>
              <Badge variant="outline">Disponível</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Link para documentação */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="font-medium">Precisa de ajuda?</p>
                <p className="text-sm text-muted-foreground">Consulte a documentação do OneSignal</p>
              </div>
              <Button variant="ghost" size="sm">
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
