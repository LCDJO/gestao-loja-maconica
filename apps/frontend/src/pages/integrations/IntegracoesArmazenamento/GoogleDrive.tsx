import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Database, Settings, ExternalLink, CheckCircle2 } from "lucide-react";

export default function GoogleDriveIntegracao() {
  const [enabled, setEnabled] = useState(false);
  const [clientId, setClientId] = useState("");
  const [clientSecret, setClientSecret] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      // TODO: Implementar fluxo OAuth2 do Google Drive
      console.log("Conectando Google Drive...");
      setEnabled(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Google Drive</h1>
        <p className="text-muted-foreground">Armazene e organize documentos na nuvem com Google Drive</p>
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
                <Database className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="font-medium">Google Drive</p>
                  <p className="text-sm text-muted-foreground">Armazenamento em nuvem</p>
                </div>
              </div>
              <Switch checked={enabled} onCheckedChange={setEnabled} />
            </div>
          </CardContent>
        </Card>

        {/* Credenciais */}
        <Card>
          <CardHeader>
            <CardTitle>Credenciais OAuth 2.0</CardTitle>
            <CardDescription>Configure suas credenciais do Google</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Client ID</label>
              <input
                type="text"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Seu Client ID"
                className="w-full px-3 py-2 border rounded-md mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Client Secret</label>
              <input
                type="password"
                value={clientSecret}
                onChange={(e) => setClientSecret(e.target.value)}
                placeholder="Seu Client Secret"
                className="w-full px-3 py-2 border rounded-md mt-1"
              />
            </div>
            <Button onClick={handleConnect} disabled={loading} className="w-full">
              {loading ? "Conectando..." : "Autorizar com Google"}
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
              <span className="text-sm font-medium">Upload de Arquivos</span>
              <Badge variant="outline">Disponível</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Organização em Pastas</span>
              <Badge variant="outline">Disponível</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Compartilhamento</span>
              <Badge variant="outline">Disponível</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Versionamento</span>
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
                <p className="text-sm text-muted-foreground">Consulte a documentação do Google Drive API</p>
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
