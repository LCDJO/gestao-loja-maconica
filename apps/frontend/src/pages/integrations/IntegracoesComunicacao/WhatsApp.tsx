import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { MessageCircle, Settings, ExternalLink, CheckCircle2 } from "lucide-react";

export default function WhatsAppIntegracao() {
  const [enabled, setEnabled] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [accessToken, setAccessToken] = useState("");
  const [loading, setLoading] = useState(false);

  const handleConnect = async () => {
    setLoading(true);
    try {
      // TODO: Implementar chamada para API de conectar WhatsApp
      console.log("Conectando WhatsApp...", { phoneNumber, accessToken });
      setEnabled(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">WhatsApp</h1>
        <p className="text-muted-foreground">Integre WhatsApp Business para comunicação com membros</p>
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
                <MessageCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="font-medium">WhatsApp Business</p>
                  <p className="text-sm text-muted-foreground">Comunicação via WhatsApp</p>
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
            <CardDescription>Configure suas credenciais do WhatsApp Business</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Número de Telefone</label>
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                placeholder="+55 11 9 9999-9999"
                className="w-full px-3 py-2 border rounded-md mt-1"
              />
            </div>
            <div>
              <label className="text-sm font-medium">Access Token</label>
              <input
                type="password"
                value={accessToken}
                onChange={(e) => setAccessToken(e.target.value)}
                placeholder="Seu access token do WhatsApp"
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
              <span className="text-sm font-medium">Mensagens de Texto</span>
              <Badge variant="outline">Disponível</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Mensagens de Mídia</span>
              <Badge variant="outline">Disponível</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Mensagens Template</span>
              <Badge variant="outline">Disponível</Badge>
            </div>
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <span className="text-sm font-medium">Webhooks</span>
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
                <p className="text-sm text-muted-foreground">Consulte a documentação do WhatsApp Business</p>
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
